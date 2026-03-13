# CMS v3 — Code Architecture & Developer Reference

## Stack

| Layer | Library | Version |
|-------|---------|---------|
| Framework | Next.js App Router | 16.1.6 |
| UI | React + TypeScript | 19 / 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| ORM | Prisma + PrismaPg | 7.4.1 |
| Auth | NextAuth v5 beta | 5.0.0-beta.30 |
| Client fetch | TanStack React Query | 5.x |
| UI state | Zustand | 5.x |
| Validation | Zod | 4.x |
| Forms | React Hook Form | 7.x |
| Icons | Lucide React | 0.575 |
| Theme | next-themes | 0.4.x |

**Database**: PostgreSQL (`cms_v2`) · **Timezone**: `Asia/Manila`

---

## Project Layout

```
src/
├── app/
│   ├── (auth)/              # Public pages (no sidebar)
│   ├── (dashboard)/         # Protected pages (sidebar + header)
│   └── api/                 # API routes
├── components/              # React client components
├── services/                # Business logic (called by API routes)
├── lib/
│   ├── auth/auth.ts         # NextAuth config
│   ├── auth/rbac.ts         # Role guards & MODULE_ACCESS_MAP
│   ├── db/prisma.ts         # Prisma singleton
│   ├── api.ts               # Client-side fetch helper
│   └── utils.ts             # cn(), formatDate(), formatCurrency()
├── stores/                  # Zustand stores
├── hooks/                   # Custom React Query hooks
├── types/index.ts           # Shared TypeScript interfaces
└── generated/prisma/        # Auto-generated (committed to git)
```

---

## Patterns

### 1. Page (Server Component)

Every protected page follows this exact pattern:

```typescript
// src/app/(dashboard)/[module]/page.tsx
import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { MyClient } from "@/components/[module]/my-client";

export default async function MyPage() {
  await requireAuth(CMS_MODULES.MY_MODULE.module, CMS_MODULES.MY_MODULE.tab);
  return <MyClient />;
}
```

**Rules:**
- Always `await requireAuth(...)` first — redirects to `/login` or `/unauthorized` if needed
- Pages are thin — zero business logic, zero DB calls
- Pass only serializable props (no Prisma objects) to client components
- Use `CMS_MODULES` constants from `rbac.ts` — never hardcode module/tab strings

---

### 2. API Route

```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

// Define schema at the top of the file
const createSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
});

export async function GET(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");
  const clinicCode = session.user.clinicCode || "CEN";

  try {
    const data = await prisma.someTable.findMany({ where: { IdBU: clinicCode } });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");

  // 1. Parse JSON safely
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 2. Validate with Zod
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  // 3. Business logic
  try {
    const result = await prisma.someTable.create({ data: parsed.data });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Failed:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
```

**API Route with dynamic param:**

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiAuth(request, "cms", "queue");
  const { id } = await params;           // always await params in Next.js 16
  const numId = BigInt(id);              // legacy tables use BigInt IDs
  // ...
}
```

**HTTP status conventions:**
| Status | When |
|--------|------|
| 200 | GET success |
| 201 | POST created |
| 400 | Bad request / invalid JSON |
| 401 | Not authenticated |
| 403 | Authenticated but no permission |
| 404 | Record not found |
| 422 | Validation failed (Zod) |
| 500 | Unexpected server error |

---

### 3. API Route with Service Layer

When business logic is complex (multi-step, reusable), extract to a service:

```typescript
// route.ts
import { QueueService } from "@/services/queue.service";

export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");
  // ... parse + validate ...
  const result = await QueueService.createQueue({ clinicCode, ...parsed.data });
  return NextResponse.json(result, { status: 201 });
}
```

```typescript
// src/services/my.service.ts
import prisma from "@/lib/db/prisma";

export class MyService {
  static async createSomething(input: CreateInput) {
    // DB logic here, not in route
    return prisma.someTable.create({ data: { ... } });
  }
}
```

**When to use a service:** multiple routes share the same logic, OR the logic is >20 lines.

---

### 4. Prisma Transactions

Use `prisma.$transaction` when multiple DB writes must succeed or fail together:

```typescript
// Batch (array syntax — all operations independent)
await prisma.$transaction([
  prisma.transactions.update({ where: { Id: txId }, data: { Status: 650 } }),
  prisma.queue.update({ where: { Id: queueId }, data: { ErosStatus: "reUpdate" } }),
]);

