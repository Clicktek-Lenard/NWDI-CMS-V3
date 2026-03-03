import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// Valid status transitions: from → [allowed to]
const TRANSITIONS: Record<string, string[]> = {
  WAITING:     ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["WAITING", "COMPLETED", "CANCELLED"],
  COMPLETED:   ["IN_PROGRESS"],
  CANCELLED:   ["WAITING"],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ queueId: string }> }
) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;
    const id = parseInt(queueId, 10);

    const { status } = await request.json() as { status: string };

    const queue = await prisma.queue.findFirst({ where: { id } });
    if (!queue) {
      return NextResponse.json({ success: false, error: "Queue entry not found" }, { status: 404 });
    }

    const allowed = TRANSITIONS[queue.status] ?? [];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Cannot change status from ${queue.status} to ${status}` },
        { status: 422 }
      );
    }

    const updated = await prisma.queue.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
