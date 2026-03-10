# Physician Accreditation Module

## Overview
The Physician Accreditation module lives under the **EROS** section and manages the full lifecycle of physician accreditation applications — from initial submission through approval or decline, and maintenance of the accredited physician roster.

---

## Access Control

| Role | Permission |
|---|---|
| `[PHYSICIAN]` | Create and edit accreditation applications |
| `[PHYSICIAN-APPROVER]` | Approve or decline pending applications |
| `[PHYSICIAN-VIEW]` | Read-only access to all records |

RBAC key: `requireApiAuth(request, "erosui", "physician")`
Page guard: `requireAuth(CMS_MODULES.EROS_PHYSICIAN.module, CMS_MODULES.EROS_PHYSICIAN.tab)`

---

## URLs

| Route | Purpose |
|---|---|
| `/eros/physician` | Landing page — "For Approval" sub-tab active by default |
| `/eros/physician?tab=accredited` | Accredited Physicians sub-tab |

---

## Database Table: `physician`

Uses the existing `physician` PostgreSQL table (≈10,000 records).

> **Important:** `Degree` and `Group` columns are NOT mapped in Prisma (no `@map()`). Use quoted identifiers in raw SQL: `p."Degree"`, `p."Group"`.

### Key Fields Used

| Prisma Field | DB Column | Purpose |
|---|---|---|
| `Id` | `id` | Primary key (BigInt) |
| `FullName` | `fullname` | Display name |
| `LastName` | `lastname` | Form field |
| `FirstName` | `firstname` | Form field |
| `MiddleName` | `middlename` | Form field |
| `Suffix` | `suffix` | Form field |
| `DOB` | `dob` | Date of birth |
| `PRCNo` | `prcno` | PRC license number |
| `PRCValidity` | `prcvalidity` | PRC expiry date |
| `Degree` | `"Degree"` | Specialization / degree (quoted) |
| `Group` | `"Group"` | Physician group (quoted) |
| `SubGroup` | `subgroup` | Sub-group classification |
| `BranchCode` | `branchcode` | Assigned branch (3-char code) |
| `Email` | `email` | Contact email |
| `Mobile` | `mobile` | Contact mobile |
| `Status` | `status` | `Active` / `Pending` / `Declined` / `Inactive` |
| `DeclineReason` | `declinereason` | Reason when Status = Declined |
| `RequestorBy` | `requestorby` | Who submitted the application |
| `ApproveBy` | `approveby` | Who approved/declined |
| `ApprovalLogs` | `approvallogs` | JSON/text audit log |
| `InputDate` | `inputdate` | Date record was created |
| `InputBy` | `inputby` | Who created the record |
| `UpdateDate` | `updatedate` | Last update date |
| `UpdateBy` | `updateby` | Who last updated |
| `PCP` | `pcp` | Primary Care Physician flag (`Y`/`N`) |
| `Specialist` | `specialist` | Specialist flag |
| `Regular` | `regular` | Regular position flag |
| `Reliever` | `reliever` | Reliever position flag |
| `Visiting` | `visiting` | Visiting position flag |
| `Referring` | `referring` | Referring flag |
| `Schedule` | `schedule` | Schedule description (text) |
| `TimeStart` | `timestart` | Schedule start time |
| `TimeEnd` | `timeend` | Schedule end time |
| `NWDBranch` | `nwdbranch` | Branch duty (text) |

### Requirements Document Fields (stored as `Y`/`N` or date strings)

| Prisma Field | DB Column |
|---|---|
| `ApplicationLetter` | `applicationletter` |
| `CurriculumVitae` | `curriculumvitae` |
| `Diploma` | `diploma` |
| `PRCId` | `prcid` |
| `ResidencyCertificate` | `residencycertificate` |
| `DiplomateCertificate` | `diplomatecertificate` |
| `PhilHealth` | `philhealth` |
| `PTR` | `ptr` |
| `BIR` | `bir` |
| `MOA` | `moa` |

---

## Status Values

| Status | Meaning | Badge Color |
|---|---|---|
| `Pending` | Submitted, awaiting approval | Amber |
| `Active` | Accredited (approved) | Emerald |
| `Declined` | Application declined | Red |
| `Inactive` | Previously active, now inactive | Slate |

---

## Sub-tabs

### 1. For Approval

Shows records with `Status = 'Pending'`.

**Table Columns:**

| Column | Field |
|---|---|
| Full Name | `fullname` |
| PRC No. | `prcno` |
| Specialization | `"Degree"` |
| Branch | `branchcode` |
| Requested By | `requestorby` |
| Requested Date | `inputdate` |
| Updated By | `updateby` |
| Updated Date | `updatedate` |
| Status | `status` |
| Reason to Disapprove | `declinereason` |
| Actions | Approve / Decline buttons |

**Actions:**
- **Create** button → opens Physician Accreditation Form (new application)
- **Refresh** button → reloads the table
- Per-row **Approve** → sets `Status = Active`, `ApproveBy = session.user.name`
- Per-row **Decline** → prompts for `DeclineReason`, sets `Status = Declined`

**Sortable columns:** Full Name, PRC No., Specialization, Branch, Requested Date

