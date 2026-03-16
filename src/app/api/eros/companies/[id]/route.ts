import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const updateSchema = z.object({
  Code:        z.string().min(1).optional(),
  Name:        z.string().min(1).optional(),
  ShortName:   z.string().optional().nullable(),
  BillingType: z.string().optional().nullable(),
  Status:      z.string().optional().nullable(),
  ErosCode:    z.string().optional().nullable(),
  UsedClinic:  z.string().optional().nullable(),
  Address:     z.string().optional().nullable(),
  Phone:       z.string().optional().nullable(),
  Email:       z.string().optional().nullable(),
  StartDate:   z.string().optional().nullable(),
  EndDate:     z.string().optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "erosui", "company");
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });

  const d = parsed.data;
  try {
    const company = await prisma.company.update({
      where: { Id: parseInt(id) },
      data: {
        ...(d.Code        !== undefined && { Code:        d.Code }),
        ...(d.Name        !== undefined && { Name:        d.Name }),
        ...(d.ShortName   !== undefined && { ShortName:   d.ShortName }),
        ...(d.BillingType !== undefined && { BillingType: d.BillingType }),
        ...(d.Status      !== undefined && { Status:      d.Status }),
        ...(d.ErosCode    !== undefined && { ErosCode:    d.ErosCode }),
        ...(d.UsedClinic  !== undefined && { UsedClinic:  d.UsedClinic }),
        ...(d.Address     !== undefined && { Address:     d.Address }),
        ...(d.Phone       !== undefined && { Phone:       d.Phone }),
        ...(d.Email       !== undefined && { Email:       d.Email }),
        ...(d.StartDate   !== undefined && { StartDate:   d.StartDate ? new Date(d.StartDate) : null }),
        ...(d.EndDate     !== undefined && { EndDate:     d.EndDate   ? new Date(d.EndDate)   : null }),
        UpdateBy:   session.user.name ?? session.user.id ?? "",
        UpdateDate: new Date(),
      },
    });
    return NextResponse.json({ data: company });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "erosui", "company");
  const { id } = await params;
  try {
    await prisma.company.delete({ where: { Id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
