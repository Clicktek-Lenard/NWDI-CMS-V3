import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// GET /api/enrollment/card-numbers — list card numbers with usage status
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "enrollment");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

    // Get all enrolled card numbers to compute is_used
    const enrolled = await prisma.cardEnrollment.findMany({
      select: { cardnumber: true },
    });
    const enrolledSet = new Set(enrolled.map((e) => e.cardnumber).filter(Boolean));

    const where = {
      ...(search ? { generatedcardnumber: { contains: search, mode: "insensitive" as const } } : {}),
    };

    const [total, numbers] = await Promise.all([
      prisma.cardNumber.count({ where }),
      prisma.cardNumber.findMany({
        where,
        orderBy: { id: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: numbers.map((n) => ({
        ...n,
        is_used: enrolledSet.has(n.generatedcardnumber) ? 1 : 0,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