---

### 2. Accredited Physicians

Shows records with `Status = 'Active'`.

**Table Columns:**

| Column | Field |
|---|---|
| Full Name | `fullname` |
| PRC No. | `prcno` |
| Specialization | `"Degree"` |
| Position | position flags (`PCP`, `Specialist`, `Regular`, `Reliever`, `Visiting`) |
| Position Status | composite from position flags |
| Branch Duty | `nwdbranch` |
| Schedule Day | `schedule` |
| Schedule Start | `timestart` |
| Schedule End | `timeend` |

**Features:**
- Per-column search inputs above each column header
- Click row → opens form pre-filled with physician's data (edit mode)
- Sortable columns: Full Name, PRC No., Specialization, Branch Duty

---

## Physician Accreditation Form

Used for both **Create** (new application) and **Edit** (pre-filled row click).

### Section 1: Personal Data

| Field | Type | DB Column |
|---|---|---|
| Last Name | text | `lastname` |
| First Name | text | `firstname` |
| Middle Name | text | `middlename` |
| Suffix | text | `suffix` |
| Date of Birth | date | `dob` |
| PRC No. | text | `prcno` |
| PRC Validity | date | `prcvalidity` |
| Specialization | text | `"Degree"` |
| Group | text | `"Group"` |
| Sub-Group | text | `subgroup` |
| Email | email | `email` |
| Mobile | text | `mobile` |

### Section 2: Clinic Schedule

| Field | Type | DB Column |
|---|---|---|
| Branch Code | text (3 chars) | `branchcode` |
| NWD Branch | textarea | `nwdbranch` |
| Schedule | textarea | `schedule` |
| Time Start | time | `timestart` |
| Time End | time | `timeend` |
| By Appointment | select (Y/N) | `byappointment` |

### Section 3: Position

Checkboxes (Y/N stored as string):

| Field | DB Column |
|---|---|
| PCP (Primary Care Physician) | `pcp` |
| Specialist | `specialist` |
| Regular | `regular` |
| Reliever | `reliever` |
| Visiting | `visiting` |
| Referring | `referring` |
| Resign Doctor | `resigndoctor` |

### Section 4: Requirements

Checkboxes (Y/N or mark as submitted):

| Field | DB Column |
|---|---|
| Application Letter | `applicationletter` |
| Curriculum Vitae | `curriculumvitae` |
| Diploma | `diploma` |
| PRC ID | `prcid` |
| Residency Certificate | `residencycertificate` |
| Diplomate Certificate | `diplomatecertificate` |
| PhilHealth | `philhealth` |
| PTR | `ptr` |
| BIR | `bir` |
| MOA | `moa` |

---

## API Routes

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/physician/accreditation` | List physicians (paginated, filtered by status) |
| POST | `/api/physician/accreditation` | Create new physician application |
| GET | `/api/physician/accreditation/[id]` | Get single physician details |
| PATCH | `/api/physician/accreditation/[id]` | Update physician record |
| PATCH | `/api/physician/accreditation/[id]/approve` | Approve application (Status → Active) |
| PATCH | `/api/physician/accreditation/[id]/decline` | Decline application (Status → Declined + reason) |

### GET /api/physician/accreditation

Query params:
- `status` — `pending` | `active` | `declined` | `inactive` (defaults to `pending`)
- `search` — searches `fullname`, `prcno`
- `page`, `pageSize`

### POST /api/physician/accreditation

Body: all form section fields.
Sets: `Status = 'Pending'`, `InputDate = now`, `InputBy = session.user.name`, `RequestorBy = session.user.name`, `SystemUpdateTime = now`

### PATCH /api/physician/accreditation/[id]

Body: any subset of form fields.
Sets: `UpdateDate = now`, `UpdateBy = session.user.name`

### PATCH /api/physician/accreditation/[id]/approve

Sets: `Status = 'Active'`, `ApproveBy = session.user.name`, `UpdateDate = now`

### PATCH /api/physician/accreditation/[id]/decline

Body: `{ declineReason: string }`
Sets: `Status = 'Declined'`, `DeclineReason`, `ApproveBy = session.user.name`, `UpdateDate = now`

---

## Files

| File | Purpose |
|---|---|
| `src/app/(dashboard)/eros/physician/page.tsx` | Server page with auth guard |
| `src/components/eros/physician-accreditation-client.tsx` | Main client component (two sub-tabs) |
| `src/components/eros/physician-form-modal.tsx` | Create/Edit modal form |
| `src/app/api/physician/accreditation/route.ts` | GET list + POST create |
| `src/app/api/physician/accreditation/[id]/route.ts` | GET single + PATCH update |
| `src/app/api/physician/accreditation/[id]/approve/route.ts` | PATCH approve |
| `src/app/api/physician/accreditation/[id]/decline/route.ts` | PATCH decline |
| `docs/physician-accreditation.md` | This file |

---

## Sidebar Entry

Added to `src/components/layouts/sidebar.tsx` under EROS navigation:

```
{ label: "Physician Accreditation", href: "/eros/physician", icon: <UserCheck />, module: "erosui", tab: "physician" }
```
