# CMS v3 — Project Status

_Last reviewed: 2026-03-09_

---

## ✅ DONE

### Queue Module
The most complete module in the system. Full end-to-end implementation.

| Task | Status |
|------|--------|
| Queue list page with live 15s auto-refresh | ✅ |
| Status filters (badge counts per status) | ✅ |
| Search by patient name / accession | ✅ |
| Add to Queue modal (patient search + quick entry) | ✅ |
| Create Queue page (full transaction form) | ✅ |
| Edit Queue page — queue details, vitals, transactions | ✅ |
| Edit individual committed transaction (doctor/company/item) | ✅ |
| Remove/cancel transaction (soft-cancel, Status → 650) | ✅ |
| Cancel Queue + Ante-date (Status 202 shadow queue) | ✅ |
| Approve amendment (202 → 201, void original) | ✅ |
| Payment recording for selected transactions | ✅ |
| Regenerate lab PDF (HL7 trigger) | ✅ |
| Queue code generation (`CEN20260309001` format) | ✅ |
| RBAC guards on all queue pages and API routes | ✅ |
| Role-based button visibility (BM-ROLE, RESULTS-RELEASING) | ✅ |

**API routes done:** `GET/POST /api/queue`, `GET/PATCH /api/queue/[id]`, `/cancel`, `/approve-amendment`, `/payment`, `/regenerate-pdf`, `PATCH/DELETE /api/transactions/[id]`

---

### Clinical Module
Full doctor/nurse consultation workflow implemented.

| Task | Status |
|------|--------|
| Clinical queue list (filtered for clinical staff) | ✅ |
| Status tabs: Waiting / In Progress / Completed | ✅ |
| Stats counter (waiting, in-progress, completed) | ✅ |
| Evaluation drawer (side panel) | ✅ |
| Vital signs form (BP, HR, temp, O2, weight, height, BMI, vision) | ✅ |
| Physical examination form | ✅ |
| Medical history fields (liver, heart, asthma, TB, etc.) | ✅ |
| Social history (smoking, alcohol, OB-GYN) | ✅ |
| Consultation notes (SOAP format) | ✅ |
| Item-based medical evaluation | ✅ |
| Mark clinical complete | ✅ |
| Physicians list API | ✅ |
| RBAC guards (`cms/clinical`) | ✅ |

**API routes done:** `GET /api/clinical/queue`, `GET /api/clinical/physicians`, `GET/POST /api/clinical/[queueId]/vitals`, `/pe`, `/evaluation`, `/medical-eval`, `/complete`, `/status`

---

### Enrollment Module
Card enrollment lifecycle fully implemented at API and component level.

| Task | Status |
|------|--------|
| Card enrollment list (REGISTERED / RECEIVED / VERIFIED / TRANSFERRED tabs) | ✅ |
| Register card modal | ✅ |
| Receive card action | ✅ |
| Verify card action | ✅ |
| Transfer card action | ✅ |
| Card number lookup | ✅ |
| Enrollment patient list | ✅ |
| Search by card number / company | ✅ |
| Pagination (10 per page) | ✅ |
| RBAC guards (`cms/enrollment`) | ✅ |

**Note:** The `EnrollmentService` throws errors (database table pending). The enrollment API (`/api/enrollment/cards`) uses **raw SQL** directly — bypasses the service layer for now.

**API routes done:** `GET/POST /api/enrollment/cards`, `/receive`, `/verify`, `/transfer`, `/patients`, `/card-numbers`

---

### User Management (Settings)
Full CRUD for system users.

| Task | Status |
|------|--------|
| User list with search + status filter | ✅ |
| Create user (with bcrypt password hashing) | ✅ |
| Edit user (role, active status) | ✅ |
| View user details | ✅ |
| Delete user (soft delete via `deleted_at`) | ✅ |
| LDAP import flag support | ✅ |
| Pagination (10 per page) | ✅ |
| RBAC guard (`cms/settings`) | ✅ |

---

### Auth & RBAC
| Task | Status |
|------|--------|
| Login page (clinic selector + credentials) | ✅ |
| NextAuth JWT session (2hr expiry) | ✅ |
| LDAP auth stub (returns null — logs warning) | ✅ |
| Local DB fallback with bcrypt | ✅ |
| Legacy PHP `$2y$` → `$2b$` hash conversion | ✅ |
| RBAC with raw bracket-string roles `[QUEUE][NURSE]` | ✅ |
| `requireAuth()` server component guard | ✅ |
| `requireApiAuth()` API route guard | ✅ |
| `hasAccess()` / `hasBranchAccess()` helpers | ✅ |
| Demo users (admin / nurse / cashier) for dev | ✅ |

