import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const payModeDetailSchema = z.object({
  mode:     z.string(),
  amount:   z.number().default(0),
  refNo:    z.string().optional().default(""),
  bankName: z.string().optional().default(""),
});

const paymentSchema = z.object({
  providerType:   z.enum(["PATIENT", "HMO", "CORPORATE"]),
  billTo:         z.string().optional().default(""),
  cardNumber:     z.string().optional().default(""),
  coverageType:   z.enum(["FULL", "PARTIAL"]).optional().default("FULL"),
  coverageAmount: z.number().optional().default(0),
  // primary method (legacy single-value field) + full multi-method array
  paymentMethod:  z.string(),
  paymentMethods: z.array(payModeDetailSchema).optional().default([]),
  orNumber:       z.string().optional().default(""),
  discountType:   z.string().optional().default("None"),
  discountId:     z.string().optional().default(""),
  discountAmount: z.number().optional().default(0),
  transactionIds: z.array(z.number().int()).min(1, "Select at least one transaction"),
});

// POST /api/queue/[id]/payment — Process payment for selected transactions
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

  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { providerType, billTo, cardNumber, coverageType, coverageAmount,
          paymentMethod, paymentMethods, orNumber, discountType, discountId, discountAmount,
          transactionIds } = parsed.data;
  const inputBy = (session.user.username || session.user.id || "system").slice(0, 30);

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }
  if (queue.Status >= 650) {
    return NextResponse.json({ error: "Cannot process payment on a cancelled queue" }, { status: 400 });
  }

  // Fetch the selected transactions
  const txIds = transactionIds.map(BigInt);
  const activeTxs = await prisma.transactions.findMany({
    where: { Id: { in: txIds }, IdQueue: queueId, Status: { lt: 650 } },
  });

  if (activeTxs.length === 0) {
    return NextResponse.json({ error: "No active transactions found" }, { status: 400 });
  }

  // Fetch all active transactions on this queue to determine if fully paid
  const allActiveTxs = await prisma.transactions.findMany({
    where: { IdQueue: queueId, Status: { lt: 650 } },
  });

  const allPaid = allActiveTxs.every((tx) => transactionIds.includes(Number(tx.Id)));

  let finalOrNumber = orNumber;

  await prisma.$transaction(async (tx) => {
    // Mark selected transactions as fully paid (Status 210)
    await tx.transactions.updateMany({
      where: { Id: { in: txIds }, IdQueue: queueId },
      data: {
        Status:          210,
        AmountRemaining: 0,
        ...(providerType === "HMO" && cardNumber
          ? { HCardNumber: cardNumber.replace(/-/g, "").slice(0, 20) }
          : {}),
      },
    });

    // Determine new queue status
    // 210 = Fully Paid, 205 = Partially Paid
    const newQueueStatus = allPaid ? 210 : 205;

    await tx.queue.update({
      where: { Id: queueId },
      data: {
        Status:    newQueueStatus,
        ErosStatus: "queued",
        UpdateBy:  inputBy,
        UpdateDate: new Date(),
      },
    });

    // Auto-generate OR number if not provided
    const todayStr = new Date().toLocaleDateString("en-CA"); // Manila date YYYY-MM-DD
    const clinicCode = queue.IdBU ?? "CEN";
    const datePart = todayStr.replace(/-/g, "");

    if (!finalOrNumber) {
      const orCount = await tx.paymenthistory.count({
        where: {
          InputDate: {
            gte: new Date(`${todayStr}T00:00:00+08:00`),
            lt:  new Date(`${todayStr}T23:59:59+08:00`),
          },
          ORNum: { startsWith: `${clinicCode}${datePart}` },
        },
      });
      const seq = String(orCount + 1).padStart(3, "0");
      finalOrNumber = `${clinicCode}${datePart}${seq}`;
    }

    // Save a paymenthistory record per paid transaction
    const now = new Date();
    for (const paidTx of activeTxs) {
      const primaryMethod = paymentMethods[0];
      await tx.paymenthistory.create({
        data: {
          IdQueue:           queueId,
          IdTransaction:     paidTx.Id,
          CurrentItemAmount: paidTx.AmountItemPrice ? Number(paidTx.AmountItemPrice) : 0,
          ItemAmount:        paidTx.AmountItemPrice ? Number(paidTx.AmountItemPrice) : 0,
          BalanceAmount:     0,
          RemainingAmount:   0,
          ProviderType:      providerType,
          BillTo:            null,
          ORNum:             finalOrNumber,
          CoverageType:      coverageType,
          CoverageAmount:    coverageAmount,
          PaymentType:       paymentMethod,
          RefNo:             primaryMethod?.refNo ?? "",
          PayAmount:         paidTx.AmountItemPrice ? Number(paidTx.AmountItemPrice) : 0,
          BankName:          primaryMethod?.bankName ?? "",
          DiscType:          discountType,
          DiscId:            discountId,
          DiscAmount:        discountAmount,
          Status:            "1",
          InputBy:           inputBy,
          InputDate:         now,
        },
      });
    }
  });

  return NextResponse.json({
    success: true,
    message: allPaid ? "Payment complete — all transactions fully paid." : "Partial payment applied.",
    providerType,
    billTo,
    coverageType,
    coverageAmount,
    paymentMethod,
    paymentMethods,
    orNumber: finalOrNumber,
    discountType,
    discountId,
    discountAmount,
  });
}

// GET /api/queue/[id]/payment — Fetch payment summary for this queue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const queueId = BigInt(id);

  const [queue, transactions, statuses] = await Promise.all([
    prisma.queue.findUnique({ where: { Id: queueId } }),
    prisma.transactions.findMany({
      where: { IdQueue: queueId },
      orderBy: { Id: "asc" },
    }),
    prisma.queuestatus.findMany({ orderBy: { Id: "asc" } }),
  ]);

  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }

  const statusMap = new Map(statuses.map((s) => [s.Id, s.Name]));

  return NextResponse.json({
    queue: {
      id:          Number(queue.Id),
      code:        queue.Code,
      patientName: queue.QFullName ?? "",
      patientType: queue.PatientType ?? "",
      status:      queue.Status,
      statusName:  statusMap.get(queue.Status) ?? String(queue.Status),
      dateTime:    queue.DateTime?.toISOString() ?? queue.Date.toISOString(),
    },
    transactions: transactions.map((tx) => ({
      id:                   Number(tx.Id),
      idDoctor:             tx.IdDoctor ? Number(tx.IdDoctor) : null,
      nameDoctor:           tx.NameDoctor ?? "",
      idCompany:            tx.IdCompany ?? 0,
      nameCompany:          tx.NameCompany ?? "",
      codeItemPrice:        tx.CodeItemPrice ?? "",
      descriptionItemPrice: tx.DescriptionItemPrice ?? "",
      priceGroupItemPrice:  tx.PriceGroupItemPrice ?? "",
      amount:               tx.AmountItemPrice ? Number(tx.AmountItemPrice) : 0,
      amountRemaining:      tx.AmountRemaining ? Number(tx.AmountRemaining) : 0,
      cardNumber:           tx.HCardNumber ?? "",
      transactionType:      tx.TransactionType ?? "",
      status:               tx.Status,
      statusName:           statusMap.get(tx.Status ?? 0) ?? String(tx.Status),
    })),
  });
}
