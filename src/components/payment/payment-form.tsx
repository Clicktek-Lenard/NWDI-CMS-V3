"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────

interface QueueSummary {
  id: number;
  code: string;
  patientName: string;
  patientType: string;
  status: number;
  statusName: string;
  dateTime: string;
}

interface TransactionRow {
  id: number;
  idDoctor: number | null;
  nameDoctor: string;
  nameCompany: string;
  codeItemPrice: string;
  descriptionItemPrice: string;
  priceGroupItemPrice: string;
  amount: number;
  amountRemaining: number;
  transactionType: string;
  status: number;
  statusName: string;
}

interface CompanyOption {
  Id: number;
  Name: string | null;
  BillingType: string | null;
}

// ── Discount ─────────────────────────────────────────────────────

const DISCOUNT_OPTIONS: { label: string; rate: number | null }[] = [
  { label: "None",                    rate: 0    },
  { label: "5% Mktg. Discount",       rate: 0.05 },
  { label: "10% Mktg. Discount",      rate: 0.10 },
  { label: "15% Mktg. Discount",      rate: 0.15 },
  { label: "20% Mktg. Discount",      rate: 0.20 },
  { label: "10% Courtesy Discount",   rate: 0.10 },
  { label: "20% Disability Discount", rate: 0.20 },
  { label: "10% Employee Discount",   rate: 0.10 },
  { label: "15% Employee Discount",   rate: 0.15 },
  { label: "20% Employee Discount",   rate: 0.20 },
  { label: "10% Pag-ibig Discount",   rate: 0.10 },
  { label: "30% Special Discount",    rate: 0.30 },
  // null rate = manual entry
];

// ── Provider ─────────────────────────────────────────────────────

type ProviderType = "PATIENT" | "HMO" | "CORPORATE";
const PROVIDER_TYPES: ProviderType[] = ["PATIENT", "HMO", "CORPORATE"];

// BillingType keyword per provider (filters company.BillingType in DB).
// CORPORATE has no single consistent BillingType value — show all companies.
const PROVIDER_BILLING_TYPE: Partial<Record<ProviderType, string>> = {
  HMO: "HMO",
};

// ── Payment modes ─────────────────────────────────────────────────

type PayMode = "Cash Pay" | "Credit Card Pay" | "Online/Bank Transfer" | "G-Cash Pay" | "Cheque Pay";
const ALL_PAY_MODES: PayMode[] = [
  "Cash Pay", "Credit Card Pay", "Online/Bank Transfer", "G-Cash Pay", "Cheque Pay",
];

interface PayModeDetail {
  mode:     PayMode;
  amount:   number;
  refNo:    string;
  bankName: string;
}

function emptyDetail(mode: PayMode): PayModeDetail {
  return { mode, amount: 0, refNo: "", bankName: "" };
}

// ── Coverage ──────────────────────────────────────────────────────

type CoverageType = "FULL" | "PARTIAL";

// ── Helpers ───────────────────────────────────────────────────────

