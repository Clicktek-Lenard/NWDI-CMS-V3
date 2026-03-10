# Table Column Sorting — CMS v3 Standard Template

This document defines the standard pattern for sortable column headers used across all table components in CMS v3.
All three modules (User Settings, Clinical, Card Management) follow this exact implementation.

---

## Behaviour

- Click a column header once → sort **ascending** (A→Z, oldest→newest, 0→9)
- Click the same header again → sort **descending** (Z→A, newest→oldest, 9→0)
- Click a different header → sort that column ascending (previous sort cleared)
- The active sort column shows a chevron icon (↑ ascending / ↓ descending)
- Non-active columns show a faint double-chevron icon on hover to indicate they are sortable
- Sorting is **client-side** — applies to the currently loaded page data
- `Action` columns are never sortable

---

## Visual Design

```
┌─────────────────────────────────────────────────────────────────┐
│  NAME ↑          USERNAME ⇅     DEPARTMENT ⇅     STATUS ⇅  ... │  ← thead
├─────────────────────────────────────────────────────────────────┤
│  Alice           @alice          Radiology         Active       │
│  Bob             @bob            Nursing           Inactive     │
└─────────────────────────────────────────────────────────────────┘
```

- Active sort column: bold label + solid `↑` or `↓` chevron, slightly darker header text
- Inactive sortable columns: normal label + faint `ChevronsUpDown` icon (visible on hover)
- Cursor: `cursor-pointer` on sortable headers
- Header `<th>` gets `select-none` to prevent text selection on repeated clicks

---

## State

```ts
type SortDir = "asc" | "desc";

const [sortKey, setSortKey]   = useState<string>("");   // "" = no sort / default order
const [sortDir, setSortDir]   = useState<SortDir>("asc");
```

### Toggle handler

```ts
function handleSort(key: string) {
  if (sortKey === key) {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  } else {
    setSortKey(key);
    setSortDir("asc");
  }
}
```

---

## Sorting helper

Place this **above** the component function. It handles strings, numbers, dates, and nulls:

```ts
function sortRows<T>(rows: T[], key: keyof T | "", dir: "asc" | "desc"): T[] {
  if (!key) return rows;
  return [...rows].sort((a, b) => {
    const av = a[key] ?? "";
    const bv = b[key] ?? "";
    let cmp = 0;
    if (typeof av === "number" && typeof bv === "number") {
      cmp = av - bv;
    } else {
      cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: "base" });
    }
    return dir === "asc" ? cmp : -cmp;
  });
}
```

### Usage in render

```ts
// Apply after filtering, before pagination slice
const sorted    = sortRows(filtered, sortKey as keyof MyRow, sortDir);
const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
```

---

## SortableHeader component (inline helper)

Define this inside (or above) the component file:

```tsx
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

function SortableHeader({
  label, colKey, sortKey, sortDir, onSort, align = "left",
}: {
  label:   string;
  colKey:  string;
  sortKey: string;
  sortDir: "asc" | "desc";
  onSort:  (key: string) => void;
  align?:  "left" | "right" | "center";
}) {
  const active = sortKey === colKey;
  return (
    <th
      onClick={() => onSort(colKey)}
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none
        transition-colors hover:bg-slate-100 dark:hover:bg-slate-600
        text-${align}
        ${active ? "text-slate-700 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sortDir === "asc"
            ? <ChevronUp className="h-3.5 w-3.5 text-blue-500" />
            : <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />
        )}
      </span>
    </th>
  );
}
```

---

## Full wiring example (User table)

```tsx
// 1. State
const [sortKey, setSortKey] = useState("");
const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");

function handleSort(key: string) {
  if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
  else { setSortKey(key); setSortDir("asc"); }
}

// 2. Derive sorted list (after filter, before pagination)
const sorted    = sortRows(users, sortKey as keyof UserRecord, sortDir);
const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

// 3. In JSX thead
<thead>
  <tr>
    <SortableHeader label="Name"       colKey="first_name"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
    <SortableHeader label="Username"   colKey="username"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
    <SortableHeader label="Department" colKey="department"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
    <th ...>Permissions</th>  {/* not sortable */}
    <SortableHeader label="Status"     colKey="activated"   sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="center" />
    <th ...>Actions</th>      {/* not sortable */}
  </tr>
</thead>
```

---

## Applied modules

| Module | File | Sortable columns |
|---|---|---|
| User Settings | `src/components/settings/user-management-client.tsx` | Name, Username, Department, Status |
| Clinical Queue | `src/components/clinical/clinical-client.tsx` | Queue #, Patient, Company/HMO, Status, Arrived |
| Card Management — Verification | `src/components/enrollment/enrollment-client.tsx` | Verified Card Number, Year, Batch, Month, Date Received |
| Card Management — Registration | `src/components/enrollment/enrollment-client.tsx` | Card Number, Released To, Enrolled Date, Status |
| Card Management — Receiving | `src/components/enrollment/enrollment-client.tsx` | Card Number, Released To, Received By, Received Date, Status |
| Card Management — Transfer | `src/components/enrollment/enrollment-client.tsx` | Card Number, Current Clinic, Transfer To, Transfer Date, Status |

---

## Rules

1. **Never sort the Action column** — it contains interactive elements, not data.
2. **Reset page to 1** when sort changes (already handled by the `useEffect([search, statusFilter])` → `setPage(1)` pattern; add `sortKey` and `sortDir` to that effect's deps if needed).
3. **Client-side only** — sorting happens on the fetched page, not via API query params. This is intentional for simplicity; server-side sorting can be added later per module if data volume requires it.
4. **Null-safe** — the `sortRows` helper treats `null`/`undefined` as empty string `""` so they sort to the bottom on ascending.
