"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight,
  RefreshCw, Search, FileText, Download,
  Printer, FileSpreadsheet,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useToast, ToastContainer } from "@/components/ui/toast";

// ─── Report type config ───────────────────────────────────────────────────────

const REPORT_TYPES = [
  { key: "bookkeeper",      label: "Bookkeeper Report" },
  { key: "cash",            label: "Cash Report" },
  { key: "cashier-summary", label: "Cashier Summary Report" },
  { key: "hmo",             label: "HMO / Corporate Report" },
  { key: "per-item",        label: "Per Item Report" },
  { key: "sendout",         label: "Sendout Report" },
  { key: "summary",         label: "Summary Report" },
  { key: "amendment",       label: "Amendment Transaction" },
] as const;

type ReportKey = (typeof REPORT_TYPES)[number]["key"];

// ─── Column definitions per report ───────────────────────────────────────────

type ColDef = { key: string; label: string; align?: "left" | "right" | "center"; fmt?: "amount" | "date" | "status" | "badge" };

const COLUMNS: Record<ReportKey, ColDef[]> = {
  bookkeeper: [
    { key: "date",            label: "Date",         fmt: "date" },
    { key: "queueCode",       label: "Queue No." },
    { key: "accessionNo",     label: "Accession No." },
    { key: "patientName",     label: "Patient" },
    { key: "company",         label: "Company" },
    { key: "itemCode",        label: "Item Code" },
    { key: "itemDescription", label: "Description" },
    { key: "transactionType", label: "Type" },
    { key: "amount",          label: "Amount",   align: "right", fmt: "amount" },
    { key: "remaining",       label: "Remaining", align: "right", fmt: "amount" },
    { key: "inputBy",         label: "Input By" },
    { key: "status",          label: "Status",   align: "center", fmt: "status" },
  ],
  cash: [
    { key: "date",            label: "Date",        fmt: "date" },
    { key: "queueCode",       label: "Queue No." },
    { key: "accessionNo",     label: "Accession No." },
    { key: "patientName",     label: "Patient" },
    { key: "patientType",     label: "Type" },
    { key: "itemCode",        label: "Item Code" },
    { key: "itemDescription", label: "Description" },
    { key: "amountPaid",      label: "Amount Paid", align: "right", fmt: "amount" },
    { key: "readersFee",      label: "Readers Fee", align: "right", fmt: "amount" },
    { key: "inputBy",         label: "Cashier" },
  ],
  "cashier-summary": [
    { key: "cashier",        label: "Cashier" },
    { key: "txCount",        label: "# Transactions", align: "right" },
    { key: "totalAmount",    label: "Total Amount",   align: "right", fmt: "amount" },
    { key: "totalCollected", label: "Collected",      align: "right", fmt: "amount" },
    { key: "totalRemaining", label: "Remaining",      align: "right", fmt: "amount" },
  ],
  hmo: [
    { key: "date",            label: "Date",        fmt: "date" },
    { key: "queueCode",       label: "Queue No." },
    { key: "accessionNo",     label: "Accession No." },
    { key: "patientName",     label: "Patient" },
    { key: "company",         label: "HMO / Company" },
    { key: "cardNumber",      label: "Card No." },
    { key: "itemCode",        label: "Item Code" },
    { key: "itemDescription", label: "Description" },
    { key: "priceGroup",      label: "Price Group" },
    { key: "amount",          label: "Amount",      align: "right", fmt: "amount" },
    { key: "readersFee",      label: "Readers Fee", align: "right", fmt: "amount" },
    { key: "status",          label: "Status",      align: "center", fmt: "status" },
  ],
  "per-item": [
    { key: "itemCode",        label: "Item Code" },
    { key: "itemDescription", label: "Description" },
    { key: "group",           label: "Group" },
    { key: "transactionType", label: "Type" },
    { key: "count",           label: "Count",        align: "right" },
    { key: "unitPrice",       label: "Unit Price",   align: "right", fmt: "amount" },
    { key: "totalAmount",     label: "Total Amount", align: "right", fmt: "amount" },
  ],
  sendout: [
    { key: "date",        label: "Date",        fmt: "date" },
    { key: "queueCode",   label: "Queue No." },
    { key: "accessionNo", label: "Accession No." },
    { key: "patientName", label: "Patient" },
    { key: "itemGroup",   label: "Item Group" },
    { key: "fromBranch",  label: "From Branch" },
    { key: "sentTo",      label: "Sent To" },
    { key: "status",      label: "Status", align: "center", fmt: "badge" },
  ],
  summary: [
    { key: "date",            label: "Date",        fmt: "date" },
    { key: "branch",          label: "Branch" },
    { key: "patientCount",    label: "Patients",    align: "right" },
    { key: "txCount",         label: "Transactions", align: "right" },
    { key: "grossAmount",     label: "Gross",       align: "right", fmt: "amount" },
    { key: "readersFee",      label: "Readers Fee", align: "right", fmt: "amount" },
    { key: "netAmount",       label: "Net",         align: "right", fmt: "amount" },
    { key: "amountCollected", label: "Collected",   align: "right", fmt: "amount" },
    { key: "remaining",       label: "Remaining",   align: "right", fmt: "amount" },
  ],
  amendment: [
    { key: "date",            label: "Date",            fmt: "date" },
    { key: "queueCode",       label: "Queue No." },
    { key: "accessionNo",     label: "Accession No." },
    { key: "patientName",     label: "Patient" },
    { key: "itemCode",        label: "Item Code" },
    { key: "itemDescription", label: "Description" },
    { key: "originalAmount",  label: "Original Amt",  align: "right", fmt: "amount" },
    { key: "newAmount",       label: "New Amt",        align: "right", fmt: "amount" },
    { key: "difference",      label: "Difference",     align: "right", fmt: "amount" },
    { key: "company",         label: "Company" },
    { key: "modifiedBy",      label: "Modified By" },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
function firstOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

type SortDir = "asc" | "desc";

function sortRows(rows: Record<string, unknown>[], key: string, dir: SortDir) {
  if (!key) return rows;
  return [...rows].sort((a, b) => {
    const av = a[key] ?? "";
    const bv = b[key] ?? "";
    let cmp = 0;
    if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
    else cmp = String(av).localeCompare(String(bv), undefined, { sensitivity: "base" });
    return dir === "asc" ? cmp : -cmp;
  });
}

// ─── Status cell ─────────────────────────────────────────────────────────────

function StatusCell({ value, isBadge }: { value: unknown; isBadge?: boolean }) {
  if (isBadge) {
    const s = String(value ?? "").toLowerCase();
    const cls =
      s === "received" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
      s === "sent"     ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                         "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
        {String(value ?? "pending")}
      </span>
    );
  }
  const code = Number(value);
  if (code === 210) return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Fully Paid</span>
  );
  if (code === 205) return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Partial</span>
  );
  if (code === 650) return (
    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">Cancelled</span>
  );
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Unpaid</span>
  );
}

