import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/reports/discounts
 * Returns paymenthistory rows where DiscAmount > 0, filtered by date range.
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "reports");

  const sp       = request.nextUrl.searchParams;
  const dateFrom = sp.get("dateFrom") || new Date().toLocaleDateString("en-CA");
  const dateTo   = sp.get("dateTo")   || dateFrom;
  const page     = parseInt(sp.get("page")     || "1");
  const pageSize = Math.min(parseInt(sp.get("pageSize") || "50"), 200);

  const start = new Date(`${dateFrom}T00:00:00+08:00`);
  const end   = new Date(`${dateTo}T23:59:59+08:00`);

  // Get queues in range for this clinic
  const clinicCode = session.user.clinicCode || "CEN";
  const queues = await prisma.queue.findMany({
    where: { IdBU: clinicCode, Date: { gte: start, lte: end } },
    select: { Id: true, Code: true, QFullName: true },
  });

  if (queues.length === 0) {
    return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0, summary: { totalDiscount: 0, rowCount: 0 } });
  }

  const queueIds = queues.map((q) => q.Id);
  const queueMap = new Map(queues.map((q) => [q.Id, q]));

  const [total, rows] = await Promise.all([
    prisma.paymenthistory.count({
      where: { IdQueue: { in: queueIds }, DiscAmount: { gt: 0 } },
    }),
    prisma.paymenthistory.findMany({
      where: { IdQueue: { in: queueIds }, DiscAmount: { gt: 0 } },
      orderBy: { InputDate: "desc" },
      skip:  (page - 1) * pageSize,
      take:  pageSize,
    }),
  ]);

  const summary = await prisma.paymenthistory.aggregate({
    where: { IdQueue: { in: queueIds }, DiscAmount: { gt: 0 } },
    _sum: { DiscAmount: true },
  });

  return NextResponse.json({
    data: rows.map((r) => {
      const q = queueMap.get(r.IdQueue);
      return {
        id:          Number(r.Id),
        queueId:     Number(r.IdQueue),
        queueCode:   q?.Code ?? "",
        patientName: q?.QFullName ?? "",
        discType:    r.DiscType ?? "",
        discId:      r.DiscId ?? "",
        discAmount:  r.DiscAmount ?? 0,
        payAmount:   r.PayAmount ?? 0,
        itemAmount:  r.ItemAmount,
        orNum:       r.ORNum ?? "",
        paymentType: r.PaymentType ?? "",
        inputBy:     r.InputBy ?? "",
        inputDate:   r.InputDate.toISOString(),
      };
    }),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    summary: {
      totalDiscount: summary._sum.DiscAmount ?? 0,
      rowCount:      total,
    },
  });
}
