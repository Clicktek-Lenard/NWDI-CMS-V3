import Link from "next/link";
import { requireAuth } from "@/lib/auth/rbac";
import { CreateTransactionForm } from "@/components/queue/create-transaction-form";

export const metadata = { title: "Create Transaction — CMS" };

export default async function CreateTransactionPage() {
  const session    = await requireAuth("cms", "queue");
  const clinicCode = session.user.clinicCode ?? "";

  return (
    <div className="mx-auto max-w-6xl">
      {/* ── Page header ── */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/cms/queue"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Transaction</h1>
          <p className="text-xs text-slate-500">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
      </div>

      <CreateTransactionForm clinicCode={clinicCode} clinicName={clinicCode} />
    </div>
  );
}
