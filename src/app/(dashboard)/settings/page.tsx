import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function SettingsPage() {
  await requireAuth(CMS_MODULES.SETTINGS.module, CMS_MODULES.SETTINGS.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500">User management and system configuration</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Management */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">User Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage users, roles, and permissions
          </p>
        </div>

        {/* System Config */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">System Configuration</h2>
          <p className="mt-1 text-sm text-slate-500">
            LDAP settings, facility management, integrations
          </p>
        </div>
      </div>
    </div>
  );
}
