import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function ErosCompanyPage() {
  await requireAuth(CMS_MODULES.EROS.module, CMS_MODULES.EROS.tab);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">EROS - Companies</h1>
          <p className="text-sm text-slate-500">
            Manage company records, items, packages, and pricing
          </p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Sync from EROS
        </button>
      </div>

      {/* Sub-navigation */}
      <div className="mb-6 flex gap-2 border-b">
        {["Companies", "Items & Packages", "Physicians", "Item Master List"].map(
          (tab) => (
            <button
              key={tab}
              className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-slate-500 hover:border-blue-500 hover:text-blue-600"
            >
              {tab}
            </button>
          )
        )}
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          EROS company management will be rendered here.
        </p>
      </div>
    </div>
  );
}
