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

  // Restore the queue to its original status (saved as AnteDateStatus by the cancel route).
  // Falls back to 201 if not set. Matches v1 EditTransactionController::approvalTransaction().
  const restoreStatus = queue.AnteDateStatus && queue.AnteDateStatus !== 202
    ? queue.AnteDateStatus
    : 201;

  await prisma.$transaction(async (tx) => {
    // 1. UpdateQueue — upsert by QueueCode + Module = 'Transaction' (matches v1 approvalTransaction).
    const existingUQ = await tx.updatequeue.findFirst({
      where: { QueueCode: queue.Code, Module: "Transaction" },
    });
    if (existingUQ) {
      await tx.updatequeue.update({
        where: { Id: existingUQ.Id },
        data:  { ModuleId: queueId, Status: 1 },
      });
    } else {
      await tx.updatequeue.create({
        data: { QueueCode: queue.Code, Module: "Transaction", ModuleId: queueId, Status: 1 },
      });
    }

    // 2. Approve the ante-date queue → restore to original status, update Date to AnteDate
    await tx.queue.update({
      where: { Id: queueId },
      data: {
        Status:               restoreStatus,
        Date:                 anteDateDate,
        DateTime:             queue.AnteDateTime ?? approvedDate,
        AnteDateApprovedBy:   approvedBy,
        AnteDateApprovedDate: approvedDate,
        ErosStatus:           "queued",
        UpdateBy:             approvedBy,
        UpdateDate:           approvedDate,
      },
    });

    // 3. Update all active transactions → Status 300 (For Specimen), Date = AnteDate.
    // Matches v1 CMS ALLPROD behaviour (EditTransactionController::approvalTransaction).
    await tx.transactions.updateMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      data:  { Status: 300, Date: anteDateDate },
    });

    // 4. Void the original cancelled queue (Status 650 → 900) via AnteDateQueueID link.
    if (queue.AnteDateQueueID && queue.AnteDateQueueID !== BigInt(0)) {
      await tx.queue.update({
        where: { Id: queue.AnteDateQueueID },
        data: {
          Status:               900,
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
