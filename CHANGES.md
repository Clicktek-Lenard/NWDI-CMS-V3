# CMS v3 — Full Update Changelog
**Branch:** `merge/cms-v3-full-update-20260306`
**Date:** 2026-03-06
**Base branch:** `users-and-doctor-modules`

---

## Summary

This branch merges all updates from the current development session, covering:
- Role-based access control (RBAC) overhaul to use real production bracket-string roles
- Users module fixes (type alignment, permission UI)
- Health Card Enrollment module (new — full lifecycle API + UI)
- Clinical / Doctor module fixes (SOAP notes, physician search, consultation table creation)
- Auth login fix (bcrypt hash comparison, password reset script)
- Prisma schema alignment with real CMS v2 database
- CMS v3 tables created in production DB via `prisma db push`

---

## 1. Auth & RBAC

### `src/lib/auth/auth.ts`
- Added `$2y$` → `$2b$` normalization for PHP-generated bcrypt hashes
- Added `clinicCode` credential field passed through JWT and session
- Supports both PHP-legacy and Node.js bcrypt hash formats

### `src/lib/auth/rbac.ts` _(major rewrite)_
- Added `ROLE_ACCESS_MAP` — maps 60+ production bracket-string roles (e.g. `[QUEUE]`, `[NURSE]`, `[CARD-RECEIVING]`) to `{ module, tab }` access
- `parseUserRoles()` — handles 3 storage formats:
  1. New JSON string array: `["[QUEUE]", "[NURSE]"]`
  2. Legacy JSON objects: `[{"module":"cms","tab":"queue"}]` → encoded as `legacy:module:tab`
  3. Raw PHP concatenated string: `\r\n[CARD-RECEIVING]\r\n[QUEUE]` → regex extraction
- `hasAccess()` — updated to resolve access via ROLE_ACCESS_MAP for bracket roles, or by direct match for legacy format
- Added `hasBranchAccess(roles, branchCode)` — checks `[SMB-BRANCH]` style roles
- Added `getUserBranches(roles)` — extracts branch codes from branch roles

---

## 2. Users Module

### `src/types/index.ts`
- `UserRole` changed from `interface { module, tab, ldap_role? }` → `type UserRole = string`
- `User.role` changed from `UserRole[]` → `string[]`

### `src/app/api/users/route.ts` & `src/app/api/users/[id]/route.ts`
- Minor alignment fixes; no functional changes

### `src/components/settings/user-modal.tsx` _(major rewrite)_
- `PERMISSION_GROUPS` replaced with 12 groups of real production role tags:
  - Card Enrollment (13 roles), Queue & Reception (5), Clinical (7), Laboratory & Results (12), Imaging & Radiology (4), Payment (3), Patient (2), Company EROS (4), Physician EROS (3), Item Master (1), System Access (1), Branches (6)
- Permissions stored as `JSON.stringify(["[QUEUE]", "[NURSE]", ...])` — bracket string array
- Fixed `activated: user.activated === 1` → `activated: Boolean(user.activated)`
- Shows role count badge: `{N} selected`
- Chip buttons display label; tooltip shows bracket string

### `src/components/settings/user-management-client.tsx`
- `getPermLabels()` — updated to match by `p.role === r` (string comparison) instead of `p.module/p.tab`
- Fixed boolean comparisons: `user.activated === 1` → `user.activated`
- Fixed `user.ldap_import === 1` → `user.ldap_import`

### `src/components/settings/view-user-modal.tsx`
- Removed `permKey()` helper (no longer needed)
- `parsePermissions()` returns `string[]` of bracket roles
- `permissions.includes(p.role)` for role highlight check
- Fixed all `=== 1` boolean comparisons for `activated` and `ldap_import`

### `src/components/settings/delete-user-dialog.tsx`
- UI and type alignment fixes

---

## 3. Health Card Enrollment Module _(new)_

### New API Routes

