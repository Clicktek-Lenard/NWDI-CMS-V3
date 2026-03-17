import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { EnrollmentClient } from "@/components/enrollment/enrollment-client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EnrollmentPage() {
  await requireAuth(CMS_MODULES.ENROLLMENT.module, CMS_MODULES.ENROLLMENT.tab);

  return (
    <div>
      <Link
        href="/settings"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Admin Settings
      </Link>
      <EnrollmentClient />
    </div>
  );
}
