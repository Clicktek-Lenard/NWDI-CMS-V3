import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// PATCH — Mark card as VERIFIED / Released to patient
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
    if (card.daterelease) {
      return NextResponse.json(
        { success: false, error: "Card has already been verified/released" },
        { status: 409 }
      );
    }
    if (!card.receiveddate) {
      return NextResponse.json(
        { success: false, error: "Card must be received before it can be verified" },
        { status: 409 }
      );
    }

    const staffName = session.user.name ?? session.user.id;

    const updated = await prisma.cardEnrollment.update({
      where: { id: cardId },
      data: {
        daterelease: new Date(),
        releaseby: staffName,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
