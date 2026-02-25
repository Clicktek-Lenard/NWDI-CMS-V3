import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function ResultsPage() {
  await requireAuth(CMS_MODULES.RESULTS.module, CMS_MODULES.RESULTS.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Results Monitoring</h1>
        <p className="text-sm text-slate-500">
          Track laboratory and imaging results
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Results monitoring table will be rendered here.
        </p>
      </div>
    </div>
  );
}
