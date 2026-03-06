import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function PaymentPage() {
  await requireAuth(CMS_MODULES.PAYMENT.module, CMS_MODULES.PAYMENT.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Payment</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track payments, transactions, and payment history
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Payment tracking table will be rendered here.
        </p>
      </div>
    </div>
  );
}
