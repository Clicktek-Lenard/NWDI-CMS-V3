import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const vitalsSchema = z.object({
  patient_id: z.string(),
  // Chief complaint (recorded at vitals station per DOCTOR_MODULE.md)
  chief_complaint: z.string().optional(),
  // PCP assignment
  pcp_id: z.string().optional().nullable(),
  pcp_name: z.string().optional().nullable(),
  // BP — 3 readings
  bp_systolic: z.number().int().min(0).max(300).nullable().optional(),
  bp_diastolic: z.number().int().min(0).max(200).nullable().optional(),
  bp_systolic_2: z.number().int().min(0).max(300).nullable().optional(),
  bp_diastolic_2: z.number().int().min(0).max(200).nullable().optional(),
  bp_systolic_3: z.number().int().min(0).max(300).nullable().optional(),
  bp_diastolic_3: z.number().int().min(0).max(200).nullable().optional(),
  // Basic vitals
  heart_rate: z.number().int().min(0).max(300).nullable().optional(),
  temperature: z.number().min(30).max(45).nullable().optional(),
  respiratory_rate: z.number().int().min(0).max(60).nullable().optional(),
  o2_saturation: z.number().int().min(0).max(100).nullable().optional(),
  weight: z.number().min(0).max(300).nullable().optional(),
  height: z.number().min(0).max(250).nullable().optional(),
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
  // Vision flags
  with_contact_lens: z.number().int().min(0).max(1).optional(),
  with_eyeglass: z.number().int().min(0).max(1).optional(),
  color_vision: z.string().optional().nullable(),
});

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

type Params = { params: Promise<{ queueId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;

    const vitals = await prisma.vitals.findFirst({
      where: { queue_id: parseInt(queueId, 10) },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ success: true, data: vitals ?? null });
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
    const qid = parseInt(queueId, 10);

    const body = await request.json();
    const parsed = vitalsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Auto-calculate BMI
    let bmi: number | null = null;
    let bmi_category: string | null = null;
    if (data.weight && data.height && data.height > 0) {
      const heightM = data.height / 100;
      bmi = parseFloat((data.weight / (heightM * heightM)).toFixed(2));
      bmi_category = bmiCategory(bmi);
    }

    const writeData = {
      chief_complaint: data.chief_complaint ?? null,
      pcp_id: data.pcp_id ?? null,
      pcp_name: data.pcp_name ?? null,
      bp_systolic: data.bp_systolic ?? null,
      bp_diastolic: data.bp_diastolic ?? null,
      bp_systolic_2: data.bp_systolic_2 ?? null,
      bp_diastolic_2: data.bp_diastolic_2 ?? null,
      bp_systolic_3: data.bp_systolic_3 ?? null,
      bp_diastolic_3: data.bp_diastolic_3 ?? null,
      heart_rate: data.heart_rate ?? null,
      temperature: data.temperature ?? null,
      respiratory_rate: data.respiratory_rate ?? null,
      o2_saturation: data.o2_saturation ?? null,
      weight: data.weight ?? null,
      height: data.height ?? null,
      bmi,
      bmi_category,
      uncorrected_od: data.uncorrected_od ?? null,
      uncorrected_os: data.uncorrected_os ?? null,
      corrected_od: data.corrected_od ?? null,
      corrected_os: data.corrected_os ?? null,
      uncorrected_near_od: data.uncorrected_near_od ?? null,
      uncorrected_near_os: data.uncorrected_near_os ?? null,
      corrected_near_od: data.corrected_near_od ?? null,
      corrected_near_os: data.corrected_near_os ?? null,
      with_contact_lens: data.with_contact_lens ?? 0,
      with_eyeglass: data.with_eyeglass ?? 0,
      color_vision: data.color_vision ?? null,
      recorded_by: parseInt(session.user.id),
    };

    const existing = await prisma.vitals.findFirst({ where: { queue_id: qid } });

    const vitals = existing
      ? await prisma.vitals.update({ where: { id: existing.id }, data: writeData })
      : await prisma.vitals.create({
          data: { queue_id: qid, patient_id: data.patient_id, ...writeData },
        });

    // Auto-transition WAITING → IN_PROGRESS when vitals saved
    await prisma.queue.updateMany({
      where: { id: qid, status: "WAITING" },
      data: { status: "IN_PROGRESS" },
    });

    return NextResponse.json({ success: true, data: vitals });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
