import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

const SELECT_FIELDS = {
  Id:          true,
  Code:        true,
  Name:        true,
  ErosCode:    true,
  ShortName:   true,
  BillingType: true,
  UsedClinic:  true,
} as const;

/**
 * GET /api/companies
 *
 * Modes:
 *   ?q=<search>&limit=20        — full-text search
 *   ?default=1&clinicCode=BAE   — return the clinic's default company
 */
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "queue");

  const isDefault  = request.nextUrl.searchParams.get("default") === "1";
  const clinicCode = request.nextUrl.searchParams.get("clinicCode")?.trim() ?? "";
  const q          = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit      = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "20"), 100);

  try {
    // ── Default company for a clinic ─────────────────────────
    if (isDefault && clinicCode) {
      // Look for a company whose name contains "DEFAULT" and whose
      // UsedClinic column includes this clinicCode (or is "ALL").
      const defaults = await prisma.company.findMany({
        where: {
          Status: "Active",
          Name: { contains: "DEFAULT" },
          OR: [
            { UsedClinic: { contains: clinicCode } },
            { UsedClinic: "ALL" },
            { IdBU: clinicCode },
            { IdBU: "ALL" },
          ],
        },
        select: SELECT_FIELDS,
        orderBy: { Name: "asc" },
        take: 1,
      });

      return NextResponse.json({ data: defaults });
    }

    // ── Full-text search ──────────────────────────────────────
    const companies = await prisma.company.findMany({
      where: {
        Status: "Active",
        ...(q.length >= 1
          ? {
              OR: [
                { Name: { contains: q } },
                { Code: { contains: q } },
                { ErosCode: { contains: q } },
              ],
            }
          : {}),
      },
      select: SELECT_FIELDS,
      orderBy: { Name: "asc" },
      take: limit,
    });

    return NextResponse.json({ data: companies });
  } catch (error) {
    console.error("Company search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
