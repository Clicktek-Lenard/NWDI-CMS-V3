import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const schema = z.object({
  // accessionno.Id values (= IdTransaction) to receive
  accessionIds: z.array(z.number().int()).min(1, "Select at least one item"),
  reject:       z.boolean().optional().default(false),
  rejectReason: z.string().optional().default(""),
});

const STATUS_RECEIVED = 311;
const STATUS_REJECTED = 877;

// PATCH /api/results/[id]/receive-specimen
// Marks selected accessionno rows as received (311) or rejected (877)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "results");
  const clinicCode = session.user.clinicCode || "CEN";
  const { id } = await params;
  const queueId = BigInt(id);

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { accessionIds, reject, rejectReason } = parsed.data;
  const accBigIds = accessionIds.map(BigInt);
  const newStatus = reject ? STATUS_REJECTED : STATUS_RECEIVED;
  const now       = new Date();

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) return NextResponse.json({ error: "Queue not found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    // Update the selected accessionno rows
    await tx.accessionno.updateMany({
      where: { IdQueue: queueId, Id: { in: accBigIds } },
      data: {
        Status:          newStatus,
        ReceivedBU:      reject ? null : clinicCode,
        ExamDate:        reject ? null : now,
        SystemUpdateTime: now,
      },
    });

    // Mirror status on matching transactions
    await tx.transactions.updateMany({
      where: { IdQueue: queueId, Id: { in: accBigIds }, Status: { lt: 650 } },
      data: { Status: newStatus, SystemUpdateTime: now },
    });

    // Re-check: if ALL non-clinic accessionno rows are now ≥ 311 → advance queue to 311
    const stillPending = await tx.accessionno.count({
      where: {
        IdQueue:   queueId,
        ItemGroup: { not: "CLINIC" },
        Status:    { lt: 311 },
      },
    });

    if (stillPending === 0) {
      await tx.queue.update({
        where: { Id: queueId },
        data:  { Status: STATUS_RECEIVED, UpdateBy: session.user.username ?? "system", UpdateDate: now, SystemUpdateTime: now },
      });
    }
  });

  return NextResponse.json({ success: true, newStatus, rejectReason: reject ? rejectReason : null });
}
