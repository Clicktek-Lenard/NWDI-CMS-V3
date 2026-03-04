import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

// GET /api/queue/[id] — Fetch a single queue entry with transactions & vitals
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const queueId = BigInt(id);

  const [queue, transactions, vitals, statuses] = await Promise.all([
    prisma.queue.findUnique({ where: { Id: queueId } }),
    prisma.transactions.findMany({ where: { IdQueue: queueId }, orderBy: { Id: "asc" } }),
    prisma.vitals.findFirst({ where: { IdQueue: queueId } }),
    prisma.queuestatus.findMany({ orderBy: { Id: "asc" } }),
  ]);

  if (!queue) {
    return NextResponse.json({ error: "Queue entry not found" }, { status: 404 });
  }

  return NextResponse.json({
    queue: {
      id:          Number(queue.Id),
      code:        queue.Code,
      idBU:        queue.IdBU ?? "",
      idPatient:   Number(queue.IdPatient),
      patientName: queue.QFullName  ?? "",
      lastName:    queue.QLastName  ?? "",
      firstName:   queue.QFirstName ?? "",
      middleName:  queue.QMiddleName ?? "",
      gender:      queue.QGender    ?? "",
      dob:         queue.QDOB?.toISOString().split("T")[0] ?? null,
      age:         queue.AgePatient,
      status:      queue.Status,
      patientType: queue.PatientType ?? "",
      accessionNo: queue.AccessionNo ?? "",
      notes:       queue.Notes ?? "",
      inputBy:     queue.InputBy,
      dateTime:    queue.DateTime?.toISOString() ?? queue.Date?.toISOString() ?? "",
    },
    transactions: transactions.map((tx) => ({
      id:                   Number(tx.Id),
      idDoctor:             tx.IdDoctor ? Number(tx.IdDoctor) : null,
      nameDoctor:           tx.NameDoctor ?? "",
      idCompany:            tx.IdCompany ?? 0,
      nameCompany:          tx.NameCompany ?? "",
      transactionType:      tx.TransactionType ?? "",
      codeItemPrice:        tx.CodeItemPrice ?? "",
      descriptionItemPrice: tx.DescriptionItemPrice ?? "",
      amount:               tx.AmountItemPrice ? Number(tx.AmountItemPrice) : 0,
      cardNumber:           tx.HCardNumber ?? "",
      inputBy:              tx.InputBy,
      status:               tx.Status,
    })),
    vitals: vitals ? {
      medication: vitals.Medication ?? "",
      lastDose:   vitals.LastDose ? vitals.LastDose.toISOString().slice(0, 16) : "",
      lastPeriod: vitals.LastPeriod ? vitals.LastPeriod.toISOString().split("T")[0] : "",
    } : { medication: "", lastDose: "", lastPeriod: "" },
    statuses: statuses.map((s) => ({ id: s.Id, name: s.Name })),
  });
}

// PATCH /api/queue/[id] — Update queue fields, vitals, and optionally append new transactions
const newTxSchema = z.object({
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

const patchSchema = z.object({
  status:          z.number().int().optional(),
  notes:           z.string().optional(),
  accessionNo:     z.string().optional(),
  medication:      z.string().optional(),
  lastDose:        z.string().nullable().optional(),
  lastPeriod:      z.string().nullable().optional(),
  newTransactions: z.array(newTxSchema).optional(),
});

export async function PATCH(
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

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { status, notes, accessionNo, medication, lastDose, lastPeriod, newTransactions } = parsed.data;
  const updateBy = session.user.username || session.user.id || "system";

  await prisma.queue.update({
    where: { Id: queueId },
    data: {
      ...(status      !== undefined && { Status:      status }),
      ...(notes       !== undefined && { Notes:       notes }),
      ...(accessionNo !== undefined && { AccessionNo: accessionNo }),
      UpdateBy:   updateBy,
      UpdateDate: new Date(),
    },
  });

  if (medication !== undefined || lastDose !== undefined || lastPeriod !== undefined) {
    const existing = await prisma.vitals.findFirst({ where: { IdQueue: queueId } });
    const vitalsData = {
      ...(medication !== undefined && { Medication: medication || null }),
      ...(lastDose   !== undefined && { LastDose:   lastDose ? new Date(lastDose) : null }),
      ...(lastPeriod !== undefined && { LastPeriod: lastPeriod ? new Date(`${lastPeriod}T00:00:00Z`) : null }),
    };
    if (existing) {
      await prisma.vitals.update({ where: { Id: existing.Id }, data: vitalsData });
    } else {
      await prisma.vitals.create({
        data: { IdQueue: queueId, InputBy: updateBy, InputDateTime: new Date(), ...vitalsData },
      });
    }
  }

  // Append new transactions if provided
  if (newTransactions && newTransactions.length > 0) {
    const todayStr = new Date().toLocaleDateString("en-CA");
    const today    = new Date(`${todayStr}T00:00:00Z`);
    await prisma.transactions.createMany({
      data: newTransactions.map((tx) => ({
        IdQueue:              queueId,
        Date:                 today,
        IdDoctor:             tx.idDoctor ? BigInt(tx.idDoctor) : null,
        NameDoctor:           tx.nameDoctor || null,
        IdCompany:            tx.idCompany,
        NameCompany:          tx.nameCompany,
        TransactionType:      tx.transactionType || null,
        IdItemPrice:          BigInt(tx.idItemPrice),
        CodeItemPrice:        tx.codeItemPrice,
        DescriptionItemPrice: tx.descriptionItemPrice,
        PriceGroupItemPrice:  tx.priceGroupItemPrice || "Item",
        AmountItemPrice:      tx.amountItemPrice,
        AmountRemaining:      tx.amountItemPrice,
        ReadersFee:           tx.readersFee,
        OrigAmount:           tx.origAmount,
        GroupItemMaster:      tx.groupItemMaster || null,
        InputBy:              updateBy.slice(0, 30),
        Status:               201,
      })),
    });
  }

  return NextResponse.json({ success: true });
}
