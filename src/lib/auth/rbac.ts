import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

/**
 * Parse user role JSON string into structured UserRole array.
 * Replaces the old strpos()-based string matching (which was bypassable).
 */
export function parseUserRoles(roleJson: string | null): UserRole[] {
  if (!roleJson) return [];

  try {
    const parsed = JSON.parse(roleJson);
    if (Array.isArray(parsed)) {
      return parsed as UserRole[];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Check if user has access to a specific module and tab.
 * Uses proper JSON parsing instead of string matching.
 */
export function hasAccess(
  roles: UserRole[],
  module: string,
  tab?: string
): boolean {
  return roles.some((role) => {
    const moduleMatch = role.module === module;
    if (!tab) return moduleMatch;
    return moduleMatch && role.tab === tab;
  });
}

/**
 * Check if user has access to a specific facility/branch.
 */
export function hasBranchAccess(
  roles: UserRole[],
  branchCode: string
): boolean {
  return roles.some(
    (role) => role.ldap_role === `[${branchCode}-BRANCH]`
  );
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
    const roles = parseUserRoles(
      session.user.role
    );
    if (!hasAccess(roles, module, tab)) {
      redirect("/unauthorized");
    }
  }

  return session;
}

/**
 * API route auth guard.
 * Returns the session or throws a 401 response.
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
    const roles = parseUserRoles(
      session.user.role
    );
    if (!hasAccess(roles, module, tab)) {
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
