import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

type Params = { params: Promise<{ queueId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;
    const qid = parseInt(queueId, 10);

    const queue = await prisma.queue.findFirst({ where: { Id: BigInt(qid) } });
    if (!queue) {
      return NextResponse.json({ success: false, error: "Queue entry not found" }, { status: 404 });
    }

    // Check current ConsultationNote status
    const note = await prisma.consultationNote.findUnique({
      where: { queue_id: qid },
      select: { status: true },
    }).catch(() => null);

    if (note?.status === "COMPLETED") {
      return NextResponse.json({ success: false, error: "Already completed" }, { status: 400 });
    }

    await prisma.consultationNote.upsert({
      where: { queue_id: qid },
      update: { status: "COMPLETED", completed_at: new Date() },
      create: {
        queue_id: qid,
        patient_id: String(queue.IdPatient),
        status: "COMPLETED",
        completed_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Consultation completed" });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
