import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const peSchema = z.object({
  patient_id: z.string(),
  // Medical History (booleans)
  hypertension: z.boolean().optional(),
  diabetes: z.boolean().optional(),
  asthma: z.boolean().optional(),
  heart_disease: z.boolean().optional(),
  thyroid_disease: z.boolean().optional(),
  kidney_disease: z.boolean().optional(),
  allergies: z.boolean().optional(),
  allergies_specify: z.string().optional().nullable(),
  surgery_history: z.boolean().optional(),
  surgery_specify: z.string().optional().nullable(),
  smoker: z.boolean().optional(),
  pack_years: z.number().optional().nullable(),
  alcoholic: z.boolean().optional(),
  // OB-GYN
  lmp: z.string().optional().nullable(),
  gravida: z.number().int().optional().nullable(),
  para: z.number().int().optional().nullable(),
  // Family History
  family_hypertension: z.boolean().optional(),
  family_diabetes: z.boolean().optional(),
  family_cancer: z.boolean().optional(),
  // PE Findings
  skin: z.string().optional().nullable(),
  heent: z.string().optional().nullable(),
  neck: z.string().optional().nullable(),
  chest_lungs: z.string().optional().nullable(),
  heart: z.string().optional().nullable(),
  abdomen: z.string().optional().nullable(),
  extremities: z.string().optional().nullable(),
  neurological: z.string().optional().nullable(),
  fitness_class: z.string().optional().nullable(),
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
      hypertension: data.hypertension ?? false,
      diabetes: data.diabetes ?? false,
      asthma: data.asthma ?? false,
      heart_disease: data.heart_disease ?? false,
      thyroid_disease: data.thyroid_disease ?? false,
      kidney_disease: data.kidney_disease ?? false,
      allergies: data.allergies ?? false,
      allergies_specify: data.allergies_specify ?? null,
      surgery_history: data.surgery_history ?? false,
      surgery_specify: data.surgery_specify ?? null,
      smoker: data.smoker ?? false,
      pack_years: data.pack_years ?? null,
      alcoholic: data.alcoholic ?? false,
      lmp: data.lmp ? new Date(data.lmp) : null,
      gravida: data.gravida ?? null,
      para: data.para ?? null,
      family_hypertension: data.family_hypertension ?? false,
      family_diabetes: data.family_diabetes ?? false,
      family_cancer: data.family_cancer ?? false,
      skin: data.skin ?? null,
      heent: data.heent ?? null,
      neck: data.neck ?? null,
      chest_lungs: data.chest_lungs ?? null,
      heart: data.heart ?? null,
      abdomen: data.abdomen ?? null,
      extremities: data.extremities ?? null,
      neurological: data.neurological ?? null,
      fitness_class: data.fitness_class ?? null,
      recorded_by: isNaN(recordedBy) ? null : recordedBy,
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
