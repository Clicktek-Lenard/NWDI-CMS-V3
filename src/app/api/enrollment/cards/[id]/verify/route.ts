import { NextResponse } from "next/server";

// This endpoint is not used in the card enrollment lifecycle.
// The lifecycle is: Register (status=0) → Receive (status=1) → Transfer (status=2) → Confirm Transfer (status=3)
export async function PATCH() {
  return NextResponse.json(
    { success: false, error: "Not implemented. Use /receive, /transfer, or /confirm-transfer instead." },
    { status: 410 }
  );
}
