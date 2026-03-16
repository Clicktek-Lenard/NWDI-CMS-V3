import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const itemMasterSchema = z.object({
  Code:            z.string().min(1),
  Description:     z.string().min(1),
  ShortName:       z.string().optional().nullable(),
  Group:           z.string().optional().nullable(),
  SubGroup:        z.string().optional().nullable(),
  DepartmentGroup: z.string().optional().nullable(),
  Price:           z.number().min(0).default(0),
  ItemStatus:      z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  await requireApiAuth(request, "erosui", "itemmasterlist");

  const sp       = request.nextUrl.searchParams;
  const search   = sp.get("search")?.trim() ?? "";
  const page     = Math.max(1, parseInt(sp.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") || "20")));

  const where = search
    ? {
        OR: [
          { Description: { contains: search, mode: "insensitive" as const } },
          { Code:        { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, items] = await Promise.all([
    prisma.itemmaster.count({ where }),
    prisma.itemmaster.findMany({
      where,
      select: {
        Id:             true,
        Code:           true,
        Description:    true,
        ShortName:      true,
        Group:          true,
        SubGroup:       true,
        DepartmentGroup: true,
        Price:          true,
      },
      orderBy: { Description: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    data: items.map(i => ({ ...i, Id: Number(i.Id) })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "erosui", "itemmasterlist");
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = itemMasterSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });

  const d = parsed.data;
  try {
    const item = await prisma.itemmaster.create({
      data: {
        Code:            d.Code,
        Description:     d.Description,
        ShortName:       d.ShortName       ?? null,
        Group:           d.Group           ?? null,
        SubGroup:        d.SubGroup        ?? null,
        DepartmentGroup: d.DepartmentGroup ?? null,
        Price:           d.Price           ?? 0,
        ItemStatus:      d.ItemStatus      ?? "Active",
        ReadersFee:      0,
        Rebates:         0,
        ReApply:         0,
        StandardPackage: 0,
        AllowDiscount:   0,
        AllowQty:        0,
        WebSiteStatus:   0,
        ViewVitalSigns:  0,
        InputBy:         session.user.name ?? session.user.id ?? "",
        InputDate:       new Date(),
      },
    });
    return NextResponse.json({ data: { ...item, Id: Number(item.Id) } }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
