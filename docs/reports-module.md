# Clinic Reports Module

## Overview
The Reports module (`/reports`) provides 8 report types covering financial, transactional, and operational data across all clinic branches. All reports share a common filter panel (Branch, Date From, Date To) and render results in a data table with export capability.

---

## Access Control

| Role | Permission |
|---|---|
| `[REPORTS-DAILYSALES]` | Cash Report, Cashier Summary, Summary Report, Bookkeeper Report |
| `[REPORTS-CARDMANAGEMENT]` | Card Management data only |
| `[REPORTS]` | Full access to all report types |

RBAC key: `requireApiAuth(request, "cms", "reports")`
Page guard: `requireAuth(CMS_MODULES.REPORTS.module, CMS_MODULES.REPORTS.tab)`

---

## URL

| Route | Purpose |
|---|---|
| `/reports` | Main reports page — filter panel + report type selector + results table |
| `/api/reports/[type]` | GET — runs the selected report and returns paginated rows |

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Clinic Reports                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─ Report Type ─────────────────────────────────────────────────────┐  │
│  │  [Bookkeeper] [Cash] [Cashier Summary] [HMO/Corporate]            │  │
│  │  [Per Item]   [Sendout] [Summary]      [Amendment]                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Filters ─────────────────────────────────────────────────────────┐  │
│  │  Clinic Branch [All Branches ▾]  Date From [____]  Date To [____] │  │
│  │                                              [Generate Report]     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Results ──────────────────────────────────────────────────────── ┐  │
│  │  [Export CSV]  [Print]                          Showing 1–20/142  │  │
│  │  ─────────────────────────────────────────────────────────────    │  │
│  │  [sortable table columns — vary by report type]                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Filter Controls

| Control | Source | Notes |
|---|---|---|
| Clinic Branch | `businessunits` table (`Code`, `Description`, `Status='1'`) | Multi or single select; defaults to all active branches |
| Date From | Date picker | Defaults to first day of current month |
| Date To | Date picker | Defaults to today |
| Generate | Button (emerald) | Triggers report fetch |

---

## Report Types

### 1. Bookkeeper Report

**Purpose:** Full itemized transaction list for accounting — shows all charges per patient with company billing information.

**Primary tables:** `transactions` JOIN `queue` JOIN `company`

**Columns:**

| Column | DB Source | Notes |
|---|---|---|
| Date | `transactions.Date` | Transaction date |
| Queue No. | `queue.Code` | e.g. CEN-20240601-001 |
| Accession No. | `queue.AccessionNo` | |
| Patient Name | `queue.QFullName` | |
| Company | `transactions.NameCompany` | Billed-to company |
| Item Code | `transactions.CodeItemPrice` | |
| Item Description | `transactions.DescriptionItemPrice` | |
| Transaction Type | `transactions.TransactionType` | |
| Price Group | `transactions.PriceGroupItemPrice` | |
| Amount | `transactions.AmountItemPrice` | |
| Remaining | `transactions.AmountRemaining` | |
| OR No. | — | Future: stored on transactions |
| Status | `transactions.Status` | 210=Paid, 205=Partial, 650=Cancelled |

**Filter additions:** Status filter (All / Paid / Partial / Cancelled)

**Totals row:** Sum of Amount, Sum of Remaining.

---

### 2. Cash Report

**Purpose:** Lists all cash-paying patient transactions for the period — cashier reconciliation.

**Primary tables:** `transactions` JOIN `queue`

**Filter logic:** `transactions.Status = 210` AND `queue.IdBU IN (selected branches)` AND `queue.Date BETWEEN dateFrom AND dateTo`

**Columns:**

| Column | DB Source |
|---|---|
| Date | `transactions.Date` |
| Queue No. | `queue.Code` |
| Patient Name | `queue.QFullName` |
| Patient Type | `queue.PatientType` |
| Item Code | `transactions.CodeItemPrice` |
| Item Description | `transactions.DescriptionItemPrice` |
| Amount Paid | `transactions.AmountItemPrice - transactions.AmountRemaining` |
| Readers Fee | `transactions.ReadersFee` |
| Input By | `transactions.InputBy` |

**Totals row:** Sum of Amount Paid, Sum of Readers Fee.

---

### 3. Cashier Summary Report

**Purpose:** Per-cashier/user summary of collections for the day — shows who collected what.

**Primary tables:** `transactions` JOIN `queue` GROUP BY `transactions.InputBy`

**Columns:**

| Column | DB Source |
|---|---|
| Cashier | `transactions.InputBy` |
| No. of Transactions | COUNT |
| Total Amount | SUM(`AmountItemPrice`) |
| Total Collected | SUM(`AmountItemPrice - AmountRemaining`) |
| Total Remaining | SUM(`AmountRemaining`) |

**Sub-rows (expand):** Per transaction breakdown for each cashier.

---

### 4. HMO / Corporate Report

