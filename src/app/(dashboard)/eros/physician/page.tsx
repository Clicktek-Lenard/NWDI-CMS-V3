import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { PhysicianAccreditationClient } from "@/components/eros/physician-accreditation-client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function PhysicianAccreditationPage() {
  await requireAuth(CMS_MODULES.EROS_PHYSICIAN.module, CMS_MODULES.EROS_PHYSICIAN.tab);

  return (
    <div>
      <Link
        href="/settings"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Admin Settings
      </Link>
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
