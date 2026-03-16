import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const companySchema = z.object({
  Code:        z.string().min(1),
  Name:        z.string().min(1),
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

export async function GET(request: NextRequest) {
  await requireApiAuth(request, "erosui", "company");

  const sp       = request.nextUrl.searchParams;
  const search   = sp.get("search")?.trim() ?? "";
  const page     = Math.max(1, parseInt(sp.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") || "20")));

  const where = search
    ? {
        OR: [
          { Name:      { contains: search, mode: "insensitive" as const } },
          { Code:      { contains: search, mode: "insensitive" as const } },
          { ErosCode:  { contains: search, mode: "insensitive" as const } },
          { ShortName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, companies] = await Promise.all([
    prisma.company.count({ where }),
    prisma.company.findMany({
      where,
      select: {
        Id:          true,
        Code:        true,
        Name:        true,
        ShortName:   true,
        BillingType: true,
        Status:      true,
        ErosCode:    true,
        UsedClinic:  true,
        StartDate:   true,
        EndDate:     true,
      },
      orderBy: { Name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    data: companies,
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
  const parsed = companySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });

  const d = parsed.data;
  try {
    const company = await prisma.company.create({
      data: {
        Code:        d.Code,
        Name:        d.Name,
        ShortName:   d.ShortName ?? null,
        BillingType: d.BillingType ?? null,
        Status:      d.Status ?? "Active",
        ErosCode:    d.ErosCode ?? null,
        UsedClinic:  d.UsedClinic ?? null,
        Address:     d.Address ?? null,
        Phone:       d.Phone ?? null,
        Email:       d.Email ?? null,
        StartDate:   d.StartDate ? new Date(d.StartDate) : null,
        EndDate:     d.EndDate   ? new Date(d.EndDate)   : null,
        InputBy:     session.user.name ?? session.user.id ?? "",
        InputDate:   new Date(),
        UsedPercentDefaultLAB: 0,
        UsedPercentDefaultIMG: 0,
        UsedPercentDefault:    0,
      },
    });
    return NextResponse.json({ data: company }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
