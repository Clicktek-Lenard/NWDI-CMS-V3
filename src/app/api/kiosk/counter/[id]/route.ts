import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * PATCH /api/kiosk/counter/[id]
 * Update a workstation registration.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const body = await request.json();
  const { station_number, ipv4, department, location, idbu } = body;

  const updated = await prisma.kioskCounter.update({
    where: { id: Number(id) },
    data: {
      station_number,
      ipv4,
      department,
      location,
      idbu,
      update_by:   session.user.username ?? session.user.email ?? "system",
      update_date: new Date(),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}

/**
 * DELETE /api/kiosk/counter/[id]
 * Remove a workstation registration.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;

  await prisma.kioskCounter.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
