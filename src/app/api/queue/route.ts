import { NextRequest, NextResponse } from "next/server";
import { QueueService } from "@/services/queue.service";
import { requireApiAuth } from "@/lib/auth/rbac";
import { addToQueueSchema } from "@/lib/validators/queue";
import type { QueueStatus } from "@/types";

/**
 * GET /api/queue — List today's queue
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "50");
  const status = searchParams.get("status") as QueueStatus | undefined;
  const clinicCode =
    session.user.clinicCode || "CEN";

  try {
    const data = await QueueService.getTodaysQueue(clinicCode, page, pageSize, status);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/queue — Add patient to queue
 */
export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");

  try {
    const body = await request.json();
    const validated = addToQueueSchema.parse(body);
    const clinicCode =
      session.user.clinicCode || "CEN";
    const userId = parseInt(session.user.id);

    const entry = await QueueService.addToQueue({
      ...validated,
      clinicCode,
      createdBy: userId,
    });

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Failed to add to queue:", error);
    return NextResponse.json({ error: "Failed to add to queue" }, { status: 500 });
  }
}
