import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth, parseUserRoles } from "@/lib/auth/rbac";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { logActivity, AUDIT_ACTIONS, getClientIp } from "@/lib/audit";

const resetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// POST /api/users/[id]/reset-password — admin-only password reset
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiAuth(request, "cms", "settings");

    // Only [DEVTEAM] or [USERCMS] can reset passwords
    const roles = parseUserRoles(session.user.role ?? null);
    if (!roles.includes("[DEVTEAM]") && !roles.includes("[USERCMS]")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Verify target user exists
    const targetUser = await prisma.user.findFirst({
      where: { id: userId, deleted_at: null },
      select: { id: true, username: true, first_name: true, last_name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
      },
    });

    // Audit log
    const targetName = [targetUser.first_name, targetUser.last_name].filter(Boolean).join(" ") || targetUser.username || String(userId);
    await logActivity(
      session,
      AUDIT_ACTIONS.UPDATE_USER,
      "user",
      userId,
      { description: `Password reset for user: ${targetName} (${targetUser.username})`, ip: getClientIp(request) },
    );

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("[POST /api/users/[id]/reset-password]", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
