import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function EnrollmentPage() {
  await requireAuth(CMS_MODULES.ENROLLMENT.module, CMS_MODULES.ENROLLMENT.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Card Enrollment</h1>
        <p className="text-sm text-slate-500">
          Register, receive, verify, and transfer patient cards
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        {["Registration", "Receiving", "Verification", "Transfer"].map(
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

      {/* Content Placeholder */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Card enrollment management will be rendered here.
        </p>
      </div>
    </div>
  );
}
