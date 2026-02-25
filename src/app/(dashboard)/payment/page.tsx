import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

export default async function PaymentPage() {
  await requireAuth(CMS_MODULES.PAYMENT.module, CMS_MODULES.PAYMENT.tab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Payment</h1>
        <p className="text-sm text-slate-500">
          Track payments, transactions, and payment history
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Payment tracking table will be rendered here.
        </p>
      </div>
    </div>
  );
}
