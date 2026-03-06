import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const registerSchema = z.object({
  card_number: z.string().min(1, "Card number is required"),
});

/**
 * Lifecycle based on real cardenrollment fields:
 *  TRANSFERRED if TransferTo is set
 *  VERIFIED    if DateRelease is set (released to patient)
 *  RECEIVED    if ReceivedDate is set (physical card received by ICT)
 *  REGISTERED  otherwise
 */
function getLifecycle(
  transferTo: string | null,
  dateRelease: Date | null,
  receivedDate: Date | null,
  dateReceived: Date | null
): "REGISTERED" | "RECEIVED" | "VERIFIED" | "TRANSFERRED" {
  if (transferTo) return "TRANSFERRED";
  if (dateRelease) return "VERIFIED";
  if (receivedDate || dateReceived) return "RECEIVED";
  return "REGISTERED";
}

type CardRow = {
  id: number;
  cardnumber: string | null;
  dateenrolled: Date | null;
  receivedby: string | null;
  receiveddate: Date | null;
  releaseto: string | null;
  releaseby: string | null;
  daterelease: Date | null;
  transferto: string | null;
  transferby: string | null;
  datetransfer: Date | null;
  status: number | null;
  companycode: string | null;
  companyname: string | null;
  datereceived: Date | null;
  ictreceived: string | null;
};

type CountRow = { total: bigint };

// GET /api/enrollment/cards?status=REGISTERED|RECEIVED|VERIFIED|TRANSFERRED&search=&page=1&pageSize=10
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "enrollment");

    const { searchParams } = new URL(request.url);
    const lifecycle = searchParams.get("status") || "REGISTERED";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const offset = (page - 1) * pageSize;
    const searchPattern = `%${search}%`;

    // Lifecycle filter: built from our own enum — safe to inline as SQL string
    const lifecycleFilter =
      lifecycle === "REGISTERED"
        ? "AND e.receiveddate IS NULL AND v.verifiedcardnumbers IS NULL AND e.daterelease IS NULL AND e.transferto IS NULL"
        : lifecycle === "RECEIVED"
        ? "AND (e.receiveddate IS NOT NULL OR v.verifiedcardnumbers IS NOT NULL) AND e.daterelease IS NULL AND e.transferto IS NULL"
        : lifecycle === "VERIFIED"
        ? "AND e.daterelease IS NOT NULL AND e.transferto IS NULL"
        : lifecycle === "TRANSFERRED"
        ? "AND e.transferto IS NOT NULL"
        : "";

    const [countRows, cards] = await Promise.all([
      prisma.$queryRawUnsafe<CountRow[]>(
        `SELECT COUNT(*) AS total
         FROM cardenrollment e
         LEFT JOIN cardkey k ON k.generatedcardnumber = e.cardnumber
         LEFT JOIN companies c ON c.code = k.codecompany
         LEFT JOIN cardverified v ON v.verifiedcardnumbers = e.cardnumber
         WHERE (e.cardnumber ILIKE $1 OR c.name ILIKE $2)
         ${lifecycleFilter}`,
        searchPattern, searchPattern
      ),
      prisma.$queryRawUnsafe<CardRow[]>(
        `SELECT
           e.id, e.cardnumber, e.dateenrolled,
           e.receivedby, e.receiveddate,
           e.releaseto, e.releaseby, e.daterelease,
           e.transferto, e.transferby, e.datetransfer,
           e.status,
           c.code AS companycode, c.name AS companyname,
           v.datereceived, v.ictreceived
         FROM cardenrollment e
         LEFT JOIN cardkey k ON k.generatedcardnumber = e.cardnumber
         LEFT JOIN companies c ON c.code = k.codecompany
         LEFT JOIN cardverified v ON v.verifiedcardnumbers = e.cardnumber
         WHERE (e.cardnumber ILIKE $1 OR c.name ILIKE $2)
         ${lifecycleFilter}
         ORDER BY e.dateenrolled DESC
         LIMIT $3 OFFSET $4`,
        searchPattern, searchPattern, pageSize, offset
      ),
    ]);

    const total = Number(countRows[0]?.total ?? 0);

    return NextResponse.json({
      success: true,
      data: cards.map((c) => ({
        id: c.id,
        cardNumber: c.cardnumber ?? "",
        enrollmentDate: c.dateenrolled?.toISOString() ?? null,
        receivedBy: c.receivedby ?? null,
        receivedDate: c.receiveddate?.toISOString() ?? null,
        releaseTo: c.releaseto ?? null,
        releaseBy: c.releaseby ?? null,
        dateRelease: c.daterelease?.toISOString() ?? null,
        transferTo: c.transferto ?? null,
        transferBy: c.transferby ?? null,
        dateTransfer: c.datetransfer?.toISOString() ?? null,
        status: c.status,
        companyCode: c.companycode ?? "",
        companyName: c.companyname ?? "",
        dateReceived: c.datereceived?.toISOString() ?? null,
        ictReceived: c.ictreceived ?? null,
        lifecycle: getLifecycle(c.transferto, c.daterelease, c.receiveddate, c.datereceived),
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

// POST /api/enrollment/cards — enroll a card (register into cardenrollment)
export async function POST(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "enrollment");

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { card_number } = parsed.data;

    // Validate card exists in cardkey
    const cardKey = await prisma.cardNumber.findUnique({
      where: { generatedcardnumber: card_number },
    });
    if (!cardKey) {
      return NextResponse.json(
        { success: false, error: "Card number not found in the system" },
        { status: 404 }
      );
    }

    // Check not already enrolled
    const existing = await prisma.cardEnrollment.findFirst({
      where: { cardnumber: card_number },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Card number is already enrolled" },
        { status: 409 }
      );
    }

    const enrollment = await prisma.cardEnrollment.create({
      data: {
        cardnumber: card_number,
        dateenrolled: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, data: enrollment },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/enrollment/cards]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
