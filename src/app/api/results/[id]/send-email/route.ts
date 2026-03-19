import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";
import nodemailer from "nodemailer";
import React from "react";
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer";
import { LabResultDocument } from "@/lib/pdf/lab-result";

const bodySchema = z.object({
  email: z.string().email(),
});

const CLINIC_INFO: Record<string, { name: string; address: string }> = {
  CEN: { name: "NWDI Central",  address: "Central Clinic, Philippines" },
  SMB: { name: "NWDI Samboan",  address: "Samboan Clinic, Philippines" },
  TAR: { name: "NWDI Tarcela",  address: "Tarcela Clinic, Philippines" },
};

// POST /api/results/[id]/send-email
// Generates a lab-result PDF and sends it to the given email address.
// Queue must already be released (Status 600).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "results");
  const { id } = await params;
  const queueId = BigInt(id);

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
  }
  const { email } = parsed.data;

  const [queue, transactions, resultValues] = await Promise.all([
    prisma.queue.findUnique({ where: { Id: queueId } }),
    prisma.transactions.findMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      orderBy: { Id: "asc" },
    }),
    prisma.resultValue.findMany({ where: { queue_id: queueId } }),
  ]);

  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }

  if (queue.Status < 500) {
    return NextResponse.json(
      { error: "Results have not been released yet" },
      { status: 422 }
    );
  }

  const clinicCode = queue.IdBU ?? "CEN";
  const clinicMeta = CLINIC_INFO[clinicCode] ?? { name: `NWDI ${clinicCode}`, address: "" };
  const clinic = { code: clinicCode, ...clinicMeta, tin: "" };

  const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
  const primaryDoctor = transactions[0]?.NameDoctor ?? "";

  const queueBase = {
    id:          Number(queue.Id),
    code:        queue.Code ?? "",
    date:        queue.Date.toISOString().slice(0, 10),
    accessionNo: queue.Code ?? "",
    patientName: queue.QFullName ?? "",
    dob:         queue.QDOB?.toISOString().slice(0, 10) ?? null,
    gender:      queue.QGender ?? "",
    age:         queue.AgePatient ? Number(queue.AgePatient) : null,
    patientType: queue.PatientType ?? "",
    inputBy:     queue.InputBy ?? "",
  };

  const rvMap = new Map(resultValues.map((rv) => [rv.accession_id, rv]));
  const tests = transactions.map((tx) => {
    const rv = rvMap.get(tx.Id);
    return {
      category:    tx.TransactionType || "Laboratory",
      name:        tx.DescriptionItemPrice ?? "",
      result:      rv?.result_value  ?? "",
      unit:        rv?.result_unit   ?? "",
      normalRange: rv?.normal_range  ?? "",
      flag:        (rv?.flag ?? "") as "" | "H" | "L" | "C",
    };
  });

  // ── Generate PDF ─────────────────────────────────────────────
  const docElement = React.createElement(LabResultDocument, {
    data: {
      clinic,
      queue: queueBase,
      doctor: primaryDoctor,
      tests: tests.length > 0 ? tests : [
        { category: "Laboratory", name: "No results", result: "—", unit: "", normalRange: "", flag: "" as "" | "H" | "L" | "C" },
      ],
      generatedAt: now,
    },
  });
  const pdfBuffer = await renderToBuffer(docElement as React.ReactElement<DocumentProps>);

  // ── Send via SMTP ─────────────────────────────────────────────
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM ?? smtpUser ?? "noreply@nwdi.com";

  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: "SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment." },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host:   smtpHost,
    port:   smtpPort,
    secure: smtpPort === 465,
    auth:   { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from:    `"${clinic.name}" <${smtpFrom}>`,
    to:      email,
    subject: `Lab Results — ${queue.QFullName} (${queue.Code})`,
    text: [
      `Dear ${queue.QFullName},`,
      "",
      `Please find attached your laboratory results from ${clinic.name}.`,
      `Queue: ${queue.Code}  |  Date: ${queueBase.date}`,
      "",
      "This is a system-generated email. Please do not reply.",
      `Sent by: ${session.user.username ?? session.user.id}`,
    ].join("\n"),
    attachments: [
      {
        filename:    `lab-result-${queue.Code}.pdf`,
        content:     Buffer.from(pdfBuffer),
        contentType: "application/pdf",
      },
    ],
  });

  return NextResponse.json({ success: true, sentTo: email });
}
