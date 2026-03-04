import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateSchema = z.object({
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  department: z.string().optional(),
  password: z.string().min(6).or(z.literal("")).optional(),
  role: z.string().optional(),
  activated: z.number().int().min(0).max(1),
});

// GET /api/users/[id] — fetch single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireApiAuth(request, "cms", "settings");
    const { id } = await params;

    const user = await prisma.user.findFirst({
      where: { id: parseInt(id, 10), deleted_at: null },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        department: true,
        role: true,
        activated: true,
        ldap_import: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("[GET /api/users/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 });
  }
}

// PUT /api/users/[id] — update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireApiAuth(request, "cms", "settings");
    const { id } = await params;

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { id: parseInt(id, 10), deleted_at: null },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      email: data.email ?? existing.email,
      first_name: data.first_name,
      last_name: data.last_name,
      department: data.department ?? existing.department,
      role: data.role ?? existing.role,
      activated: data.activated,
    };

    if (data.password && data.password.length > 0) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        department: true,
        role: true,
        activated: true,
        ldap_import: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("[PUT /api/users/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/users/[id] — soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiAuth(request, "cms", "settings");
    const { id } = await params;
    const userId = parseInt(id, 10);

    // Prevent self-deletion
    if (String(session.user.id) === String(userId)) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: { id: userId, deleted_at: null },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deleted_at: new Date(), activated: 0 },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("[DELETE /api/users/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
  }
}
