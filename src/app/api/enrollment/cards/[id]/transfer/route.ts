import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const transferSchema = z.object({
  transfer_to: z.string().min(1, "Transfer destination is required"),
});

// PATCH — Transfer card to patient/branch
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiAuth(request, "cms", "enrollment");
    const { id } = await params;
    const cardId = parseInt(id, 10);

    const body = await request.json();
    const parsed = transferSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const card = await prisma.cardEnrollment.findUnique({ where: { id: cardId } });
    if (!card) {
      return NextResponse.json({ success: false, error: "Card not found" }, { status: 404 });
    }
    if (card.transferto) {
      return NextResponse.json(
        { success: false, error: "Card has already been transferred" },
        { status: 409 }
      );
    }
    if (!card.daterelease) {
      return NextResponse.json(
        { success: false, error: "Card must be verified before transfer" },
        { status: 409 }
      );
    }

    const staffName = session.user.name ?? session.user.id;

    const updated = await prisma.cardEnrollment.update({
      where: { id: cardId },
      data: {
        transferto: parsed.data.transfer_to,
        datetransfer: new Date(),
        transferby: staffName,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
