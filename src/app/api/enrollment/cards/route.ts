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

type CardRow = {
  id:                  number;
  cardnumber:          string | null;
  status:              number | null;
  dateenrolled:        Date   | null;
  receivedby:          string | null;
  receiveddate:        Date   | null;
  releaseto:           string | null;
  releaseby:           string | null;
  daterelease:         Date   | null;
  transferto:          string | null;
  transferby:          string | null;
  datetransfer:        Date   | null;
  clinicname:          string | null;
  transferclinicname:  string | null;
};
type CountRow = { total: bigint };

// GET /api/enrollment/cards?status=REGISTRATION|RECEIVING|TRANSFER&search=&page=1&pageSize=10
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "enrollment");

    const { searchParams } = new URL(request.url);
    const tabStatus  = searchParams.get("status")   || "REGISTRATION";
    const search     = searchParams.get("search")   || "";
    const page       = Math.max(1, parseInt(searchParams.get("page")     || "1",  10));
    const pageSize   = Math.min(50, parseInt(searchParams.get("pageSize") || "10", 10));
    const offset     = (page - 1) * pageSize;
    const searchPat  = `%${search}%`;

    // Map tab key → SQL status filter
    const statusFilter =
      tabStatus === "REGISTRATION" ? "AND e.status = 0" :
      tabStatus === "RECEIVING"    ? "AND e.status = 1" :
      tabStatus === "TRANSFER"     ? "AND e.status IN (2, 3)" :
      "";

    const baseFrom = `
      FROM cardenrollment e
      LEFT JOIN businessunits bu ON bu.code = e.releaseto
      LEFT JOIN businessunits bt ON bt.code = e.transferto
      WHERE (e.cardnumber ILIKE $1)
      ${statusFilter}
    `;

    const [countRows, cards] = await Promise.all([
      prisma.$queryRawUnsafe<CountRow[]>(
        `SELECT COUNT(*) AS total ${baseFrom}`,
        searchPat
      ),
      prisma.$queryRawUnsafe<CardRow[]>(
        `SELECT
           e.id, e.cardnumber, e.status,
           e.dateenrolled,
           e.receivedby, e.receiveddate,
           e.releaseto, e.releaseby, e.daterelease,
           e.transferto, e.transferby, e.datetransfer,
           bu.description AS clinicname,
           bt.description AS transferclinicname
         ${baseFrom}
         ORDER BY e.dateenrolled DESC
         LIMIT $2 OFFSET $3`,
        searchPat, pageSize, offset
      ),
    ]);

    const total = Number(countRows[0]?.total ?? 0);

    return NextResponse.json({
      success: true,
      data: cards.map((c) => ({
        id:                  c.id,
        cardNumber:          c.cardnumber      ?? "",
        status:              c.status          ?? 0,
        enrollmentDate:      c.dateenrolled?.toISOString()   ?? null,
        receivedBy:          c.receivedby      ?? null,
        receivedDate:        c.receiveddate?.toISOString()   ?? null,
        releaseTo:           c.releaseto       ?? null,
        releaseBy:           c.releaseby       ?? null,
        dateRelease:         c.daterelease?.toISOString()    ?? null,
        transferTo:          c.transferto      ?? null,
        transferBy:          c.transferby      ?? null,
        dateTransfer:        c.datetransfer?.toISOString()   ?? null,
        clinicName:          c.clinicname      ?? c.releaseto ?? null,
        transferClinicName:  c.transferclinicname ?? c.transferto ?? null,
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
    const verified = await prisma.cardVerified.findUnique({
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
