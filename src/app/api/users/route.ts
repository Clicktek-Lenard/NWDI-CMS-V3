import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiAuth } from "@/lib/auth/rbac";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  department: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional(), // JSON string of UserRole[]
  activated: z.boolean().default(true),
});

// GET /api/users — list users with search + pagination
export async function GET(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "settings");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const status = searchParams.get("status"); // "active" | "inactive" | null

    const where = {
      deleted_at: null,
      ...(search
        ? {
            OR: [
              { username: { contains: search } },
              { first_name: { contains: search } },
              { last_name: { contains: search } },
              { email: { contains: search } },
              { department: { contains: search } },
            ],
          }
        : {}),
      ...(status === "active" ? { activated: true } : {}),
      ...(status === "inactive" ? { activated: false } : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
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
        orderBy: { created_at: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[GET /api/users]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST /api/users — create a new user
export async function POST(request: NextRequest) {
  try {
    await requireApiAuth(request, "cms", "settings");

    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { username: data.username, deleted_at: null },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email || "",
        first_name: data.first_name,
        last_name: data.last_name,
        department: data.department || "",
        password: hashedPassword,
        role: data.role || "[]",
        activated: data.activated,
        ldap_import: false,
      },
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

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/users]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
