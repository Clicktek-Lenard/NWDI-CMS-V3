# CMS v3 — Gap Analysis & Blockers
_Generated: 2026-03-16 · Cross-referenced against FRD, CMS v1, and actual codebase_

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully implemented (API + UI) |
| 🟡 | API exists, UI missing or incomplete |
| 🔴 | Not implemented (no API, no UI) |
| 🚫 | Blocked by external system — cannot build without it |
| ⚠️ | Partially implemented — needs work but buildable |

**Blocker types:**
- **[LIS]** — Requires HCLAB / Oracle Laboratory Information System
- **[RIS]** — Requires Radiology Information System
- **[ORACLE]** — Requires Oracle EROS database
- **[LDAP]** — Requires LDAP server access
- **[MIRTH]** — Requires Mirth Connect HL7 integration
- **[SMTP]** — Requires SMTP server configuration
- **[INFRA]** — Requires infrastructure (file storage, S3, etc.)
- **[EXTAPI]** — Requires external API (PhilHealth, HMO systems)

---

## 1. Queue Module (§6 Registration)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Queue list (today, 15s refresh) | ✅ | — | |
| Add to Queue (patient search + transactions) | ✅ | — | |
| Create / Edit queue | ✅ | — | |
| Cancel queue + ante-date shadow | ✅ | — | |
| Approve / Reject amendment | ✅ | — | |
| Payment recording (cash/check/card/HMO/corporate) | ✅ | — | |
| OR PDF + DRF PDF generation | ✅ | — | |
| Charge slip PDF | ✅ | — | Route `/api/reports/charge-slip` exists |
| "To Comeback" slip PDF | ✅ | — | Route `/api/reports/to-comeback` exists |
| Queue code generation (clinic+date+seq) | ✅ | — | |
| "For Specimen" button (210 → 300) | ✅ | — | Manual trigger only |
| Assign Accession No. (300 → 360) | ✅ | — | |
| Edit / cancel individual transactions | ✅ | — | |
| HL7 resend button (per transaction) | 🟡 | — | API `/api/transactions/[id]/hl7-resend` exists, **no UI button in edit-queue form** |
| Mirth Connect auto-trigger (210 → 300) | 🚫 | **[MIRTH]** | Currently manual button; HL7 builder ready but no Mirth server wired |
| Multi-branch cross-queue visibility | 🔴 | — | No API for viewing another branch's queue; each session is clinic-scoped |

---

## 2. Clinical Module (§7 Clinical Documentation)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Clinical queue list (Waiting / In Progress / Completed) | ✅ | — | |
| Vital signs capture (15 fields) | ✅ | — | |
| SOAP notes | ✅ | — | |
| Physical examination form (full PE) | ✅ | — | |
| Medical history (past, social, OB-GYN, family) | ✅ | — | |
| Item-based medical evaluation | ✅ | — | |
| Overall fitness classification (A/B/C/D/Pending) | ✅ | — | |
| Mark clinical complete | ✅ | — | |
| Consultation summary PDF | ✅ | — | |
| Prescription (create / save) | ✅ | — | API + UI both exist |
| ICD-10 code autocomplete / lookup | 🔴 | — | ICD field exists in SOAP, no search/autocomplete |
| Drug database / medication lookup | 🔴 | — | Prescription free-text only; no formulary |
| Doctor assignment (PCP) | ✅ | — | Physician search in vitals tab |
| Checked By physician dropdown (PE tab) | ✅ | — | Fixed in current session |

---

## 3. Results Module — Lab (§8 + §11)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Results monitoring list (paid queues + accession detail) | ✅ | — | |
| Blood Extraction receiving (Hematology/Chemistry/Immunology) | ✅ | — | |
| Specimen receiving (Microscopy/Microbiology) | ✅ | — | |
| Imaging receiving (XRAY/ECG) | ✅ | — | |
| Per-item status: received/waived/rejected/refused/doneOutside | ✅ | — | |
| Specimen receive → Status 311 | ✅ | — | |
| Barcode label PDF printing | ✅ | — | |
| Results releasing (311 → 600) | ✅ | — | |
| **Manual lab result value encoding (UI)** | 🟡 | — | API `POST /api/results/[id]/encode` exists and works; **no UI form to enter CBC values, chemistry panels, etc.** |
| **Manual imaging result encoding (UI)** | 🟡 | — | API `POST /api/results/[id]/imaging-encode` exists; **no UI form** |
| **Result validation (nurse/pathologist sign-off)** | 🟡 | — | API `PATCH /api/results/[id]/validate` transitions ENCODED→VALIDATED; **no validate button in UI** |
| **Send results by email** | 🟡 | **[SMTP]** | API `POST /api/results/[id]/send-email` exists with PDF attachment; **no UI trigger button**, requires `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` env vars |
| Auto-encode lab values from HCLAB/LIS | 🚫 | **[LIS]** | Requires Mirth Connect HL7 ADT/ORU feed from HCLAB |
| Critical value flagging + pathologist approval workflow | 🚫 | **[LIS]** | Requires LIS to push critical flags via HL7 |
| QC records / TAT tracking | 🚫 | **[LIS]** | Turn-around-time requires LIS timestamps |
| Multi-level validation (pathologist sign-off) | 🚫 | **[LIS]** | Requires LIS integration for chain of custody |
| **Branch Sendout tab** | ⚠️ | — | Tab exists in UI, `SendoutPanel` component referenced but **implementation is a stub/empty** |

