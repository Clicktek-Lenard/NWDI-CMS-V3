import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { PaymentListClient } from "@/components/payment/payment-list-client";

export default async function PaymentPage() {
  await requireAuth(CMS_MODULES.PAYMENT.module, CMS_MODULES.PAYMENT.tab);
  return <PaymentListClient />;
}
