import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, parseUserRoles } from "@/lib/auth/rbac";
import { execFile } from "child_process";
import { promisify } from "util";
import { mkdir } from "fs/promises";
import path from "path";

const execFileAsync = promisify(execFile);

// Find pg_dump — check common Windows install paths, then fall back to PATH
const PG_DUMP_PATHS = [
  "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe",
  "C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe",
  "C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe",
  "pg_dump", // fallback to PATH
];

function parseDatabaseUrl(url: string) {
  const m = url.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
  if (!m) throw new Error("Cannot parse DATABASE_URL");
  return { user: m[1], password: m[2], host: m[3], port: m[4], dbname: m[5] };
}

async function findPgDump(): Promise<string> {
  for (const p of PG_DUMP_PATHS) {
    try {
      await execFileAsync(p, ["--version"], { timeout: 5000 });
      return p;
    } catch {
      continue;
    }
  }
  throw new Error("pg_dump not found. Install PostgreSQL or add pg_dump to PATH.");
}

async function backupDatabase(pgDump: string, dbName: string, backupDir: string, connInfo: ReturnType<typeof parseDatabaseUrl>) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outFile = path.join(backupDir, `${dbName}_${timestamp}.dump`);

  await execFileAsync(
    pgDump,
    [
      "--host", connInfo.host,
      "--port", connInfo.port,
      "--username", connInfo.user,
      "--dbname", dbName,
      "--format", "custom",
      "--compress", "6",
      "--file", outFile,
    ],
    {
      timeout: 300_000,
      env: { ...process.env, PGPASSWORD: connInfo.password },
    }
  );

  return outFile;
}

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

  try {
    const pgDump = await findPgDump();
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });
    }

    const connInfo = parseDatabaseUrl(databaseUrl);
    const backupDir = path.resolve(process.cwd(), "backups");
    await mkdir(backupDir, { recursive: true });

    const results: string[] = [];
    const databases = db === "all" ? ["cms_v2", "cms_audit"] : [db];

    for (const dbName of databases) {
      const outFile = await backupDatabase(pgDump, dbName, backupDir, connInfo);
      results.push(`${dbName} → ${path.basename(outFile)}`);
    }

    return NextResponse.json({
      success: true,
      db,
      output: `Backup complete:\n${results.join("\n")}\nSaved to: ${backupDir}`,
    });
  } catch (error) {
    console.error("POST /api/admin/backup error:", error);
    const err = error as { stdout?: string; stderr?: string; message?: string };
    return NextResponse.json(
      {
        error: "Backup failed",
        detail: err.stderr?.trim() || err.message || String(error),
      },
      { status: 500 }
    );
  }
}
