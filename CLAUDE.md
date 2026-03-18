# CMS v3 — Claude Instructions

> **For Claude:** Always read and follow this file before writing any code for this project.
> Every rule here reflects a deliberate decision — do not deviate without explicit instruction.

## Project

NWD Central Management System v2 — Next.js rewrite of the Laravel/PHP CMS ALLPROD.

- **Working dir:** `c:\Clicktek\Projects\NWDI\CMS - Claude\CMS-v3`
- **DB:** PostgreSQL, schema `cms_v2`, PascalCase legacy field names (`IdPatient`, `QFullName`)
- **Timezone:** `Asia/Manila` (set via `cross-env TZ=Asia/Manila` in all npm scripts)
- **Detailed reference:** `code_architecture.md` · **Project status:** `project_status.md`

## Commands

```bash
npm run dev       # Start dev server (port 3000) — always uses TZ=Asia/Manila
npm run build     # Production build
npx prisma generate   # Regenerate client after schema changes
npx prisma studio     # Browse database
```

## Stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 16.1.6 App Router |
| UI | React 19 + TypeScript 5 + Tailwind CSS v4 |
| ORM | Prisma v7 + `@prisma/adapter-pg` → PostgreSQL |
| Auth | NextAuth v5-beta (JWT, 2hr session) |
| Client state | TanStack Query v5 + Zustand v5 |
| Validation | Zod v4 |
| Icons | Lucide React |
| Theme | next-themes (`resolvedTheme`, not `theme`) |

## Directory Layout

```
src/
├── app/
│   ├── (auth)/              # Public pages (login)
│   ├── (dashboard)/         # Protected pages — sidebar layout
│   │   ├── queue/           # Queue module (URL: /queue)
│   │   ├── clinical/        # Clinical module
│   │   ├── enrollment/      # Card enrollment
│   │   ├── payment/         # Payment
│   │   ├── results/         # Results (shell only)
│   │   ├── reports/         # Reports (shell only)
│   │   ├── eros/            # EROS (partial)
│   │   ├── settings/        # Settings / User management
│   │   └── cms/payment/     # Legacy path — still active at /cms/payment
│   └── api/                 # API routes (accession, admin, appointments,
│                            #   assessment-codes, auth, clinical, companies,
│                            #   dashboard, enrollment, eros, item-prices,
│                            #   kiosk, patients, payment, physicians, queue,
│                            #   reports, results, sendouts, transaction-types,
│                            #   transactions, users)
├── components/              # Client components (filename = kebab-case)
├── services/                # Business logic classes (called by API routes)
├── lib/
│   ├── auth/auth.ts         # NextAuth config
│   ├── auth/rbac.ts         # requireAuth, requireApiAuth, CMS_MODULES, MODULE_ACCESS_MAP
│   ├── db/prisma.ts         # Prisma singleton — always import from here
│   ├── db/oracle.ts         # Oracle stub — NOT active; requires oracledb + Oracle Instant Client
│   ├── hl7/builder.ts       # HL7 v2 message builder (replaces PHP aranyasen/hl7)
│   ├── validators/queue.ts  # Reusable Zod schemas for queue
│   ├── validators/payment.ts# Reusable Zod schemas for payment
│   ├── api.ts               # apiFetch helper — always use this in client components
│   └── utils.ts             # cn(), formatDate(), formatCurrency()
├── hooks/                   # React Query hooks (use-queue.ts, etc.)
├── stores/                  # Zustand stores (queue-store.ts, etc.)
├── types/index.ts           # Shared TypeScript types
└── generated/prisma/        # Committed to git — run prisma generate after schema changes
```

## Critical Rules

