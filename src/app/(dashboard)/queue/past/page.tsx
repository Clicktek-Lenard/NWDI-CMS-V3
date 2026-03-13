import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { PastQueueClient } from "@/components/queue/past-queue-client";

export default async function PastQueuePage() {
  await requireAuth(CMS_MODULES.QUEUE.module, CMS_MODULES.QUEUE.tab);
  return <PastQueueClient />;
}
