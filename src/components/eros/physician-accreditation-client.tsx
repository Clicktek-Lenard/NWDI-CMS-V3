"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Plus, RefreshCw, CheckCircle, XCircle, Search } from "lucide-react";
import { PhysicianFormModal } from "./physician-form-modal";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PhysicianRecord {
  id: number;
  fullname: string | null;
  lastname: string | null;
  firstname: string | null;
  middlename: string | null;
  suffix: string | null;
  dob: string | null;
  prcno: string | null;
  prcvalidity: string | null;
  degree: string | null;
  group: string | null;
  subgroup: string | null;
  branchcode: string | null;
  email: string | null;
  mobile: string | null;
  status: string | null;
  declinereason: string | null;
  requestorby: string | null;
  approveby: string | null;
  inputdate: string | null;
  inputby: string | null;
  updateby: string | null;
  updatedate: string | null;
  pcp: string | null;
  specialist: string | null;
  regular: string | null;
  reliever: string | null;
  visiting: string | null;
  referring: string | null;
  resigndoctor: string | null;
  schedule: string | null;
  timestart: string | null;
  timeend: string | null;
  nwdbranch: string | null;
  byappointment: string | null;
  applicationletter: string | null;
  curriculumvitae: string | null;
  diploma: string | null;
  prcid: string | null;
  residencycertificate: string | null;
  diplomatecertificate: string | null;
  philhealth: string | null;
  ptr: string | null;
  bir: string | null;
  moa: string | null;
}

type SortDir = "asc" | "desc";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  label: string;
  colKey: string;
  sortKey: string;
  sortDir: SortDir;
  onSort: (key: string) => void;
  align?: "left" | "right" | "center";
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

function statusBadge(status: string | null) {
  switch (status) {
    case "Active":    return <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Active</span>;
    case "Pending":   return <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Pending</span>;
    case "Declined":  return <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Declined</span>;
    case "Inactive":  return <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">Inactive</span>;
    default:          return <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500">{status ?? "—"}</span>;
  }
}

function positionLabel(p: PhysicianRecord) {
  const flags: string[] = [];
  if (p.pcp === "Y") flags.push("PCP");
  if (p.specialist === "Y") flags.push("Specialist");
  if (p.regular === "Y") flags.push("Regular");
  if (p.reliever === "Y") flags.push("Reliever");
  if (p.visiting === "Y") flags.push("Visiting");
  if (p.referring === "Y") flags.push("Referring");
  return flags.join(", ") || "—";
}

