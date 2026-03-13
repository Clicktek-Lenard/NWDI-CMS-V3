import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

export const runtime = "nodejs";

// GET /api/reports/charge-slip?queueId=123
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

  const [transactions, clinic] = await Promise.all([
    prisma.transactions.findMany({
      where:   { IdQueue: queueId, Status: { lt: 650 } },
      orderBy: { Id: "asc" },
    }),
    prisma.businessunits.findFirst({
      where: { Code: queue.IdBU ?? undefined },
    }),
  ]);

  // ── Build data ─────────────────────────────────────────────────
  const total = transactions.reduce(
    (sum, tx) => sum + Number(tx.AmountItemPrice ?? 0),
    0
  );

  const data = {
    clinic: {
      code:    clinic?.Code    ?? queue.IdBU ?? "",
      name:    clinic?.Description ?? "",
      address: clinic?.Address  ?? "",
      tin:     clinic?.TIN      ?? "",
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
    transactions: transactions.map((tx) => ({
      codeItemPrice:        tx.CodeItemPrice        ?? "",
      descriptionItemPrice: tx.DescriptionItemPrice ?? "",
      nameDoctor:           tx.NameDoctor           ?? "",
      nameCompany:          tx.NameCompany          ?? "",
      transactionType:      tx.TransactionType      ?? "",
      amount:               Number(tx.AmountItemPrice ?? 0),
    })),
    total,
    generatedAt: new Date().toLocaleString("en-PH", {
      timeZone:   "Asia/Manila",
      year:       "numeric",
      month:      "short",
      day:        "numeric",
      hour:       "2-digit",
      minute:     "2-digit",
      hour12:     true,
    }),
  };

  // ── Render PDF ─────────────────────────────────────────────────
  try {
    const ReactPDF = await import("@react-pdf/renderer");
    const { ChargeSlipDocument } = await import("@/lib/pdf/charge-slip");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await ReactPDF.renderToBuffer(
      React.createElement(ChargeSlipDocument, { data }) as any
    );

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `inline; filename="charge-slip-${queue.Code ?? queueIdStr}.pdf"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (error) {
    console.error("PDF render error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
