import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { makeAccessionNo } from "@/services/accession.service";

// POST /api/accession/make
//
// Manually triggered by staff AFTER physical specimen collection is confirmed.
// Picks the next eligible queue (Status 300, today, caller's clinic) and assigns
// accession numbers — one queue at a time.  Must NOT be called automatically.
export async function POST(request: NextRequest) {
  const session  = await requireApiAuth(request, "cms", "queue");
  const clinicCode = session.user.clinicCode || "CEN";
  const updatedBy  = (session.user.username || session.user.id || "system").slice(0, 30);

  try {
    const result = await makeAccessionNo(clinicCode, updatedBy);

    if (!result) {
      return NextResponse.json(
        { message: "No queue pending accession assignment (Status 300) for today." },
        { status: 200 },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[accession/make] error:", error);
    return NextResponse.json({ error: "Failed to assign accession numbers." }, { status: 500 });
  }
}
