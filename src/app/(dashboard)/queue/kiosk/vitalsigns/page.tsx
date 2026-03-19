import { requireAuth } from "@/lib/auth/rbac";
import { KioskQueueClient } from "@/components/kiosk/kiosk-queue-client";

export default async function VitalSignsQueuePage() {
  await requireAuth("kiosk", "vitalsignsqueue");
  return (
    <KioskQueueClient
      department="Vital Signs"
      departmentLabel="Vital Signs Queue"
      color="emerald"
      showHoldResume
      showCallCount
      showExit
    />
  );
}
