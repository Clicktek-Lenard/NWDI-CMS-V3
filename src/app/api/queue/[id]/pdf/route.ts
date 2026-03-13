import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";

import { ChargeSlipDocument }  from "@/lib/pdf/charge-slip";
import { OfficialReceiptDocument } from "@/lib/pdf/official-receipt";
import { DrfDocument }         from "@/lib/pdf/drf";
import { RoutingSlipDocument } from "@/lib/pdf/routing-slip";
import { LabResultDocument }   from "@/lib/pdf/lab-result";

// ── Clinic registry (extend as needed) ──────────────────────────

const CLINIC_INFO: Record<string, { name: string; address: string; tin: string }> = {
  CEN: { name: "NWDI Central", address: "Central Clinic, Philippines", tin: "" },
  SMB: { name: "NWDI Samboan", address: "Samboan Clinic, Philippines", tin: "" },
  TAR: { name: "NWDI Tarcela", address: "Tarcela Clinic, Philippines", tin: "" },
};

function getClinic(code: string) {
  return { code, ...( CLINIC_INFO[code] ?? { name: `NWDI ${code}`, address: "", tin: "" }) };
}

// ── GET /api/queue/[id]/pdf?type=charge-slip|or|drf|routing-slip|lab-result ──

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");

  const { id } = await params;
  const queueId = BigInt(id);
  const type = request.nextUrl.searchParams.get("type") ?? "charge-slip";

  const VALID_TYPES = ["charge-slip", "or", "drf", "routing-slip", "lab-result"] as const;
  if (!(VALID_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
  }

  // ── Fetch data ──────────────────────────────────────────────
  const [queue, transactions, statuses] = await Promise.all([
    prisma.queue.findUnique({ where: { Id: queueId } }),
    prisma.transactions.findMany({
      where: { IdQueue: queueId, Status: { lt: 650 } },
      orderBy: { Id: "asc" },
    }),
    prisma.queuestatus.findMany({ orderBy: { Id: "asc" } }),
  ]);

  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }

  const statusMap = new Map(statuses.map((s) => [s.Id, s.Name]));
  const clinicCode = queue.IdBU ?? "CEN";
  const clinic = getClinic(clinicCode);
  const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });

  const queueBase = {
    id:          Number(queue.Id),
    code:        queue.Code ?? "",
    date:        queue.Date.toISOString().slice(0, 10),
    accessionNo: queue.Code ?? "",
    patientName: queue.QFullName ?? "",
    dob:         queue.DateOfBirth?.toISOString().slice(0, 10) ?? null,
    gender:      queue.Gender ?? "",
    age:         queue.Age ? Number(queue.Age) : null,
    patientType: queue.PatientType ?? "",
    inputBy:     queue.InputBy ?? "",
  };

  // Primary doctor = first transaction's doctor
  const primaryDoctor = transactions[0]?.NameDoctor ?? "";

  let docElement: React.ReactElement;
  let filename = `${type}-${queue.Code}`;

  // ── Build document per type ─────────────────────────────────

  if (type === "charge-slip") {
    docElement = React.createElement(ChargeSlipDocument, {
      data: {
        clinic,
        queue: queueBase,
        transactions: transactions.map((tx) => ({
          codeItemPrice:        tx.CodeItemPrice ?? "",
          descriptionItemPrice: tx.DescriptionItemPrice ?? "",
          nameDoctor:           tx.NameDoctor ?? "",
          nameCompany:          tx.NameCompany ?? "",
          transactionType:      tx.TransactionType ?? "",
          amount:               tx.AmountItemPrice ? Number(tx.AmountItemPrice) : 0,
        })),
        total: transactions.reduce((s, tx) => s + (tx.AmountItemPrice ? Number(tx.AmountItemPrice) : 0), 0),
        generatedAt: now,
      },
    });
    filename = `charge-slip-${queue.Code}`;
  }

  else if (type === "or") {
    docElement = React.createElement(OfficialReceiptDocument, {
      data: {
        clinic,
        queue: queueBase,
        transactions: transactions.map((tx) => ({
          codeItemPrice:        tx.CodeItemPrice ?? "",
          descriptionItemPrice: tx.DescriptionItemPrice ?? "",
          nameDoctor:           tx.NameDoctor ?? "",
          nameCompany:          tx.NameCompany ?? "",
          transactionType:      tx.TransactionType ?? "",
          amount:               tx.AmountItemPrice ? Number(tx.AmountItemPrice) : 0,
          orNumber:             tx.HCardNumber ?? "",
        })),
        total: transactions.reduce((s, tx) => s + (tx.AmountItemPrice ? Number(tx.AmountItemPrice) : 0), 0),
        generatedAt: now,
      },
    });
    filename = `official-receipt-${queue.Code}`;
  }

  else if (type === "drf") {
    docElement = React.createElement(DrfDocument, {
      data: {
        clinic,
        queue: queueBase,
        doctor: primaryDoctor,
        items: transactions.map((tx) => ({
          code:        tx.CodeItemPrice ?? "",
          description: tx.DescriptionItemPrice ?? "",
          type:        tx.TransactionType ?? "",
          quantity:    1,
          unit:        "pc",
          remarks:     tx.NameCompany ?? "",
        })),
        generatedAt: now,
      },
    });
    filename = `drf-${queue.Code}`;
  }

  else if (type === "routing-slip") {
    // Group transactions by transaction type (department)
    const deptMap = new Map<string, string[]>();
    for (const tx of transactions) {
      const dept = tx.TransactionType || "General";
      if (!deptMap.has(dept)) deptMap.set(dept, []);
      deptMap.get(dept)!.push(tx.DescriptionItemPrice ?? "");
    }
    const stations = Array.from(deptMap.entries()).map(([department, procedures]) => ({
      department,
      procedures,
    }));

    docElement = React.createElement(RoutingSlipDocument, {
      data: {
        clinic,
        queue: queueBase,
        doctor: primaryDoctor,
        stations,
        generatedAt: now,
      },
    });
    filename = `routing-slip-${queue.Code}`;
  }

  else {
    // lab-result — build a representative sample from transaction descriptions
    const labTests = transactions.map((tx) => ({
      category: tx.TransactionType || "Laboratory",
      name:     tx.DescriptionItemPrice ?? "",
      result:   "",          // results come from LIS/EROS; blank in CMS
      unit:     "",
      normalRange: "",
      flag:     "" as "" | "H" | "L" | "C",
    }));

    docElement = React.createElement(LabResultDocument, {
      data: {
        clinic,
        queue: queueBase,
        doctor: primaryDoctor,
        tests: labTests.length > 0 ? labTests : [
          // placeholder row when no transactions
          { category: "Laboratory", name: "No lab tests found", result: "—", unit: "", normalRange: "", flag: "" as "" | "H" | "L" | "C" },
        ],
        generatedAt: now,
      },
    });
    filename = `lab-result-${queue.Code}`;
  }

  // ── Render to PDF buffer ────────────────────────────────────
  const buffer = await renderToBuffer(docElement);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `inline; filename="${filename}.pdf"`,
      "Cache-Control":       "no-store",
    },
  });
}