---

### Infrastructure
| Task | Status |
|------|--------|
| PostgreSQL via Prisma v7 + `@prisma/adapter-pg` | ✅ |
| Dark mode toggle (`@variant dark` + `next-themes`) | ✅ |
| Generated Prisma client committed to git | ✅ |
| `postinstall: prisma generate` in package.json | ✅ |
| Root `/` redirect to `/queue` | ✅ |
| In-UI 404 page (inside dashboard layout) | ✅ |
| React Query (30s stale, 60s refetch) | ✅ |
| Zustand store for queue filters | ✅ |
| `apiFetch` safe client helper | ✅ |
| `cn()`, `formatDate()`, `formatCurrency()` utils | ✅ |

---

## 🔄 ONGOING / PARTIAL

### Payment Module
The payment form component is fully implemented, but the standalone payment tracking page is incomplete.

| Task | Status | Blocker |
|------|--------|---------|
| Payment form (select transactions, method, submit) | ✅ | — |
| `POST /api/queue/[id]/payment` — record payment | ✅ | — |
| `/payment` standalone page with payment list | ❌ | `paymentHistory` table not in schema |
| `PaymentService.getPayments()` | ❌ | Throws — table not available |
| `PaymentService.createPayment()` | ❌ | Throws — table not available |
| `GET/POST /api/payment` routes | ❌ | Blocked by service stubs |
| Payment history / OR tracking | ❌ | — |

---

### Settings Module
User management is done. System configuration section is empty.

| Task | Status |
|------|--------|
| User management (CRUD) | ✅ |
| LDAP configuration UI | ❌ |
| Facility / branch management | ❌ |
| System settings (business unit setup) | ❌ |
| Workstation management | ❌ |
| Role management (`[BM-ROLE]` / `[BM-MODULE]`) | ❌ |
| HL7 configuration (`[HL7BTN]`) | ❌ |

---

### EROS Module
Page shell exists with navigation tabs; no actual implementation.

| Task | Status |
|------|--------|
| Company list page shell | ⚠️ placeholder |
| Company CRUD (create, edit, view) | ❌ |
| Item Master List | ❌ |
| Physician management | ❌ |
| `GET /api/companies` | ✅ |
| `GET /api/physicians`, `GET /api/physicians/[id]` | ✅ |
| Sync from EROS button | ❌ |

---

## ❌ TODO

### Results Module
Page shell with placeholder text only. No component, no API.

| Task | Status |
|------|--------|
| Results monitoring list | ❌ |
| Results releasing workflow | ❌ |
| Result uploading | ❌ |
| Company results portal | ❌ |
| Lab results (`[LABORATORY]`, `[RADIOLOGY]`, `[XRAY]` roles) | ❌ |
| API routes for results | ❌ |

---

### Reports Module
6 hardcoded report cards exist on the page but none are functional.

| Task | Status |
|------|--------|
| Daily Sales report | ❌ |
| Card Management report | ❌ |
| Transaction report | ❌ |
| Queue Summary report | ❌ |
| Payment Summary report | ❌ |
| Facility Comparison report | ❌ |
| Export to Excel (ExcelJS installed, unused) | ❌ |
| TAT (Turnaround Time) report | ❌ |
| Daily Census report | ❌ |
| Lab Rejected report | ❌ |
| Compliance report | ❌ |

---

### LDAP Authentication
Stub exists in `auth.ts` but always returns `null`.

| Task | Status |
|------|--------|
| Install & configure `ldapjs` | ❌ |
| LDAP bind + user search | ❌ |
| Auto-sync LDAP roles to `user.role` on login | ❌ |
| LDAP group → bracket role mapping | ❌ |

---

### Missing Database Tables

The following tables are referenced in code but not yet in `prisma/schema.prisma`:

| Table | Blocks |
|-------|--------|
| `paymentHistory` | Payment history tracking, OR numbers |
| `CardEnrollment` (PostgreSQL migration) | EnrollmentService methods |
| `consultation_notes` | Clinical client handles gracefully (no hard block) |

---

## Summary

| Module | Done | Partial | Todo |
|--------|------|---------|------|
| Queue | ✅ | | |
| Clinical | ✅ | | |
| Enrollment (API/UI) | ✅ | | |
| Auth / RBAC | ✅ | | |
| User Management | ✅ | | |
| Infrastructure | ✅ | | |
| Payment | | 🔄 | |
| Settings (System Config) | | 🔄 | |
| EROS | | 🔄 | |
| Results | | | ❌ |
| Reports | | | ❌ |
| LDAP Auth | | | ❌ |
| Enrollment Service | | | ❌ |
