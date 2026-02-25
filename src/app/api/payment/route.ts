import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { requireApiAuth } from "@/lib/auth/rbac";
import { createPaymentSchema } from "@/lib/validators/payment";
import type { PaymentStatus } from "@/types";

/**
 * GET /api/payment — List payments
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "payment");

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "50");
  const status = searchParams.get("status") as PaymentStatus | undefined;
  const clinicCode =
    session.user.clinicCode || "CEN";

  try {
    const data = await PaymentService.getPayments(clinicCode, page, pageSize, {
      status,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payment — Create payment
 */
export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "payment");

  try {
    const body = await request.json();
    const validated = createPaymentSchema.parse(body);
    const clinicCode =
      session.user.clinicCode || "CEN";
    const userId = parseInt(session.user.id);

    const payment = await PaymentService.createPayment({
      ...validated,
      clinicCode,
      createdBy: userId,
    });

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to create payment:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
