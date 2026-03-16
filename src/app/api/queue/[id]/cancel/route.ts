import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";
import { QueueService } from "@/services/queue.service";
import { logActivity, AUDIT_ACTIONS, getClientIp } from "@/lib/audit";

const cancelSchema = z.object({
  anteDateReason: z.string().min(1, "Reason is required"),
  anteDate:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

// POST /api/queue/[id]/cancel — Cancel queue + create ante-date shadow queue (Status 202)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id }  = await params;
  const queueId = BigInt(id);

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { anteDateReason, anteDate } = parsed.data;
  const inputBy      = (session.user.username || session.user.id || "system").slice(0, 30);
  const anteDateDate = new Date(`${anteDate}T00:00:00Z`);

  // Fetch original queue
  const original = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!original) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }
  if (original.Status === 650) {
    return NextResponse.json({ error: "Queue is already cancelled" }, { status: 400 });
  }

  const clinicCode = original.IdBU ?? "";

  // Fetch active transactions before the DB transaction (avoids lock contention on count query)
  const activeTxs = await prisma.transactions.findMany({
    where: { IdQueue: queueId, Status: { lt: 650 } },
    orderBy: { Id: "asc" },
  });

  // Generate new queue code (must happen outside transaction to get accurate count)
  const { code: newCode, today } = await QueueService.generateQueueCode(clinicCode);

  const nowUtc = new Date();

  const result = await prisma.$transaction(async (tx) => {
    // 1. Cancel all active transactions on the original queue
    await tx.transactions.updateMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      data:  { Status: 650 },
    });

    // 2. Mark original queue as cancelled/ante-dated
    await tx.queue.update({
      where: { Id: queueId },
      data: {
        Status:         650,
        AnteDateReason: anteDateReason,
        AnteDate:       anteDateDate,
        AnteDateStatus: 650,
        ErosStatus:     "queued",
        UpdateBy:       inputBy,
        UpdateDate:     today,
      },
    });

    // 3. Create the new ante-date queue (Status 202).
    // AnteDateStatus = original.Status so approval can restore the queue to its prior status (v1 behaviour).
    // Notes = "Amendments Que" to identify this as an amendment queue (matches v1 CancelTransactionController).
    const newQueue = await tx.queue.create({
      data: {
        IdBU:             clinicCode,
        Code:             newCode,
        Date:             today,
        DateTime:         nowUtc,
        IdPatient:        original.IdPatient,
        QFullName:        original.QFullName,
        QLastName:        original.QLastName,
        QFirstName:       original.QFirstName,
        QMiddleName:      original.QMiddleName,
        QGender:          original.QGender,
        QDOB:             original.QDOB,
        AgePatient:       original.AgePatient,
        Status:           202,
        PatientType:      original.PatientType,
        Notes:            "Amendments Que",
        AnteDateQueueID:  queueId,
        AnteDateCode:     original.Code,
        AnteDate:         original.AnteDate ?? anteDateDate,
        AnteDateTime:     original.AnteDateTime ?? original.DateTime,
        AnteDateReason:   anteDateReason,
        AnteDateStatus:   original.Status, // saved so approval can restore it
        InputBy:          inputBy,
      },
    });

    // 4. Copy all active transactions to the new queue
    if (activeTxs.length > 0) {
      await tx.transactions.createMany({
        data: activeTxs.map((t) => ({
          IdQueue:              newQueue.Id,
          Date:                 today,
          IdDoctor:             t.IdDoctor,
          NameDoctor:           t.NameDoctor,
          IdCompany:            t.IdCompany,
          NameCompany:          t.NameCompany,
          TransactionType:      t.TransactionType,
          IdItemPrice:          t.IdItemPrice,
          ItemUsedItemPrice:    t.ItemUsedItemPrice,
          CodeItemPrice:        t.CodeItemPrice,
          DescriptionItemPrice: t.DescriptionItemPrice,
          PriceGroupItemPrice:  t.PriceGroupItemPrice,
          AmountItemPrice:      t.AmountItemPrice,
          AmountRemaining:      t.AmountItemPrice, // reset to full amount
          ReadersFee:           t.ReadersFee,
          OrigAmount:           t.OrigAmount,
          GroupItemMaster:      t.GroupItemMaster,
          HCardNumber:          t.HCardNumber,
          Stat:                 t.Stat,
          InputId:              t.InputId,
          InputBy:              inputBy,
          Status:               202,
        })),
      });
    }

    return { newQueueId: Number(newQueue.Id), newQueueCode: newCode };
  });

  logActivity(session, AUDIT_ACTIONS.CANCEL_QUEUE, "queue", id, {
    code:         original.Code,
    patientName:  original.QFullName,
    reason:       anteDateReason,
    anteDate,
    newQueueCode: result.newQueueCode,
  }, getClientIp(request));

  return NextResponse.json(result, { status: 201 });
}
