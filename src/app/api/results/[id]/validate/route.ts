import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * PATCH /api/results/[id]/validate
 * Validates all ENCODED result values for a queue (ENCODED → VALIDATED).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "results");
  const { id } = await params;
  const queueId = BigInt(id);

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) return NextResponse.json({ error: "Queue not found" }, { status: 404 });

  const validatedBy = session.user.username || session.user.id;
  const now = new Date();

  const { count } = await prisma.resultValue.updateMany({
    where: { queue_id: queueId, status: "ENCODED" },
    data: {
      status:       "VALIDATED",
      validated_by: validatedBy,
      validated_at: now,
    },
  });

  // Also validate imaging results for this queue
  await prisma.imagingResult.updateMany({
    where: { queue_id: queueId, status: "ENCODED" },
    data: {
      status:       "VALIDATED",
      validated_by: validatedBy,
      validated_at: now,
    },
  });

  return NextResponse.json({ success: true, validated: count });
}