// ─── Sortable header ─────────────────────────────────────────────────────────

function SortableHeader({
  col, sortKey, sortDir, onSort,
}: {
  col: ColDef; sortKey: string; sortDir: SortDir; onSort: (k: string) => void;
}) {
  const active = sortKey === col.key;
  const align  = col.align ?? "left";
  return (
    <th
      onClick={() => onSort(col.key)}
      className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 text-${align} ${active ? "text-slate-700 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}
    >
      <span className={`inline-flex items-center gap-1 ${align === "right" ? "justify-end w-full" : ""}`}>
        {col.label}
        {active
          ? sortDir === "asc"
            ? <ChevronUp className="h-3.5 w-3.5 text-blue-500" />
            : <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
          : <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />}
      </span>
    </th>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCards({ summary }: { summary: Record<string, number> | null }) {
  if (!summary) return null;
  const entries = Object.entries(summary).filter(([, v]) => typeof v === "number");
  if (entries.length === 0) return null;

  const LABEL_MAP: Record<string, string> = {
    totalTransactions: "Total Transactions",
    totalAmount:       "Total Amount",
    totalAmountPaid:   "Total Amount Paid",
    totalReadersFee:   "Total Readers Fee",
    totalRemaining:    "Total Remaining",
    totalCollected:    "Total Collected",
    totalGross:        "Total Gross",
    totalNet:          "Total Net",
    totalPatients:     "Total Patients",
    totalItems:        "Total Items",
    totalSendouts:     "Total Sendouts",
    totalAmendments:   "Total Amendments",
    totalDifference:   "Total Difference",
    txCount:           "# Transactions",
  };
  function labelFor(key: string) {
    return LABEL_MAP[key] ?? key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .trim();
  }

  function isAmount(key: string) {
    return key.toLowerCase().includes("amount") || key.toLowerCase().includes("collected") ||
           key.toLowerCase().includes("gross") || key.toLowerCase().includes("net") ||
           key.toLowerCase().includes("remaining") || key.toLowerCase().includes("fee") ||
           key.toLowerCase().includes("paid") || key.toLowerCase().includes("diff");
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {entries.map(([key, val]) => (
        <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">{labelFor(key)}</p>
          <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
            {isAmount(key) ? formatAmount(val) : val.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Branch { code: string; description: string; }
interface ReportApiResponse {
  success: boolean;
  data: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: Record<string, number>;
}

const PAGE_SIZE = 50;

export function ReportsClient() {
  const { toasts, toast, dismiss } = useToast();

  const [reportType,   setReportType]   = useState<ReportKey>("bookkeeper");
  const [branch,       setBranch]       = useState("");
  const [dateFrom,     setDateFrom]     = useState(firstOfMonth());
  const [dateTo,       setDateTo]       = useState(today());
  const [branches,     setBranches]     = useState<Branch[]>([]);
  const [rows,         setRows]         = useState<Record<string, unknown>[]>([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [page,         setPage]         = useState(1);
  const [summary,      setSummary]      = useState<Record<string, number> | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [generated,    setGenerated]    = useState(false);
  const [sortKey,      setSortKey]      = useState("");
  const [sortDir,      setSortDir]      = useState<SortDir>("asc");

  // Load branches on mount
  useEffect(() => {
    apiFetch<{ success: boolean; data: Branch[] }>("/api/reports/branches")
      .then((res) => setBranches(res.data ?? []))
      .catch(() => {/* branches optional */});
  }, []);

  function handleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const generate = useCallback(async (p: number) => {
    if (!dateFrom || !dateTo) { toast("Please select Date From and Date To.", "error"); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dateFrom,
        dateTo,
        page: String(p),
        pageSize: String(PAGE_SIZE),
        ...(branch ? { branch } : {}),
      });
      const res = await apiFetch<ReportApiResponse>(`/api/reports/${reportType}?${params}`);
      setRows(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setSummary(res.summary as Record<string, number>);
      setGenerated(true);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to generate report.", "error");
    } finally {
      setLoading(false);
    }
  }, [reportType, branch, dateFrom, dateTo, toast]);

  function handleGenerate() {
    setPage(1);
    setSortKey("");
    void generate(1);
  }

  function handlePageChange(p: number) {
    setPage(p);
    void generate(p);
  }

  function buildExportUrl(format: "csv" | "xlsx") {
    const params = new URLSearchParams({
      dateFrom,
      dateTo,
      format,
      ...(branch ? { branch } : {}),
    });
    return `/api/reports/${reportType}?${params}`;
  }

  function handlePrint() {
    window.print();
  }

  const cols    = COLUMNS[reportType];
  const sorted  = sortRows(rows, sortKey, sortDir);
  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx   = Math.min(page * PAGE_SIZE, total);


  const INPUT_CLS = "block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400";

  return (
    <div className="space-y-5">
      <style>{`
        @media print {
          body > * { display: none !important; }
          [data-print-target] { display: block !important; }
          [data-no-print] { display: none !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Clinic Reports</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Financial, transactional, and operational reports by branch and date range
        </p>
      </div>

      {/* ── Report type selector ── */}
      <div data-no-print className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Report Type
        </p>
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt.key}
              type="button"
              onClick={() => { setReportType(rt.key); setGenerated(false); setRows([]); setSummary(null); }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                reportType === rt.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div data-no-print className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Filters
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Branch */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Clinic Branch
            </label>
            {branches.length > 0 ? (
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="">All Branches</option>
                {branches.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code} — {b.description}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Branch code (e.g. CEN)"
                  className={INPUT_CLS + " pl-9"}
                />
              </div>
            )}
          </div>

          {/* Date From */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Date From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Date To <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          {/* Generate */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary cards ── */}
      {generated && summary && <SummaryCards summary={summary} />}

      {/* ── Results table ── */}
      {generated && (
        <div data-print-target className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

          {/* Table toolbar */}
          <div data-no-print className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {REPORT_TYPES.find((r) => r.key === reportType)?.label}
              </span>
              {!loading && total > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {total.toLocaleString()} {["summary", "cashier-summary", "per-item"].includes(reportType) ? "groups" : "transactions"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              {/* CSV */}
              <a
                href={buildExportUrl("csv")}
                download
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                title="Export as CSV"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </a>
              {/* Excel */}
              <a
                href={buildExportUrl("xlsx")}
                download
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                title="Export as Excel"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Excel
              </a>
              {/* Print */}
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                title="Print report"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-700">
                  {cols.map((col) => (
                    <SortableHeader key={col.key} col={col} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {cols.map((col) => (
                        <td key={col.key} className="px-4 py-3.5">
                          <div className="h-4 rounded bg-slate-100 dark:bg-slate-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : sorted.length === 0 ? (
                  <tr>
                    <td colSpan={cols.length} className="py-12 text-center">
                      <FileText className="mx-auto h-8 w-8 text-slate-200 dark:text-slate-700" />
                      <p className="mt-2 text-sm font-medium text-slate-400 dark:text-slate-500">
                        No records found for the selected filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  sorted.map((row, idx) => {
                    const isAmended = reportType === "amendment" && Number(row.difference ?? 0) > 0;
                    return (
                      <tr
                        key={String(row.id ?? idx)}
                        className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-700 ${
                          isAmended ? "bg-amber-50/40 dark:bg-amber-900/10" : ""
                        }`}
                      >
                        {cols.map((col) => {
                          const val = row[col.key];
                          const align = col.align ?? "left";

                          let cell: React.ReactNode;
                          if (col.fmt === "amount") {
                            cell = (
                              <span className={`font-medium ${Number(val) < 0 ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-200"}`}>
                                {formatAmount(Number(val ?? 0))}
                              </span>
                            );
                          } else if (col.fmt === "date") {
                            cell = <span className="text-slate-600 dark:text-slate-300">{formatDate(String(val ?? ""))}</span>;
                          } else if (col.fmt === "status") {
                            cell = <StatusCell value={val} />;
                          } else if (col.fmt === "badge") {
                            cell = <StatusCell value={val} isBadge />;
                          } else if (col.key === "queueCode" || col.key === "accessionNo" || col.key === "itemCode") {
                            cell = <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{String(val ?? "—")}</span>;
                          } else if (col.key === "patientName" || col.key === "cashier") {
                            cell = <span className="font-medium text-slate-800 dark:text-slate-100">{String(val ?? "—")}</span>;
                          } else {
                            cell = <span className="text-slate-600 dark:text-slate-300">{String(val ?? "—")}</span>;
                          }

                          return (
                            <td key={col.key} className={`px-4 py-3 text-${align}`}>
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Totals row */}
              {!loading && sorted.length > 0 && summary && (
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50">
                    {cols.map((col, i) => {
                      if (i === 0) {
                        return (
                          <td key={col.key} className="px-4 py-3 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                            Totals
                          </td>
                        );
                      }
                      if (col.fmt === "amount") {
                        // Sum the current page
                        const pageSum = sorted.reduce((s, r) => s + Number(r[col.key] ?? 0), 0);
                        return (
                          <td key={col.key} className="px-4 py-3 text-right text-sm font-bold text-slate-800 dark:text-slate-100">
                            {formatAmount(pageSum)}
                          </td>
                        );
                      }
                      return <td key={col.key} />;
                    })}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div data-no-print className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-700">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-600 dark:text-slate-300">{startIdx}–{endIdx}</span>{" "}
                of{" "}
                <span className="font-medium text-slate-600 dark:text-slate-300">{total}</span> {["summary", "cashier-summary", "per-item"].includes(reportType) ? "groups" : "transactions"}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1 || loading}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pn: number;
                  if (totalPages <= 5)             pn = i + 1;
                  else if (page <= 3)              pn = i + 1;
                  else if (page >= totalPages - 2) pn = totalPages - 4 + i;
                  else                             pn = page - 2 + i;
                  return (
                    <button
                      key={pn}
                      onClick={() => handlePageChange(pn)}
                      className={`min-w-8 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                        pn === page
                          ? "bg-blue-600 text-white"
                          : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                      }`}
                    >
                      {pn}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || loading}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state before first generate */}
      {!generated && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 dark:border-slate-600 dark:bg-slate-800">
          <FileText className="h-12 w-12 text-slate-200 dark:text-slate-700" />
          <p className="mt-3 text-sm font-medium text-slate-400 dark:text-slate-500">
            Select a report type, set your filters, then click <strong>Generate Report</strong>
          </p>
        </div>
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
