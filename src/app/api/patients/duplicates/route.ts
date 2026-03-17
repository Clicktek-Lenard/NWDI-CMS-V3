import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// Simple Levenshtein distance for name similarity
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function nameSimilarity(a: string, b: string): number {
  const na = a.toUpperCase().trim();
  const nb = b.toUpperCase().trim();
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const maxLen = Math.max(na.length, nb.length);
  return 1 - levenshtein(na, nb) / maxLen;
}

const SIMILARITY_THRESHOLD = 0.80; // 80% name similarity

// GET /api/patients/duplicates?firstName=&lastName=&dob=&excludeId=
// Returns patients that may be duplicates of the given name+DOB
// If no params given, returns all auto-detected duplicate pairs
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "settings");

  const { searchParams } = request.nextUrl;
  const firstName = searchParams.get("firstName")?.trim() ?? "";
  const lastName  = searchParams.get("lastName")?.trim() ?? "";
  const dob       = searchParams.get("dob")?.trim() ?? "";
  const excludeId = searchParams.get("excludeId")?.trim() ?? "";

  // --- Mode 1: Check for duplicates of a specific new patient ---
  if (firstName && lastName && dob) {
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      return NextResponse.json({ error: "Invalid DOB format" }, { status: 422 });
    }

    // Get patients with same DOB (exact) and same first letter of last name
    const firstLetter = lastName[0].toUpperCase();
    const candidates = await prisma.patient.findMany({
      where: {
        DOB:      dobDate,
        LastName: { startsWith: firstLetter, mode: "insensitive" },
        Status:   { not: "MERGED" },
        ...(excludeId ? { Id: { not: BigInt(excludeId) } } : {}),
      },
      select: {
        Id:         true,
        Code:       true,
        FullName:   true,
        LastName:   true,
        FirstName:  true,
        MiddleName: true,
        Gender:     true,
        DOB:        true,
        ContactNo:  true,
        PictureLink:true,
      },
    });

    const candidateIds = candidates.map((c) => c.Id);
    const visitCounts1 = await prisma.queue.groupBy({
      by: ["IdPatient"],
      where: { IdPatient: { in: candidateIds }, Status: { not: 650 } },
      _count: { Id: true },
    });
    const visitCountMap1 = new Map(visitCounts1.map((v) => [String(v.IdPatient), v._count.Id]));

    const targetFullName = `${lastName} ${firstName}`.toUpperCase();
    const matches = candidates
      .map((p) => {
        const candidateFullName = `${p.LastName ?? ""} ${p.FirstName ?? ""}`.toUpperCase();
        const score = nameSimilarity(targetFullName, candidateFullName);
        return { patient: p, score };
      })
      .filter(({ score }) => score >= SIMILARITY_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      duplicates: matches.map(({ patient: p, score }) => ({
        id:          Number(p.Id),
        code:        p.Code,
        fullName:    p.FullName,
        lastName:    p.LastName ?? "",
        firstName:   p.FirstName ?? "",
        middleName:  p.MiddleName ?? "",
        gender:      p.Gender ?? "",
        dob:         p.DOB?.toISOString().split("T")[0] ?? null,
        contactNo:   p.ContactNo ?? "",
        pictureLink: p.PictureLink ?? null,
        txCount:     visitCountMap1.get(String(p.Id)) ?? 0,
        score:       Math.round(score * 100),
      })),
    });
  }

  // --- Mode 2: Find all duplicate pairs in the DB ---
  // Two-pass approach with tight limits to avoid blocking the event loop.

  const MAX_PAIRS       = 100;
  const MAX_DOB_GROUPS  = 300; // cap total DOBs scanned
  const MAX_PER_GROUP   = 6;   // skip DOBs with >6 patients (data anomalies / null-placeholder DOBs)

  // Pass 1: find DOBs that have ≥2 active patients (cap at MAX_DOB_GROUPS * 2 to allow JS filtering)
  const dobGroups = await prisma.patient.groupBy({
    by: ["DOB"],
    where: { Status: { notIn: ["Inactive", "MERGED"] } },
    having: { Id: { _count: { gte: 2 } } },
    _count: { Id: true },
    orderBy: { DOB: "asc" },
    take: MAX_DOB_GROUPS * 2,
  });

  // Filter: no null DOB, skip groups that are too large (mass-entry or null-placeholder dates)
  const sharedDobs = dobGroups
    .filter((g) => g.DOB !== null && g._count.Id <= MAX_PER_GROUP)
    .slice(0, MAX_DOB_GROUPS)
    .map((g) => g.DOB as Date);

  if (sharedDobs.length === 0) {
    return NextResponse.json({ pairs: [], total: 0 });
  }

  // Pass 2: fetch only the candidates in those DOB groups
  const candidates = await prisma.patient.findMany({
    where: {
      Status: { notIn: ["Inactive", "MERGED"] },
      DOB:    { in: sharedDobs },
    },
    select: {
      Id:          true,
      Code:        true,
      FullName:    true,
      LastName:    true,
      FirstName:   true,
      MiddleName:  true,
      Gender:      true,
      DOB:         true,
      ContactNo:   true,
      PictureLink: true,
      InputDate:   true,
    },
    orderBy: { InputDate: "asc" },
  });

  const allCandidateIds = candidates.map((c) => c.Id);
  const visitCounts2 = await prisma.queue.groupBy({
    by: ["IdPatient"],
    where: { IdPatient: { in: allCandidateIds }, Status: { not: 650 } },
    _count: { Id: true },
  });
  const visitCountMap2 = new Map(visitCounts2.map((v) => [String(v.IdPatient), v._count.Id]));

  // Group by DOB string and compare within each group
  const byDob = new Map<string, typeof candidates>();
  for (const p of candidates) {
    if (!p.DOB) continue;
    const key = p.DOB.toISOString().split("T")[0];
    if (!byDob.has(key)) byDob.set(key, []);
    byDob.get(key)!.push(p);
  }

  const pairs: Array<{
    patient1: (typeof candidates)[0];
    patient2: (typeof candidates)[0];
    score: number;
  }> = [];

  outer:
  for (const group of byDob.values()) {
    if (group.length < 2) continue;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const nameA = `${group[i].LastName ?? ""} ${group[i].FirstName ?? ""}`.toUpperCase();
        const nameB = `${group[j].LastName ?? ""} ${group[j].FirstName ?? ""}`.toUpperCase();
        const score = nameSimilarity(nameA, nameB);
        if (score >= SIMILARITY_THRESHOLD) {
          pairs.push({ patient1: group[i], patient2: group[j], score });
          if (pairs.length >= MAX_PAIRS * 2) break outer; // early exit
        }
      }
    }
  }

  pairs.sort((a, b) => b.score - a.score);

  const limited = pairs.slice(0, MAX_PAIRS);

  function mapPatient(p: (typeof candidates)[0]) {
    return {
      id:          Number(p.Id),
      code:        p.Code,
      fullName:    p.FullName,
      lastName:    p.LastName ?? "",
      firstName:   p.FirstName ?? "",
      middleName:  p.MiddleName ?? "",
      gender:      p.Gender ?? "",
      dob:         p.DOB?.toISOString().split("T")[0] ?? null,
      contactNo:   p.ContactNo ?? "",
      pictureLink: p.PictureLink ?? null,
      txCount:     visitCountMap2.get(String(p.Id)) ?? 0,
    };
  }

  return NextResponse.json({
    pairs: limited.map(({ patient1, patient2, score }) => ({
      patient1:    mapPatient(patient1),
      patient2:    mapPatient(patient2),
      score:       Math.round(score * 100),
    })),
    total:     pairs.length,
    returned:  limited.length,
  });
}
