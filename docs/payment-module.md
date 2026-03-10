# Payment Module

## Overview
The Payment module handles billing and payment collection for patient queue visits. Each visit in the `queue` table may have one or more transaction records in the `transactions` table. The module supports multiple payment methods and two provider types (Patient self-pay and HMO/insurance).

---

## Access Control

| Role | Permission |
|---|---|
| `[PAYMENT]` | Process and record payments |
| `[PAYMENT-VIEW]` | Read-only access to payment records |

RBAC key: `requireApiAuth(request, "cms", "payment")`
Page guard: `requireAuth(CMS_MODULES.PAYMENT.module, CMS_MODULES.PAYMENT.tab)`

---

## URLs

| Route | Purpose |
|---|---|
| `/payment` | Payment list — all queues with outstanding or recent payments |
| `/payment/[queueId]` | Payment detail — process payment for a specific queue visit |

---

## Database Tables

### `transactions` Table

| Column | Type | Purpose |
|---|---|---|
| `Id` | BigInt PK | Primary key |
| `IdQueue` | BigInt | FK → `queue.id` |
| `Status` | SmallInt | Payment status (see codes below) |
| `AmountItemPrice` | Decimal | Original item price |
| `AmountRemaining` | Decimal | Remaining balance after payments |
| `HCardNumber` | String | HMO card number (if provider = HMO) |
| `PaymentMethod` | String | Cash / GCash / Credit Card / Cheque / Online Transfer |
| `BillTo` | String | HMO company billed to |
| `ORNumber` | String | Official receipt number |
| `ProviderType` | String | `PATIENT` or `HMO` |
| `TransactionDate` | DateTime | When the transaction was recorded |
| `RecordedBy` | String | Username of cashier |

### `queue` Table (relevant fields)

| Column | Type | Purpose |
|---|---|---|
| `id` | BigInt | Primary key |
| `qfullname` | String | Patient full name |
| `accessionno` | String | Accession/queue number |
| `idbu` | Int | Business unit ID |
| `code` | String | Branch/clinic code |
| `Status` | SmallInt | Queue status (updated on payment) |
| `ErosStatus` | String | Clinical workflow status |

---

## Status Codes

### Transaction Status (`transactions.Status`)

| Code | Label | Badge Color |
|---|---|---|
| `0` or `null` | Unpaid | Amber |
| `205` | Partial | Blue |
| `210` | Fully Paid | Emerald |
| `650` | Cancelled | Red |

### Queue Status (after payment)

| Code | Meaning |
|---|---|
| `205` | Partial payment — balance remaining |
| `210` | Fully paid |

---

## Payment Methods

| Value | Display |
|---|---|
| `Cash` | Cash |
| `GCash` | GCash |
| `CreditCard` | Credit Card |
| `Cheque` | Cheque |
| `OnlineTransfer` | Online Transfer |

---

## Provider Types

| Value | Behaviour |
|---|---|
| `PATIENT` | Self-pay. `BillTo` and `HCardNumber` not required. |
| `HMO` | Insurance/HMO. Requires `BillTo` (company name) and `HCardNumber`. |

---

## Page Layout: Payment List (`/payment`)

The `/payment` page should follow the standard table pattern with search, filter, and pagination.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  Payment                                            [Refresh]   │
├─────────────────────────────────────────────────────────────────┤
│  [Search patient name / queue no...]  [Status ▾]  [Date ▾]     │
├─────────────────────────────────────────────────────────────────┤
│  QUEUE NO ⇅  PATIENT ⇅  COMPANY ⇅  AMOUNT ⇅  REMAINING ⇅  STATUS  ACTIONS │
├─────────────────────────────────────────────────────────────────┤
│  Q-00123     Juan Cruz   NWD         ₱1,500    ₱0       ● Paid  [View]  │
│  Q-00124     Maria Reyes HMO-Max     ₱3,200    ₱800     ● Partial [Pay] │
│  Q-00125     Pedro Lim   —           ₱500      ₱500     ● Unpaid [Pay]  │
└─────────────────────────────────────────────────────────────────┘
                                       [< Prev]  Page 1 of 5  [Next >]
```

### Filter Controls

| Control | Options |
|---|---|
| Search | Patient name, queue number, accession number |
| Status | All / Unpaid / Partial / Fully Paid / Cancelled |
| Date | Today / This Week / This Month / Custom Range |

### Sortable Columns

| Column | Sort Key |
|---|---|
| Queue No. | `accessionno` |
| Patient | `qfullname` |
| Company | `code` |
| Amount | `AmountItemPrice` |
| Remaining | `AmountRemaining` |
| Date | `TransactionDate` |

`Status` and `Actions` columns are not sortable.

---

## Payment Processing Form

The existing `src/components/payment/payment-form.tsx` is used as the payment detail view. It follows the standard modal/form pattern with these sections:

### Queue Info Panel (read-only)

Displays: Queue Number, Patient Name, Accession No., Branch/Company.

```
┌─ Queue Information ──────────────────────────────────────────┐
│  Queue No.    Q-00124                                         │
│  Patient      Maria Reyes                                     │
│  Accession    ACC-2024-0124                                   │
│  Branch       NWD Main                                        │
└──────────────────────────────────────────────────────────────┘
```

### Transactions Table

Shows all existing transaction line items for the queue visit (checkboxes to select which items to pay).

| Column | Source |
|---|---|
| Item | Transaction description |
| Amount | `AmountItemPrice` |
| Remaining | `AmountRemaining` |
| Status | `Status` badge |
| Select | Checkbox |

### Payment Details Form

```
┌─ Payment Details ────────────────────────────────────────────┐
│  Provider Type  [○ Patient  ○ HMO]                           │
│  Payment Method [Cash ▾]                                      │
│  OR Number      [_______________________]                    │
│                                                               │
│  — shown only when Provider Type = HMO —                     │
│  Bill To        [_______________________]                    │
│  HMO Card No.   [_______________________]                    │
└──────────────────────────────────────────────────────────────┘
```

### Process Button

```tsx
// Emerald button — matches "confirm" action
<button className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 ...">
  Process Payment
