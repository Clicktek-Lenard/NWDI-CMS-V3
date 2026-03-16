import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/appointments/schedule?date=YYYY-MM-DD
 * Returns all queues for the given date grouped by physician.
 * Uses existing queue + transactions data — no new DB table needed.
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "appointments");

  const sp          = request.nextUrl.searchParams;
  const dateParam   = sp.get("date") || new Date().toISOString().slice(0, 10);
  const clinicCode  = session.user.clinicCode || "CEN";

  const start = new Date(`${dateParam}T00:00:00+08:00`);
  const end   = new Date(`${dateParam}T23:59:59+08:00`);

  // 1. Fetch all non-cancelled queues for the date + clinic
  const queues = await prisma.queue.findMany({
    where: {
      IdBU:   clinicCode,
      Date:   { gte: start, lte: end },
      Status: { not: 650 },
    },
    select: {
      Id:       true,
      Code:     true,
      QFullName: true,
      Status:   true,
      DateTime: true,
    },
    orderBy: { DateTime: "asc" },
  });

  if (queues.length === 0) {
    return NextResponse.json({ date: dateParam, clinicCode, doctors: [] });
  }

  const queueIds = queues.map((q) => q.Id);

  // 2. Fetch distinct doctor-per-queue from transactions
  const txRows = await prisma.transactions.findMany({
    where:   { IdQueue: { in: queueIds }, Status: { not: 650 } },
    select:  { IdQueue: true, IdDoctor: true, NameDoctor: true },
    orderBy: { Id: "asc" },
  });

  // Build map: queueId → { doctorId, doctorName }
  const queueDoctorMap = new Map<string, { id: string; name: string }>();
  for (const tx of txRows) {
    const key = String(tx.IdQueue);
    if (!queueDoctorMap.has(key) && tx.IdDoctor) {
      queueDoctorMap.set(key, {
        id:   String(tx.IdDoctor),
        name: tx.NameDoctor ?? "Unknown Physician",
      });
    }
  }

  // 3. Group queues by doctor
  const doctorMap = new Map<string, {
    doctorId:   string;
    doctorName: string;
    queues:     { id: number; code: string; patientName: string; status: number; inputTime: string | null }[];
  }>();

  const UNASSIGNED_KEY = "__unassigned__";

  for (const q of queues) {
    const docEntry = queueDoctorMap.get(String(q.Id));
    const key      = docEntry ? docEntry.id : UNASSIGNED_KEY;
    const name     = docEntry ? docEntry.name : "No Physician";

    if (!doctorMap.has(key)) {
      doctorMap.set(key, { doctorId: key, doctorName: name, queues: [] });
    }
    doctorMap.get(key)!.queues.push({
      id:          Number(q.Id),
      code:        q.Code ?? "",
      patientName: q.QFullName ?? "",
      status:      q.Status ?? 0,
      inputTime:   q.DateTime
        ? new Date(q.DateTime).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Manila" })
        : null,
    });
  }

  // Sort: named physicians first, unassigned last
  const doctors = [...doctorMap.values()].sort((a, b) => {
    if (a.doctorId === UNASSIGNED_KEY) return 1;
    if (b.doctorId === UNASSIGNED_KEY) return -1;
    return a.doctorName.localeCompare(b.doctorName);
  });

  return NextResponse.json({ date: dateParam, clinicCode, doctors });
}
