import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/dashboard/stats
 * Returns today's operational stats for the clinic dashboard.
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "dashboard");
  const clinicCode = session.user.clinicCode || "CEN";

  const todayStr = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" Manila
  // Use +08:00 so the range spans midnight–23:59 Manila time, not UTC
  const todayStart = new Date(`${todayStr}T00:00:00+08:00`);
  const todayEnd   = new Date(`${todayStr}T23:59:59+08:00`);

  // Build 7-day window (today − 6 days → today)
  const sevenDaysAgo = new Date(`${todayStr}T00:00:00+08:00`);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    queueCounts,
    transactionStats,
    pendingAmendments,
    specimenCounts,
    releasedCount,
    weeklyQueueRows,
    weeklyRevenueRows,
  ] = await Promise.all([
    // Queue counts by status for today — use DateTime (creation timestamp), not Date (v1-set date field which is unreliable)
    prisma.queue.groupBy({
      by: ["Status"],
      where: { IdBU: clinicCode, DateTime: { gte: todayStart, lte: todayEnd } },
      _count: { Id: true },
    }),
    // Revenue from paymenthistory — InputDate is the reliable payment timestamp
    prisma.paymenthistory.aggregate({
      where: {
        InputDate: { gte: todayStart, lte: todayEnd },
      },
      _sum: { PayAmount: true },
      _count: { Id: true },
    }),
    // Pending amendment queues (status 202, any date, this clinic)
    prisma.queue.count({
      where: { IdBU: clinicCode, Status: 202 },
    }),
    // Specimen pipeline counts — no date filter, shows full current backlog
    prisma.queue.groupBy({
      by: ["Status"],
      where: {
        IdBU: clinicCode,
        Status: { in: [300, 360, 311] },
      },
      _count: { Id: true },
    }),
    // Released results today — filter by SystemUpdateTime (when result was released), not Date (check-in day)
    prisma.queue.count({
      where: { IdBU: clinicCode, Status: 600, SystemUpdateTime: { gte: todayStart, lte: todayEnd } },
    }),
    // Weekly queue counts: group by Date over last 7 days
    prisma.queue.groupBy({
      by: ["Date"],
      where: { IdBU: clinicCode, DateTime: { gte: sevenDaysAgo, lte: todayEnd } },
      _count: { Id: true },
      orderBy: { Date: "asc" },
    }),
    // Weekly revenue: group paymenthistory by InputDate date-part over last 7 days
    prisma.paymenthistory.findMany({
      where: { InputDate: { gte: sevenDaysAgo, lte: todayEnd } },
      select: { InputDate: true, PayAmount: true },
    }),
  ]);

  // Build status count map for today's queue
  const byStatus = Object.fromEntries(
    queueCounts.map((g) => [g.Status, g._count.Id])
  );

  const totalToday   = queueCounts.reduce((sum, g) => sum + g._count.Id, 0);
  const waiting      = (byStatus[201] ?? 0);
  const paid         = (byStatus[210] ?? 0) + (byStatus[205] ?? 0);
  const cancelled    = byStatus[650] ?? 0;
  const inProgress   = totalToday - waiting - paid - cancelled;

  const specimenMap  = Object.fromEntries(
    specimenCounts.map((g) => [g.Status, g._count.Id])
  );

  // Build 7-day trend arrays (one entry per day, oldest → newest)
  const trendDays: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(`${todayStr}T00:00:00+08:00`);
    d.setDate(d.getDate() - i);
    trendDays.push(d.toLocaleDateString("en-CA")); // YYYY-MM-DD
  }

  const queueByDate = new Map(
    weeklyQueueRows.map((r) => [r.Date.toLocaleDateString("en-CA"), r._count.Id])
  );
  const revenueByDate = new Map<string, number>();
  for (const r of weeklyRevenueRows) {
    if (!r.InputDate) continue;
    const key = new Date(r.InputDate).toLocaleDateString("en-CA");
    revenueByDate.set(key, (revenueByDate.get(key) ?? 0) + Number(r.PayAmount ?? 0));
  }

  const trend = trendDays.map((day) => ({
    date:    day,
    label:   new Date(day + "T00:00:00+08:00").toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
    visits:  queueByDate.get(day)  ?? 0,
    revenue: revenueByDate.get(day) ?? 0,
  }));

  return NextResponse.json({
    today: {
      total:     totalToday,
      waiting,
      paid,
      cancelled,
      inProgress: Math.max(0, inProgress),
    },
    revenue: {
      total:            Number(transactionStats._sum.PayAmount ?? 0),
      transactionCount: transactionStats._count.Id,
    },
    amendments: {
      pending: pendingAmendments,
    },
    specimen: {
      forSpecimen:         specimenMap[300] ?? 0,
      accessionAssigned:   specimenMap[360] ?? 0,
      received:            specimenMap[311] ?? 0,
      released:            releasedCount,
    },
    trend,
    generatedAt: new Date().toISOString(),
  });
}
