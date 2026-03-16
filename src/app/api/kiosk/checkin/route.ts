import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

// Public endpoint — no auth required (patient self check-in)
const checkinSchema = z.object({
  firstName:   z.string().min(1),
  lastName:    z.string().min(1),
  middleName:  z.string().optional().nullable(),
  gender:      z.enum(["Male", "Female", "Other"]).optional().nullable(),
  dob:         z.string().optional().nullable(),  // YYYY-MM-DD
  patientType: z.string().default("OUT-PATIENT"),
  clinicCode:  z.string().min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = checkinSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });

  const { firstName, lastName, middleName, gender, dob, patientType, clinicCode } = parsed.data;
  const fullName = `${lastName.toUpperCase()}, ${firstName}${middleName ? ` ${middleName}` : ""}`.trim();

  try {
    // ── Find or create patient ────────────────────────────────
    let patient = await prisma.patient.findFirst({
      where: {
        FirstName: { equals: firstName, mode: "insensitive" },
        LastName:  { equals: lastName,  mode: "insensitive" },
        IsActive: 1,
      },
      select: { Id: true },
    });

    if (!patient) {
      const maxRow = await prisma.patient.findFirst({ orderBy: { Id: "desc" }, select: { Id: true } });
      const newId  = maxRow ? BigInt(maxRow.Id) + 1n : 1n;
      patient = await prisma.patient.create({
        data: {
          Id:        newId,
          FirstName: firstName,
          LastName:  lastName,
          MiddleName: middleName ?? null,
          FullName:  fullName,
          Gender:    gender ?? null,
          DOB:       dob ? new Date(`${dob}T00:00:00Z`) : new Date("1900-01-01"),
          IsActive:  1,
          InputDate: new Date(),
          InputBy:   "KIOSK",
        },
        select: { Id: true },
      });
    }

    // ── Generate queue code ───────────────────────────────────
    const todayStr = new Date().toLocaleDateString("en-CA");
    const today    = new Date(`${todayStr}T00:00:00+08:00`);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const datePart = todayStr.replace(/-/g, "");

    const [count, queueStatuses] = await Promise.all([
      prisma.queue.count({ where: { Date: { gte: today, lt: tomorrow }, IdBU: clinicCode } }),
      prisma.queuestatus.findMany({ where: { IdBU: { not: 0 } } }),
    ]);

    const seq  = String(count + 1).padStart(4, "0");
    const code = `${clinicCode}${datePart}${seq}`;
    const initialStatus = queueStatuses.length > 0 ? Math.min(...queueStatuses.map(s => s.Id)) : 201;

    // Compute age
    let age: number | null = null;
    if (dob) {
      const birth = new Date(dob);
      const now   = new Date();
      age = now.getFullYear() - birth.getFullYear();
      const mDiff = now.getMonth() - birth.getMonth();
      if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) age -= 1;
    }

    const entry = await prisma.queue.create({
      data: {
        IdBU:           clinicCode,
        Code:           code,
        Date:           today,
        DateTime:       new Date(),
        IdPatient:      BigInt(patient.Id),
        QFullName:      fullName,
        QLastName:      lastName.toUpperCase(),
        QFirstName:     firstName,
        QMiddleName:    middleName ?? null,
        QGender:        gender ?? null,
        QDOB:           dob ? new Date(`${dob}T00:00:00Z`) : null,
        AgePatient:     age,
        Status:         initialStatus,
        AnteDateStatus: 0,
        AccessionNo:    code,
        PatientType:    patientType,
        InputBy:        "KIOSK",
      },
    });

    return NextResponse.json({
      code,
      queueId: Number(entry.Id),
      name:    fullName,
      status:  initialStatus,
    }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create queue entry" }, { status: 500 });
  }
}
