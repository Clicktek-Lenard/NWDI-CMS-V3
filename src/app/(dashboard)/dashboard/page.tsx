import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  await requireAuth(CMS_MODULES.DASHBOARD.module, CMS_MODULES.DASHBOARD.tab);
  return <DashboardClient />;
}
