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

  const [
    queueCounts,
    transactionStats,
    pendingAmendments,
    specimenCounts,
    releasedCount,
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
    generatedAt: new Date().toISOString(),
  });
}
