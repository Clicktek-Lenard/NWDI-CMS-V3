import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

/**
 * Maps each role bracket string to the module/tab(s) it grants access to.
 * A user with any of these roles gains access to the corresponding module tab.
 */
const ROLE_ACCESS_MAP: Record<string, Array<{ module: string; tab: string }>> = {
  // ── Card Enrollment ────────────────────────────────────────────
  "[CARD-REGISTRATION]":      [{ module: "cms", tab: "enrollment" }],
  "[CARD-RECEIVING]":         [{ module: "cms", tab: "enrollment" }],
  "[CARD-RECEIVED]":          [{ module: "cms", tab: "enrollment" }],
  "[CARD-VERIFICATION]":      [{ module: "cms", tab: "enrollment" }],
  "[CARD-TRANSFER]":          [{ module: "cms", tab: "enrollment" }],
  "[CARD-SEARCH]":            [{ module: "cms", tab: "enrollment" }],
  "[CARDNUMBER]":             [{ module: "cms", tab: "enrollment" }],
  "[CARD-PAGES]":             [{ module: "cms", tab: "enrollment" }],
  "[CARD-AGENTSALES]":        [{ module: "cms", tab: "enrollment" }],
  "[REPORTS-CARDMANAGEMENT]": [{ module: "cms", tab: "enrollment" }, { module: "cms", tab: "reports" }],
  "[DISTRIBUTION]":           [{ module: "cms", tab: "enrollment" }],
  "[VERIFIED]":               [{ module: "cms", tab: "enrollment" }],
  "[VERIFIED-TEST]":          [{ module: "cms", tab: "enrollment" }],

  // ── Queue & Reception ───────────────────────────────────────────
  "[QUEUE]":                  [{ module: "cms", tab: "queue" }],
  "[PASTQUEUE]":              [{ module: "cms", tab: "queue" }],
  "[KIOSK-RECEPTION]":        [{ module: "cms", tab: "queue" }],
  "[RECEPTION-OIC]":          [{ module: "cms", tab: "queue" }],
  "[PAGES]":                  [{ module: "cms", tab: "queue" }],

  // ── Clinical ────────────────────────────────────────────────────
  "[NURSE]":                  [{ module: "cms", tab: "clinical" }],
  "[DOCTOR]":                 [{ module: "cms", tab: "clinical" }],
  "[DOCTORS-SOAP]":           [{ module: "cms", tab: "clinical" }],
  "[DOCTORS-HISTORY]":        [{ module: "cms", tab: "clinical" }],
  "[DOCTORS-EVAL]":           [{ module: "cms", tab: "clinical" }],
  "[IMDOIC]":                 [{ module: "cms", tab: "clinical" }],
  "[IMDCMS]":                 [{ module: "cms", tab: "clinical" }],

  // ── Laboratory & Results ────────────────────────────────────────
  "[LABORATORY]":             [{ module: "cms", tab: "results" }],
  "[RESULTS-ENTRY]":          [{ module: "cms", tab: "results" }],
  "[RESULTSMONITORING]":      [{ module: "cms", tab: "results" }],
  "[RESULTUPLOADING]":        [{ module: "cms", tab: "results" }],
  "[SENDOUT]":                [{ module: "cms", tab: "results" }],
  "[BRANCHSENDOUT]":          [{ module: "cms", tab: "results" }],
  "[LAB-RECIEVING]":          [{ module: "cms", tab: "results" }],
  "[LAB-RELEASING]":          [{ module: "cms", tab: "results" }],
  "[LAB-RELEASING-VIEW]":     [{ module: "cms", tab: "results" }],
  "[LAB-RESULT]":             [{ module: "cms", tab: "results" }],
  "[LAB-RESULT-PRINT]":       [{ module: "cms", tab: "results" }],
  "[USERHCLAB]":              [{ module: "cms", tab: "results" }],

  // ── Imaging & Radiology ─────────────────────────────────────────
  "[RADIOLOGY]":              [{ module: "cms", tab: "results" }],
  "[IMAGING]":                [{ module: "cms", tab: "results" }],
  "[IMAGING-RESULT-ENTRY]":   [{ module: "cms", tab: "results" }],
  "[XRAY]":                   [{ module: "cms", tab: "results" }],

  // ── Payment ─────────────────────────────────────────────────────
  "[PAYMENT]":                [{ module: "cms", tab: "payment" }],
  "[PASTPAYMENT]":            [{ module: "cms", tab: "payment" }],
  "[REPORTS-DAILYSALES]":     [{ module: "cms", tab: "payment" }, { module: "cms", tab: "reports" }],

  // ── Patient ─────────────────────────────────────────────────────
  "[PATIENT]":                [{ module: "cms", tab: "settings" }],
  "[PATIENT-VIEW]":           [{ module: "cms", tab: "settings" }],

  // ── System Access ────────────────────────────────────────────────
  "[USERCMS]":                [{ module: "cms", tab: "settings" }],

  // ── EROS Company ─────────────────────────────────────────────────
  "[COMPANY]":                [{ module: "erosui", tab: "company" }],
  "[COMPANY-VIEW]":           [{ module: "erosui", tab: "company" }],
  "[SERVICEAGREEMENT]":       [{ module: "erosui", tab: "company" }],
  "[USEREROS]":               [{ module: "erosui", tab: "company" }],

  // ── EROS Physician ───────────────────────────────────────────────
  "[PHYSICIAN]":              [{ module: "erosui", tab: "physician" }],
  "[PHYSICIAN-APPROVER]":     [{ module: "erosui", tab: "physician" }],
  "[PHYSICIAN-VIEW]":         [{ module: "erosui", tab: "physician" }],

  // ── EROS Item Master ─────────────────────────────────────────────
  "[ITEMMASTER]":             [{ module: "erosui", tab: "itemmasterlist" }],
};