| File | Method | Description |
|------|--------|-------------|
| `src/app/api/enrollment/cards/route.ts` | GET | Paginated list with lifecycle filter (`REGISTERED`, `RECEIVED`, `VERIFIED`, `TRANSFERRED`) and search by card number or company |
| `src/app/api/enrollment/cards/route.ts` | POST | Register a new card (validates card exists in `cardkey`, prevents duplicate enrollment) |
| `src/app/api/enrollment/cards/[id]/receive/route.ts` | PATCH | Mark card as received (`ReceivedDate`, `ReceivedBy`) |
| `src/app/api/enrollment/cards/[id]/verify/route.ts` | PATCH | Mark card as verified/released (`DateRelease`, `ReleaseBy`, `ReleaseTo`) |
| `src/app/api/enrollment/cards/[id]/transfer/route.ts` | PATCH | Mark card as transferred (`TransferTo`, `TransferBy`, `DateTransfer`) |
| `src/app/api/enrollment/card-numbers/route.ts` | GET | List available card numbers from `cardkey` |
| `src/app/api/enrollment/patients/route.ts` | GET | Patient search (by name or code from `patient` table) |

**Key design decisions:**
- Lifecycle derived from real `cardenrollment` date fields (no varchar status field):
  - `REGISTERED` = DateEnrolled set, no other dates
  - `RECEIVED` = ReceivedDate set OR `cardverified` record exists
  - `VERIFIED` = DateRelease set (card released to patient)
  - `TRANSFERRED` = TransferTo set
- All routes protected with `requireApiAuth(request, "cms", "enrollment")`
- SQL queries use `$queryRawUnsafe` with lifecycle filter inlined (enum-controlled, not user input) and user values parameterized

### New UI Components

| File | Description |
|------|-------------|
| `src/components/enrollment/enrollment-client.tsx` | Main tabbed client — Registration, Receiving, Verification, Transfer tabs; status badges; paginated table; contextual columns per tab |
| `src/components/enrollment/register-card-modal.tsx` | Modal to register a card — card number search/select, submit to POST /api/enrollment/cards |

### Updated Page

**`src/app/(dashboard)/enrollment/page.tsx`**
- Was: placeholder with 4 static tab shells
- Now: renders `<EnrollmentClient />` with full functionality

---

## 4. Clinical / Doctor Module

### `src/app/api/clinical/queue/route.ts`
- Fetches active queue entries (statuses 280, 230, 201, 210) from `queue` table
- Joins with `consultation_notes` to derive display status (`WAITING` / `IN_PROGRESS` / `COMPLETED` / `CANCELLED`)
- Silently ignores missing `consultation_notes` table (catch block)
- Returns per-entry `consultation` snapshot (status, pcp_doctor, diagnosis, is_draft)

### `src/app/api/clinical/[queueId]/evaluation/route.ts`
- GET: Fetches `ConsultationNote` by `queue_id`
- POST: Upserts SOAP note fields (chief_complaint, history_illness, past_history, family_history, pe_findings, diagnosis, icd_code, treatment_plan, orders, pcp_doctor, doctor_id, doctor_name, is_draft)

### `src/app/api/clinical/[queueId]/vitals/route.ts`
- GET/POST: Upserts vitals record in `vitalsign` table (CMS v3 table)
- Fields: BP (3 readings), HR, temperature, respiratory rate, O2 saturation, weight/height/BMI, vision fields, color vision, chief complaint, PCP assignment

### `src/app/api/clinical/[queueId]/pe/route.ts`
- GET/POST: Upserts physical examination record in `physical_examinations` table (CMS v3)

### `src/app/api/clinical/[queueId]/medical-eval/route.ts`
- GET/POST: Upserts medical evaluation items in `medical_evaluations` table; recalculates overall fitness class

### `src/app/api/clinical/[queueId]/status/route.ts`
- PATCH: Updates `ConsultationNote.status` for a queue entry

### `src/app/api/clinical/[queueId]/complete/route.ts`
- POST: Finalizes consultation (sets status=COMPLETED, is_draft=0, completed_at)

### `src/app/api/clinical/physicians/route.ts`
- GET: Searches `physician` table by name or code (for PCP assignment)

### `src/components/clinical/clinical-client.tsx`
- Queue list with status tabs (All / Waiting / In Progress / Completed)
- Status badges with live pulse animation
- Per-row dropdown for status transitions
- Opens `EvaluationDrawer` on row click or Evaluate button

### `src/components/clinical/evaluation-drawer.tsx`
- 4-tab evaluation drawer:
  - **Vitals** — BP (3 readings), HR, temperature, O2, weight/height/BMI, vision, color vision, PCP assignment with physician search autocomplete
  - **SOAP Notes** — Subjective (chief complaint, history), Objective (PE findings), Assessment (diagnosis, ICD-10), Plan (treatment, orders, assigned PCP)
  - **Physical Exam** — Medical history checkboxes, social history, OB-GYN history, family history, systems examination per body region
  - **Med Eval** — Dynamic item rows (item code, findings, assessment, recommendation, class A/B/C/D/Pending); overall fitness class auto-calculated
