"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────
interface PatientResult {
  id: number;
  code: string;
  fullName: string;
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string;
  dob: string | null;
}

interface CompanyResult {
  Id: number;
  Code: string;
  Name: string;
  ErosCode: string;
  ShortName: string | null;
}

interface PhysicianResult {
  id: number;
  code: string;
  erosCode: string;
  fullName: string;
  displayName: string;
  degree: string;
}

interface ItemPriceResult {
  // PHP DataTable field names (exact)
  IdItem:      number;
  Code:        string;
  Description: string;
  Price:       number;
  PriceGroup:  string;
  PDefault:    string;   // shown in red under description
  ItemUsed:    number;
  CompanyCode: string;
  Group:       string;   // itemmaster.Group
  IMSubGroup:  string;   // itemmaster.SubGroup
  IMAllowQty:  string;   // "0" or "1"
  SubGroup:    string;   // company.SubGroup
  // Extras for transaction creation
  readersFee:  number;
  origAmount:  number;
}

interface TransactionTypeResult {
  Code:        string;
  Description: string | null;
}

interface TransactionRow {
  key: string; // local unique key
  idCompany: number;
  nameCompany: string;
  idDoctor: number | null;
  nameDoctor: string;
  transactionType: string;
  idItemPrice: number;
  codeItemPrice: string;
  descriptionItemPrice: string;
  priceGroupItemPrice: string;
  amountItemPrice: number;
  readersFee: number;
  origAmount: number;
  groupItemMaster: string;
}

// ── Helpers ───────────────────────────────────────────────────
function calcAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

function useDebounce<T>(value: T, ms: number) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return dv;
}

