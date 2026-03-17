import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { SendoutService } from "@/services/sendout.service";
import { createSendoutSchema } from "@/lib/validators/sendout";

/**
 * GET /api/sendouts?status=201&dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "results");
  const clinicCode = session.user.clinicCode || "CEN";

  const sp       = request.nextUrl.searchParams;
  const status   = sp.get("status") ? Number(sp.get("status")) : undefined;
  const dateFrom = sp.get("dateFrom") || undefined;
  const dateTo   = sp.get("dateTo") || undefined;

  try {
    const data = await SendoutService.listSendouts(clinicCode, { status, dateFrom, dateTo });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/sendouts error:", error);
    return NextResponse.json({ error: "Failed to fetch sendouts" }, { status: 500 });
  }
}

/**
 * POST /api/sendouts — Create a new sendout record.
 */
export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "results");
  const clinicCode = session.user.clinicCode || "CEN";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSendoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  try {
    const result = await SendoutService.createSendout(
      clinicCode,
      parsed.data,
      session.user.username || "system"
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/sendouts error:", error);
    return NextResponse.json({ error: "Failed to create sendout" }, { status: 500 });
  }
}
