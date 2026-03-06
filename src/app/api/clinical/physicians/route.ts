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
      id: bigint;
      code: string | null;
      fullname: string | null;
      displayname: string | null;
      prcno: string | null;
      degree: string | null;
      subgroup: string | null;
      status: string | null;
    };

    const physicians = await prisma.$queryRaw<PhysicianRow[]>`
      SELECT id, code, fullname, displayname, prcno, degree, subgroup, status
      FROM physician
      WHERE status IN ('Approved', 'Active', 'A')
        AND (${q} = '' OR fullname ILIKE ${searchPattern} OR code ILIKE ${searchPattern})
      ORDER BY fullname ASC
      LIMIT 50
    `;

    return NextResponse.json({
      success: true,
      data: physicians.map((p) => ({
        id: Number(p.id),
        code: p.code ?? "",
        name: p.fullname ?? "",
        displayName: p.displayname ?? null,
        licenseNo: p.prcno ?? null,
        degree: p.degree ?? null,
        subGroup: p.subgroup ?? null,
        status: p.status ?? "",
      })),
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
