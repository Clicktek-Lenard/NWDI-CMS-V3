import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "clinical");

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const searchPattern = `%${q}%`;

    type PhysicianRow = {
      Id: bigint;
      Code: string | null;
      FullName: string | null;
      DisplayName: string | null;
      PRCNo: string | null;
      Degree: string | null;
      SubGroup: string | null;
      Status: string | null;
    };

    const physicians = await prisma.$queryRaw<PhysicianRow[]>`
      SELECT Id, Code, FullName, DisplayName, PRCNo, Degree, SubGroup, Status
      FROM physician
      WHERE Status IN ('Approved', 'Active', 'A')
        AND (${q} = '' OR FullName LIKE ${searchPattern} OR Code LIKE ${searchPattern})
      ORDER BY FullName ASC
      LIMIT 50
    `;

    return NextResponse.json({
      success: true,
      data: physicians.map((p) => ({
        id: Number(p.Id),
        code: p.Code ?? "",
        name: p.FullName ?? "",
        displayName: p.DisplayName ?? null,
        licenseNo: p.PRCNo ?? null,
        degree: p.Degree ?? null,
        subGroup: p.SubGroup ?? null,
        status: p.Status ?? "",
      })),
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
