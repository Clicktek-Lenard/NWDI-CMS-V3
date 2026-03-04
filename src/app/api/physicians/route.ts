import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/physicians?q=<search>&limit=20
 * Search active physicians for transaction doctor selection.
 */
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "queue");

  const q     = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "20"), 100);

  try {
    const physicians = await prisma.physician.findMany({
      where: {
        Status: "Active",
        ...(q.length >= 1
          ? {
              OR: [
                { FullName:  { contains: q } },
                { Code:      { contains: q } },
                { ErosCode:  { contains: q } },
              ],
            }
          : {}),
      },
      select: {
        Id:          true,
        Code:        true,
        ErosCode:    true,
        FullName:    true,
        DisplayName: true,
        Degree:      true,
      },
      orderBy: { FullName: "asc" },
      take: limit,
    });

    const data = physicians.map((p) => ({
      id:          Number(p.Id),
      code:        p.Code ?? "",
      erosCode:    p.ErosCode,
      fullName:    p.FullName,
      displayName: p.DisplayName ?? p.FullName,
      degree:      p.Degree ?? "",
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Physician search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
