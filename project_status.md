# CMS v3 — Project Status

_Last reviewed: 2026-03-15_

> Source of truth for gaps: `CMS Status Reporting.html` (FRD cross-reference)
> This file tracks buildable tasks only — items blocked by Oracle/LIS/RIS are noted separately.

---

## ✅ DONE

### Queue Module (§6 Registration)
| Task | Status |
|------|--------|
| Queue list with 15s auto-refresh + status filters | ✅ |
| Add to Queue modal (patient search + quick entry) | ✅ |
| Create Queue / Edit Queue (transactions, vitals, doctor) | ✅ |
| Edit / cancel individual transactions (soft-cancel → 650) | ✅ |
| Cancel Queue + Ante-date (Status 202 shadow queue) | ✅ |
| Approve amendment (202 → 201, void original) | ✅ |
| Payment recording for selected transactions | ✅ |
| OR PDF + DRF PDF generation | ✅ |
| Queue code generation (`CEN20260309001` format) | ✅ |
| "For Specimen" manual button (210 → 300) | ✅ |
| Assign Accession No. (300 → 360, LAB A–L / IMAGING M–X) | ✅ |
| RBAC guards on all queue pages and API routes | ✅ |

**API routes:** `GET/POST /api/queue`, `GET/PATCH /api/queue/[id]`, `/cancel`, `/approve-amendment`, `/payment`, `/regenerate-pdf`, `/for-specimen`, `PATCH/DELETE /api/transactions/[id]`, `POST /api/accession/make`

---

### Clinical Module (§7 Clinical Documentation)
| Task | Status |
|------|--------|
| Clinical queue list (Waiting / In Progress / Completed tabs) | ✅ |
| Evaluation drawer with full SOAP notes | ✅ |
| Vital signs (15 fields: BP×3, HR, Temp, RR, Weight, Height, BMI, Vision OD/OS) | ✅ |
| Physical examination form | ✅ |
| Medical history (liver, heart, asthma, TB, social, OB-GYN) | ✅ |
| Item-based medical evaluation | ✅ |
| Mark clinical complete | ✅ |

**API routes:** `GET /api/clinical/queue`, `/physicians`, `GET/POST /api/clinical/[id]/vitals`, `/pe`, `/evaluation`, `/medical-eval`, `/complete`, `/status`

---

### Results Module (§8 Laboratory + §11 Result Management)
| Task | Status |
|------|--------|
| Results monitoring list (all paid queues + accession detail expand) | ✅ |
| Blood Extraction station tab (HEMATOLOGY / CHEMISTRY / IMMUNOLOGY) | ✅ |
| Specimen station tab (MICROSCOPY / MICROBIOLOGY) | ✅ |
| Imaging station tab (XRAY / ECG) | ✅ |
| Per-item status: received / waived / rejected / refused / doneOutside | ✅ |
| Tube selector for HEMATOLOGY items | ✅ |
| Results releasing tab (311 → 600) | ✅ |
| Accession type fix: PACK → LAB/IMAGING via itemmaster.Type | ✅ |

**Full workflow:** 210 → 300 (For Specimen) → 360 (Accession Assigned) → 311 (Specimen Received) → 600 (Released)

**API routes:** `GET /api/results`, `PATCH /api/results/[id]/receive-specimen`, `PATCH /api/results/[id]/release`

---

### Payment Module (§10 Billing)
| Task | Status |
|------|--------|
| Payment form (select transactions, method, submit) | ✅ |
| Cash / Check / Card / HMO / Corporate discount logic | ✅ |
| OR number auto-generation per clinic per day | ✅ |
| paymenthistory record saved per payment | ✅ |

**API routes:** `POST /api/queue/[id]/payment`

---

### Enrollment Module
| Task | Status |
|------|--------|
| Card enrollment list (REGISTERED / RECEIVED / VERIFIED / TRANSFERRED) | ✅ |
| Register / Receive / Verify / Transfer card actions | ✅ |
| Card number lookup + enrollment patient list | ✅ |

---

### Auth / RBAC (§14 Security)
| Task | Status |
|------|--------|
| Login page (clinic selector + credentials) | ✅ |
| NextAuth JWT sessions (2hr expiry) | ✅ |
| LDAP stub (returns null — logs warning) | ✅ |
| Local DB fallback with bcrypt + `$2y$` → `$2b$` fix | ✅ |
| RBAC: `requireAuth()` + `requireApiAuth()` on all routes | ✅ |
| Clinic-level data scoping (`clinicCode` on all DB queries) | ✅ |

---

### User Management (Settings)
| Task | Status |
|------|--------|
| User list, create, edit, delete (soft via `deleted_at`) | ✅ |
| Role assignment + LDAP import flag | ✅ |

---

## 🔨 TODO — Buildable Now (No External Dependencies)

Priority order based on FRD requirement coverage and user impact.

