import { NextRequest, NextResponse } from "next/server";
import { QueueService } from "@/services/queue.service";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

/**
 * GET /api/queue — List today's queue (mirrors CMS todaysQueue() logic)
 * Joins queue + queuestatus, filtered by Date = today and IdBU = clinicCode.
 * Response includes stats (count per status) alongside paginated data.
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "200");
  const statusFilter = searchParams.get("status") || undefined;
  const clinicCode = session.user.clinicCode || "CEN";

  try {
    const data = await QueueService.getTodaysQueue(clinicCode, page, pageSize, statusFilter);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue data" },
      { status: 500 }
    );
  }
}

// ── POST /api/queue — Create a new queue entry + transactions ─
const transactionItemSchema = z.object({
  idCompany:            z.number().int(),
  nameCompany:          z.string(),
  idDoctor:             z.number().int().nullable(),
  nameDoctor:           z.string(),
  transactionType:      z.string(),
  idItemPrice:          z.number().int(),
  codeItemPrice:        z.string(),
  descriptionItemPrice: z.string(),
  priceGroupItemPrice:  z.string(),
  amountItemPrice:      z.number(),
  readersFee:           z.number(),
  origAmount:           z.number(),
  groupItemMaster:      z.string(),
});

const createQueueSchema = z.object({
  idPatient:    z.number().int().positive(),
  fullName:     z.string().min(1),
  lastName:     z.string(),
  firstName:    z.string().min(1),
  middleName:   z.string(),
  gender:       z.string(),
  dob:          z.string().nullable(),
  patientType:  z.string().optional().default("OUT-PATIENT"),
  notes:        z.string().optional(),
  priority:     z.number().int().optional(),
  medication:   z.string().optional(),
  lastDose:     z.string().optional(),
  lastPeriod:   z.string().optional(),
  transactions: z.array(transactionItemSchema).optional(),
});

export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");
  const clinicCode = session.user.clinicCode || "CEN";
  const inputBy    = session.user.username  || session.user.id || "system";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createQueueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  try {
    const entry = await QueueService.createQueue({
      clinicCode,
      inputBy,
      ...parsed.data,
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Failed to create queue entry:", error);
    return NextResponse.json(
      { error: "Failed to create queue entry" },
      { status: 500 }
    );
  }
}
