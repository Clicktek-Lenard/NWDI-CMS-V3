import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { AuditLogClient } from "@/components/settings/audit-log-client";

export default async function AuditLogPage() {
  await requireAuth(CMS_MODULES.SETTINGS.module, CMS_MODULES.SETTINGS.tab);
  return <AuditLogClient />;
}
