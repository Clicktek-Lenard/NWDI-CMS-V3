import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "clinical");

    const codes = await prisma.assesmentcode.findMany({
      where: { status: { not: "inactive" } },
      orderBy: { code: "asc" },
      select: {
        id: true,
        code: true,
        findings: true,
        assesment: true,
        recommendation: true,
        Class: true,
        testgroup: true,
        testcode: true,
      },
    });

    return NextResponse.json({ success: true, data: codes });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
