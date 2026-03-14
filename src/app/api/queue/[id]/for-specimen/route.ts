import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// POST /api/queue/[id]/for-specimen
// Manually advances a fully-paid queue (Status 210) → 300 (For Specimen)
// Temporary until Mirth/HL7 integration auto-triggers this transition.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const queueId = BigInt(id);
  const now = new Date();

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  if (queue.Status !== 210) {
    return NextResponse.json(
      { error: `Queue is not fully paid (current status: ${queue.Status})` },
      { status: 422 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.queue.update({
      where: { Id: queueId },
      data: {
        Status:           300,
        UpdateBy:         session.user.username ?? "system",
        UpdateDate:       now,
        SystemUpdateTime: now,
      },
    });

    // Advance all active transactions for this queue to 300
    await tx.transactions.updateMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      data: { Status: 300, SystemUpdateTime: now },
    });
  });

  return NextResponse.json({ success: true });
}
