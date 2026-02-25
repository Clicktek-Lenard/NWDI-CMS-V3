import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function ReportsPage() {
  await requireAuth(CMS_MODULES.REPORTS.module, CMS_MODULES.REPORTS.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-sm text-slate-500">
          Daily sales, card management, and transaction reports
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Daily Sales Report", description: "Revenue and transaction summary per day" },
          { title: "Card Management", description: "Card enrollment and distribution status" },
          { title: "Transaction Report", description: "Complete transaction history with filters" },
          { title: "Queue Summary", description: "Queue statistics and trends" },
          { title: "Payment Summary", description: "Payment methods and collection report" },
          { title: "Facility Comparison", description: "Cross-branch performance metrics" },
        ].map((report) => (
          <div
            key={report.title}
            className="cursor-pointer rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="text-sm font-semibold text-slate-800">{report.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{report.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