### Always
- `await requireAuth(CMS_MODULES.X.module, CMS_MODULES.X.tab)` **first** in every page
- `await requireApiAuth(request, "cms", "queue")` **first** in every API route
- Use `apiFetch` from `@/lib/api` in client components — never raw `fetch`
- Import Prisma from `@/lib/db/prisma` — never instantiate directly
- Use **Prisma Client methods** for all database access (`findFirst`, `findMany`, `create`, `update`, `updateMany`, `upsert`, `count`, `delete`, `$transaction`)
- If a model has `@@ignore`, fix the schema first (add `@id` + `@map()` decorators, run `npx prisma generate`) — do not work around it with raw SQL
- `BigInt(id)` when reading ID params for legacy tables; `Number(id)` when serializing to JSON
- Use `session.user.clinicCode || "CEN"` — never assume clinicCode is set
- Soft-delete only — `Status → 650`, never hard delete queue/transactions
- Define Zod schemas at **module level**, not inside handlers
- When adding a new page under `src/app/(dashboard)/`, **always add a matching entry to `NAV_ITEMS`** in `src/components/layouts/sidebar.tsx` — choose the correct `module` and `tab` from `CMS_MODULES` in `rbac.ts`

### Never
- **Use raw SQL** (`$queryRaw`, `$executeRaw`) — always use Prisma Client methods instead
- Put business logic in page server components — pages are thin wrappers only
- Use raw `fetch` in client components (causes `"Unexpected token '<'"` on error responses)
- Hardcode module/tab strings — use `CMS_MODULES` constants from `rbac.ts`
- Instantiate `new PrismaClient()` — always use the singleton from `@/lib/db/prisma`
- Use `theme` from `useTheme()` — use `resolvedTheme` (handles system default)
- Hard-code clinic code — always read from `session.user.clinicCode`

## Page Pattern

```typescript
// src/app/(dashboard)/[module]/page.tsx
import { requireAuth, CMS_MODULES } from "@/lib/auth/rbac";
import { MyClient } from "@/components/[module]/my-client";

export default async function MyPage() {
  await requireAuth(CMS_MODULES.MY_MODULE.module, CMS_MODULES.MY_MODULE.tab);
  return <MyClient />;
}
```

## API Route Pattern

```typescript
// src/app/api/[resource]/route.ts
import { requireApiAuth } from "@/lib/auth/rbac";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1) });

export async function POST(request: NextRequest) {
  const session = await requireApiAuth(request, "cms", "queue");
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  try {
    const result = await prisma.someTable.create({ data: parsed.data });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Dynamic params — always await in Next.js 16
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = BigInt(id);
  // ...
}
```

## Key Status Codes

| Code | Meaning |
|------|---------|
| `201` | Active / Waiting (queue + transactions) |
| `202` | Ante-dated shadow queue |
| `205` | Partially paid |
| `210` | Fully paid |
| `300` | For Specimen — ready for accession assignment |
| `311` | Specimen received at lab |
| `360` | Accession numbers assigned |
| `500+` | In progress / completed |
| `650` | Cancelled (soft delete) |
| `866` | Done Outside |
| `877` | Rejected |
| `888` | Waived |
| `899` | Refused |

```typescript
// Named constants — never magic numbers
const TX_STATUS_ACTIVE        = 201;
const TX_STATUS_PAID          = 210;
const TX_STATUS_FOR_SPECIMEN  = 300;
const TX_STATUS_RECEIVED      = 311;
const TX_STATUS_ACCESSION     = 360;
const TX_STATUS_CANCELLED     = 650;
const QUEUE_STATUS_ANTEDATE   = 202;
```

## Specimen Workflow (210 → 300 → 360 → 311)

```
Payment done (210)
  → "For Specimen" button in Queue  POST /api/queue/[id]/for-specimen
  → Status 300 (For Specimen)
  → "Assign Accession No." button   POST /api/accession/make
  → Status 360 (Accession Assigned)
  → Specimen receiving UI           PATCH /api/results/[id]/receive-specimen
  → Status 311 / 877 / 888 / 899 / 866
```

> **Note:** The 210 → 300 transition is currently a **manual button** (temporary).
> It will be replaced by **Mirth Connect** HL7 auto-trigger once integrated.
> Keep the manual button as a fallback — do not remove it.

