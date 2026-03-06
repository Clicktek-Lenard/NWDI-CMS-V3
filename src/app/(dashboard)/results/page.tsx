import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function ResultsPage() {
  await requireAuth(CMS_MODULES.RESULTS.module, CMS_MODULES.RESULTS.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Results Monitoring</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track laboratory and imaging results
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Results monitoring table will be rendered here.
        </p>
      </div>
    </div>
  );
}
