import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { AppointmentService } from "@/services/appointment.service";

/**
 * GET /api/physicians/availability?physicianId=123&date=YYYY-MM-DD
 * Returns available time slots for a physician on a given date.
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "appointments");
  const clinicCode = session.user.clinicCode || "CEN";

  const sp          = request.nextUrl.searchParams;
  const physicianId = sp.get("physicianId");
  const date        = sp.get("date");

  if (!physicianId || !date) {
    return NextResponse.json(
      { error: "physicianId and date are required" },
      { status: 400 }
    );
  }

  try {
    const result = await AppointmentService.getPhysicianAvailability(
      clinicCode,
      Number(physicianId),
      date
    );

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/physicians/availability error:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
