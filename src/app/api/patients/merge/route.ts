import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const mergeSchema = z.object({
  keepId:  z.number().int().positive(),
  mergeId: z.number().int().positive(),
});

// POST /api/patients/merge
// Reassigns all queue records from mergeId → keepId, then soft-deletes mergeId (Status = "MERGED")
export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "settings");

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = mergeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { keepId, mergeId } = parsed.data;

  if (keepId === mergeId) {
    return NextResponse.json({ error: "keepId and mergeId must be different" }, { status: 422 });
  }

  const keepBig  = BigInt(keepId);
  const mergeBig = BigInt(mergeId);

  // Verify both patients exist and are not already merged
  const [keepPatient, mergePatient] = await Promise.all([
    prisma.patient.findFirst({ where: { Id: keepBig, Status: { not: "MERGED" } } }),
    prisma.patient.findFirst({ where: { Id: mergeBig, Status: { not: "MERGED" } } }),
  ]);

  if (!keepPatient)  return NextResponse.json({ error: "Keep patient not found or already merged" },  { status: 404 });
  if (!mergePatient) return NextResponse.json({ error: "Merge patient not found or already merged" }, { status: 404 });

  try {
    // Run in a transaction: reassign queue records + soft-delete
    await prisma.$transaction(async (tx) => {
      // Reassign all queue entries from mergeId to keepId
      await tx.queue.updateMany({
        where:  { IdPatient: mergeBig },
        data:   { IdPatient: keepBig },
      });

      // Soft-delete the merged patient
      await tx.patient.update({
        where: { Id: mergeBig },
        data: {
          Status:   "MERGED",
          IsActive: 0,
          // Store a note in a comment field if available
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Patient #${mergeId} merged into #${keepId}. ${mergePatient.FullName} → ${keepPatient.FullName}`,
      keptPatientId:   keepId,
      mergedPatientId: mergeId,
    });
  } catch (error) {
    console.error("Patient merge error:", error);
    return NextResponse.json({ error: "Failed to merge patients" }, { status: 500 });
  }
}
