import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const updateSchema = z.object({
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

// PATCH /api/patients/[id] — update patient demographics
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const patientId = BigInt(id);

  const patient = await prisma.patient.findUnique({ where: { Id: patientId } });
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const d = parsed.data;
  const fullName = buildFullName(d.lastName, d.firstName, d.middleName);
  const now = new Date();

  try {
    const updated = await prisma.patient.update({
      where: { Id: patientId },
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
        UpdateDate:  now,
        UpdateBy:    session.user.username ?? "system",
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
      id:         Number(updated.Id),
      code:       updated.Code,
      fullName:   updated.FullName,
      lastName:   updated.LastName ?? "",
      firstName:  updated.FirstName ?? "",
      middleName: updated.MiddleName ?? "",
      gender:     updated.Gender ?? "",
      dob:        updated.DOB?.toISOString().split("T")[0] ?? null,
    });
  } catch (error) {
    console.error("Patient update error:", error);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}