type LegacyRole = { module: string; tab: string };

/**
 * Parse user role JSON string. Supports two formats:
 *  - New:    ["[QUEUE]", "[NURSE]", ...]         (bracket strings)
 *  - Legacy: [{"module":"cms","tab":"queue"}, ...] (module/tab objects)
 * Legacy roles are encoded as "legacy:module:tab" for use by hasAccess.
 */
export function parseUserRoles(roleJson: string | null): string[] {
  if (!roleJson) return [];
  try {
    const parsed = JSON.parse(roleJson);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    // New format: string[] of bracket strings
    if (typeof parsed[0] === "string") return parsed as string[];
    // Legacy format: [{module, tab}] — encode as "legacy:module:tab"
    if (typeof parsed[0] === "object" && parsed[0] !== null && "module" in parsed[0]) {
      return (parsed as LegacyRole[]).map((r) => `legacy:${r.module}:${r.tab}`);
    }
    return [];
  } catch {
    // Raw legacy format (old PHP): "\r\n[CARD-RECEIVING]\r\n[QUEUE]\r\n..."
    // Extract all [ROLE-NAME] bracket strings directly
    const matches = roleJson.match(/\[[^\]]+\]/g);
    return matches ?? [];
  }
}

/**
 * Check if user has access to a specific module and tab.
 * Handles both new bracket-string roles and legacy module/tab roles.
 */
export function hasAccess(
  roles: string[],
  module: string,
  tab?: string
): boolean {
  return roles.some((role) => {
    // Legacy format encoded as "legacy:module:tab"
    if (role.startsWith("legacy:")) {
      const [, m, t] = role.split(":");
      return tab ? m === module && t === tab : m === module;
    }
    // New format: look up ROLE_ACCESS_MAP
    const accesses = ROLE_ACCESS_MAP[role] ?? [];
    return accesses.some((a) => {
      return tab ? a.module === module && a.tab === tab : a.module === module;
    });
  });
}

/**
 * Check if user has access to a specific facility/branch.
 * Branch roles are stored as "[SMB-BRANCH]", "[LIN-BRANCH]", etc.
 */
export function hasBranchAccess(roles: string[], branchCode: string): boolean {
  return roles.includes(`[${branchCode}-BRANCH]`);
}

/**
 * Return all branch codes assigned to a user.
 * e.g. ["[SMB-BRANCH]", "[BAE-BRANCH]"] → ["SMB", "BAE"]
 */
export function getUserBranches(roles: string[]): string[] {
  return roles
    .filter((r) => r.startsWith("[") && r.endsWith("-BRANCH]"))
    .map((r) => r.slice(1, r.indexOf("-BRANCH]")));
}

/**
 * Server-side auth guard for pages.
 * Use in server components to protect routes.
 */
export async function requireAuth(module?: string, tab?: string) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (module) {
    const roles = parseUserRoles(session.user.role);
    if (!hasAccess(roles, module, tab)) {
      redirect("/unauthorized");
    }
  }

  return session;
}

/**
 * API route auth guard.
 * Returns the session or throws a 401/403 response.
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
    const roles = parseUserRoles(session.user.role);
    if (!hasAccess(roles, module, tab)) {
      throw new Response(
        JSON.stringify({ error: "Forbidden", message: `No access to ${module}/${tab}` }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return session;
}

// CMS module definitions (used as constants for requireAuth calls)
export const CMS_MODULES = {
  ENROLLMENT: { module: "cms", tab: "enrollment" },
  QUEUE:      { module: "cms", tab: "queue" },
  PAYMENT:    { module: "cms", tab: "payment" },
  RESULTS:    { module: "cms", tab: "results" },
  CLINICAL:   { module: "cms", tab: "clinical" },
  SETTINGS:   { module: "cms", tab: "settings" },
  REPORTS:    { module: "cms", tab: "reports" },
  EROS:            { module: "erosui", tab: "company" },
  EROS_PHYSICIAN:  { module: "erosui", tab: "physician" },
  EROS_ITEMS:      { module: "erosui", tab: "itemmasterlist" },
} as const;
