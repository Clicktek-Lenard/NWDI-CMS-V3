import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { SendoutService } from "@/services/sendout.service";

/**
 * POST /api/sendouts/[id]/receive — Mark sendout as received at destination.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "results");
  const { id } = await params;

  try {
    const result = await SendoutService.receiveSendout(
      Number(id),
      session.user.username || "system"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/sendouts/[id]/receive error:", error);
    return NextResponse.json({ error: "Failed to receive sendout" }, { status: 500 });
  }
}
