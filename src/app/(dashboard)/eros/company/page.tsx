import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function ErosCompanyPage() {
  await requireAuth(CMS_MODULES.EROS.module, CMS_MODULES.EROS.tab);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">EROS - Companies</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage company records, items, packages, and pricing
          </p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Sync from EROS
        </button>
      </div>

      {/* Sub-navigation */}
      <div className="mb-6 flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {["Companies", "Items & Packages", "Physicians", "Item Master List"].map(
          (tab) => (
            <button
              key={tab}
              className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-slate-500 hover:border-blue-500 hover:text-blue-600 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
            >
              {tab}
            </button>
          )
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          EROS company management will be rendered here.
        </p>
      </div>
    </div>
  );
}
