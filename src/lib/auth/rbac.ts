import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

/**
 * Maps module/tab keys to the LDAP bracket groups that grant access.
 * Mirrors the old CMS strpos()-based role checks.
 */
const MODULE_ACCESS_MAP: Record<string, string[]> = {
  "cms/queue": [
    "[QUEUE]", "[PASTQUEUE]", "[PASTQUEUE-ONSITE]", "[CMS-PROCESSING]",
    "[RECEPTION]", "[RECEPTION-OIC]", "[PAGES]",
    "[KIOSK-RECEPTION]", "[KIOSK-RELEASING]",
    "[USERCMS]", "[DEVTEAM]", "[IMDCMS]",
  ],
  "cms/payment": [
    "[PAYMENT]", "[PASTPAYMENT]",
    "[USERCMS]", "[DEVTEAM]", "[IMDCMS]",
  ],
  "cms/enrollment": [
    "[PATIENT]", "[PATIENT-MASTER]", "[CARD-DEMOGRAPHICS]",
    "[CARD-REGISTRATION]", "[CARD-VERIFICATION]", "[CARD-RECEIVING]",
    "[CARD-RECEIVED]", "[CARDNUMBER]", "[CARD-SEARCH]", "[CARD-TRANSFER]",
    "[CARD-AGENTSALES]", "[RECEPTION]", "[RECEPTION-OIC]",
    "[USERCMS]", "[DEVTEAM]", "[IMDCMS]",
  ],
  "cms/results": [
    "[RESULTS-RELEASING]", "[RESULTSMONITORING]", "[RESULTUPLOADING]", "[RESULTCOMPANY]",
    "[LABORATORY]", "[RADIOLOGY]", "[XRAY]",
    "[USERCMS]", "[DEVTEAM]", "[IMDCMS]",
  ],
  "cms/clinical": [
    "[NURSE]", "[VITAL-SIGN]", "[KIOSK-NURSE]", "[DOCTORS-EVAL]",
    "[DOCTOR]", "[PHYSICIAN]",
    "[USERCMS]", "[DEVTEAM]", "[IMDCMS]",
  ],
  "cms/reports": [
    "[REPORTS-DAILYSALES]", "[REPORTS-TAT]", "[REPORTS-DAILYCENSUS]",
    "[REPORTS-LABORATORY]", "[REPORTS-LABREJECTED]",
    "[REPORTS-COMPLIANCE]", "[REPORTS-CARDMANAGEMENT]",
    "[DEVTEAM]", "[USERCMS]", "[IMDCMS]",
  ],
  "cms/settings": [
    "[DEVTEAM]", "[BM-ROLE]", "[BM-MODULE]", "[WORKSTATION]", "[USERHCLAB]", "[HL7BTN]",
  ],
  "cms": [
    "[QUEUE]", "[PASTQUEUE]", "[PASTQUEUE-ONSITE]", "[CMS-PROCESSING]",
    "[RECEPTION]", "[RECEPTION-OIC]", "[PAGES]",
    "[KIOSK-RECEPTION]", "[KIOSK-RELEASING]",
    "[PAYMENT]", "[PASTPAYMENT]",
    "[PATIENT]", "[PATIENT-MASTER]", "[CARD-DEMOGRAPHICS]",
    "[RESULTS-RELEASING]", "[RESULTSMONITORING]", "[RESULTUPLOADING]", "[RESULTCOMPANY]",
    "[LABORATORY]", "[RADIOLOGY]", "[XRAY]",
    "[NURSE]", "[VITAL-SIGN]", "[KIOSK-NURSE]", "[DOCTORS-EVAL]", "[DOCTOR]", "[PHYSICIAN]",
    "[REPORTS-DAILYSALES]", "[REPORTS-TAT]", "[REPORTS-DAILYCENSUS]",
    "[DEVTEAM]", "[BM-ROLE]", "[BM-MODULE]", "[WORKSTATION]", "[USERHCLAB]", "[HL7BTN]",
    "[USERCMS]", "[IMDCMS]",
  ],
  "erosui/company": [
    "[COMPANY]", "[COMPANY-VIEW]", "[USEREROS]", "[DEVTEAM]",
  ],
  "erosui/physician": [
    "[PHYSICIAN]", "[PHYSICIAN-APPROVER]", "[USEREROS]", "[DEVTEAM]",
  ],
  "erosui/itemmasterlist": [
    "[ITEMMASTER]", "[CMS-ITEM-CREATE-ALL]", "[USEREROS]", "[DEVTEAM]",
  ],
  "erosui": [
    "[COMPANY]", "[COMPANY-VIEW]", "[PHYSICIAN]", "[PHYSICIAN-APPROVER]",
    "[ITEMMASTER]", "[CMS-ITEM-CREATE-ALL]", "[USEREROS]", "[DEVTEAM]",
  ],
};

/**
 * Check if the raw CMS role string grants access to a module/tab.
 * Uses bracket substring matching — the same logic as the old CMS strpos() checks.
 */
export function hasAccess(
  roleString: string | null | undefined,
  module: string,
  tab?: string
): boolean {
  if (!roleString) return false;
  const key = tab ? `${module}/${tab}` : module;
  const allowed = MODULE_ACCESS_MAP[key] ?? [];
  return allowed.some((r) => roleString.includes(r));
}

/**
 * Parse the raw CMS role string into UserRole entries (one per bracket group).
 * Used for feature-flag checks such as isBmRole or isResultsReleasing.
 */
export function parseUserRoles(roleString: string | null): UserRole[] {
  if (!roleString) return [];
  const matches = roleString.match(/\[[^\]]+\]/g) ?? [];
  return matches.map((r) => ({ module: "", tab: "", ldap_role: r }));
}

/**
 * Check if user has access to a specific facility/branch.
 */
export function hasBranchAccess(
  roleString: string | null | undefined,
  branchCode: string
): boolean {
  if (!roleString) return false;
  return roleString.includes(`[${branchCode}-BRANCH]`);
}

/**
 * Server-side auth guard for pages.
 * Use in server components to protect routes.
 *
 * Usage:
 *   const session = await requireAuth("cms", "queue");
 */
export async function requireAuth(module?: string, tab?: string) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (module) {
    if (!hasAccess(session.user.role, module, tab)) {
      redirect("/unauthorized");
    }
  }

  return session;
}

/**
 * API route auth guard.
 * Returns the session or throws a 401/403 response.
 *
 * Usage:
 *   const session = await requireApiAuth(request, "cms", "queue");
 */
export async function requireApiAuth(
  _request: Request,
  module?: string,
  tab?: string
) {
  const session = await auth();

  if (!session?.user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (module) {
    if (!hasAccess(session.user.role, module, tab)) {
      throw new Response(
        JSON.stringify({ error: "Forbidden", message: `No access to ${module}/${tab}` }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return session;
}

// CMS module definitions (matching the old system's modules)
export const CMS_MODULES = {
  ENROLLMENT: { module: "cms", tab: "enrollment" },
  QUEUE: { module: "cms", tab: "queue" },
  PAYMENT: { module: "cms", tab: "payment" },
  RESULTS: { module: "cms", tab: "results" },
  CLINICAL: { module: "cms", tab: "clinical" },
  SETTINGS: { module: "cms", tab: "settings" },
  REPORTS: { module: "cms", tab: "reports" },
  EROS: { module: "erosui", tab: "company" },
  EROS_PHYSICIAN: { module: "erosui", tab: "physician" },
  EROS_ITEMS: { module: "erosui", tab: "itemmasterlist" },
} as const;
