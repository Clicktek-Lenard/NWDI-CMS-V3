import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    const session = await requireApiAuth(request, "cms", "clinical");

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const clinicCode = session.user.clinicCode || "";

    const where = {
      ...(clinicCode ? { clinic_code: clinicCode } : {}),
      ...(status
        ? { status }
        : { status: { in: ["WAITING", "IN_PROGRESS", "COMPLETED"] } }),
    };

    const [queue, stats] = await Promise.all([
      prisma.queue.findMany({
        where,
        orderBy: [{ priority: "desc" }, { queue_number: "asc" }],
        take: 100,
      }),
      prisma.queue.groupBy({
        by: ["status"],
        where: {
          ...(clinicCode ? { clinic_code: clinicCode } : {}),
          status: { in: ["WAITING", "IN_PROGRESS", "COMPLETED"] },
        },
        _count: { status: true },
      }),
    ]);

    // Get consultation notes for all queue entries
    const queueIds = queue.map((q) => q.id);
    let notes: { queue_id: number; status: string; pcp_doctor: string | null; diagnosis: string | null }[] = [];
    if (queueIds.length) {
      try {
        notes = await prisma.consultationNote.findMany({
          where: { queue_id: { in: queueIds } },
          select: { queue_id: true, status: true, pcp_doctor: true, diagnosis: true },
        });
      } catch {
        // consultation_notes table may not exist yet — skip silently
      }
    }

    const notesMap = new Map(notes.map((n) => [n.queue_id, n]));

    const statMap = Object.fromEntries(
      stats.map((s) => [s.status, s._count.status])
    );

    return NextResponse.json({
      success: true,
      data: queue.map((q) => ({
        id: q.id,
        queueNumber: q.queue_number,
        patientId: q.patient_id,
        patientName: q.patient_name,
        companyCode: q.company_code,
        companyName: q.company_name,
        status: q.status,
        priority: q.priority,
        clinicCode: q.clinic_code,
        createdAt: q.created_at,
        updatedAt: q.updated_at,
        consultation: notesMap.get(q.id) ?? null,
      })),
      stats: {
        waiting: statMap["WAITING"] ?? 0,
        inProgress: statMap["IN_PROGRESS"] ?? 0,
        completed: statMap["COMPLETED"] ?? 0,
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[GET /api/clinical/queue]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
