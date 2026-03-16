import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// GET /api/payment?history=true — paymenthistory records (OR-level)
// GET /api/payment              — queue list with payment status
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "payment");

    const { searchParams } = new URL(request.url);

    // ── Payment History view ─────────────────────────────────────
    if (searchParams.get("history") === "true") {
      const date       = searchParams.get("date") || new Date().toISOString().split("T")[0];
      const method     = searchParams.get("method")   || "";
      const cashier    = searchParams.get("cashier")  || "";
      const search     = searchParams.get("search")   || "";
      const page       = parseInt(searchParams.get("page")     || "1",  10);
      const pageSize   = parseInt(searchParams.get("pageSize") || "50", 10);

      const dayStart = new Date(`${date}T00:00:00`);
      const dayEnd   = new Date(`${date}T23:59:59`);

      const where: Record<string, unknown> = {
        InputDate: { gte: dayStart, lte: dayEnd },
      };
      if (method)  where.PaymentType = { equals: method, mode: "insensitive" };
      if (cashier) where.InputBy     = { contains: cashier, mode: "insensitive" };

      const [total, records] = await Promise.all([
        prisma.paymenthistory.count({ where }),
        prisma.paymenthistory.findMany({
          where,
          orderBy: { InputDate: "desc" },
          skip:  (page - 1) * pageSize,
          take:  pageSize,
          select: {
            Id:            true,
            IdQueue:       true,
            ORNum:         true,
            PaymentType:   true,
            PayAmount:     true,
            CoverageType:  true,
            CoverageAmount:true,
            DiscType:      true,
            DiscAmount:    true,
            InputBy:       true,
            InputDate:     true,
            RefNo:         true,
            BankName:      true,
          },
        }),
      ]);

      // Fetch queue codes for display
      const queueIds = [...new Set(records.map((r) => r.IdQueue))];
      const queues = queueIds.length > 0
        ? await prisma.queue.findMany({
            where: { Id: { in: queueIds } },
            select: { Id: true, Code: true, QFullName: true },
          })
        : [];
      const queueMap = new Map(queues.map((q) => [String(q.Id), q]));

      // Aggregate totals
      const totalPaid = records.reduce((s, r) => s + (r.PayAmount ?? 0), 0);
      const totalDisc = records.reduce((s, r) => s + (r.DiscAmount ?? 0), 0);

      // Filter by search client-side (OR number or patient name)
      const filtered = search
        ? records.filter((r) => {
            const q = queueMap.get(String(r.IdQueue));
            const s = search.toLowerCase();
            return (
              (r.ORNum ?? "").toLowerCase().includes(s) ||
              (q?.QFullName ?? "").toLowerCase().includes(s) ||
              (q?.Code ?? "").toLowerCase().includes(s)
            );
          })
        : records;

      return NextResponse.json({
        success: true,
        data: filtered.map((r) => {
          const q = queueMap.get(String(r.IdQueue));
          return {
            id:             Number(r.Id),
            idQueue:        Number(r.IdQueue),
            queueCode:      q?.Code ?? "",
            patientName:    q?.QFullName ?? "",
            orNum:          r.ORNum ?? "",
            paymentType:    r.PaymentType ?? "",
            payAmount:      r.PayAmount ?? 0,
            coverageType:   r.CoverageType ?? "",
            coverageAmount: r.CoverageAmount ?? 0,
            discType:       r.DiscType ?? "",
            discAmount:     r.DiscAmount ?? 0,
            cashier:        r.InputBy ?? "",
            inputDate:      r.InputDate.toISOString(),
            refNo:          r.RefNo ?? "",
            bankName:       r.BankName ?? "",
          };
        }),
        total,
        page,
        pageSize,
        totalPages:  Math.ceil(total / pageSize),
        totalPaid,
        totalDisc,
      });
    }


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
