import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const evalSchema = z.object({
  patient_id: z.string(),
  is_draft: z.number().int().min(0).max(1).optional(), // 1 = draft, 0 = finalized
  chief_complaint: z.string().optional(),
  history_illness: z.string().optional(),
  past_history: z.string().optional(),
  family_history: z.string().optional(),
  pe_findings: z.string().optional(),
  diagnosis: z.string().optional(),
  icd_code: z.string().optional(),
  treatment_plan: z.string().optional(),
  orders: z.string().optional(),
  pcp_doctor: z.string().optional(),
  doctor_name: z.string().optional(),
});

type Params = { params: Promise<{ queueId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;

    const note = await prisma.consultationNote.findUnique({
      where: { queue_id: parseInt(queueId, 10) },
    });

    return NextResponse.json({ success: true, data: note ?? null });
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
    const parsed = evalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const recordedBy = parseInt(session.user.id);
    const isDraft = data.is_draft ?? 1;

    const note = await prisma.consultationNote.upsert({
      where: { queue_id: qid },
      update: {
        chief_complaint: data.chief_complaint,
        history_illness: data.history_illness,
        past_history: data.past_history,
        family_history: data.family_history,
        pe_findings: data.pe_findings,
        diagnosis: data.diagnosis,
        icd_code: data.icd_code,
        treatment_plan: data.treatment_plan,
        orders: data.orders,
        pcp_doctor: data.pcp_doctor,
        doctor_id: recordedBy,
        doctor_name: data.doctor_name ?? null,
        is_draft: isDraft,
        recorded_by: recordedBy,
      },
      create: {
        queue_id: qid,
        patient_id: data.patient_id,
        chief_complaint: data.chief_complaint,
        history_illness: data.history_illness,
        past_history: data.past_history,
        family_history: data.family_history,
        pe_findings: data.pe_findings,
        diagnosis: data.diagnosis,
        icd_code: data.icd_code,
        treatment_plan: data.treatment_plan,
        orders: data.orders,
        pcp_doctor: data.pcp_doctor,
        doctor_id: recordedBy,
        doctor_name: data.doctor_name ?? null,
        is_draft: isDraft,
        recorded_by: recordedBy,
      },
    });

    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
