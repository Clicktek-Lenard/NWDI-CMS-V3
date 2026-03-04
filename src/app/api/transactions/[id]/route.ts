import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const TX_CANCELLED = 650;

// ── PATCH /api/transactions/[id] — Full replace of a committed transaction ──
const updateSchema = z.object({
  idCompany:            z.number().int(),
  nameCompany:          z.string(),
  idDoctor:             z.number().int().nullable(),
  nameDoctor:           z.string(),
  transactionType:      z.string(),
  idItemPrice:          z.number().int(),
  codeItemPrice:        z.string(),
  descriptionItemPrice: z.string(),
  priceGroupItemPrice:  z.string(),
  amountItemPrice:      z.number(),
  readersFee:           z.number(),
  origAmount:           z.number(),
  groupItemMaster:      z.string(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const txId = BigInt(id);

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const existing = await prisma.transactions.findUnique({ where: { Id: txId } });
  if (!existing) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }
  if (existing.Status !== null && existing.Status >= TX_CANCELLED) {
    return NextResponse.json({ error: "Cannot edit a cancelled transaction" }, { status: 400 });
  }

  const d = parsed.data;

  await prisma.$transaction([
    prisma.transactions.update({
      where: { Id: txId },
      data: {
        IdDoctor:             d.idDoctor ? BigInt(d.idDoctor) : null,
        NameDoctor:           d.nameDoctor || null,
        IdCompany:            d.idCompany,
        NameCompany:          d.nameCompany,
        TransactionType:      d.transactionType || null,
        IdItemPrice:          BigInt(d.idItemPrice),
        CodeItemPrice:        d.codeItemPrice,
        DescriptionItemPrice: d.descriptionItemPrice,
        PriceGroupItemPrice:  d.priceGroupItemPrice || "Item",
        AmountItemPrice:      d.amountItemPrice,
        AmountRemaining:      d.amountItemPrice,
        ReadersFee:           d.readersFee,
        OrigAmount:           d.origAmount,
        GroupItemMaster:      d.groupItemMaster || null,
      },
    }),
    prisma.queue.update({
      where: { Id: existing.IdQueue },
      data:  { ErosStatus: "reUpdate" },
    }),
  ]);

  return NextResponse.json({ success: true });
}

// ── DELETE /api/transactions/[id] — Soft-cancel a transaction ──
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const txId = BigInt(id);

  const existing = await prisma.transactions.findUnique({ where: { Id: txId } });
  if (!existing) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }
  if (existing.Status !== null && existing.Status >= TX_CANCELLED) {
    return NextResponse.json({ error: "Transaction is already cancelled" }, { status: 400 });
  }

  const queueId = existing.IdQueue;

  await prisma.$transaction(async (tx) => {
    // 1. Soft-cancel the transaction
    await tx.transactions.update({
      where: { Id: txId },
      data:  { Status: TX_CANCELLED },
    });

    // 2. Reset AmountRemaining on all remaining active transactions
    //    (prepares for any future payment recalculation)
    const remaining = await tx.transactions.findMany({
      where: { IdQueue: queueId, Status: { lt: TX_CANCELLED }, Id: { not: txId } },
    });
    for (const r of remaining) {
      await tx.transactions.update({
        where: { Id: r.Id },
        data:  { AmountRemaining: r.AmountItemPrice },
      });
    }

    // 3. Flag queue for downstream sync
    await tx.queue.update({
      where: { Id: queueId },
      data:  { ErosStatus: "reUpdate" },
    });
  });

  return NextResponse.json({ success: true });
}
