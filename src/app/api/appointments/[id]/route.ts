import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { AppointmentService } from "@/services/appointment.service";

/**
 * PATCH /api/appointments/[id] — Cancel an appointment (status → 650).
 */
export async function PATCH(
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

  const { action } = body as { action?: string };

  try {
    if (action === "cancel") {
      const result = await AppointmentService.cancelAppointment(
        Number(id),
        session.user.username || "system"
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/appointments/[id] error:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
