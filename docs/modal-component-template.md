# Modal Component — CMS v3 Standard Template

This document defines the standard pattern for modal dialogs used across all modules in CMS v3.
Reference implementation: `src/components/settings/user-modal.tsx`

---

## Visual Design

```
┌──────────────────────────────────────────────────┐
│  [Icon]  Title                              [✕]  │  ← header (shrink-0)
│          Subtitle / context                       │
├──────────────────────────────────────────────────┤
│                                                   │
│   ┌─ Section Label ──────────────────────────┐   │
│   │  Field 1          Field 2                │   │  ← scrollable body
│   │  Field 3          Field 4                │   │
│   └───────────────────────────────────────────┘  │
│                                                   │
│   ┌─ Section Label ──────────────────────────┐   │
│   │  ...                                     │   │
│   └───────────────────────────────────────────┘  │
│                                                   │
├──────────────────────────────────────────────────┤
│                        [Cancel]  [Save Changes]  │  ← footer (shrink-0)
└──────────────────────────────────────────────────┘
```

---

## Overlay

```tsx
<div
  ref={backdropRef}
  onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
>
```

- `backdrop-blur-sm` — frosted glass effect on page behind
- Click outside the modal card to dismiss
- `z-50` — above all page content

---

## Modal Card

```tsx
<div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col dark:border-slate-700 dark:bg-slate-800">
```

- `max-w-2xl` — default width; use `max-w-3xl` for wide forms (e.g. Physician)
- `max-h-[90vh] flex flex-col` — enables independent header/footer with scrollable body
- `rounded-2xl` — consistent with CMS v3 card radius

---

## Header

```tsx
<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
  <div className="flex items-center gap-3">
    {/* Icon badge — color matches action type */}
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
      <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Modal Title</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500">Subtitle or context</p>
    </div>
  </div>
  <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300">
    <X className="h-5 w-5" />
  </button>
</div>
```

### Icon badge colors by action type

| Action | Badge bg | Icon color |
|---|---|---|
| Create / Add | `bg-blue-100 dark:bg-blue-900/30` | `text-blue-600 dark:text-blue-400` |
| Edit / Update | `bg-amber-100 dark:bg-amber-900/30` | `text-amber-600 dark:text-amber-400` |
| Delete / Danger | `bg-red-100 dark:bg-red-900/30` | `text-red-600 dark:text-red-400` |
| View / Info | `bg-slate-100 dark:bg-slate-700` | `text-slate-600 dark:text-slate-300` |

---

## Scrollable Body

```tsx
<div className="overflow-y-auto px-6 py-5">
  {/* Error banner */}
  {apiError && (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
      <X className="h-4 w-4 shrink-0" />
      {apiError}
    </div>
  )}

  <form id="my-form" onSubmit={handleSubmit} className="space-y-5">
    {/* sections here */}
  </form>
</div>
```

---

## Field Wrapper Component

Define inline in the same file:

```tsx
function Field({
  label, required, error, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
```

---

## Input Styles

```tsx
const INPUT_CLS =
  "block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400";

const INPUT_VALID =
  "border-slate-200 hover:border-slate-300 focus:border-blue-400 dark:border-slate-600 dark:hover:border-slate-500";

const INPUT_ERROR =
  "border-red-300 focus:border-red-400";
```

Usage:
```tsx
<input className={`${INPUT_CLS} ${hasError ? INPUT_ERROR : INPUT_VALID}`} />
```

---

## Section Card

Group related fields inside a bordered card:

```tsx
<div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
    Section Title
  </p>
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
    {/* Fields */}
  </div>
</div>
```

---

## Toggle Switch

For boolean settings inside a section:

```tsx
<div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-700/50">
  <div>
    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Label</span>
    <p className="text-xs text-slate-400 dark:text-slate-500">Helper text</p>
  </div>
  <label className="relative inline-flex cursor-pointer items-center">
    <input type="checkbox" checked={value} onChange={(e) => setValue(e.target.checked)} className="peer sr-only" />
    <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-emerald-400/20 dark:bg-slate-600" />
  </label>
</div>
```

---

## Checkbox Pills (multi-select)

For selecting multiple options (e.g. permissions, positions, requirements):

```tsx
function CheckPill({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        checked
          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
      }`}
    >
      {label}
    </button>
  );
}

// Usage
<div className="flex flex-wrap gap-2">
  <CheckPill label="Option A" checked={form.optionA} onChange={(v) => set("optionA", v)} />
  <CheckPill label="Option B" checked={form.optionB} onChange={(v) => set("optionB", v)} />
</div>
```

---

## Footer

```tsx
<div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
  <button
    type="button"
    onClick={onClose}
    className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
  >
    Cancel
  </button>
  <button
    type="submit"
    form="my-form"
    disabled={isSubmitting}
    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
      isEdit
        ? "bg-amber-500 shadow-amber-500/20 hover:bg-amber-600"
        : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
    }`}
  >
    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
    {isEdit ? "Save Changes" : "Create"}
  </button>
</div>
```

### Submit button colors

| Mode | Background | Shadow |
|---|---|---|
| Create | `bg-blue-600 hover:bg-blue-700` | `shadow-blue-600/20` |
| Edit | `bg-amber-500 hover:bg-amber-600` | `shadow-amber-500/20` |
| Danger | `bg-red-600 hover:bg-red-700` | `shadow-red-600/20` |

---

## Keyboard / Accessibility

- `Escape` key closes the modal:

```tsx
useEffect(() => {
  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape" && open) onClose();
  }
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [open, onClose]);
```

- Click outside to close via `backdropRef` (see Overlay section above)
- Submit button connects to form via `form="my-form"` — keeps the button outside the `<form>` tag possible

---

## Applied Modals

| Module | File | Mode |
|---|---|---|
| User Settings — Create/Edit | `src/components/settings/user-modal.tsx` | add / edit |
| User Settings — Delete | `src/components/settings/delete-user-dialog.tsx` | danger |
| Card Management — Register | `src/components/enrollment/register-card-modal.tsx` | create |
| Physician Accreditation — Form | `src/components/eros/physician-form-modal.tsx` | create / edit |

---

## Rules

1. **Always `shrink-0` on header and footer** — prevents them from being compressed by the scrollable body.
2. **`overflow-y-auto` only on the body** — never on the outer card or header/footer.
3. **Form id + `form=` attribute** — submit button lives in the footer, outside `<form>`, but targets it via `id`.
4. **Error banner at the top of the body** — never inside a section card.
5. **Never nest modals** — if a confirmation is needed, use a simple `confirm()` or a separate small dialog.
6. **`backdrop-blur-sm` always** — part of the CMS v3 visual identity.