// ── Searchable dropdown ───────────────────────────────────────
function SearchDropdown<T>({
  label,
  placeholder,
  required,
  value,
  displayValue,
  onSelect,
  onClear,
  results,
  loading,
  onSearch,
  renderItem,
  renderSelected,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
  value: T | null;
  displayValue: string;
  onSelect: (item: T) => void;
  onClear: () => void;
  results: T[];
  loading: boolean;
  onSearch: (q: string) => void;
  renderItem: (item: T) => React.ReactNode;
  renderSelected: (item: T) => React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQ = useDebounce(q, 260);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSearch(debouncedQ);
  }, [debouncedQ, onSearch]);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (value) {
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          {label}{required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
          <div className="min-w-0 flex-1 text-sm">{renderSelected(value)}</div>
          <button
            type="button"
            onClick={() => { onClear(); setQ(""); }}
            className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-600"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          {loading
            ? <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
          }
        </div>
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
        />
        {open && results.length > 0 && (
          <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {results.map((item, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={() => { onSelect(item); setQ(displayValue); setOpen(false); }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
              >
                {renderItem(item)}
              </button>
            ))}
          </div>
        )}
        {open && !loading && results.length === 0 && q.length >= 2 && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-lg">
            No results for &ldquo;{q}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export function CreateTransactionForm({ clinicCode, clinicName }: { clinicCode: string; clinicName: string }) {
  const router = useRouter();

  // ── Patient ────────────────────────────────────────────────
  const [patientQ, setPatientQ]               = useState("");
  const [patientResults, setPatientResults]   = useState<PatientResult[]>([]);
  const [patientLoading, setPatientLoading]   = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientResult | null>(null);

  // ── Queue meta ─────────────────────────────────────────────
  const [priority, setPriority] = useState<0 | 1 | 4>(0);
  const [notes, setNotes]       = useState("");
  const [medication, setMedication]   = useState("");
  const [lastDose, setLastDose]       = useState("");
  const [lastPeriod, setLastPeriod]   = useState("");

  // ── Transactions ───────────────────────────────────────────
  const [txRows, setTxRows] = useState<TransactionRow[]>([]);

  // ── Add Items Panel ────────────────────────────────────────
  const [addPanelOpen, setAddPanelOpen]         = useState(false);
  const [defaultCompany, setDefaultCompany]     = useState<CompanyResult | null>(null);
  const [panelCompany, setPanelCompany]         = useState<CompanyResult | null>(null);
  const [panelPhysician, setPanelPhysician]     = useState<PhysicianResult | null>(null);
  const [companyResults, setCompanyResults]     = useState<CompanyResult[]>([]);
  const [physicianResults, setPhysicianResults] = useState<PhysicianResult[]>([]);
  const [companyLoading, setCompanyLoading]     = useState(false);
  const [physicianLoading, setPhysicianLoading] = useState(false);
  const [items, setItems]                       = useState<ItemPriceResult[]>([]);
  const [itemsLoading, setItemsLoading]         = useState(false);
  const [selectedItemIds, setSelectedItemIds]   = useState<Set<number>>(new Set());
  const [txType, setTxType]                     = useState("");
  const [txTypes, setTxTypes]                   = useState<TransactionTypeResult[]>([]);
  const [panelError, setPanelError]             = useState("");

  // ── Submit ─────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Live clock ────────────────────────────────────────────
  const [nowStr, setNowStr] = useState("");
  useEffect(() => {
    const tick = () => setNowStr(new Date().toLocaleString("en-PH", { hour12: true }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Patient search ─────────────────────────────────────────
  const searchPatients = useCallback(async (q: string) => {
    if (q.length < 2) { setPatientResults([]); return; }
    setPatientLoading(true);
    try {
      const res = await fetch(`/api/patients/search?q=${encodeURIComponent(q)}&limit=8`);
      const json: { data: PatientResult[] } = await res.json();
      setPatientResults(json.data ?? []);
    } finally {
      setPatientLoading(false);
    }
  }, []);

  useEffect(() => { searchPatients(patientQ); }, [patientQ, searchPatients]);

  // ── Fetch transaction types on mount ──────────────────────
  useEffect(() => {
    fetch("/api/transaction-types")
      .then((r) => r.json())
      .then((json: { data: TransactionTypeResult[] }) => {
        const types = json.data ?? [];
        setTxTypes(types);
        if (types.length > 0) setTxType(types[0].Code);
      })
      .catch(() => {});
  }, []);

  // ── Fetch clinic default company on mount ──────────────────
  useEffect(() => {
    if (!clinicCode) return;
    fetch(`/api/companies?default=1&clinicCode=${encodeURIComponent(clinicCode)}`)
      .then((r) => r.json())
      .then((json: { data: CompanyResult[] }) => {
        if (json.data?.[0]) setDefaultCompany(json.data[0]);
      })
      .catch(() => {});
  }, [clinicCode]);

  // ── Company search ─────────────────────────────────────────
  const searchCompanies = useCallback(async (q: string) => {
    setCompanyLoading(true);
    try {
      const res = await fetch(`/api/companies?q=${encodeURIComponent(q)}&limit=15`);
      const json: { data: CompanyResult[] } = await res.json();
      setCompanyResults(json.data ?? []);
    } finally {
      setCompanyLoading(false);
    }
  }, []);

  // ── Physician search ───────────────────────────────────────
  const searchPhysicians = useCallback(async (q: string) => {
    setPhysicianLoading(true);
    try {
      const res = await fetch(`/api/physicians?q=${encodeURIComponent(q)}&limit=15`);
      const json: { data: PhysicianResult[] } = await res.json();
      setPhysicianResults(json.data ?? []);
    } finally {
      setPhysicianLoading(false);
    }
  }, []);

  // ── Load items when company selected ──────────────────────
  useEffect(() => {
    if (!panelCompany) { setItems([]); setSelectedItemIds(new Set()); return; }
    setItemsLoading(true);
    setSelectedItemIds(new Set());
    fetch(`/api/item-prices?companyId=${panelCompany.Id}&clinicCode=${encodeURIComponent(clinicCode)}`)
      .then((r) => r.json())
      .then((json: { data: ItemPriceResult[] }) => setItems(json.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setItemsLoading(false));
  }, [panelCompany, clinicCode]);

  function toggleItem(id: number) {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addSelectedItems() {
    if (!panelCompany) return;
    if (!panelPhysician) { setPanelError("Doctor is required."); return; }
    setPanelError("");
    const toAdd = items.filter((it) => selectedItemIds.has(it.IdItem));
    const newRows: TransactionRow[] = toAdd.map((it) => ({
      key: `${Date.now()}-${it.IdItem}`,
      idCompany:            panelCompany.Id,
      nameCompany:          panelCompany.Name,
      idDoctor:             panelPhysician?.id ?? null,
      nameDoctor:           panelPhysician?.displayName ?? "",
      transactionType:      txType,
      idItemPrice:          it.IdItem,
      codeItemPrice:        it.Code,
      descriptionItemPrice: it.Description,
      priceGroupItemPrice:  it.PriceGroup,
      amountItemPrice:      it.Price,
      readersFee:           it.readersFee,
      origAmount:           it.origAmount,
      groupItemMaster:      it.Group,
    }));
    setTxRows((prev) => [...prev, ...newRows]);
    setPanelCompany(null);
    setPanelPhysician(null);
    setItems([]);
    setSelectedItemIds(new Set());
    setAddPanelOpen(false);
  }

  function removeRow(key: string) {
    setTxRows((prev) => prev.filter((r) => r.key !== key));
  }

  const totalAmount = txRows.reduce((s, r) => s + r.amountItemPrice, 0);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedPatient) { setSubmitError("Please select a patient."); return; }
    setSubmitting(true);
    setSubmitError("");

    try {
      const body = {
        idPatient:    selectedPatient.id,
        fullName:     selectedPatient.fullName,
        lastName:     selectedPatient.lastName,
        firstName:    selectedPatient.firstName,
        middleName:   selectedPatient.middleName,
        gender:       selectedPatient.gender,
        dob:          selectedPatient.dob,
        notes,
        priority,
        medication,
        lastDose:     lastDose || undefined,
        lastPeriod:   lastPeriod || undefined,
        transactions: txRows.map(({ key: _k, ...rest }) => rest),
      };

      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || `HTTP ${res.status}`);
      }

      router.push("/cms/queue");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save transaction.");
      setSubmitting(false);
    }
  }

  const age = calcAge(selectedPatient?.dob ?? null);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* ── Error banner ── */}
      {submitError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {submitError}
        </div>
      )}

      {/* ── Two-column panel ── */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* ── LEFT: Patient Information ── */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-700">Patient Information</h2>
          </div>
          <div className="space-y-4 p-5">

            {/* Patient search */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Patient&apos;s Name <span className="text-red-500">*</span>
              </label>
              {selectedPatient ? (
                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-bold text-blue-700">
                    {selectedPatient.firstName.charAt(0)}{selectedPatient.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800 text-sm">{selectedPatient.fullName}</p>
                    <p className="text-xs text-slate-500">
                      <span className="font-mono">{selectedPatient.code}</span>
                      {age !== null && <span className="ml-2">{age}y</span>}
                      {selectedPatient.gender && <span className="ml-1">· {selectedPatient.gender}</span>}
                    </p>
                  </div>
                  <button type="button" onClick={() => setSelectedPatient(null)}
                    className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <PatientSearchInput
                  value={patientQ}
                  onChange={setPatientQ}
                  results={patientResults}
                  loading={patientLoading}
                  onSelect={(p) => { setSelectedPatient(p); setPatientQ(p.fullName); }}
                />
              )}
            </div>

            {/* DOB / Gender / Age row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Date of Birth</label>
                <input readOnly value={selectedPatient?.dob ?? ""} placeholder="—"
                  className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Gender</label>
                <input readOnly value={selectedPatient?.gender ?? ""} placeholder="—"
                  className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Age</label>
                <input readOnly value={age !== null ? `${age}` : ""} placeholder="—"
                  className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Additional notes..."
                className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
              />
            </div>

          </div>
        </div>

        {/* ── RIGHT: Queue Details ── */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-700">Queue Details</h2>
          </div>
          <div className="space-y-4 p-5">

            {/* Clinic */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Clinic</label>
              <input readOnly value={clinicName || clinicCode}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Lane / Priority</label>
              <div className="flex gap-2">
                {([
                  { label: "Regular",  value: 0, color: "blue"   },
                  { label: "Priority", value: 1, color: "amber"  },
                  { label: "VIP",      value: 4, color: "purple" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                      priority === opt.value
                        ? opt.color === "blue"   ? "border-blue-500 bg-blue-50 text-blue-700"
                        : opt.color === "amber"  ? "border-amber-500 bg-amber-50 text-amber-700"
                        :                          "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Medication */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Medication</label>
              <input
                type="text"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="Current medication (optional)"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
              />
            </div>

            {/* Last Dose / Last Period */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Last Dose</label>
                <input
                  type="datetime-local"
                  value={lastDose}
                  onChange={(e) => setLastDose(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Last Period</label>
                <input
                  type="date"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
                />
              </div>
            </div>

            {/* Date Time */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Date &amp; Time</label>
              <input readOnly value={nowStr}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
            </div>

          </div>
        </div>
      </div>

      {/* ── Transaction(s) Panel ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Transaction(s)</h2>
            {txRows.length > 0 && (
              <p className="text-xs text-slate-500">{txRows.length} item{txRows.length !== 1 ? "s" : ""} · Total: ₱{totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
            )}
          </div>
          {txRows.length > 0 && (() => {
            const doctors = [...new Set(txRows.map((r) => r.nameDoctor).filter(Boolean))];
            return doctors.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {doctors.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    {d}
                  </span>
                ))}
              </div>
            ) : null;
          })()}
          {!addPanelOpen && (
            <button
              type="button"
              onClick={() => { setAddPanelOpen(true); if (!panelCompany && defaultCompany) setPanelCompany(defaultCompany); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Items
            </button>
          )}
        </div>

        {/* ── Add Items Panel ── */}
        {addPanelOpen && (
          <div className="border-b border-slate-100 bg-slate-50/40 p-5">
            <div className="mb-4 grid gap-4 sm:grid-cols-3">
              {/* Company */}
              <SearchDropdown<CompanyResult>
                label="Company / HMO"
                placeholder="Search company..."
                required
                value={panelCompany}
                displayValue={panelCompany?.Name ?? ""}
                onSelect={setPanelCompany}
                onClear={() => { setPanelCompany(null); setItems([]); setSelectedItemIds(new Set()); }}
                results={companyResults}
                loading={companyLoading}
                onSearch={searchCompanies}
                renderItem={(c) => (
                  <div>
                    <p className="font-medium text-slate-800">{c.Name}</p>
                    <p className="text-xs text-slate-400">{c.Code}</p>
                  </div>
                )}
                renderSelected={(c) => (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{c.Name}</p>
                    <p className="text-xs text-slate-500">{c.Code}</p>
                  </div>
                )}
              />

              {/* Physician */}
              <SearchDropdown<PhysicianResult>
                label="Doctor"
                placeholder="Search physician..."
                required
                value={panelPhysician}
                displayValue={panelPhysician?.displayName ?? ""}
                onSelect={setPanelPhysician}
                onClear={() => setPanelPhysician(null)}
                results={physicianResults}
                loading={physicianLoading}
                onSearch={searchPhysicians}
                renderItem={(p) => (
                  <div>
                    <p className="font-medium text-slate-800">{p.displayName}</p>
                    <p className="text-xs text-slate-400">{p.degree}</p>
                  </div>
                )}
                renderSelected={(p) => (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.displayName}</p>
                    <p className="text-xs text-slate-500">{p.degree}</p>
                  </div>
                )}
              />

              {/* Transaction Type */}
              <TxTypeDropdown
                value={txType}
                options={txTypes}
                onChange={setTxType}
              />
            </div>

            {/* Items table */}
            {panelCompany && (
              <div className="mt-3">
                {itemsLoading ? (
                  <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Loading items for {panelCompany.Name}…
                  </div>
                ) : items.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">
                    No items found for this company.
                  </p>
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{items.length} items · {selectedItemIds.size} selected</span>
                      <button type="button" onClick={() => setSelectedItemIds(new Set(items.map(i => i.IdItem)))}
                        className="text-xs text-blue-600 hover:underline">Select all</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="w-8 px-3 py-2"></th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Code</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Description</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Category</th>
                            <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map((item) => (
                            <tr
                              key={item.IdItem}
                              onClick={() => toggleItem(item.IdItem)}
                              className={`cursor-pointer transition-colors ${selectedItemIds.has(item.IdItem) ? "bg-blue-50" : "hover:bg-slate-50"}`}
                            >
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedItemIds.has(item.IdItem)}
                                  onChange={() => toggleItem(item.IdItem)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600"
                                />
                              </td>
                              <td className="whitespace-nowrap px-3 py-2 font-mono text-slate-600">{item.Code}</td>
                              <td className="px-3 py-2 text-slate-800">
                                {item.Description}
                                {item.PDefault && (
                                  <span className="ml-1 text-xs text-red-500">{item.PDefault}</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-slate-500">{item.Group || item.PriceGroup}</td>
                              <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-slate-700">
                                ₱{item.Price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {panelError && (
              <p className="mt-3 text-xs font-medium text-red-600">{panelError}</p>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" onClick={() => { setAddPanelOpen(false); setPanelCompany(null); setPanelPhysician(null); setItems([]); setSelectedItemIds(new Set()); setPanelError(""); }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                type="button"
                onClick={addSelectedItems}
                disabled={!panelCompany || selectedItemIds.size === 0}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add {selectedItemIds.size > 0 ? `${selectedItemIds.size} Selected` : "Selected"}
              </button>
            </div>
          </div>
        )}

        {/* ── Transaction rows table ── */}
        {txRows.length === 0 && !addPanelOpen ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-slate-400">
            <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
            <p>No items added yet. Click <strong>Add Items</strong> to select services.</p>
          </div>
        ) : txRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-4 py-2.5 font-semibold text-slate-600">Company</th>
                  <th className="px-4 py-2.5 font-semibold text-slate-600">Item Code</th>
                  <th className="px-4 py-2.5 font-semibold text-slate-600">Description</th>
                  <th className="px-4 py-2.5 font-semibold text-slate-600">Type</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-slate-600">Amount</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const groups: { doctorName: string; rows: TransactionRow[] }[] = [];
                  const seen = new Map<string, number>();
                  for (const row of txRows) {
                    const dk = row.nameDoctor || "No Doctor Assigned";
                    if (!seen.has(dk)) { seen.set(dk, groups.length); groups.push({ doctorName: dk, rows: [] }); }
                    groups[seen.get(dk)!].rows.push(row);
                  }
                  return groups.flatMap(({ doctorName, rows }) => [
                    <tr key={`hdr-${doctorName}`}>
                      <td colSpan={6} className="bg-slate-100/80 px-4 py-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          {doctorName}
                        </div>
                      </td>
                    </tr>,
                    ...rows.map((row) => (
                      <tr key={row.key} className="border-t border-slate-100 hover:bg-slate-50/60">
                        <td className="px-4 py-2.5 text-slate-700">{row.nameCompany}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-600">{row.codeItemPrice}</td>
                        <td className="px-4 py-2.5 text-slate-800">{row.descriptionItemPrice}</td>
                        <td className="px-4 py-2.5 text-slate-500">{row.transactionType}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-slate-700">
                          ₱{row.amountItemPrice.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-2.5">
                          <button type="button" onClick={() => removeRow(row.key)}
                            className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )),
                  ]);
                })()}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/60">
                  <td colSpan={4} className="px-4 py-2.5 text-right text-xs font-semibold text-slate-600">Total Amount</td>
                  <td className="px-4 py-2.5 text-right text-sm font-bold text-slate-800">
                    ₱{totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : null}
      </div>

      {/* ── Bottom action bar ── */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !selectedPatient}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Save Transaction
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ── Patient search input (inline autocomplete) ────────────────
function PatientSearchInput({
  value,
  onChange,
  results,
  loading,
  onSelect,
}: {
  value: string;
  onChange: (v: string) => void;
  results: PatientResult[];
  loading: boolean;
  onSelect: (p: PatientResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {loading
          ? <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
        }
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Type patient name or code…"
        className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
      />
      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.map((p) => (
            <button key={p.id} type="button"
              onMouseDown={() => { onSelect(p); setOpen(false); }}
              className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-blue-50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                {p.firstName.charAt(0)}{p.lastName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{p.fullName}</p>
                <p className="text-xs text-slate-400">{p.code} · {p.gender} · {p.dob ?? "DOB unknown"}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && !loading && results.length === 0 && value.length >= 2 && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-lg">
          No patients found for &ldquo;{value}&rdquo;
        </div>
      )}
    </div>
  );
}

// ── Transaction type custom dropdown ─────────────────────────
function TxTypeDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: TransactionTypeResult[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((t) => t.Code === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref}>
      <label className="mb-1 block text-xs font-medium text-slate-600">Transaction Type</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left focus:border-blue-400 focus:outline-none"
        >
          {selected ? (
            <div>
              <p className="text-sm font-semibold text-slate-800">{selected.Code}</p>
              {selected.Description && (
                <p className="text-xs text-slate-500">{selected.Description}</p>
              )}
            </div>
          ) : (
            <span className="text-sm text-slate-400">Select type…</span>
          )}
          <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {open && options.length > 0 && (
          <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {options.map((t) => (
              <button
                key={t.Code}
                type="button"
                onMouseDown={() => { onChange(t.Code); setOpen(false); }}
                className={`block w-full px-3 py-2 text-left hover:bg-blue-50 ${value === t.Code ? "bg-blue-50" : ""}`}
              >
                <p className="font-medium text-slate-800">{t.Code}</p>
                {t.Description && (
                  <p className="text-xs text-slate-400">{t.Description}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