// Interactive (callback syntax — can read between writes)
await prisma.$transaction(async (tx) => {
  await tx.transactions.update({ where: { Id: txId }, data: { Status: 650 } });

  const remaining = await tx.transactions.findMany({
    where: { IdQueue: queueId, Status: { lt: 650 } },
  });

  for (const r of remaining) {
    await tx.transactions.update({
      where: { Id: r.Id },
      data: { AmountRemaining: r.AmountItemPrice },
    });
  }
});
```

**BigInt IDs:** Legacy tables use BigInt primary keys. Always convert:
```typescript
const id = BigInt(params.id);                    // string → BigInt
const idNum = Number(record.Id);                 // BigInt → number for JSON
```

**Field naming:** Legacy tables use PascalCase (`IdPatient`, `QFullName`). New v3 models use camelCase (`patientId`, `fullName`).

---

### 5. Auth Guard Usage

**In server components / pages:**
```typescript
import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";

// Redirect to /login if not authenticated, /unauthorized if no role
const session = await requireAuth("cms", "queue");
const session = await requireAuth(CMS_MODULES.QUEUE.module, CMS_MODULES.QUEUE.tab);

// Just check authentication (no module restriction)
const session = await requireAuth();
```

**In API routes:**
```typescript
import { requireApiAuth } from "@/lib/auth/rbac";

// Throws Response 401/403 if fails
const session = await requireApiAuth(request, "cms", "queue");

// Get user info from session
const clinicCode = session.user.clinicCode || "CEN";
const username   = session.user.username  || session.user.id;
const role       = session.user.role;     // raw bracket string e.g. "[QUEUE][NURSE]"
```

**Feature-flag checks (check specific role):**
```typescript
import { parseUserRoles } from "@/lib/auth/rbac";

const roles = parseUserRoles(session.user.role);
const isBmRole         = roles.some(r => r.ldap_role === "[BM-ROLE]");
const isResultsRelease = roles.some(r => r.ldap_role === "[RESULTS-RELEASING]");
```

**Branch access check:**
```typescript
import { hasBranchAccess } from "@/lib/auth/rbac";
const canAccessSMB = hasBranchAccess(session.user.role, "SMB");
```

**Available CMS_MODULES constants:**
```typescript
CMS_MODULES.QUEUE       // { module: "cms", tab: "queue" }
CMS_MODULES.PAYMENT     // { module: "cms", tab: "payment" }
CMS_MODULES.ENROLLMENT  // { module: "cms", tab: "enrollment" }
CMS_MODULES.CLINICAL    // { module: "cms", tab: "clinical" }
CMS_MODULES.RESULTS     // { module: "cms", tab: "results" }
CMS_MODULES.REPORTS     // { module: "cms", tab: "reports" }
CMS_MODULES.SETTINGS    // { module: "cms", tab: "settings" }
CMS_MODULES.EROS        // { module: "erosui", tab: "company" }
```

---

### 6. Client Component

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useQueueStore } from "@/stores/queue-store";

export function MyClient() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useQueueStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAction() {
    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/something", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "value" }),
      });
      router.refresh();   // re-run server component data fetch
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return <div>...</div>;
}
```

**`apiFetch` vs raw `fetch`:** Always use `apiFetch` from `@/lib/api` in client components — it handles non-JSON error responses (HTML 500 pages) and throws readable error messages. Raw `fetch` causes "Unexpected token '<'" errors.

---

### 7. React Query Hook

```typescript
// src/hooks/use-something.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const KEY = "something";

// Read
export function useSomething(id: number) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => apiFetch<MyType>(`/api/something/${id}`),
    staleTime: 30_000,
  });
}

// Write
export function useUpdateSomething() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInput) =>
      apiFetch(`/api/something/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
    },
  });
}
```

**Query key conventions:**
- `[KEY]` — all records
- `[KEY, id]` — single record
- `[KEY, "stats"]` — derived data
- `[KEY, status, page]` — paginated + filtered

---

### 8. Zustand Store

```typescript
// src/stores/my-store.ts
import { create } from "zustand";

interface MyStore {
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  reset: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
  reset: () => set({ selectedId: null }),
}));
```

**Use Zustand for:** UI state that multiple sibling components share (filters, selected rows, modal open state).
**Don't use Zustand for:** server data — use React Query for that.

---

### 9. Zod Validation

Define schemas **at module level** (outside the handler), not inline:

```typescript
// At top of file
const itemSchema = z.object({
  id:     z.number().int().positive(),
  name:   z.string().min(1).max(255),
  amount: z.number().nonnegative(),
  type:   z.enum(["CASH", "HMO", "COMPANY"]),
  notes:  z.string().optional(),
  date:   z.string().nullable(),
});

