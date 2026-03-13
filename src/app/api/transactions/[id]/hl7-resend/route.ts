import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// POST /api/transactions/[id]/hl7-resend
// Queues an HL7 resend by upserting a msg_queue row with Status = '1'.
// Mirrors old CMS writeHL7MessageRequest (type=Item).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const txId = BigInt(id);

  const tx = await prisma.transactions.findUnique({ where: { Id: txId } });
  if (!tx) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  const queue = await prisma.queue.findUnique({ where: { Id: tx.IdQueue } });
  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }

  const itemGroup   = tx.GroupItemMaster ?? tx.CodeItemPrice ?? "";
  const accessionNo = queue.AccessionNo ?? queue.Code ?? "";
  const queueCode   = queue.Code ?? "";
  const idBU        = queue.IdBU ?? "";

  // Upsert: find existing entry for this queue + itemGroup, then update or create
  const existing = await prisma.msg_queue.findFirst({
    where: { IdQueue: tx.IdQueue, ItemGroup: itemGroup },
  });

  if (existing) {
    await prisma.msg_queue.update({
      where: { Id: existing.Id },
      data:  { Status: "1" },
    });
  } else {
    await prisma.msg_queue.create({
      data: {
        Id:         BigInt(Date.now()),
        IdQueue:    tx.IdQueue,
        QueueCode:  queueCode,
        IdBU:       idBU,
        ReceivedBU: idBU,
        ItemGroup:  itemGroup,
        AccessionNo: accessionNo,
        Status:     "1",
      },
    });
  }

  return NextResponse.json({
    success:    true,
    itemGroup,
    accessionNo,
    receivedBU: idBU,
  });
}
