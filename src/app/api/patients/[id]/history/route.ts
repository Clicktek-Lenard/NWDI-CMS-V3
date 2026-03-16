import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/patients/[id]/history
 * Returns all past queues + accessions for a patient.
 * [id] = patient's IdPatient (numeric).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "settings");
  const { id } = await params;
  const patientId = BigInt(id);

  const sp = request.nextUrl.searchParams;
  const page     = parseInt(sp.get("page")     || "1");
  const pageSize = Math.min(parseInt(sp.get("pageSize") || "20"), 100);

  const [total, queues] = await Promise.all([
    prisma.queue.count({
      where: { IdPatient: patientId, Status: { lt: 650 } },
    }),
    prisma.queue.findMany({
      where: { IdPatient: patientId, Status: { lt: 650 } },
      orderBy: { Date: "desc" },
      skip:  (page - 1) * pageSize,
      take:  pageSize,
    }),
  ]);

  if (queues.length === 0) {
    return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
  }

  const queueIds = queues.map((q) => q.Id);
  const [statuses, accessions] = await Promise.all([
    prisma.queuestatus.findMany(),
    prisma.accessionno.findMany({
      where: { IdQueue: { in: queueIds } },
      orderBy: { Id: "asc" },
    }),
  ]);

  const statusMap = new Map(statuses.map((s) => [s.Id, s.Name ?? ""]));
  const accMap = new Map<string, typeof accessions>();
  for (const a of accessions) {
    const k = String(a.IdQueue);
    if (!accMap.has(k)) accMap.set(k, []);
    accMap.get(k)!.push(a);
  }

  const data = queues.map((q) => ({
    id:          Number(q.Id),
    code:        q.Code ?? "",
    date:        q.Date.toISOString().slice(0, 10),
    clinicCode:  q.IdBU ?? "",
    statusCode:  q.Status,
    statusName:  statusMap.get(q.Status) ?? String(q.Status),
    patientType: q.PatientType ?? "",
    inputBy:     q.InputBy ?? "",
    accessions:  (accMap.get(String(q.Id)) ?? []).map((a) => ({
      id:              Number(a.Id),
      accessionNo:     a.AccessionNo ?? "",
      itemCode:        a.ItemCode ?? "",
      itemDescription: a.ItemDescription ?? "",
      status:          a.Status,
    })),
  }));

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
