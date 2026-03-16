# P3 — Audit Logging: Concrete Implementation Plan

## Schema

```prisma
model ActivityLog {
  id          Int       @id @default(autoincrement())
  clinic_code String    @db.VarChar(10)
  user_id     String    @db.VarChar(50)
  username    String    @db.VarChar(80)
  action      String    @db.VarChar(60)   // CREATE_QUEUE, APPROVE_AMENDMENT, CANCEL_QUEUE, etc.
  resource    String    @db.VarChar(30)   // queue, transaction, payment, result, user
  resource_id String?   @db.VarChar(30)   // stringified ID of the affected record
  detail      Json?                        // before/after snapshot or summary payload
  ip_address  String?   @db.VarChar(45)
  created_at  DateTime  @default(now())

  @@index([clinic_code, created_at])
  @@index([user_id])
  @@index([resource, resource_id])
  @@map("activity_logs")
}
```

Run after adding:
```bash
npx prisma db push
npx prisma generate
```

## Helper

`src/lib/audit.ts`:
```typescript
import prisma from "@/lib/db/prisma";
import type { Session } from "next-auth";

export async function logActivity(
  session: { user: { id: string; username?: string | null; clinicCode?: string | null } },
  action: string,
  resource: string,
  resourceId?: string | number | bigint | null,
  detail?: Record<string, unknown>
) {
  await prisma.activityLog.create({
    data: {
      clinic_code: session.user.clinicCode || "CEN",
      user_id:     session.user.id,
      username:    session.user.username || session.user.id,
      action,
      resource,
      resource_id: resourceId != null ? String(resourceId) : null,
      detail:      detail ?? undefined,
    },
  }).catch(() => { /* never block the main operation */ });
}
```

## Action Constants

```typescript
export const AUDIT_ACTIONS = {
  // Queue
  CREATE_QUEUE:         "CREATE_QUEUE",
  CANCEL_QUEUE:         "CANCEL_QUEUE",
  APPROVE_AMENDMENT:    "APPROVE_AMENDMENT",
  REJECT_AMENDMENT:     "REJECT_AMENDMENT",
  // Payment
  RECORD_PAYMENT:       "RECORD_PAYMENT",
  // Results
  ASSIGN_ACCESSION:     "ASSIGN_ACCESSION",
  RECEIVE_SPECIMEN:     "RECEIVE_SPECIMEN",
  ENCODE_RESULT:        "ENCODE_RESULT",
  VALIDATE_RESULT:      "VALIDATE_RESULT",
  RELEASE_RESULT:       "RELEASE_RESULT",
  ENCODE_IMAGING:       "ENCODE_IMAGING",
  // Clinical
  SAVE_VITALS:          "SAVE_VITALS",
  SAVE_CONSULTATION:    "SAVE_CONSULTATION",
  SAVE_PRESCRIPTION:    "SAVE_PRESCRIPTION",
  // Settings
  CREATE_USER:          "CREATE_USER",
  UPDATE_USER:          "UPDATE_USER",
  DEACTIVATE_USER:      "DEACTIVATE_USER",
} as const;
```

## Usage in API Routes

```typescript
// After the operation succeeds, call logActivity — never before
await prisma.queue.update({ ... });
await logActivity(session, AUDIT_ACTIONS.CANCEL_QUEUE, "queue", queueId, { reason: parsed.data.reason });
```

## Viewer UI

Route: `GET /api/audit-logs` — paginated, filterable by action, resource, user, date range.
Page: `src/app/(dashboard)/settings/audit-log/page.tsx` — in Admin Settings tabs.
Component: Table with columns: Date/Time, User, Action, Resource, ID, Detail (expand on click).

## Priority

Implement after P4–P10. Add `logActivity` calls retroactively to:
1. `queue/[id]/cancel/route.ts`
2. `queue/[id]/approve-amendment/route.ts`
3. `queue/[id]/reject-amendment/route.ts`
4. `queue/route.ts` (POST — create queue)
5. `queue/[id]/payment/route.ts`
6. All result encode/validate/release routes (P5–P7)
7. `users` routes (P9)
