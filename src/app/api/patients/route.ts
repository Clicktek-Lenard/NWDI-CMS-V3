import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

// GET /api/patients?search=&page=1&pageSize=20
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "settings");

  const { searchParams } = request.nextUrl;
  const search   = searchParams.get("search")?.trim() ?? "";
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));
  const skip     = (page - 1) * pageSize;

  const where = search
    ? {
        OR: [
          { FullName:  { contains: search, mode: "insensitive" as const } },
          { LastName:  { contains: search, mode: "insensitive" as const } },
          { FirstName: { contains: search, mode: "insensitive" as const } },
          { Code:      { contains: search, mode: "insensitive" as const } },
        ],
        Status: { not: "Inactive" },
      }
    : { Status: { not: "Inactive" } };

  const [total, patients] = await Promise.all([
    prisma.patient.count({ where }),
    prisma.patient.findMany({
      where,
      orderBy: { FullName: "asc" },
      skip,
      take: pageSize,
      select: {
        Id:         true,
        Code:       true,
        FullName:   true,
        LastName:   true,
        FirstName:  true,
        MiddleName: true,
        Suffix:     true,
        Gender:     true,
        DOB:        true,
        ContactNo:  true,
        Email:      true,
        Address:    true,
        PhilHealth: true,
        SeniorId:   true,
        PWD:        true,
        Status:     true,
        InputDate:  true,
      },
    }),
  ]);

  return NextResponse.json({
    data: patients.map((p) => ({
      id:         Number(p.Id),
      code:       p.Code,
      fullName:   p.FullName,
      lastName:   p.LastName ?? "",
      firstName:  p.FirstName ?? "",
      middleName: p.MiddleName ?? "",
      suffix:     p.Suffix ?? "",
      gender:     p.Gender ?? "",
      dob:        p.DOB?.toISOString().split("T")[0] ?? null,
      contactNo:  p.ContactNo ?? "",
      email:      p.Email ?? "",
      address:    p.Address ?? "",
      philHealth: p.PhilHealth ?? "",
      seniorId:   p.SeniorId ?? "",
      pwd:        p.PWD ?? "",
      status:     p.Status ?? "",
      inputDate:  p.InputDate?.toISOString() ?? null,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

const createSchema = z.object({
  lastName:   z.string().min(1).max(80),
  firstName:  z.string().min(1).max(150),
  middleName: z.string().max(80).optional().default(""),
  suffix:     z.string().max(10).optional().default(""),
  gender:     z.enum(["Male", "Female"]),
  dob:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be YYYY-MM-DD"),
  contactNo:  z.string().max(80).optional().default(""),
  email:      z.string().email().max(200).optional().or(z.literal("")).default(""),
  address:    z.string().max(500).optional().default(""),
  philHealth: z.string().max(50).optional().default(""),
  seniorId:   z.string().max(20).optional().default(""),
  pwd:        z.string().max(30).optional().default(""),
});

function buildFullName(lastName: string, firstName: string, middleName: string) {
  const raw = `${lastName}, ${firstName} ${middleName}`.replace(/ {2,}/g, " ").trim();
  return raw.toUpperCase();
}

// POST /api/patients — create a new patient
export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const d = parsed.data;
  const fullName = buildFullName(d.lastName, d.firstName, d.middleName);
  const now = new Date();

  try {
    const patient = await prisma.patient.create({
      data: {
        FullName:    fullName,
        LastName:    d.lastName.toUpperCase(),
        FirstName:   d.firstName.toUpperCase(),
        MiddleName:  d.middleName.toUpperCase(),
        Suffix:      d.suffix || null,
        Gender:      d.gender,
        DOB:         new Date(d.dob),
        ContactNo:   d.contactNo || null,
        Email:       d.email || null,
        Address:     d.address || null,
        PhilHealth:  d.philHealth || null,
        SeniorId:    d.seniorId || null,
        PWD:         d.pwd || null,
        Status:      "Active",
        IsActive:    1,
        InputDate:   now,
        InputBy:     session.user.username ?? "system",
        UploadDateTime: now,
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
      },
    });

    return NextResponse.json({
      id:         Number(patient.Id),
      code:       patient.Code,
      fullName:   patient.FullName,
      lastName:   patient.LastName ?? "",
      firstName:  patient.FirstName ?? "",
      middleName: patient.MiddleName ?? "",
      gender:     patient.Gender ?? "",
      dob:        patient.DOB?.toISOString().split("T")[0] ?? null,
    }, { status: 201 });
  } catch (error) {
    console.error("Patient create error:", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
