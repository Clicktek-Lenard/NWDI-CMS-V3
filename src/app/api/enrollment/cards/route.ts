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
  Id: number;
  CardNumber: string | null;
  DateEnrolled: Date | null;
  ReceivedBy: string | null;
  ReceivedDate: Date | null;
  ReleaseTo: string | null;
  ReleaseBy: string | null;
  DateRelease: Date | null;
  TransferTo: string | null;
  TransferBy: string | null;
  DateTransfer: Date | null;
  Status: number | null;
  companyCode: string | null;
  companyName: string | null;
  dateReceived: Date | null;
  ictReceived: string | null;
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
        ? "AND e.ReceivedDate IS NULL AND v.VerifiedCardNumbers IS NULL AND e.DateRelease IS NULL AND e.TransferTo IS NULL"
        : lifecycle === "RECEIVED"
        ? "AND (e.ReceivedDate IS NOT NULL OR v.VerifiedCardNumbers IS NOT NULL) AND e.DateRelease IS NULL AND e.TransferTo IS NULL"
        : lifecycle === "VERIFIED"
        ? "AND e.DateRelease IS NOT NULL AND e.TransferTo IS NULL"
        : lifecycle === "TRANSFERRED"
        ? "AND e.TransferTo IS NOT NULL"
        : "";

    const [countRows, cards] = await Promise.all([
      prisma.$queryRawUnsafe<CountRow[]>(
        `SELECT COUNT(*) AS total
         FROM cardenrollment e
         LEFT JOIN cardkey k ON k.GeneratedCardNumber = e.CardNumber
         LEFT JOIN companies c ON c.Code = k.CodeCompany
         LEFT JOIN cardverified v ON v.VerifiedCardNumbers = e.CardNumber
         WHERE (e.CardNumber LIKE ? OR c.Name LIKE ?)
         ${lifecycleFilter}`,
        searchPattern, searchPattern
      ),
      prisma.$queryRawUnsafe<CardRow[]>(
        `SELECT
           e.Id, e.CardNumber, e.DateEnrolled,
           e.ReceivedBy, e.ReceivedDate,
           e.ReleaseTo, e.ReleaseBy, e.DateRelease,
           e.TransferTo, e.TransferBy, e.DateTransfer,
           e.Status,
           c.Code AS companyCode, c.Name AS companyName,
           v.DateReceived AS dateReceived, v.ICTReceived AS ictReceived
         FROM cardenrollment e
         LEFT JOIN cardkey k ON k.GeneratedCardNumber = e.CardNumber
         LEFT JOIN companies c ON c.Code = k.CodeCompany
         LEFT JOIN cardverified v ON v.VerifiedCardNumbers = e.CardNumber
         WHERE (e.CardNumber LIKE ? OR c.Name LIKE ?)
         ${lifecycleFilter}
         ORDER BY e.DateEnrolled DESC
         LIMIT ? OFFSET ?`,
        searchPattern, searchPattern, pageSize, offset
      ),
    ]);

    const total = Number(countRows[0]?.total ?? 0);

    return NextResponse.json({
      success: true,
      data: cards.map((c) => ({
        id: c.Id,
        cardNumber: c.CardNumber ?? "",
        enrollmentDate: c.DateEnrolled?.toISOString() ?? null,
        receivedBy: c.ReceivedBy ?? null,
        receivedDate: c.ReceivedDate?.toISOString() ?? null,
        releaseTo: c.ReleaseTo ?? null,
        releaseBy: c.ReleaseBy ?? null,
        dateRelease: c.DateRelease?.toISOString() ?? null,
        transferTo: c.TransferTo ?? null,
        transferBy: c.TransferBy ?? null,
        dateTransfer: c.DateTransfer?.toISOString() ?? null,
        status: c.Status,
        companyCode: c.companyCode ?? "",
        companyName: c.companyName ?? "",
        dateReceived: c.dateReceived?.toISOString() ?? null,
        ictReceived: c.ictReceived ?? null,
        lifecycle: getLifecycle(c.TransferTo, c.DateRelease, c.ReceivedDate, c.dateReceived),
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
      where: { GeneratedCardNumber: card_number },
    });
    if (!cardKey) {
      return NextResponse.json(
        { success: false, error: "Card number not found in the system" },
        { status: 404 }
      );
    }

    // Check not already enrolled
    const existing = await prisma.cardEnrollment.findFirst({
      where: { CardNumber: card_number },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Card number is already enrolled" },
        { status: 409 }
      );
    }

    const enrollment = await prisma.cardEnrollment.create({
      data: {
        CardNumber: card_number,
        DateEnrolled: new Date(),
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
