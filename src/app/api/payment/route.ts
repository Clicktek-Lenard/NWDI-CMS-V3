import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// GET /api/payment — paginated list of queues with payment info
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "payment");

    const { searchParams } = new URL(request.url);
    const search   = searchParams.get("search")   || "";
    const status   = searchParams.get("status")   || ""; // "unpaid"|"partial"|"paid"|"cancelled"|""
    const dateFilter = searchParams.get("date")   || ""; // "today"|"week"|"month"|""
    const page     = parseInt(searchParams.get("page")     || "1",  10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

    // Build date range
    let dateFrom: Date | undefined;
    const now = new Date();
    if (dateFilter === "today") {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateFilter === "week") {
      dateFrom = new Date(now);
      dateFrom.setDate(dateFrom.getDate() - 7);
    } else if (dateFilter === "month") {
      dateFrom = new Date(now);
      dateFrom.setDate(dateFrom.getDate() - 30);
    }

    // Map status filter to queue Status codes
    let statusCodes: number[] | undefined;
    if (status === "unpaid")    statusCodes = [0, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 150, 180, 200];
    else if (status === "partial") statusCodes = [205];
    else if (status === "paid")    statusCodes = [210];
    else if (status === "cancelled") statusCodes = [650];

    // Build WHERE clause for queue
    const searchCondition = search
      ? {
          OR: [
            { QFullName:  { contains: search, mode: "insensitive" as const } },
            { AccessionNo: { contains: search, mode: "insensitive" as const } },
            { Code:        { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const statusCondition = statusCodes
      ? { Status: { in: statusCodes } }
      : {};

    const dateCondition = dateFrom
      ? { DateTime: { gte: dateFrom } }
      : {};

    const where = {
      ...searchCondition,
      ...statusCondition,
      ...dateCondition,
    };

    const [total, queues] = await Promise.all([
      prisma.queue.count({ where }),
      prisma.queue.findMany({
        where,
        orderBy: { DateTime: "desc" },
        skip:  (page - 1) * pageSize,
        take:  pageSize,
        select: {
          Id:          true,
          Code:        true,
          AccessionNo: true,
          QFullName:   true,
          PatientType: true,
          Status:      true,
          DateTime:    true,
          Date:        true,
        },
      }),
    ]);

    // Fetch transactions for all returned queues
    const queueIds = queues.map((q) => q.Id);
    const allTxs = queueIds.length > 0
      ? await prisma.transactions.findMany({
          where: { IdQueue: { in: queueIds } },
          select: {
            Id:              true,
            IdQueue:         true,
            AmountItemPrice: true,
            AmountRemaining: true,
            Status:          true,
          },
        })
      : [];

    // Group transactions by queue id
    const txByQueue = new Map<string, typeof allTxs>();
    for (const tx of allTxs) {
      const key = String(tx.IdQueue);
      if (!txByQueue.has(key)) txByQueue.set(key, []);
      txByQueue.get(key)!.push(tx);
    }

    const rows = queues.map((q) => {
      const txs = txByQueue.get(String(q.Id)) ?? [];
      const activeTxs = txs.filter((t) => t.Status < 650);
      const totalAmount    = activeTxs.reduce((s, t) => s + Number(t.AmountItemPrice ?? 0), 0);
      const totalRemaining = activeTxs.reduce((s, t) => s + Number(t.AmountRemaining ?? 0), 0);

      return {
        id:            Number(q.Id),
        code:          q.Code    ?? "",
        accessionNo:   q.AccessionNo ?? "",
        patientName:   q.QFullName   ?? "",
        patientType:   q.PatientType ?? "",
        status:        q.Status,
        dateTime:      (q.DateTime ?? q.Date).toISOString(),
        totalAmount,
        totalRemaining,
        txCount:       activeTxs.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: rows,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("[GET /api/payment]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch payments" }, { status: 500 });
  }
}
