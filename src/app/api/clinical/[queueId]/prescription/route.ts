import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";
import { logActivity, AUDIT_ACTIONS, getClientIp } from "@/lib/audit";

const prescriptionSchema = z.object({
  doctor_name: z.string().max(200).optional().nullable(),
  notes:       z.string().optional().nullable(),
  items: z.array(z.object({
    medication:   z.string().min(1).max(300),
    dosage:       z.string().max(100).optional().nullable(),
    frequency:    z.string().max(100).optional().nullable(),
    duration:     z.string().max(100).optional().nullable(),
    quantity:     z.number().int().positive().optional().nullable(),
    instructions: z.string().optional().nullable(),
  })).min(1),
});

type Params = { params: Promise<{ queueId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;
    const qid = BigInt(queueId);

    const prescription = await prisma.prescription.findFirst({
      where: { queue_id: qid },
      include: { items: true },
      orderBy: { created_at: "desc" },
    });

    if (!prescription) return NextResponse.json({ success: true, data: null });

    return NextResponse.json({
      success: true,
      data: {
        id:         prescription.id,
        queueId:    Number(prescription.queue_id),
        doctorName: prescription.doctor_name,
        notes:      prescription.notes,
        printedAt:  prescription.printed_at?.toISOString() ?? null,
        createdAt:  prescription.created_at.toISOString(),
        items:      prescription.items.map((i) => ({
          id:           i.id,
          medication:   i.medication,
          dosage:       i.dosage,
          frequency:    i.frequency,
          duration:     i.duration,
          quantity:     i.quantity,
          instructions: i.instructions,
        })),
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

    // Get patient ID from queue
    const queue = await prisma.queue.findUnique({
      where: { Id: qid },
      select: { IdPatient: true },
    });
    if (!queue) return NextResponse.json({ success: false, error: "Queue not found" }, { status: 404 });

    const body = await request.json();
    const parsed = prescriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { items, ...rx } = parsed.data;
    const inputBy = session.user.username || session.user.id;

    // Delete existing prescription for this queue (upsert via delete+create)
    await prisma.prescriptionItem.deleteMany({
      where: {
        prescription: { queue_id: qid },
      },
    });
    await prisma.prescription.deleteMany({ where: { queue_id: qid } });

    const prescription = await prisma.prescription.create({
      data: {
        queue_id:    qid,
        patient_id:  queue.IdPatient,
        doctor_name: rx.doctor_name ?? null,
        notes:       rx.notes ?? null,
        input_by:    inputBy,
        items: {
          create: items.map((item) => ({
            medication:   item.medication,
            dosage:       item.dosage ?? null,
            frequency:    item.frequency ?? null,
            duration:     item.duration ?? null,
            quantity:     item.quantity ?? null,
            instructions: item.instructions ?? null,
          })),
        },
      },
      include: { items: true },
    });

    logActivity(session, AUDIT_ACTIONS.SAVE_PRESCRIPTION, "queue", queueId.toString(), {
      prescriptionId: prescription.id,
      itemCount:      items.length,
      doctorName:     rx.doctor_name ?? null,
    }, getClientIp(request));

    return NextResponse.json({ success: true, data: { id: prescription.id } });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
