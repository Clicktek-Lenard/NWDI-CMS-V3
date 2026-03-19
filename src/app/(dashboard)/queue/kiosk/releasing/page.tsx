import { requireAuth } from "@/lib/auth/rbac";
import { KioskQueueClient } from "@/components/kiosk/kiosk-queue-client";

export default async function ReleasingQueuePage() {
  await requireAuth("kiosk", "releasingqueue");
  return (
    <KioskQueueClient
      department="Releasing"
      departmentLabel="Releasing Queue"
      color="rose"
      showHoldResume={false}
      showCallCount={false}
      showExit={false}
      showComplete
    />
  );
}
