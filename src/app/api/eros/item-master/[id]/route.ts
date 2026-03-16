import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const updateSchema = z.object({
  Code:            z.string().min(1).optional(),
  Description:     z.string().min(1).optional(),
  ShortName:       z.string().optional().nullable(),
  Group:           z.string().optional().nullable(),
  SubGroup:        z.string().optional().nullable(),
  DepartmentGroup: z.string().optional().nullable(),
  Price:           z.number().min(0).optional(),
  ItemStatus:      z.string().optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "erosui", "itemmasterlist");
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });

  const d = parsed.data;
  try {
    const item = await prisma.itemmaster.update({
      where: { Id: BigInt(id) },
      data: {
        ...(d.Code            !== undefined && { Code:            d.Code }),
        ...(d.Description     !== undefined && { Description:     d.Description }),
        ...(d.ShortName       !== undefined && { ShortName:       d.ShortName }),
        ...(d.Group           !== undefined && { Group:           d.Group }),
        ...(d.SubGroup        !== undefined && { SubGroup:        d.SubGroup }),
        ...(d.DepartmentGroup !== undefined && { DepartmentGroup: d.DepartmentGroup }),
        ...(d.Price           !== undefined && { Price:           d.Price }),
        ...(d.ItemStatus      !== undefined && { ItemStatus:      d.ItemStatus }),
        UpdateBy:   session.user.name ?? session.user.id ?? "",
        UpdateDate: new Date(),
      },
    });
    return NextResponse.json({ data: { ...item, Id: Number(item.Id) } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "erosui", "itemmasterlist");
  const { id } = await params;
  try {
    await prisma.itemmaster.delete({ where: { Id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
