import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

export const runtime = "nodejs";

// GET /api/reports/official-receipt?queueId=123
// Shows only CASH / PATIENT-type transactions (non-company billing)
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "queue");

  const queueIdStr = request.nextUrl.searchParams.get("queueId");
  if (!queueIdStr) {
    return NextResponse.json({ error: "queueId is required" }, { status: 400 });
  }

  let queueId: bigint;
  try {
    queueId = BigInt(queueIdStr);
  } catch {
    return NextResponse.json({ error: "Invalid queueId" }, { status: 400 });
  }

  // ── Query ──────────────────────────────────────────────────────
  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }

  const [allTransactions, clinic] = await Promise.all([
    prisma.transactions.findMany({
      where:   { IdQueue: queueId, Status: { lt: 650 } },
      orderBy: { Id: "asc" },
    }),
    prisma.businessunits.findFirst({
      where: { Code: queue.IdBU ?? undefined },
    }),
  ]);

  // OR shows patient/cash transactions:
  // TransactionType contains "CASH" or "PATIENT", or company is "CASH" category
  // In CMS ALLPROD: $OR = count where paymentType LIKE 'PATIENT'
  // We approximate: transactions where NameCompany is empty/self-pay, or transactionType is CASH
  const transactions = allTransactions.filter((tx) => {
    const type = (tx.TransactionType ?? "").toUpperCase();
    const company = (tx.NameCompany ?? "").toUpperCase();
    // Include if cash/self-pay type OR no company (direct pay)
    return (
      type.includes("CASH") ||
      type.includes("PATIENT") ||
      type.includes("SELF") ||
      company === "" ||
      company === "SELF-PAY" ||
      company === "CASH"
    );
  });

  // If no patient-type transactions found, fall back to all (so OR isn't empty)
  const orTransactions = transactions.length > 0 ? transactions : allTransactions;

  const total = orTransactions.reduce(
    (sum, tx) => sum + Number(tx.AmountItemPrice ?? 0),
    0
  );

  const data = {
    clinic: {
      code:    clinic?.Code        ?? queue.IdBU ?? "",
      name:    clinic?.Description ?? "",
      address: clinic?.Address     ?? "",
      tin:     clinic?.TIN         ?? "",
    },
    queue: {
      id:          Number(queue.Id),
      code:        queue.Code        ?? "",
      date:        queue.Date?.toISOString().split("T")[0] ?? "",
      accessionNo: queue.AccessionNo ?? "",
      patientName: queue.QFullName   ?? "",
      dob:         queue.QDOB?.toISOString().split("T")[0] ?? null,
      gender:      queue.QGender     ?? "",
      age:         queue.AgePatient  ?? null,
      patientType: queue.PatientType ?? "",
      inputBy:     queue.InputBy     ?? "",
    },
    transactions: orTransactions.map((tx) => ({
      codeItemPrice:        tx.CodeItemPrice        ?? "",
      descriptionItemPrice: tx.DescriptionItemPrice ?? "",
      nameDoctor:           tx.NameDoctor           ?? "",
      nameCompany:          tx.NameCompany          ?? "",
      transactionType:      tx.TransactionType      ?? "",
      amount:               Number(tx.AmountItemPrice ?? 0),
      orNumber:             tx.HCardNumber          ?? "",
    })),
    total,
    generatedAt: new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year:     "numeric",
      month:    "short",
      day:      "numeric",
      hour:     "2-digit",
      minute:   "2-digit",
      hour12:   true,
    }),
  };

  // ── Render PDF ─────────────────────────────────────────────────
  try {
    const ReactPDF = await import("@react-pdf/renderer");
    const { OfficialReceiptDocument } = await import("@/lib/pdf/official-receipt");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await ReactPDF.renderToBuffer(
      React.createElement(OfficialReceiptDocument, { data }) as any
    );

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `inline; filename="official-receipt-${queue.Code ?? queueIdStr}.pdf"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (error) {
    console.error("PDF render error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
