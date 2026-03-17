import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { AppointmentService } from "@/services/appointment.service";
import { z } from "zod";

const checkInSchema = z.object({
  queueId: z.number().int().positive("Queue ID is required"),
});

/**
 * POST /api/appointments/[id]/check-in — Link appointment to a queue entry.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "appointments");
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  try {
    const result = await AppointmentService.checkIn(
      Number(id),
      parsed.data.queueId,
      session.user.username || "system"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/appointments/[id]/check-in error:", error);
    return NextResponse.json({ error: "Failed to check in appointment" }, { status: 500 });
  }
}
