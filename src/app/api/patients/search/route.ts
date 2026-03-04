import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/patients/search?q=<term>&limit=10
 *
 * Searches patients by FullName (fulltext) or exact Code prefix.
 * Returns minimal fields needed for the queue creation modal.
 */
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "queue");

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "10"), 50);

  if (q.length < 2) {
    return NextResponse.json({ data: [] });
  }

  try {
    // Try fulltext search on FullName, fall back to LIKE on Code
    const patients = await prisma.patient.findMany({
      where: {
        IsActive: 1,
        OR: [
          { FullName: { contains: q, mode: "insensitive" } },
          { Code: { contains: q } },
        ],
      },
      select: {
        Id: true,
        Code: true,
        FullName: true,
        LastName: true,
        FirstName: true,
        MiddleName: true,
        Gender: true,
        DOB: true,
      },
      take: limit,
      orderBy: { FullName: "asc" },
    });

    const data = patients.map((p) => ({
      id: Number(p.Id),
      code: p.Code,
      fullName: p.FullName,
      lastName: p.LastName ?? "",
      firstName: p.FirstName,
      middleName: p.MiddleName ?? "",
      gender: p.Gender,
      dob: p.DOB?.toISOString().split("T")[0] ?? null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Patient search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
