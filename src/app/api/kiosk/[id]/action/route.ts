import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * PATCH /api/kiosk/[id]/action
 *
 * Two modes:
 *   1. id is a kiosk_queue.id  → update existing kiosk row
 *   2. id is a queue.id (no kiosk row yet) → create kiosk row first, then update
 *
 * Body: {
 *   action: "call" | "hold" | "resume" | "complete" | "exit" | "update_room"
 *   station?: string   — required when calling a patient who has no kiosk row yet
 *   idbu?: string
 *   room?: string      — required for update_room
 *   queue_id?: number  — the CMS queue.id (passed when id is kiosk_queue.id)
 * }
 *
 * Action semantics:
 *   call     → status: in_progress, call_count++  (creates kiosk row if needed)
 *   hold     → status: on_hold
 *   resume   → status: resume_queue
 *   complete → status: completed  (patient done at this station — disappears from queue)
 *   exit     → status: next_room  (patient moves to next station — disappears from queue)
 *   update_room → room: <value>
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const body = await request.json();
  const { action, station, idbu, room } = body as {
    action: string;
    station?: string;
    idbu?: string;
    room?: string;
  };

  // Try to find the kiosk_queue row by its own id first
  let entry = await prisma.kioskQueue.findUnique({ where: { id: Number(id) } });

  // If not found by kiosk id, the caller passed the CMS queue.id instead
  // (patient not yet processed at this station — create a kiosk row)
  if (!entry && action === "call") {
    if (!station) {
      return NextResponse.json({ error: "station is required when calling an unprocessed patient" }, { status: 400 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // id here is the queue_id (CMS queue.id)
    const existingToday = await prisma.kioskQueue.findFirst({
      where: { queue_id: BigInt(id), station, created_at: { gte: today } },
    });

    if (existingToday) {
      entry = existingToday;
    } else {
      entry = await prisma.kioskQueue.create({
        data: {
          queue_id:  BigInt(id),
          station,
          idbu,
          status:    "waiting",
          call_count: 0,
          input_by:  session.user.name ?? session.user.email ?? "system",
        },
      });
    }
  }

  if (!entry) {
    return NextResponse.json({ error: "Queue entry not found" }, { status: 404 });
  }

  let updateData: Record<string, unknown> = {};

  switch (action) {
    case "call":
      updateData = {
        status:     "in_progress",
        call_count: (entry.call_count ?? 0) + 1,
      };
      break;
    case "hold":
      updateData = { status: "on_hold" };
      break;
    case "resume":
      updateData = { status: "resume_queue" };
      break;
    case "complete":
      // Patient finished at this station — mark completed (removed from active queue)
      updateData = { status: "completed" };
      break;
    case "exit":
      // Patient exits / moves to next department
      updateData = { status: "next_room" };
      break;
    case "update_room":
      if (!room) return NextResponse.json({ error: "room is required" }, { status: 400 });
      updateData = { room };
      break;
    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }

  const updated = await prisma.kioskQueue.update({
    where: { id: entry.id },
    data:  updateData,
  });

  return NextResponse.json({
    success:    true,
    id:         updated.id,
    status:     updated.status,
    call_count: updated.call_count,
  });
}
