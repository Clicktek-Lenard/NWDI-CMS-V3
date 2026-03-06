import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { EnrollmentClient } from "@/components/enrollment/enrollment-client";

export default async function EnrollmentPage() {
  await requireAuth(CMS_MODULES.ENROLLMENT.module, CMS_MODULES.ENROLLMENT.tab);

  return <EnrollmentClient />;
}
