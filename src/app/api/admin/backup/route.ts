import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, parseUserRoles } from "@/lib/auth/rbac";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

/**
 * POST /api/admin/backup — Trigger a manual database backup.
 * Restricted to DEVTEAM role only.
 */
export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "settings");

  // Check DEVTEAM role
  const roles = parseUserRoles(session.user.role || "");
  const isDevTeam = roles.includes("[DEVTEAM]");

  if (!isDevTeam) {
    return NextResponse.json({ error: "Forbidden — DEVTEAM role required" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { db = "all" } = body as { db?: string };

  if (!["cms_v2", "cms_audit", "all"].includes(db)) {
    return NextResponse.json({ error: "Invalid db parameter. Use: cms_v2, cms_audit, or all" }, { status: 400 });
  }

  const scriptPath = path.resolve(process.cwd(), "scripts", "backup-db.sh");

  try {
    const { stdout, stderr } = await execFileAsync("bash", [scriptPath, "--db", db], {
      timeout: 300_000, // 5 minute timeout
      cwd: process.cwd(),
    });

    return NextResponse.json({
      success: true,
      db,
      output: stdout.trim(),
      warnings: stderr.trim() || undefined,
    });
  } catch (error) {
    console.error("POST /api/admin/backup error:", error);
    const err = error as { stdout?: string; stderr?: string; message?: string };
    return NextResponse.json(
      {
        error: "Backup failed",
        output: err.stdout?.trim() || "",
        detail: err.stderr?.trim() || err.message || "",
      },
      { status: 500 }
    );
  }
}
