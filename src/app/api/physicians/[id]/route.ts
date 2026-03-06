import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

// GET /api/physicians/[id] — Fetch full physician details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const physicianId = BigInt(id);

  const physician = await prisma.physician.findUnique({ where: { Id: physicianId } });

  if (!physician) {
    return NextResponse.json({ error: "Physician not found" }, { status: 404 });
  }

  return NextResponse.json({
    id:            Number(physician.Id),
    lastName:      physician.LastName      ?? "",
    firstName:     physician.FirstName     ?? "",
    middleName:    physician.MiddleName    ?? "",
    displayName:   physician.DisplayName   ?? "",
    prcNo:         physician.PRCNo         ?? "",
    degree:        physician.Degree        ?? "",
    status:        physician.Status,
    branchCode:    physician.BranchCode    ?? "",
    declineReason: physician.DeclineReason ?? "",
  });
}

// PATCH /api/physicians/[id] — Update physician status and/or decline reason
const patchSchema = z.object({
  status:        z.string().optional(),
  declineReason: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "cms", "queue");
  const { id } = await params;
  const physicianId = BigInt(id);

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { status, declineReason } = parsed.data;
  const updateBy = session.user.username || session.user.id || "system";

  await prisma.physician.update({
    where: { Id: physicianId },
    data: {
      ...(status        !== undefined && { Status:        status }),
      ...(declineReason !== undefined && { DeclineReason: declineReason || null }),
      UpdateBy:   updateBy,
      UpdateDate: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
