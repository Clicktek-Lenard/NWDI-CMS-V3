import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { PaymentClient } from "@/components/payment/payment-client";

export default async function PaymentPage() {
  await requireAuth(CMS_MODULES.PAYMENT.module, CMS_MODULES.PAYMENT.tab);

  return <PaymentClient />;
}
