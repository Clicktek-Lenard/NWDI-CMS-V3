import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// POST /api/queue/[id]/regenerate-pdf
// Re-triggers HL7 lab PDF generation by resetting ErosStatus to "queued".
// Role: RESULTS-RELEASING (enforced at UI level; API-level check is module-based)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const queueId = BigInt(id);

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) {
    return NextResponse.json({ error: "Queue not found" }, { status: 404 });
  }

  const updatedBy = (session.user.username || session.user.id || "system").slice(0, 30);

  await prisma.queue.update({
    where: { Id: queueId },
    data: {
      ErosStatus: "queued",
      UpdateBy:   updatedBy,
      UpdateDate: new Date(),
    },
  });

  return NextResponse.json({ success: true, message: "PDF regeneration queued" });
}
