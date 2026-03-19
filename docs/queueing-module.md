# CMS v3 — Kiosk Queueing Module

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Tables](#database-tables)
3. [Status Reference](#status-reference)
4. [Role & Workstation Access](#role--workstation-access)
5. [End-to-End Patient Flow](#end-to-end-patient-flow)
   - [Stage 0: Queue Creation (Entry Point)](#stage-0-queue-creation-entry-point)
   - [Stage 1: Reception Queue](#stage-1-reception-queue)
   - [Stage 2: Vital Signs Queue](#stage-2-vital-signs-queue)
   - [Stage 3: Consultation Queue](#stage-3-consultation-queue)
   - [Stage 4: Extraction / Laboratory Queue](#stage-4-extraction--laboratory-queue)
   - [Stage 5: Imaging Queue](#stage-5-imaging-queue)
   - [Stage 6: Payment Processing](#stage-6-payment-processing)
   - [Stage 7: Releasing Queue (Exit Point)](#stage-7-releasing-queue-exit-point)
6. [Workstation Management](#workstation-management)
7. [API Routes](#api-routes)
8. [UI Pages & Components](#ui-pages--components)
9. [All Possible Scenarios & Error States](#all-possible-scenarios--error-states)
10. [Implementation Status](#implementation-status)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PATIENT JOURNEY (Linear Flow)                    │
│                                                                     │
│  [Queue Created] → [Reception] → [Vital Signs] → [Consultation]    │
│                                                         │           │
│                         [Extraction / Lab]  ←──────────┘           │
│                         [Imaging]          (parallel or skipped)   │
│                                  │                                  │
│                             [Payment]  ← can happen any time       │
│                                  │                                  │
│                           [Releasing] ← PROCESS ENDS HERE          │
└─────────────────────────────────────────────────────────────────────┘
```

- **Queue Creation** is handled by the CMS queue module (your supervisor's module — do not touch).
- **All kiosk stages** (Reception → Releasing) are handled by this module.
- `kiosk_queue.station` drives which queue page a patient appears on.
- `kiosk_queue.status` drives what state they are in at each station.
- Auto-refresh every 10 seconds on all queue pages.

---

## Database Tables

### `kiosk_counter` — Workstation Registry

| Column | Type | Notes |
|---|---|---|
| `id` | Int PK | Auto-increment |
| `station_number` | VarChar(20) | Display label (e.g. `"Station 1"`) |
| `ipv4` | VarChar(45) | Workstation IP address |
| `department` | VarChar(50) | **Exact, case-sensitive** — see values below |
| `location` | VarChar(100) | Imaging subgroup only (e.g. `XRAY`, `ULTRASOUND`) |
| `idbu` | VarChar(10) | Branch / clinic code |
| `input_by` | VarChar(50) | Username who registered it |
| `input_date` | DateTime | Registration date |
| `update_by` | VarChar(50) | Username of last editor |
| `update_date` | DateTime | Last edit date |

**Valid `department` values (case-sensitive — mismatched case = workstation not found):**

| Queue Page | `department` value |
|---|---|
| Reception Queue | `Reception` |
| Extraction / Lab Queue | `Extraction` |
| Vital Signs Queue | `Vital Signs` |
| Consultation Queue | `Consultation` |
| Imaging Queue | `Imaging` |
| Releasing Queue | `Releasing` |

---

### `kiosk_queue` — Queue Entries

| Column | Type | Notes |
|---|---|---|
| `id` | Int PK | Auto-increment |
| `queue_id` | BigInt | FK → `queue.id` (CMS queue record) |
| `idbu` | VarChar(10) | Branch / clinic code |
| `station` | VarChar(50) | Current department (lowercase, see map below) |
| `status` | VarChar(30) | See status values |
| `id_physician` | BigInt | Assigned physician — used in Consultation to filter queue |
| `priority` | Int | `4` = VIP patient (shown with Crown badge, amber row highlight) |
| `call_count` | Int | Times called (default 0) |
| `room` | VarChar(50) | Current room assignment |
| `input_by` | VarChar(50) | Username who created the entry |
| `created_at` | DateTime | Auto (used for today's queue filter) |
| `updated_at` | DateTime | Auto-updated on every status change |

**`station` field values (lowercase in v3):**

| Department | `station` value |
|---|---|
| Reception | `reception` |
| Extraction / Lab | `extraction` |
| Vital Signs | `vitalsigns` |
| Consultation | `consultation` |
| Imaging | `imaging` |
| Releasing | `releasing` |

> Note: v1 CMS used uppercase comma-separated strings in a single `Station` field (e.g. `"VITAL, CONSULTATION, LABORATORY"`). In v3 each row in `kiosk_queue` represents the patient at **one specific station** at a time. Moving to the next department = updating `station` + resetting `status`.

---

## Status Reference

### `kiosk_queue.status` — String Values

| Value | Meaning | UI Display |
|---|---|---|
| `startQueue` | Patient just entered the queue | blue "Start Queue" badge |
| `waiting` | In queue, not yet called | amber "Waiting" badge |
| `in_progress` | Currently being served at this station | blue "In Progress" badge |
| `on_hold` | Station paused (e.g. patient stepped out) | orange "On Hold" badge |
| `resume_queue` | Resumed from hold | blue badge |
| `next_room` | Being moved to next department | slate badge |
| `completed` | Finished this station / full visit done | green "Done" badge |
| `exit` | Left the system | slate badge |

### Active statuses (fetched on queue pages)
```
["waiting", "in_progress", "startQueue", "on_hold", "resume_queue", "completed"]
```

### `queue.status` — CMS Queue Numeric Codes (reference only — owned by supervisor's module)

| Code | Meaning |
|---|---|
| `201` | For Billing — initial status on queue creation |
| `230` | Ready for Vital Signs |
| `250` | Vital Signs done |
| `260`–`280` | Consultation stages |
| `300`–`303` | Specimen / Lab processing (`301` = received, `303` = partial) |
| `400`–`420` | Processing ongoing |
| `500`–`600` | Completed / Released |
| `650` | Finalized / Exited |
| `900` | Rejected / Cancelled |

---

## Role & Workstation Access

Every kiosk queue page enforces **two independent checks**. Both must pass.

### Check 1 — Role (Session-based RBAC)

Login → `users.role` JSON array is parsed → each `[KIOSK-*]` tag maps to `module + tab` via `ROLE_ACCESS_MAP` in `rbac.ts` → `requireAuth(module, tab)` called on every page server component.

| Role Tag | module | tab | URL |
|---|---|---|---|
| `[KIOSK-RECEPTION]` | `kiosk` | `receptionqueue` | `/queue/kiosk/reception` |
| `[KIOSK-LABORATORY]` | `kiosk` | `extractionqueue` | `/queue/kiosk/extraction` |
| `[KIOSK-IMAGING]` | `kiosk` | `imagingqueue` | `/queue/kiosk/imaging` |
| `[KIOSK-NURSE]` | `kiosk` | `vitalsignsqueue` | `/queue/kiosk/vitalsigns` |
| `[KIOSK-CONSULTATION]` | `kiosk` | `consultationqueue` | `/queue/kiosk/consultation` |
| `[KIOSK-RELEASING]` | `kiosk` | `releasingqueue` | `/queue/kiosk/releasing` |
| `[WORKSTATION]` | `erosui` | `workstation` | Admin Settings → Workstation tab |

### Check 2 — Workstation (IP-based)

The API reads the client IP from request headers (`x-forwarded-for` → `x-real-ip`) and queries `kiosk_counter` for a matching `ipv4 + department` row.

```
GET /api/kiosk/queue?department=Reception&idbu=DTU
  → server looks up kiosk_counter WHERE ipv4 = <client IP> AND department = 'Reception'
  → NOT FOUND → returns empty rows + UI shows warning banner:
      "No queue data found. This workstation IP may not be registered
       for the Reception department. Contact ICT to register it."
  → FOUND → returns today's queue rows for that department + branch
```

> Currently the workstation check produces a **warning** (not a hard block). Future enhancement: return HTTP 403 if IP not registered.

---

## End-to-End Patient Flow

---

### Stage 0: Queue Creation (Entry Point)

**Module:** CMS (supervisor's module — do not modify)
**Who:** Reception staff / CSR

#### What Happens (v1 reference — not implemented in this module)
```
Staff opens /cms/queue → fills in patient details + selects services
    ↓
INSERT into queue (CMS queue table)
    Status: 201
    Fields: IdPatient, QFullName, QGender, AgePatient, AccessionNo, IdBU, DateTime, Code

INSERT into kiosk_queue
    status: 'startQueue'
    station: 'reception'   ← first stop (or first required department)
    queue_id: → queue.id
    idbu: clinic code
    priority: 0 (or 4 for VIP)
    call_count: 0
```

- The `station` field is set based on the patient's selected services.
- A patient with only lab tests could start at `extraction` (skipping reception, vitals, consultation).
- In the original v1 CMS, a single `Station` field held a comma-separated list of all remaining departments. In v3 each row represents **one station at a time**; moving to next station updates the same row.

---

### Stage 1: Reception Queue

**URL:** `/queue/kiosk/reception`
**Page file:** `src/app/(dashboard)/queue/kiosk/reception/page.tsx`
**Role required:** `[KIOSK-RECEPTION]`
**Counter Department:** `Reception`
**Props:** `showHoldResume` ✓ `showCallCount` ✓ `showExit` ✓ `showComplete` ✓

#### Queue Population
```
kiosk_queue WHERE station = 'reception'
             AND status IN ['waiting','in_progress','startQueue','on_hold','resume_queue','completed']
             AND created_at >= today
             AND idbu = <branch from workstation lookup>
```

#### Actions

| Button | Condition Shown | API Call | DB Write |
|---|---|---|---|
| **Call** | Any active status | `PATCH /api/kiosk/[id]/action` `{action:"call"}` | `status → in_progress`, `call_count++` |
| **Hold** | `in_progress` or `resume_queue` | `{action:"hold"}` | `status → on_hold` |
| **Resume** | `on_hold` | `{action:"resume"}` | `status → resume_queue` |
| **Exit** | Any | `{action:"exit"}` | `status → next_room` |
| **Complete** | Any | `{action:"complete"}` | `status → completed` |

#### v1 Additional Logic (not yet in v3 — future work)
- **Patient code assignment:** `KioskPatient.Code` set + `ErosPatient` record created/updated
- **Station routing:** Remove `reception` from station list; if empty → `status='complete'`, `station='exit'`; else → `status='next_room'`
- **Skip vitals:** Replace `VITAL` with `CONSULTATION` in station list
- **Action logs:** Insert into `Queuing.Logs` (KioskId, Action, ActionBy, Room, DateTime)

---

### Stage 2: Vital Signs Queue

**URL:** `/queue/kiosk/vitalsigns`
**Page file:** `src/app/(dashboard)/queue/kiosk/vitalsigns/page.tsx`
**Role required:** `[KIOSK-NURSE]`
**Counter Department:** `Vital Signs`
**Props:** `showHoldResume` ✓ `showCallCount` ✓ `showExit` ✓ `showComplete` ✓

#### Queue Population
```
kiosk_queue WHERE station = 'vitalsigns'
             AND status IN active statuses
             AND created_at >= today
```

#### Actions

| Button | API Action | DB Write |
|---|---|---|
| **Call** | `call` | `status → in_progress`, `call_count++` |
| **Hold** | `hold` | `status → on_hold` |
| **Resume** | `resume` | `status → resume_queue` |
| **Exit** | `exit` | `status → next_room` |
| **Complete** | `complete` | `status → completed` |

#### v1 Additional Logic (not yet in v3 — future work)
- **Record vitals:** UPDATE/INSERT `vitalsign` table (BP, Temp, Weight, Height, BMI, etc.) linked via `queue_id`
- **CMS status update:** `queue.status → 250` (Vital Signs done)
- **Move to Consultation:** `station → consultation`, `status → next_room`, `call_count = 0`, `room = 'Lobby'`
- **v1 filter:** `kiosk_queue WHERE station LIKE '%VITAL%' AND queue.status = 230`

---

### Stage 3: Consultation Queue

**URL:** `/queue/kiosk/consultation`
**Page file:** `src/app/(dashboard)/queue/kiosk/consultation/page.tsx`
**Role required:** `[KIOSK-CONSULTATION]`
**Counter Department:** `Consultation`
**Props:** `showHoldResume` ✓ `showCallCount` ✓ `showExit` ✓ `showComplete` ✓

#### Queue Population
```
kiosk_queue WHERE station = 'consultation'
             AND status IN active statuses
             AND created_at >= today
```

> v1 additional filter: `AND id_physician = <logged-in doctor's physician ID>` — each doctor only sees their own patients. This filter requires mapping `users.id` → `physician.id` (not yet implemented in v3).

#### VIP Patients
Patients with `priority = 4` are highlighted:
- Crown icon in the patient name cell
- Amber background on the entire row

#### Actions

| Button | API Action | DB Write |
|---|---|---|
| **Call** | `call` | `status → in_progress`, `call_count++` |
| **Hold** | `hold` | `status → on_hold` |
| **Resume** | `resume` | `status → resume_queue` |
| **Exit** | `exit` | `status → next_room` |
| **Complete** | `complete` | `status → completed` |

#### v1 Additional Logic (not yet in v3 — future work)
- **Physician mapping check:** `SELECT id FROM physician WHERE empid = <user.access_map_id>` — if missing, page shows error: `"Missing Physician EmpId Mapping, please contact ICT helpdesk"`
- **CMS status update:** `queue.status → 300` (ready for lab/imaging)
- **Move to next:** Remove `consultation` from station list; `status → next_room`
- **Edit view:** Load transactions, HMO package items, vitals for this queue

---

### Stage 4: Extraction / Laboratory Queue

**URL:** `/queue/kiosk/extraction`
**Page file:** `src/app/(dashboard)/queue/kiosk/extraction/page.tsx`
**Role required:** `[KIOSK-LABORATORY]`
**Counter Department:** `Extraction`
**Props:** `showHoldResume` ✓ `showCallCount` ✓ `showExit` ✓ `showComplete` ✓

#### Queue Population
```
kiosk_queue WHERE station = 'extraction'
             AND status IN active statuses
             AND created_at >= today
```

> v1 filter also included `station LIKE '%drug test%'` for drug test procedures shown in a separate section.
> v1 CMS queue status filter: `queue.status BETWEEN 210 AND 650`

#### Actions

| Button | API Action | DB Write |
|---|---|---|
| **Call** | `call` | `status → in_progress`, `call_count++` |
| **Hold** | `hold` | `status → on_hold` |
| **Resume** | `resume` | `status → resume_queue` |
| **Exit** | `exit` | `status → next_room` |
| **Complete** | `complete` | `status → completed` |

#### v1 Additional Logic (not yet in v3 — future work)
- **Receive specimen:** INSERT into `Receiving` (IdQueue, IdTransaction, ItemCode, DateReceived, ReceivedBy, Status='Received')
- **Partial vs Full receipt logic:**
  - All items received → `Transactions.Status = 301`
  - Some items received → `Transactions.Status = 303`
- **AccessionNo update:** `status → 301`
- **Hold room logic:** Comma-separated `OnHold` field tracks multiple rooms on hold per workstation
- **Resume room:** Remove specific room from `OnHold`

---

### Stage 5: Imaging Queue

**URL:** `/queue/kiosk/imaging`
**Page file:** `src/app/(dashboard)/queue/kiosk/imaging/page.tsx`
**Role required:** `[KIOSK-IMAGING]`
**Counter Department:** `Imaging`
**Props:** `showHoldResume` ✓ `showCallCount` ✓ `showExit` ✓ `showComplete` ✓

#### Queue Population
```
kiosk_queue WHERE station = 'imaging'
             AND status IN active statuses
             AND created_at >= today
```

#### Imaging Subgroup / Location Filtering (v1 logic — future work for v3)
```
kiosk_counter WHERE ipv4 = <client IP> AND department = 'Imaging'
    → pluck('location')  e.g. ['XRAY', 'ULTRASOUND']

Show only procedures matching those imaging subgroups.
```
- One physical machine can handle multiple imaging types by having multiple `kiosk_counter` rows with the same IP, same `department='Imaging'`, but different `location` values.
- If `location` is empty → no procedures shown (must be configured).

#### Actions

| Button | API Action | DB Write |
|---|---|---|
| **Call** | `call` | `status → in_progress`, `call_count++` |
| **Hold** | `hold` | `status → on_hold` |
| **Resume** | `resume` | `status → resume_queue` |
| **Exit** | `exit` | `status → next_room` |
| **Complete** | `complete` | `status → completed` |

#### v1 Additional Logic (not yet in v3 — future work)
- Same specimen receiving pattern as Extraction: INSERT Receiving, UPDATE AccessionNo + Transactions
- `edit?department=XRAY,ULTRASOUND` query param on edit view — passes imaging departments for this workstation

---

### Stage 6: Payment Processing

**Module:** CMS (supervisor's module — do not modify)
**URL:** `/payment`
**Role:** `[PAYMENT]`

Payment can be processed at **any point** during the visit — it is not blocked by lab/imaging completion. The CMS queue status range `201–650` covers the entire active visit window.

---

### Stage 7: Releasing Queue (Exit Point)

**URL:** `/queue/kiosk/releasing`
**Page file:** `src/app/(dashboard)/queue/kiosk/releasing/page.tsx`
**Role required:** `[KIOSK-RELEASING]`
**Counter Department:** `Releasing`
**Props:** `showComplete` ✓ only — no Hold/Resume, no Call Count, no Exit

#### Queue Population
```
kiosk_queue WHERE station = 'releasing'
             AND status IN active statuses
             AND created_at >= today
```

#### Actions

| Button | API Action | DB Write |
|---|---|---|
| **Call** | `call` | `status → in_progress` |
| **Complete** | `complete` | `status → completed` ← **process ends here** |

No hold/resume. No call counter. No exit. Patient is done when staff clicks Complete.

> v1 logic: `Kiosk.Station → 'exit'`, `Kiosk.Status → 'complete'` on exit. v3 equivalent: `status → 'completed'`.

---

## Workstation Management

Workstation management lives in **Admin Settings** (`/settings`) — not a separate sidebar route.

Users with `[WORKSTATION]` role see the **Workstations** sub-tab inside Admin Settings.

### UI Features
- Table list: Station Number, IP Address, Department, Location, Branch
- Click a row → expands inline edit form with audit info (Created by, Date Created, Update by, Update date)
- Register Workstation button → shows add form above table
- **Services sub-tab:** Diagnostic tools — Ping, Check Your IP, Jasper Server, Socket, SQL, HL7 — with branch dropdown, network command buttons (Center, DNS, Gateway, Traceroute), result box, Go button

### Register via UI
Admin Settings → Workstation Management → Register Workstation
Required fields: IP Address, Department
Optional: Station Number, Location (for Imaging), Branch

### Register via SQL
```sql
INSERT INTO kiosk_counter (station_number, ipv4, department, location, idbu, input_by, input_date)
VALUES
  ('1', '10.10.x.x', 'Reception',   '',           'DTU', 'admin', NOW()),
  ('2', '10.10.x.x', 'Extraction',  '',           'DTU', 'admin', NOW()),
  ('3', '10.10.x.x', 'Consultation','',           'DTU', 'admin', NOW()),
  ('4', '10.10.x.x', 'Releasing',   '',           'DTU', 'admin', NOW()),
  ('5', '10.10.x.x', 'Imaging',     'XRAY',       'DTU', 'admin', NOW()),
  ('6', '10.10.x.x', 'Imaging',     'ULTRASOUND', 'DTU', 'admin', NOW()),
  ('7', '10.10.x.x', 'Vital Signs', '',           'DTU', 'admin', NOW());
```

---

## API Routes

All routes require session auth (`requireApiAuth`). Current auth tag: `cms/queue`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/kiosk/queue?department=&idbu=` | Fetch today's queue for a department + branch. Joins `queue` table for patient info. |
| POST | `/api/kiosk/queue` | Create a kiosk queue entry. Body: `{ queue_id, station, idbu, id_physician?, priority? }` |
| PATCH | `/api/kiosk/[id]/action` | Perform an action on a queue entry. Body: `{ action, room? }` |
| GET | `/api/kiosk/counter` | List all registered workstations |
| POST | `/api/kiosk/counter` | Register new workstation. Body: `{ station_number, ipv4, department, location, idbu }` |
| PATCH | `/api/kiosk/counter/[id]` | Update workstation |
| DELETE | `/api/kiosk/counter/[id]` | Remove workstation |
| GET | `/api/kiosk/services?tool=&branch=&cmd=` | Diagnostic tools: `ping`, `checkip`, `jasper`, `socket`, `sql`, `hl7` |

### Action values for `PATCH /api/kiosk/[id]/action`

| `action` | Effect |
|---|---|
| `call` | `status → in_progress`, `call_count++` |
| `in_progress` | `status → in_progress` (no count increment) |
| `hold` | `status → on_hold` |
| `resume` | `status → resume_queue` |
| `complete` | `status → completed` |
| `exit` | `status → next_room` |
| `update_room` | `room → <value>` (requires `room` in body) |

---

## UI Pages & Components

### Pages

| File | URL | Role Guard |
|---|---|---|
| `src/app/(dashboard)/queue/kiosk/page.tsx` | `/queue/kiosk` | `cms/queue` |
| `src/app/(dashboard)/queue/kiosk/reception/page.tsx` | `/queue/kiosk/reception` | `kiosk/receptionqueue` |
| `src/app/(dashboard)/queue/kiosk/extraction/page.tsx` | `/queue/kiosk/extraction` | `kiosk/extractionqueue` |
| `src/app/(dashboard)/queue/kiosk/imaging/page.tsx` | `/queue/kiosk/imaging` | `kiosk/imagingqueue` |
| `src/app/(dashboard)/queue/kiosk/vitalsigns/page.tsx` | `/queue/kiosk/vitalsigns` | `kiosk/vitalsignsqueue` |
| `src/app/(dashboard)/queue/kiosk/consultation/page.tsx` | `/queue/kiosk/consultation` | `kiosk/consultationqueue` |
| `src/app/(dashboard)/queue/kiosk/releasing/page.tsx` | `/queue/kiosk/releasing` | `kiosk/releasingqueue` |

### Components

| File | Purpose |
|---|---|
| `src/components/kiosk/kiosk-landing-client.tsx` | Department card grid on landing page. Allowed queues = colored cards. No-access queues = grayed Lock cards. |
| `src/components/kiosk/kiosk-queue-client.tsx` | Shared queue table for all 6 departments. Props control which buttons show. |
| `src/components/kiosk/workstation-client.tsx` | Workstation list + click-to-expand edit + Services diagnostic sub-tab. |

### `KioskQueueClient` Props

| Prop | Type | Effect |
|---|---|---|
| `department` | string | Used in API query and workstation lookup |
| `departmentLabel` | string | Page heading |
| `color` | string | Tailwind color theme |
| `showHoldResume` | boolean | Show Hold / Resume buttons |
| `showCallCount` | boolean | Show "Called" column |
| `showExit` | boolean | Show Exit button |
| `showComplete` | boolean | Show Complete button |

### Per-department prop configuration

| Department | Hold/Resume | Call Count | Exit | Complete |
|---|---|---|---|---|
| Reception | ✓ | ✓ | ✓ | ✓ |
| Extraction | ✓ | ✓ | ✓ | ✓ |
| Imaging | ✓ | ✓ | ✓ | ✓ |
| Vital Signs | ✓ | ✓ | ✓ | ✓ |
| Consultation | ✓ | ✓ | ✓ | ✓ |
| Releasing | ✗ | ✗ | ✗ | ✓ |

---

## All Possible Scenarios & Error States

### Scenario 1: Normal Full Visit ✅
Patient goes through all stages in order. Final state: `status = 'completed'` on the Releasing station.

### Scenario 2: Partial Visit (Lab Only) ✅
Patient only needs lab — created directly in `extraction` station. Does not appear in Reception, Vital Signs, Consultation, or Imaging queues.

### Scenario 3: VIP Patient ✅
`kiosk_queue.priority = 4` — Crown badge shown in patient name cell, row highlighted amber. All actions work the same.

### Scenario 4: Missing `[KIOSK-*]` Role ❌
User does not have the required role tag.
- **Result:** `requireAuth` → redirect to login / 403 before page loads
- **Fix:** Add role tag via Admin Settings → User Management → edit user → Kiosk Queues group

### Scenario 5: IP Not Registered in `kiosk_counter` ⚠️
Workstation IP has no matching row.
- **Result:** API returns empty rows; UI shows warning: `"No queue data found. This workstation IP may not be registered..."`
- **Fix:** Register the IP in Admin Settings → Workstation Management

### Scenario 6: Wrong Department Case ❌
`kiosk_counter.department = 'reception'` instead of `'Reception'`.
- **Result:** Same "not registered" warning — WHERE clause finds nothing
- **Fix:** Use exact case-sensitive strings: `Reception`, `Extraction`, `Vital Signs`, `Consultation`, `Imaging`, `Releasing`

### Scenario 7: Behind Proxy / NAT ⚠️
`x-forwarded-for` returns proxy IP instead of actual workstation IP.
- **Result:** Workstation lookup fails
- **Fix:** Configure the proxy to pass the real client IP in `x-forwarded-for`. For Next.js on a reverse proxy, set `TRUST_HOST=true` or configure the proxy to forward the header.

### Scenario 8: Multiple Departments on One Machine ✅
Insert multiple rows in `kiosk_counter` with the same `ipv4`, different `department`. Each queue page does an independent lookup — no conflict.

### Scenario 9: Imaging — Empty Location ⚠️
`kiosk_counter.location` is NULL or empty for an Imaging workstation.
- **Result:** Imaging subgroup filter returns nothing — empty queue
- **Fix:** Set `location` to the imaging subgroup name (e.g. `XRAY`, `ULTRASOUND`)

### Scenario 10: Consultation — No Physician Filter ⚠️
`kiosk_queue.id_physician` is NULL or not set on consultation rows.
- **Result:** All consultation patients shown (no per-doctor filtering)
- **Fix (v3 future):** Set `id_physician` on queue creation; map logged-in user → `physician.id`

### Scenario 11: Patient Stuck in Queue ⚠️
Patient completed a stage but `status` was never updated (staff forgot to click Complete/Exit).
- **Result:** Patient keeps appearing in that station's queue
- **Fix:** Manually update `kiosk_queue.status` to `completed` or `next_room` via DB, or add an admin "force complete" action to the UI

### Scenario 12: Session Expired ❌
NextAuth session times out.
- **Result:** All page guards redirect to login
- **Fix:** Re-login — session rebuilt from `users.role` on authentication

### Scenario 13: Role Tag Format Error ❌
`users.role` has `[kiosk-reception]` (wrong case) or `"[KIOSK-RECEPTION]"` (extra quotes).
- **Result:** `ROLE_ACCESS_MAP` lookup finds no match → no access granted
- **Fix:** Role must be exactly `[KIOSK-RECEPTION]` as a string in the JSON array (e.g. `["[KIOSK-RECEPTION]","[QUEUE]"]`)

### Scenario 16: Same IP, Same Department — Multiple Rows ✅
(e.g. two `Imaging` rows with same IP, different `location`)
Each queue page fetches all matching rows → workstation is authorized and both subgroups are shown.

### Scenario 17: `queue_id` not linked ⚠️
`kiosk_queue.queue_id` is NULL or does not match any `queue.id`.
- **Result:** Patient name, accession no, gender, age all show `null` / `—`
- **Fix:** Ensure queue creation sets `queue_id` from the CMS queue record

---

## Implementation Status

### Completed ✅
- `kiosk_counter` and `kiosk_queue` tables pushed to DB (`prisma db push`)
- RBAC role tags: all 6 `[KIOSK-*]` tags + `[WORKSTATION]` in `ROLE_ACCESS_MAP`
- All 6 department page files with correct role guards
- Shared `KioskQueueClient` component with 10-second auto-refresh, VIP highlight, action buttons
- `KioskLandingClient` department card grid
- All API routes: queue CRUD, counter CRUD, services diagnostic
- Workstation management in Admin Settings (not a separate sidebar route)
- `[WORKSTATION]` role added to `[WORKSTATION]` permission group in User Management
- Sidebar: "Queueing - Kiosk" → `/queue/kiosk`; active highlight fix (exact path match)

### Pending / Future Work 🔲
- Queue creation: POST from CMS module to `kiosk_queue` on new patient entry
- Station routing logic: move patient to next station after Complete / Exit
- Vital signs recording form (linked to `vitalsign` table via `queue_id`)
- CMS `queue.status` updates after each stage (230 → 250 → 300 etc.)
- Consultation physician filter (`id_physician` lookup from logged-in user)
- Extraction/Imaging specimen receiving (INSERT into `Receiving` table)
- Partial vs full receipt logic (`Transactions.Status` 301/303)
- Action logs table (`kiosk_logs` or similar)
- Real-time push updates (Socket.io) — currently polling every 10s
- Patient code assignment at Reception (`KioskPatient.Code` sync)
