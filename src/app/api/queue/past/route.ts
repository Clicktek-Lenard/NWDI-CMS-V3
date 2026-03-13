import { NextRequest, NextResponse } from "next/server";
import { QueueService } from "@/services/queue.service";
import { requireApiAuth } from "@/lib/auth/rbac";

/**
 * GET /api/queue/past — Historical queue records (Date < today, all statuses)
 * Mirrors old CMS Queue::pastQueue() + PastQueueController::getList()
 *
 * Query params:
 *   q          — patient name search
 *   dateFrom   — "YYYY-MM-DD" start date (inclusive)
 *   dateTo     — "YYYY-MM-DD" end date (exclusive)
 *   status     — status name filter
 *   page       — page number (default 1)
 *   pageSize   — records per page (default 100, max 500)
 */
export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");
  const clinicCode = session.user.clinicCode || "CEN";

  const sp       = request.nextUrl.searchParams;
  const q        = sp.get("q")        || undefined;
  const dateFrom = sp.get("dateFrom") || undefined;
  const dateTo   = sp.get("dateTo")   || undefined;
  const status   = sp.get("status")   || undefined;
  const page     = parseInt(sp.get("page")     || "1");
  const pageSize = Math.min(parseInt(sp.get("pageSize") || "100"), 500);

  try {
    const data = await QueueService.getPastQueue(clinicCode, {
      q, dateFrom, dateTo, status, page, pageSize,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch past queue:", error);
    return NextResponse.json({ error: "Failed to fetch past queue" }, { status: 500 });
  }
}
