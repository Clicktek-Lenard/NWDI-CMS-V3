import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { BarcodeLabelsDocument } from "@/lib/pdf/barcode-labels";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bwipjs = require("bwip-js/node") as { toBuffer: (opts: Record<string, unknown>) => Promise<Buffer> };

// GET /api/results/[id]/barcode-labels
// Generates a PDF of specimen labels for all accession numbers on a queue.
// One label per accessionno row (excluding cancelled / already released).
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "results");

  const { id } = await params;
  const queueId = BigInt(id);

  const [queue, accessions] = await Promise.all([
    prisma.queue.findUnique({
      where: { Id: queueId },
      select: { Id: true, Code: true, QFullName: true, QDOB: true, QGender: true, IdBU: true, Date: true },
    }),
    prisma.accessionno.findMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      orderBy: { Id: "asc" },
    }),
  ]);

  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }

  if (accessions.length === 0) {
    return NextResponse.json({ error: "No accession numbers found for this queue" }, { status: 404 });
  }

  const clinicCode = queue.IdBU ?? "CEN";
  const queueDate  = queue.Date.toISOString().slice(0, 10);
  const now        = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });

  // Generate Code128 barcode PNGs for each accession number
  async function makeBarcode(text: string): Promise<string> {
    try {
      const png = await bwipjs.toBuffer({
        bcid:        "code128",
        text,
        scale:       3,
        height:      10,   // bar height in mm
        includetext: false,
        backgroundcolor: "ffffff",
      });
      return `data:image/png;base64,${png.toString("base64")}`;
    } catch {
      return "";
    }
  }

  const labels = await Promise.all(
    accessions.map(async (a) => ({
      accessionNo:     a.AccessionNo ?? "—",
      barcodeDataUrl:  a.AccessionNo ? await makeBarcode(a.AccessionNo) : "",
      itemCode:        a.ItemCode ?? "",
      itemDescription: a.ItemDescription ?? "",
      itemGroup:       a.ItemGroup ?? "",
      type:            a.Type ?? "",
      queueCode:       queue.Code ?? "",
      patientName:     queue.QFullName ?? "",
      dob:             queue.QDOB?.toISOString().slice(0, 10) ?? null,
      gender:          queue.QGender ?? "",
      date:            queueDate,
      clinicCode,
    }))
  );

  const docElement = React.createElement(BarcodeLabelsDocument, {
    data: { labels, generatedAt: now },
  });

  // @ts-expect-error renderToBuffer type mismatch with React.createElement return type
  const buffer = await renderToBuffer(docElement);

  // @ts-expect-error Buffer is valid BodyInit in Next.js runtime
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `inline; filename="labels-${queue.Code}.pdf"`,
      "Cache-Control":       "no-store",
    },
  });
}
