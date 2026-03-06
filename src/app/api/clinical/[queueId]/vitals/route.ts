import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const vitalsSchema = z.object({
  patient_id: z.string(),
  chief_complaint: z.string().optional().nullable(),
  pcp_doctor: z.string().optional().nullable(),
  // BP — 3 readings (systolic/diastolic)
  bp_systolic: z.number().int().nullable().optional(),
  bp_diastolic: z.number().int().nullable().optional(),
  bp_systolic2: z.number().int().nullable().optional(),
  bp_diastolic2: z.number().int().nullable().optional(),
  bp_systolic3: z.number().int().nullable().optional(),
  bp_diastolic3: z.number().int().nullable().optional(),
  // Basic vitals
  heart_rate: z.number().int().optional().nullable(),
  temperature: z.number().optional().nullable(),
  respiratory_rate: z.number().int().optional().nullable(),
  weight_kg: z.number().optional().nullable(),
  height_cm: z.number().optional().nullable(),
  // Vision
  vision_right_od: z.string().optional().nullable(),
  vision_left_os: z.string().optional().nullable(),
  vision_corrected: z.string().optional().nullable(),
  color_vision: z.string().optional().nullable(),
});

function calcBMI(weight: number | null | undefined, height: number | null | undefined): number | null {
  if (!weight || !height) return null;
  const heightM = height / 100;
  if (!heightM) return null;
  return parseFloat((weight / (heightM * heightM)).toFixed(2));
}

type Params = { params: Promise<{ queueId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;
    const qid = parseInt(queueId, 10);

    const vitals = await prisma.vitalSign.findUnique({ where: { queue_id: qid } });

    if (!vitals) return NextResponse.json({ success: true, data: null });

    return NextResponse.json({
      success: true,
      data: {
        id: vitals.id,
        queueId: vitals.queue_id,
        patientId: vitals.patient_id,
        chiefComplaint: vitals.chief_complaint,
        pcpDoctor: vitals.pcp_doctor,
        bpSystolic: vitals.bp_systolic,
        bpDiastolic: vitals.bp_diastolic,
        bpSystolic2: vitals.bp_systolic2,
        bpDiastolic2: vitals.bp_diastolic2,
        bpSystolic3: vitals.bp_systolic3,
        bpDiastolic3: vitals.bp_diastolic3,
        heartRate: vitals.heart_rate,
        temperature: vitals.temperature,
        respiratoryRate: vitals.respiratory_rate,
        weightKg: vitals.weight_kg,
        heightCm: vitals.height_cm,
        bmi: vitals.bmi,
        visionRightOd: vitals.vision_right_od,
        visionLeftOs: vitals.vision_left_os,
        visionCorrected: vitals.vision_corrected,
        colorVision: vitals.color_vision,
        recordedBy: vitals.recorded_by,
        createdAt: vitals.created_at.toISOString(),
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
    const bmi = calcBMI(data.weight_kg, data.height_cm);
    const recordedBy = parseInt(session.user.id);

    const writeData = {
      patient_id: data.patient_id,
      chief_complaint: data.chief_complaint ?? null,
      pcp_doctor: data.pcp_doctor ?? null,
      bp_systolic: data.bp_systolic ?? null,
      bp_diastolic: data.bp_diastolic ?? null,
      bp_systolic2: data.bp_systolic2 ?? null,
      bp_diastolic2: data.bp_diastolic2 ?? null,
      bp_systolic3: data.bp_systolic3 ?? null,
      bp_diastolic3: data.bp_diastolic3 ?? null,
      heart_rate: data.heart_rate ?? null,
      temperature: data.temperature ?? null,
      respiratory_rate: data.respiratory_rate ?? null,
      weight_kg: data.weight_kg ?? null,
      height_cm: data.height_cm ?? null,
      bmi,
      vision_right_od: data.vision_right_od ?? null,
      vision_left_os: data.vision_left_os ?? null,
      vision_corrected: data.vision_corrected ?? null,
      color_vision: data.color_vision ?? null,
      recorded_by: isNaN(recordedBy) ? null : recordedBy,
    };

    const vitals = await prisma.vitalSign.upsert({
      where: { queue_id: qid },
      update: writeData,
      create: { queue_id: qid, ...writeData },
    });

    // Auto-transition ConsultationNote to IN_PROGRESS
    await prisma.consultationNote.upsert({
      where: { queue_id: qid },
      update: { status: "IN_PROGRESS" },
      create: {
        queue_id: qid,
        patient_id: data.patient_id,
        status: "IN_PROGRESS",
      },
    }).catch(() => { /* ignore if table not ready */ });

    return NextResponse.json({ success: true, data: { id: vitals.id } });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
