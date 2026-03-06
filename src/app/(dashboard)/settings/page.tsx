import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { UserManagementClient } from "@/components/settings/user-management-client";

export default async function SettingsPage() {
  await requireAuth(CMS_MODULES.SETTINGS.module, CMS_MODULES.SETTINGS.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">User management and system configuration</p>
      </div>

      {/* User Management */}
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

      {/* System Config */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">System Configuration</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          LDAP settings, facility management, integrations
        </p>
      </div>
    </div>
  );
}
