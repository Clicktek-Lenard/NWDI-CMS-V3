import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const vitalsSchema = z.object({
  patient_id: z.string(),
  chief_complaint: z.string().optional(),
  pcp_id: z.number().int().optional().nullable(),
  pcp_name: z.string().optional().nullable(),
  // BP — 3 readings (systolic/diastolic)
  bp_systolic: z.number().int().nullable().optional(),
  bp_diastolic: z.number().int().nullable().optional(),
  bp_systolic_2: z.number().int().nullable().optional(),
  bp_diastolic_2: z.number().int().nullable().optional(),
  bp_systolic_3: z.number().int().nullable().optional(),
  bp_diastolic_3: z.number().int().nullable().optional(),
  // Basic vitals
  heart_rate: z.string().optional().nullable(),
  temperature: z.string().optional().nullable(),
  respiratory_rate: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  // Vision — Far
  uncorrected_od: z.string().optional().nullable(),
  uncorrected_os: z.string().optional().nullable(),
  corrected_od: z.string().optional().nullable(),
  corrected_os: z.string().optional().nullable(),
  // Vision — Near
  uncorrected_near_od: z.string().optional().nullable(),
  uncorrected_near_os: z.string().optional().nullable(),
  corrected_near_od: z.string().optional().nullable(),
  corrected_near_os: z.string().optional().nullable(),
  with_contact_lens: z.string().optional().nullable(),
  with_eyeglass: z.string().optional().nullable(),
  color_vision: z.string().optional().nullable(),
  deficient: z.string().optional().nullable(),
});

function calcBMI(weight: string | null | undefined, height: string | null | undefined): { bmi: string | null; category: string | null } {
  if (!weight || !height) return { bmi: null, category: null };
  const w = parseFloat(weight);
  const h = parseFloat(height);
  if (!w || !h) return { bmi: null, category: null };
  const heightM = h / 100;
  const bmiVal = w / (heightM * heightM);
  const bmi = bmiVal.toFixed(2);
  let category = "Normal";
  if (bmiVal < 18.5) category = "Underweight";
  else if (bmiVal >= 30) category = "Obese";
  else if (bmiVal >= 25) category = "Overweight";
  return { bmi, category };
}

type Params = { params: Promise<{ queueId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;

    const vitals = await prisma.vitals.findFirst({
      where: { IdQueue: BigInt(queueId) },
      orderBy: { InputDate: "desc" },
    });

    if (!vitals) return NextResponse.json({ success: true, data: null });

    return NextResponse.json({
      success: true,
      data: {
        id: Number(vitals.Id),
        queueId: Number(vitals.IdQueue),
        pcpId: vitals.PcpId ? Number(vitals.PcpId) : null,
        pcpName: vitals.PcpName,
        chiefComplaint: vitals.ChiefComplaint,
        bpSystolic: vitals.BloodPresure,
        bpDiastolic: vitals.BloodPresureOver,
        bpSystolic2: vitals.BloodPresure2,
        bpDiastolic2: vitals.BloodPresureOver2,
        bpSystolic3: vitals.BloodPresure3,
        bpDiastolic3: vitals.BloodPresureOver3,
        heartRate: vitals.PulseRate,
        temperature: vitals.Temperature,
        respiratoryRate: vitals.RespiratoryRate,
        weight: vitals.Weight,
        height: vitals.Height,
        bmi: vitals.BMI,
        bmiCategory: vitals.BMICategory,
        uncorrectedOd: vitals.UcorrectedOD,
        uncorrectedOs: vitals.UcorrectedOS,
        correctedOd: vitals.CorrectedOD,
        correctedOs: vitals.CorrectedOS,
        uncorrectedNearOd: vitals.UncorrectedNearOD,
        uncorrectedNearOs: vitals.UncorrectedNearOS,
        correctedNearOd: vitals.CorrectedNearOD,
        correctedNearOs: vitals.CorrectedNearOS,
        withContactLens: vitals.WithContactLens,
        withEyeglass: vitals.WithEyeGlass,
        colorVision: vitals.ColorVision,
        deficient: vitals.Deficient,
        inputBy: vitals.InputBy,
        inputDate: vitals.InputDate?.toISOString() ?? null,
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;
    const qid = BigInt(queueId);

    const body = await request.json();
    const parsed = vitalsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const { bmi, category: bmiCategory } = calcBMI(data.weight, data.height);

    // Get queue code for the record
    const queue = await prisma.queue.findFirst({ where: { Id: qid } });
    const queueCode = queue?.Code ?? "";

    const writeData = {
      QueueCode: queueCode,
      PcpId: data.pcp_id ? BigInt(data.pcp_id) : null,
      PcpName: data.pcp_name ?? null,
      ChiefComplaint: data.chief_complaint ?? null,
      BloodPresure: data.bp_systolic ?? null,
      BloodPresureOver: data.bp_diastolic ?? null,
      BloodPresure2: data.bp_systolic_2 ?? null,
      BloodPresureOver2: data.bp_diastolic_2 ?? null,
      BloodPresure3: data.bp_systolic_3 ?? null,
      BloodPresureOver3: data.bp_diastolic_3 ?? null,
      PulseRate: data.heart_rate ?? null,
      Temperature: data.temperature ?? null,
      RespiratoryRate: data.respiratory_rate ?? null,
      Weight: data.weight ?? null,
      Height: data.height ?? null,
      BMI: bmi,
      BMICategory: bmiCategory,
      UcorrectedOD: data.uncorrected_od ?? null,
      UcorrectedOS: data.uncorrected_os ?? null,
      CorrectedOD: data.corrected_od ?? null,
      CorrectedOS: data.corrected_os ?? null,
      UncorrectedNearOD: data.uncorrected_near_od ?? null,
      UncorrectedNearOS: data.uncorrected_near_os ?? null,
      CorrectedNearOD: data.corrected_near_od ?? null,
      CorrectedNearOS: data.corrected_near_os ?? null,
      WithContactLens: data.with_contact_lens ?? null,
      WithEyeGlass: data.with_eyeglass ?? null,
      ColorVision: data.color_vision ?? null,
      Deficient: data.deficient ?? null,
      InputBy: session.user.name ?? session.user.id,
      InputDate: new Date(),
    };

    const existing = await prisma.vitals.findFirst({ where: { IdQueue: qid } });

    const vitals = existing
      ? await prisma.vitals.update({ where: { Id: existing.Id }, data: writeData })
      : await prisma.vitals.create({ data: { IdQueue: qid, ...writeData } });

    // Auto-transition: update ConsultationNote status to IN_PROGRESS
    await prisma.consultationNote.upsert({
      where: { queue_id: Number(qid) },
      update: { status: "IN_PROGRESS" },
      create: {
        queue_id: Number(qid),
        patient_id: data.patient_id,
        status: "IN_PROGRESS",
      },
    }).catch(() => { /* ignore if table not ready */ });

    return NextResponse.json({ success: true, data: { id: Number(vitals.Id) } });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
