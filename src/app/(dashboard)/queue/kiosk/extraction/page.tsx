import { requireAuth } from "@/lib/auth/rbac";
import { KioskQueueClient } from "@/components/kiosk/kiosk-queue-client";

export default async function ExtractionQueuePage() {
  await requireAuth("kiosk", "extractionqueue");
  return (
    <KioskQueueClient
      department="Extraction"
      departmentLabel="Laboratory / Extraction Queue"
      color="purple"
      showHoldResume
      showCallCount
      showExit
    />
  );
}