function fmt(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

const PAGE_SIZE = 20;

// ─── Main Component ───────────────────────────────────────────────────────────

export function PhysicianAccreditationClient() {
  const [activeTab, setActiveTab] = useState<"approval" | "accredited">("approval");

  // ── For Approval tab state ──────────────────────────────────────────────────
  const [approvalRows, setApprovalRows]     = useState<PhysicianRecord[]>([]);
  const [approvalTotal, setApprovalTotal]   = useState(0);
  const [approvalPage, setApprovalPage]     = useState(1);
  const [approvalSearch, setApprovalSearch] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalSortKey, setApprovalSortKey] = useState("");
  const [approvalSortDir, setApprovalSortDir] = useState<SortDir>("asc");

  // Approve / Decline modal state
  const [declineTarget, setDeclineTarget]   = useState<PhysicianRecord | null>(null);
  const [declineReason, setDeclineReason]   = useState("");
  const [actionLoading, setActionLoading]   = useState(false);

  // ── Accredited tab state ────────────────────────────────────────────────────
  const [accreditedRows, setAccreditedRows]     = useState<PhysicianRecord[]>([]);
  const [accreditedTotal, setAccreditedTotal]   = useState(0);
  const [accreditedPage, setAccreditedPage]     = useState(1);
  const [accreditedSearch, setAccreditedSearch] = useState("");
  const [accreditedLoading, setAccreditedLoading] = useState(false);
  const [accreditedSortKey, setAccreditedSortKey] = useState("");
  const [accreditedSortDir, setAccreditedSortDir] = useState<SortDir>("asc");

  // Per-column search filters (Accredited tab)
  const [colFilters, setColFilters] = useState<Record<string, string>>({});

  // ── Shared ──────────────────────────────────────────────────────────────────
  const [formOpen, setFormOpen]     = useState(false);
  const [editRecord, setEditRecord] = useState<PhysicianRecord | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchApproval = useCallback(async () => {
    setApprovalLoading(true);
    try {
      const res = await fetch(
        `/api/physician/accreditation?status=pending&search=${encodeURIComponent(approvalSearch)}&page=${approvalPage}&pageSize=${PAGE_SIZE}`
      );
      const data = await res.json();
      setApprovalRows(data.physicians ?? []);
      setApprovalTotal(data.total ?? 0);
    } finally {
      setApprovalLoading(false);
    }
  }, [approvalSearch, approvalPage]);

  const fetchAccredited = useCallback(async () => {
    setAccreditedLoading(true);
    try {
      const res = await fetch(
        `/api/physician/accreditation?status=active&search=${encodeURIComponent(accreditedSearch)}&page=${accreditedPage}&pageSize=${PAGE_SIZE}`
      );
      const data = await res.json();
      setAccreditedRows(data.physicians ?? []);
      setAccreditedTotal(data.total ?? 0);
    } finally {
      setAccreditedLoading(false);
    }
  }, [accreditedSearch, accreditedPage]);

  useEffect(() => { fetchApproval(); }, [fetchApproval]);
  useEffect(() => { fetchAccredited(); }, [fetchAccredited]);

  // Reset page on search change
  useEffect(() => { setApprovalPage(1); }, [approvalSearch]);
  useEffect(() => { setAccreditedPage(1); }, [accreditedSearch]);

  // ── Sort handlers ──────────────────────────────────────────────────────────

  function handleApprovalSort(key: string) {
    if (approvalSortKey === key) setApprovalSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setApprovalSortKey(key); setApprovalSortDir("asc"); }
  }

  function handleAccreditedSort(key: string) {
    if (accreditedSortKey === key) setAccreditedSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setAccreditedSortKey(key); setAccreditedSortDir("asc"); }
  }

  // ── Approve / Decline actions ──────────────────────────────────────────────

  async function handleApprove(p: PhysicianRecord) {
    if (!confirm(`Approve accreditation for ${p.fullname}?`)) return;
    setActionLoading(true);
    try {
      await fetch(`/api/physician/accreditation/${p.id}/approve`, { method: "PATCH" });
      fetchApproval();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeclineSubmit() {
    if (!declineTarget || !declineReason.trim()) return;
    setActionLoading(true);
    try {
      await fetch(`/api/physician/accreditation/${declineTarget.id}/decline`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ declineReason }),
      });
      setDeclineTarget(null);
      setDeclineReason("");
      fetchApproval();
    } finally {
      setActionLoading(false);
    }
  }

  // ── Per-column filter for accredited tab ─────────────────────────────────

  function applyColFilters(rows: PhysicianRecord[]) {
    return rows.filter((r) =>
      Object.entries(colFilters).every(([col, val]) => {
        if (!val) return true;
        const key = col as keyof PhysicianRecord;
        return String(r[key] ?? "").toLowerCase().includes(val.toLowerCase());
      })
    );
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const sortedApproval = sortRows(approvalRows, approvalSortKey as keyof PhysicianRecord, approvalSortDir);

  const filteredAccredited = applyColFilters(accreditedRows);
  const sortedAccredited   = sortRows(filteredAccredited, accreditedSortKey as keyof PhysicianRecord, accreditedSortDir);

  const approvalTotalPages   = Math.ceil(approvalTotal / PAGE_SIZE);
  const accreditedTotalPages = Math.ceil(accreditedTotal / PAGE_SIZE);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Sub-tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {(["approval", "accredited"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors
              ${activeTab === tab
                ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-blue-500 hover:text-blue-600 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
              }`}
          >
            {tab === "approval" ? "For Approval" : "Accredited Physicians"}
          </button>
        ))}
      </div>

      {/* ── FOR APPROVAL TAB ─────────────────────────────────────────────────── */}
      {activeTab === "approval" && (
        <div>
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or PRC No..."
                value={approvalSearch}
                onChange={(e) => setApprovalSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
            <button
              onClick={() => fetchApproval()}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={() => { setEditRecord(null); setFormOpen(true); }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <SortableHeader label="Full Name"       colKey="fullname"    sortKey={approvalSortKey} sortDir={approvalSortDir} onSort={handleApprovalSort} />
                    <SortableHeader label="PRC No."         colKey="prcno"       sortKey={approvalSortKey} sortDir={approvalSortDir} onSort={handleApprovalSort} />
                    <SortableHeader label="Specialization"  colKey="degree"      sortKey={approvalSortKey} sortDir={approvalSortDir} onSort={handleApprovalSort} />
                    <SortableHeader label="Branch"          colKey="branchcode"  sortKey={approvalSortKey} sortDir={approvalSortDir} onSort={handleApprovalSort} />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Requested By</th>
                    <SortableHeader label="Requested Date"  colKey="inputdate"   sortKey={approvalSortKey} sortDir={approvalSortDir} onSort={handleApprovalSort} />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Updated By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Updated Date</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reason to Disapprove</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {approvalLoading ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Loading...</td>
                    </tr>
                  ) : sortedApproval.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No pending applications found.</td>
                    </tr>
                  ) : sortedApproval.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100 whitespace-nowrap">{p.fullname ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.prcno ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.degree ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.branchcode ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.requestorby ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{fmt(p.inputdate)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.updateby ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{fmt(p.updatedate)}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">{statusBadge(p.status)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[160px] truncate">{p.declinereason ?? "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(p)}
                            disabled={actionLoading}
                            title="Approve"
                            className="rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => { setDeclineTarget(p); setDeclineReason(""); }}
                            disabled={actionLoading}
                            title="Decline"
                            className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {approvalTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Page {approvalPage} of {approvalTotalPages} ({approvalTotal} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setApprovalPage((p) => Math.max(1, p - 1))}
                    disabled={approvalPage <= 1}
                    className="rounded border border-slate-200 px-3 py-1 text-xs disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setApprovalPage((p) => Math.min(approvalTotalPages, p + 1))}
                    disabled={approvalPage >= approvalTotalPages}
                    className="rounded border border-slate-200 px-3 py-1 text-xs disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ACCREDITED PHYSICIANS TAB ─────────────────────────────────────────── */}
      {activeTab === "accredited" && (
        <div>
          {/* Global search */}
          <div className="mb-4 relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or PRC No..."
              value={accreditedSearch}
              onChange={(e) => setAccreditedSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <SortableHeader label="Full Name"      colKey="fullname"  sortKey={accreditedSortKey} sortDir={accreditedSortDir} onSort={handleAccreditedSort} />
                    <SortableHeader label="PRC No."        colKey="prcno"     sortKey={accreditedSortKey} sortDir={accreditedSortDir} onSort={handleAccreditedSort} />
                    <SortableHeader label="Specialization" colKey="degree"    sortKey={accreditedSortKey} sortDir={accreditedSortDir} onSort={handleAccreditedSort} />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Position</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Position Status</th>
                    <SortableHeader label="Branch Duty"    colKey="nwdbranch" sortKey={accreditedSortKey} sortDir={accreditedSortDir} onSort={handleAccreditedSort} />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Schedule Day</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Start</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">End</th>
                  </tr>
                  {/* Per-column search row */}
                  <tr className="bg-slate-50 dark:bg-slate-700/30">
                    {(["fullname","prcno","degree","","","nwdbranch","schedule","timestart","timeend"] as const).map((col, i) => (
                      <td key={i} className="px-2 py-1">
                        {col ? (
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={colFilters[col] ?? ""}
                            onChange={(e) => setColFilters((f) => ({ ...f, [col]: e.target.value }))}
                            className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
                          />
                        ) : null}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {accreditedLoading ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Loading...</td>
                    </tr>
                  ) : sortedAccredited.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No accredited physicians found.</td>
                    </tr>
                  ) : sortedAccredited.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => { setEditRecord(p); setFormOpen(true); }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-100 whitespace-nowrap">{p.fullname ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.prcno ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.degree ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{positionLabel(p)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{statusBadge(p.status)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[140px] truncate">{p.nwdbranch ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[140px] truncate">{p.schedule ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.timestart ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.timeend ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {accreditedTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Page {accreditedPage} of {accreditedTotalPages} ({accreditedTotal} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAccreditedPage((p) => Math.max(1, p - 1))}
                    disabled={accreditedPage <= 1}
                    className="rounded border border-slate-200 px-3 py-1 text-xs disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setAccreditedPage((p) => Math.min(accreditedTotalPages, p + 1))}
                    disabled={accreditedPage >= accreditedTotalPages}
                    className="rounded border border-slate-200 px-3 py-1 text-xs disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DECLINE MODAL ────────────────────────────────────────────────────── */}
      {declineTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Decline Application
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {declineTarget.fullname}
              </p>
            </div>
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Reason to Disapprove <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
              <button
                onClick={() => { setDeclineTarget(null); setDeclineReason(""); }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineSubmit}
                disabled={!declineReason.trim() || actionLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Saving..." : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FORM MODAL ───────────────────────────────────────────────────────── */}
      {formOpen && (
        <PhysicianFormModal
          record={editRecord}
          onClose={() => { setFormOpen(false); setEditRecord(null); }}
          onSaved={() => {
            setFormOpen(false);
            setEditRecord(null);
            fetchApproval();
            fetchAccredited();
          }}
        />
      )}
    </>
  );
}
