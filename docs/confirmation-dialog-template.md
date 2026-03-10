# Confirmation Dialog — CMS v3 Standard Template

Small modal for yes/no confirmations and single-input prompts (e.g. approve, decline, delete).
Reference implementations:
- `src/components/settings/delete-user-dialog.tsx` — danger confirmation
- `src/components/eros/physician-accreditation-client.tsx` — approve + decline dialogs (inline)

See also: [modal-component-template.md](./modal-component-template.md) for the full form modal pattern.

---

## When to use this vs. the full modal

| Situation | Use |
|---|---|
| Simple yes/no confirmation | Confirmation Dialog |
| Single text/textarea input before action | Confirmation Dialog with input |
| Multi-field form | Full modal (`physician-form-modal` pattern) |
| Browser `confirm()` / `alert()` | ❌ Never — always use a proper dialog |

---

## Visual Design

```
┌────────────────────────────────────────┐
│  [Icon]  Title                   [✕]  │  ← header
│          Subtitle (record name)        │
├────────────────────────────────────────┤
│  [⚠ Warning banner — optional]        │  ← body
│                                        │
│  Confirmation message or input field   │
├────────────────────────────────────────┤
│                  [Cancel]  [Confirm]   │  ← footer
└────────────────────────────────────────┘
```

- Max width: `max-w-md` (narrower than full form modals which use `max-w-2xl`/`max-w-3xl`)
- No scrollable body needed — keep content minimal

---

## Shell

```tsx
{open && (
  <div
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
  >
    <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
      {/* header */}
      {/* body */}
      {/* footer */}
    </div>
  </div>
)}
```

---

## Header

Same pattern as full modals — icon badge + title + subtitle + X close button:

```tsx
<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Approve Application</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500">{record.fullname}</p>
    </div>
  </div>
  <button
    onClick={onClose}
    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
  >
    <X className="h-5 w-5" />
  </button>
</div>
```

### Icon badge colors by action type

| Action | Badge bg | Icon | Icon color |
|---|---|---|---|
| Approve / Success | `bg-emerald-100 dark:bg-emerald-900/30` | `CheckCircle` | `text-emerald-600 dark:text-emerald-400` |
| Decline / Reject | `bg-red-100 dark:bg-red-900/30` | `XCircle` | `text-red-600 dark:text-red-400` |
| Delete | `bg-red-100 dark:bg-red-900/30` | `Trash2` | `text-red-600 dark:text-red-400` |
| Warning | `bg-amber-100 dark:bg-amber-900/30` | `AlertTriangle` | `text-amber-600 dark:text-amber-400` |
| Info | `bg-blue-100 dark:bg-blue-900/30` | `Info` | `text-blue-600 dark:text-blue-400` |

---

## Body — simple confirmation

```tsx
<div className="px-6 py-5">
  <p className="text-sm text-slate-600 dark:text-slate-300">
    Are you sure you want to approve{" "}
    <span className="font-semibold text-slate-800 dark:text-slate-100">{record.fullname}</span>?
  </p>
  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
    Status will change from{" "}
    <span className="font-medium text-amber-600 dark:text-amber-400">Pending</span> to{" "}
    <span className="font-medium text-emerald-600 dark:text-emerald-400">Active</span>.
  </p>
</div>
```

## Body — with warning banner

Use an amber warning banner when the action has notable consequences:

```tsx
<div className="px-6 py-5 space-y-4">
  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:bg-amber-900/20 dark:border-amber-800">
    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
    <div className="text-sm text-amber-700 dark:text-amber-400">
      <p className="font-medium">This action cannot be undone.</p>
      <p className="mt-0.5 text-amber-600 dark:text-amber-500">Helper text explaining the consequence.</p>
    </div>
  </div>
  <p className="text-sm text-slate-600 dark:text-slate-300">
    Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-100">{name}</span>?
  </p>
</div>
```

## Body — with textarea input (e.g. decline reason)

```tsx
<div className="px-6 py-5 space-y-4">
  {/* warning banner */}
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
      Reason to Disapprove <span className="text-red-500">*</span>
    </label>
    <textarea
      rows={3}
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      placeholder="Enter reason..."
      className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
    />
  </div>
</div>
```

---

## Footer

```tsx
<div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-700">
  <button
    onClick={onClose}
    disabled={loading}
    className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
  >
    Cancel
  </button>
  <button
    onClick={handleConfirm}
    disabled={loading}
    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    Approve
  </button>
</div>
```

### Confirm button colors by action

| Action | Background | Shadow |
|---|---|---|
| Approve / Success | `bg-emerald-600 hover:bg-emerald-700` | `shadow-emerald-600/20` |
| Decline / Delete / Danger | `bg-red-600 hover:bg-red-700` | `shadow-red-600/20` |
| Warning confirm | `bg-amber-500 hover:bg-amber-600` | `shadow-amber-500/20` |
| Neutral confirm | `bg-blue-600 hover:bg-blue-700` | `shadow-blue-600/20` |

---

## Action Buttons in Table Rows

Trigger confirmation dialogs from table rows using labeled pill buttons — not bare icons:

```tsx
{/* ✅ Correct — labeled, sized, clearly clickable */}
<button
  onClick={() => setApproveTarget(row)}
  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
>
  <CheckCircle className="h-3.5 w-3.5" />
  Approve
</button>

<button
  onClick={() => setDeclineTarget(row)}
  className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
>
  <XCircle className="h-3.5 w-3.5" />
  Decline
</button>

{/* ❌ Wrong — icon-only, too small, no affordance */}
<button className="rounded p-1 text-emerald-600 hover:bg-emerald-50">
  <CheckCircle className="h-4 w-4" />
</button>
```

---

## Rules

1. **Never use `confirm()` or `alert()`** — always use a proper dialog component.
2. **`max-w-md`** for confirmation dialogs; `max-w-2xl`/`max-w-3xl` for full forms.
3. **Warning banner** when the action is irreversible or has notable side effects.
4. **Disable the confirm button** when required input is empty (e.g. decline reason).
5. **`Loader2` spinner** on the confirm button while the async action is in flight.
6. **`active:scale-[0.98]`** on the confirm button for tactile press feedback.
7. **Click-outside to dismiss** via `e.target === e.currentTarget` on the backdrop.
