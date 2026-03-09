# E-Card Enrollment Module
## CMS — Clinical Queue Management System (BAESA)

**Version:** Legacy (Laravel 8.75 / PHP 7.3–8.0)
**Last Updated:** 2026-03-09
**Purpose:** Complete architecture, logic, flow, and replication guide for the entire Card Enrollment sub-system.

> **Note:** `ECardTransferController` and `EnrollmentTransferController` are **registered in routes but not yet implemented**. This document includes their full designed architecture based on the existing patterns.

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Sub-Modules](#2-sub-modules)
3. [Card Lifecycle & Status Codes](#3-card-lifecycle--status-codes)
4. [Full Process Flow](#4-full-process-flow)
5. [Database Schema](#5-database-schema)
6. [Controllers & Business Logic](#6-controllers--business-logic)
7. [Models](#7-models)
8. [Routes](#8-routes)
9. [Views / UI Structure](#9-views--ui-structure)
10. [Key Business Rules](#10-key-business-rules)
11. [Missing Implementations](#11-missing-implementations)
12. [Authentication & Authorization](#12-authentication--authorization)
13. [Modern Stack Replication Guide](#13-modern-stack-replication-guide)

---

## 1. Module Overview

The E-Card Enrollment Module manages the full lifecycle of healthcare benefit cards — from physical card generation to clinic delivery and usage validation in transactions. All card data lives in the **Eros Oracle database** (shared across facilities).

**Core responsibilities:**
- Generate card numbers with an encoded algorithm (year + batch + month + series)
- Verify physical cards received by ICT
- Enroll verified cards and release them to specific clinic branches
- Receive cards at the destination clinic
- Transfer cards between clinics _(designed, not yet implemented)_
- Validate card usage during patient transactions

**Key databases:**

| Database | Tables Used |
|---|---|
| `Eros` (Oracle) | `CardKey`, `CardVerified`, `CardEnrollment`, `BusinessUnits` |
| `CMS` (MySQL) | `Transactions` (reads `HCardNumber`) |

---

## 2. Sub-Modules

| Sub-Module | Controller | Status |
|---|---|---|
| Card Number Generation | `CardNumberGenController` | Implemented |
| Card Verification (ICT) | `VerifiedNumbersController` | Implemented |
| Card Registration / Enrollment | `ECardRegistrationController` | Implemented |
| Card Receiving | `ECardReceivingController` | Implemented |
| Card Received List | `ECardReceivedController` | Implemented |
| Enrollment Received (modal) | `EnrollmentReceivedController` | Implemented |
| **Card Transfer** | **`ECardTransferController`** | **NOT IMPLEMENTED** |
| **Enrollment Transfer (modal)** | **`EnrollmentTransferController`** | **NOT IMPLEMENTED** |
| Card Validation (transaction) | `QueueCardValidationController` | Implemented |

---

## 3. Card Lifecycle & Status Codes

### Status Values

| Status | Meaning | Set By |
|---|---|---|
| _(not yet in CardEnrollment)_ | Card generated | `CardNumberGenController` |
| _(not yet in CardEnrollment)_ | Card verified by ICT | `VerifiedNumbersController` |
| `0` | Enrolled — pending receipt at clinic | `ECardRegistrationController` |
| `1` | Received at destination clinic | `EnrollmentReceivedController` |
| `2` | _(Designed)_ Transfer initiated | `ECardTransferController` _(pending)_ |
| `3` | _(Designed)_ Transfer received | `EnrollmentTransferController` _(pending)_ |

### Lifecycle Stages

```
[GENERATE]  →  [VERIFY]  →  [ENROLL / RELEASE]  →  [RECEIVE]  →  [USE / TRANSFER]
  CardKey      CardVerified    CardEnrollment          Status='1'     Transactions
                               Status='0'
```

---

## 4. Full Process Flow

### 4.1 End-to-End Card Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│  STEP 1: CARD GENERATION  (ICT / Admin)                              │
│  Route: GET|POST /enrollment/cardnumber                              │
│                                                                      │
│  User selects: Year, Batch, Month, Series Count                      │
│                                                                      │
│  Algorithm:                                                          │
│  • Year  →  2-letter code  (2025 → "AI")                            │
│  • Batch →  2-letter code  (1 → "BK")                               │
│  • Month →  2-letter code  (Jan="AL", Feb="BK", Mar="CJ", ...)      │
│  • Series → 10-digit zero-padded number                              │
│  • MaskedSeries → position-swap "jumble" of SeriesNum                │
│  • GeneratedCardNumber = Year(2) + Batch(2) + Month(2) + Series(10)  │
│    → 16-character alphanumeric card number                           │
│                                                                      │
│  Output: CODE128 barcodes + ZIP download                             │
│  DB Write: CardKey table                                             │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STEP 2: CARD VERIFICATION  (ICT scans physical card)                │
│  Route: GET|POST /enrollment/cardverified                            │
│                                                                      │
│  ICT scans barcode of physical card                                  │
│  System checks:                                                      │
│  1. CardNumber exists in CardKey.GeneratedCardNumber?                │
│     → NO: "Card number does not exist. Please contact admin."        │
│  2. Already in CardVerified?                                         │
│     → YES: "CARD NUMBER ALREADY EXISTED"                             │
│  3. Both pass → INSERT into CardVerified:                            │
│     (VerifiedCardNumbers, ICTReceived, DateReceived)                 │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STEP 3: CARD REGISTRATION / ENROLLMENT  (Admin assigns to clinic)   │
│  Route: GET|POST /enrollment/cardregistration                        │
│                                                                      │
│  Admin selects destination clinic from BusinessUnits dropdown        │
│  Scans card number                                                   │
│                                                                      │
│  System checks:                                                      │
│  1. Card exists in CardVerified?                                     │
│     → NO: "Card number doesn't exist. Contact administrator."        │
│  2. Card already in CardEnrollment?                                  │
│     → YES: "Card number already exists."                             │
│  3. Both pass → INSERT into CardEnrollment:                          │
│     (CardNumber, ReleaseTo, DateEnrolled, DateRelease,               │
│      ReleaseBy, Status='0')                                          │
│                                                                      │
│  UI: Barcode scanner (Enter-key submit), Selectize dropdown          │
│      localStorage saves last selected clinic for convenience         │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STEP 4: CARD RECEIVING  (Clinic nurse/staff receives card batch)    │
│  Route: GET /enrollment/cardreceiving                                │
│                                                                      │
│  Dual-panel view:                                                    │
│  LEFT:  Pending cards (Status='0', ReleaseTo = user's clinic)        │
│  RIGHT: Already received cards (Status='1')                          │
│                                                                      │
│  Staff scans card → modal opens automatically                        │
│  Modal displays: Released To, Card Number, Received By               │
│                                                                      │
│  On Confirm:                                                         │
│  PUT /enrollment/pages/enrollmentReceived/{id}                       │
│  UPDATE CardEnrollment SET                                           │
│    Status = '1',                                                     │
│    ReceivedBy = Auth::user()->username,                              │
│    ReceivedDate = now()                                              │
│  WHERE Id = $id                                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STEP 5: CARD TRANSFER  [DESIGNED — NOT YET IMPLEMENTED]             │
│  Route: GET|POST /enrollment/cardtransfer                            │
│                                                                      │
│  Triggered when: Card needs to move from Clinic A → Clinic B         │
│                                                                      │
│  Designed Flow:                                                      │
│  1. Staff selects source card (Status='1', ReleaseTo = user's clinic)│
│  2. Selects destination clinic (new ReleaseTo)                       │
│  3. On confirm:                                                      │
│     UPDATE CardEnrollment SET                                        │
│       Status = '2',         ← Transfer initiated                    │
│       TransferTo = newClinic,                                        │
│       TransferBy = username,                                         │
│       TransferDate = now()                                           │
│     WHERE Id = $id                                                   │
│  4. Destination clinic receives:                                     │
│     PUT /enrollment/pages/enrollmentTransfer/{id}                    │
│     UPDATE CardEnrollment SET                                        │
│       Status = '3',          ← Transfer received                    │
│       ReleaseTo = TransferTo, ← Update ownership                    │
│       ReceivedBy = username,                                         │
│       ReceivedDate = now()                                           │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STEP 6: CARD VALIDATION (during patient transaction)                │
│  Route: POST /cms/queue/validate  (QueueCardValidationController)    │
│                                                                      │
│  Checks:                                                             │
│  1. Card exists in CardEnrollment?                                   │
│  2. Card.ReleaseTo = user's clinic code?                             │
│     → NO: "Card Number is Registered to <Other Clinic Name>"         │
│  3. Card is not marked as "sold" / over free availment limit?        │
│     → YES: "Your Free Availment is Already Used"                     │
│  4. All pass → {"status": "success"}                                 │
│                                                                      │
│  Used By: Patient queue / billing station                            │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Card Number Generation Algorithm

```
Input:  Year=2025, Batch=1, Month=January, Count=100

Step 1 — Year → Letters:
  2025 → "25" → '2'=char(65+2)='C', '5'=char(65+5)='F' → "CF"
  (Or custom mapping: 2025 → "AI")

Step 2 — Batch → Letters:
  1 → padded "01" → '0'=char(65+0)='A', '1'=char(65+1)='B' → "AB"

Step 3 — Month → Preset Code:
  Jan="AL", Feb="BK", Mar="CJ", Apr="DI", May="EH",
  Jun="FG", Jul="GF", Aug="HE", Sep="ID", Oct="JC",
  Nov="KB", Dec="LC"

Step 4 — Series → 10-digit zero-padded:
  1 → "0000000001"

Step 5 — MaskedSeries (jumble via position-swap):
  Original:  0 1 2 3 4 5 6 7 8 9
  Positions: 3 7 1 9 5 0 8 4 2 6  ← predefined swap map
  Result:    "jumbled" 10 digits

Step 6 — GeneratedCardNumber (16 chars):
  = Year(2) + Batch(2) + Month(2) + MaskedSeries(10)
  Example: "AIABALDXXXXXXXX"

Output saved to CardKey:
  { Year, Batch, Month, SeriesNum, MaskedSeries, GeneratedCardNumber }
```

---

## 5. Database Schema

### 5.1 Eros Database

#### `CardKey`

```sql
CREATE TABLE CardKey (
    Id                   VARCHAR(36)  NOT NULL PRIMARY KEY,  -- UUID
    Year                 CHAR(2)      NOT NULL,   -- e.g. 'AI'
    Batch                CHAR(2)      NOT NULL,   -- e.g. 'BK'
    Month                CHAR(2)      NOT NULL,   -- e.g. 'AL'
    SeriesNum            CHAR(10)     NOT NULL,   -- original 10-digit padded
    MaskedSeries         CHAR(10)     NOT NULL,   -- jumbled 10-digit
    GeneratedCardNumber  CHAR(16)     NOT NULL UNIQUE  -- final card number
);
```

#### `CardVerified`

```sql
CREATE TABLE CardVerified (
    Id                   VARCHAR(36)  NOT NULL PRIMARY KEY,
    VerifiedCardNumbers  CHAR(16)     NOT NULL UNIQUE,  -- FK → CardKey.GeneratedCardNumber
    ICTReceived          VARCHAR(100),   -- username of ICT staff who scanned
    DateReceived         DATETIME
);
```

#### `CardEnrollment`

```sql
CREATE TABLE CardEnrollment (
    Id              VARCHAR(36)   NOT NULL PRIMARY KEY,
    CardNumber      CHAR(16)      NOT NULL,  -- FK → CardKey.GeneratedCardNumber
    Status          CHAR(1)       NOT NULL DEFAULT '0',
    --   '0' = Pending (enrolled, not yet received)
    --   '1' = Received at clinic
    --   '2' = Transfer Initiated  [designed]
    --   '3' = Transfer Received   [designed]
    ReleaseTo       VARCHAR(50),  -- FK → BusinessUnits.Code (destination clinic)
    DateEnrolled    DATETIME,
    DateRelease     DATETIME,
    ReleaseBy       VARCHAR(100), -- username
    ReceivedBy      VARCHAR(100), -- username
    ReceivedDate    DATETIME,
    -- Transfer fields [designed for ECardTransferController]
    TransferTo      VARCHAR(50),  -- FK → BusinessUnits.Code
    TransferBy      VARCHAR(100),
    TransferDate    DATETIME
);
```

#### `BusinessUnits`

```sql
CREATE TABLE BusinessUnits (
    Id          VARCHAR(36)   NOT NULL PRIMARY KEY,
    Code        VARCHAR(50)   NOT NULL UNIQUE,  -- clinic identifier
    Description VARCHAR(255)  -- clinic name
);
```

---

### 5.2 CMS Database _(referenced for validation)_

#### `Transactions` _(card usage column)_

```sql
-- Existing Transactions table, relevant column:
HCardNumber  CHAR(16)  -- card number used in this transaction
```

---

## 6. Controllers & Business Logic

### 6.1 `CardNumberGenController`

**File:** `app/Http/Controllers/cms/CardNumberGenController.php`

**`index()`**
- Returns `cms.cardnumberGenerator` view with form

**`getLastBatch()`**
```php
return response()->json([
    'lastBatch' => CardNumber::max('Batch')
]);
```

**`getLastSeriesNumber()`**
```php
return response()->json([
    'lastSeries' => CardNumber::max('SeriesNum')
]);
```

**`store(Request $request)`**
```php
CardNumber::create([
    'Year'                => $request->year,
    'Batch'               => $request->batch,
    'Month'               => $request->month,
    'SeriesNum'           => $request->seriesnum,
    'MaskedSeries'        => $request->maskedseriesnum,
    'GeneratedCardNumber' => $request->card_number,
]);
return response()->json(['message' => 'Card number saved successfully.']);
```

---

### 6.2 `VerifiedNumbersController`

**File:** `app/Http/Controllers/cms/VerifiedNumbersController.php`

**`index(Request $request)`**
```php
$data = Verification::getInfo();
return view('cms.verifiedNumbers', compact('data'));
```

**`store(Request $request)`**
```php
$cardNumber = $request->VerifiedCardNumbers;

// Step 1: Must exist in CardKey
$inCardKey = DB::connection('Eros')->table('CardKey')
    ->where('GeneratedCardNumber', $cardNumber)->exists();
if (!$inCardKey) {
    return back()->with('error', 'Card number does not exist...');
}

// Step 2: Check if already verified
$alreadyVerified = DB::connection('Eros')->table('CardVerified')
    ->where('VerifiedCardNumbers', $cardNumber)->exists();
if ($alreadyVerified) {
    return back()->with('warning', 'CARD NUMBER ALREADY EXISTED');
}

// Step 3: Insert
DB::connection('Eros')->table('CardVerified')->updateOrInsert(
    ['VerifiedCardNumbers' => $cardNumber],
    [
        'ICTReceived' => Auth::user()->username,
        'DateReceived' => now(),
    ]
);
return back()->with('success', 'Card has been verified and updated successfully.');
```

**`update(Request $request, $id)`**
```php
DB::connection('Eros')->table('CardVerified')
    ->where('Id', $id)
    ->update([
        'DateReceived' => now(),
        'ICTReceived'  => Auth::user()->username,
    ]);
```

---

### 6.3 `ECardRegistrationController`

**File:** `app/Http/Controllers/cms/ECardRegistrationController.php`

**`index(Request $request)`**
```php
$users        = CardEnrollment::getUsers();
$queue        = json_encode(CardEnrollment::registrationData());
$defaultClinic = session('userClinicCode');
return view('cms.ecardRegistration', compact('users', 'queue', 'defaultClinic'));
```

**`store(Request $request)`**
```php
$cardNumber = $request->CardNumber;

// Guard 1: Must be in CardVerified
$verified = DB::connection('Eros')->table('CardVerified')
    ->where('VerifiedCardNumbers', $cardNumber)->exists();
if (!$verified) {
    return back()->with('error', "Card number doesn't exist. Please contact your administrator.");
}

// Guard 2: Not already enrolled
$enrolled = DB::connection('Eros')->table('CardEnrollment')
    ->where('CardNumber', $cardNumber)->exists();
if ($enrolled) {
    return back()->with('warning', 'Card number already exists. Please choose a different Card number.');
}

// Insert
DB::connection('Eros')->table('CardEnrollment')->insert([
    'CardNumber'   => $cardNumber,
    'ReleaseTo'    => $request->Users,
    'DateEnrolled' => now(),
    'DateRelease'  => now(),
    'ReleaseBy'    => Auth::user()->username,
    'Status'       => '0',
]);
return back()->with('success', 'Data has been enrolled successfully...');
```

---

### 6.4 `ECardReceivingController`

**File:** `app/Http/Controllers/cms/ECardReceivingController.php`

**`index(Request $request)`**
```php
// Dual-panel data
$queue = CardEnrollment::receivingData();  // Status='0', clinic = user's clinic
$data  = CardEnrollment::receivedData();   // Status='1', clinic = user's clinic
return view('cms.ecardReceiving', [
    'queue' => json_encode($queue),
    'data'  => json_encode($data),
]);
```

---

### 6.5 `ECardReceivedController`

**File:** `app/Http/Controllers/cms/ECardReceivedController.php`

**`index(Request $request)`**
```php
$data = CardEnrollment::receivedData();
return view('cms.ecardReceived', compact('data'));
```

---

### 6.6 `EnrollmentReceivedController`

**File:** `app/Http/Controllers/cms/pages/enrollment/EnrollmentReceivedController.php`

**`edit($id)`**
```php
$data = CardEnrollment::getInfo($id);
return view('cms.pages.enrollmentReceived', compact('data'));
```

**`update(Request $request, $id)`**
```php
DB::connection('Eros')->table('CardEnrollment')
    ->where('Id', $id)
    ->update([
        'Status'       => '1',
        'ReceivedBy'   => Auth::user()->username,
        'ReceivedDate' => now(),
    ]);
return response()->json(['message' => 'ReceivedBy updated successfully']);
```

---

### 6.7 `ECardTransferController` _(DESIGNED — NOT YET IMPLEMENTED)_

**Expected File:** `app/Http/Controllers/cms/ECardTransferController.php`
**Expected Namespace:** `App\Http\Controllers\cms`

**Designed Methods:**

**`index()`**
```php
// Show cards that can be transferred (Status='1', ReleaseTo = user's clinic)
$transferable = CardEnrollment::where('Status', '1')
    ->where('ReleaseTo', session('userClinicCode'))
    ->get();
$inTransit = CardEnrollment::where('Status', '2')
    ->where('ReleaseTo', session('userClinicCode'))
    ->get();
$clinics = CardEnrollment::getUsers(); // destination dropdown
return view('cms.ecardTransfer', compact('transferable', 'inTransit', 'clinics'));
```

**`edit($id)`**
```php
$data    = CardEnrollment::getInfo($id);
$clinics = CardEnrollment::getUsers();
return view('cms.pages.enrollmentTransfer', compact('data', 'clinics'));
```

**`update(Request $request, $id)`**
```php
// Initiate transfer
DB::connection('Eros')->table('CardEnrollment')
    ->where('Id', $id)
    ->update([
        'Status'       => '2',          // Transfer initiated
        'TransferTo'   => $request->TransferTo,
        'TransferBy'   => Auth::user()->username,
        'TransferDate' => now(),
    ]);
return response()->json(['message' => 'Card transfer initiated successfully.']);
```

---

### 6.8 `EnrollmentTransferController` _(DESIGNED — NOT YET IMPLEMENTED)_

**Expected File:** `app/Http/Controllers/cms/pages/enrollment/EnrollmentTransferController.php`
**Expected Namespace:** `App\Http\Controllers\cms\pages\enrollment`

**Designed Methods:**

**`edit($id)`**
```php
// Show modal for receiving a transferred card
$data = CardEnrollment::getInfo($id);
return view('cms.pages.enrollmentTransferModal', compact('data'));
```

**`update(Request $request, $id)`**
```php
// Confirm transfer receipt — update ownership to new clinic
DB::connection('Eros')->table('CardEnrollment')
    ->where('Id', $id)
    ->update([
        'Status'       => '3',              // Transfer received / completed
        'ReleaseTo'    => DB::connection('Eros')
                            ->table('CardEnrollment')
                            ->where('Id', $id)
                            ->value('TransferTo'),  // new owner clinic
        'ReceivedBy'   => Auth::user()->username,
        'ReceivedDate' => now(),
    ]);
return response()->json(['message' => 'Transfer received successfully.']);
```

---

### 6.9 `QueueCardValidationController`

**File:** `app/Http/Controllers/cms/pages/queue/QueueCardValidationController.php`

**`checkCardNumber(Request $request)`**
```php
$cardNumber = $request->CardNumber1;
$discount   = $request->Discount;
$itemPrice  = $request->itemPrice1;
$userClinic = session('userClinicCode');

// Check 1: Exists in CardEnrollment
$card = DB::connection('Eros')->table('CardEnrollment')
    ->where('CardNumber', $cardNumber)->first();
if (!$card) {
    return response()->json(['status' => 'error', 'message' => 'Card number does not exist...']);
}

// Check 2: Released to user's clinic
if ($card->ReleaseTo !== $userClinic) {
    $clinicName = BusinessUnit::where('Code', $card->ReleaseTo)->value('Description');
    return response()->json([
        'status'  => 'error',
        'message' => "Card Number is Registered to {$clinicName}"
    ]);
}

// Check 3: Card is sold / activated
if ($card->Status !== '1') {
    return response()->json(['status' => 'error', 'message' => 'Card is not yet sold']);
}

// Check 4: Free availment usage count
$usageCount = Transactions::where('HCardNumber', $cardNumber)->count();
if ($usageCount >= config('cms.card_free_availment_limit')) {
    return response()->json(['status' => 'error', 'message' => 'Your Free Availment is Already used']);
}

return response()->json(['status' => 'success']);
```

---

## 7. Models

### `CardNumber`

```php
class CardNumber extends Model {
    protected $connection = 'Eros';
    protected $table      = 'CardKey';
    protected $primaryKey = 'Id';
    public $incrementing  = false;
    protected $keyType    = 'string';
    public $timestamps    = false;

    protected $fillable = [
        'Id', 'Year', 'Batch', 'Month',
        'SeriesNum', 'MaskedSeries', 'GeneratedCardNumber',
    ];
}
```

### `Verification`

```php
class Verification extends Model {
    protected $connection = 'Eros';
    protected $table      = 'CardVerified';
    protected $primaryKey = 'Id';
    public $incrementing  = false;
    protected $keyType    = 'string';
    public $timestamps    = false;

    protected $fillable = [
        'Id', 'VerifiedCardNumbers', 'ICTReceived', 'DateReceived',
    ];

    public static function getInfo() {
        return static::orderByDesc('DateReceived')->get();
    }
}
```

### `CardEnrollment`

```php
class CardEnrollment extends Model {
    protected $connection = 'Eros';
    protected $table      = 'CardEnrollment';
    protected $primaryKey = 'Id';
    public $incrementing  = false;
    protected $keyType    = 'string';
    public $timestamps    = false;

    protected $fillable = [
        'Id', 'CardNumber', 'Status', 'ReleaseTo',
        'DateEnrolled', 'DateRelease', 'ReleaseBy',
        'ReceivedBy', 'ReceivedDate',
        'TransferTo', 'TransferBy', 'TransferDate',
    ];

    public static function registrationData() {
        // All pending enrollment (Status='0') — admin view
        return static::where('Status', '0')->orderByDesc('DateEnrolled')->get();
    }

    public static function receivingData() {
        // Cards released to current user's clinic, not yet received
        return static::where('Status', '0')
            ->where('ReleaseTo', session('userClinicCode'))
            ->orderByDesc('DateRelease')
            ->get();
    }

    public static function receivedData() {
        // Cards received at current user's clinic
        return static::where('Status', '1')
            ->where('ReleaseTo', session('userClinicCode'))
            ->orderByDesc('ReceivedDate')
            ->get();
    }

    public static function getInfo($id = null) {
        return $id
            ? static::where('Id', $id)->first()
            : static::all();
    }

    public static function getUsers() {
        // BusinessUnits dropdown for clinic selection
        return DB::connection('Eros')->table('BusinessUnits')
            ->select('Id', 'Code', 'Description')
            ->orderBy('Description')
            ->get();
    }
}
```

---

## 8. Routes

**File:** `routes/cms.php`

```php
Route::group(['prefix' => 'enrollment', 'middleware' => ['auth', 'CMS']], function () {

    // --- CARD NUMBER GENERATION ---
    Route::resource('cardnumber', CardNumberGenController::class);
    Route::post('/cardnumber/store',                  [CardNumberGenController::class, 'store']);
    Route::get('/cardnumber/get-last-batch',           [CardNumberGenController::class, 'getLastBatch']);
    Route::get('/cardnumber/get-last-series-number',   [CardNumberGenController::class, 'getLastSeriesNumber']);
    Route::get('/cardnumber/generate-barcode/{cardNumber}', [CardNumberGenController::class, 'generateBarcode']);

    // --- CARD VERIFICATION ---
    Route::post('/cardverified',       [VerifiedNumbersController::class, 'cardverified']);
    Route::resource('cardverified',     VerifiedNumbersController::class);

    // --- CARD REGISTRATION (ENROLLMENT) ---
    Route::resource('cardregistration', ECardRegistrationController::class);

    // --- CARD RECEIVING ---
    Route::resource('cardreceiving',    ECardReceivingController::class);

    // --- CARD RECEIVED LIST ---
    Route::resource('cardreceived',     ECardReceivedController::class);

    // --- CARD TRANSFER [NOT YET IMPLEMENTED] ---
    Route::resource('cardtransfer',     ECardTransferController::class);

    // --- SUB-PAGES (modals) ---
    Route::group(['prefix' => 'pages', 'middleware' => ['auth', 'CMS']], function () {
        // Mark as Received modal
        Route::resource('enrollmentReceived',  EnrollmentReceivedController::class);
        // Mark Transfer Received modal [NOT YET IMPLEMENTED]
        Route::resource('enrollmentTransfer',  EnrollmentTransferController::class);
    });
});
```

**Resolved URLs (resource = index, create, store, show, edit, update, destroy):**

| Method | URI | Action |
|---|---|---|
| GET | `/enrollment/cardnumber` | CardNumberGenController@index |
| POST | `/enrollment/cardnumber/store` | CardNumberGenController@store |
| GET | `/enrollment/cardnumber/get-last-batch` | CardNumberGenController@getLastBatch |
| POST | `/enrollment/cardverified` | VerifiedNumbersController@store |
| GET | `/enrollment/cardregistration` | ECardRegistrationController@index |
| POST | `/enrollment/cardregistration` | ECardRegistrationController@store |
| GET | `/enrollment/cardregistration/{id}/edit` | ECardRegistrationController@edit |
| GET | `/enrollment/cardreceiving` | ECardReceivingController@index |
| GET | `/enrollment/cardreceived` | ECardReceivedController@index |
| GET | `/enrollment/cardtransfer` | **ECardTransferController@index** _(pending)_ |
| POST | `/enrollment/cardtransfer` | **ECardTransferController@store** _(pending)_ |
| GET | `/enrollment/cardtransfer/{id}/edit` | **ECardTransferController@edit** _(pending)_ |
| PUT | `/enrollment/cardtransfer/{id}` | **ECardTransferController@update** _(pending)_ |
| GET | `/enrollment/pages/enrollmentReceived/{id}/edit` | EnrollmentReceivedController@edit |
| PUT | `/enrollment/pages/enrollmentReceived/{id}` | EnrollmentReceivedController@update |
| GET | `/enrollment/pages/enrollmentTransfer/{id}/edit` | **EnrollmentTransferController@edit** _(pending)_ |
| PUT | `/enrollment/pages/enrollmentTransfer/{id}` | **EnrollmentTransferController@update** _(pending)_ |

---

## 9. Views / UI Structure

| View File | Controller | Purpose |
|---|---|---|
| `cms/cardnumberGenerator.blade.php` | CardNumberGenController | Card number generation form, barcode preview, ZIP download |
| `cms/verifiedNumbers.blade.php` | VerifiedNumbersController | ICT card verification list |
| `cms/cardVerifyingCreate.blade.php` | VerifiedNumbersController | Scan/verify single card |
| `cms/ecardRegistration.blade.php` | ECardRegistrationController | Enroll card to clinic — barcode scanner input |
| `cms/ecardCreate.blade.php` | ECardRegistrationController | Create enrollment form |
| `cms/enrollmentEdit.blade.php` | ECardRegistrationController | Edit enrollment record |
| `cms/ecardReceiving.blade.php` | ECardReceivingController | Dual-panel: pending + received |
| `cms/ecardReceived.blade.php` | ECardReceivedController | Received cards DataTable |
| `cms/pages/enrollmentReceived.blade.php` | EnrollmentReceivedController | Modal: mark card as received |
| `cms/ecardTransfer.blade.php` | **ECardTransferController** | **_(to build)_** Transfer initiation list |
| `cms/pages/enrollmentTransferModal.blade.php` | **EnrollmentTransferController** | **_(to build)_** Modal: confirm transfer receipt |

### UI Components Used

| Component | Library | Used In |
|---|---|---|
| DataTables | yajra/laravel-datatables | All list views |
| Barcode Scanner | JsBarcode | Generation, Verification, Registration, Receiving |
| Barcode Download | JSZip + FileSaver | Card Number Generator |
| Dropdown | Selectize.js | Registration (clinic selector) |
| LocalStorage | Browser API | Persist last selected clinic in Registration |
| Modal | Bootstrap 5 | Receiving confirmation, Transfer modal |

---

## 10. Key Business Rules

### Card Generation
- Card numbers are exactly **16 characters**: `2-letter year + 2-letter batch + 2-letter month + 10-digit masked series`
- SeriesNum is position-swapped (jumbled) to create `MaskedSeries` before encoding into the final card number
- Batch max is queried from `CardKey` to auto-increment
- Barcodes generated as CODE128 and bundled in a ZIP for printing

### Card Verification
- A card **must exist in `CardKey`** before it can be verified
- ICT staff scans each physical card — this registers it in `CardVerified`
- Duplicate scans are blocked with a warning (not an error — idempotent check)

### Card Enrollment / Registration
- A card **must be in `CardVerified`** before enrollment
- A card can only be enrolled **once** — duplicate `CardNumber` in `CardEnrollment` is blocked
- `ReleaseTo` = the destination clinic's `BusinessUnit.Code`
- `ReleaseBy` = logged-in username
- Initial status is always `'0'` (pending receipt at clinic)
- UI uses **localStorage** to persist the last selected clinic for barcode scan workflows

### Card Receiving
- Only cards with `ReleaseTo = user's clinic code` are shown
- Only cards with `Status = '0'` appear in the "Receiving" panel
- On barcode scan, a modal auto-opens using JavaScript regex matching (16-char pattern)
- Confirming the modal marks `Status = '1'` and records `ReceivedBy` + `ReceivedDate`

### Card Transfer _(designed)_
- Only received cards (`Status = '1'`) at the user's clinic can be transferred
- Initiating transfer sets `Status = '2'` and records `TransferTo`, `TransferBy`, `TransferDate`
- The destination clinic confirms receipt — `Status = '3'`, `ReleaseTo` updated to new clinic
- After confirmation, the card is usable at the new clinic

### Card Validation (Transaction)
- Card must be `Status = '1'` or `'3'` (received at any point)
- `ReleaseTo` must match the transacting user's clinic — **cross-clinic usage is blocked**
- Free availment limit is checked via `Transactions.HCardNumber` count
- All validation failures return JSON errors, not page redirects (AJAX)

---

## 11. Missing Implementations

### `ECardTransferController`

**File to create:** `app/Http/Controllers/cms/ECardTransferController.php`
**Namespace:** `App\Http\Controllers\cms`

Minimum required methods:
- `index()` — list transferable cards + in-transit cards
- `edit($id)` — show transfer confirmation form
- `update(Request $request, $id)` — initiate transfer (set Status='2')

### `EnrollmentTransferController`

**File to create:** `app/Http/Controllers/cms/pages/enrollment/EnrollmentTransferController.php`
**Namespace:** `App\Http\Controllers\cms\pages\enrollment`

Minimum required methods:
- `edit($id)` — modal showing transfer details
- `update(Request $request, $id)` — confirm receipt, update ReleaseTo (set Status='3')

### Database Columns to Add

The `CardEnrollment` table needs three new columns for the transfer feature:

```sql
ALTER TABLE CardEnrollment
  ADD COLUMN TransferTo    VARCHAR(50)   NULL,
  ADD COLUMN TransferBy    VARCHAR(100)  NULL,
  ADD COLUMN TransferDate  DATETIME      NULL;
```

### Views to Build

- `resources/views/cms/ecardTransfer.blade.php`
- `resources/views/cms/pages/enrollmentTransferModal.blade.php`

---

## 12. Authentication & Authorization

| Layer | Detail |
|---|---|
| Middleware | `auth` (Laravel session) + `CMS` (CheckCMS — module access) |
| User context | `Auth::user()->username` for all `InputBy`/`ReceivedBy`/`ReleaseBy` fields |
| Clinic filter | `session('userClinicCode')` — all receiving/transfer queries scoped to user's branch |
| Multi-tenant | `ReleaseTo = user's clinic code` ensures data isolation per facility |

---

## 13. Modern Stack Replication Guide

> **Target Stack:** Laravel 11/12 + PHP 8.3 + React + Inertia.js + Tailwind CSS 4 + Spatie Laravel Permission

### 13.1 Database Migrations

```php
// create_card_keys_table
Schema::create('card_keys', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->char('year_code', 2);
    $table->char('batch_code', 2);
    $table->char('month_code', 2);
    $table->char('series_num', 10);
    $table->char('masked_series', 10);
    $table->char('card_number', 16)->unique();
    $table->timestamps();
});

// create_card_verified_table
Schema::create('card_verified', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->char('card_number', 16)->unique();
    $table->string('verified_by', 100)->nullable();
    $table->timestamp('verified_at')->nullable();
    $table->timestamps();
});

// create_card_enrollments_table
Schema::create('card_enrollments', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->char('card_number', 16)->unique();
    $table->tinyInteger('status')->default(0);
    // 0=pending, 1=received, 2=transfer_initiated, 3=transfer_received
    $table->string('release_to', 50)->nullable();  // FK BusinessUnit.code
    $table->string('released_by', 100)->nullable();
    $table->timestamp('released_at')->nullable();
    $table->string('received_by', 100)->nullable();
    $table->timestamp('received_at')->nullable();
    $table->string('transfer_to', 50)->nullable();
    $table->string('transfer_by', 100)->nullable();
    $table->timestamp('transferred_at')->nullable();
    $table->timestamps();
});
```

### 13.2 Eloquent Models

```php
class CardEnrollment extends Model {
    use HasUuids;

    protected $casts = [
        'released_at'    => 'datetime',
        'received_at'    => 'datetime',
        'transferred_at' => 'datetime',
        'status'         => 'integer',
    ];

    const STATUS_PENDING    = 0;
    const STATUS_RECEIVED   = 1;
    const STATUS_TRANSFER   = 2;
    const STATUS_TRANSFERRED = 3;

    public function scopeForClinic($query, string $clinicCode) {
        return $query->where('release_to', $clinicCode);
    }

    public function scopePending($query) {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeReceived($query) {
        return $query->where('status', self::STATUS_RECEIVED);
    }

    public function scopeInTransfer($query) {
        return $query->where('status', self::STATUS_TRANSFER);
    }
}
```

### 13.3 Spatie Permissions

```php
// Roles and permissions for card enrollment
Permission::create('card.generate');
Permission::create('card.verify');
Permission::create('card.enroll');
Permission::create('card.receive');
Permission::create('card.transfer');
Permission::create('card.validate');

Role::create('ict-staff')->syncPermissions([
    'card.generate', 'card.verify'
]);

Role::create('enrollment-admin')->syncPermissions([
    'card.enroll'
]);

Role::create('clinic-staff')->syncPermissions([
    'card.receive', 'card.transfer', 'card.validate'
]);
```

### 13.4 Inertia.js Page Structure

```
resources/js/Pages/Enrollment/
├── CardNumber/
│   └── Index.tsx         # Generator form + barcode preview + ZIP download
├── Verification/
│   ├── Index.tsx         # ICT verified cards list
│   └── Create.tsx        # Scan/verify form
├── Registration/
│   ├── Index.tsx         # Enrollment list + scanner form
│   └── Edit.tsx          # Edit enrollment
├── Receiving/
│   └── Index.tsx         # Dual-panel: pending + received
├── Received/
│   └── Index.tsx         # Received cards list
├── Transfer/
│   ├── Index.tsx         # Transferable + in-transit list
│   └── Modal.tsx         # Confirm transfer receipt
└── components/
    ├── BarcodeScanner.tsx
    ├── CardNumberInput.tsx
    └── ClinicSelector.tsx
```

### 13.5 Card Number Generation Service

```php
class CardNumberGenerator {
    private const MONTH_CODES = [
        1=>'AL', 2=>'BK', 3=>'CJ', 4=>'DI', 5=>'EH', 6=>'FG',
        7=>'GF', 8=>'HE', 9=>'ID', 10=>'JC', 11=>'KB', 12=>'LC',
    ];

    private const SERIES_SWAP = [3, 7, 1, 9, 5, 0, 8, 4, 2, 6]; // position map

    public function yearToCode(int $year): string {
        $s = (string) $year;
        return chr(65 + (int)$s[2]) . chr(65 + (int)$s[3]);
    }

    public function batchToCode(int $batch): string {
        $s = str_pad($batch, 2, '0', STR_PAD_LEFT);
        return chr(65 + (int)$s[0]) . chr(65 + (int)$s[1]);
    }

    public function monthCode(int $month): string {
        return self::MONTH_CODES[$month];
    }

    public function maskSeries(string $series): string {
        $result = str_repeat('0', 10);
        for ($i = 0; $i < 10; $i++) {
            $result[self::SERIES_SWAP[$i]] = $series[$i];
        }
        return $result;
    }

    public function generate(int $year, int $batch, int $month, int $series): string {
        $y = $this->yearToCode($year);
        $b = $this->batchToCode($batch);
        $m = $this->monthCode($month);
        $s = $this->maskSeries(str_pad($series, 10, '0', STR_PAD_LEFT));
        return $y . $b . $m . $s;  // 16 chars
    }
}
```

### 13.6 Card Transfer Service

```php
class CardTransferService {
    public function initiate(CardEnrollment $card, string $targetClinic, User $by): void {
        $card->update([
            'status'         => CardEnrollment::STATUS_TRANSFER,
            'transfer_to'    => $targetClinic,
            'transfer_by'    => $by->username,
            'transferred_at' => now(),
        ]);
    }

    public function confirm(CardEnrollment $card, User $by): void {
        $card->update([
            'status'      => CardEnrollment::STATUS_TRANSFERRED,
            'release_to'  => $card->transfer_to,   // ownership moves
            'received_by' => $by->username,
            'received_at' => now(),
        ]);
    }
}
```

---

*End of E-Card Enrollment Module Documentation*
