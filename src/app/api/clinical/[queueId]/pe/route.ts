import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const peSchema = z.object({
  patient_id: z.string(),
  fitness_class: z.enum(["A", "B", "C", "D", "Pending"]).optional().nullable(),
  checked_by: z.string().optional().nullable(),
  // Medical History
  liver_gallbladder: z.number().int().min(0).max(1).optional(),
  heart_disease: z.number().int().min(0).max(1).optional(),
  asthma_allergy: z.number().int().min(0).max(1).optional(),
  tuberculosis: z.number().int().min(0).max(1).optional(),
  ent_disorder: z.number().int().min(0).max(1).optional(),
  eye_disorder: z.number().int().min(0).max(1).optional(),
  diabetes_mellitus: z.number().int().min(0).max(1).optional(),
  chronic_headache: z.number().int().min(0).max(1).optional(),
  hypertension: z.number().int().min(0).max(1).optional(),
  kidney_disease: z.number().int().min(0).max(1).optional(),
  cancer: z.number().int().min(0).max(1).optional(),
  std: z.number().int().min(0).max(1).optional(),
  past_med_others: z.string().optional().nullable(),
  // Social History
  present_smoker: z.number().int().min(0).max(1).optional(),
  smoker_sticks_per_day: z.string().optional().nullable(),
  smoker_years: z.string().optional().nullable(),
  previous_smoker: z.number().int().min(0).max(1).optional(),
  prev_smoker_sticks: z.string().optional().nullable(),
  prev_smoker_years: z.string().optional().nullable(),
  alcohol_drinker: z.number().int().min(0).max(1).optional(),
  prev_alcohol_drinker: z.number().int().min(0).max(1).optional(),
  social_others: z.string().optional().nullable(),
  // OB-GYN
  menarche: z.string().optional().nullable(),
  menopausal_age: z.string().optional().nullable(),
  last_menstruation: z.string().optional().nullable(),
  menstrual_period: z.string().optional().nullable(),
  obgyn_others: z.string().optional().nullable(),
  // Family History
  fam_asthma: z.number().int().min(0).max(1).optional(),
  fam_diabetes: z.number().int().min(0).max(1).optional(),
  fam_goiter: z.number().int().min(0).max(1).optional(),
  fam_ptb: z.number().int().min(0).max(1).optional(),
  fam_heart_disease: z.number().int().min(0).max(1).optional(),
  fam_hypertension: z.number().int().min(0).max(1).optional(),
  fam_kidney: z.number().int().min(0).max(1).optional(),
  fam_others: z.string().optional().nullable(),
  // PE Findings per body system
  skin: z.string().optional().nullable(),
  head_scalp: z.string().optional().nullable(),
  eyes: z.string().optional().nullable(),
  ears_hearing: z.string().optional().nullable(),
  nose_sinuses: z.string().optional().nullable(),
  mouth_throat: z.string().optional().nullable(),
  neck_thyroid: z.string().optional().nullable(),
  chest_breast: z.string().optional().nullable(),
  lungs: z.string().optional().nullable(),
  heart: z.string().optional().nullable(),
  abdomen: z.string().optional().nullable(),
  back_flanks: z.string().optional().nullable(),
  extremities: z.string().optional().nullable(),
  neurological: z.string().optional().nullable(),
  genitals_urinary: z.string().optional().nullable(),
  anus_rectum: z.string().optional().nullable(),
});

type Params = { params: Promise<{ queueId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;

    const pe = await prisma.physicalExamination.findUnique({
      where: { queue_id: parseInt(queueId, 10) },
    });

    return NextResponse.json({ success: true, data: pe ?? null });
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
    const parsed = peSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const recordedBy = parseInt(session.user.id);

    const writeData = {
      fitness_class: data.fitness_class ?? null,
      checked_by: data.checked_by ?? null,
      liver_gallbladder: data.liver_gallbladder ?? 0,
      heart_disease: data.heart_disease ?? 0,
      asthma_allergy: data.asthma_allergy ?? 0,
      tuberculosis: data.tuberculosis ?? 0,
      ent_disorder: data.ent_disorder ?? 0,
      eye_disorder: data.eye_disorder ?? 0,
      diabetes_mellitus: data.diabetes_mellitus ?? 0,
      chronic_headache: data.chronic_headache ?? 0,
      hypertension: data.hypertension ?? 0,
      kidney_disease: data.kidney_disease ?? 0,
      cancer: data.cancer ?? 0,
      std: data.std ?? 0,
      past_med_others: data.past_med_others ?? null,
      present_smoker: data.present_smoker ?? 0,
      smoker_sticks_per_day: data.smoker_sticks_per_day ?? null,
      smoker_years: data.smoker_years ?? null,
      previous_smoker: data.previous_smoker ?? 0,
      prev_smoker_sticks: data.prev_smoker_sticks ?? null,
      prev_smoker_years: data.prev_smoker_years ?? null,
      alcohol_drinker: data.alcohol_drinker ?? 0,
      prev_alcohol_drinker: data.prev_alcohol_drinker ?? 0,
      social_others: data.social_others ?? null,
      menarche: data.menarche ?? null,
      menopausal_age: data.menopausal_age ?? null,
      last_menstruation: data.last_menstruation ? new Date(data.last_menstruation) : null,
      menstrual_period: data.menstrual_period ?? null,
      obgyn_others: data.obgyn_others ?? null,
      fam_asthma: data.fam_asthma ?? 0,
      fam_diabetes: data.fam_diabetes ?? 0,
      fam_goiter: data.fam_goiter ?? 0,
      fam_ptb: data.fam_ptb ?? 0,
      fam_heart_disease: data.fam_heart_disease ?? 0,
      fam_hypertension: data.fam_hypertension ?? 0,
      fam_kidney: data.fam_kidney ?? 0,
      fam_others: data.fam_others ?? null,
      skin: data.skin ?? null,
      head_scalp: data.head_scalp ?? null,
      eyes: data.eyes ?? null,
      ears_hearing: data.ears_hearing ?? null,
      nose_sinuses: data.nose_sinuses ?? null,
      mouth_throat: data.mouth_throat ?? null,
      neck_thyroid: data.neck_thyroid ?? null,
      chest_breast: data.chest_breast ?? null,
      lungs: data.lungs ?? null,
      heart: data.heart ?? null,
      abdomen: data.abdomen ?? null,
      back_flanks: data.back_flanks ?? null,
      extremities: data.extremities ?? null,
      neurological: data.neurological ?? null,
      genitals_urinary: data.genitals_urinary ?? null,
      anus_rectum: data.anus_rectum ?? null,
      recorded_by: recordedBy,
    };

    const pe = await prisma.physicalExamination.upsert({
      where: { queue_id: qid },
      update: writeData,
      create: { queue_id: qid, patient_id: data.patient_id, ...writeData },
    });

    return NextResponse.json({ success: true, data: pe });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
