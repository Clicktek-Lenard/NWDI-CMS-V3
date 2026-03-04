import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import { z } from "zod";

const itemSchema = z.object({
  item_code: z.string(),
  item_name: z.string().optional(),
  findings: z.string().optional().nullable(),       // JSON string array
  assessment: z.string().optional().nullable(),     // JSON string array
  recommendation: z.string().optional().nullable(), // JSON string array
  class_value: z.enum(["A", "B", "C", "D", "Pending"]).optional().nullable(),
});

const medEvalSchema = z.object({
  patient_id: z.string(),
  items: z.array(itemSchema),
});

/** Overall class priority: Pending > D > C > B > A */
function calcOverallClass(classes: (string | null | undefined)[]): string {
  const valid = classes.filter(Boolean) as string[];
  if (valid.includes("Pending")) return "Pending";
  if (valid.includes("D")) return "D";
  if (valid.includes("C")) return "C";
  if (valid.includes("B")) return "B";
  return "A";
}

type Params = { params: Promise<{ queueId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;

    const items = await prisma.medicalEvaluation.findMany({
      where: { queue_id: parseInt(queueId, 10) },
      orderBy: { created_at: "asc" },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await requireApiAuth(request, "cms", "clinical");
    const { queueId } = await params;
    const qid = parseInt(queueId, 10);

    const body = await request.json();
    const parsed = medEvalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { patient_id, items } = parsed.data;
    const recordedBy = parseInt(session.user.id);

    // Upsert each item
    await Promise.all(
      items.map((item) =>
        prisma.medicalEvaluation.upsert({
          where: { queue_id_item_code: { queue_id: qid, item_code: item.item_code } },
          update: {
            item_name: item.item_name ?? null,
            findings: item.findings ?? null,
            assessment: item.assessment ?? null,
            recommendation: item.recommendation ?? null,
            class_value: item.class_value ?? null,
            recorded_by: recordedBy,
          },
          create: {
            queue_id: qid,
            patient_id,
            item_code: item.item_code,
            item_name: item.item_name ?? null,
            findings: item.findings ?? null,
            assessment: item.assessment ?? null,
            recommendation: item.recommendation ?? null,
            class_value: item.class_value ?? null,
            recorded_by: recordedBy,
          },
        })
      )
    );

    // Recalculate overall class from all saved items
    const allItems = await prisma.medicalEvaluation.findMany({
      where: { queue_id: qid },
      select: { class_value: true },
    });
    const overallClass = calcOverallClass(allItems.map((i) => i.class_value));

    // Update PhysicalExamination.fitness_class if PE record exists
    await prisma.physicalExamination.updateMany({
      where: { queue_id: qid },
      data: { fitness_class: overallClass },
    });

    return NextResponse.json({ success: true, overall_class: overallClass });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
