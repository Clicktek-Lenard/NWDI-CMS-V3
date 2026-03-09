import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// GET /api/enrollment/clinics — return active business units for clinic selector
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "enrollment");
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const clinics = await prisma.businessunits.findMany({
    where: { Status: "1" },
    select: { Code: true, Description: true },
    orderBy: { Description: "asc" },
  });

  return NextResponse.json({
    success: true,
    data: clinics.map((c) => ({ code: c.Code ?? "", name: c.Description ?? c.Code ?? "" })),
  });
}
