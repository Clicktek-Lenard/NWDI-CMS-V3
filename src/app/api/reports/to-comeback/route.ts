import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import QRCode from "qrcode";

export const runtime = "nodejs";

// GET /api/reports/to-comeback?queueId=123
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

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }

  // First doctor on the queue (same logic as old CMS "D. Tuazon" display)
  const firstTx = await prisma.transactions.findFirst({
    where:   { IdQueue: queueId, Status: { lt: 650 } },
    orderBy: { Id: "asc" },
  });

  const doctorName  = firstTx?.NameDoctor || queue.QFullName || "";
  const clinicName  = queue.IdBU || "NWDI";
  const queueCode   = queue.Code ?? String(queueId);

  // Transaction date — human readable
  const txDate = queue.DateTime ?? queue.Date;
  const transactionDate = txDate
    ? txDate.toLocaleString("en-PH", {
        timeZone:  "Asia/Manila",
        day:       "2-digit",
        month:     "short",
        year:      "numeric",
        hour:      "2-digit",
        minute:    "2-digit",
        second:    "2-digit",
        hour12:    false,
      })
    : "";

  const printedAt = new Date().toLocaleString("en-PH", {
    timeZone:  "Asia/Manila",
    month:     "numeric",
    day:       "numeric",
    year:      "2-digit",
    hour:      "numeric",
    minute:    "2-digit",
    hour12:    true,
  });

  // Generate QR code as base64 PNG data URL
  const qrDataUrl = await QRCode.toDataURL(queueCode, {
    errorCorrectionLevel: "M",
    width: 200,
    margin: 1,
  });

  // Render PDF
  try {
    const ReactPDF = await import("@react-pdf/renderer");
    const { ToComebackDocument } = await import("@/lib/pdf/to-comeback");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await ReactPDF.renderToBuffer(
      React.createElement(ToComebackDocument, {
        data: { clinicName, doctorName, transactionDate, printedAt, qrDataUrl },
      }) as any
    );

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `inline; filename="to-comeback-${queueCode}.pdf"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (error) {
    console.error("PDF render error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
