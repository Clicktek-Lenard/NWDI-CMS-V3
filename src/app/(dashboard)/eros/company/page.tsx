import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { ErosCompaniesClient } from "@/components/eros/eros-companies-client";

export default async function ErosCompanyPage() {
  await requireAuth(CMS_MODULES.EROS.module, CMS_MODULES.EROS.tab);
  return <ErosCompaniesClient />;
}
