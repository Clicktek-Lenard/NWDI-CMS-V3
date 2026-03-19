import { requireAuth } from "@/lib/auth/rbac";
import { KioskQueueClient } from "@/components/kiosk/kiosk-queue-client";

export default async function ImagingQueuePage() {
  await requireAuth("kiosk", "imagingqueue");
  return (
    <KioskQueueClient
      department="Imaging"
      departmentLabel="Imaging Queue"
      color="indigo"
      showHoldResume
      showCallCount
      showExit
    />
  );
}
