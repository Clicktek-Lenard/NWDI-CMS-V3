import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// POST /api/queue/[id]/approve-amendment
// Approves an ante-date queue (Status 202 → 201).
// Role: BM-ROLE
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const queueId = BigInt(id);

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }
  if (queue.Status !== 202) {
    return NextResponse.json(
      { error: "Only ante-date queues (Status 202) can be approved" },
      { status: 400 }
    );
  }
  if (!queue.AnteDate) {
    return NextResponse.json({ error: "Queue has no ante-date set" }, { status: 400 });
  }

  const approvedBy   = (session.user.username || session.user.id || "system").slice(0, 30);
  const approvedDate = new Date();
  const anteDateDate = queue.AnteDate; // the new scheduled date

  await prisma.$transaction(async (tx) => {
    // 1. Approve the ante-date queue → Status 201 (For Payment), update Date to AnteDate
    await tx.queue.update({
      where: { Id: queueId },
      data: {
        Status:               201,
        Date:                 anteDateDate,
        DateTime:             queue.AnteDateTime ?? approvedDate,
        AnteDateApprovedBy:   approvedBy,
        AnteDateApprovedDate: approvedDate,
        ErosStatus:           "queued",
        UpdateBy:             approvedBy,
        UpdateDate:           approvedDate,
      },
    });

    // 2. Update all active transactions on this queue → Status 201, Date = AnteDate
    await tx.transactions.updateMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      data:  { Status: 201, Date: anteDateDate },
    });

    // 3. Void the original cancelled queue (if present via AnteDateQueueID)
    if (queue.AnteDateQueueID && queue.AnteDateQueueID !== BigInt(0)) {
      await tx.queue.update({
        where: { Id: queue.AnteDateQueueID },
        data: {
          Status:               900, // Voided
          AnteDateApprovedBy:   approvedBy,
          AnteDateApprovedDate: approvedDate,
          UpdateBy:             approvedBy,
          UpdateDate:           approvedDate,
        },
      });
    }
  });

  return NextResponse.json({ success: true });
}
