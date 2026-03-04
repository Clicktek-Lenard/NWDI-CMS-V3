# Changelog

All notable changes to CMS v3 are documented in this file.

---

## [Unreleased] – 2026-03-04

### Summary
Complete PostgreSQL migration from MySQL, full Today's Queue feature, new CMS portal pages,
RBAC rewrite with bracket-role matching, and comprehensive TypeScript nullable-field fixes.

---

### Added

#### PostgreSQL Migration Scripts (`prisma/`)
- **`fix_pg_schema.sql`** – One-time script to repair the pgloader-migrated schema:
  adds primary keys, converts INT boolean columns to proper `BOOLEAN`, adds unique constraints.
- **`fix_enum_data.sql`** – Expands `VarChar(1)` status columns and migrates `'0'`/`'1'`
  values to human-readable `'ACTIVE'`/`'INACTIVE'` enums.
- **`fix_sequences.sql`** – Adds PostgreSQL auto-increment sequences to four tables
  (`queue`, `transactions`, `vitals`, `users`) that pgloader migrated without serial defaults.
  Resolves Prisma P2011 null constraint violations on `id` columns.

#### New API Routes (`src/app/api/`)
- **`/api/companies`** – Returns company list (HMO / payor lookup).
- **`/api/item-prices`** – Returns item price list with optional company-code filtering.
- **`/api/patients/search`** – Full-name patient search (uses `contains` with
  `mode: insensitive`; `search` operator not supported by pg adapter).
- **`/api/physicians`** – Returns physician/doctor list.
- **`/api/queue/[id]`** – GET single queue entry; PATCH for status, accession number,
  vitals, and transaction updates; DELETE (cancel).
- **`/api/transaction-types`** – Returns active transaction type lookup.
- **`/api/transactions`** – Handles transaction-level CRUD operations.

#### New CMS Pages (`src/app/(dashboard)/cms/`)
- **`queue/page.tsx`** – Today's Queue list view for the selected clinic, with status
  filter tabs, pagination, and inline accession-number entry.
- **`queue/[id]/edit/page.tsx`** – Queue detail / edit page: patient info, vitals
  (medication, last dose, last period), transaction line items, and status management.
- **`payment/[id]/page.tsx`** – Payment ledger view for a queue entry showing
  transaction balances and payment history.

#### New Components (`src/components/`)
- **`auth/login-form.tsx`** – Standalone login form component (extracted from page).
- **`queue/edit-queue-form.tsx`** – Full queue-edit form with vitals and transaction
  management, respects `isBmRole` and `isResultsReleasing` permissions.
- **`queue/create-transaction-form.tsx`** – Modal form for adding new transaction
  line items to an existing queue entry.
- **`payment/`** – Payment-related UI components.

#### App-Level Pages
- **`src/app/not-found.tsx`** – Global 404 page.
- **`src/app/(dashboard)/not-found.tsx`** – Dashboard-scoped 404 page.

---

### Changed

#### Database / Prisma
- **`prisma/schema.prisma`** – Rebuilt for PostgreSQL (previously MySQL):
  - All models reflect introspected PostgreSQL column names and types.
  - Added `@default(autoincrement())` to `User.id`, `queue.Id`, `transactions.Id`,
    `vitals.Id` so Prisma omits the PK in INSERT statements (required for sequences).
  - Added `@default(false)` to `User.show_in_list`, `two_factor_enrolled`,
    `two_factor_optin` to satisfy non-null constraints on user creation.
  - Removed MySQL-specific annotations (`@db.VarChar`, `@db.TinyInt`, etc.).
  - Updated `@map` annotations to match lowercase PostgreSQL column names.

- **`src/lib/db/prisma.ts`** – Switched to `@prisma/adapter-pg` (Prisma v7 requirement).
  The datasource no longer uses a `url` in the schema; the connection string is passed
  via the `PrismaPg` driver adapter at runtime.

- **`package.json`** – Added `@prisma/adapter-pg` dependency; updated Prisma to v7.

#### Authentication (`src/lib/auth/auth.ts`)
- Fixed JWT module augmentation: `declare module "@auth/core/jwt"` (was `"next-auth/jwt"`,
  which caused TS2664 at build time).
