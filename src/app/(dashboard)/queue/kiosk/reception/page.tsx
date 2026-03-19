import { requireAuth } from "@/lib/auth/rbac";
import { KioskQueueClient } from "@/components/kiosk/kiosk-queue-client";

export default async function ReceptionQueuePage() {
  await requireAuth("kiosk", "receptionqueue");
  return (
    <KioskQueueClient
      department="Reception"
      departmentLabel="Reception Queue"
      color="blue"
      showHoldResume
      showCallCount
      showExit
    />
  );
}
