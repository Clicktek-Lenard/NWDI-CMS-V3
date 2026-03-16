import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { logActivity, AUDIT_ACTIONS, getClientIp } from "@/lib/audit";

// PATCH /api/results/[id]/release
// Releases all results for a queue (Status → 600).
// Queue must be at Status 311–499 (specimens received, not yet released).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "results");
  const { id } = await params;
  const queueId = BigInt(id);
  const now = new Date();

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) return NextResponse.json({ error: "Queue not found" }, { status: 404 });

  if (queue.Status < 311 || queue.Status >= 500) {
    return NextResponse.json(
      { error: `Queue cannot be released (current status: ${queue.Status})` },
      { status: 422 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.accessionno.updateMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      data: { Status: 600, SystemUpdateTime: now },
    });

    await tx.transactions.updateMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      data: { Status: 600, SystemUpdateTime: now },
    });

    await tx.queue.update({
      where: { Id: queueId },
      data: {
        Status:           600,
        UpdateBy:         session.user.username ?? "system",
        UpdateDate:       now,
        SystemUpdateTime: now,
      },
    });
  });

  logActivity(session, AUDIT_ACTIONS.RELEASE_RESULT, "queue", id, {
    code:       queue.Code,
    patientName: queue.QFullName,
  }, getClientIp(request));

  return NextResponse.json({ success: true });
}
