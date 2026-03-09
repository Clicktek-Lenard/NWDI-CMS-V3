import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// PATCH — Confirm transfer received at new clinic (status 2 → 3)
// Also updates releaseto = transferto (new clinic is now the holder)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiAuth(request, "cms", "enrollment");
    const { id } = await params;
    const cardId = parseInt(id, 10);

    const card = await prisma.cardEnrollment.findUnique({ where: { id: cardId } });
    if (!card) {
      return NextResponse.json({ success: false, error: "Card not found" }, { status: 404 });
    }
    if (card.status !== 2) {
      return NextResponse.json(
        { success: false, error: "Card must be in TRANSFER status to confirm receipt" },
        { status: 409 }
      );
    }

    const staffName = session.user.name ?? session.user.id;

    await prisma.cardEnrollment.update({
      where: { id: cardId },
      data: {
        // New clinic is now the holder — save old clinic first
        oldreleaseto: card.releaseto,
        releaseto:    card.transferto,
        releaseby:    staffName,
        daterelease:  new Date(),
        status:       3,
      },
    });

    return NextResponse.json({ success: true, message: "Transfer confirmed — new clinic is now the card holder" });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
