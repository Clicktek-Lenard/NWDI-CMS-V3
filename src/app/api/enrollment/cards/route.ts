import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const registerSchema = z.object({
  card_number: z.string().min(1, "Card number is required"),
  release_to:  z.string().min(1, "Destination clinic is required"),
});

/**
 * Legacy status codes (from cardenrollment.status):
 *   0 = Enrolled / Released to clinic — pending receipt
 *   1 = Received at destination clinic
 *   2 = Transfer initiated (in transit to another clinic)
 *   3 = Transfer received — new clinic has it
 */

// GET /api/enrollment/cards?status=REGISTRATION|RECEIVING|TRANSFER&search=&page=1&pageSize=10
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "enrollment");

    const { searchParams } = new URL(request.url);
    const tabStatus = searchParams.get("status")   || "REGISTRATION";
    const search    = searchParams.get("search")   || "";
    const page      = Math.max(1, parseInt(searchParams.get("page")     || "1",  10));
    const pageSize  = Math.min(50, parseInt(searchParams.get("pageSize") || "10", 10));

    const statusWhere =
      tabStatus === "REGISTRATION" ? { status: 0 } :
      tabStatus === "RECEIVING"    ? { status: 1 } :
      tabStatus === "TRANSFER"     ? { status: { in: [2, 3] } } :
      {};

    const where = {
      ...statusWhere,
      ...(search ? { cardnumber: { contains: search, mode: "insensitive" as const } } : {}),
    };

    const [total, enrollments] = await Promise.all([
      prisma.cardEnrollment.count({ where }),
      prisma.cardEnrollment.findMany({
        where,
        orderBy: { dateenrolled: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    // Resolve clinic names from businessunits
    const codes = [...new Set([
      ...enrollments.map(e => e.releaseto),
      ...enrollments.map(e => e.transferto),
    ].filter(Boolean))] as string[];

    const clinics = codes.length > 0
      ? await prisma.businessunits.findMany({
          where: { Code: { in: codes } },
          select: { Code: true, Description: true },
        })
      : [];
    const clinicMap = new Map(clinics.map(c => [c.Code, c.Description]));

    return NextResponse.json({
      success: true,
      data: enrollments.map((c) => ({
        id:                  c.id,
        cardNumber:          c.cardnumber      ?? "",
        status:              c.status          ?? 0,
        enrollmentDate:      c.dateenrolled?.toISOString()  ?? null,
        receivedBy:          c.receivedby      ?? null,
        receivedDate:        c.receiveddate?.toISOString()  ?? null,
        releaseTo:           c.releaseto       ?? null,
        releaseBy:           c.releaseby       ?? null,
        dateRelease:         c.daterelease?.toISOString()   ?? null,
        transferTo:          c.transferto      ?? null,
        transferBy:          c.transferby      ?? null,
        dateTransfer:        c.datetransfer?.toISOString()  ?? null,
        clinicName:          (c.releaseto  ? clinicMap.get(c.releaseto)  : null) ?? c.releaseto  ?? null,
        transferClinicName:  (c.transferto ? clinicMap.get(c.transferto) : null) ?? c.transferto ?? null,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[GET /api/enrollment/cards]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST /api/enrollment/cards — enroll a verified card to a clinic (status = 0)
export async function POST(request: NextRequest) {
  try {
    const session = await requireApiAuth(request, "cms", "enrollment");

    const body   = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { card_number, release_to } = parsed.data;

    // Guard 1: Card must be in cardverified (ICT verified it)
    const verified = await prisma.cardVerified.findFirst({
      where: { verifiedcardnumbers: card_number },
    });
    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Card must be verified by ICT before it can be enrolled." },
        { status: 422 }
      );
    }

    // Guard 2: Not already enrolled
    const existing = await prisma.cardEnrollment.findFirst({
      where: { cardnumber: card_number },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Card number is already enrolled." },
        { status: 409 }
      );
    }

    const staffName = session.user.name ?? session.user.id;
    const now = new Date();

    const enrollment = await prisma.cardEnrollment.create({
      data: {
        cardnumber:  card_number,
        releaseto:   release_to,
        dateenrolled: now,
        daterelease:  now,
        releaseby:    staffName,
        status:       0,
      },
    });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/enrollment/cards]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
