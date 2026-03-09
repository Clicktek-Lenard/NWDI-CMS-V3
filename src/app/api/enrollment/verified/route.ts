import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "enrollment");
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const search    = searchParams.get("search") ?? "";
  const available = searchParams.get("available") === "true";
  const page      = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize  = Math.min(200, Math.max(1, Number(searchParams.get("pageSize") ?? "10")));

  const where = search
    ? { verifiedcardnumbers: { contains: search, mode: "insensitive" as const } }
    : {};

  // When ?available=true, exclude cards already enrolled
  let verifiedData;
  let total: number;

  if (available) {
    const enrolled = await prisma.cardEnrollment.findMany({ select: { cardnumber: true } });
    const enrolledSet = new Set(enrolled.map((e) => e.cardnumber).filter(Boolean));

    const all = await prisma.cardVerified.findMany({
      where,
      orderBy: { datereceived: "desc" },
    });

    verifiedData = all.filter((v) => !enrolledSet.has(v.verifiedcardnumbers));
    total = verifiedData.length;
    verifiedData = verifiedData.slice((page - 1) * pageSize, page * pageSize);
  } else {
    [total, verifiedData] = await Promise.all([
      prisma.cardVerified.count({ where }),
      prisma.cardVerified.findMany({
        where,
        orderBy: { datereceived: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
  }

  // Join with cardkey to get year / batch / month
  const cardNums = verifiedData.map((v) => v.verifiedcardnumbers);
  const keys = cardNums.length > 0
    ? await prisma.cardNumber.findMany({
        where: { generatedcardnumber: { in: cardNums } },
        select: { generatedcardnumber: true, year: true, batch: true, month: true },
      })
    : [];
  const keyMap = new Map(keys.map((k) => [k.generatedcardnumber, k]));

  const data = verifiedData.map((v) => {
    const key = keyMap.get(v.verifiedcardnumbers);
    return {
      id:                 v.id,
      verifiedcardnumber: v.verifiedcardnumbers,
      year:               key?.year  ?? null,
      batch:              key?.batch ?? null,
      month:              key?.month ?? null,
      ictreceived:        v.ictreceived,
      datereceived:       v.datereceived?.toISOString() ?? null,
    };
  });

  return NextResponse.json({
    success:    true,
    data,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}
