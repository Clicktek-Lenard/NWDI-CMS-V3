import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const encodeSchema = z.object({
  accession_id:    z.number().int(),
  item_code:       z.string().max(30).optional().nullable(),
  item_description:z.string().max(500).optional().nullable(),
  result_value:    z.string().max(500).optional().nullable(),
  result_unit:     z.string().max(50).optional().nullable(),
  normal_range:    z.string().max(100).optional().nullable(),
  flag:            z.enum(["", "H", "L", "C"]).optional().nullable(),
  remarks:         z.string().optional().nullable(),
});

/**
 * POST /api/results/[id]/encode
 * Upserts a result value for one accession in a queue.
 * id = queue ID; accession_id in body = accessionno.Id
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

  const parsed = encodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
  }

  const queue = await prisma.queue.findUnique({ where: { Id: queueId } });
  if (!queue) return NextResponse.json({ error: "Queue not found" }, { status: 404 });

  const d = parsed.data;
  const encodedBy = session.user.username || session.user.id;
  const now = new Date();

  await prisma.resultValue.upsert({
    where: { accession_id: BigInt(d.accession_id) },
    create: {
      accession_id:     BigInt(d.accession_id),
      queue_id:         queueId,
      item_code:        d.item_code ?? null,
      item_description: d.item_description ?? null,
      result_value:     d.result_value ?? null,
      result_unit:      d.result_unit ?? null,
      normal_range:     d.normal_range ?? null,
      flag:             d.flag || null,
      remarks:          d.remarks ?? null,
      encoded_by:       encodedBy,
      encoded_at:       now,
      status:           "ENCODED",
    },
    update: {
      item_code:        d.item_code ?? undefined,
      item_description: d.item_description ?? undefined,
      result_value:     d.result_value ?? null,
      result_unit:      d.result_unit ?? null,
      normal_range:     d.normal_range ?? null,
      flag:             d.flag || null,
      remarks:          d.remarks ?? null,
      encoded_by:       encodedBy,
      encoded_at:       now,
      status:           "ENCODED",
    },
  });

  return NextResponse.json({ success: true });
}

/**
 * GET /api/results/[id]/encode
 * Returns all encoded result values for a queue.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "results");
  const { id } = await params;
  const queueId = BigInt(id);

  const values = await prisma.resultValue.findMany({
    where: { queue_id: queueId },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({
    success: true,
    data: values.map((v) => ({
      id:              v.id,
      accessionId:     Number(v.accession_id),
      itemCode:        v.item_code,
      itemDescription: v.item_description,
      resultValue:     v.result_value,
      resultUnit:      v.result_unit,
      normalRange:     v.normal_range,
      flag:            v.flag,
      remarks:         v.remarks,
      encodedBy:       v.encoded_by,
      encodedAt:       v.encoded_at?.toISOString() ?? null,
      validatedBy:     v.validated_by,
      validatedAt:     v.validated_at?.toISOString() ?? null,
      status:          v.status,
    })),
  });
}
