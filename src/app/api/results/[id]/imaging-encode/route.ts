import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const schema = z.object({
  accession_id:     z.number().int(),
  item_code:        z.string().max(30).optional().nullable(),
  item_description: z.string().max(500).optional().nullable(),
  interpretation:   z.string().optional().nullable(),
  impression:       z.string().optional().nullable(),
  radiologist_name: z.string().max(200).optional().nullable(),
});

/**
 * POST /api/results/[id]/imaging-encode
 * Upserts an imaging result (interpretation) for one accession.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "results");
  const { id } = await params;
  const queueId = BigInt(id);

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
  }

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) return NextResponse.json({ error: "Queue not found" }, { status: 404 });

  const d = parsed.data;
  const encodedBy = session.user.username || session.user.id;
  const now = new Date();

  await prisma.imagingResult.upsert({
    where: { accession_id: BigInt(d.accession_id) },
    create: {
      accession_id:     BigInt(d.accession_id),
      queue_id:         queueId,
      item_code:        d.item_code ?? null,
      item_description: d.item_description ?? null,
      interpretation:   d.interpretation ?? null,
      impression:       d.impression ?? null,
      radiologist_name: d.radiologist_name ?? null,
      encoded_by:       encodedBy,
      encoded_at:       now,
      status:           "ENCODED",
    },
    update: {
      item_description: d.item_description ?? undefined,
      interpretation:   d.interpretation ?? null,
      impression:       d.impression ?? null,
      radiologist_name: d.radiologist_name ?? null,
      encoded_by:       encodedBy,
      encoded_at:       now,
      status:           "ENCODED",
    },
  });

  return NextResponse.json({ success: true });
}

/**
 * GET /api/results/[id]/imaging-encode
 * Returns all imaging results for a queue.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "results");
  const { id } = await params;
  const queueId = BigInt(id);

  const results = await prisma.imagingResult.findMany({
    where: { queue_id: queueId },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({
    success: true,
    data: results.map((r) => ({
      id:              r.id,
      accessionId:     Number(r.accession_id),
      itemCode:        r.item_code,
      itemDescription: r.item_description,
      interpretation:  r.interpretation,
      impression:      r.impression,
      radiologistName: r.radiologist_name,
      encodedBy:       r.encoded_by,
      encodedAt:       r.encoded_at?.toISOString() ?? null,
      status:          r.status,
    })),
  });
}