const createSchema = z.object({
  items: z.array(itemSchema).min(1),
  patientId: z.number().int().positive(),
});

// In handler
const parsed = createSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json(
    { error: "Validation failed", issues: parsed.error.issues },
    { status: 422 }
  );
}
// Use parsed.data — fully typed
```

---

### 10. Utility Helpers

```typescript
import { cn, formatDate, formatCurrency } from "@/lib/utils";

// Merge Tailwind classes conditionally
cn("base-class", isActive && "active-class", "other-class")

// Format date
formatDate("2026-03-09")          // → "Mar 9, 2026"
formatDate(new Date())

// Format currency (PHP)
formatCurrency(1500.50)           // → "₱1,500.50"
```

---

## Auth & RBAC Reference

### Role Format

Roles are stored as a **raw bracket string** in `session.user.role` and `user.role` DB column:
```
[QUEUE][NURSE][VITAL-SIGN][RECEPTION][SMB-BRANCH]
```

### MODULE_ACCESS_MAP (rbac.ts)

| Key | Allowed Bracket Roles |
|-----|-----------------------|
| `cms/queue` | `[QUEUE]`, `[PASTQUEUE]`, `[PASTQUEUE-ONSITE]`, `[CMS-PROCESSING]`, `[RECEPTION]`, `[RECEPTION-OIC]`, `[PAGES]`, `[KIOSK-RECEPTION]`, `[KIOSK-RELEASING]`, `[USERCMS]`, `[DEVTEAM]`, `[IMDCMS]` |
| `cms/payment` | `[PAYMENT]`, `[PASTPAYMENT]`, `[USERCMS]`, `[DEVTEAM]`, `[IMDCMS]` |
| `cms/enrollment` | `[PATIENT]`, `[PATIENT-MASTER]`, `[CARD-DEMOGRAPHICS]`, `[CARD-REGISTRATION]`, `[CARD-VERIFICATION]`, `[CARD-RECEIVING]`, `[CARD-RECEIVED]`, `[CARDNUMBER]`, `[CARD-SEARCH]`, `[CARD-TRANSFER]`, `[CARD-AGENTSALES]`, `[RECEPTION]`, `[RECEPTION-OIC]`, `[USERCMS]`, `[DEVTEAM]`, `[IMDCMS]` |
| `cms/results` | `[RESULTS-RELEASING]`, `[RESULTSMONITORING]`, `[RESULTUPLOADING]`, `[RESULTCOMPANY]`, `[LABORATORY]`, `[RADIOLOGY]`, `[XRAY]`, `[USERCMS]`, `[DEVTEAM]`, `[IMDCMS]` |
| `cms/clinical` | `[NURSE]`, `[VITAL-SIGN]`, `[KIOSK-NURSE]`, `[DOCTORS-EVAL]`, `[DOCTOR]`, `[PHYSICIAN]`, `[USERCMS]`, `[DEVTEAM]`, `[IMDCMS]` |
| `cms/reports` | `[REPORTS-DAILYSALES]`, `[REPORTS-TAT]`, `[REPORTS-DAILYCENSUS]`, `[REPORTS-LABORATORY]`, `[REPORTS-LABREJECTED]`, `[REPORTS-COMPLIANCE]`, `[REPORTS-CARDMANAGEMENT]`, `[DEVTEAM]`, `[USERCMS]`, `[IMDCMS]` |
| `cms/settings` | `[DEVTEAM]`, `[BM-ROLE]`, `[BM-MODULE]`, `[WORKSTATION]`, `[USERHCLAB]`, `[HL7BTN]` |
| `erosui/company` | `[COMPANY]`, `[COMPANY-VIEW]`, `[USEREROS]`, `[DEVTEAM]` |
| `erosui/physician` | `[PHYSICIAN]`, `[PHYSICIAN-APPROVER]`, `[USEREROS]`, `[DEVTEAM]` |
| `erosui/itemmasterlist` | `[ITEMMASTER]`, `[CMS-ITEM-CREATE-ALL]`, `[USEREROS]`, `[DEVTEAM]` |

---

## API Routes Reference

### Queue

#### `GET /api/queue`
List today's queue for the logged-in clinic.

**Auth:** `cms/queue`
**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `pageSize` | number | 200 | Records per page |
| `status` | string | — | Filter by status code |

**Response:**
```json
{
  "data": [ QueueEntry[] ],
  "total": 42,
  "page": 1,
  "pageSize": 200,
  "totalPages": 1,
  "stats": { "201": 10, "500": 5, "650": 2 }
}
```

---

#### `POST /api/queue`
Create a new queue entry with optional transactions.

**Auth:** `cms/queue`
**Body:**
```json
{
  "idPatient": 1001,
  "fullName": "Juan Dela Cruz",
  "lastName": "Dela Cruz",
  "firstName": "Juan",
  "middleName": "",
  "gender": "M",
  "dob": "1990-01-15",
  "patientType": "OUT-PATIENT",
  "transactions": [
    {
      "idCompany": 5,
      "nameCompany": "PhilHealth",
      "idDoctor": 12,
      "nameDoctor": "Dr. Santos",
      "transactionType": "LABORATORY",
      "idItemPrice": 88,
      "codeItemPrice": "CBC",
      "descriptionItemPrice": "Complete Blood Count",
      "priceGroupItemPrice": "Item",
      "amountItemPrice": 350.00,
      "readersFee": 0,
      "origAmount": 350.00,
      "groupItemMaster": "LAB"
    }
  ]
}
```
**Response:** `201` + created `QueueEntry`

---

#### `GET /api/queue/[id]`
Get full queue details including transactions and clinical data.

**Auth:** `cms/queue`
**Response:** `QueueEntry` with nested `transactions[]`

---

#### `PATCH /api/queue/[id]`
Update queue fields.

**Auth:** `cms/queue`

---

#### `POST /api/queue/[id]/cancel`
Cancel a queue and create an ante-dated shadow queue (Status → 650).

**Auth:** `cms/queue`
**Body:**
```json
{ "anteDateReason": "Patient rescheduled", "anteDate": "2026-03-10" }
```
**Response:** `{ "newQueueId": 9999, "newQueueCode": "CEN202603100001" }`

---

#### `POST /api/queue/[id]/approve-amendment`
Approve a pending transaction amendment.

**Auth:** `cms/queue`

---

#### `POST /api/queue/[id]/payment`
Record payment for a queue entry.

**Auth:** `cms/payment`

---

#### `POST /api/queue/[id]/regenerate-pdf`
Trigger PDF regeneration for lab results.

**Auth:** `cms/results` (requires `[RESULTS-RELEASING]` or `[BM-ROLE]`)

---

### Transactions

#### `PATCH /api/transactions/[id]`
Replace all fields of a committed transaction (doctor, company, item, type).

**Auth:** `cms/queue`
**Body:**
```json
{
  "idCompany": 5, "nameCompany": "PhilHealth",
  "idDoctor": 12, "nameDoctor": "Dr. Santos",
  "transactionType": "RADIOLOGY",
  "idItemPrice": 90, "codeItemPrice": "XRAY-PA",
  "descriptionItemPrice": "Chest X-Ray PA",
  "priceGroupItemPrice": "Item",
  "amountItemPrice": 500.00,
  "readersFee": 0, "origAmount": 500.00,
  "groupItemMaster": "XRAY"
}
```
**Guards:** Returns 400 if `Status >= 650` (cancelled)

---

#### `DELETE /api/transactions/[id]`
Soft-cancel a transaction (Status → 650). Resets `AmountRemaining` on remaining active transactions.

**Auth:** `cms/queue`
**Guards:** Returns 400 if already cancelled

---

### Clinical

#### `GET /api/clinical/queue`
Queue list filtered for clinical staff view.

**Auth:** `cms/clinical`

#### `GET/POST /api/clinical/[queueId]/vitals`
Get or save vital signs (BP, HR, temp, O2 sat, weight, height, BMI, vision).

#### `GET/POST /api/clinical/[queueId]/pe`
Get or save physical examination findings.

#### `GET/POST /api/clinical/[queueId]/evaluation`
Get or save evaluation data.

#### `GET/POST /api/clinical/[queueId]/medical-eval`
Get or save item-based medical evaluation.

#### `POST /api/clinical/[queueId]/complete`
Mark clinical evaluation as complete.

#### `GET /api/clinical/[queueId]/status`
Get current clinical status for a queue entry.

#### `GET /api/clinical/physicians`
List physicians available at the clinic.

---

### Enrollment

#### `GET/POST /api/enrollment/cards`
List or create card enrollments.

#### `POST /api/enrollment/cards/[id]/receive`
Mark a card as received.

#### `POST /api/enrollment/cards/[id]/verify`
Mark a card as verified.

#### `POST /api/enrollment/cards/[id]/transfer`
Transfer a card to another branch.

#### `GET /api/enrollment/patients`
List patients with enrollment records.

#### `GET /api/enrollment/card-numbers`
Look up available card numbers.

---

### Lookup / Reference

#### `GET /api/patients/search`
Search patients by name or code.
**Query params:** `q` (search string)

#### `GET /api/item-prices`
List item prices. Applies 3-branch discount logic server-side.
**Query params:** `companyId`, `clinicCode`

#### `GET /api/companies`
List active companies.

#### `GET /api/physicians`
List all physicians.

#### `GET /api/physicians/[id]`
Get physician by ID.

#### `GET /api/transaction-types`
List transaction type codes.

---

### Users

#### `GET /api/users`
List all system users. **Auth:** `cms/settings`

#### `POST /api/users`
Create a new user. **Auth:** `cms/settings`

#### `GET /api/users/[id]`
Get user details. **Auth:** `cms/settings`

#### `PATCH /api/users/[id]`
Update user (role, activated status, etc.). **Auth:** `cms/settings`

---

## Key Status Codes

| Code | Meaning | Table |
|------|---------|-------|
| 201 | Active / Waiting | queue, transactions |
| 202 | Ante-dated shadow | queue |
| 500+ | In progress / Done | queue |
| 650 | Cancelled (soft delete) | queue, transactions |

```typescript
// Use named constants — never magic numbers
const TX_STATUS_ACTIVE    = 201;
const TX_STATUS_CANCELLED = 650;
const QUEUE_STATUS_CANCELLED = 650;
const QUEUE_STATUS_ANTEDATE  = 202;
```

---

## Queue Code Format

Generated by `QueueService.generateQueueCode(clinicCode)`:
```
CEN20260309001
│   │        └─ 3-digit zero-padded sequence (resets daily)
│   └───────── YYYYMMDD
└───────────── Clinic code (e.g. CEN, SMB, TAR)
```

---

## Dark Mode

- Toggle: `ThemeToggle` component in `header.tsx`
- Provider: `<ThemeProvider attribute="class" defaultTheme="system">` in `providers.tsx`
- Tailwind: `@variant dark (&:where(.dark, .dark *))` in `globals.css`
- CSS vars: `--background` / `--foreground` swap in `.dark {}`
- Always use `resolvedTheme` (not `theme`) to handle system default:
  ```typescript
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  ```
- Add `dark:` classes to components: `dark:bg-slate-900 dark:text-slate-100`

---

## Conventions

| Convention | Detail |
|-----------|--------|
| Path alias | `@/` → `src/` |
| IDs (legacy) | BigInt — always `BigInt(id)` when reading from params |
| IDs (new models) | Int — use `parseInt(id)` |
| Field names (legacy) | PascalCase (`IdPatient`, `QFullName`) |
| Field names (new v3) | camelCase (`patientId`, `fullName`) |
| Soft delete | Status `650` — never hard delete queue/transactions |
| Timezone | All dates in `Asia/Manila` — set by `TZ=Asia/Manila` in `.env` |
| Client fetches | Always use `apiFetch` from `@/lib/api` — never raw `fetch` |
| Error format | `{ error: string, issues?: ZodIssue[] }` |
| Success format | `NextResponse.json(data)` or `{ success: true }` |
| Prisma client | Import from `@/lib/db/prisma` — never instantiate directly |
| Generated files | `src/generated/prisma/client/` is committed — run `npx prisma generate` after schema changes |
| Clinic default | Always `session.user.clinicCode \|\| "CEN"` |
| Username fallback | `session.user.username \|\| session.user.id \|\| "system"` |

---

## Adding a New Module (Checklist)

1. **Add route group** — `src/app/(dashboard)/[module]/page.tsx`
   ```typescript
   await requireAuth("cms", "mymodule");
   return <MyClient />;
   ```

2. **Register in RBAC** — add to `MODULE_ACCESS_MAP` in `src/lib/auth/rbac.ts`
   ```typescript
   "cms/mymodule": ["[MY-ROLE]", "[USERCMS]", "[DEVTEAM]"],
   ```

3. **Add CMS_MODULE constant** — in `src/lib/auth/rbac.ts`
   ```typescript
   MY_MODULE: { module: "cms", tab: "mymodule" },
   ```

4. **Create API routes** — `src/app/api/[module]/route.ts`
   - Auth guard first: `await requireApiAuth(request, "cms", "mymodule")`
   - Zod schema at top
   - Service call in try/catch

5. **Add sidebar link** — `src/components/layouts/sidebar.tsx`

6. **Add to navigation** — only if user has access (check with `hasAccess`)