---

## 4. Results Module — Imaging (§9)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Imaging accession assignment | ✅ | — | Same accession flow as LAB (Type = IMAGING) |
| Imaging specimen receiving | ✅ | — | Imaging station tab (XRAY/ECG) |
| **Radiologist interpretation UI** | 🔴 | — | No form for entering radiology findings/impression; `imaging-encode` API exists but needs full UI |
| **Imaging file / DICOM upload** | 🚫 | **[RIS] [INFRA]** | Requires PACS/RIS + file storage (S3 or local) |
| **RIS integration (auto-push results)** | 🚫 | **[RIS]** | Requires RIS HL7 ORM/ORU messages via Mirth |

---

## 5. Payment / Billing Module (§10)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Payment recording (all methods) | ✅ | — | |
| OR auto-generation per clinic/day | ✅ | — | |
| Payment history list (date/method/cashier filter) | ✅ | — | |
| Summary cards (OR count, total, discount) | ✅ | — | |
| Cashier standalone page | ✅ | — | |
| **HMO system integration (eligibility check)** | 🚫 | **[EXTAPI]** | HMO company recorded manually; no API to verify coverage |
| **PhilHealth e-claims submission** | 🚫 | **[EXTAPI]** | Requires PhilHealth eClaims API access |
| **Corporate billing statement generation** | 🔴 | — | No SOA/billing statement PDF for companies |

---

## 6. Reports Module (§13)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Bookkeeper report (JSON/CSV/XLSX) | ✅ | — | |
| Cash report | ✅ | — | |
| Cashier summary report | ✅ | — | |
| HMO report | ✅ | — | |
| Per-item report | ✅ | — | |
| Sendout report | ✅ | — | |
| Summary report | ✅ | — | |
| Amendment report | ✅ | — | |
| Charge slip PDF | ✅ | — | |
| To-comeback slip PDF | ✅ | — | |
| **TAT (Turnaround Time) report** | 🚫 | **[LIS]** | Requires LIS receipt + result timestamps |
| **Laboratory QC / rejected report** | 🚫 | **[LIS]** | Requires LIS QC data |
| **Compliance report** | 🚫 | **[LIS]** | Regulatory compliance tied to LIS result completion |
| **Card management report** | 🚫 | **[ORACLE]** | Requires Oracle EROS enrollment database |
| **Daily census / demographic report** | 🔴 | — | No report for patient demographic breakdown |
| **Doctor productivity report** | 🔴 | — | No per-physician patient count/revenue report |

---

## 7. Patient Management (§4)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Patient search | ✅ | — | |
| Create patient (demographics) | ✅ | — | |
| Update patient | ✅ | — | |
| Patient history (past queues) | ✅ | — | `/api/patients/[id]/history` |
| **Patient photo upload** | 🔴 | — | No API or UI for photo capture/upload |
| **Patient merge (duplicate detection)** | 🔴 | — | No deduplication workflow |

---

## 8. Appointments / Scheduling (§5)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Daily schedule view by physician | ✅ | — | Reads queue data grouped by doctor |
| **Appointment booking (create/cancel)** | 🔴 | — | No appointment table; schedule is derived from queue, not actual bookings |
| **Appointment reminder (SMS/email)** | 🚫 | **[SMTP] [EXTAPI]** | No notification system; requires SMTP or SMS gateway |
| **Recurring / recurring schedule templates** | 🔴 | — | No recurring appointment support |

---

## 9. EROS Module (§12 Referral)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Company CRUD (code, name, billing type, status) | ✅ | — | |
| Item prices CRUD | ✅ | — | |
| Item master CRUD | ✅ | — | |
| Physician accreditation (For Approval / Accredited tabs) | ✅ | — | |
| Approve / decline physician with reason | ✅ | — | |
| **Branch-to-branch referral CRUD** | 🚫 | **[ORACLE]** | Requires live Oracle EROS DB connection (`oracledb` + Oracle Instant Client) |
| **Online patient results portal** | 🚫 | **[ORACLE]** | Patient self-service portal reads from EROS Oracle |
| **EROS sync (CMS → EROS write-back)** | 🚫 | **[ORACLE]** | Any CMS data that must propagate back to Oracle EROS |

---

## 10. Kiosk Module

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Patient self check-in (no auth) | ✅ | — | Public endpoint, creates queue entry |
| Kiosk display (Now Serving / Waiting list) | ✅ | — | |
| **QR code scan → show patient results** | 🚫 | **[LIS]** | Results not available without LIS encoding |
| **Kiosk appointment check-in** | 🔴 | — | No appointment table to check against |

