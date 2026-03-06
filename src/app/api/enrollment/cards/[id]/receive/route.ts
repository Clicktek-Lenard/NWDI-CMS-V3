import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// PATCH — Mark card as RECEIVED (sets ReceivedBy/ReceivedDate + creates cardverified record)
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
    if (card.receiveddate) {
      return NextResponse.json(
        { success: false, error: "Card has already been received" },
        { status: 409 }
      );
    }

    const staffName = session.user.name ?? session.user.id;
    const now = new Date();

    // Update cardenrollment with received info
    await prisma.cardEnrollment.update({
      where: { id: cardId },
      data: { receivedby: staffName, receiveddate: now },
    });

    // Also create cardverified record if not exists
    if (card.cardnumber) {
      const alreadyVerified = await prisma.cardVerified.findUnique({
        where: { verifiedcardnumbers: card.cardnumber },
      });
      if (!alreadyVerified) {
        await prisma.cardVerified.create({
          data: {
            verifiedcardnumbers: card.cardnumber,
            ictreceived: staffName,
            datereceived: now,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Card marked as received" });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
