import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const itemSchema = z.object({
  id:     z.number().int(),
  status: z.enum(["received", "waived", "rejected", "refused", "doneOutside"]).default("received"),
  notes:  z.string().optional().default(""),
  // Tube counts for HEMATOLOGY — stored for reference, UI-only for now
  tubes:  z.object({
    purple: z.number().int().min(0).default(0),
    yellow: z.number().int().min(0).default(0),
    blue:   z.number().int().min(0).default(0),
    red:    z.number().int().min(0).default(0),
    gray:   z.number().int().min(0).default(0),
  }).optional(),
});

const schema = z.object({
  items: z.array(itemSchema).min(1, "Select at least one item"),
});

// Status code mapping (mirrors v1 SpecimenReceivingController)
const STATUS_CODE: Record<string, number> = {
  received:    311,
  waived:      888,
  rejected:    877,
  refused:     899,
  doneOutside: 866,
};

// PATCH /api/results/[id]/receive-specimen
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

  const { items } = parsed.data;
  const now = new Date();

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) return NextResponse.json({ error: "Queue not found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const newStatus = STATUS_CODE[item.status] ?? 311;
      const accId = BigInt(item.id);
      const isReceived = item.status === "received";

      await tx.accessionno.updateMany({
        where: { IdQueue: queueId, Id: accId },
        data: {
          Status:           newStatus,
          ReceivedBU:       isReceived ? clinicCode : null,
          ExamDate:         isReceived ? now : null,
          SystemUpdateTime: now,
        },
      });

      await tx.transactions.updateMany({
        where: { IdQueue: queueId, Id: accId, Status: { lt: 650 } },
        data: { Status: newStatus, SystemUpdateTime: now },
      });
    }

    // If ALL non-CLINIC accessionno rows are now ≥ 311 → advance queue to 311
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
        data:  {
          Status:          311,
          UpdateBy:        session.user.username ?? "system",
          UpdateDate:      now,
          SystemUpdateTime: now,
        },
      });
    }
  });

  return NextResponse.json({ success: true });
}