function fmt(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}
function fmtDT(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ── Company search dropdown ───────────────────────────────────────

function CompanySearch({
  providerType,
  value,
  onChange,
}: {
  providerType: ProviderType;
  value: string;
  onChange: (name: string) => void;
}) {
  const [query,    setQuery]    = useState(value);
  const [results,  setResults]  = useState<CompanyOption[]>([]);
  const [open,     setOpen]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const billingType = PROVIDER_BILLING_TYPE[providerType] ?? "";

  // Reset when provider changes
  useEffect(() => { setQuery(""); onChange(""); setResults([]); }, [providerType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleInput(v: string) {
    setQuery(v);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: v, limit: "30" });
        if (billingType) params.set("billingType", billingType);
        const data = await apiFetch<{ data: CompanyOption[] }>(`/api/companies?${params}`);
        setResults(data.data);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
  }

  function select(name: string) {
    setQuery(name);
    onChange(name);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative flex-1">
      <input
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => { setOpen(true); if (!results.length) handleInput(query); }}
        placeholder="Bill To"
        className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none"
      />
      {open && (results.length > 0 || loading) && (
        <div className="absolute left-0 top-full z-50 mt-0.5 max-h-48 w-full overflow-auto rounded border border-slate-200 bg-white shadow-lg">
          {loading ? (
            <div className="px-3 py-2 text-xs text-slate-400">Searching…</div>
          ) : (
            results.map((c) => (
              <button key={c.Id} type="button"
                onMouseDown={() => select(c.Name ?? "")}
                className="block w-full px-3 py-1.5 text-left text-xs hover:bg-blue-50 hover:text-blue-700">
                {c.Name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────

export function PaymentForm({
  queue,
  transactions,
}: {
  queue:        QueueSummary;
  transactions: TransactionRow[];
}) {
  const router = useRouter();

  // ── Transaction selection ──
  const unpaidTxs = transactions.filter((tx) => tx.status < 210);
  const paidTxs   = transactions.filter((tx) => tx.status === 210);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(unpaidTxs.map((tx) => tx.id))
  );

  function toggleTx(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
    });
  }
  function selectAll() { setSelectedIds(new Set(unpaidTxs.map((tx) => tx.id))); }
  function clearAll()  { setSelectedIds(new Set()); }

  // ── Discount ──
  const [discountLabel,  setDiscountLabel]  = useState("None");
  const [discountId,     setDiscountId]     = useState("");
  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [loyaltyId,      setLoyaltyId]      = useState("");
  const [loyaltyPoints,  setLoyaltyPoints]  = useState("");

  const discountOption = DISCOUNT_OPTIONS.find((d) => d.label === discountLabel) ?? DISCOUNT_OPTIONS[0];


  // ── Bill To ──
  const [providerType,   setProviderType]   = useState<ProviderType>("PATIENT");
  const [billTo,         setBillTo]         = useState("");
  const [coverageType,   setCoverageType]   = useState<CoverageType>("FULL");
  const [coverageAmount, setCoverageAmount] = useState<number>(0);
  const [hmoId,          setHmoId]          = useState("");

  // ── Payment modes (multi-select) ──
  const [selectedModes, setSelectedModes] = useState<PayMode[]>(["Cash Pay"]);
  const [modeDetails,   setModeDetails]   = useState<Record<PayMode, PayModeDetail>>({
    "Cash Pay":             emptyDetail("Cash Pay"),
    "Credit Card Pay":      emptyDetail("Credit Card Pay"),
    "Online/Bank Transfer": emptyDetail("Online/Bank Transfer"),
    "G-Cash Pay":           emptyDetail("G-Cash Pay"),
    "Cheque Pay":           emptyDetail("Cheque Pay"),
  });

  function toggleMode(mode: PayMode) {
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  }

  function updateDetail(mode: PayMode, field: keyof PayModeDetail, val: string | number) {
    setModeDetails((prev) => ({ ...prev, [mode]: { ...prev[mode], [field]: val } }));
  }

  const [orNumber, setOrNumber] = useState("");

  // ── Actions ──
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  // ── Computed amounts ──
  const selectedTotal = useMemo(
    () => unpaidTxs.filter((tx) => selectedIds.has(tx.id)).reduce((s, tx) => s + tx.amountRemaining, 0),
    [unpaidTxs, selectedIds]
  );

  const discountableAmount = selectedTotal;

  const discountAmount = useMemo(() => {
    if (discountOption.rate !== null) return Math.round(discountableAmount * discountOption.rate * 100) / 100;
    return manualDiscount;
  }, [discountOption, discountableAmount, manualDiscount]);

  const netAmount = Math.max(0, selectedTotal - discountAmount);

  const grandTotal   = transactions.filter((tx) => tx.status < 650).reduce((s, tx) => s + tx.amount, 0);
  const totalBalance = transactions.filter((tx) => tx.status < 210 && tx.status < 650)
    .reduce((s, tx) => s + tx.amountRemaining, 0);

  const totalPaymentEntered = selectedModes.reduce((s, m) => s + (modeDetails[m]?.amount ?? 0), 0);

  // ── Search filter ──
  const [searchTerm, setSearchTerm] = useState("");

  // ── Group transactions by doctor ──
  const groupedByDoctor = useMemo(() => {
    const map = new Map<string, TransactionRow[]>();
    const filtered = searchTerm
      ? transactions.filter((tx) =>
          tx.descriptionItemPrice.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.codeItemPrice.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.nameCompany.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : transactions;
    for (const tx of filtered) {
      const key = tx.nameDoctor || "—";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tx);
    }
    return map;
  }, [transactions, searchTerm]);

  const alreadyFullyPaid = queue.status >= 210 && queue.status < 650;

  // ── Submit ──
  async function handlePost() {
    if (selectedIds.size === 0) { setError("Select at least one transaction."); return; }
    if (selectedModes.length === 0) { setError("Select at least one payment mode."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      const data = await apiFetch<{ success?: boolean; message?: string }>(`/api/queue/${queue.id}/payment`, {
        method: "POST",
        body: JSON.stringify({
          providerType,
          billTo:         providerType !== "PATIENT" ? billTo : "",
          cardNumber:     hmoId,
          coverageType,
          coverageAmount: coverageType === "PARTIAL" ? coverageAmount : 0,
          paymentMethod:  selectedModes[0],       // primary for legacy field
          paymentMethods: selectedModes.map((m) => ({ ...modeDetails[m] })),
          orNumber,
          discountType:   discountLabel,
          discountId,
          discountAmount,
          transactionIds: Array.from(selectedIds),
        }),
      });
      setSuccess(data.message ?? "Payment processed successfully.");
      setTimeout(() => router.push("/payment"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col">

      {/* ── Header breadcrumb ── */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2.5">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.push("/payment")}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Payment
          </button>
          <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
          <span className="text-sm font-semibold text-slate-700">Billing Summary</span>
        </div>
        <span className="font-mono text-xs font-bold tracking-widest text-slate-400">{queue.code}</span>
      </div>

      {/* ── Patient Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a5fa8] via-[#2176c0] to-[#1d8cd7] px-6 py-4 text-white shadow-md">
        {/* subtle grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 40px)" }} />

        <div className="relative flex items-start justify-between gap-6">
          {/* Left: name + type badge */}
          <div className="min-w-0">
            <p className="truncate text-2xl font-bold leading-tight tracking-tight">{queue.patientName}</p>
            <span className="mt-1 inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
              {queue.patientType || "OUT-PATIENT"}
            </span>
          </div>

          {/* Right: meta chips */}
          <div className="flex shrink-0 flex-wrap items-start justify-end gap-2">
            <div className="rounded-lg bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider opacity-75">Queue No.</p>
              <p className="font-mono text-sm font-bold">{queue.code}</p>
            </div>
            <div className="rounded-lg bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider opacity-75">Date &amp; Time</p>
              <p className="text-sm font-semibold">{fmtDT(queue.dateTime)}</p>
            </div>
            {/* Status badge — color by code */}
            <div className={`rounded-lg px-3 py-1.5 backdrop-blur-sm ${
              queue.status >= 650 ? "bg-red-500/80" :
              queue.status === 210 ? "bg-emerald-500/80" :
              queue.status === 205 ? "bg-amber-400/90 text-amber-900" :
              "bg-white/15"
            }`}>
              <p className="text-[10px] font-medium uppercase tracking-wider opacity-75">Status</p>
              <p className="text-sm font-bold">{queue.statusName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Banners ── */}
      {error && (
        <div className="mx-6 mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mx-6 mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}
      {alreadyFullyPaid && (
        <div className="mx-6 mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          All transactions on this queue have been fully paid.
        </div>
      )}

      {/* ── Two-column main area ── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ── LEFT: List of Procedures ── */}
        <div className="flex flex-col border-r border-slate-200 bg-white" style={{ width: "56%" }}>
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">List of Procedures</span>
            {unpaidTxs.length > 0 && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {unpaidTxs.length} for payment
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-2">
            <div className="flex items-center gap-2 text-xs">
              <button type="button" onClick={selectAll}
                className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                Select All
              </button>
              <button type="button" onClick={clearAll}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
                Clear
              </button>
              {selectedIds.size > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700 ring-1 ring-blue-200">
                  {selectedIds.size} selected
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <svg className="absolute left-2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search procedures…"
                className="h-7 w-40 rounded-md border border-slate-200 pl-7 pr-2 text-xs focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-100" />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#1e4f80] text-white text-[11px] uppercase tracking-wide">
                  <th className="w-7 px-3 py-2.5"></th>
                  <th className="px-3 py-2.5 font-semibold">Company</th>
                  <th className="px-3 py-2.5 font-semibold">Code</th>
                  <th className="px-3 py-2.5 font-semibold">Item Name</th>
                  <th className="px-3 py-2.5 font-semibold">Type</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Amount</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                      No transactions on this queue.
                    </td>
                  </tr>
                ) : (
                  Array.from(groupedByDoctor.entries()).map(([doctor, txs]) => (
                    <React.Fragment key={doctor}>
                      <tr className="bg-slate-100 border-t border-slate-200">
                        <td colSpan={8} className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{doctor}</span>
                          </div>
                        </td>
                      </tr>
                      {txs.map((tx) => {
                        const isPaid      = tx.status === 210;
                        const isCancelled = tx.status >= 650;
                        const isUnpaid    = !isPaid && !isCancelled;
                        const isSelected  = selectedIds.has(tx.id);
                        return (
                          <tr key={tx.id}
                            onClick={() => isUnpaid && toggleTx(tx.id)}
                            className={`border-t border-slate-100 transition-colors ${
                              isCancelled ? "opacity-40" :
                              isPaid      ? "bg-emerald-50/30" :
                              isSelected  ? "cursor-pointer bg-blue-50/50 hover:bg-blue-50/70" :
                                            "cursor-pointer hover:bg-slate-50"
                            }`}>
                            <td className="px-3 py-2 text-center">
                              {isUnpaid && (
                                <input type="checkbox" checked={isSelected}
                                  onChange={() => toggleTx(tx.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600" />
                              )}
                            </td>
                            <td className={`px-3 py-2 ${isCancelled ? "line-through text-slate-400" : "text-blue-600"}`}>
                              {tx.nameCompany}
                            </td>
                            <td className={`px-3 py-2 font-mono ${isCancelled ? "line-through text-slate-400" : "text-slate-700"}`}>
                              {tx.codeItemPrice}
                            </td>
                            <td className={`px-3 py-2 ${isCancelled ? "line-through text-slate-400" : "text-slate-800"}`}>
                              {tx.descriptionItemPrice}
                            </td>
                            <td className="px-3 py-2 text-slate-500">{tx.priceGroupItemPrice || tx.transactionType}</td>
                            <td className="px-3 py-2 text-right text-slate-700">{tx.amount.toLocaleString("en-PH")}</td>
                            <td className="px-3 py-2">
                              {isCancelled ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 ring-1 ring-red-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                  Cancelled
                                </span>
                              ) : isPaid ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                  Paid
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                  {tx.statusName || "For Payment"}
                                </span>
                              )}
                            </td>
                            <td className={`px-3 py-2 text-right font-semibold ${isPaid ? "text-emerald-700" : isCancelled ? "text-slate-400" : "text-blue-700"}`}>
                              {tx.amountRemaining.toLocaleString("en-PH")}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer totals + action buttons */}
          <div className="border-t-2 border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-end justify-between gap-4">
              {/* Action buttons — open PDF in new tab */}
              <div className="flex items-center gap-1.5">
                <a href={`/api/queue/${queue.id}/pdf?type=drf`} target="_blank" rel="noopener noreferrer"
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
                  DRF
                </a>
                <a href={`/api/queue/${queue.id}/pdf?type=routing-slip`} target="_blank" rel="noopener noreferrer"
                  className="rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-cyan-700 transition-colors">
                  Routing Slip
                </a>
                <a href={`/api/queue/${queue.id}/pdf?type=charge-slip`} target="_blank" rel="noopener noreferrer"
                  className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition-colors">
                  Charge Slip
                </a>
                <a href={`/api/queue/${queue.id}/pdf?type=or`} target="_blank" rel="noopener noreferrer"
                  className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-violet-700 transition-colors">
                  O.R.
                </a>
              </div>

              {/* Totals */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Grand Total</p>
                  <p className="text-lg font-extrabold text-[#1a5fa8]">{fmt(grandTotal)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Balance</p>
                  <p className={`text-lg font-extrabold ${totalBalance > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {fmt(totalBalance)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Cashiering ── */}
        <div className="flex flex-col bg-[#fafaf8]" style={{ width: "44%" }}>
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Cashiering</span>
            {selectedIds.size > 0 && (
              <span className="text-xs font-semibold text-blue-600">{fmt(netAmount)} due</span>
            )}
          </div>

          <div className="flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-4 py-3">

            {/* ── Discount ── */}
            <fieldset className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <legend className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500">Discount</legend>
              <div className="space-y-2">

                {/* Less / Type / ID */}
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white">Less:</span>
                  <span className="shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white">Type:</span>
                  <select value={discountLabel}
                    onChange={(e) => { setDiscountLabel(e.target.value); setManualDiscount(0); }}
                    className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none">
                    {DISCOUNT_OPTIONS.map((d) => (
                      <option key={d.label} value={d.label}>{d.label}</option>
                    ))}
                  </select>
                  <input type="text" value={discountId} onChange={(e) => setDiscountId(e.target.value)}
                    placeholder="ID#"
                    className="w-20 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                </div>

                {/* Discountable amount / discount value */}
                <div className="flex items-center gap-1.5">
                  <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">
                    Discountable Amount:
                  </span>
                  <div className="flex flex-1 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
                    <span className="text-slate-400">₱</span>
                    <span className="font-semibold text-slate-700">
                      {discountableAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {discountOption.rate === null ? (
                    <input type="number" min={0} step={0.01} value={manualDiscount}
                      onChange={(e) => setManualDiscount(Number(e.target.value))}
                      className="w-24 rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none" />
                  ) : (
                    <div className="flex w-24 items-center justify-end rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-red-600">
                      {discountAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </div>
                  )}
                </div>

                {/* Loyalty */}
                <div className="flex items-center gap-1.5">
                  <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">
                    Loyalty Id / Points:
                  </span>
                  <input type="text" value={loyaltyId} onChange={(e) => setLoyaltyId(e.target.value)}
                    placeholder="ID#"
                    className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                  <input type="text" value={loyaltyPoints} onChange={(e) => setLoyaltyPoints(e.target.value)}
                    placeholder="Points"
                    className="w-24 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                </div>
              </div>
            </fieldset>

            {/* ── Bill To ── */}
            <fieldset className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <legend className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500">Bill To</legend>
              <div className="space-y-2">

                {/* Provider + Bill To */}
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white">Provider:</span>
                  <select value={providerType}
                    onChange={(e) => { setProviderType(e.target.value as ProviderType); setBillTo(""); }}
                    className="w-28 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none">
                    {PROVIDER_TYPES.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                  {providerType !== "PATIENT" ? (
                    <CompanySearch
                      providerType={providerType}
                      value={billTo}
                      onChange={setBillTo}
                    />
                  ) : (
                    <div className="flex-1 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-xs text-slate-400">
                      Bill To
                    </div>
                  )}
                </div>

                {/* Coverage Type / Amount */}
                <div className="flex items-center gap-1.5">
                  <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">
                    Coverage Type / Amount:
                  </span>
                  <select value={coverageType} onChange={(e) => setCoverageType(e.target.value as CoverageType)}
                    className="w-24 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none">
                    <option value="FULL">FULL</option>
                    <option value="PARTIAL">PARTIAL</option>
                  </select>
                  {coverageType === "PARTIAL" ? (
                    <input type="number" min={0} step={0.01} value={coverageAmount}
                      onChange={(e) => setCoverageAmount(Number(e.target.value))}
                      className="flex-1 rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none" />
                  ) : (
                    <div className="flex flex-1 items-center justify-end rounded border border-slate-100 bg-slate-50 px-2 py-1 text-xs text-slate-400">0</div>
                  )}
                </div>

                {/* HMO ID / Card Name */}
                <div className="flex items-center gap-1.5">
                  <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">
                    HMO ID# / Card Name:
                  </span>
                  <input type="text" value={hmoId} onChange={(e) => setHmoId(e.target.value)}
                    placeholder="HMO ID#"
                    disabled={providerType === "PATIENT"}
                    className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-400 focus:outline-none" />
                  <input type="text" placeholder="Card Name"
                    disabled={providerType === "PATIENT"}
                    className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-400 focus:outline-none" />
                </div>
              </div>
            </fieldset>

            {/* ── Payment Type ── */}
            <fieldset className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <legend className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500">Payment Type</legend>
              <div className="space-y-2">

                {/* Multi-select mode tags */}
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">
                    Select Payment Mode:
                  </span>
                  <div className="flex flex-1 flex-wrap gap-1 rounded border border-slate-200 bg-white p-1.5 min-h-[2rem]">
                    {ALL_PAY_MODES.map((mode) => (
                      <button key={mode} type="button" onClick={() => toggleMode(mode)}
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                          selectedModes.includes(mode)
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}>
                        {mode}
                        {selectedModes.includes(mode) && (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Per-mode detail rows */}
                {selectedModes.map((mode) => (
                  <div key={mode} className="space-y-1.5">
                    {/* Cash Pay */}
                    {mode === "Cash Pay" && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">Cash Pay:</span>
                        <span className="text-xs text-slate-400">₱</span>
                        <input type="number" min={0} step={0.01}
                          value={modeDetails["Cash Pay"].amount || ""}
                          onChange={(e) => updateDetail("Cash Pay", "amount", Number(e.target.value))}
                          placeholder="0"
                          className="flex-1 rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none" />
                      </div>
                    )}

                    {/* Credit Card Pay */}
                    {mode === "Credit Card Pay" && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">Card Bank Name:</span>
                          <input type="text"
                            value={modeDetails["Credit Card Pay"].bankName}
                            onChange={(e) => updateDetail("Credit Card Pay", "bankName", e.target.value)}
                            placeholder="Card Bank Name"
                            className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">Ref. No. / Card Amt:</span>
                          <input type="text"
                            value={modeDetails["Credit Card Pay"].refNo}
                            onChange={(e) => updateDetail("Credit Card Pay", "refNo", e.target.value)}
                            placeholder="Ref. No."
                            className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                          <input type="number" min={0} step={0.01}
                            value={modeDetails["Credit Card Pay"].amount || ""}
                            onChange={(e) => updateDetail("Credit Card Pay", "amount", Number(e.target.value))}
                            placeholder="0"
                            className="w-24 rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none" />
                        </div>
                      </>
                    )}

                    {/* Online/Bank Transfer */}
                    {mode === "Online/Bank Transfer" && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">Bank Name:</span>
                          <input type="text"
                            value={modeDetails["Online/Bank Transfer"].bankName}
                            onChange={(e) => updateDetail("Online/Bank Transfer", "bankName", e.target.value)}
                            placeholder="Bank Name"
                            className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">Ref No. / Amount:</span>
                          <input type="text"
                            value={modeDetails["Online/Bank Transfer"].refNo}
                            onChange={(e) => updateDetail("Online/Bank Transfer", "refNo", e.target.value)}
                            placeholder="Ref. No."
                            className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                          <input type="number" min={0} step={0.01}
                            value={modeDetails["Online/Bank Transfer"].amount || ""}
                            onChange={(e) => updateDetail("Online/Bank Transfer", "amount", Number(e.target.value))}
                            placeholder="0"
                            className="w-24 rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none" />
                        </div>
                      </>
                    )}

                    {/* G-Cash Pay */}
                    {mode === "G-Cash Pay" && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">GCash Ref No. / Amt:</span>
                        <input type="text"
                          value={modeDetails["G-Cash Pay"].refNo}
                          onChange={(e) => updateDetail("G-Cash Pay", "refNo", e.target.value)}
                          placeholder="GCash Ref. No."
                          className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                        <span className="text-xs text-slate-400">₱</span>
                        <input type="number" min={0} step={0.01}
                          value={modeDetails["G-Cash Pay"].amount || ""}
                          onChange={(e) => updateDetail("G-Cash Pay", "amount", Number(e.target.value))}
                          placeholder="0"
                          className="w-24 rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none" />
                      </div>
                    )}

                    {/* Cheque Pay */}
                    {mode === "Cheque Pay" && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-[96px] shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold leading-tight text-white">Cheque Pay:</span>
                        <input type="text"
                          value={modeDetails["Cheque Pay"].refNo}
                          onChange={(e) => updateDetail("Cheque Pay", "refNo", e.target.value)}
                          placeholder="Cheque No."
                          className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                        <input type="number" min={0} step={0.01}
                          value={modeDetails["Cheque Pay"].amount || ""}
                          onChange={(e) => updateDetail("Cheque Pay", "amount", Number(e.target.value))}
                          placeholder="0"
                          className="w-24 rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-blue-400 focus:outline-none" />
                      </div>
                    )}
                  </div>
                ))}

                {/* OR Number */}
                <div className="flex items-center gap-1.5 border-t border-slate-100 pt-2">
                  <span className="shrink-0 rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white">OR Number:</span>
                  <input type="text" value={orNumber} onChange={(e) => setOrNumber(e.target.value)}
                    placeholder="Official receipt number…"
                    className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                </div>
              </div>
            </fieldset>

            {/* ── Net summary ── */}
            {selectedIds.size > 0 && (
              <div className="rounded-xl border border-[#1a5fa8]/20 bg-gradient-to-br from-[#1a5fa8]/5 to-[#1a5fa8]/10 px-4 py-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Selected ({selectedIds.size} procedure{selectedIds.size !== 1 ? "s" : ""})</span>
                    <span className="font-semibold">{fmt(selectedTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-red-600">
                      <span>Discount ({discountLabel})</span>
                      <span>− {fmt(discountAmount)}</span>
                    </div>
                  )}
                  {totalPaymentEntered > 0 && (
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Total Payment Entered</span>
                      <span className="font-semibold">{fmt(totalPaymentEntered)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-[#1a5fa8]/20 pt-2">
                  <span className="text-sm font-bold text-[#1a5fa8]">Net Amount Due</span>
                  <span className="text-xl font-extrabold text-[#1a5fa8]">{fmt(netAmount)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom action bar ── */}
      {(!alreadyFullyPaid && unpaidTxs.length > 0) && (
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-3">
          <button type="button" onClick={() => router.push("/payment")}
            className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handlePost}
            disabled={saving || selectedIds.size === 0 || selectedModes.length === 0}
            className="rounded-lg bg-[#1a5fa8] px-8 py-2 text-sm font-bold text-white shadow-md hover:bg-[#154d8c] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 transition-all">
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </span>
            ) : "Post Payment"}
          </button>
        </div>
      )}
      {alreadyFullyPaid && (
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-3">
          <button type="button" onClick={() => router.push("/payment")}
            className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Back to Payment List
          </button>
        </div>
      )}
    </div>
  );
}
