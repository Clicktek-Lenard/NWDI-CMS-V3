import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { SendoutService } from "@/services/sendout.service";

/**
 * GET /api/sendouts/summary — Get sendout counts (pending/received/completed).
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "results");
  const clinicCode = session.user.clinicCode || "CEN";

  try {
    const summary = await SendoutService.getSummary(clinicCode);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET /api/sendouts/summary error:", error);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
