import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "clinical");

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";

    const physicians = await prisma.physician.findMany({
      where: {
        status: "ACTIVE",
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { code: { contains: q } },
                { specialty: { contains: q } },
              ],
            }
          : {}),
      },
      select: { id: true, code: true, name: true, specialty: true, license_no: true },
      orderBy: { name: "asc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: physicians });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
