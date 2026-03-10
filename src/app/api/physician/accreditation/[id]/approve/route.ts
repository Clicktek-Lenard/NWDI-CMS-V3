import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiAuth(request, "erosui", "physician");
  const { id } = await params;

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const by    = session.user.name ?? session.user.username ?? "unknown";

  const rows = await prisma.$queryRawUnsafe<Array<{ status: string }>>(
    `SELECT status FROM physician WHERE id = $1`,
    BigInt(id)
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (rows[0].status !== "Pending") {
    return NextResponse.json(
      { error: `Cannot approve: current status is '${rows[0].status}'` },
      { status: 409 }
    );
  }

  await prisma.$executeRawUnsafe(
    `UPDATE physician
     SET status = 'Active', approveby = $1, updatedate = $2, systemupdatetime = $3
     WHERE id = $4`,
    by, today, now, BigInt(id)
  );

  return NextResponse.json({ ok: true });
}
