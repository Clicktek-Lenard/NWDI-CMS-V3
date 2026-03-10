import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { ReportsClient } from "@/components/reports/reports-client";

export default async function ReportsPage() {
  await requireAuth(CMS_MODULES.REPORTS.module, CMS_MODULES.REPORTS.tab);

  return <ReportsClient />;
}
