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
import { ConsultationSummaryDocument } from "@/lib/pdf/consultation-summary";
import { PrescriptionDocument } from "@/lib/pdf/prescription";
import { ReferralSlipDocument } from "@/lib/pdf/referral-slip";
import { ImagingResultDocument } from "@/lib/pdf/imaging-result";

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

  const VALID_TYPES = ["charge-slip", "or", "drf", "routing-slip", "lab-result", "summary", "prescription", "referral-slip", "imaging-result"] as const;
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

  else if (type === "lab-result") {
    const resultValues = await prisma.resultValue.findMany({
      where: { queue_id: queueId },
    });
    const rvMap = new Map(resultValues.map((rv) => [rv.accession_id, rv]));

    const labTests = transactions.map((tx) => {
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

    docElement = React.createElement(LabResultDocument, {
      data: {
        clinic,
        queue: queueBase,
        doctor: primaryDoctor,
        tests: labTests.length > 0 ? labTests : [
          { category: "Laboratory", name: "No lab tests found", result: "—", unit: "", normalRange: "", flag: "" as "" | "H" | "L" | "C" },
        ],
        generatedAt: now,
      },
    });
    filename = `lab-result-${queue.Code}`;
  }

  else if (type === "summary") {
    // Fetch clinical data for consultation summary
    const queueIdInt = Number(queueId);
    const [vitals, evaluation] = await Promise.all([
      prisma.vitalSign.findUnique({ where: { queue_id: queueIdInt } }).catch(() => null),
      prisma.consultationNote.findUnique({ where: { queue_id: queueIdInt } }).catch(() => null),
    ]);

    docElement = React.createElement(ConsultationSummaryDocument, {
      data: {
        clinic,
        queue: {
          code:        queueBase.code,
          date:        queueBase.date,
          patientName: queueBase.patientName,
          dob:         queueBase.dob,
          gender:      queueBase.gender,
          age:         queueBase.age,
          patientType: queueBase.patientType,
        },
        vitals: vitals ? {
          bpSystolic:      vitals.bp_systolic,
          bpDiastolic:     vitals.bp_diastolic,
          bpSystolic2:     vitals.bp_systolic2,
          bpDiastolic2:    vitals.bp_diastolic2,
          bpSystolic3:     vitals.bp_systolic3,
          bpDiastolic3:    vitals.bp_diastolic3,
          heartRate:       vitals.heart_rate,
          temperature:     vitals.temperature ? Number(vitals.temperature) : null,
          respiratoryRate: vitals.respiratory_rate,
          weightKg:        vitals.weight_kg ? Number(vitals.weight_kg) : null,
          heightCm:        vitals.height_cm ? Number(vitals.height_cm) : null,
          bmi:             vitals.bmi ? Number(vitals.bmi) : null,
          visionRightOd:   vitals.vision_right_od,
          visionLeftOs:    vitals.vision_left_os,
          colorVision:     vitals.color_vision,
        } : null,
        evaluation: evaluation ? {
          chiefComplaint: evaluation.chief_complaint,
          historyIllness: evaluation.history_illness,
          pastHistory:    evaluation.past_history,
          familyHistory:  evaluation.family_history,
          peFindings:     evaluation.pe_findings,
          diagnosis:      evaluation.diagnosis,
          icdCode:        evaluation.icd_code,
          treatmentPlan:  evaluation.treatment_plan,
          orders:         evaluation.orders,
          doctorName:     evaluation.doctor_name,
        } : null,
        transactions: transactions.map((tx) => tx.DescriptionItemPrice ?? "").filter(Boolean),
        generatedAt: now,
      },
    });
    filename = `consultation-summary-${queue.Code}`;
  }

  else if (type === "prescription") {
    const prescription = await prisma.prescription.findFirst({
      where: { queue_id: queueId },
      include: { items: true },
      orderBy: { created_at: "desc" },
    });

    docElement = React.createElement(PrescriptionDocument, {
      data: {
        clinic,
        queue: {
          code:        queueBase.code,
          date:        queueBase.date,
          patientName: queueBase.patientName,
          age:         queueBase.age,
          gender:      queueBase.gender,
        },
        doctorName: prescription?.doctor_name ?? primaryDoctor,
        notes:      prescription?.notes ?? null,
        items: prescription?.items.map((i) => ({
          medication:   i.medication,
          dosage:       i.dosage,
          frequency:    i.frequency,
          duration:     i.duration,
          quantity:     i.quantity,
          instructions: i.instructions,
        })) ?? [],
        generatedAt: now,
      },
    });
    filename = `prescription-${queue.Code}`;
  }

  else if (type === "referral-slip") {
    const refTo    = request.nextUrl.searchParams.get("to") ?? "";
    const refBy    = request.nextUrl.searchParams.get("by") ?? primaryDoctor;
    const notes    = request.nextUrl.searchParams.get("notes") ?? "";

    docElement = React.createElement(ReferralSlipDocument, {
      data: {
        clinic,
        queue: {
          code:        queueBase.code,
          date:        queueBase.date,
          patientName: queueBase.patientName,
          age:         queueBase.age,
          gender:      queueBase.gender,
          patientType: queueBase.patientType,
        },
        referredTo: refTo,
        referredBy: refBy,
        tests: transactions.map((tx) => ({
          code:        tx.CodeItemPrice ?? "",
          description: tx.DescriptionItemPrice ?? "",
          type:        tx.TransactionType ?? "",
        })),
        notes,
        generatedAt: now,
      },
    });
    filename = `referral-slip-${queue.Code}`;
  }

  else if (type === "imaging-result") {
    const imagingResults = await prisma.imagingResult.findMany({
      where: { queue_id: queueId },
    });

    // Build accession map for accessionNo lookup
    const accessions = await prisma.accessionno.findMany({
      where: { IdQueue: queueId },
      select: { Id: true, AccessionNo: true, CodeItemPrice: true, DescriptionItemPrice: true },
    });
    const accMap = new Map(accessions.map((a) => [a.Id, a]));

    docElement = React.createElement(ImagingResultDocument, {
      data: {
        clinic,
        queue: queueBase,
        doctor: primaryDoctor,
        studies: imagingResults.map((ir) => {
          const acc = accMap.get(ir.accession_id);
          return {
            accessionNo:     acc?.AccessionNo ?? "",
            itemCode:        ir.item_code ?? acc?.CodeItemPrice ?? "",
            itemDescription: ir.item_description ?? acc?.DescriptionItemPrice ?? "",
            interpretation:  ir.interpretation ?? "",
            impression:      ir.impression ?? "",
            radiologistName: ir.radiologist_name ?? "",
            status:          ir.status,
          };
        }),
        generatedAt: now,
      },
    });
    filename = `imaging-result-${queue.Code}`;
  }

  else {
    return NextResponse.json({ error: "Unhandled PDF type" }, { status: 400 });
  }

  // ── Render to PDF buffer ────────────────────────────────────
  let buffer: Buffer;
  try {
    buffer = await renderToBuffer(docElement);
  } catch (err) {
    console.error("[PDF render error]", err);
    return NextResponse.json(
      { error: "PDF render failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `inline; filename="${filename}.pdf"`,
      "Cache-Control":       "no-store",
    },
  });
}
