import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { PhysicianAccreditationClient } from "@/components/eros/physician-accreditation-client";

export default async function PhysicianAccreditationPage() {
  await requireAuth(CMS_MODULES.EROS_PHYSICIAN.module, CMS_MODULES.EROS_PHYSICIAN.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Physician Accreditation
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage physician accreditation applications and accredited physicians
        </p>
      </div>
      <PhysicianAccreditationClient />
    </div>
  );
}
