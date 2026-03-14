import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { ResultsClient } from "@/components/results/results-client";

export default async function ResultsPage() {
  await requireAuth(CMS_MODULES.RESULTS.module, CMS_MODULES.RESULTS.tab);
  return <ResultsClient />;
}
