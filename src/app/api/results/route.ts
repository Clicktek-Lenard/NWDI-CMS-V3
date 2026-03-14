import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// GET /api/results?date=YYYY-MM-DD
// Returns today's paid queues with their accessionno rows
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "results");
  const clinicCode = session.user.clinicCode || "CEN";

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  const dateStr = dateParam ?? new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD Manila
  const dayStart = new Date(`${dateStr}T00:00:00+08:00`);
  const dayEnd   = new Date(`${dateStr}T23:59:59+08:00`);

  const [queues, statuses] = await Promise.all([
    prisma.queue.findMany({
      where: {
        IdBU:   clinicCode,
        Date:   { gte: dayStart, lte: dayEnd },
        Status: { gte: 210, lt: 650 }, // paid, not cancelled
      },
      orderBy: { Id: "desc" },
      take: 200,
    }),
    prisma.queuestatus.findMany({ orderBy: { Id: "asc" } }),
  ]);

  if (queues.length === 0) return NextResponse.json({ queues: [] });

  const queueIds = queues.map((q) => q.Id);
  const statusMap = new Map(statuses.map((s) => [s.Id, s.Name]));

  const accessions = await prisma.accessionno.findMany({
    where: { IdQueue: { in: queueIds } },
    orderBy: { Id: "asc" },
  });

  const accByQueue = new Map<string, typeof accessions>();
  for (const a of accessions) {
    const key = a.IdQueue.toString();
    const arr = accByQueue.get(key) ?? [];
    arr.push(a);
    accByQueue.set(key, arr);
  }

  return NextResponse.json({
    queues: queues.map((q) => ({
      id:          Number(q.Id),
      code:        q.Code,
      patientName: q.QFullName ?? "",
      patientType: q.PatientType ?? "",
      status:      q.Status,
      statusName:  statusMap.get(q.Status) ?? String(q.Status),
      dateTime:    q.DateTime?.toISOString() ?? q.Date.toISOString(),
      accessions:  (accByQueue.get(q.Id.toString()) ?? []).map((a) => ({
        id:              Number(a.Id),
        idTransaction:   a.IdTransaction ? Number(a.IdTransaction) : null,
        accessionNo:     a.AccessionNo ?? "",
        itemCode:        a.ItemCode ?? "",
        itemDescription: a.ItemDescription ?? "",
        itemGroup:       a.ItemGroup ?? "",
        type:            a.Type ?? "",
        status:          a.Status ?? 0,
        statusName:      statusMap.get(a.Status ?? 0) ?? String(a.Status ?? 0),
        receivedBU:      a.ReceivedBU ?? "",
        examDate:        a.ExamDate?.toISOString() ?? null,
      })),
    })),
  });
}
