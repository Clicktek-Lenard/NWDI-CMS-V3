import { requireAuth } from "@/lib/auth/rbac";
import { KioskQueueClient } from "@/components/kiosk/kiosk-queue-client";

export default async function ConsultationQueuePage() {
  await requireAuth("kiosk", "consultationqueue");
  return (
    <KioskQueueClient
      department="Consultation"
      departmentLabel="Consultation Queue"
      color="amber"
      showHoldResume
      showCallCount
      showExit
      showComplete
    />
  );
}
