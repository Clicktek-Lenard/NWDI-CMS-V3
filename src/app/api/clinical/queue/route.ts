import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";

// Active queue status codes from the real queue table
const ACTIVE_STATUSES = [280, 230, 201, 210];

// Map ConsultationNote.status to UI display status
function getDisplayStatus(noteStatus?: string): "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" {
  if (!noteStatus || noteStatus === "PENDING") return "WAITING";
  if (noteStatus === "IN_PROGRESS") return "IN_PROGRESS";
  if (noteStatus === "COMPLETED") return "COMPLETED";
  if (noteStatus === "CANCELLED") return "CANCELLED";
  return "WAITING";
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireApiAuth(request, "cms", "clinical");

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") || ""; // WAITING | IN_PROGRESS | COMPLETED
    const clinicCode = session.user.clinicCode || "";

    const where = {
      status: { in: ACTIVE_STATUSES },
      ...(clinicCode ? { idbu: clinicCode } : {}),
    };

    const queue = await prisma.queue.findMany({
      where,
      orderBy: { datetime: "asc" },
      take: 200,
    });

    const queueIds = queue.map((q) => Number(q.id));

    // Load consultation notes for display status and details
    let notes: {
      queue_id: number;
      status: string;
      pcp_doctor: string | null;
      diagnosis: string | null;
      is_draft: number;
    }[] = [];
    if (queueIds.length) {
      try {
        notes = await prisma.consultationNote.findMany({
          where: { queue_id: { in: queueIds } },
          select: { queue_id: true, status: true, pcp_doctor: true, diagnosis: true, is_draft: true },
        });
      } catch {
        // consultation_notes may not exist yet
      }
    }

    const notesMap = new Map(notes.map((n) => [n.queue_id, n]));

    // Build entries with display status derived from ConsultationNote
    const allEntries = queue.map((q) => {
      const note = notesMap.get(Number(q.id));
      return {
        id: Number(q.id),
        queueNumber: Number(q.id),
        patientId: String(q.idpatient),
        patientName: q.qfullname ?? "",
        gender: q.qgender,
        age: q.agepatient,
        accessionNo: q.accessionno,
        companyCode: null as string | null,
        companyName: null as string | null,
        status: getDisplayStatus(note?.status),
        priority: 0,
        clinicCode: q.idbu,
        queueCode: q.code,
        createdAt: q.datetime.toISOString(),
        consultation: note
          ? { status: note.status, pcp_doctor: note.pcp_doctor, diagnosis: note.diagnosis, is_draft: note.is_draft }
          : null,
      };
    });

    // Apply status filter on computed display status
    const data = statusFilter
      ? allEntries.filter((e) => e.status === statusFilter)
      : allEntries;

    // Stats from all entries (not just filtered)
    const stats = {
      waiting:    allEntries.filter((e) => e.status === "WAITING").length,
      inProgress: allEntries.filter((e) => e.status === "IN_PROGRESS").length,
      completed:  allEntries.filter((e) => e.status === "COMPLETED").length,
    };

    return NextResponse.json({ success: true, data, stats });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[GET /api/clinical/queue]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
