import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/kiosk/counter
 * List all registered workstations (admin).
 */
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "queue");

  const counters = await prisma.kioskCounter.findMany({
    orderBy: [{ idbu: "asc" }, { department: "asc" }],
  });

  return NextResponse.json({ success: true, data: counters });
}

/**
 * POST /api/kiosk/counter
 * Register a new workstation.
 */
export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");
  const body = await request.json();
  const { station_number, ipv4, department, location, idbu } = body;

  if (!ipv4 || !department) {
    return NextResponse.json({ error: "ipv4 and department are required" }, { status: 400 });
  }

  const counter = await prisma.kioskCounter.create({
    data: {
      station_number,
      ipv4,
      department,
      location,
      idbu,
      input_by:   session.user.username ?? session.user.email ?? "system",
      input_date: new Date(),
    },
  });

  return NextResponse.json({ success: true, data: counter });
}
