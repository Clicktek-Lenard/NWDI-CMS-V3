import auditPrisma from "@/lib/db/audit-prisma";

// ── Action constants (mirrors v1 KioskLog actions + TransactionLogs) ─────────

export const AUDIT_ACTIONS = {
  // Queue (matches v1 KioskLog: queue_create, queue_cancel, antedate)
  CREATE_QUEUE:         "CREATE_QUEUE",
  CANCEL_QUEUE:         "CANCEL_QUEUE",
  APPROVE_AMENDMENT:    "APPROVE_AMENDMENT",
  REJECT_AMENDMENT:     "REJECT_AMENDMENT",

  // Transactions (matches v1 TransactionLogs: Create, Update)
  CREATE_TRANSACTION:   "CREATE_TRANSACTION",
  UPDATE_TRANSACTION:   "UPDATE_TRANSACTION",

  // Payment (matches v1 PaymentHistory logging)
  RECORD_PAYMENT:       "RECORD_PAYMENT",
  CANCEL_PAYMENT:       "CANCEL_PAYMENT",

  // Specimen & Results workflow
  FOR_SPECIMEN:         "FOR_SPECIMEN",
  ASSIGN_ACCESSION:     "ASSIGN_ACCESSION",
  RECEIVE_SPECIMEN:     "RECEIVE_SPECIMEN",
  ENCODE_RESULT:        "ENCODE_RESULT",
  VALIDATE_RESULT:      "VALIDATE_RESULT",
  RELEASE_RESULT:       "RELEASE_RESULT",
  ENCODE_IMAGING:       "ENCODE_IMAGING",
  SEND_RESULT_EMAIL:    "SEND_RESULT_EMAIL",

  // Clinical
  SAVE_VITALS:          "SAVE_VITALS",
  SAVE_CONSULTATION:    "SAVE_CONSULTATION",
  SAVE_PRESCRIPTION:    "SAVE_PRESCRIPTION",

  // Settings / User management (matches v1 ErosPhysicianInfo old/new pattern)
  CREATE_USER:          "CREATE_USER",
  UPDATE_USER:          "UPDATE_USER",
  DEACTIVATE_USER:      "DEACTIVATE_USER",

  // Auth
  USER_LOGIN:           "USER_LOGIN",
  USER_LOGOUT:          "USER_LOGOUT",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

// ── Session shape accepted by logActivity ────────────────────────────────────

type AuditSession = {
  user: {
    id:          string;
    username?:   string | null;
    clinicCode?: string | null;
  };
};

// ── Core helper ───────────────────────────────────────────────────────────────
// Called AFTER the main operation succeeds — never before.
// Failures are silently swallowed so audit logging never blocks the user.

export async function logActivity(
  session:    AuditSession,
  action:     AuditAction,
  resource:   string,
  resourceId?: string | number | bigint | null,
  detail?:    Record<string, unknown>,
  ipAddress?: string | null,
) {
  auditPrisma.activityLog.create({
    data: {
      clinic_code: session.user.clinicCode || "CEN",
      user_id:     session.user.id,
      username:    session.user.username || session.user.id,
      ip_address:  ipAddress ?? null,
      action,
      resource,
      resource_id: resourceId != null ? String(resourceId) : null,
      detail:      detail ?? undefined,
    },
  }).catch((err) => {
    console.warn("[audit] write failed silently:", err?.message ?? err);
  });
}

// ── IP helper ─────────────────────────────────────────────────────────────────

export function getClientIp(request: Request): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null
  );
}
