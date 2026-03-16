import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const itemPriceSchema = z.object({
  Code:        z.string().min(1),
  Description: z.string().min(1),
  CompanyCode: z.string().optional().nullable(),
  ClinicCode:  z.string().optional().nullable(),
  Price:       z.number().min(0),
  PriceType:   z.string().optional().nullable(),
  ItemUsed:    z.number().int().optional().default(1),
  Status:      z.number().int().optional().default(1),
});

export async function GET(request: NextRequest) {
  await requireApiAuth(request, "erosui", "company");

  const sp          = request.nextUrl.searchParams;
  const search      = sp.get("search")?.trim() ?? "";
  const companyCode = sp.get("companyCode")?.trim() ?? "";
  const page        = Math.max(1, parseInt(sp.get("page") || "1"));
  const pageSize    = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") || "20")));

  const where = {
    ...(companyCode ? { CompanyCode: companyCode } : {}),
    ...(search
      ? {
          OR: [
            { Description: { contains: search, mode: "insensitive" as const } },
            { Code:        { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.itemprice.count({ where }),
    prisma.itemprice.findMany({
      where,
      select: {
        Id:          true,
        Code:        true,
        Description: true,
        CompanyCode: true,
        Price:       true,
        PriceType:   true,
        ClinicCode:  true,
        Status:      true,
        ItemUsed:    true,
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
  const session = await requireApiAuth(request, "erosui", "company");
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = itemPriceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });

  const d = parsed.data;
  try {
    const item = await prisma.itemprice.create({
      data: {
        Code:        d.Code,
        Description: d.Description,
        CompanyCode: d.CompanyCode ?? null,
        ClinicCode:  d.ClinicCode  ?? null,
        Price:       d.Price,
        PriceType:   d.PriceType   ?? null,
        ItemUsed:    d.ItemUsed    ?? 1,
        Status:      d.Status      ?? 1,
        InputDate:   new Date(),
        InputBy:     session.user.name ?? session.user.id ?? "",
      },
    });
    return NextResponse.json({ data: { ...item, Id: Number(item.Id) } }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create item price" }, { status: 500 });
  }
}
