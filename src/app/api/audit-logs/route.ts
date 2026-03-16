import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import auditPrisma from "@/lib/db/audit-prisma";

// GET /api/audit-logs — paginated, filterable activity log
export async function GET(request: NextRequest) {
  await requireApiAuth(request, "cms", "settings");

  const sp       = request.nextUrl.searchParams;
  const page     = Math.max(1, parseInt(sp.get("page")     || "1",  10));
  const pageSize = Math.min(100, parseInt(sp.get("pageSize") || "50", 10));
  const action   = sp.get("action")   || undefined;
  const resource = sp.get("resource") || undefined;
  const username = sp.get("username") || undefined;
  const dateFrom = sp.get("dateFrom") || undefined;
  const dateTo   = sp.get("dateTo")   || undefined;

  const where = {
    ...(action   ? { action }   : {}),
    ...(resource ? { resource } : {}),
    ...(username ? { username: { contains: username, mode: "insensitive" as const } } : {}),
    ...(dateFrom || dateTo
      ? {
          created_at: {
            ...(dateFrom ? { gte: new Date(`${dateFrom}T00:00:00+08:00`) } : {}),
            ...(dateTo   ? { lte: new Date(`${dateTo}T23:59:59+08:00`)   } : {}),
          },
        }
      : {}),
  };

  try {
    const [total, logs] = await Promise.all([
      auditPrisma.activityLog.count({ where }),
      auditPrisma.activityLog.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip:    (page - 1) * pageSize,
        take:    pageSize,
      }),
    ]);

    return NextResponse.json({
      data:       logs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[GET /api/audit-logs]", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