**Purpose:** Lists all HMO and corporate-billed transactions — for billing/claims submission.

**Primary tables:** `transactions` JOIN `queue` JOIN `company`

**Filter logic:** `transactions.NameCompany IS NOT NULL` AND `transactions.NameCompany != ''`
Additional filter: **Company** dropdown (from `company` table, `Status='1'`)

**Columns:**

| Column | DB Source |
|---|---|
| Date | `transactions.Date` |
| Queue No. | `queue.Code` |
| Accession No. | `queue.AccessionNo` |
| Patient Name | `queue.QFullName` |
| HMO / Company | `transactions.NameCompany` |
| Card No. | `transactions.HCardNumber` |
| Item Code | `transactions.CodeItemPrice` |
| Item Description | `transactions.DescriptionItemPrice` |
| Price Group | `transactions.PriceGroupItemPrice` |
| Amount | `transactions.AmountItemPrice` |
| Readers Fee | `transactions.ReadersFee` |

**Grouped by company** with sub-total per company.

---

### 5. Per Item Report

**Purpose:** Shows how many times each test/service was ordered in the period, with revenue.

**Primary tables:** `transactions` JOIN `itemmaster` GROUP BY `CodeItemPrice`

**Columns:**

| Column | DB Source |
|---|---|
| Item Code | `transactions.CodeItemPrice` |
| Item Description | `transactions.DescriptionItemPrice` |
| Group | `transactions.GroupItemMaster` |
| Transaction Type | `transactions.TransactionType` |
| Count | COUNT of transactions |
| Unit Price | `transactions.AmountItemPrice` (first occurrence) |
| Total Amount | SUM(`AmountItemPrice`) |

**Sorted by:** Count DESC (most-ordered first).

---

### 6. Sendout Report

**Purpose:** Lists test orders sent out to external laboratories (msg_queue records).

**Primary tables:** `msg_queue` JOIN `queue`

**Columns:**

| Column | DB Source |
|---|---|
| Date | `queue.Date` |
| Queue No. | `msg_queue.QueueCode` |
| Accession No. | `msg_queue.AccessionNo` |
| Patient Name | `queue.QFullName` |
| Item Group | `msg_queue.ItemGroup` |
| Sent To (Branch) | `msg_queue.ReceivedBU` |
| From Branch | `msg_queue.IdBU` |
| Status | `msg_queue.Status` |

**Status badges:** `sent` = blue, `received` = emerald, `pending` = amber.

---

### 7. Summary Report

**Purpose:** High-level daily/period totals by branch — management overview.

**Primary tables:** `transactions` JOIN `queue` GROUP BY `queue.IdBU`, `transactions.Date`

**Columns:**

| Column | DB Source |
|---|---|
| Date | `transactions.Date` |
| Branch | `queue.Code` → branch prefix / `businessunits.Description` |
| No. of Patients | COUNT DISTINCT `queue.Id` |
| No. of Transactions | COUNT `transactions.Id` |
| Gross Amount | SUM(`transactions.AmountItemPrice`) |
| Readers Fee | SUM(`transactions.ReadersFee`) |
| Net Amount | Gross - Readers Fee |
| Amount Collected | SUM(`AmountItemPrice - AmountRemaining`) |
| Remaining Balance | SUM(`transactions.AmountRemaining`) |

**Totals row:** column-wise sums across all dates.

---

### 8. Amendment / Transaction Amendment

**Purpose:** Lists transactions that were modified after initial entry — audit trail for amendments.

**Primary tables:** `transactions` WHERE `transactions.OrigAmount IS NOT NULL AND transactions.OrigAmount != transactions.AmountItemPrice`

**Columns:**

| Column | DB Source |
|---|---|
| Date | `transactions.Date` |
| Queue No. | `queue.Code` |
| Patient Name | `queue.QFullName` |
| Item Code | `transactions.CodeItemPrice` |
| Item Description | `transactions.DescriptionItemPrice` |
| Original Amount | `transactions.OrigAmount` |
| New Amount | `transactions.AmountItemPrice` |
| Difference | `OrigAmount - AmountItemPrice` |
| Modified By | `transactions.InputBy` |
| Company | `transactions.NameCompany` |

**Highlight rows** where difference > 0 in amber.

---

