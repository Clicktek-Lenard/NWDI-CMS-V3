import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// GET /api/enrollment/patients?search=xxx — search patients for card registration
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "enrollment");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    if (search.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const patients = await prisma.patient.findMany({
      where: {
        isactive: 1,
        OR: [
          { fullname: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
          { employeeid: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        code: true,
        fullname: true,
        gender: true,
        dob: true,
      },
      take: 20,
      orderBy: { fullname: "asc" },
    });

    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
