import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

// GET /api/results/branches — active business units for the sendout branch dropdown
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "results");

    const branches = await prisma.businessunits.findMany({
      where:   { Status: "ACTIVE" },
      select:  { Code: true, Description: true },
      orderBy: { Code: "asc" },
    });

    const data = branches.map((b) => ({
      code:        b.Code        ?? "",
      description: b.Description ?? "",
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("[GET /api/results/branches]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch branches" }, { status: 500 });
  }
}