- Added missing required fields (`show_in_list`, `two_factor_enrolled`,
  `two_factor_optin`) to `prisma.user.create` call on first LDAP login.
- Fixed nullable `user.password` in `bcrypt.compare` call (`?? ""`).
- Fixed session callback type casting (`token.id as string`).

#### RBAC (`src/lib/auth/rbac.ts`)
- Complete rewrite to use bracket-string role matching:
  - `MODULE_ACCESS_MAP` maps each CMS module/tab to the required bracket roles
    (e.g., `[QUEUE]`, `[USERCMS]`, `[BM-ROLE]`).
  - `hasAccess(role, module, tab)` checks `role.includes("[ROLE_NAME]")`.
  - `parseUserRoles()` extracts individual bracket-string role entries for
    component-level permission checks.

#### Queue Feature (`src/services/queue.service.ts`)
- Added `AnteDateStatus: 0` to `prisma.queue.create` (non-nullable column).
- Fixed `statusMap.set` calls to use `s.Name ?? ""` and `qs.Name ?? ""`
  (nullable `Name` field in `queuestatus` table).
- Updated `mapQueueEntry` helper: signature accepts `Code: string | null` and
  `InputBy: string | null`; return values use `?? ""` coalescing.
- `generateQueueCode` method added for pre-computing the next queue code before
  the full queue creation (used by the edit/cancel workflow).

#### Login Page (`src/app/(auth)/login/page.tsx`)
- Filters out `null` `Code` values from business-unit query before rendering the
  clinic selector.

#### Layouts & Navigation
- **`src/app/layout.tsx`** – Root layout updated.
- **`src/app/(dashboard)/layout.tsx`** – Dashboard layout updated.
- **`src/components/layouts/header.tsx`** – Header updated.
- **`src/components/layouts/sidebar.tsx`** – Sidebar updated with CMS portal links.

#### Existing Queue Components
- **`src/components/queue/add-to-queue-modal.tsx`** – Updated for PostgreSQL field
  names and nullable handling.
- **`src/components/queue/queue-client.tsx`** – Updated for new API response shape.

#### API Route Fixes
- **`src/app/api/queue/route.ts`** – Updated for PostgreSQL schema; fixed nullable
  fields throughout.
- **`src/app/api/item-prices/route.ts`** – Fixed nullable `Code`, `Description`,
  `CompanyCode`; filters null codes from response array.
- **`src/app/api/patients/search/route.ts`** – Replaced unsupported `search` operator
  with `{ contains: q, mode: "insensitive" }`.
- **`src/app/api/transaction-types/route.ts`** – Fixed `Status: true` → `Status: 1`
  (PostgreSQL column is INT, not boolean).

#### Service Stubs
- **`src/services/enrollment.service.ts`** – All methods now throw a descriptive error
  (`"cardEnrollment table not yet available"`) instead of calling non-existent Prisma
  models. Table to be added in a future migration.
- **`src/services/payment.service.ts`** – Same treatment for `paymentHistory` table.

#### Types (`src/types/index.ts`)
- Updated shared types to align with PostgreSQL schema field names and nullability.

---

### Removed

- **`src/app/(dashboard)/queue/page.tsx`** – Original top-level queue page replaced by
  the new CMS portal queue at `src/app/(dashboard)/cms/queue/page.tsx`.

---

### Migration Notes

Before starting the app against a freshly pgloader-migrated PostgreSQL database, run
the following SQL scripts **in order** against the `cms_v2` database:

```bash
psql $DATABASE_URL -f prisma/fix_pg_schema.sql
psql $DATABASE_URL -f prisma/fix_enum_data.sql
psql $DATABASE_URL -f prisma/fix_sequences.sql
```

These scripts are idempotent (`IF NOT EXISTS`, `IF NOT EXISTS`, etc.) and safe to
re-run.

---

### Known Gaps (future work)

- `cardEnrollment` table not yet created → enrollment features throw stub errors.
- `paymentHistory` table not yet created → payment history throws stub errors.
- Two-factor authentication UI is wired but not fully implemented.
