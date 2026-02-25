import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { QueueClient } from "@/components/queue/queue-client";

export default async function QueuePage() {
  await requireAuth(CMS_MODULES.QUEUE.module, CMS_MODULES.QUEUE.tab);

  return <QueueClient />;
}
