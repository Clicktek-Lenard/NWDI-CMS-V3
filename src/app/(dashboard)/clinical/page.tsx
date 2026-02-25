import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function ClinicalPage() {
  await requireAuth(CMS_MODULES.CLINICAL.module, CMS_MODULES.CLINICAL.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Clinical Staff</h1>
        <p className="text-sm text-slate-500">
          Manage nurses, doctors, laboratory, and radiology staff
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Clinical staff management will be rendered here.
        </p>
      </div>
    </div>
  );
}
