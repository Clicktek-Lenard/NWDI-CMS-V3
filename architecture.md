# CMS — Clinical Queue Management System
## Architecture & Business Logic Reference
> **Purpose**: Complete reference for replicating this system module-by-module using a modern/futuristic tech stack.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Current Tech Stack (Legacy)](#2-current-tech-stack-legacy)
3. [System Architecture](#3-system-architecture)
4. [Database Architecture](#4-database-architecture)
5. [Core Modules & Business Logic](#5-core-modules--business-logic)
   - [5.1 Authentication & Authorization](#51-authentication--authorization)
   - [5.2 Queue Management](#52-queue-management)
   - [5.3 Patient Management](#53-patient-management)
   - [5.4 Doctor / Medical Evaluation Module](#54-doctor--medical-evaluation-module)
   - [5.5 Kiosk / Queue Display](#55-kiosk--queue-display)
   - [5.6 Specimen & Laboratory Operations](#56-specimen--laboratory-operations)
   - [5.7 Payment & Billing](#57-payment--billing)
   - [5.8 E-Card Enrollment & Management](#58-e-card-enrollment--management)
   - [5.9 Results Management](#59-results-management)
   - [5.10 Reporting & Analytics](#510-reporting--analytics)
   - [5.11 HL7 Integration](#511-hl7-integration)
   - [5.12 External System Integrations](#512-external-system-integrations)
   - [5.13 User & Role Management (Settings)](#513-user--role-management-settings)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [Key Data Flows & Workflows](#7-key-data-flows--workflows)
8. [File & Storage Architecture](#8-file--storage-architecture)
9. [Real-time & Events](#9-real-time--events)
10. [Security Model](#10-security-model)
11. [Suggested Modern Tech Stack (Replication Guide)](#11-suggested-modern-tech-stack-replication-guide)
12. [Module Replication Roadmap](#12-module-replication-roadmap)

---

## 1. Project Overview

**System Name**: NWDI CMS — Clinical Management System
**Client/Org**: BAESA (National Wellness Development Initiative)
**Domain**: Multi-facility healthcare operations — hospitals/clinics

### What This System Does

The CMS is an enterprise healthcare operations platform that manages the full patient journey across multiple clinic/hospital branches:

```
Patient Arrives → Reception/Kiosk Check-in → Queue Assignment
→ Vital Signs → Doctor Consultation → Lab/Imaging
→ Payment & Billing → Results Release → Reporting
```

It acts as the **orchestration layer** between:
- Patients walking into a clinic
- Multiple backend clinical systems (Eros, BizBox, HCLAB)
- Multi-facility operations (8+ branches with Oracle DBs)
- External messaging standards (HL7 v2)

### Scale Indicators
- 157 controller classes across 16 namespaces
- 40+ Eloquent models
- 14 HL7 controllers for multi-facility integration
- 14 route files with 100+ route definitions
- 8+ Oracle database connections for different facilities
- Estimated 50,000+ lines of PHP/JS code

---

## 2. Current Tech Stack (Legacy)

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Laravel | 8.75.x |
| Language | PHP | 7.3 / 8.0+ |
| Auth (API) | Laravel Sanctum | ^2.11 |
| ORM | Eloquent | (Laravel 8) |
| Oracle Driver | yajra/laravel-oci8 | ^8.7 |
| DataTables | yajra/laravel-datatables-oracle | ^9.21 |
| LDAP | directorytree/ldaprecord-laravel | ^2.6 |
| AWS SDK | aws/aws-sdk-php | ^3.231 |
| HTTP Client | guzzlehttp/guzzle | ^7.0 |
| Excel | maatwebsite/excel | ^3.1 |
| PDF | mpdf/mpdf | ^8.0 |
| Spreadsheet | phpoffice/phpspreadsheet | ^1.23 |
| HL7 | aranyasen/hl7 | ^2.1 |
| PDF Merge | webklex/laravel-pdfmerger | ^1.3 |
| CORS | fruitcake/laravel-cors | ^2.0 |
| SSH Tunnel | stechstudio/laravel-ssh-tunnel | ^3.2 |
| Validation | watson/validating | ^3.1 |
| FPDF | setasign/fpdf + fpdi-protection | ^1.8 / ^2.0 |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| CSS Framework | Tailwind CSS | 3.1.0 |
| Form Plugin | Tailwind Forms | 0.5.2 |
| Interactivity | Alpine.js | 3.4.2 |
| HTTP Client | Axios | 1.7.4 |
| Real-time | Socket.io | 4.7.5 |
| Asset Build | Laravel Mix (Webpack) | 6.0.6 |
| PostCSS | PostCSS + Autoprefixer | 8.4.6 / 10.4.2 |
| Utility | Lodash | 4.17.19 |
| Legacy | jQuery + Bootstrap JS | (mixed) |
| Tables | DataTables JS | (server-side) |

### Databases
| Connection | Engine | Purpose |
|------------|--------|---------|
| default | MySQL | Main CMS application data |
| oraPRODh | Oracle | Production HQ (Eros clinical system) |
| oraCENh | Oracle | Central HQ |
| oraCENe | Oracle | Central extension |
| oraCEBh | Oracle | Cebu branch |
| oraTARe | Oracle | Taguig extension |
| oraSMBh | Oracle | SMB branch HQ |
| oraSMBe | Oracle | SMB branch extension |
| + others | Oracle | Additional facilities/testing |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| File Storage | AWS S3 + local |
| Auth Directory | LDAP / Active Directory |
| Queue | Sync (jobs run inline) |
| Session | File-based |
| Cache | File-based |
| Realtime | Socket.io (Node.js server) |

---

## 3. System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│   Browser (Staff)    Kiosk Terminals    Queue Display Screens│
└──────────┬───────────────┬─────────────────┬────────────────┘
           │               │                 │
           ▼               ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    LARAVEL CMS SERVER                        │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  Queue   │  │  Doctor  │  │  Kiosk   │   │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Lab    │  │ Payment  │  │  E-Card  │  │ Reports  │   │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Middleware Layer                        │  │
│  │  Auth │ CheckCMS (RBAC) │ CSRF │ CORS │ TrustProxy  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────┬──────────────────┬──────────────────────────────┘
           │                  │
    ┌──────▼──────┐   ┌───────▼──────────────────────────────┐
    │  MySQL DB   │   │        External Systems               │
    │  (CMS data) │   │  ┌──────┐ ┌───────┐ ┌──────┐        │
    └─────────────┘   │  │ Eros │ │BizBox │ │HCLAB │        │
                      │  │(ORA) │ │ (ORA) │ │ (ORA)│        │
                      │  └──────┘ └───────┘ └──────┘        │
                      │  ┌──────┐ ┌───────┐ ┌──────┐        │
                      │  │ LDAP │ │Zennya │ │ HL7  │        │
                      │  │ (AD) │ │ API   │ │ Msgs │        │
                      │  └──────┘ └───────┘ └──────┘        │
                      └──────────────────────────────────────┘
```

### Application Layer Structure

```
app/
├── Http/
│   ├── Controllers/           # 157 controllers, 16 namespaces
│   │   ├── Auth/              # 8 standard auth controllers
│   │   ├── cms/               # Main CMS controllers
│   │   │   ├── doctors/       # Doctor module (7 controllers)
│   │   │   │   └── doctorModals/  # 5 modal controllers
│   │   │   ├── pages/
│   │   │   │   ├── queue/     # 16 queue page controllers
│   │   │   │   ├── payment/   # 4 payment page controllers
│   │   │   │   └── enrollment/ # 2 enrollment controllers
│   │   │   ├── queuing/       # 6 kiosk queue controllers
│   │   │   ├── receiving/     # 3 receiving controllers
│   │   │   └── api/           # 9 API controllers
│   │   ├── eros/              # 14 Eros integration controllers
│   │   ├── hclab/             # 7 HCLAB controllers
│   │   ├── hl7/               # 14 HL7 message controllers
│   │   ├── bizbox/            # 2 BizBox controllers
│   │   └── [other modules]
│   ├── Middleware/            # 10 middleware classes
│   └── Requests/              # Form request validation
├── Models/
│   ├── cms/                   # Main CMS models
│   ├── eros/                  # Eros Oracle models
│   ├── hclab/                 # HCLAB Oracle models
│   ├── bizbox/                # BizBox models
│   └── www/                   # WWW models
└── Providers/                 # Service providers
```

### Route File Organization

| File | Purpose | Size |
|------|---------|------|
| `routes/cms.php` | Main CMS routes (largest) | 25,958 bytes |
| `routes/hl7.php` | HL7 multi-facility routes | Large |
| `routes/web.php` | App entry + CRON-like sync routes | Medium |
| `routes/auth.php` | Authentication routes | Small |
| `routes/api.php` | REST API (minimal) | Small |
| `routes/sync.php` | Data synchronization | Small |
| `routes/cebu.php` | Cebu branch specific | Small |
| `routes/hl7_dtu.php` | DTU facility HL7 | Small |
| `routes/hl7_up.php` | UP facility HL7 | Small |
| `routes/smb.php` | SMB system routes | Small |
| `routes/lin.php` | LIN system routes | Small |
| `routes/ext.php` | External integrations | Small |
| `routes/channels.php` | Broadcasting channels | Tiny |

---

## 4. Database Architecture

### MySQL Tables (CMS Application DB)

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `users` | id, name, email, password | Staff/system users |
| `students` | (custom) | User extensions |
| `personal_access_tokens` | tokenable_id, token | Sanctum API tokens |
| `failed_jobs` | uuid, payload | Queue failure log |
| `password_resets` | email, token | Password reset tokens |

> **Note**: Most clinical data is NOT in MySQL migrations — it lives in existing Oracle tables accessed via direct model connections.

### Oracle Tables (Eros Clinical System)

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `Patient` | (eros schema) | Patient master |
| `Package` | IdPackage, Code, Description | Service packages |
| `ItemPrice` | IdItemPrice, IdPackage, Price | Package pricing |
| `ItemMasterList` | IdItem, Code, Description | Lab/service items |
| `DiscountType` | IdDiscount, Type, Amount | Discount definitions |
| `BankNames` | IdBank, BankName | Bank reference |
| `AgentEmpName` | IdAgent, Name | Agent/employee reference |
| `Physician` | IdPhysician, Name, License | Physician master |
| `Company` | IdCompany, Name | Company/HMO master |

### CMS Business Tables (MySQL, no formal migrations — managed raw)

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `Queue` | Id, IdPatient, IdCompany, Status, DateTime | Main queue log |
| `Patient` | Id, Name, DOB, Gender | CMS patient demographics |
| `Transactions` | Id, IdQueue, IdItem, Amount | Per-item transactions |
| `Receiving` | Id, IdQueue, BatchCode | Specimen receiving |
| `Sendout` | Id, IdQueue, Destination | Sendout tracking |
| `CardEnrollment` | Id, CardNumber, IdPatient | E-card enrollment |
| `CardNumber` | Id, BatchNumber, SeriesNumber | Card number registry |
| `Verification` | Id, CardNumber, Status | Card verification |
| `KioskLog` | Id, Station, Action, DateTime | Kiosk activity |
| `KioskPatient` | Id, PatientCode | Kiosk patient tracking |
| `QueueDisplay` | Id, DisplayData | Queue screen data |
| `QueNumber` | Id, Prefix, Number, Date | Queue number sequence (HQ) |
| `QueNumberCeb` | Id, Prefix, Number, Date | Queue number sequence (Cebu) |
| `PaymentHistory` | Id, IdQueue, Amount, Method | Payment audit |
| `Counter` | Id, Section, Count | Counter tracking |
| `ErosPatient` | Id, ErosId, CMSId | Eros↔CMS patient map |
| `PhysicianLogs` | Id, IdPhysician, Action | Physician audit |

### Data Conventions

```
Primary Keys  : Non-auto-increment GUIDs/UUIDs stored as Id
Foreign Keys  : IdPatient, IdCompany, IdQueue, IdBU
Status Fields : Integer codes
               100 = Initial/Created
               200 = In Queue / Accession
               300 = Processing / In Progress
               500 = Released / Complete
Timestamps    : Date, DateTime, InputDate, UpdateDate
Audit Columns : InputBy, UpdateBy (user tracking)
Multi-tenant  : IdBU (Business Unit) separates facility data
```

---

## 5. Core Modules & Business Logic

---

### 5.1 Authentication & Authorization

#### Authentication Flow

```
1. User visits / → redirect to /login (if unauthenticated)
2. Login form → AuthenticatedSessionController@store
3. LDAP check → LdapRecord validates against Active Directory
4. On success → session created with user data + role JSON
5. Session variables set:
   - session('userRole')         → JSON string of permissions
   - session('userClinicCode')   → Clinic/branch code (e.g., "BAE")
   - session('userClinicName')   → Display name
   - session('userBU')           → Business Unit code
   - session('userClinicDefault') → Default clinic
6. Redirect to / → loads app.blade.php dashboard
```

#### Role & Permission System

Roles are stored as a JSON string in the session. Each user has one role set:

```json
[
  {
    "module": "cms",
    "tab": "queue",
    "ldap_role": "[KIOSK-RECEPTION]"
  },
  {
    "module": "cms",
    "tab": "doctor",
    "ldap_role": "[DOCTOR-CONSULT]"
  }
]
```

Permission check pattern (in Middleware/CheckCMS.php):
```php
// Check if user has access to module + tab
strpos(session('userRole'), '"module":"cms"') !== false
&& strpos(session('userRole'), '"tab":"queue"') !== false
// Returns HTTP 401 if access denied
```

#### Middleware Stack

| Middleware | Route Group | Effect |
|-----------|------------|--------|
| `auth` | All protected routes | Redirect to login if not authenticated |
| `CMS` | All CMS routes | Module/tab RBAC check |
| `CMS.settings` | Settings routes | Settings-specific RBAC |
| `CSRF` | All web routes | Token validation |
| `cors` | API routes | Cross-origin headers |

#### Key Files
- `app/Http/Middleware/CheckCMS.php` — RBAC enforcement
- `app/Http/Middleware/CheckCMSSettings.php` — Settings RBAC
- `app/Http/Controllers/Auth/AuthenticatedSessionController.php`
- `app/Models/User.php` — `getRoleModule()`, `getBUDefault()`
- `config/ldap.php` — LDAP/AD connection
- `routes/auth.php`

---

### 5.2 Queue Management

#### Queue Lifecycle

```
┌─────────────┐
│  RECEPTION  │ → Patient arrives, card scanned/manual entry
│  (Status 100)│   - Validates e-card (CardEnrollment)
└──────┬──────┘   - Looks up patient in Eros
       │           - Creates Queue record (Status=100)
       │           - Assigns QueNumber (prefix + increment)
       ▼
┌─────────────┐
│   IN QUEUE  │ → Company/HMO accession
│  (Status 200)│   - Transaction items created
└──────┬──────┘   - Package inclusions assigned
       │
       ├──→ Vital Signs Station
       │       - VitalsController records BP, HR, Temp, etc.
       │
       ├──→ Doctor Consultation
       │       - Doctor queue view (doctor.blade.php)
       │       - Medical evaluation form filled
       │
       ├──→ Lab Extraction
       │       - Specimen collected, batch code assigned
       │       - Sent to receiving section
       │
       ├──→ Imaging
       │       - Radiology queue
       │
       ▼
┌─────────────┐
│  PROCESSING │ → Results being prepared
│ (Status 300+)│
└──────┬──────┘
       ▼
┌─────────────┐
│  PAYMENT    │ → PaymentController processes billing
│             │   - Summary generated from Transactions table
└──────┬──────┘   - BizBox payment integration
       ▼
┌─────────────┐
│  RELEASING  │ → Results handed out
│  (Status 500)│   - HL7 message sent to Eros
└─────────────┘   - Queue record closed
```

#### Queue Number Generation
- Prefix (e.g., "A", "B") + zero-padded number per day per station
- Tables: `QueNumber` (main), `QueNumberCeb` (Cebu branch)
- Reset daily

#### Key Queue Queries (app/Models/cms/Queue.php)
```php
Queue::todaysQueue()        // Today's active queue
Queue::pastQueue()          // Historical queue
Queue::todaysQueueID()      // Today's queue IDs only
Queue::BMtodaysQueue()      // Branch manager view
Queue::sendOutQueue()       // Queue items flagged for sendout
Queue::specimenReceiving()  // Items awaiting specimen receipt
```

#### Business Rules
- Only one active queue per patient per day (enforced at creation)
- Queue status progression is one-directional (cannot go backward)
- Branch manager can adjust/antedate queue entries
- HL7 message must be sent when queue reaches payment stage

#### Key Files
- `app/Models/cms/Queue.php`
- `app/Http/Controllers/cms/QueueController.php`
- `app/Http/Controllers/cms/pages/queue/QueuePagePatientController.php`
- `app/Http/Controllers/cms/pages/queue/QueueCardValidationController.php`
- `app/Http/Controllers/cms/BranchManagerModuleController.php`
- `app/Http/Controllers/cms/AdjustedQueueController.php`
- `resources/views/cms/queue.blade.php`
- `resources/views/cms/queueCreate.blade.php`

---

### 5.3 Patient Management

#### Patient Lookup Chain

```
1. Scan/Enter ID → Check CMS Patient table (local)
2. If not found  → Query Eros Oracle (ErosDB model)
3. If not found  → Query Kiosk Patient (KioskPatient)
4. Create new    → insertCheckPatient() validates duplicates
5. Sync back     → ErosPatient table maps CMS ↔ Eros IDs
```

#### Patient Demographics
- Name (First, Middle, Last)
- Date of Birth
- Gender
- Address (with City and Zip lookup via API)
- Contact information
- HMO/Company affiliation (IdCompany)

#### Key Files
- `app/Models/cms/Patient.php` — `postInsert()`, `postUpdate()`, `insertCheckPatient()`
- `app/Http/Controllers/cms/PatientController.php`
- `app/Http/Controllers/cms/ErosPatientServerController.php`
- `app/Http/Controllers/cms/api/QueuePatientController.php`

---

### 5.4 Doctor / Medical Evaluation Module

#### Doctor Workflow

```
Doctor logs in → Sees assigned patients in queue (doctor.blade.php)
→ Selects patient → Opens evaluation form (doctorEdit.blade.php)
→ Records vitals (VitalsController)
→ Fills medical evaluation (MedicalEvaluationController)
→ Performs physical examination (PEController)
→ Assigns PCP doctor (PcpDoctorModalController)
→ Creates doctor's orders (DoctorsOrderModalController)
→ Marks consultation complete (DoctorsCompleteQueueController)
→ Reviews past consultations (DoctorsConsultationHistoryController)
```

#### Evaluation Components

| Component | Controller | View |
|-----------|-----------|------|
| Main queue | `DoctorController` | `doctor.blade.php` |
| Edit/evaluate | `DoctorController` | `doctorEdit.blade.php` |
| Vital signs | `VitalsController` | (modal) |
| Medical evaluation | `MedicalEvaluationController` | `medicalEval.blade.php` |
| Physical exam | `PEController` | (modal) |
| PCP selection | `PcpDoctorModalController` | (modal) |
| Orders | `DoctorsOrderModalController` | (modal) |
| Vital history | `VitalHistoryModalController` | (modal) |
| Complete | `DoctorsCompleteQueueController` | (action) |

#### Key Files
- `app/Http/Controllers/cms/doctors/` — All doctor module controllers
- `app/Http/Controllers/cms/doctors/doctorModals/` — Modal controllers
- `resources/views/cms/doctor.blade.php`
- `resources/views/cms/doctorEdit.blade.php`

---

### 5.5 Kiosk / Queue Display

#### Kiosk Stations

```
┌──────────────────┬──────────────────────────────────────────┐
│ Station          │ Controller                                │
├──────────────────┼──────────────────────────────────────────┤
│ Reception        │ ReceptionQueueController                  │
│ Lab Extraction   │ LaboratoryQueueController                 │
│ Imaging          │ ImagingQueueController                    │
│ Consultation     │ ConsultationQueueController               │
│ Vital Signs      │ VitalSignsQueueController                 │
│ Releasing        │ ReleasingQueueController                  │
└──────────────────┴──────────────────────────────────────────┘
```

#### Queue Display
- `GET /queueDisplay` — Public-facing display screen
- `GET /fetch-queue-data` — JSON polling endpoint
- `GET /fetch-display-data` — Display data JSON
- Uses Socket.io for real-time push updates
- `QueueDisplayController` manages display data

#### Kiosk Operations (LaboratoryQueueController example)
```
1. Staff scans patient barcode at kiosk
2. System fetches patient's queue items for this station
3. Staff confirms receipt / processing
4. Queue status updated + patient code inserted
5. HL7 notification dispatched
6. Next patient called on display screen
```

#### Key Files
- `app/Http/Controllers/cms/queuing/` — All 6 kiosk controllers
- `app/Http/Controllers/cms/QueueDisplayController.php`
- `app/Models/cms/KioskLog.php`, `KioskPatient.php`
- `resources/views/cms/` — Queue display views

---

### 5.6 Specimen & Laboratory Operations

#### Specimen Workflow

```
Blood Drawn (Extraction Queue)
→ Batch Code assigned (JSON structure)
→ Specimen Receiving (SpecimenReceivingController)
    - Register specimen receipt
    - Validate barcode/batch code
    - Or: Reject specimen (with reason → re-collect)
→ Lab Processing
→ Sendout (if external lab needed)
    - SendoutController creates sendout record
    - Transport tracking (TransportController)
→ Results available → ResultUploadingController
→ Results released to patient
```

#### Batch Code Structure
- Stored as JSON in `Receiving` table
- Non-blood batch codes tracked separately
- `BloodBatchCode` vs `NonBloodBatchCode` distinction

#### Specimen Rejection
- Rejection reasons tracked
- Patient returned to extraction queue
- Audit trail maintained

#### Key Files
- `app/Http/Controllers/cms/receiving/SpecimenReceivingController.php`
- `app/Http/Controllers/cms/receiving/TransportController.php`
- `app/Http/Controllers/cms/receiving/LaboratoryReceivingController.php`
- `app/Models/cms/Receiving.php`
- `app/Models/cms/Sendout.php`

---

### 5.7 Payment & Billing

#### Payment Flow

```
Queue reaches Payment stage
→ PaymentController loads transaction summary
→ Fetches items from Transactions table
→ Applies discounts (from CardEnrollment validation)
→ Staff selects payment method:
    - Cash
    - Card (Bank lookup via BankNames)
    - HMO/Company billing
    - Agent/Employee discount (AgentEmpName)
→ BizBox integration for payment processing
→ PaymentHistory record created
→ Queue status updated
→ HL7 UpdateForPaymentQueue fired
→ Eros billing system notified
```

#### Discount Validation
- Card enrollment checked against e-card system
- Discount type fetched from Eros (`DiscountType` table)
- Validation prevents unauthorized discounts

#### Transaction Data Model
```
Queue (1)
  └── Transactions (many)
        - Each item/service is a separate Transaction row
        - IdItem → maps to Eros ItemMasterList
        - IdItemPrice → current pricing
        - Amount, Discount, NetAmount
        - Status flags for billing
```

#### Key Files
- `app/Http/Controllers/cms/PaymentController.php`
- `app/Http/Controllers/cms/pages/payment/` — 4 payment page controllers
- `app/Http/Controllers/cms/TransactionController.php`
- `app/Models/cms/PaymentHistory.php`
- `app/Models/cms/Transactions.php`

---

### 5.8 E-Card Enrollment & Management

#### E-Card Lifecycle

```
Card Generation
→ CardNumberGenController generates batch
→ SeriesNumber + BatchNumber assigned
→ Barcode generated (barcode route)

Card Enrollment
→ ECardRegistrationController
→ Patient demographics captured
→ CardEnrollment record created
→ Card linked to patient (IdPatient)

Card Receiving
→ ECardReceivingController
→ Physical card received from printing
→ Status updated: Received

Card Verification
→ At queue creation: QueueCardValidationController
→ checkCardNumber() validates card exists + active
→ discountValidation() fetches discount entitlement

Card Demographics
→ CardDemographicsController
→ Updates patient info linked to card
```

#### Key Files
- `app/Http/Controllers/cms/CardNumberGenController.php`
- `app/Http/Controllers/cms/ECardRegistrationController.php`
- `app/Http/Controllers/cms/ECardReceivingController.php`
- `app/Http/Controllers/cms/ECardReceivedController.php`
- `app/Http/Controllers/cms/pages/queue/QueueCardValidationController.php`
- `app/Http/Controllers/cms/VerifiedNumbersController.php`
- `app/Http/Controllers/cms/CardDemographicsController.php`
- `app/Models/cms/CardEnrollment.php`
- `app/Models/cms/CardNumber.php`
- `app/Models/cms/Verification.php`

---

### 5.9 Results Management

#### Results Flow

```
Lab/Imaging results generated externally (HCLAB / Eros)
→ ResultUploadingController receives file (Dropzone upload)
→ File stored (local/S3)
→ ResultsMonitoringController tracks status per company
→ ResultCompanyController manages company-level views
→ Results linked to Queue → available for patient/doctor
→ PDF generation for result printout (hPDFController, mPDF)
→ PDF merge if multiple result types (webklex/laravel-pdfmerger)
```

#### Key Files
- `app/Http/Controllers/cms/ResultsMonitoringController.php`
- `app/Http/Controllers/cms/ResultUploadingController.php`
- `app/Http/Controllers/cms/ResultCompanyController.php`
- `app/Http/Controllers/cms/api/hPDFController.php`

---

### 5.10 Reporting & Analytics

#### Report Types

| Report | Controller | Data Source |
|--------|-----------|-------------|
| Daily Sales | `ReportsController` | CMS Transactions |
| Lab Reports | `ReportsLABController` | Lab/Specimen data |
| Sendout Reports | `SendoutreportsController` | Sendout table |
| HMO/Corporate | `HmoCorporateReportsController` | Company billing |
| Turnaround Time | `TurnaroundTimeController` | Queue timestamps |

#### Export Formats
- Excel export via `maatwebsite/excel` + PhpSpreadsheet
- PDF reports via mPDF
- CSV via DataTables export
- All reports filterable by date range, facility, company

---

### 5.11 HL7 Integration

#### Overview
HL7 v2 messages are sent to Eros and other systems at key workflow transitions. Each facility has its own HL7 controller.

#### HL7 Message Triggers

| Event | HL7 Action |
|-------|-----------|
| Queue created | Create HL7 file for facility |
| Queue status change | Update CMS HL7 queue status |
| Payment completed | UpdateForPaymentQueue |
| Specimen received | Notify HCLAB |

#### Facilities with HL7 Controllers

| Code | Facility | Controller |
|------|---------|-----------|
| BAE | BAESA | BAEHL7Controller |
| IMD | IMD | IMDHL7Controller |
| HOM | HOM | HOMHL7Controller |
| ICT | ICT | ICTHL7Controller |
| MED | MED | MEDHL7Controller |
| DTU | DTU | DTUErosHL7Controller |
| UP | UP | (hl7_up.php routes) |
| TAR | Taguig | (hl7.php routes) |
| SMB | SMB | (smb.php routes) |
| + others | Various | (multiple) |

#### HL7 Route Pattern (example)
```
GET /hl7/ICTcmsMakeHL7File      → ICTHL7Controller@cmsMakeHL7File
GET /hl7/ICTupdateCMSHL7QueueStatus → ICTHL7Controller@updateStatus
POST /hl7/ICTUpdateForPaymentQueue  → ICTHL7Controller@updatePayment
```

#### Key Files
- `app/Http/Controllers/hl7/` — 14 facility-specific controllers
- `routes/hl7.php`, `routes/hl7_dtu.php`, `routes/hl7_up.php`
- Composer: `aranyasen/hl7` library

---

### 5.12 External System Integrations

#### Eros (Oracle Clinical System)
- **Purpose**: Source of truth for patients, packages, items, pricing, physicians
- **Direction**: CMS reads from Eros; pushes status updates back
- **Sync routes**: `insertErosDB`, `updateItemPrice`, `updatePatientMaster`
- **Models**: `app/Models/eros/` (Package, ItemPrice, ItemMasterList, etc.)
- **Controllers**: `app/Http/Controllers/eros/` (14 controllers)

#### BizBox (Payment/Banking)
- **Purpose**: Payment processing integration
- **Models**: `app/Models/bizbox/BizBoxDB.php`
- **Controllers**: `BizboxPatientController`, `RegistrationController`

#### HCLAB (Lab Information System)
- **Purpose**: Lab test items and patient master sync
- **Sync**: `HCLABSyncController` synchronizes items and patient master
- **Models**: `HCLABPatientMaster`, `HCLABItemMaster`
- **Controllers**: `app/Http/Controllers/hclab/` (7 controllers)

#### Zennya (Appointment/Scheduling)
- **Purpose**: Online appointment integration
- **Controller**: `ZennyaController`
- **Views**: `resources/views/zennya/`

#### LDAP / Active Directory
- **Purpose**: Staff authentication and role assignment
- **Library**: `directorytree/ldaprecord-laravel`
- **Config**: `config/ldap.php`
- **Model**: `app/Models/Ldap.php`

#### AWS S3
- **Purpose**: File storage for results, uploads
- **Library**: `aws/aws-sdk-php` + `league/flysystem-aws-s3-v3`
- **Config**: `config/filesystems.php` + AWS env vars

#### SMS
- **Purpose**: Patient notifications
- **Controller**: `SMSController`
- **Routes**: `GET|POST /api/sms`

---

### 5.13 User & Role Management (Settings)

#### User Management
- `UsersController` — CRUD for system users
- `UserAccessController` — Assign module/tab permissions per user
- LDAP roles mapped to CMS module/tab combinations
- JSON-stored role array determines menu visibility + route access

#### Menu Visibility
- `app.blade.php` (main layout) checks `session('userRole')` for each menu item
- Blade `@if(strpos(session('userRole'), ...))` conditionally shows links

---

## 6. API Endpoints Reference

### Authentication
```
POST /login                         Web login
POST /logout                        Logout
GET  /api/user                      Current user (Sanctum)
```

### Queue & Patient
```
GET|POST /cms/queue                             Queue list + create
GET|PUT|DELETE /cms/queue/{id}                  Queue CRUD
POST /cms/queue/validate                        E-card validation
POST /cms/queue/discount                        Discount validation
GET|POST /cms/queue/api/getPatientName          Patient name lookup
GET|POST /cms/queue/api/getPhysicianName        Physician lookup
GET|POST /cms/queue/api/itemPrice               Item pricing
GET|POST /cms/queue/api/city                    City data
GET|POST /cms/queue/api/zip                     Zip code data
POST /cms/queue/api/hpdf                        PDF generation
```

### Enrollment & Cards
```
POST /enrollment/cardverified                   Card verification
GET  /enrollment/cardnumber/generate-barcode/{num}  Barcode
GET  /enrollment/cardnumber/get-last-series-number  Series lookup
GET  /enrollment/cardnumber/get-last-batch      Batch lookup
```

### Doctor Module
```
GET  /doctor/queue                              Doctor queue
POST /doctor/evaluation                         Save evaluation
POST /doctor/vitals/doctordecking/pcpdoctor     PCP selection
GET  /doctor/queue/order/orderModal/{id}/edit   Orders modal
POST /doctor/queue/order/orderModal             Save orders
GET  /doctor/queue/pastResult/{id}              Past results
GET  /api/physicians                            Physician list
```

### Kiosk Operations
```
POST /kiosk/receptionqueue/update-status         Status update
POST /kiosk/receptionqueue/insert-patient-code   Add patient code
POST /kiosk/receptionqueue/update-current-room   Room update
GET  /kiosk/receptionqueue/queue-data            Queue JSON
GET  /kiosk/receptionqueue/queuevitals-data      Vitals data
POST /kiosk/extractionqueue/receive-specimen      Receive specimen
```

### Specimen Receiving
```
GET  /specimen-receiving/specimen                List specimens
POST /specimen-receiving/specimen/{id}/receive   Receive specimen
POST /specimen-receiving/reject                  Reject specimen
```

### Display Queue
```
GET  /queueDisplay                              Display screen
GET  /fetch-queue-data                          Queue JSON feed
GET  /fetch-display-data                        Display JSON feed
```

### Reports
```
GET  /reports/dailysales                        Daily sales report
GET  /reports/labreports                        Lab reports
GET  /reports/sendout                           Sendout reports
GET  /reports/hmo                               HMO reports
GET  /reports/turnaroundtime                    TAT reports
```

### Webcam
```
GET|POST /api/webcam                            Patient webcam capture
GET|POST /api/physicianWebcam                   Physician webcam capture
```

### Sync (CRON-like)
```
GET /insertErosDB                               Eros data insertion
GET /updateItemPrice                            Price update
GET /updatePatientMaster                        Patient sync
GET /insertPatientEros2BizBox                   Cross-system sync
GET /CebuCompanyUpdate                          Cebu company sync
```

### External
```
GET|POST /eros                                  Eros management
POST /airChina                                  Air China uploads
POST /imdAPE                                    IMD APE uploads
POST /cms/dropzone/store                        Dropzone uploads
GET|POST /api/sms                               SMS operations
```

---

## 7. Key Data Flows & Workflows

### Flow 1: New Patient Queue Creation

```
1. Reception staff opens /cms/queue/create
2. Scans or enters patient's e-card number
   └─ POST /cms/queue/validate
      └─ QueueCardValidationController@checkCardNumber
         └─ Queries CardEnrollment + Verification tables
         └─ Returns: patient data, discount entitlement
3. Patient info displayed from Eros lookup
4. Company/HMO selected from dropdown (Eros Companies)
5. Package/items selected (ItemPrice from Eros)
6. Queue record created (Status=100)
7. Transaction records created per selected item
8. Queue number assigned (QueNumber table + prefix)
9. HL7 file created for facility (e.g., ICTcmsMakeHL7File)
10. Patient appears on kiosk reception screen
```

### Flow 2: Specimen Collection & Receiving

```
1. Patient at Lab Extraction kiosk
   └─ LaboratoryQueueController@index shows today's extraction queue
2. Staff scans patient barcode
   └─ POST /kiosk/extractionqueue/receive-specimen
3. Blood drawn, batch code generated (JSON)
   └─ Stored in Receiving.BloodBatchCode
4. Tubes labeled, patient proceeds
5. Specimen sent to receiving section
6. SpecimenReceivingController@receiveSpecimen confirms receipt
7. Status updated, HCLAB notified
```

### Flow 3: Payment Processing

```
1. Queue reaches payment status
2. PaymentController loads transaction summary
3. Calculates total from Transactions table
4. Applies HMO/card discounts
5. Staff confirms payment method
6. BizBox integration processes payment
7. PaymentHistory record created
8. Queue status updated to "Paid"
9. POST /hl7/ICTUpdateForPaymentQueue fires
10. Eros billing updated via HL7
```

### Flow 4: Eros Data Synchronization

```
Scheduled (via CRON-hitting GET routes):
1. GET /insertErosDB
   └─ Pulls new patients from Eros Oracle
   └─ Creates/updates CMS Patient records
   └─ Creates ErosPatient mapping
2. GET /updateItemPrice
   └─ Syncs item prices from Eros ItemPrice table
   └─ Updates CMS pricing data
3. GET /updatePatientMaster
   └─ Full patient master synchronization
4. GET /CebuPhysicianUpdate
   └─ Syncs Cebu physician list from Oracle
```

---

## 8. File & Storage Architecture

### Upload Types

| Type | Route | Storage | Format |
|------|-------|---------|--------|
| Result files | `/cms/dropzone/store` | Local/S3 | PDF/Images |
| Air China data | `/airChina` | Local | Excel |
| IMD APE data | `/imdAPE` | Local | Excel |
| Patient photos | Webcam routes | Local | JPEG |

### PDF Generation
- **mPDF**: Dynamic clinical reports, result PDFs
- **FPDF/FPDI**: Form overlays, result formatting
- **webklex/laravel-pdfmerger**: Combining multiple PDFs per patient
- **WWWPDF model**: Handles WWW-specific PDF ops

### Excel/Spreadsheet
- **maatwebsite/excel**: Import/export operations
- **PhpSpreadsheet**: Complex spreadsheet manipulation
- Exports organized in `app/Exports/` (Bizbox, cms, eros subdirs)

---

## 9. Real-time & Events

### Socket.io Setup
- `server.js` / `server_b4RP.js` — Node.js Socket.io servers
- Queue display screens receive push updates
- Kiosk screens receive patient call notifications
- Broadcasting channels defined in `routes/channels.php`

### Real-time Events
- Queue status changes broadcast to display screens
- Patient called → kiosk screen updates
- New patient in queue → reception notification

### Webcam Integration
- `WebCamController` / `PhysicianWebcamController`
- Patient photo capture at reception
- Physician photo capture for records
- Routes: `/api/webcam`, `/api/physicianWebcam`

---

## 10. Security Model

### Implemented Controls

| Control | Implementation |
|---------|---------------|
| Authentication | Session + LDAP + Sanctum tokens |
| RBAC | JSON role strings + middleware |
| CSRF | VerifyCsrfToken middleware on all web routes |
| SQL Injection | Eloquent ORM parameterized queries |
| XSS | Blade auto-escaping (`{{ }}`) |
| Cookie Security | EncryptCookies middleware |
| Password Hashing | Laravel Hash (bcrypt) |
| API Auth | Laravel Sanctum bearer tokens |
| Proxy Trust | TrustProxies for CDN/load balancer |
| CORS | fruitcake/laravel-cors configured |
| Audit Trail | InputBy/UpdateBy columns, PhysicianLogs |

### Known Legacy Patterns (to improve in replication)
- Role checking via `strpos()` on JSON string (functional but brittle)
- Mixed raw queries and Eloquent (inconsistent)
- Session-based state for multi-step workflows (no proper state machine)
- No formal event/listener architecture (ad-hoc sync routes)
- Queue driver is `sync` (no proper async job processing)
- File-based sessions and cache (not suitable for multi-server deployment)

---

## 11. Suggested Modern Tech Stack (Replication Guide)

### Backend

| Component | Legacy | Modern Recommendation |
|-----------|--------|-----------------------|
| Framework | Laravel 8 | **Laravel 11 / 12** |
| Language | PHP 7.3 | **PHP 8.3** |
| Auth | Session + LDAP + Sanctum | **Laravel Sanctum + Socialite (LDAP provider)** |
| RBAC | String-based roles | **spatie/laravel-permission** |
| Queue | Sync driver | **Laravel Horizon + Redis** |
| Cache | File | **Redis (via Laravel Cache)** |
| Session | File | **Redis** |
| Database ORM | Eloquent raw mix | **Eloquent + Repository pattern** |
| API | Web routes returning JSON | **Laravel API Resources + proper REST** |
| Events | Ad-hoc routes | **Laravel Events + Listeners + Queued Jobs** |
| Oracle | yajra/laravel-oci8 | **Keep yajra/laravel-oci8 (updated version)** |
| PDF | mPDF + FPDF | **Spatie/Browsershot or DomPDF** |
| Excel | PhpSpreadsheet | **maatwebsite/excel v4** |
| HL7 | aranyasen/hl7 | **Keep or use Google's HL7 v2 PHP** |
| Testing | PHPUnit (minimal) | **PHPUnit + Pest + Laravel Dusk** |
| Type Safety | None | **PHPStan Level 8 + strict types** |

### Frontend

| Component | Legacy | Modern Recommendation |
|-----------|--------|-----------------------|
| CSS | Tailwind 3.1 + Bootstrap mix | **Tailwind CSS 4.x (pure, no Bootstrap)** |
| Framework | Alpine.js + jQuery mix | **React 19 / Next.js 15 or Inertia.js + React** |
| Build Tool | Webpack (Mix) | **Vite 6** |
| State | Session + page reload | **Zustand / TanStack Query** |
| Tables | DataTables (jQuery) | **TanStack Table (react-table)** |
| Real-time | Socket.io (old Node) | **Laravel Reverb (official WebSocket)** |
| Charts | (basic) | **Recharts / Chart.js / Tremor** |
| Forms | HTML + Blade | **React Hook Form + Zod validation** |
| UI Components | Custom Blade + Bootstrap | **shadcn/ui + Radix UI** |
| Notifications | None | **Sonner / React Hot Toast** |
| PDF Viewer | Basic | **react-pdf** |

### Infrastructure

| Component | Legacy | Modern Recommendation |
|-----------|--------|-----------------------|
| Server | Single PHP server | **Laravel Octane (Swoole/FrankenPHP)** |
| WebSocket | Node.js + Socket.io | **Laravel Reverb** |
| Queue | Sync | **Laravel Horizon + Redis** |
| Storage | Local + S3 | **S3 + CloudFront CDN** |
| Cache/Session | File | **Redis (via Upstash or self-hosted)** |
| Auth Directory | LDAP (raw) | **Microsoft Entra ID (Azure AD) via OAuth2** |
| Scheduling | CRON-hitting web routes | **Laravel Scheduler (proper)** |
| Monitoring | None | **Laravel Telescope + Sentry** |
| CI/CD | None | **GitHub Actions** |
| Containerization | None | **Docker + docker-compose** |

### Architecture Pattern Improvements

```
Legacy Pattern → Modern Pattern

Ad-hoc controllers → Service Layer (app/Services/)
Raw queries → Repository Pattern (app/Repositories/)
String RBAC → spatie/laravel-permission + Policies
Sync HL7 routes → Queued Jobs (HL7Job dispatched async)
CRON web routes → Laravel Scheduler (app/Console/Kernel.php)
Mixed DB calls → Dedicated adapters per external system
Socket.io Node server → Laravel Reverb (native)
jQuery AJAX → TanStack Query / Axios with React
Blade templates → Inertia.js + React components
Session state machine → Proper State Machine (spatie/state)
```

---

## 12. Module Replication Roadmap

### Phase 1 — Foundation (Priority: Critical)
- [ ] Project scaffolding (Laravel 11 + Vite + React/Inertia)
- [ ] Database schema design (MySQL + Oracle connections)
- [ ] Authentication system (Sanctum + LDAP/Azure AD)
- [ ] RBAC setup (spatie/laravel-permission)
- [ ] Core models (Patient, Queue, Company, Transaction)
- [ ] Base layout + navigation (Tailwind + shadcn/ui)
- [ ] User management module

### Phase 2 — Core Queue (Priority: High)
- [ ] Patient management (create, search, lookup from Eros)
- [ ] Queue creation workflow
- [ ] Queue number generation
- [ ] Queue status state machine
- [ ] Today's queue + past queue views
- [ ] Branch manager adjustments

### Phase 3 — Clinical Workflow (Priority: High)
- [ ] E-Card validation integration
- [ ] Kiosk reception station
- [ ] Vital signs recording
- [ ] Doctor consultation module
- [ ] Medical evaluation forms
- [ ] Physical examination recording
- [ ] Doctor's orders module

### Phase 4 — Lab & Specimen (Priority: High)
- [ ] Lab extraction kiosk
- [ ] Specimen receiving workflow
- [ ] Specimen rejection + re-collection
- [ ] Sendout tracking
- [ ] HCLAB integration

### Phase 5 — Payment & Billing (Priority: High)
- [ ] Transaction management
- [ ] Payment processing
- [ ] Discount validation
- [ ] BizBox integration
- [ ] Payment history

### Phase 6 — E-Card System (Priority: Medium)
- [ ] Card number generation
- [ ] Card enrollment
- [ ] Card verification
- [ ] Card demographics
- [ ] Barcode generation

### Phase 7 — Display & Kiosk (Priority: Medium)
- [ ] Queue display screens (real-time)
- [ ] All kiosk station views
- [ ] Laravel Reverb WebSocket setup
- [ ] Workstation management

### Phase 8 — Results & Uploads (Priority: Medium)
- [ ] Result file upload (Dropzone)
- [ ] Results monitoring dashboard
- [ ] PDF generation for results
- [ ] AWS S3 integration

### Phase 9 — HL7 Integration (Priority: Medium)
- [ ] HL7 message builder service
- [ ] Queue-to-HL7 event listeners
- [ ] Multi-facility HL7 routing
- [ ] HL7 resend capability

### Phase 10 — Reporting (Priority: Medium)
- [ ] Daily sales reports
- [ ] Lab reports
- [ ] HMO/corporate reports
- [ ] Turnaround time analytics
- [ ] Excel export

### Phase 11 — External Sync (Priority: Low→Medium)
- [ ] Eros patient sync (scheduled job)
- [ ] Item/price sync (scheduled job)
- [ ] Physician sync (scheduled job)
- [ ] Air China file upload processing
- [ ] IMD APE file processing

### Phase 12 — Polish & Advanced (Priority: Low)
- [ ] Webcam capture (patient + physician)
- [ ] QR code generation
- [ ] SMS notifications
- [ ] Zennya appointment integration
- [ ] Comprehensive audit logging
- [ ] Performance optimization (Octane)
- [ ] End-to-end testing (Dusk)

---

## Appendix A — Key Environment Variables

```env
# App
APP_NAME="CMS - Clinical Management System"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

# MySQL (CMS DB)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cms
DB_USERNAME=cms_user
DB_PASSWORD=

# Oracle (Eros - Example)
DB_HOST_PRODh=
DB_PORT_PRODh=1521
DB_DATABASE_PRODh=
DB_USERNAME_PRODh=
DB_PASSWORD_PRODh=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=

# Redis (for modern replication)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# LDAP
LDAP_HOST=
LDAP_PORT=389
LDAP_USERNAME=
LDAP_PASSWORD=
LDAP_BASE_DN=

# Broadcasting (Legacy: Socket.io | Modern: Reverb)
BROADCAST_DRIVER=reverb
REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
```

---

## Appendix B — Naming Conventions

| Element | Legacy Convention | Example |
|---------|-----------------|---------|
| Table names | PascalCase, singular | `Queue`, `Patient`, `CardEnrollment` |
| Primary keys | `Id` (non-auto UUID) | `Id` |
| Foreign keys | `Id` + entity name | `IdPatient`, `IdCompany`, `IdQueue` |
| Status codes | Integer (100, 200, 300, 500) | `Status = 200` |
| Audit columns | InputBy / UpdateBy | `InputBy = 'username'` |
| Date columns | Date / DateTime / InputDate | `InputDate = now()` |
| Models | PascalCase | `QueueController` |
| Controllers | `{Entity}Controller` | `PatientController` |
| Views | camelCase `.blade.php` | `queueCreate.blade.php` |
| Route files | lowercase `.php` | `cms.php`, `hl7.php` |

---

## Appendix C — Codebase File Count Summary

| Category | Count |
|----------|-------|
| PHP Controllers | 157 |
| Eloquent Models | 40+ |
| Blade Views | 50+ |
| Route Files | 14 |
| Middleware | 10 |
| Config Files | 19 |
| DB Migrations | 5 (formal Laravel) |
| Oracle Connections | 8+ |
| Estimated LOC | 50,000+ |

---

*Generated: 2026-02-26 | CMS Legacy Analysis for Modernization Reference*