### ~~P1 — Reports Module (§10 + §13)~~ — ✅ COMPLETE

All 8 report types fully implemented with UI + API + exports.

| Task | Status |
|------|--------|
| bookkeeper, cash, cashier-summary, hmo, per-item, sendout, summary, amendment reports | ✅ |
| `GET /api/reports/[type]` with JSON / CSV / XLSX export | ✅ |
| Reports UI — sortable table, pagination, summary cards, date range + branch filters | ✅ |
| ExcelJS XLSX + CSV + print export | ✅ |

**API:** `src/app/api/reports/[type]/route.ts` · **UI:** `src/components/reports/reports-client.tsx`

---

### ~~P2 — Audit Logging (§13 + §14)~~ — ✅ COMPLETE

| Task | Status |
|------|--------|
| Separate `cms_audit` DB with `activitylog` Prisma model | ✅ `src/lib/db/audit-prisma.ts` |
| `logActivity()` helper (21 action constants, silent failure) | ✅ `src/lib/audit.ts` |
| Logging wired into queue, payment, release, prescription, user routes | ✅ |
| Audit log viewer page at `/settings/audit-log` | ✅ `src/components/settings/audit-log-client.tsx` |
| `GET /api/audit-logs` — filter by user / module / date | ✅ |

---

### ~~P3 — Patient Create Form (§4)~~ — ✅ COMPLETE

| Task | Status |
|------|--------|
| `POST /api/patients` — create new patient | ✅ |
| `PATCH /api/patients/[id]` — update patient | ✅ |
| `PatientFormModal` — create/edit modal with all demographics fields | ✅ |
| "New Patient" button in Add-to-Queue modal (search miss → quick register) | ✅ |
| Schema: `patient.Id @default(autoincrement())` added — run `npx prisma generate` | ✅ |

---

### ~~P4 — Cashier Standalone Payment Page (§10)~~ — ✅ COMPLETE

| Task | Status |
|------|--------|
| `GET /api/payment?history=true` — paymenthistory records with queue join | ✅ |
| Filter by date / payment method / cashier / search | ✅ |
| Payment page — "Payment Queue" tab (queue statuses) + "Payment History" tab (OR records) | ✅ |
| Summary cards: OR count, total paid, total discount | ✅ |

---

### ~~P5 — Clinical PDF Outputs (§7)~~ — ✅ COMPLETE

| Task | Status |
|------|--------|
| `ConsultationSummaryDocument` PDF — vitals + SOAP + PE + procedures ordered | ✅ |
| `GET /api/queue/[id]/pdf?type=summary` — fetches vitals + consultationNote, renders PDF | ✅ |
| "Print Summary" button in evaluation drawer footer | ✅ |

---

### ~~P6 — Specimen Barcode Label PDF (§8)~~ — ✅ COMPLETE

| Task | Status |
|------|--------|
| `GET /api/results/[id]/barcode-labels` — 1 label per accessionno row | ✅ |
| `BarcodeLabelsDocument` — 2-column A4, prominent accession no., patient name, item description, type badge | ✅ |
| "Labels" print button in Releasing Panel (alongside Release button) | ✅ |

---

## 🚫 TODO — Blocked by External Systems

These gaps require Oracle / LIS / RIS integration that is out of scope until Mirth Connect is wired up.

| Gap | Blocker |
|-----|---------|
| Lab result VALUE encoding (CBC, chemistry panels, etc.) | HCLAB / Oracle LIS |
| Critical result flagging + pathologist approval | LIS integration |
| QC records / TAT tracking | LIS |
| Radiologist interpretation form | RIS integration |
| Imaging file / PDF storage + upload | RIS + file storage (S3 or local) |
| Online patient results portal | EROS Oracle DB |
| EROS branch-to-branch referral CRUD | EROS Oracle DB |
| LDAP authentication (auto-sync roles on login) | LDAP server access |
| Mirth Connect HL7 auto-trigger (210 → 300) | Mirth server |

---

## 📊 Module Completion Summary

| Module | Done | Gap (Buildable) | Blocked |
|--------|------|-----------------|---------|
| Queue (§6) | ✅ | — | — |
| Clinical (§7) | ✅ | — | — |
| Results / Lab (§8+§11) | 75% | — | LIS result encoding |
| Imaging (§9) | 20% | — | RIS interpretation, file storage |
| Payment / Billing (§10) | ✅ | — | — |
| Result Management (§11) | 60% | — | Multi-level validation |
| Referral / EROS (§12) | 5% | — | Oracle EROS DB |
| Reports (§13) | ✅ | — | — |
| Security / Audit (§14) | 75% | **Audit log table + middleware** | LDAP |
| Patient Management (§4) | ✅ | — | — |
| Auth | ✅ | — | LDAP |
| User Management | ✅ | — | — |
| Enrollment | ✅ | — | — |