## RBAC

Roles stored as bracket strings: `[QUEUE][NURSE][DEVTEAM]`

```typescript
// Page guard
await requireAuth(CMS_MODULES.QUEUE.module, CMS_MODULES.QUEUE.tab);

// API guard — returns session
const session = await requireApiAuth(request, "cms", "queue");

// Feature flag check
const roles = parseUserRoles(session.user.role);
const isBmRole = roles.some(r => r.ldap_role === "[BM-ROLE]");
```

**Module → Role map is in `src/lib/auth/rbac.ts` → `MODULE_ACCESS_MAP`.**

## Queue Code Format

```
CEN20260309001
│   │        └─ 3-digit sequence (resets daily)
│   └───────── YYYYMMDD
└───────────── Clinic code (CEN, SMB, TAR, …)
```

## Dark Mode

```css
/* globals.css — correct Tailwind v4 override */
@variant dark (&:where(.dark, .dark *));   /* NOT @custom-variant */
```

```typescript
// theme-toggle.tsx
const { resolvedTheme, setTheme } = useTheme();  // NOT theme
const isDark = resolvedTheme === "dark";
```

## Git Policy

- **Never push to `feature/my-branch` or any branch** unless the user explicitly says to push.
- **Never push to `main`** unless the user explicitly says to push to main.
- Commit locally only — let the user decide when to push.

## Status Reporting

**After every milestone, feature completion, fix, or module work — always update ALL THREE tracking files:**

| File | Location |
|------|----------|
| `CMS Status Reporting.html` | `c:\Clicktek\Projects\NWDI\CMS - Claude\CMS-v3\CMS Status Reporting.html` |
| `CMS Gap Analysis.html` | `c:\Clicktek\Projects\NWDI\CMS - Claude\CMS-v3\CMS Gap Analysis.html` |
| `.pmcc-tasks.json` | `c:\Clicktek\Projects\NWDI\CMS - Claude\CMS-v3\.pmcc-tasks.json` |

A **milestone** includes: completing a priority item, finishing a module section, fixing a critical bug, or any work the user marks as done.

Use these three sources as reference when updating:
1. **CMS v3** (this codebase) — what is actually implemented
2. **CMS v1** (`c:\Clicktek\Projects\NWDI\CMS - Claude\CMS`) — the Laravel source being replicated
3. **`CMS_FRD.pdf`** (`c:\Clicktek\Projects\NWDI\CMS - Claude\CMS_FRD.pdf`) — the functional requirements document

Update rules:
- **`CMS Status Reporting.html`** — update module sections, mark features ✅ Done / 🔄 In Progress / ❌ Not Started, update header date and footer counts
- **`CMS Gap Analysis.html`** — update summary cards (Done/Not Started counts), matrix completion %, process table rows, and remove items from blockers/Not Started sections when resolved
- **`.pmcc-tasks.json`** — update task `status` (`done`, `in-progress`, `not-started`, etc.), `progress` (0–100), and `notes` fields for affected tasks
- Do not guess status — only mark Done if the feature is fully implemented and working
- Cross-reference v1 behavior and FRD requirements — flag any gaps or deviations

## Common Issues & Fixes

| Error | Fix |
|-------|-----|
| `Can't resolve '../../generated/prisma/client'` | Run `npx prisma generate` |
| `Unexpected token '<'` on API calls | Use `apiFetch` instead of raw `fetch` |
| Dark mode colors don't change | Check `@variant dark` (not `@custom-variant`) in globals.css |
| Dark mode icon doesn't change | Use `resolvedTheme` not `theme` |
| BigInt JSON serialization error | Convert with `Number(bigIntValue)` before returning |
| `params` type error in Next.js 16 | `const { id } = await params` — params is a Promise |
| `Unknown property datasources/datasourceUrl` in PrismaClient | Prisma v7 client engine: use `new PrismaPg({ connectionString })` adapter, pass as `new PrismaClient({ adapter })` |
