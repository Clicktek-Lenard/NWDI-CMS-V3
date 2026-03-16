import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { AppointmentsClient } from "@/components/appointments/appointments-client";

export default async function AppointmentsPage() {
  await requireAuth(CMS_MODULES.APPOINTMENTS.module, CMS_MODULES.APPOINTMENTS.tab);
  return <AppointmentsClient />;
}
