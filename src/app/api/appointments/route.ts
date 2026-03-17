import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { AppointmentService } from "@/services/appointment.service";
import { createAppointmentSchema } from "@/lib/validators/appointment";

/**
 * GET /api/appointments?date=YYYY-MM-DD&physicianId=123&view=upcoming
 * List appointments for a date, or upcoming appointments.
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "appointments");
  const clinicCode = session.user.clinicCode || "CEN";

  const sp           = request.nextUrl.searchParams;
  const view         = sp.get("view");
  const dateParam    = sp.get("date") || new Date().toISOString().slice(0, 10);
  const physicianId  = sp.get("physicianId");

  try {
    if (view === "upcoming") {
      const data = await AppointmentService.getUpcoming(clinicCode);
      return NextResponse.json(data);
    }

    const data = await AppointmentService.getAppointments(
      clinicCode,
      dateParam,
      physicianId ? Number(physicianId) : undefined
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/appointments error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

/**
 * POST /api/appointments — Book a new appointment.
 */
export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "appointments");
  const clinicCode = session.user.clinicCode || "CEN";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createAppointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  try {
    const result = await AppointmentService.createAppointment(
      clinicCode,
      parsed.data,
      session.user.username || "system"
    );

    if ("conflict" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
