import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// Valid status transitions: from → [allowed to]
const TRANSITIONS: Record<string, string[]> = {
  WAITING:     ["IN_PROGRESS", "CANCELLED"],
  PENDING:     ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["WAITING", "COMPLETED", "CANCELLED"],
  COMPLETED:   ["IN_PROGRESS"],
  CANCELLED:   ["WAITING"],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ queueId: string }> }
) {
  try {
    const session = await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;
    const id = parseInt(queueId, 10);

    const { status } = await request.json() as { status: string };

    // Verify queue entry exists
    const queue = await prisma.queue.findFirst({ where: { Id: BigInt(id) } });
    if (!queue) {
      return NextResponse.json({ success: false, error: "Queue entry not found" }, { status: 404 });
    }

    // Check current consultation status
    let current: { status: string | null; patient_id: string | null } | null = null;
    try {
      current = await prisma.consultationNote.findUnique({
        where: { queue_id: id },
        select: { status: true, patient_id: true },
      });
    } catch { /* table may not exist */ }

    const currentStatus = current?.status ?? "WAITING";
    const allowed = TRANSITIONS[currentStatus] ?? [];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Cannot change status from ${currentStatus} to ${status}` },
        { status: 422 }
      );
    }

    // Upsert ConsultationNote status
    const updated = await prisma.consultationNote.upsert({
      where: { queue_id: id },
      create: {
        queue_id: id,
        patient_id: String(queue.IdPatient),
        status,
        recorded_by: undefined,
      },
      update: {
        status,
        ...(status === "COMPLETED" ? { completed_at: new Date() } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
