"use client";

import { useState, useCallback, useEffect } from "react";
import {
  CreditCard, RefreshCw, Search, ChevronLeft, ChevronRight,
  ArrowRightLeft, PackageCheck, ShieldCheck, Plus, CheckCircle2,
  ChevronUp, ChevronDown, ChevronsUpDown,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { RegisterCardModal } from "./register-card-modal";
import { useToast, ToastContainer } from "@/components/ui/toast";

// ── Interfaces ────────────────────────────────────────────────

interface CardEnrollment {
  id: number;
  cardNumber: string;
  status: number;
  enrollmentDate: string | null;
  receivedBy: string | null;
  receivedDate: string | null;
  releaseTo: string | null;
  releaseBy: string | null;
  dateRelease: string | null;
  transferTo: string | null;
  transferBy: string | null;
  dateTransfer: string | null;
  clinicName: string | null;
  transferClinicName: string | null;
}

interface VerifiedCard {
  id: number;
  verifiedcardnumber: string;
  year: number | null;
  batch: number | null;
  month: number | null;
  ictreceived: string | null;
  datereceived: string | null;
}

interface Clinic {
  code: string;
  name: string;
}

type EnrollTab = "REGISTRATION" | "RECEIVING" | "TRANSFER";
type AllTab = "VERIFICATION" | EnrollTab;

interface ApiResponse {
  success: boolean;
  data: CardEnrollment[];
  total: number;
  totalPages: number;
}

interface VerifiedApiResponse {
  success: boolean;
  data: VerifiedCard[];
  total: number;
  totalPages: number;
}

// ── Sorting helpers ───────────────────────────────────────────
type SortDir = "asc" | "desc";

function sortRows<T>(rows: T[], key: keyof T | "", dir: SortDir): T[] {
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

function SortableHeader({
  label, colKey, sortKey, sortDir, onSort, align = "left",
}: {
  label: string; colKey: string; sortKey: string; sortDir: SortDir;
  onSort: (k: string) => void; align?: "left" | "right" | "center";
}) {
  const active = sortKey === colKey;
  return (
    <th
      onClick={() => onSort(colKey)}
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 text-${align} ${active ? "text-slate-700 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active
          ? sortDir === "asc"
            ? <ChevronUp className="h-3.5 w-3.5 text-blue-500" />
            : <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
          : <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />}
      </span>
    </th>
  );
}

// ── Helpers ───────────────────────────────────────────────────

/**
 * Status legend:
 *   0 = Enrolled / Released to clinic — pending receipt
 *   1 = Received at destination clinic
 *   2 = Transfer initiated (in transit)
 *   3 = Transfer received — new clinic has it
 */
function statusBadge(status: number) {
  const map: Record<number, { label: string; cls: string }> = {
    0: { label: "Pending Receipt", cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" },
    1: { label: "Received",        cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
    2: { label: "In Transit",      cls: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800" },
    3: { label: "Transfer Done",   cls: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" },
  };
  const entry = map[status] ?? { label: `Status ${status}`, cls: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

function fmt(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function fmtDateTime(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Component ─────────────────────────────────────────────────

export function EnrollmentClient() {
  const { toasts, toast, dismiss } = useToast();
  const [activeTab, setActiveTab] = useState<AllTab>("VERIFICATION");

  const [cards, setCards]                 = useState<CardEnrollment[]>([]);
  const [verifiedCards, setVerifiedCards] = useState<VerifiedCard[]>([]);
  const [clinics, setClinics]             = useState<Clinic[]>([]);

  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const PAGE_SIZE = 10;

  const [search, setSearch]               = useState("");
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [registerOpen, setRegisterOpen]   = useState(false);

  // Inline transfer state: { [cardId]: clinicCode }
  const [transferInputs, setTransferInputs] = useState<Record<number, string>>({});

  // Sort state — resets when tab changes
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  // Reset sort when switching tabs
  useEffect(() => { setSortKey(""); setSortDir("asc"); }, [activeTab]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (search) params.set("search", search);

      if (activeTab === "VERIFICATION") {
        const json = await apiFetch<VerifiedApiResponse>(`/api/enrollment/verified?${params}`);
        setVerifiedCards(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      } else {
        params.set("status", activeTab);
        const json = await apiFetch<ApiResponse>(`/api/enrollment/cards?${params}`);
        setCards(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search]);

  // Load clinics once
  useEffect(() => {
    apiFetch<{ data: Clinic[] }>("/api/enrollment/clinics")
      .then((j) => setClinics(j.data))
      .catch(() => {});
  }, []);

  useEffect(() => { setPage(1); }, [activeTab, search]);
  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleReceive(id: number) {
    setActionLoading(id);
    setError("");
    try {
      await apiFetch(`/api/enrollment/cards/${id}/receive`, { method: "PATCH" });
      await fetchData();
      toast("Card marked as received.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Action failed";
      setError(msg);
      toast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleTransfer(id: number) {
    const clinicCode = transferInputs[id];
    if (!clinicCode) { setError("Please select a destination clinic for transfer"); return; }
    setActionLoading(id);
    setError("");
    try {
      await apiFetch(`/api/enrollment/cards/${id}/transfer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transfer_to: clinicCode }),
      });
      setTransferInputs((prev) => { const next = { ...prev }; delete next[id]; return next; });
      await fetchData();
      toast("Transfer initiated successfully.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Transfer failed";
      setError(msg);
      toast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleConfirmTransfer(id: number) {
    setActionLoading(id);
    setError("");
    try {
      await apiFetch(`/api/enrollment/cards/${id}/confirm-transfer`, { method: "PATCH" });
      await fetchData();
      toast("Transfer confirmed successfully.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Confirm transfer failed";
      setError(msg);
      toast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  }

  const TABS: { key: AllTab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "VERIFICATION", label: "Verification",         icon: <ShieldCheck className="h-4 w-4" />,    color: "emerald" },
    { key: "REGISTRATION", label: "Registration",         icon: <CreditCard className="h-4 w-4" />,     color: "amber"   },
    { key: "TRANSFER",     label: "Transfer",             icon: <ArrowRightLeft className="h-4 w-4" />, color: "orange"  },
    { key: "RECEIVING",    label: "Receiving / Received", icon: <PackageCheck className="h-4 w-4" />,   color: "blue"    },
  ];

  const activeColor: Record<string, string> = {
    amber:   "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400",
    blue:    "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400",
    orange:  "border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/10 dark:text-orange-400",
  };

  const startIdx = Math.min((page - 1) * PAGE_SIZE + 1, total);
  const endIdx   = Math.min(page * PAGE_SIZE, total);

  // Sorted views (client-side, applied to the current page data)
  const sortedVerified = sortRows(verifiedCards, sortKey as keyof VerifiedCard, sortDir);
  const sortedCards    = sortRows(cards,         sortKey as keyof CardEnrollment, sortDir);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Card Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verify, register, receive, and transfer health cards</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          {activeTab === "REGISTRATION" && (
            <button onClick={() => setRegisterOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Register Card
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? `${activeColor[tab.color]} border-current`
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search card number..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400" />
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{total} record{total !== 1 ? "s" : ""}</span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* ── VERIFICATION table ── */}
            {activeTab === "VERIFICATION" && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                  <tr>
                    <SortableHeader label="Verified Card Number" colKey="verifiedcardnumber" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Year"          colKey="year"         sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Batch"         colKey="batch"        sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Month"         colKey="month"        sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="ICT Received"  colKey="ictreceived"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Date Received" colKey="datereceived" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {loading ? (
                    <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">Loading...</td></tr>
                  ) : sortedVerified.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">No verified cards found</td></tr>
                  ) : sortedVerified.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-700">
                      <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-100">{v.verifiedcardnumber}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{v.year  ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{v.batch ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{v.month ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{v.ictreceived ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{fmtDateTime(v.datereceived)}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {/* ── REGISTRATION table (status=0) ── */}
            {activeTab === "REGISTRATION" && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                  <tr>
                    <SortableHeader label="Card Number"  colKey="cardNumber"     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Released To"  colKey="clinicName"     sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Enrolled Date" colKey="enrollmentDate" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Status"       colKey="status"         sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {loading ? (
                    <tr><td colSpan={5} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">Loading...</td></tr>
                  ) : sortedCards.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">No cards pending receipt</td></tr>
                  ) : sortedCards.map((card) => (
                    <tr key={card.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-700">
                      <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-100">{card.cardNumber}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 dark:text-slate-200">{card.clinicName || card.releaseTo || "—"}</div>
                        {card.releaseTo && card.clinicName && (
                          <div className="text-xs text-slate-400">{card.releaseTo}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{fmt(card.enrollmentDate)}</td>
                      <td className="px-4 py-3">{statusBadge(card.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleReceive(card.id)}
                          disabled={actionLoading === card.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                          <PackageCheck className="h-3.5 w-3.5" />
                          {actionLoading === card.id ? "..." : "Mark Received"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {/* ── RECEIVING table (status=1) ── */}
            {activeTab === "RECEIVING" && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                  <tr>
                    <SortableHeader label="Card Number"   colKey="cardNumber"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Released To"   colKey="clinicName"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Received By"   colKey="receivedBy"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Received Date" colKey="receivedDate"  sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Status"        colKey="status"        sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {loading ? (
                    <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">Loading...</td></tr>
                  ) : sortedCards.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">No received cards</td></tr>
                  ) : sortedCards.map((card) => (
                    <tr key={card.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-700">
                      <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-100">{card.cardNumber}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 dark:text-slate-200">{card.clinicName || card.releaseTo || "—"}</div>
                        {card.releaseTo && card.clinicName && (
                          <div className="text-xs text-slate-400">{card.releaseTo}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{card.receivedBy ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{fmt(card.receivedDate)}</td>
                      <td className="px-4 py-3">{statusBadge(card.status)}</td>
                      <td className="px-4 py-3 text-right">
                        {/* Inline transfer: pick clinic then initiate */}
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={transferInputs[card.id] ?? ""}
                            onChange={(e) => setTransferInputs((prev) => ({ ...prev, [card.id]: e.target.value }))}
                            className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-6 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                          >
                            <option value="">Transfer to...</option>
                            {clinics.map((c) => (
                              <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                          </select>
                          <button onClick={() => handleTransfer(card.id)}
                            disabled={actionLoading === card.id || !transferInputs[card.id]}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50">
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                            {actionLoading === card.id ? "..." : "Transfer"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

            {/* ── TRANSFER table (status=2 or 3) ── */}
            {activeTab === "TRANSFER" && (
              <>
                <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                  <tr>
                    <SortableHeader label="Card Number"     colKey="cardNumber"         sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Current Clinic"  colKey="clinicName"         sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Transfer To"     colKey="transferClinicName" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Transfer Date"   colKey="dateTransfer"       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Status"          colKey="status"             sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {loading ? (
                    <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">Loading...</td></tr>
                  ) : sortedCards.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">No transfers found</td></tr>
                  ) : sortedCards.map((card) => (
                    <tr key={card.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-700">
                      <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-100">{card.cardNumber}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 dark:text-slate-200">{card.clinicName || card.releaseTo || "—"}</div>
                        {card.releaseTo && card.clinicName && (
                          <div className="text-xs text-slate-400">{card.releaseTo}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 dark:text-slate-200">{card.transferClinicName || card.transferTo || "—"}</div>
                        {card.transferTo && card.transferClinicName && (
                          <div className="text-xs text-slate-400">{card.transferTo}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{fmt(card.dateTransfer)}</td>
                      <td className="px-4 py-3">{statusBadge(card.status)}</td>
                      <td className="px-4 py-3 text-right">
                        {card.status === 2 && (
                          <button onClick={() => handleConfirmTransfer(card.id)}
                            disabled={actionLoading === card.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {actionLoading === card.id ? "..." : "Confirm Receipt"}
                          </button>
                        )}
                        {card.status === 3 && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}

          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-600 dark:text-slate-300">{startIdx}–{endIdx}</span>{" "}
              of{" "}
              <span className="font-medium text-slate-600 dark:text-slate-300">{total}</span> record{total !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5)         pageNum = i + 1;
                else if (page <= 3)          pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else                         pageNum = page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`min-w-8 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                      pageNum === page
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <RegisterCardModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegistered={() => { fetchData(); toast("Card registered successfully."); }}
      />

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
