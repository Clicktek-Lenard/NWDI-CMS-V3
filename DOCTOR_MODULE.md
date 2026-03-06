# Doctor / Medical Evaluation Module
## CMS — Clinical Queue Management System (BAESA)

**Version:** Legacy (Laravel 8.75 / PHP 7.3–8.0)
**Last Updated:** 2026-02-27
**Purpose:** Complete replication guide — logic, flows, database, and routes.

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Sub-Modules](#2-sub-modules)
3. [Process Flows](#3-process-flows)
4. [Status Code Lifecycle](#4-status-code-lifecycle)
5. [Database Schema](#5-database-schema)
6. [Controllers & Business Logic](#6-controllers--business-logic)
7. [Routes](#7-routes)
8. [Models](#8-models)
9. [Views / UI Structure](#9-views--ui-structure)
10. [Key Business Rules](#10-key-business-rules)
11. [Authentication & Authorization](#11-authentication--authorization)
12. [JSON Field Conventions](#12-json-field-conventions)
13. [Modern Stack Replication Guide](#13-modern-stack-replication-guide)
14. [Client Requirements — Doctor Queue Operational Model](#14-client-requirements--doctor-queue-operational-model)

---

## 1. Module Overview

The Doctor / Medical Evaluation Module handles everything that happens after a patient is registered and reaches the clinical stage. It spans:

- **Vital signs** capture by nurses before the doctor sees the patient
- **Doctor consultation** (SOAP notes)
- **Physical examination** (PE) with body-system findings and class designation
- **Medical evaluation** — per-item assessments with overall fitness class calculation (A/B/C/D)
- **Physician enrollment, approval, and schedule management**
- **Referring physician** creation and management

The module interacts with two primary databases:

| Database | Purpose |
|---|---|
| `CMS` | Queue, vitals, SOAP notes, PE reports, assessments |
| `Eros` | Master data — Patient, Physician, Company, ItemMaster |

---

## 2. Sub-Modules

| Sub-Module | Responsibility |
|---|---|
| **Vital Signs** | Nurses record pulse, BP, temperature, height/weight, vision before doctor evaluation |
| **Doctor Queue** | Doctor views patients ready for consultation (status 280) |
| **SOAP Drafts** | Doctor saves drafts before finalising consultation |
| **Physical Examination (PE)** | Detailed body-system findings form, produces a fitness class |
| **Medical Evaluation** | Per-item (lab/xray/ECG) assessment and recommendation after results are ready |
| **Completed Queue** | Doctor reviews/reverts finalized consultations |
| **Consultation History** | Read past SOAP records for a patient |
| **Physician Enrollment (Eros)** | Create/update/approve doctors in master data |
| **Physician Order** | Doctor adds/removes ordered tests for a patient |
| **PCP Assignment Modal** | Nurse assigns Primary Care Physician mid-flow |

---

## 3. Process Flows

### 3.1 Full Patient-to-Doctor Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        PATIENT ARRIVAL                           │
│                  (Queue created — Status 100)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VITAL SIGNS STATION                         │
│           Nurse opens /doctor/vitals  (status filter 230)        │
│                                                                  │
│  Records:                                                        │
│  • Chief Complaint                                               │
│  • PCP Assignment (select from approved PCP/SPL physicians)      │
│  • Pulse Rate, Respiratory Rate                                  │
│  • Blood Pressure (3 readings — systolic/diastolic)             │
│  • Temperature, Height, Weight, BMI (auto-calculated)            │
│  • Vision: Uncorrected OD/OS, Corrected OD/OS (far + near)      │
│  • Flags: With Contact Lens, With Eyeglass                       │
│                                                                  │
│  On Save:                                                        │
│  • INSERT/UPDATE VitalSign                                       │
│  • UPDATE AccessionNo.Status  230 → 280                         │
│  • UPDATE Transactions.Status 230 → 280                         │
└────────────────────────────┬────────────────────────────────────┘
                             │ Status becomes 280
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DOCTOR QUEUE                                  │
│           Doctor opens /doctor/queue  (status filter 280)        │
│                                                                  │
│  Doctor sees patient details:                                    │
│  • Patient demographics (from Eros.Patient)                      │
│  • Vital signs summary                                           │
│  • Lab / X-Ray / ECG result status                               │
│  • Past consultations (last 3 days)                              │
│  • Package items ordered                                         │
│                                                                  │
│  Doctor can:                                                     │
│  • Save DRAFT (SOAPTemp) — does NOT advance status               │
│  • Save FINAL SOAP — advances status                             │
│  • Add/remove physician orders (PhysicianOrder)                  │
│  • View past SOAP records                                        │
│                                                                  │
│  On Final Save:                                                  │
│  • COPY SOAPTemp → SOAP  (or direct INSERT if no draft)          │
│  • UPDATE AccessionNo.Status  280 → 500                         │
│  • UPDATE Transactions.Status 280 → 500                         │
└────────────────────────────┬────────────────────────────────────┘
                             │ Status becomes 500
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│             PHYSICAL EXAMINATION (PE)  [if applicable]           │
│                Doctor opens /doctor/pe/{id}                      │
│                                                                  │
│  Records 40+ body-system findings:                               │
│  Medical History, Social History, OB-GYN, Family History         │
│  Physical Exam per system (Skin, Head, Eyes, Ears, Nose,         │
│  Throat, Neck, Chest, Lungs, Heart, Abdomen, Extremities,       │
│  Neurological, Genitals, Anus/Rectum)                           │
│                                                                  │
│  On Save:                                                        │
│  • INSERT/UPDATE PhysicalExaminationReport                       │
│  • UPDATE VitalSign (latest vitals synced)                       │
│  • UPDATE AccessionNo.Status  → 500                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               MEDICAL EVALUATION  [after results ready]          │
│            Doctor opens /doctor/evaluation                       │
│                                                                  │
│  Flow:                                                           │
│  1. Select Company                                               │
│  2. Select Patient from company's queues                         │
│  3. Per item (lab, xray, ECG) enter:                            │
│     • Findings (array)                                           │
│     • Assessment (array)                                         │
│     • Recommendation (array)                                     │
│     • Class (A / B / C / D / Pending)                           │
│  4. System calculates OVERALL CLASS:                             │
│     Priority: Pending > D > C > B > A                            │
│  5. UPDATE PhysicalExaminationReport.Class                       │
│  6. UPDATE AccessionNo / Transactions → 630 (Evaluated)         │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 SOAP Draft Flow

```
Doctor writes SOAP → clicks "Save Draft"
         │
         ▼
DoctorTempController@store
         │
         ├─ SOAP exists? → copy SOAP to SOAPTemp → delete SOAP
         ├─ SOAPTemp exists? → UPDATE SOAPTemp
         └─ Neither? → INSERT SOAPTemp

Doctor clicks "Finalize"
         │
         ▼
DoctorController@update
         │
         └─ INSERT SOAP from SOAPTemp data → UPDATE statuses → done
```

### 3.3 Physician Enrollment Flow

```
Admin fills enrollment form (/cmsphysician/physician/create)
         │
         ▼
PhysicianController@store
• Normalize PRC number (strip leading zeros)
• Check for duplicate PRCNo
• Generate ErosCode = 3 initials of name + MAX(ErosCode)+1
• Store schedule as JSON arrays
• SubGroup = 'SPL' if specialist, 'PCP' if primary care
• Status = 'For Approval'
         │
         ▼
Approver reviews list → approves or declines
         │
         ├─ Approve: Status = 'Approved'
         │           ApproveBy = current user
         │           ApprovalLogs cleared
         │
         └─ Decline: Status = 'Disapproved'
                     DeclineReason recorded

Any update to Physician → audit logged to Audit.ErosPhysicianInfo
```

### 3.4 Referring Physician (RP) Creation

```
Queue station registers outside/referring physician
         │
         ▼
PhysicianTableController@insertPhysician
• Normalize PRC
• Check duplicate
• Generate ErosCode
• SubGroup = 'RP'
• Status = 'RP - For Approval'
• Handle base64 image → save PNG to /uploads/PhysicianPrescription/
```

---

## 4. Status Code Lifecycle

| Code | Meaning | Triggered By |
|---|---|---|
| `100` | Initial — Queue created | Registration |
| `230` | Waiting for Vital Signs | Routed to nurse station |
| `280` | Vital Signs done — Ready for Doctor | VitalsController@update |
| `500` | Doctor Consultation completed | DoctorController@update |
| `500` | Physical Exam completed | PEController@update |
| `630` | Medical Evaluation completed | MedicalEvaluationController@update |
| `888` | Waived item | Special routing logic — auto-assessment inserted |

**Reversal:**
- Doctor can revert `500 → 280` via `DoctorsCompleteQueueController@update` if re-evaluation is needed.

### 4.1 CMS v3 Queue Status Values

The Next.js v3 stack tracks clinical status via the `consultation_notes.status` column (new CMS v3 table). The real `queue.Status` stores the legacy numeric codes.

| Status | Meaning | Badge color |
|--------|---------|-------------|
| `WAITING` | Patient registered, awaiting evaluation | Amber |
| `IN_PROGRESS` | Doctor has opened the evaluation drawer | Blue |
| `COMPLETED` | Consultation fully completed | Emerald |
| `CANCELLED` | Visit cancelled or no-show | Red |

### 4.2 Allowed Status Transitions

Enforced server-side by `PATCH /api/clinical/[queueId]/status`:

| From | Can transition to |
|------|-------------------|
| `WAITING` | `IN_PROGRESS`, `CANCELLED` |
| `IN_PROGRESS` | `WAITING`, `COMPLETED`, `CANCELLED` |
| `COMPLETED` | `IN_PROGRESS` |
| `CANCELLED` | `WAITING` |

### 4.3 Per-Patient Queue Actions (CMS v3)

Each patient row in the Clinical Queue page exposes two controls:

**Primary button** — opens the evaluation drawer:

| Patient status | Button label | Behavior |
|----------------|-------------|-----------|
| `WAITING` | **Evaluate** | Opens drawer; sets status → `IN_PROGRESS` on first save |
| `IN_PROGRESS` | **Continue** | Reopens drawer with existing data |
| `COMPLETED` | **View** | Opens drawer in read-only review mode |
| `CANCELLED` | _(disabled)_ | No action |

**"⋮" dropdown menu** — direct status changes without opening drawer:

| Patient status | Available actions |
|----------------|------------------|
| `WAITING` | Start Evaluation → `IN_PROGRESS` · Cancel → `CANCELLED` |
| `IN_PROGRESS` | Mark Complete → `COMPLETED` · Revert to Waiting → `WAITING` · Cancel → `CANCELLED` |
| `COMPLETED` | Revert to In Progress → `IN_PROGRESS` |
| `CANCELLED` | Restore to Waiting → `WAITING` |

**API endpoint:**
```
PATCH /api/clinical/[queueId]/status
Body: { "status": "IN_PROGRESS" }
```

---

## 5. Database Schema

### 5.0 CMS V2 — `queue` Table (Real DB Table)

Primary queue table. Every patient visit creates one row here. All clinical tables reference this via `IdQueue` (bigint FK).

> **Note:** Table name is `queue` (lowercase) — MySQL is case-sensitive on Linux.

| Column | Type | Notes |
|--------|------|-------|
| `Id` | `bigint` AUTO_INCREMENT | Primary key |
| `IdBU` | `varchar(10)` | Business unit/clinic code (e.g. `CEN`, `SMB`) |
| `Code` | `varchar(20)` | Queue code (daily reference) |
| `Date` | `date` | Queue date |
| `DateTime` | `datetime` | Full timestamp |
| `IdPatient` | `bigint` | FK → `patient.Id` |
| `QFullName` | `varchar(200)` | Patient full name (snapshot) |
| `QGender` | `varchar(10)` | |
| `QDOB` | `date` | Date of birth snapshot |
| `AgePatient` | `int` | Age at time of visit |
| `Status` | `smallint` | Numeric status code — see lifecycle table |
| `AccessionNo` | `varchar(20)` | Accession number |
| `Notes` | `longtext` | |
| `InputBy` | `varchar(30)` | Created by username |

**Status codes (numeric):**

| Code | Meaning |
|------|---------|
| `100` | Queue created — awaiting routing |
| `230` | Waiting for Vital Signs |
| `280` | Vital signs done — Ready for Doctor |
| `500` | Doctor consultation completed |
| `630` | Medical evaluation completed |

**Prisma model** (`prisma/schema.prisma`):
```prisma
model Queue {
  Id        BigInt    @id @default(autoincrement())
  IdBU      String?   @db.VarChar(10)
  Code      String    @db.VarChar(20)
  Date      DateTime  @db.Date
  DateTime  DateTime
  IdPatient BigInt
  QFullName String?   @db.VarChar(200)
  QGender   String?   @db.VarChar(10)
  QDOB      DateTime? @db.Date
  AgePatient Int?
  Status    Int       @db.SmallInt
  AccessionNo String? @db.VarChar(20)
  Notes     String?   @db.LongText
  InputBy   String    @db.VarChar(30)

  @@index([Status])
  @@index([IdBU])
  @@map("queue")
}
```
---

### 5.0.2 CMS v3 — `physical_examinations` Table

Physical examination findings per queue entry. One row per patient visit.

| # | Column | Type | Null | Default | Notes |
|---|--------|------|------|---------|-------|
| 1 | `id` | `int(11)` AUTO_INCREMENT | No | — | Primary key |
| 2 | `queue_id` | `int(11)` | No | — | FK → `queue.Id` (Index) |
| 3 | `patient_id` | `varchar(50)` | No | — | Patient identifier (Index) |
| 4 | `fitness_class` | `varchar(10)` | Yes | NULL | Overall class: `A / B / C / D / Pending` |
| 5 | `checked_by` | `varchar(255)` | Yes | NULL | Doctor/examiner name |
| **Medical History** ||||
| 6 | `liver_gallbladder` | `tinyint(4)` | No | `0` | 1 = positive history |
| 7 | `heart_disease` | `tinyint(4)` | No | `0` | |
| 8 | `asthma_allergy` | `tinyint(4)` | No | `0` | |
| 9 | `tuberculosis` | `tinyint(4)` | No | `0` | |
| 10 | `ent_disorder` | `tinyint(4)` | No | `0` | Ear/Nose/Throat |
| 11 | `eye_disorder` | `tinyint(4)` | No | `0` | |
| 12 | `diabetes_mellitus` | `tinyint(4)` | No | `0` | |
| 13 | `chronic_headache` | `tinyint(4)` | No | `0` | |
| 14 | `hypertension` | `tinyint(4)` | No | `0` | |
| 15 | `kidney_disease` | `tinyint(4)` | No | `0` | |
| 16 | `cancer` | `tinyint(4)` | No | `0` | |
| 17 | `std` | `tinyint(4)` | No | `0` | Sexually transmitted disease |
| 18 | `past_med_others` | `text` | Yes | NULL | Free-text additional history |
| **Social History** ||||
| 19 | `present_smoker` | `tinyint(4)` | No | `0` | |
| 20 | `smoker_sticks_per_day` | `varchar(10)` | Yes | NULL | Shown when `present_smoker = 1` |
| 21 | `smoker_years` | `varchar(10)` | Yes | NULL | |
| 22 | `previous_smoker` | `tinyint(4)` | No | `0` | |
| 23 | `prev_smoker_sticks` | `varchar(10)` | Yes | NULL | |
| 24 | `prev_smoker_years` | `varchar(10)` | Yes | NULL | |
| 25 | `alcohol_drinker` | `tinyint(4)` | No | `0` | |
| 26 | `prev_alcohol_drinker` | `tinyint(4)` | No | `0` | |
| 27 | `social_others` | `text` | Yes | NULL | |
| **OB-GYN** ||||
| 28 | `menarche` | `varchar(10)` | Yes | NULL | Age at first menstruation |
| 29 | `menopausal_age` | `varchar(10)` | Yes | NULL | |
| 30 | `last_menstruation` | `datetime(3)` | Yes | NULL | Date of last period |
| 31 | `menstrual_period` | `varchar(50)` | Yes | NULL | |
| 32 | `obgyn_others` | `text` | Yes | NULL | |
| **Family History** ||||
| 33 | `fam_asthma` | `tinyint(4)` | No | `0` | |
| 34 | `fam_diabetes` | `tinyint(4)` | No | `0` | |
| 35 | `fam_goiter` | `tinyint(4)` | No | `0` | |
| 36 | `fam_ptb` | `tinyint(4)` | No | `0` | Pulmonary tuberculosis |
| 37 | `fam_heart_disease` | `tinyint(4)` | No | `0` | |
| 38 | `fam_hypertension` | `tinyint(4)` | No | `0` | |
| 39 | `fam_kidney` | `tinyint(4)` | No | `0` | |
| 40 | `fam_others` | `text` | Yes | NULL | |
| **Physical Exam Findings (per body system)** ||||
| 41 | `skin` | `text` | Yes | NULL | |
| 42 | `head_scalp` | `text` | Yes | NULL | |
| 43 | `eyes` | `text` | Yes | NULL | |
| 44 | `ears_hearing` | `text` | Yes | NULL | |
| 45 | `nose_sinuses` | `text` | Yes | NULL | |
| 46 | `mouth_throat` | `text` | Yes | NULL | |
| 47 | `neck_thyroid` | `text` | Yes | NULL | |
| 48 | `chest_breast` | `text` | Yes | NULL | |
| 49 | `lungs` | `text` | Yes | NULL | |
| 50 | `heart` | `text` | Yes | NULL | |
| 51 | `abdomen` | `text` | Yes | NULL | |
| 52 | `back_flanks` | `text` | Yes | NULL | |
| 53 | `extremities` | `text` | Yes | NULL | |
| 54 | `neurological` | `text` | Yes | NULL | |
| 55 | `genitals_urinary` | `text` | Yes | NULL | |
| 56 | `anus_rectum` | `text` | Yes | NULL | |
| **Audit** ||||
| 57 | `status` | `varchar(20)` | No | `PENDING` | `PENDING / COMPLETED` |
| 58 | `recorded_by` | `int(11)` | Yes | NULL | FK → `users.id` |
| 59 | `created_at` | `datetime(3)` | No | `current_timestamp(3)` | |
| 60 | `updated_at` | `datetime(3)` | No | — | Auto-updated |

**Indexes:** `queue_id`, `patient_id`

**Prisma model** (`src/generated/prisma/client`):
```prisma
model PhysicalExamination {
  id                   Int       @id @default(autoincrement())
  queue_id             Int       @unique
  patient_id           String    @db.VarChar(50)
  fitness_class        String?   @db.VarChar(10)
  checked_by           String?   @db.VarChar(255)
  liver_gallbladder    Int       @default(0) @db.TinyInt
  heart_disease        Int       @default(0) @db.TinyInt
  asthma_allergy       Int       @default(0) @db.TinyInt
  tuberculosis         Int       @default(0) @db.TinyInt
  ent_disorder         Int       @default(0) @db.TinyInt
  eye_disorder         Int       @default(0) @db.TinyInt
  diabetes_mellitus    Int       @default(0) @db.TinyInt
  chronic_headache     Int       @default(0) @db.TinyInt
  hypertension         Int       @default(0) @db.TinyInt
  kidney_disease       Int       @default(0) @db.TinyInt
  cancer               Int       @default(0) @db.TinyInt
  std                  Int       @default(0) @db.TinyInt
  past_med_others      String?   @db.Text
  present_smoker       Int       @default(0) @db.TinyInt
  smoker_sticks_per_day String?  @db.VarChar(10)
  smoker_years         String?   @db.VarChar(10)
  previous_smoker      Int       @default(0) @db.TinyInt
  prev_smoker_sticks   String?   @db.VarChar(10)
  prev_smoker_years    String?   @db.VarChar(10)
  alcohol_drinker      Int       @default(0) @db.TinyInt
  prev_alcohol_drinker Int       @default(0) @db.TinyInt
  social_others        String?   @db.Text
  menarche             String?   @db.VarChar(10)
  menopausal_age       String?   @db.VarChar(10)
  last_menstruation    DateTime? @db.DateTime(3)
  menstrual_period     String?   @db.VarChar(50)
  obgyn_others         String?   @db.Text
  fam_asthma           Int       @default(0) @db.TinyInt
  fam_diabetes         Int       @default(0) @db.TinyInt
  fam_goiter           Int       @default(0) @db.TinyInt
  fam_ptb              Int       @default(0) @db.TinyInt
  fam_heart_disease    Int       @default(0) @db.TinyInt
  fam_hypertension     Int       @default(0) @db.TinyInt
  fam_kidney           Int       @default(0) @db.TinyInt
  fam_others           String?   @db.Text
  skin                 String?   @db.Text
  head_scalp           String?   @db.Text
  eyes                 String?   @db.Text
  ears_hearing         String?   @db.Text
  nose_sinuses         String?   @db.Text
  mouth_throat         String?   @db.Text
  neck_thyroid         String?   @db.Text
  chest_breast         String?   @db.Text
  lungs                String?   @db.Text
  heart                String?   @db.Text
  abdomen              String?   @db.Text
  back_flanks          String?   @db.Text
  extremities          String?   @db.Text
  neurological         String?   @db.Text
  genitals_urinary     String?   @db.Text
  anus_rectum          String?   @db.Text
  status               String    @default("PENDING") @db.VarChar(20)
  recorded_by          Int?
  created_at           DateTime  @default(now()) @db.DateTime(3)
  updated_at           DateTime  @updatedAt @db.DateTime(3)

  @@index([patient_id])
  @@map("physical_examinations")
}
```

---

### 5.0.3 CMS V2 — Real Existing Tables

> All tables below exist in the production `cms_v2` database. They are **NOT** created by `prisma db push` — they were present before CMS v3.
> CMS v3 clinical tables (`consultation_notes`, `physical_examinations`, `medical_evaluations`, `vitalsign`) are **new** and are created by `prisma db push`.

#### `physician` Table (Prisma: `Physician`)

Physician/doctor master data. In the same `cms_v2` database (previously documented as Eros DB).

| Column | Type | Notes |
|--------|------|-------|
| `Id` | `bigint` AUTO_INCREMENT | Primary key |
| `Code` | `varchar(30)` | Physician code |
| `FullName` | `varchar(150)` | Display name |
| `DisplayName` | `varchar(150)` | Alternative display name |
| `PrintName` | `varchar(150)` | Name for printing on reports |
| `LastName` | `varchar(80)` | |
| `FirstName` | `varchar(150)` | |
| `MiddleName` | `varchar(80)` | |
| `Suffix` | `varchar(30)` | |
| `DOB` | `date` | Date of birth |
| `Degree` | `varchar(150)` | Medical degree (e.g. MD) |
| `PRCNo` | `varchar(80)` | PRC license number |
| `PRCValidity` | `date` | License expiry |
| `Email` | `varchar(200)` | |
| `Mobile` | `varchar(80)` | |
| `NWDBranch` | `varchar(30)` | Assigned branch |
| `Schedule` | `varchar(500)` | Schedule info |
| `TimeStart` | `varchar(30)` | |
| `TimeEnd` | `varchar(30)` | |
| `Status` | `varchar(30)` | `Approved` / `Active` / `For Approval` / `Disapproved` |
| `SubGroup` | `varchar(10)` | `PCP` / `SPL` / `RP` |
| `ErosCode` | `varchar(30)` | Legacy Eros code |

**CMS v3 physicians API** (`GET /api/clinical/physicians`) queries this table directly using raw SQL filtering by Status IN ('Approved', 'Active', 'A').

---

#### `vitals` Table (Prisma: `CmsVitals`) — Medication/LastDose

> **Different from vital signs** — this table stores medication intake notes taken at the nursing station. Vital signs measurements (BP, HR, temperature, weight, etc.) are stored in the **`vitalsign`** table.

| Column | Type | Notes |
|--------|------|-------|
| `Id` | `int` AUTO_INCREMENT | Primary key |
| `IdQueue` | `bigint` | FK → `queue.Id` |
| `Medication` | `varchar(500)` | Current medications |
| `LastDose` | `varchar(500)` | Last dose taken |
| `LastPeriod` | `varchar(500)` | Last menstrual period (OB-GYN) |
| `InputBy` | `varchar(30)` | Recorded by username |
| `InputDateTime` | `datetime` | When recorded |

---

#### `vitalsign` Table (Prisma: `Vitals`) — Vital Signs Measurements

CMS v3 stores vital signs here (BP, HR, temperature, weight, height, vision, etc.). Table is in the `cms_v2` database.

See Prisma `Vitals` model in `prisma/schema.prisma` (`@@map("vitalsign")`) for full field list.

#### `users` Table (Prisma: `User`)

The primary users/auth table. The CMS v3 Prisma `User` model maps directly to this table.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | `int unsigned` AUTO_INCREMENT | No | — | PK |
| `email` | `varchar(191)` | Yes | NULL | Login email |
| `password` | `varchar(191)` | No | — | Hashed password |
| `permissions` | `text` | Yes | NULL | JSON permissions blob (legacy Snipe-IT) |
| `activated` | `tinyint(1)` | No | `0` | `1` = active account |
| `created_by` | `int` | Yes | NULL | FK to `users.id` who created this user |
| `activation_code` | `varchar(191)` | Yes | NULL | Email activation token |
| `activated_at` | `timestamp` | Yes | NULL | When account was activated |
| `last_login` | `timestamp` | Yes | NULL | Last successful login |
| `persist_code` | `varchar(191)` | Yes | NULL | Remember-me token |
| `reset_password_code` | `varchar(191)` | Yes | NULL | Password reset token |
| `first_name` | `varchar(191)` | Yes | NULL | |
| `last_name` | `varchar(191)` | Yes | NULL | |
| `created_at` | `timestamp` | Yes | NULL | |
| `updated_at` | `timestamp` | Yes | NULL | |
| `deleted_at` | `timestamp` | Yes | NULL | Soft-delete |
| `website` | `varchar(191)` | Yes | NULL | |
| `country` | `varchar(191)` | Yes | NULL | |
| `gravatar` | `varchar(191)` | Yes | NULL | |
| `location_id` | `int` | Yes | NULL | |
| `phone` | `varchar(191)` | Yes | NULL | |
| `jobtitle` | `varchar(191)` | Yes | NULL | |
| `manager_id` | `int` | Yes | NULL | |
| `employee_num` | `text` | Yes | NULL | |
| `avatar` | `varchar(191)` | Yes | NULL | |
| `username` | `varchar(191)` | Yes | NULL | UNIQUE — used for LDAP login |
| `notes` | `text` | Yes | NULL | |
| `company_id` | `int unsigned` | Yes | NULL | |
| `remember_token` | `text` | Yes | NULL | |
| `ldap_import` | `tinyint(1)` | No | `0` | `1` = imported from LDAP |
| `locale` | `varchar(10)` | Yes | `en` | |
| `show_in_list` | `tinyint(1)` | No | `1` | |
| `two_factor_secret` | `varchar(32)` | Yes | NULL | 2FA TOTP secret |
| `two_factor_enrolled` | `tinyint(1)` | No | `0` | |
| `two_factor_optin` | `tinyint(1)` | No | `0` | |
| `department_id` | `int` | Yes | NULL | |
| `address` | `varchar(191)` | Yes | NULL | |
| `city` | `varchar(191)` | Yes | NULL | |
| `state` | `varchar(3)` | Yes | NULL | |
| `zip` | `varchar(10)` | Yes | NULL | |
| `skin` | `varchar(191)` | Yes | NULL | UI theme preference |
| `remote` | `tinyint(1)` | Yes | `0` | |
| `status` | `varchar(15)` | No | `ACTIVE` | |
| `role` | `varchar(2500)` | Yes | NULL | **CMS v3 role string** (e.g. `admin`, `nurse`) |
| `department` | `varchar(100)` | Yes | NULL | **CMS v3 department string** |
| `AccessMapId` | `varchar(30)` | No | `0` | **Links to `Eros.Physician.EmpId`** — critical for doctor identity |
| `ldap_server_status` | `varchar(255)` | Yes | NULL | LDAP sync status |

**Key fields for CMS v3:**
- `role` — used by the RBAC system to determine module/tab access
- `AccessMapId` — maps the user to a doctor in the Eros database (set when enrolling a physician user)
- `username` — used as the LDAP login identifier

---

#### `patient` Table (Prisma: `Patient`)

Master patient data. Referenced by `queue.IdPatient` (bigint FK via `patient.Id`).

| Column | Type | Notes |
|--------|------|-------|
| `Id` | `bigint` AUTO_INCREMENT | PK |
| `Code` | `varchar(30)` UNIQUE | Patient identifier (used in queue) |
| `FullName` | `varchar(200)` | Display name |
| `LastName` | `varchar(80)` | |
| `FirstName` | `varchar(150)` | |
| `MiddleName` | `varchar(80)` | |
| `Suffix` / `Prefix` | `varchar(10)` | |
| `Gender` | `varchar(10)` | |
| `DOB` | `date` | Date of birth |
| `Email` | `varchar(5000)` | |
| `ContactNo` | `varchar(80)` | |
| `Moblie` | `varchar(255)` | (sic — legacy typo) |
| `PhilHealth` | `varchar(255)` | |
| `SeniorId` / `PWD` | `varchar` | Senior/PWD identifiers |
| `Status` | `varchar(80)` | |
| `IsActive` | `int` | `1` = active |
| `EmployeeId` | `varchar(15)` | Links to company employee |
| `InputDate` / `InputBy` | `date` / `varchar` | Audit |
| `UploadDateTime` | `timestamp` | Auto-set on insert |

---

#### `department` Table (Prisma: `Department`)

| Column | Type | Notes |
|--------|------|-------|
| `Id` | `int` AUTO_INCREMENT | PK |
| `Code` | `varchar(30)` | Department code |
| `Name` | `varchar(80)` | Display name |
| `Status` | `varchar(10)` | `Active` / `Inactive` |

---

#### `businessunits` Table (Prisma: `BusinessUnit`)

Clinic/branch master data. Each business unit maps to a physical clinic location.

| Column | Type | Notes |
|--------|------|-------|
| `Id` | `smallint` AUTO_INCREMENT | PK |
| `Code` | `varchar(5)` UNIQUE | Clinic code (e.g. `CEN`, `SMB`) — matches `clinic_code` in queues |
| `Description` | `varchar(50)` | Clinic name |
| `SDCode` | `int` | SD code |
| `IPs` / `IPs2` | `varchar` | IP address(es) |
| `GatewayIP` | `varchar(20)` | |
| `Status` | `enum('0','1')` | `1` = active |
| `StartDate` | `date` | |
| `DBServerId` | `varchar(500)` | Database server identifier |
| `Address` | `varchar(500)` | |
| `TIN` | `varchar(20)` | Tax ID |

---

#### `queuestatus` Table (Prisma: `QueueStatus`)

Legacy queue status lookup. The CMS v3 uses string constants instead but this table still exists.

| Column | Type | Notes |
|--------|------|-------|
| `Id` | `smallint` | PK (manual, not auto-increment) |
| `IdBU` | `smallint` | Business unit ID |
| `Name` | `varchar(30)` | Status label |
| `Status` | `enum('0','1')` | `1` = active |

---

#### `role` Table (Prisma: `Role`)

CMS v3 module/tab role definitions. Determines which LDAP roles have access to which modules.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `int` AUTO_INCREMENT | PK |
| `module` | `varchar(255)` | App module (e.g. `cms`) |
| `tab` | `varchar(255)` | Module tab (e.g. `clinical`) |
| `ldap_role` | `varchar(255)` | LDAP group/role name |
| `status` | `varchar(50)` | `Active` / `Inactive` |

---

#### Tables **Not** Mapped to Prisma (from cms_v2)

| Table | Reason |
|-------|--------|
| `cache` / `cache_locks` | Laravel cache driver tables — not used in CMS v3 |
| `sessions` | Laravel session storage — not used in CMS v3 |
| `jobs` / `job_batches` / `failed_jobs` | Laravel queue worker tables |
| `migrations` | Laravel migration tracking |
| `msg_queue` | Legacy message queue — not replicated |
| `users_from_cdb` | Legacy CDB user import mirror |
| `password_reset_tokens` | Laravel password reset |
| `settings` | Snipe-IT system settings (120+ columns) — not used in CMS v3 |

---

### 5.1 CMS V2 — Legacy Clinical Tables (Real DB)

> These tables exist in the `cms_v2` database and contain historical clinical data from the legacy CMS v2 application.
> The real table names are all **lowercase** on the Linux MySQL server.

#### `vitalsign` — Vital Signs Measurements

> CMS v3 stores vital signs in this table via Prisma model `Vitals` (`@@map("vitalsign")`).
> The legacy CMS v2 used column names like PulseRate, BloodPresure etc. CMS v3 uses snake_case equivalents.

```sql
-- Legacy column names (CMS v2 reference — CMS v3 uses new column names via Prisma)
CREATE TABLE VitalSign (
    Id                  VARCHAR(36)  NOT NULL PRIMARY KEY,  -- UUID (legacy)
    IdQueue             VARCHAR(36)  NOT NULL,
    QueueCode           VARCHAR(50),
    ChiefComplaint      TEXT,
    PcpId               VARCHAR(36),
    PcpName             VARCHAR(255),
    -- Pulse & Respiratory
    PulseRate           VARCHAR(10),
    RespiratoryRate     VARCHAR(10),
    -- Blood Pressure (3 readings)
    BloodPresure        VARCHAR(10),   -- systolic reading 1
    BloodPresureOver    VARCHAR(10),   -- diastolic reading 1
    BloodPresure2       VARCHAR(10),
    BloodPresureOver2   VARCHAR(10),
    BloodPresure3       VARCHAR(10),
    BloodPresureOver3   VARCHAR(10),
    -- Temperature & Anthropometrics
    Temperature         VARCHAR(10),
    Height              VARCHAR(10),
    Weight              VARCHAR(10),
    BMI                 VARCHAR(10),
    BMICategory         VARCHAR(50),
    -- Vision (Far)
    UcorrectedOD        VARCHAR(10),
    UcorrectedOS        VARCHAR(10),
    CorrectedOD         VARCHAR(10),
    CorrectedOS         VARCHAR(10),
    -- Vision (Near)
    UncorrectedNearOD   VARCHAR(10),
    UncorrectedNearOS   VARCHAR(10),
    CorrectedNearOD     VARCHAR(10),
    CorrectedNearOS     VARCHAR(10),
    -- Vision Flags
    Deficient           VARCHAR(10),
    ColorVision         VARCHAR(10),
    WithContactLens     TINYINT(1)  DEFAULT 0,
    WithEyeGlass        TINYINT(1)  DEFAULT 0,
    -- Audit
    InputBy             VARCHAR(100),
    InputDate           DATETIME,
    UpdateBy            VARCHAR(100),
    UpdateDate          DATETIME,
    FOREIGN KEY (IdQueue) REFERENCES Queue(Id)
);
```

#### `soap` — Doctor Consultation Notes

> Real table name: `soap` (lowercase). CMS v3 uses Prisma model `SoapRecord` (`@@map("soap")`) as a read-only mirror.
> The clinical evaluation route (`POST /api/clinical/[queueId]/evaluation`) writes to `consultation_notes` (new CMS v3 table).

```sql
-- Real table (read-only from CMS v2 legacy data)
CREATE TABLE soap (
    Id              bigint        NOT NULL AUTO_INCREMENT,
    QueueCode       VARCHAR(50),
    IdPatient       VARCHAR(36),
    IdDoctor        VARCHAR(36),
    NameDoctor      VARCHAR(255),
    Subjective      TEXT,
    Objective       TEXT,
    Assessment      TEXT,
    Plan            TEXT,
    Status          VARCHAR(10),
    InputBy         VARCHAR(100),
    InputDate       DATETIME,
    SystemDateTime  DATETIME
);
```

#### `SOAPTemp`  _(same structure as SOAP — used for drafts)_

```sql
CREATE TABLE SOAPTemp (
    Id              VARCHAR(36)   NOT NULL PRIMARY KEY,
    QueueCode       VARCHAR(50),
    IdPatient       VARCHAR(36),
    IdDoctor        VARCHAR(36),
    NameDoctor      VARCHAR(255),
    Subjective      TEXT,
    Objective       TEXT,
    Assessment      TEXT,
    Plan            TEXT,
    Status          VARCHAR(10),
    InputBy         VARCHAR(100),
    InputDate       DATETIME,
    SystemDateTime  DATETIME
);
```

#### `physicalexaminationreport` — Physical Examination Report

> Real table name: `physicalexaminationreport` (lowercase). Prisma model: `PhysExamReport` (`@@map("physicalexaminationreport")`).
> CMS v3 PE route writes to `physical_examinations` (new CMS v3 table). This table is the legacy v2 data source.

```sql
CREATE TABLE physicalexaminationreport (
    Id              bigint        NOT NULL AUTO_INCREMENT,
    IdQueue         bigint        NOT NULL,
    QueueCode       varchar(30),
    IdTransaction   bigint,
    IdPatient       bigint,
    -- Overall fitness class
    Class           varchar(25)   NOT NULL,  -- A / B / C / D / Pending
    Status          int,
    InputBy         varchar(100),
    InputDate       datetime,
    Evaluator       varchar(100),
    CheckedBy       varchar(100),
    PRIMARY KEY (Id),
    KEY idx_IdQueue (IdQueue)
    -- Medical History (Past)
    LiverGallbladderDisease     VARCHAR(10),
    Heartdisease                VARCHAR(10),
    AsthmaAllergy               VARCHAR(10),
    Tuberculosis                VARCHAR(10),
    EarNoseThroatDisorder       VARCHAR(10),
    EyeDisorder                 VARCHAR(10),
    DiabetesMellitus            VARCHAR(10),
    ChronicHeadacheMigraine     VARCHAR(10),
    Hypertension                VARCHAR(10),
    KidneyDisease               VARCHAR(10),
    Cancer                      VARCHAR(10),
    SexuallyTransmittedDisease  VARCHAR(10),
    PastMedOthers               TEXT,
    -- Social History
    PresentSmoker               TINYINT(1),
    PresentSmokerSticksPerDay   VARCHAR(10),
    PresentSmokerYears          VARCHAR(10),
    PreviousSmoker              TINYINT(1),
    PreviousSmokerSticksPerDay  VARCHAR(10),
    PreviousSmokerYears         VARCHAR(10),
    PresentAlcoholDrinker       TINYINT(1),
    PrevAlcoholDrinker          TINYINT(1),
    PersonalSocialOther         TEXT,
    -- OB-GYN
    Menarche                    VARCHAR(10),
    MenopausalAge               VARCHAR(10),
    FirstDayofLastMenstruation  DATE,
    PastMenstrualPeriod         VARCHAR(10),
    OBGYNEOthers                TEXT,
    -- Family History
    BronchialAsthma             TINYINT(1),
    FDiabetesMellitus           TINYINT(1),
    Goiter                      TINYINT(1),
    PTB                         TINYINT(1),
    FHeartDisease               TINYINT(1),
    FHypertension               TINYINT(1),
    KedneyDisease               TINYINT(1),
    FamilyOthers                TEXT,
    -- Physical Examination Findings (per body system)
    Skin                        TEXT,
    HeadScalp                   TEXT,
    Eyes                        TEXT,
    EarsHearing                 TEXT,
    NoseSinuses                 TEXT,
    MouthThroat                 TEXT,
    NeckThyroid                 TEXT,
    ChestBreastAxilla           TEXT,
    Lungs                       TEXT,
    Heart                       TEXT,
    Abdomen                     TEXT,
    BackFlanks                  TEXT,
    Extremities                 TEXT,
    Neurological                TEXT,
    GenitalsUrinary             TEXT,
    AnusRectum                  TEXT,
    -- Audit
    UpdateBy                    VARCHAR(100),
    UpdateDate                  DATETIME,
    FOREIGN KEY (IdQueue) REFERENCES Queue(Id)
);
```

#### `peassesandrec` — Per-Item Medical Evaluation Records

> Real table name: `peassesandrec` (lowercase). Prisma model: `PEAssessmentRecord` (`@@map("peassesandrec")`).
> CMS v3 medical evaluation route writes to `medical_evaluations` (new CMS v3 table) but reads this for legacy data.

```sql
CREATE TABLE peassesandrec (
    Id              int           NOT NULL AUTO_INCREMENT,
    IdQueue         int           NOT NULL,
    QueueCode       varchar(30),
    ItemCode        varchar(30),
    Findings        varchar(1000),
    Assessment      varchar(3000),
    Recommendation  longtext,
    Class           varchar(255),
    FinalClass      varchar(15),
    Evaluator       varchar(150),
    InputBy         varchar(150),
    DateAndTime     datetime,
    SystemDateTime  datetime,
    PRIMARY KEY (Id),
    KEY idx_IdQueue (IdQueue)
);
```

#### `PhysicianOrder`

```sql
CREATE TABLE PhysicianOrder (
    Id          VARCHAR(36)  NOT NULL PRIMARY KEY,
    IdQueueFrom VARCHAR(36),
    IdQueueTo   VARCHAR(36),
    IdPatient   VARCHAR(36),
    IdDoctor    VARCHAR(36),
    ItemCode    VARCHAR(50),
    DateOrder   DATE,
    Status      VARCHAR(10)  DEFAULT '1'
);
```

#### `AccessionNo`  _(referenced heavily — key status carrier)_

```sql
CREATE TABLE AccessionNo (
    Id                  VARCHAR(36)  NOT NULL PRIMARY KEY,
    IdQueue             VARCHAR(36),
    QueueCode           VARCHAR(50),
    ItemCode            VARCHAR(50),
    ItemDescription     VARCHAR(255),
    ItemGroup           VARCHAR(50),   -- e.g. 'CLINIC', 'LAB', 'XRAY'
    ItemSubGroup        VARCHAR(50),   -- e.g. 'INDUSTRIAL', 'CONSULTATION'
    Status              VARCHAR(10),
    IdDoctor            VARCHAR(36),
    IdTransaction       VARCHAR(36),
    InputBy             VARCHAR(100),
    InputDate           DATETIME
);
```

#### `Transactions`

```sql
CREATE TABLE Transactions (
    Id                  VARCHAR(36)   NOT NULL PRIMARY KEY,
    IdQueue             VARCHAR(36),
    IdDoctor            VARCHAR(36),
    NameDoctor          VARCHAR(255),
    CodeItemPrice       VARCHAR(50),
    DescriptionItemPrice VARCHAR(255),
    TransactionType     VARCHAR(50),
    PriceGroupItemPrice VARCHAR(50),
    IdItemPrice         VARCHAR(36),
    Status              VARCHAR(10),
    InputBy             VARCHAR(100),
    InputDate           DATETIME,
    UpdateBy            VARCHAR(100),
    UpdateDate          DATETIME,
    Date                DATE
);
```

---

### 5.2 CMS V2 — `physician` Table (Full Schema)

> The physician table is in the same `cms_v2` database (previously in a separate Eros DB).
> Prisma model: `Physician` with `@@map("physician")`.

```sql
CREATE TABLE `physician` (
  `Id`               bigint NOT NULL AUTO_INCREMENT,
  `Code`             varchar(30)  DEFAULT NULL,
  `FullName`         varchar(200) NOT NULL,
  `DisplayName`      varchar(255) DEFAULT '',
  `PrintName`        varchar(255) DEFAULT NULL,
  `LastName`         varchar(80)  DEFAULT '',
  `FirstName`        varchar(80)  DEFAULT '',
  `MiddleName`       varchar(50)  DEFAULT '',
  `Suffix`           varchar(30)  DEFAULT '',
  `DOB`              date         DEFAULT NULL,
  `Degree`           varchar(80)  DEFAULT NULL,
  `PRCNo`            varchar(20)  DEFAULT '',
  `PRCValidity`      date         DEFAULT NULL,
  `Email`            varchar(50)  DEFAULT NULL,
  `Mobile`           varchar(50)  DEFAULT NULL,
  `Prescription_Link` varchar(100) NOT NULL DEFAULT 'no-image.jpg',
  `NWDBranch`        longtext     NOT NULL,
  `Schedule`         longtext     NOT NULL,
  `TimeStart`        longtext     NOT NULL,
  `TimeEnd`          longtext     NOT NULL,
  `SubGroup`         varchar(10)  DEFAULT NULL,   -- 'PCP' | 'SPL' | 'RP'
  `Status`           varchar(30)  DEFAULT NULL,   -- 'Approved' | 'Active' | 'For Approval' | 'Disapproved'
  `ErosCode`         varchar(30)  DEFAULT NULL,
    -- JSON schedule fields
    NWDBranch           JSON,
    Schedule            JSON,   -- array of days per clinic
    TimeStart           JSON,
    TimeEnd             JSON,
    ByAppointment       JSON,
    FirstEngagement     JSON,
    LastEngagement      JSON,
    ClinicScheduledBy   JSON,
    -- Flags
    PCP                 TINYINT(1)  DEFAULT 0,
    Specialist          TINYINT(1)  DEFAULT 0,
    RP                  TINYINT(1)  DEFAULT 0,
    Regular             TINYINT(1)  DEFAULT 0,
    Reliever            TINYINT(1)  DEFAULT 0,
    Visiting            TINYINT(1)  DEFAULT 0,
    Referring           TINYINT(1)  DEFAULT 0,
    -- Documents (file links)
    ApplicationLetter       VARCHAR(255),
    CurriculumVitae         VARCHAR(255),
    Diploma                 VARCHAR(255),
    PRCId                   VARCHAR(255),
    ResidencyCertificate    VARCHAR(255),
    DiplomateCertificate    VARCHAR(255),
    PhilHealth              VARCHAR(255),
    PTR                     VARCHAR(255),
    BIR                     VARCHAR(255),
    MOA                     VARCHAR(255),
    Prescription_Link       VARCHAR(255),  -- stored PNG path
    -- Approval
    ApprovalLogs            JSON,
    DeclineReason           TEXT,
    ApproveBy               VARCHAR(100),
    -- Resignation
    ResignDoctor            TINYINT(1)  DEFAULT 0,
    -- Multi-tenant
    CebuStatus              VARCHAR(20),
    SMBStatus               VARCHAR(20),
    -- Audit
    EmpId                   VARCHAR(100),  -- maps to LDAP user
    UpdateBy                VARCHAR(100),
    UpdateDate              DATETIME,
    InputBy                 VARCHAR(100),
    InputDate               DATETIME,
    SystemUpdateTime        DATETIME
);
```

### 5.3 Audit Database

#### `ErosPhysicianInfo`

```sql
CREATE TABLE ErosPhysicianInfo (
    Id              VARCHAR(36)  NOT NULL PRIMARY KEY,
    IdPhysician     VARCHAR(36),
    Logs            JSON,   -- { oldVal: {}, newVal: {} }
    SystemDateTime  DATETIME
);
```

---

## 6. Controllers & Business Logic

### 6.1 `VitalsController`

**File:** `app/Http/Controllers/cms/doctors/VitalsController.php`

**`index()`**
- Query: `Queue JOIN AccessionNo` WHERE `ItemGroup='CLINIC'` AND `ItemSubGroup IN ('INDUSTRIAL','CONSULTATION')` AND `AccessionNo.Status=230`
- Groups by `Queue.Id` to avoid duplicates
- Returns view with today's list (last 3 days window)

**`edit($id)`**
- Loads Queue with patient info from `Eros.Patient`
- Loads available PCP physicians: `Status='Approved'`, `SubGroup IN ('PCP','SPL')`
- Shows previous transactions for the patient

**`update($id, Request $request)`**
```
1. Validate inputs
2. $vitalSign = VitalSign::updateOrCreate(['IdQueue' => $id], [...fields...])
3. AccessionNo::where('IdQueue', $id)->update(['Status' => 280])
4. Transactions::where('IdQueue', $id)->update(['Status' => 280])
5. Redirect to vitals list
```

---

### 6.2 `DoctorController`

**File:** `app/Http/Controllers/cms/doctors/DoctorController.php`

**`index()`**
- Query: `Queue JOIN AccessionNo JOIN VitalSign` WHERE `AccessionNo.Status=280` AND `ItemSubGroup IN ('INDUSTRIAL','CONSULTATION')` AND `PcpId = Auth::user()->physicianId`
- Shows last 3 days

**`edit($id)`**
- Loads patient info, vital signs, SOAP/SOAPTemp data, past consultations, PE data, results
- Parses GP field for vision values using:
  ```php
  preg_match('/(\d)(\d)\((\d+-\d+-\d+-\d+)\)/', $GP, $matches);
  // $matches[1] = G value
  // $matches[2] = P value
  // $matches[3] = visual acuity range
  ```
- Returns `cms.doctor.doctorEdit` view

**`update($id, Request $request)`**
```
1. DB::beginTransaction()
2. Insert SOAP from SOAPTemp data:
   SOAP::create([
       'QueueCode'    => $queue->Code,
       'IdPatient'    => $queue->IdPatient,
       'IdDoctor'     => Auth::user()->physicianId,
       'NameDoctor'   => Auth::user()->fullName,
       'Subjective'   => $request->Subjective,
       'Objective'    => $request->Objective,
       'Assessment'   => $request->Assessment,
       'Plan'         => $request->Plan,
   ])
3. AccessionNo::where('IdQueue', $id)->update(['Status' => 500])
4. Transactions::where('IdQueue', $id)->update(['Status' => 500])
5. DB::commit()
6. Redirect
```

---

### 6.3 `DoctorTempController`

**File:** `app/Http/Controllers/cms/doctors/DoctorTempController.php`

**`store(Request $request)`**
```
$queueCode = $request->QueueCode;

if (SOAP::where('QueueCode', $queueCode)->exists()) {
    // Copy to temp then delete main
    $soap = SOAP::where('QueueCode', $queueCode)->first();
    SOAPTemp::updateOrCreate(['QueueCode' => $queueCode], $soap->toArray());
    SOAP::where('QueueCode', $queueCode)->delete();

} elseif (SOAPTemp::where('QueueCode', $queueCode)->exists()) {
    // Just update the temp
    SOAPTemp::where('QueueCode', $queueCode)->update([...partial fields...]);

} else {
    // First save
    SOAPTemp::create([...all fields...]);
}

return response()->json(['success' => true]);
```

---

### 6.4 `PEController`

**File:** `app/Http/Controllers/cms/doctors/PEController.php`

**`edit($id)`**
- Loads `PhysicalExaminationReport` by `IdQueue`
- Parses GP field for vision extract
- Returns `cms.doctor.PEEdit` view

**`update($id, Request $request)`**
```
1. PhysicalExaminationReport::updateOrCreate(
       ['IdQueue' => $id],
       [...all 40+ fields from request...]
   )
2. VitalSign::where('IdQueue', $id)->update([...latest vitals...])
3. AccessionNo::where('IdQueue', $id)->update(['Status' => 500])
4. DB::commit()
```

---

### 6.5 `MedicalEvaluationController`

**File:** `app/Http/Controllers/cms/doctors/MedicalEvaluationController.php`

**`index()`**
- Queries `Eros.Company` WHERE `ResultUploading='Yes'`
- Returns company list for doctor to select

**`edit($id)`**
- `$id` = Queue.Id
- `$itemCode` = query string param `?ItemCode=xxx`
- Loads `PEAssesAndRec` records, decodes JSON arrays
- For WAIVED items (AccessionNo.Status=888): auto-inserts a "WAIVED" assessment
- Returns assessment/recommendation/findings/class arrays to view

**`update($id, Request $request)` — Overall Class Calculation**
```php
// Collect all item classes
$classes = PEAssesAndRec::where('IdQueue', $id)
    ->get()
    ->pluck('Class')  // JSON arrays
    ->flatten();

$overallClass = 'A';  // start optimistic

foreach ($classes as $class) {
    if ($class === 'Pending') { $overallClass = 'Pending'; break; }
    if ($class === 'D')       { $overallClass = 'D'; }
    if ($class === 'C' && $overallClass !== 'D') { $overallClass = 'C'; }
    if ($class === 'B' && !in_array($overallClass, ['C','D'])) { $overallClass = 'B'; }
}

PhysicalExaminationReport::where('IdQueue', $id)
    ->update(['Class' => $overallClass]);

// Mark evaluation complete
AccessionNo::where('IdQueue', $id)->update(['Status' => 630]);
Transactions::where('IdQueue', $id)->update(['Status' => 630]);
DB::commit();
```

---

### 6.6 `MedicalEvaluationModalController`

**File:** `app/Http/Controllers/cms/doctors/doctorModals/MedicalEvaluationModalController.php`

**`update($id, Request $request)`**
```php
// Arrays come as: Assessment1, Assessment2, ...
// Collect them into a JSON array
$assessments      = [];
$recommendations  = [];
$findings         = [];
$classes          = [];

$i = 1;
while ($request->has("Assessment{$i}")) {
    $assessments[]     = $request->{"Assessment{$i}"};
    $recommendations[] = $request->{"Recommendation{$i}"};
    $findings[]        = $request->{"Findings{$i}"};
    $classes[]         = $request->{"Class{$i}"};
    $i++;
}

PEAssesAndRec::updateOrCreate(
    ['IdQueue' => $id, 'ItemCode' => $request->ItemCode],
    [
        'Findings'       => json_encode($findings),
        'Assessment'     => json_encode($assessments),
        'Recommendation' => json_encode($recommendations),
        'Class'          => json_encode($classes),
        'UpdateBy'       => Auth::user()->username,
        'UpdateDate'     => now(),
    ]
);

return response()->json(['success' => true]);
```

---

### 6.7 `ModalsController`

**File:** `app/Http/Controllers/cms/doctors/doctorModals/ModalsController.php`

**`EditOrderModal($id)`** — Lists available items
```php
ItemMaster::leftJoin('PhysicianOrder', function($join) use ($id) {
    $join->on('ItemMaster.Code', '=', 'PhysicianOrder.ItemCode')
         ->where('PhysicianOrder.IdQueueFrom', $id);
})
->where('ItemMaster.ItemStatus', 'Active')
->where('ItemMaster.Type', 'Item')
->get(['ItemMaster.*', 'PhysicianOrder.Status as OrderStatus']);
```

**`SaveOrderModal(Request $request)`**
```php
// Atomic replace — delete old, insert new
PhysicianOrder::where('IdQueueFrom', $request->IdQueue)->delete();

foreach ($request->ItemCode as $code) {
    PhysicianOrder::create([
        'IdQueueFrom' => $request->IdQueue,
        'IdDoctor'    => Auth::user()->physicianId,
        'ItemCode'    => $code,
        'DateOrder'   => today(),
        'Status'      => '1',
    ]);
}
```

---

### 6.8 `PcpDoctorModalController`

**File:** `app/Http/Controllers/cms/doctors/doctorModals/PcpDoctorModalController.php`

**`getPhysicians(Request $request)`** — typeahead API
```php
$q = $request->q;
Physician::where('Status', 'Approved')
    ->whereIn('SubGroup', ['PCP', 'SPL'])
    ->where(function($query) use ($q) {
        $query->where('FullName', 'like', "%{$q}%")
              ->orWhere('PRCNo', 'like', "%{$q}%");
    })
    ->limit(10)
    ->get(['Id', 'Code', 'FullName']);
```

**`store(Request $request)`** — nurse reassigns PCP mid-flow
```php
$idQueue = $request->IdQueue;
VitalSign::where('IdQueue', $idQueue)->update([
    'PcpId'   => $request->PcpId,
    'PcpName' => $request->PcpName,
    ...vitals...
]);
AccessionNo::where('IdQueue', $idQueue)->update(['Status' => 280]);
Queue::where('Id', $idQueue)->update(['Status' => 280]);
DB::commit();
```

---

### 6.9 `DoctorsCompleteQueueController`

**File:** `app/Http/Controllers/cms/doctors/DoctorsCompleteQueueController.php`

**`update($id, Request $request)`** — revert completed consultation
```php
// Doctor needs to re-evaluate
AccessionNo::where('IdQueue', $id)->update(['Status' => 280]);
Transactions::where('IdQueue', $id)->update(['Status' => 280]);
// SOAP stays, doctor edits from doctorEdit view at status 280
```

---

### 6.10 `PhysicianController`  _(Eros)_

**File:** `app/Http/Controllers/eros/PhysicianController.php`

**ErosCode Generation:**
```php
// Format: first 3 initials of FullName + next sequential number
$initials = strtoupper(substr($lastName,0,1) . substr($firstName,0,1) . substr($middleName,0,1));
$maxCode  = Physician::where('ErosCode', 'like', "{$initials}%")
                     ->max(DB::raw('CAST(SUBSTRING(ErosCode, 4) AS UNSIGNED)'));
$erosCode = $initials . str_pad($maxCode + 1, 4, '0', STR_PAD_LEFT);
```

**PRC Normalization:**
```php
$prc = ltrim($request->PRCNo, '0');  // remove leading zeros
```

---

### 6.11 `QueuePhysicianController`  _(API Audit)_

**File:** `app/Http/Controllers/cms/api/QueuePhysicianController.php`

**`storePhysicianData(Request $request, $id)`**
```php
// Logs changes to physician data
$logs = [
    'oldVal'      => $request->oldData,
    'newVal'      => $request->newData,
    'updatedBy'   => Auth::user()->username,
    'updateTime'  => now(),
];

ErosPhysicianInfo::create([
    'IdPhysician'   => $id,
    'Logs'          => json_encode($logs),
    'SystemDateTime'=> now(),
]);

// Also update ApprovalLogs on Physician
Physician::where('Id', $id)->update([
    'ApprovalLogs' => json_encode($logs),
    'UpdateBy'     => Auth::user()->username,
    'UpdateDate'   => now(),
]);
```

---

## 7. Routes

### `routes/cms.php` — Doctor Sub-Routes

```php
Route::middleware(['auth', 'CheckCMS'])->group(function () {

    // === VITAL SIGNS ===
    Route::prefix('doctor/vitals')->group(function () {
        Route::get('/',              [VitalsController::class, 'index']);
        Route::get('/{id}/edit',     [VitalsController::class, 'edit']);
        Route::put('/{id}',          [VitalsController::class, 'update']);

        // PCP assignment modal
        Route::prefix('doctordecking/pcpdoctor')->group(function () {
            Route::get('/{id}/edit', [PcpDoctorModalController::class, 'edit']);
            Route::post('/',         [PcpDoctorModalController::class, 'store']);
        });
    });

    // === DOCTOR QUEUE ===
    Route::prefix('doctor/queue')->group(function () {
        Route::get('/',              [DoctorController::class, 'index']);
        Route::get('/{id}/edit',     [DoctorController::class, 'edit']);
        Route::put('/{id}',          [DoctorController::class, 'update']);

        // Draft SOAP
        Route::post('/draft/temp',   [DoctorTempController::class, 'store']);

        // Past SOAP history
        Route::post('/past/history', [DoctorsConsultationHistoryController::class, 'store']);

        // Physician orders
        Route::get('/order/orderModal/{id}/edit', [ModalsController::class, 'EditOrderModal']);
        Route::post('/order/orderModal',           [ModalsController::class, 'SaveOrderModal']);
        Route::get('/pastResult/{id}',             [ModalsController::class, 'PastResult']);
    });

    // === PHYSICAL EXAMINATION ===
    Route::prefix('doctor/pe')->group(function () {
        Route::get('/{id}',  [PEController::class, 'edit']);
        Route::put('/{id}',  [PEController::class, 'update']);
    });

    // === MEDICAL EVALUATION ===
    Route::prefix('doctor/evaluation')->group(function () {
        Route::get('/',                          [MedicalEvaluationController::class, 'index']);
        Route::get('/{id}',                      [MedicalEvaluationController::class, 'edit']);
        Route::put('/{id}',                      [MedicalEvaluationController::class, 'update']);
        Route::get('/getresultcompany',          [MedicalEvaluationController::class, 'getCompanyList']);

        // Eval modal
        Route::get('/evalModal/evalModalView/{id}', [MedicalEvaluationModalController::class, 'show']);
        Route::get('/evalModal/editPDF/{id}',        [MedicalEvaluationModalController::class, 'edit']);
        Route::put('/evalModal/{id}',                [MedicalEvaluationModalController::class, 'update']);

        // Company / Patient filtering
        Route::get('/company',         [MedicalEvaluationCompanyController::class, 'index']);
        Route::get('/company/patient', [MedicalEvaluationPatientController::class, 'index']);
    });

    // === COMPLETED QUEUE (Doctor History) ===
    Route::prefix('doctor/historyqueue')->group(function () {
        Route::get('/',          [DoctorsCompleteQueueController::class, 'index']);
        Route::get('/{id}/edit', [DoctorsCompleteQueueController::class, 'edit']);
        Route::put('/{id}',      [DoctorsCompleteQueueController::class, 'update']); // revert 500→280
    });

    // === EVALUATED ===
    Route::prefix('processing/evaluated')->group(function () {
        Route::get('/',                [EvaluatedController::class, 'index']);
        Route::get('/company',         [EvaluatedCompanyController::class, 'index']);
        Route::get('/company/patient', [EvaluatedPatientController::class, 'index']);
    });
});
```

### `routes/eros.php` — Physician Management Routes

```php
Route::middleware(['auth'])->prefix('cmsphysician')->group(function () {

    // Physician CRUD
    Route::get('/physician',              [PhysicianController::class, 'index']);
    Route::get('/physician/create',       [PhysicianController::class, 'create']);
    Route::get('/physician/{id}/edit',    [PhysicianController::class, 'edit']);
    Route::put('/physician/{id}',         [PhysicianController::class, 'update']);

    // Master list export
    Route::get('/doctorsmodule',          [PhysicianMasterListController::class, 'index']);
    Route::post('/doctorsmodule',         [PhysicianMasterListController::class, 'store']); // Excel export

    // Approval modals
    Route::get('/declinemodal/{id}/edit', [DoctorModalController::class, 'edit']);
    Route::post('/approvaldoctor',        [DoctorModalController::class, 'approvalDoctor']);
    Route::post('/declinedoctor',         [DoctorModalController::class, 'declineDoctor']);

    // Physician change history
    Route::get('/historyInfo/{id}/edit',  [PhysicianHistoryController::class, 'edit']);
});
```

### Queue Station Physician Routes

```php
Route::middleware(['auth', 'CheckCMS'])->prefix('cms/queue')->group(function () {

    // Outside / referring physician
    Route::get('/outsidePhysician',          [OutsidePhysicianController::class, 'index']);
    Route::get('/search',                    [OutsidePhysicianController::class, 'searchPhysician']);

    // Physician info and enrollment
    Route::get('/pages/physicianInfo',       [PhysicianTableController::class, 'index']);
    Route::post('/pages/physicianInfo/insert',[PhysicianTableController::class, 'insertPhysician']);
    Route::post('/physician-update',         [PhysicianTableController::class, 'physicianupdate']);
});
```

### API Routes

```php
Route::middleware(['auth'])->group(function () {
    Route::get('/api/physicians',                         [PcpDoctorModalController::class, 'getPhysicians']);
    Route::post('/api/storePhysicianData/{id}',           [QueuePhysicianController::class, 'storePhysicianData']);
    Route::get('/cms/queue/api/getPhysicianName',         [QueuePhysicianController::class, 'show']);
});
```

---

## 8. Models

### `VitalSign`
```php
class VitalSign extends Model {
    protected $table    = 'VitalSign';
    protected $primaryKey = 'Id';
    public $incrementing = false;
    protected $keyType  = 'string';
    public $timestamps  = false;

    protected $fillable = [
        'Id', 'IdQueue', 'QueueCode', 'ChiefComplaint', 'PcpId', 'PcpName',
        'PulseRate', 'RespiratoryRate',
        'BloodPresure', 'BloodPresureOver', 'BloodPresure2', 'BloodPresureOver2',
        'BloodPresure3', 'BloodPresureOver3',
        'Temperature', 'Height', 'Weight', 'BMI', 'BMICategory',
        'UcorrectedOD', 'UcorrectedOS', 'CorrectedOD', 'CorrectedOS',
        'UncorrectedNearOD', 'UncorrectedNearOS', 'CorrectedNearOD', 'CorrectedNearOS',
        'Deficient', 'ColorVision', 'WithContactLens', 'WithEyeGlass',
        'InputBy', 'InputDate', 'UpdateBy', 'UpdateDate',
    ];
}
```

### `SOAP`
```php
class SOAP extends Model {
    protected $table     = 'SOAP';
    protected $primaryKey = 'Id';
    public $incrementing  = false;
    protected $keyType   = 'string';
    public $timestamps   = false;

    protected $fillable = [
        'Id', 'QueueCode', 'IdPatient', 'IdDoctor', 'NameDoctor',
        'Subjective', 'Objective', 'Assessment', 'Plan',
        'Status', 'InputBy', 'InputDate', 'SystemDateTime',
    ];
}
```

### `SOAPTemp`
```php
class SOAPTemp extends Model {
    protected $table = 'SOAPTemp';
    // same structure as SOAP
}
```

### `PhysicalExaminationReport`
```php
class PhysicalExaminationReport extends Model {
    protected $table     = 'PhysicalExaminationReport';
    protected $primaryKey = 'Id';
    public $incrementing  = false;
    protected $keyType   = 'string';
    public $timestamps   = false;

    protected $fillable = [/* all 40+ columns */];

    public function queue() {
        return $this->belongsTo(Queue::class, 'IdQueue');
    }
}
```

### `PEAssesAndRec`
```php
class PEAssesAndRec extends Model {
    protected $table     = 'PEAssesAndRec';
    protected $primaryKey = 'Id';
    public $incrementing  = false;
    protected $keyType   = 'string';
    public $timestamps   = false;

    protected $casts = [
        'Findings'       => 'array',
        'Assessment'     => 'array',
        'Recommendation' => 'array',
        'Class'          => 'array',
    ];
}
```

### `Physician`  _(Eros DB connection)_
```php
class Physician extends Model {
    protected $connection = 'eros';   // separate DB connection
    protected $table      = 'Physician';
    protected $primaryKey = 'Id';
    public $incrementing   = false;
    protected $keyType    = 'string';
    public $timestamps    = false;

    protected $casts = [
        'NWDBranch'          => 'array',
        'Schedule'           => 'array',
        'TimeStart'          => 'array',
        'TimeEnd'            => 'array',
        'ByAppointment'      => 'array',
        'FirstEngagement'    => 'array',
        'LastEngagement'     => 'array',
        'ClinicScheduledBy'  => 'array',
        'ApprovalLogs'       => 'array',
    ];
}
```

### `PhysicianLogs`
```php
class PhysicianLogs extends Model {
    protected $table      = 'PhysicianLogs';
    protected $primaryKey = 'IdPhysician';
    public $timestamps    = false;
}
```

---

## 9. Views / UI Structure

| View File | Purpose |
|---|---|
| `cms/doctor/vitalSign.blade.php` | Vital signs queue list (nurse) |
| `cms/doctor/vitalSignEdit.blade.php` | Vital signs entry form |
| `cms/doctor/doctor.blade.php` | Doctor queue list |
| `cms/doctor/doctorEdit.blade.php` | Doctor consultation + SOAP form |
| `cms/doctor/PEEdit.blade.php` | Physical examination form (40+ fields) |
| `cms/doctor/medicalEval.blade.php` | Medical evaluation — company selection |
| `cms/doctor/medicalEvalEdit.blade.php` | Per-item assessment/recommendation form |
| `cms/doctor/doctorsPastQueue.blade.php` | Completed queue list |
| `cms/doctor/doctorsPastQueueEdit.blade.php` | Completed consultation review |
| `cms/doctor/doctorModals/medicalEvalModal.blade.php` | Assessment entry modal |
| `cms/doctor/doctorModals/medicalEvalModalForPDF.blade.php` | PDF result viewer |
| `cms/doctor/doctorModals/doctorPCPModal.blade.php` | PCP selection modal |
| `cms/doctor/doctorModals/doctorOrderModal.blade.php` | Physician order entry |
| `eros/physicianList.blade.php` | Physician master list |
| `eros/physicianListCreate.blade.php` | Physician enrollment form |
| `eros/physicianListEdit.blade.php` | Physician edit form |
| `eros/physicianMasterList.blade.php` | Physician master list export view |
| `cms/pages/physicianInfo.blade.php` | Physician info display (queue station) |
| `cms/queuing/consultationQueue.blade.php` | Kiosk consultation queue |
| `cms/queuing/consultationQueueEdit.blade.php` | Kiosk entry form |

---

## 10. Key Business Rules

### Vital Signs Rules
- Nurse **must** record vitals before status advances to 280
- BMI is auto-calculated from `Height` and `Weight`
- PCP assignment is made here — physician must be `Status='Approved'` AND `SubGroup IN ('PCP','SPL')`
- Blood pressure has 3 readings to support average calculation

### Doctor Queue Rules
- Doctor only sees patients assigned to their `PcpId` (tied to `Auth::user()->physicianId` → `Eros.Physician.EmpId`)
- Draft saves go to `SOAPTemp`; finalization copies to `SOAP`
- The system prevents finalizing without a complete SOAP entry
- Completed consultations (status 500) can be reverted to 280 if needed

### Physical Examination Rules
- PE is only applicable to certain package types (e.g., industrial/pre-employment)
- Class designation per body system feeds into the overall fitness class
- The GP field stores encoded vision data: `GP = {G}{P}({OD}-{OS}-{near_OD}-{near_OS})`

### Medical Evaluation Rules
- Only available after results are uploaded/released
- Each test item (`ItemCode`) gets its own assessment row in `PEAssesAndRec`
- **Waived items** (AccessionNo.Status=888) are auto-assessed with "WAIVED" class — no manual entry needed
- **Overall class priority**: `Pending > D > C > B > A`
- All items must have an assessment before overall class can be computed

### Physician Enrollment Rules
- PRC number must be unique (leading zeros stripped before check)
- ErosCode generated as: `[3-letter initials][4-digit sequence]`
- Specialist → `SubGroup='SPL'`; Primary Care → `SubGroup='PCP'`
- All enrollments start at `Status='For Approval'`
- Resignation clears schedule JSON arrays
- All changes are audited to `Audit.ErosPhysicianInfo`

### Image Upload Rules
- Physician prescription images accepted as base64 strings
- Decoded and saved as PNG to `/uploads/PhysicianPrescription/{SafeName}.png`
- Safe name = physician's name with spaces replaced by underscores

---

## 11. Authentication & Authorization

| Layer | Implementation |
|---|---|
| Auth driver | Laravel Sanctum + LDAP (directorytree/ldaprecord-laravel) |
| Middleware | `CheckCMS` on all doctor routes |
| Role storage | JSON string in session: `"ldap_role":"[PHYSICIAN-APPROVER]"` |
| Doctor identity | `Auth::user()->physicianId` → matched to `Eros.Physician.EmpId` |
| Approver role | `PHYSICIAN-APPROVER` role required for approve/decline actions |
| Multi-tenant | `Auth::user()->IdBU` used to filter by business unit / facility |

---

## 12. JSON Field Conventions

Multiple fields in the Doctor module store arrays as JSON strings:

| Table | Column | JSON Structure |
|---|---|---|
| `PEAssesAndRec` | `Findings` | `["Normal", "Slightly elevated"]` |
| `PEAssesAndRec` | `Assessment` | `["Hypertension Stage 1"]` |
| `PEAssesAndRec` | `Recommendation` | `["Lifestyle modification"]` |
| `PEAssesAndRec` | `Class` | `["B"]` |
| `Physician` | `Schedule` | `[["Mon","Wed","Fri"], ["Tue","Thu"]]` (per clinic) |
| `Physician` | `NWDBranch` | `["CEBU", "SMB"]` |
| `Physician` | `TimeStart` | `["08:00", "14:00"]` |
| `Physician` | `TimeEnd` | `["12:00", "18:00"]` |
| `Physician` | `ApprovalLogs` | `{oldVal:{}, newVal:{}, updatedBy:"", updateTime:""}` |
| `ErosPhysicianInfo` | `Logs` | Same structure as ApprovalLogs |

---

## 13. Modern Stack Replication Guide

> **Target Stack:** Laravel 11/12 + PHP 8.3 + React + Inertia.js + Tailwind CSS 4 + Laravel Reverb + Redis + Spatie Laravel Permission

### 13.1 Database Changes

| Legacy | Modern |
|---|---|
| VARCHAR(36) UUID PKs | `uuid()` migration type, `HasUuids` trait |
| JSON stored as TEXT | `json()` column type with Eloquent `$casts` |
| Raw Oracle queries | Eloquent with MySQL or PostgreSQL |
| Manual audit tables | `spatie/laravel-activitylog` |
| Manual updateOrCreate | Eloquent `updateOrCreate()` — same, already standard |

**Example Migration — VitalSign:**
```php
Schema::create('vital_signs', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('queue_id')->constrained('queues');
    $table->string('queue_code', 50)->nullable();
    $table->text('chief_complaint')->nullable();
    $table->uuid('pcp_id')->nullable();
    $table->string('pcp_name')->nullable();
    $table->string('pulse_rate', 10)->nullable();
    $table->string('respiratory_rate', 10)->nullable();
    $table->string('bp_systolic_1', 10)->nullable();
    $table->string('bp_diastolic_1', 10)->nullable();
    $table->string('bp_systolic_2', 10)->nullable();
    $table->string('bp_diastolic_2', 10)->nullable();
    $table->string('bp_systolic_3', 10)->nullable();
    $table->string('bp_diastolic_3', 10)->nullable();
    $table->string('temperature', 10)->nullable();
    $table->string('height', 10)->nullable();
    $table->string('weight', 10)->nullable();
    $table->string('bmi', 10)->nullable();
    $table->string('bmi_category', 50)->nullable();
    $table->string('uncorrected_od', 10)->nullable();
    $table->string('uncorrected_os', 10)->nullable();
    $table->string('corrected_od', 10)->nullable();
    $table->string('corrected_os', 10)->nullable();
    $table->string('uncorrected_near_od', 10)->nullable();
    $table->string('uncorrected_near_os', 10)->nullable();
    $table->string('corrected_near_od', 10)->nullable();
    $table->string('corrected_near_os', 10)->nullable();
    $table->boolean('with_contact_lens')->default(false);
    $table->boolean('with_eyeglass')->default(false);
    $table->string('color_vision', 10)->nullable();
    $table->string('input_by')->nullable();
    $table->string('update_by')->nullable();
    $table->timestamps();
});
```

### 13.2 Eloquent Model Conventions

```php
// Modern snake_case columns + UUID + casts
class VitalSign extends Model {
    use HasUuids;

    protected $casts = [
        'with_contact_lens' => 'boolean',
        'with_eyeglass'     => 'boolean',
    ];

    public function queue(): BelongsTo {
        return $this->belongsTo(Queue::class);
    }
}
```

### 13.3 Inertia.js Page Structure

```
resources/js/Pages/Doctor/
├── VitalSigns/
│   ├── Index.tsx          # Queue list (nurse station)
│   └── Edit.tsx           # Vitals entry form
├── Queue/
│   ├── Index.tsx          # Doctor queue list
│   ├── Edit.tsx           # SOAP consultation form
│   └── Completed.tsx      # Completed queue
├── PhysicalExam/
│   └── Edit.tsx           # PE form (40+ fields)
├── MedicalEvaluation/
│   ├── Index.tsx          # Company list
│   ├── Company.tsx        # Patient list by company
│   └── Edit.tsx           # Per-item assessment form
└── Physicians/
    ├── Index.tsx          # Master list
    ├── Create.tsx         # Enrollment form
    └── Edit.tsx           # Edit form
```

### 13.4 Spatie Permissions (replacing JSON role strings)

```php
// Roles to create for this module
Permission::create('vitals.view');
Permission::create('vitals.record');
Permission::create('doctor.queue.view');
Permission::create('doctor.consultation.save');
Permission::create('doctor.pe.record');
Permission::create('medical.evaluation.record');
Permission::create('physician.approve');
Permission::create('physician.decline');
Permission::create('physician.enroll');

Role::create('nurse')->syncPermissions([
    'vitals.view', 'vitals.record'
]);

Role::create('doctor')->syncPermissions([
    'doctor.queue.view', 'doctor.consultation.save',
    'doctor.pe.record', 'medical.evaluation.record'
]);

Role::create('physician-approver')->syncPermissions([
    'physician.approve', 'physician.decline', 'physician.enroll'
]);
```

### 13.5 Real-time Updates (replacing Socket.io)

Use **Laravel Reverb** + **Echo** to broadcast queue status changes:

```php
// Event: VitalSignsRecorded
class VitalSignsRecorded implements ShouldBroadcast {
    public function broadcastOn(): Channel {
        return new Channel("doctor-queue.{$this->queueId}");
    }
}

// Event: ConsultationCompleted
class ConsultationCompleted implements ShouldBroadcast {
    public function broadcastOn(): Channel {
        return new PrivateChannel("facility.{$this->facilityId}.doctor-queue");
    }
}
```

```tsx
// React + Echo listener
Echo.channel(`doctor-queue.${queueId}`)
    .listen('VitalSignsRecorded', (e) => {
        // Refresh queue list or update patient card
        router.reload({ only: ['queue'] });
    });
```

### 13.6 Overall Class Calculation Service

Encapsulate as a dedicated service for reuse:

```php
class FitnessClassCalculator {
    private const PRIORITY = ['Pending' => 4, 'D' => 3, 'C' => 2, 'B' => 1, 'A' => 0];

    public function calculate(Collection $assessments): string {
        return $assessments
            ->flatMap(fn($row) => $row->class)  // flatten JSON arrays
            ->reduce(function (string $overall, string $class) {
                return self::PRIORITY[$class] > self::PRIORITY[$overall]
                    ? $class
                    : $overall;
            }, 'A');
    }
}
```

### 13.7 File Structure for New Project

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Doctor/
│   │   │   ├── VitalSignController.php
│   │   │   ├── ConsultationController.php
│   │   │   ├── PhysicalExamController.php
│   │   │   ├── MedicalEvaluationController.php
│   │   │   └── CompletedQueueController.php
│   │   └── Physician/
│   │       ├── PhysicianController.php
│   │       ├── PhysicianApprovalController.php
│   │       └── PhysicianOrderController.php
├── Models/
│   ├── VitalSign.php
│   ├── Soap.php
│   ├── SoapDraft.php
│   ├── PhysicalExamReport.php
│   ├── PeAssessment.php
│   ├── PhysicianOrder.php
│   └── Physician.php
├── Services/
│   ├── FitnessClassCalculator.php
│   ├── VitalSignService.php
│   └── PhysicianCodeGenerator.php
└── Events/
    ├── VitalSignsRecorded.php
    └── ConsultationCompleted.php
```

---

---

## 14. Client Requirements — Doctor Queue Operational Model

> **Source:** Onsite operational feedback from clinical staff
> **Priority:** High — directly impacts daily patient throughput

---

### 14.1 Problem Statement

#### Current Behavior (Legacy CMS)

- Each patient in the queue is assigned to a **specific doctor** (PCP).
- A doctor sees **only their assigned patients** — the queue is siloed per physician.
- If the assigned doctor is occupied/unavailable, the patient waits, even if another doctor is free.
- Reassignment requires a **receptionist to manually re-assign** the patient in the CMS system.

#### Operational Impact

| Scenario | Problem |
|----------|---------|
| Doctor A is with a patient; Doctor B is free | Doctor B sees no patients — idle time |
| Patient waits for their assigned doctor | Longer wait time despite available doctors |
| Receptionist must intervene for every reassignment | Bottleneck at reception |
| Peak hours with uneven patient distribution | Queue backlog for one doctor, empty queue for another |

#### Root Cause

The queue is **doctor-centric** (filtered by `pcp_id`) instead of **clinic-centric** (filtered by `clinic_code`). Patient flow depends on manual receptionist action rather than real-time doctor availability.

---

### 14.2 Client Requirement

> **"Doctors should be able to take the next available patient without waiting for receptionist reassignment. Patient flow must be flexible and responsive to actual doctor availability."**

**Core Requirements:**

1. **Shared clinic queue** — All patients in a clinic are visible to all doctors in that clinic.
2. **Self-claiming** — A doctor can claim (start evaluating) any unclaimed waiting patient.
3. **Ownership lock** — Once a doctor starts evaluation (`IN_PROGRESS`), that patient is locked to them. Other doctors see the patient as in-progress but cannot claim it.
4. **Voluntary release** — A doctor can release a patient back to the shared pool (revert to `WAITING`) if they cannot continue.
5. **Soft PCP preference** — The original PCP assignment is a preference, not a hard lock. It is shown as a hint to help doctors prioritize known patients.
6. **No receptionist required** — Queue movement must be possible without receptionist intervention.

---

### 14.3 Proposed Queue Flow (CMS v3)

```
┌─────────────────────────────────────────────────────────────────┐
│                   CLINIC SHARED QUEUE POOL                       │
│              (All WAITING patients in the clinic)                │
│                                                                  │
│  [ Patient A — No Doctor ]  [ Patient B — Pref: Dr. Cruz ]      │
│  [ Patient C — No Doctor ]  [ Patient D — Pref: Dr. Santos ]    │
└────────────────────────────┬────────────────────────────────────┘
                             │
       ┌─────────────────────┴──────────────────────┐
       │                                             │
       ▼                                             ▼
┌──────────────────┐                    ┌──────────────────┐
│   DOCTOR A       │                    │   DOCTOR B       │
│   (Free)         │                    │   (Free)         │
│                  │                    │                  │
│  Clicks          │                    │  Clicks          │
│  "Evaluate"      │                    │  "Evaluate"      │
│  on Patient A    │                    │  on Patient C    │
│                  │                    │                  │
│  → Status:       │                    │  → Status:       │
│  IN_PROGRESS     │                    │  IN_PROGRESS     │
│  claimed_by:     │                    │  claimed_by:     │
│  Doctor A        │                    │  Doctor B        │
└──────────────────┘                    └──────────────────┘
```

**Key rule:** `WAITING` patients are visible to all doctors. `IN_PROGRESS` patients show who claimed them (read-only for other doctors). `COMPLETED` patients are visible to all for review.

---

### 14.4 Required Schema Changes

#### `queues` Table — Add Doctor Claim Fields

| Column | Type | Description |
|--------|------|-------------|
| `claimed_by_id` | `int unsigned NULL` | FK → `users.id` — the doctor who claimed this patient |
| `claimed_by_name` | `varchar(255) NULL` | Doctor's display name at time of claim |
| `claimed_at` | `datetime NULL` | Timestamp when doctor claimed the patient |
| `pcp_preference_id` | `varchar(50) NULL` | Original PCP suggestion (non-binding) |
| `pcp_preference_name` | `varchar(255) NULL` | Original PCP name for display |

**SQL:**
```sql
ALTER TABLE queues
  ADD COLUMN claimed_by_id      INT UNSIGNED DEFAULT NULL,
  ADD COLUMN claimed_by_name    VARCHAR(255) DEFAULT NULL,
  ADD COLUMN claimed_at         DATETIME     DEFAULT NULL,
  ADD COLUMN pcp_preference_id  VARCHAR(50)  DEFAULT NULL,
  ADD COLUMN pcp_preference_name VARCHAR(255) DEFAULT NULL,
  ADD INDEX idx_claimed_by (claimed_by_id);
```

**Prisma additions to `Queue` model:**
```prisma
claimed_by_id        Int?      @db.UnsignedInt
claimed_by_name      String?   @db.VarChar(255)
claimed_at           DateTime?
pcp_preference_id    String?   @db.VarChar(50)
pcp_preference_name  String?   @db.VarChar(255)
```

---

### 14.5 API Changes

#### `PATCH /api/clinical/[queueId]/status` — Extend for Claim

When a doctor transitions from `WAITING → IN_PROGRESS`, the API must also record the doctor as the owner:

```typescript
// On WAITING → IN_PROGRESS: record who claimed the patient
if (currentStatus === "WAITING" && newStatus === "IN_PROGRESS") {
  await prisma.queue.update({
    where: { id },
    data: {
      status: "IN_PROGRESS",
      claimed_by_id: session.user.id,         // logged-in doctor
      claimed_by_name: session.user.name,
      claimed_at: new Date(),
    },
  });
}

// On IN_PROGRESS → WAITING: clear the claim (release back to pool)
if (currentStatus === "IN_PROGRESS" && newStatus === "WAITING") {
  await prisma.queue.update({
    where: { id },
    data: {
      status: "WAITING",
      claimed_by_id: null,
      claimed_by_name: null,
      claimed_at: null,
    },
  });
}
```

#### `GET /api/clinical/queue` — Return Claim Info

Add `claimedBy`, `claimedByName`, `claimedAt`, `pcpPreference` to the response payload so the UI can show who owns each `IN_PROGRESS` patient.

---

### 14.6 UI Changes (Clinical Queue Page)

#### Patient Row — Claim Visibility

| Queue Status | What Doctors See |
|--------------|-----------------|
| `WAITING` | **"Evaluate" button active** for all doctors. PCP preference shown as a badge hint. |
| `IN_PROGRESS` — claimed by me | **"Continue" button** active. My name shown as owner. |
| `IN_PROGRESS` — claimed by another doctor | Row is dimmed. Shows "Dr. [Name]" badge. **No action button** (or "View only"). |
| `COMPLETED` | "View" button for all doctors. Claimed doctor name shown. |
| `CANCELLED` | Greyed out, no action. |

#### PCP Preference Badge

When a patient has a `pcp_preference_name`, show a soft label on the row:
```
[Pref: Dr. Cruz]
```
This is informational only — any available doctor can still evaluate.

#### Release / Revert Logic

- **"Revert to Waiting"** in the dropdown menu should clear the claim.
- Only the **claiming doctor** (or an admin) should be able to revert their own in-progress patients.

---

### 14.7 Business Rules

| Rule | Description |
|------|-------------|
| **Open pool** | All `WAITING` patients in a clinic are claimable by any doctor logged into that clinic |
| **First-claim wins** | The first doctor to click "Evaluate" owns the patient; race condition is handled at the DB level via atomic update |
| **Soft lock** | `IN_PROGRESS` patients belong to the claiming doctor; other doctors cannot start evaluation |
| **Self-release** | A doctor can release their own `IN_PROGRESS` patient back to `WAITING` at any time |
| **Admin override** | Admin role can reassign a patient to another doctor (force-claim) |
| **PCP preference preserved** | Original PCP suggestion is stored and displayed but never enforces access |
| **Clinic scope** | A doctor only sees queues from their own clinic (`clinic_code` filter remains) |
| **No receptionist required** | All queue movement (claim, release, complete, cancel) can be done by the doctor directly |

---

### 14.8 Implementation Priority

| Step | Task | Notes |
|------|------|-------|
| 1 | Add claim columns to `queues` table | Run `ALTER TABLE` directly (not `prisma db push` on prod) |
| 2 | Update Prisma `Queue` model | Add 5 new optional fields |
| 3 | Update `PATCH /api/clinical/[queueId]/status` | Auto-set/clear claim on status change |
| 4 | Update `GET /api/clinical/queue` | Return claim fields in response |
| 5 | Update Clinical Queue UI | Show claim ownership, dim locked patients, PCP preference badge |
| 6 | Update `evaluation-drawer.tsx` | Show claiming doctor info in the drawer header |

---

### 14.9 Adjusted Status Transition Table

| From | To | Actor | Side Effect |
|------|----|-------|-------------|
| `WAITING` | `IN_PROGRESS` | **Any available doctor** | Sets `claimed_by_*` fields to claiming doctor |
| `IN_PROGRESS` | `WAITING` | **Claiming doctor only** (or admin) | Clears `claimed_by_*` fields — patient returns to open pool |
| `IN_PROGRESS` | `COMPLETED` | **Claiming doctor only** | Claim remains (audit trail) |
| `IN_PROGRESS` | `CANCELLED` | **Claiming doctor only** (or admin) | Claim cleared |
| `COMPLETED` | `IN_PROGRESS` | **Any doctor** (or admin) | Re-claim by new doctor |
| `CANCELLED` | `WAITING` | **Admin or receptionist** | Clears claim |

---

---

## 15. Medical Evaluation — Company-Based View (Sample Data & UI Spec)

### 15.1 Company List View

The Medical Evaluation landing page shows a list of companies with patients pending evaluation. The doctor selects a company to see its patient list.

**Sample Company Data:**

| Company Code | Company Name | Evaluator |
|---|---|---|
| 4RC006692 | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | Yes |
| 10K006510 | 10K CONCRETE MIX SPECIALIST INC. | Yes |
| ACE007547 | ACE HARDWARE PHILS., INC - DS MANILA | Yes |
| ACE007594 | ACE HARDWARE PHILS., INC - DS QUIAPO | Yes |
| ACE007637 | ACE HARDWARE PHILS., INC - SM CENTER LEMERY | Yes |
| ACE007636 | ACE HARDWARE PHILS., INC - WALTERMART NASUGBU | Yes |
| ACT007135 | ACTIVE ONE COCA COLA CALASIAO | Yes |
| ACT007134 | ACTIVE ONE COCA COLA CARLATAN | Yes |
| ACT006052 | ACTIVE ONE HEALTH INC. - COCA COLA CANLUBANG | Yes |
| ADA006578 | ADAMSON UNIVERSITY | Yes |
| ADA006511 | ADAMSON UNIVERSITY NURSING STUDENTS | Yes |

**Data source:** `eros.company` table joined with queue to find patients in "For Evaluation" status.

**Columns to display:** Company Code, Company Name, Evaluator flag (boolean/Yes).

---

### 15.2 Company Patients List View (Second Level)

When a doctor clicks a company row from the company list, a patient list is shown for that company.

**Header:**
```
Company Evaluation   4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL)
Search: [__________] [Search]
```

**Columns:** Patient Id | Full Name | Company | Date

**Sample data for 4RC006692:**

| Patient Id | Full Name | Company | Date |
|---|---|---|---|
| 39210959 | BUCAIS, REGNER DE FELIPE | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39206909 | VICENTE, MA. DAISY GEROMIANO | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39195509 | BIBON, SAMUEL JR. LAGUNOY | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39189675 | DUMAGUIT, RAINIEL SURIO | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39189525 | FIGURA, JULIE-ANN STO. NIÑO | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39189375 | BIÑAS, JENNETH TANJUATCO | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39189300 | LISTANA, MARILYN VICENTE | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39189225 | CARANDANG, ALDRIN GREG | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39189150 | RIVANO, LARRY MUERONG | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39188925 | LOWATON, JOSEPH MERCIALES | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |
| 39188850 | CUSTODIO, JOEFEL PANES | 4RCP PHOENIX SECURITY (12 SECURITY PERSONNEL) | 2025-10-15 |

**Notes:**
- "Patient Id" = `Queue.Id` (BigInt from real DB)
- "Full Name" = `Queue.QFullName`
- "Company" = `Queue.NameCompany` (company name stored in queue row)
- "Date" = `Queue.Date`
- Search filters by patient name or patient id
- Clicking a row opens the patient evaluation detail

---

### 15.3 Company Evaluation Detail View (Third Level)

When a doctor clicks a company row, they see the patient evaluation form.

**Header:**
```
Company Evaluation   ACTIVE ONE COCA COLA CARLATAN   [Edit]
```

**Patient Info Panel:**

| Field | Sample Value |
|---|---|
| Patient's Name | CASASIEMPRE, LARRY MANIAGO |
| Date of Birth | 26-Dec-1979 |
| Gender | M |
| Age | 45 |
| Notes | (free-text notes field) |
| PID | IMDCW2512120308 |
| Queue No. | IMDAZ2512160037 |
| Date Time | 16-Dec-2025 07:49:52 |
| Queue Status | Evaluated ✓ Checked |
| Company | ACTIVE ONE COCA COLA CARLATAN |

---

### 15.3 Assessment and Recommendation Table

Per-test evaluation table. Each row = one ordered test/exam:

| Column | Description |
|---|---|
| Tests | Test/exam name from ItemMaster |
| Status | `Evaluated` / `Pending` / etc. |
| Class | Fitness class (A / B / C / D / combination e.g. "B B C") |
| PDF Result | Link/button to view the result PDF |

**Sample rows for ACT007134 patient:**

| Tests | Status | Class | PDF Result |
|---|---|---|---|
| VS, VA, Medical History and PE | Evaluated | B B C | |
| ELECTROCARDIOGRAM (ECG) | Evaluated | C | |
| CHEST PA | Evaluated | A | |
| CHOLESTEROL, TOTAL | Evaluated | A | |
| CREATININE (CREA) | Evaluated | A | |
| GLUCOSE, FASTING (FBS) | Evaluated | A | |
| TRIGLYCERIDES (TG, TRIACYLGLYCEROL, TAG, OR TRIACYLGLYCERIDE) | Evaluated | A | |
| UREA NITROGEN (BUN, BLOOD UREA NITROGEN) | Evaluated | A | |
| URIC ACID (BUA, BLOOD URIC ACID) | Evaluated | A | |
| ALANINE AMINOTRANSFERASE (ALT / SGPT) | Evaluated | C | |
| COMPLETE BLOOD COUNT WITH PLATELET COUNT (CBC / QUANTITATIVE PLATELET) | Evaluated | B | |
| FECALYSIS | Evaluated | A | |
| URINALYSIS | Evaluated | B | |

---

### 15.4 Summary / Findings Text

Large free-text area containing the doctor's written findings and recommendations per abnormal result. Each finding is separated by line breaks. Example content:

```
Obese I (27.04) - Gradual weight reduction, diet modification, and regular exercise

Error of refraction, both eyes, corrected - Continue daily wear and regular updating of prescribed lenses

History of Dyslipidemia - Continue medications as prescribed, follow up with attending physician

Rule out cardiac pathology - See Internist/Cardiologist for evaluation and management of ECG findings

Normal (Do not include in clinical assessment) - No Recommendation

To consider erythrocytosis - Increase oral fluid intake, suggest to repeat CBC after 2 weeks, see physician if persistent

Trace ketonuria - Increase oral fluid intake, suggest to repeat urinalysis, see physician if persistent

Transaminitis - Low fat diet, see Internist for evaluation and management
```

---

### 15.5 Medical Examination Rating Legend

Always displayed at the bottom of the evaluation form. This is the DOLE OSHS classification system:

| Class | Description |
|---|---|
| **A** | Physically fit for any work. |
| **B** | Physically under-developed or with correctible defects (error of refraction, dental caries, defective hearing, and other similar defects) but otherwise fit to work. |
| **C** | Employable but owing to certain impairments or conditions (heart disease, hypertension, anatomical defects) requires special placement or limited duty in specified or selected assignment requiring follow-up treatment/periodic evaluation. |
| **D** | Unfit or unsafe for any type of employment (active PTB, advanced heart disease with threatened failure, malignant hypertension, and other similar illnesses). |
| **Pending** | Incomplete test/s and/or result/s that need further evaluation. May be re-classified fit or unfit after completion or further evaluation by the Company Physician. |

**Source:** Occupational Safety and Health Standards, Department of Labor and Employment (DOLE).

---

### 15.6 UI Layout — Company Evaluation Page

```
┌─────────────────────────────────────────────────────────────┐
│  Company Evaluation   ACTIVE ONE COCA COLA CARLATAN  [Edit] │
├──────────────────────────┬──────────────────────────────────┤
│  Patient Info            │  Assessment & Recommendation     │
│  ─────────────────────   │  ────────────────────────────    │
│  Patient's Name*         │  Tests | Status | Class | PDF    │
│  Date of Birth*          │  ─────────────────────────────   │
│  Gender*   Age           │  VS, VA, PE   Evaluated  B B C   │
│  Notes                   │  ECG          Evaluated  C       │
│  PID                     │  CHEST PA     Evaluated  A       │
│  Queue No.               │  ...                             │
│  Date Time               │                                  │
│  Queue Status            │                                  │
│  Company                 │                                  │
├──────────────────────────┴──────────────────────────────────┤
│  Summary (large text area)                                   │
│  Obese I (27.04) - Gradual weight reduction...              │
│  Error of refraction...                                      │
├─────────────────────────────────────────────────────────────┤
│  MEDICAL EXAMINATION RATING                                  │
│  Class A | Class B | Class C | Class D | Pending            │
│  (legend text from DOLE OSHS)                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 15.7 Implementation Notes

- **Company list** → query `eros.company` joined with queue entries (status = For Evaluation) to find which companies have pending evaluations
- **Per-test rows** → come from `eros.itemmaster` / ordered tests per queue entry; evaluation class stored in `ConsultationNote` or a separate `MedicalEvaluation` table
- **Summary field** → stored in `ConsultationNote.summary` or a dedicated `medical_eval.summary` column
- **PDF Result column** → link to `/results/{testId}/pdf` route; may be null if result not yet uploaded
- **Evaluator flag** → stored in `eros.company.IsEvaluator` (bit/boolean field)
- **Overall fitness class** → computed from the worst class across all tests (D > C > B > A; Pending if any test is pending)

---

*End of Doctor / Medical Evaluation Module Documentation*
