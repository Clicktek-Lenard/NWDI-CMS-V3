import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { ClinicalClient } from "@/components/clinical/clinical-client";

export default async function ClinicalPage() {
  await requireAuth(CMS_MODULES.CLINICAL.module, CMS_MODULES.CLINICAL.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Doctor</h1>
        <p className="text-sm text-slate-500">
          Today&apos;s patient queue — vitals, evaluation, and consultation management
        </p>
      </div>

      <ClinicalClient />
    </div>
  );
}