</button>
```

Shows a **confirmation dialog** before submitting (see Confirmation Dialog section below).

---

## Confirmation Dialog (before processing)

Uses the standard confirmation dialog pattern from `docs/confirmation-dialog-template.md`.

```
┌─────────────────────────────────────┐
│  ⚠  Confirm Payment                 │
│                                     │
│  Process payment of ₱1,500.00 for   │
│  Maria Reyes via Cash?              │
│                                     │
│              [Cancel]  [Confirm]    │
└─────────────────────────────────────┘
```

- Icon badge: `bg-emerald-100` / `text-emerald-600`
- Confirm button: `bg-emerald-600 hover:bg-emerald-700`

---

## Status Badge Component

Define inline in the payment list client:

```tsx
function PaymentBadge({ status }: { status: number | null }) {
  const map: Record<number, { label: string; cls: string }> = {
    210: { label: "Fully Paid", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    205: { label: "Partial",    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    650: { label: "Cancelled",  cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  };
  const entry = status != null ? map[status] : undefined;
  const label = entry?.label ?? "Unpaid";
  const cls   = entry?.cls   ?? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
```

---

## API Routes

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/payment` | List queue payments (search, filter, pagination) — **needs implementation** |
| GET | `/api/queue/[id]/payment` | Get single queue + all transactions |
| POST | `/api/queue/[id]/payment` | Process payment for selected transactions |

### GET /api/payment

Query params:
- `search` — patient name, queue number, accession number
- `status` — `unpaid` | `partial` | `paid` | `cancelled`
- `date` — `today` | `week` | `month` | ISO date range `from=&to=`
- `page`, `pageSize`

Returns paginated list joining `queue` + `transactions`.

### GET /api/queue/[id]/payment

Returns:
```json
{
  "success": true,
  "data": {
    "queue": { "id": 124, "qfullname": "Maria Reyes", "accessionno": "ACC-0124", ... },
    "transactions": [
      { "Id": 1, "Status": 205, "AmountItemPrice": 3200, "AmountRemaining": 800, ... }
    ]
  }
}
```

### POST /api/queue/[id]/payment

Body:
```json
{
  "transactionIds": [1, 2],
  "paymentMethod": "Cash",
  "orNumber": "OR-2024-001",
  "providerType": "PATIENT",
  "billTo": "",
  "cardNumber": ""
}
```

- Updates selected `transactions.Status` → `210`, `AmountRemaining` → `0`
- Updates `queue.Status` → `210` (fully paid) or `205` (partial — if any transactions remain unpaid)
- Sets `queue.ErosStatus` → `"queued"` (triggers clinical workflow)
- Auth: `requireApiAuth(request, "cms", "payment")`

---

## Toast Notifications

| Action | Toast |
|---|---|
| Payment processed successfully | `toast("Payment processed successfully.", "success")` |
| Payment failed | `toast(errorMessage, "error")` |
| Payment cancelled | `toast("Payment cancelled.", "warning")` |

---

## Files

| File | Purpose |
|---|---|
| `src/app/(dashboard)/payment/page.tsx` | Server page — currently placeholder, needs list UI |
| `src/components/payment/payment-client.tsx` | **New** — payment list client with table, search, pagination |
| `src/components/payment/payment-form.tsx` | Existing — payment processing form (queue detail + transactions) |
| `src/app/api/payment/route.ts` | **New** — GET list of payments |
| `src/app/api/queue/[id]/payment/route.ts` | Existing — GET/POST single queue payment |
| `docs/payment-module.md` | This file |

---

## Implementation Checklist

- [ ] Create `src/app/api/payment/route.ts` — paginated payment list query
- [ ] Create `src/components/payment/payment-client.tsx` — table with search, filters, sort, pagination, status badges
- [ ] Update `src/app/(dashboard)/payment/page.tsx` — replace placeholder with `<PaymentClient />`
- [ ] Wire `apiFetch` for all client-side calls
- [ ] Add `ToastContainer` to `PaymentClient` and `PaymentForm`
- [ ] Add confirmation dialog before processing payment in `PaymentForm`

---

## Patterns Reference

| Pattern | Document |
|---|---|
| Table with sortable headers | `docs/table-sorting-template.md` |
| Modal / form design | `docs/modal-component-template.md` |
| Confirmation dialog | `docs/confirmation-dialog-template.md` |
| Toast notifications | `src/components/ui/toast.tsx` |