## API Routes

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/reports/bookkeeper` | Bookkeeper report data |
| GET | `/api/reports/cash` | Cash report data |
| GET | `/api/reports/cashier-summary` | Cashier summary |
| GET | `/api/reports/hmo` | HMO/Corporate report |
| GET | `/api/reports/per-item` | Per item report |
| GET | `/api/reports/sendout` | Sendout report |
| GET | `/api/reports/summary` | Summary report |
| GET | `/api/reports/amendment` | Amendment/transaction amendment |

### Common Query Params (all routes)

| Param | Type | Required | Notes |
|---|---|---|---|
| `branch` | string | No | `businessunits.Code`; comma-separated for multiple; omit = all |
| `dateFrom` | ISO date | Yes | Start of date range |
| `dateTo` | ISO date | Yes | End of date range (inclusive) |
| `page` | number | No | Default 1 |
| `pageSize` | number | No | Default 50 |

### Response Shape

```json
{
  "success": true,
  "reportType": "bookkeeper",
  "branch": "CEN",
  "dateFrom": "2024-06-01",
  "dateTo": "2024-06-30",
  "data": [...],
  "total": 142,
  "page": 1,
  "pageSize": 50,
  "totalPages": 3,
  "summary": {
    "totalAmount": 125000.00,
    "totalRemaining": 3200.00,
    "totalTransactions": 142
  }
}
```

---

## Status Codes Reference

| Code | Label | Used In |
|---|---|---|
| `210` | Fully Paid | Bookkeeper, Cash, Cashier Summary |
| `205` | Partial | Bookkeeper, Summary |
| `650` | Cancelled | Bookkeeper (excluded from Cash) |
| `0`–`200` | Unpaid/In-progress | Summary, Bookkeeper |

---

## Database Tables Used

| Table | Model | Purpose |
|---|---|---|
| `transactions` | `transactions` | Core financial records — all reports |
| `queue` | `queue` | Patient and visit context |
| `businessunits` | `businessunits` | Branch filter source (`Status='1'`) |
| `company` | `company` | HMO/Corporate filter, company names |
| `itemmaster` | `itemmaster` | Item group/description lookup |
| `msg_queue` | `msg_queue` | Sendout report source |
| `queuestatus` | `queuestatus` | Status label lookups |

### Key Join Pattern

```sql
SELECT t.*, q.Code, q.AccessionNo, q.QFullName, q.PatientType, q.IdBU
FROM transactions t
JOIN queue q ON q.id = t.idqueue
WHERE q.Date BETWEEN $dateFrom AND $dateTo
  AND ($branch IS NULL OR q.Code ILIKE $branch || '%')
  AND t.Status < 650
ORDER BY t.Date DESC, q.Code ASC
```

---

## UI Components

### Report Type Selector

Tab-style pill buttons — one per report. Active = `bg-blue-600 text-white`. Inactive = `bg-slate-100 text-slate-600 hover:bg-slate-200`.

```tsx
const REPORT_TYPES = [
  { key: "bookkeeper",       label: "Bookkeeper Report" },
  { key: "cash",             label: "Cash Report" },
  { key: "cashier-summary",  label: "Cashier Summary Report" },
  { key: "hmo",              label: "HMO / Corporate Report" },
  { key: "per-item",         label: "Per Item Report" },
  { key: "sendout",          label: "Sendout Report" },
  { key: "summary",          label: "Summary Report" },
  { key: "amendment",        label: "Amendment Transaction" },
] as const;
```

### Filter Panel

Follows section card pattern from `docs/modal-component-template.md`:

```tsx
<div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Filters</p>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
    <BranchSelect />
    <DateInput label="Date From" />
    <DateInput label="Date To"   />
    <GenerateButton />
  </div>
</div>
```

### Generate Button

```tsx
<button className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 ...">
  Generate Report
</button>
```

### Results Table

- Follows `docs/table-sorting-template.md` — sortable headers, `divide-y`, hover rows
- Totals/summary row pinned to table `<tfoot>` with `bg-slate-50 font-bold`
- Export CSV: `window.location.href = /api/reports/[type]?...&format=csv`
- Print: `window.print()` with `@media print` hiding the filter panel and nav

### Loading State

While fetching, show a skeleton shimmer over the table area (5 rows × column count).

---

## Files

| File | Purpose |
|---|---|
| `src/app/(dashboard)/reports/page.tsx` | Server page — currently placeholder, needs `<ReportsClient />` |
| `src/components/reports/reports-client.tsx` | **New** — main client: report type tabs, filter panel, results table |
| `src/app/api/reports/[type]/route.ts` | **New** — dynamic route handling all 8 report types |
| `docs/reports-module.md` | This file |

---

## Implementation Checklist

- [ ] Create `src/app/api/reports/[type]/route.ts` — dynamic handler for all 8 types
- [ ] Create `src/components/reports/reports-client.tsx` — report type tabs + filter panel + results table
- [ ] Update `src/app/(dashboard)/reports/page.tsx` — replace placeholder with `<ReportsClient />`
- [ ] Add CSV export endpoint: `?format=csv` response with `Content-Disposition: attachment`
- [ ] Add `ToastContainer` + `useToast` for error feedback
- [ ] Wire `apiFetch` for all client-side calls with `requireApiAuth(request, "cms", "reports")`

---

## Patterns Reference

| Pattern | Document |
|---|---|
| Table with sortable headers | `docs/table-sorting-template.md` |
| Filter section card | `docs/modal-component-template.md` (Section Card) |
| Toast notifications | `src/components/ui/toast.tsx` |
| Auth guard | `requireApiAuth(request, "cms", "reports")` |
