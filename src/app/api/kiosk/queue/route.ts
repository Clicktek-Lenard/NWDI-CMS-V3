import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// Public endpoint — no auth required (TV display board)
export async function GET(request: NextRequest) {
  const sp        = request.nextUrl.searchParams;
  const clinicCode = sp.get("clinic") ?? "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where = {
    Date: { gte: today },
    Status: { not: 650 }, // exclude cancelled
    ...(clinicCode ? { IdBU: clinicCode } : {}),
  };

  try {
    const rows = await prisma.queue.findMany({
      where,
      select: {
        Id:         true,
        Code:       true,
        QFullName:  true,
        QFirstName: true,
        QLastName:  true,
        PatientType: true,
        Status:     true,
        DateTime:   true,
        IdBU:       true,
        AccessionNo: true,
      },
      orderBy: { DateTime: "asc" },
      take: 200,
    });

    return NextResponse.json({
      data: rows.map(r => ({
        ...r,
        Id: Number(r.Id),
      })),
      asOf: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
