import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";
import { logActivity, AUDIT_ACTIONS, getClientIp } from "@/lib/audit";

const schema = z.object({
  reason: z.string().min(1).max(500),
});

// POST /api/queue/[id]/reject-amendment
// Rejects an ante-date queue (Status 202 → 650 soft-delete).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const queueId = BigInt(id);

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "reason is required" }, { status: 422 });
  }

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  if (queue.Status !== 202) {
    return NextResponse.json(
      { error: "Only ante-date queues (Status 202) can be rejected" },
      { status: 400 }
    );
  }

  const rejectedBy = (session.user.username || session.user.id || "system").slice(0, 30);
  const now = new Date();

  await prisma.$transaction([
    // Cancel the amendment queue
    prisma.queue.update({
      where: { Id: queueId },
      data: {
        Status:             650,
        CancelReason:       parsed.data.reason,
        AnteDateApprovedBy: rejectedBy,
        AnteDateApprovedDate: now,
        UpdateBy:           rejectedBy,
        UpdateDate:         now,
      },
    }),
    // Soft-cancel all transactions
    prisma.transactions.updateMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      data: { Status: 650 },
    }),
    // Restore the original queue (AnteDateQueueID) back to its pre-cancel status
    ...(queue.AnteDateQueueID && queue.AnteDateQueueID !== BigInt(0)
      ? [prisma.queue.update({
          where: { Id: queue.AnteDateQueueID },
          data: {
            Status:    queue.AnteDateStatus && queue.AnteDateStatus !== 202
              ? queue.AnteDateStatus
              : 201,
            UpdateBy:  rejectedBy,
            UpdateDate: now,
          },
        })]
      : []),
  ]);

  logActivity(session, AUDIT_ACTIONS.REJECT_AMENDMENT, "queue", id, {
    code:            queue.Code,
    patientName:     queue.QFullName,
    reason:          parsed.data.reason,
    originalQueueId: queue.AnteDateQueueID ? Number(queue.AnteDateQueueID) : null,
  }, getClientIp(request));

  return NextResponse.json({ success: true });
}
