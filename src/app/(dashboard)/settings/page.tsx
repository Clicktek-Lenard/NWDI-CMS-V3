import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { auth } from "@/lib/auth/auth";
import { UserManagementClient } from "@/components/settings/user-management-client";
import { PatientManagementClient } from "@/components/settings/patient-management-client";
import { DatabaseBackupClient } from "@/components/settings/database-backup-client";
import Link from "next/link";
import { CreditCard, Building2, UserCheck, Shield } from "lucide-react";

export default async function SettingsPage() {
  await requireAuth(CMS_MODULES.SETTINGS.module, CMS_MODULES.SETTINGS.tab);
  const session = await auth();
  const isDevTeam = (session?.user?.role || "").includes("[DEVTEAM]");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">User management, patient records, and system configuration</p>
      </div>

      {/* ── Quick Access ── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/enrollment"
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">Card Management</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Health card enrollment &amp; verification</p>
          </div>
        </Link>

        <Link
          href="/eros/company"
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/30">
            <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">Company Management</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">EROS company &amp; service agreements</p>
          </div>
        </Link>

        <Link
          href="/eros/physician"
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
            <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">Physician Accreditation</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">EROS physician accreditation &amp; approvals</p>
          </div>
        </Link>

        <Link
          href="/settings/audit-log"
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-600"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/30">
            <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">Audit Log</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">System activity trail &amp; user actions</p>
          </div>
        </Link>
      </div>

      {/* ── Patient Management ── */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Patient Management</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Search, create, and edit patient demographics
          </p>
        </div>
        <PatientManagementClient />
      </div>

      {/* ── User Management ── */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">User Management</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Manage users, roles, and module permissions
            </p>
          </div>
        </div>
        <UserManagementClient />
      </div>

      {/* ── Database Backup (DEVTEAM only) ── */}
      {isDevTeam && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Database Backup</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Manually trigger a database backup — DEVTEAM access only
            </p>
          </div>
          <DatabaseBackupClient />
        </div>
      )}

      {/* ── System Config ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">System Configuration</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          LDAP settings, facility management, integrations
        </p>
      </div>
    </div>
  );
}