---

## 11. Auth / Security (§14)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Login (clinic selector + credentials) | ✅ | — | |
| JWT sessions (2hr expiry) | ✅ | — | |
| RBAC guards on all routes | ✅ | — | |
| Clinic-level data scoping | ✅ | — | |
| Audit logging (21 action types) | ✅ | — | |
| Audit log viewer | ✅ | — | |
| **LDAP authentication (auto-sync roles)** | 🚫 | **[LDAP]** | Stub returns null; logs warning; falls back to local DB |
| **Session timeout warning UI** | 🔴 | — | 2hr JWT expires silently; no countdown/refresh prompt |
| **Password reset flow** | 🔴 | — | No forgot password / reset email |

---

## 12. User Management (Settings)

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| User list, create, edit, soft-delete | ✅ | — | |
| Role assignment | ✅ | — | |
| **LDAP user import / sync** | 🚫 | **[LDAP]** | Flagged in DB but no sync mechanism |
| **Workstation configuration** | 🔴 | — | `[WORKSTATION]` role referenced in RBAC but no workstation settings page |

---

## 13. Dashboard

| Process | Status | Blocker | Notes |
|---------|--------|---------|-------|
| Today's queue stats (total/waiting/paid/cancelled/in-progress) | ✅ | — | |
| Today's revenue | ✅ | — | |
| Pending amendments count | ✅ | — | |
| Specimen pipeline (For Specimen / Accession / Received / Released) | ✅ | — | |
| Auto-refresh every 60s | ✅ | — | |
| **Multi-day trend charts** | 🔴 | — | No charting library; single-day snapshot only |
| **Per-physician productivity widget** | 🔴 | — | No doctor-level stats |
| **Branch comparison (multi-clinic view)** | 🔴 | — | Single clinic-scoped view only |

---

## Summary — Blockers by Type

### 🚫 External System Blockers (cannot build without access)

| Blocker | Affects | What's needed |
|---------|---------|---------------|
| **[MIRTH]** Mirth Connect HL7 | Queue auto-trigger 210→300; HL7 resend UI | Mirth server URL + credentials |
| **[LIS]** HCLAB / Oracle LIS | Lab result encoding, critical flags, QC, TAT, kiosk results | HCLAB API or HL7 ORU feed via Mirth |
| **[RIS]** Radiology IS | Imaging result push, DICOM storage | RIS HL7 ORM/ORU + PACS endpoint |
| **[ORACLE]** EROS Oracle DB | Branch referrals, patient portal, EROS sync | Oracle Instant Client + `oracledb` npm package + DB credentials |
| **[LDAP]** LDAP server | Auto-login role sync, LDAP user import | LDAP server hostname + service account |
| **[SMTP]** Email server | Send results email | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` env vars — **lowest barrier** |
| **[EXTAPI]** External APIs | PhilHealth e-claims, HMO eligibility, SMS reminders | Third-party API credentials (PhilHealth, HMO APIs, SMS gateway) |
| **[INFRA]** File storage | DICOM/imaging file upload | S3 bucket or local file server |

---

### 🟡 Buildable Gaps (API ready, UI missing — no external dependency)

| Gap | Module | Effort |
|-----|--------|--------|
| Lab result value encoding form (CBC, Chem panel, etc.) | Results | Medium |
| Imaging result / radiology findings encoding form | Results | Medium |
| Result validation button (ENCODED → VALIDATED) | Results | Low |
| Send email button (uses existing `/send-email` API) | Results | Low — just needs SMTP config |
| HL7 resend button in edit-queue form | Queue | Low |
| Branch Sendout tab implementation | Results | Medium |
| ICD-10 code search/autocomplete | Clinical | Medium |
| Drug/medication formulary lookup | Clinical | Medium |
| Corporate billing statement (SOA) PDF | Payment | Medium |
| Daily census / demographic report | Reports | Medium |
| Doctor productivity report | Reports | Medium |
| Session timeout warning / auto-refresh | Auth | Low |
| Multi-day trend charts on dashboard | Dashboard | Medium |

---

### 🔴 Not Started (no external dependency — design decision needed)

| Gap | Module | Notes |
|-----|--------|-------|
| Appointment booking (create/cancel/reschedule) | Appointments | Needs `appointment` table; currently schedule is queue-derived |
| Patient photo upload | Patient | Needs file storage decision (local vs S3) |
| Patient duplicate merge | Patient | Complex; needs UX design |
| Password reset email flow | Auth | Needs SMTP + reset token table |
| Workstation configuration page | Settings | `[WORKSTATION]` role exists but no page |
| Branch comparison dashboard | Dashboard | Multi-clinic scoping |
| Multi-branch cross-queue view | Queue | Session is single-clinic; needs multi-clinic session logic |