- Save per-tab + "Complete Evaluation" action

---

## 5. Prisma Schema Alignment

### `prisma/schema.prisma` _(major update)_
- Aligned all models with real CMS v2 database structure verified from `cms_v2.txt`
- Removed incorrect fields from `Queue` model (no NameCompany/CodeCompany)
- `CardEnrollment` → correct fields from `cardenrollment` table (date-based lifecycle, no PatientId/CompanyId)
- `CardVerified` → `@@map("cardverified")` (VerifiedCardNumbers, ICTReceived, DateReceived)
- `CardNumber` → `@@map("cardkey")` (GeneratedCardNumber, CodeCompany, GeneratedBy, Year, Batch, Month, SeriesNum)
- Added `Physician` → `@@map("physician")` model
- Added `Vitals` → `@@map("vitalsign")` — new CMS v3 vitals table
- Added `CmsVitals` → `@@map("vitals")` — real CMS v2 vitals (read-only)
- Added `Patient` → `@@map("patient")` — read-only patient master
- Added CMS v3 new tables: `ConsultationNote`, `PhysicalExamination`, `MedicalEvaluation`
- `User` model fully aligned (username, role, department, ldap_import, etc.)

### Prisma DB Push
- Ran `npx prisma db push` against production DB (10.10.230.22)
- Created new CMS v3 tables: `consultation_notes`, `physical_examinations`, `medical_evaluations`, `vitalsign`
- Applied non-breaking enum→char(1) casts on: `businessunits.Status`, `company.EnabledEndDate`, `counterno.Status`, `queuestatus.Status`

### `src/generated/prisma/client/`
- Regenerated Prisma client to match updated schema
- Updated: `index.js`, `index.d.ts`, `index-browser.js`, `edge.js`, `schema.prisma`, `package.json`

---

## 6. New Utility Files

| File | Description |
|------|-------------|
| `src/lib/api.ts` | `apiFetch<T>()` helper — typed fetch wrapper with JSON error handling |
| `src/components/theme-toggle.tsx` | Dark/light mode toggle button component |
| `scripts/reset-password.js` | Dev utility — resets a user's password via direct DB update (uses dotenv + bcryptjs) |

---

## 7. UI / Layout

### `src/components/layouts/sidebar.tsx`
- Updated navigation links; removed Medical Eval module
- Sidebar reflects current module structure

### `src/components/layouts/header.tsx`
- Added theme toggle button
- User session display improvements

### `src/components/providers.tsx`
- Added `ThemeProvider` from `next-themes` for dark/light mode support

### `src/app/globals.css`
- Dark mode CSS variable overrides

### `src/app/(auth)/login/page.tsx`
- Added clinic code selector field
- Updated form layout and branding

### Queue & other modules
- `src/components/queue/queue-client.tsx` — Various queue UI improvements
- `src/components/queue/add-to-queue-modal.tsx` — Add-to-queue form improvements
- Dashboard pages (payment, reports, results, eros/company) — Auth guard alignment

---

## 8. Reference / Schema Files _(untracked, now included)_

| File | Description |
|------|-------------|
| `cms_v2.txt` | CMS v2 database schema export (reference) |
| `CMS-V2.sql` | CMS v2 full SQL dump (reference) |
| `CMS_SCHEMA.txt` | Schema summary text (reference) |
| `Auth.txt` | Auth database schema reference |
| `Eros.txt` | Eros database schema reference |
| `CARD_ENROLLMENT.md` | Card enrollment module design notes |
| `DOCTOR_MODULE.md` | Doctor/clinical module design notes |

---

## Bug Fixes

| Issue | Fix |
|-------|-----|
| `CredentialsSignin` on login | Identified wrong stored password; added `reset-password.js` script to reset via DB |
| Login redirects to `/unauthorized` | `parseUserRoles` now handles all 3 legacy role formats (new JSON, legacy objects, raw PHP string) |
| Enrollment SQL error (Prisma.sql nesting) | Switched from `$queryRaw` tagged templates to `$queryRawUnsafe` with inlined lifecycle filter string and parameterized user values |
| `findUnique` on nullable unique field | Changed `cardEnrollment.findUnique` → `findFirst` for nullable `CardNumber` field |
| Doctor Consultation blank (SOAP tab) | `consultation_notes` table did not exist in DB; fixed by running `prisma db push` |
