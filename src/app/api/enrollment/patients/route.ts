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
        IsActive: 1,
        OR: [
          { FullName: { contains: search } },
          { Code: { contains: search } },
          { EmployeeId: { contains: search } },
        ],
      },
      select: {
        Id: true,
        Code: true,
        FullName: true,
        Gender: true,
        DOB: true,
      },
      take: 20,
      orderBy: { FullName: "asc" },
    });

    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
