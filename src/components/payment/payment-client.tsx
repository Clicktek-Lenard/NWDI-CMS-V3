"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight,
  RefreshCw, Search, CreditCard, Eye, X,
} from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentRow {
  id: number;
  code: string;
  accessionNo: string;
  patientName: string;
  patientType: string;
  status: number;
  dateTime: string;
  totalAmount: number;
  totalRemaining: number;
  txCount: number;
}

interface ApiResponse {
  success: boolean;
  data: PaymentRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function formatDateTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function sortRows(rows: PaymentRow[], key: keyof PaymentRow | "", dir: SortDir): PaymentRow[] {
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

// ─── Status badge ─────────────────────────────────────────────────────────────

function PaymentBadge({ status }: { status: number }) {
  if (status === 210) return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
      Fully Paid
    </span>
  );
  if (status === 205) return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      Partial
    </span>
  );
  if (status === 650) return (
    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
      Cancelled
    </span>
  );
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      Unpaid
    </span>
  );
}

// ─── Sortable header ─────────────────────────────────────────────────────────

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
      className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 text-${align} ${active ? "text-slate-700 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}
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

// ─── View modal (standard modal template) ────────────────────────────────────

function ViewPaymentModal({
  row,
  onClose,
  onPay,
}: {
  row: PaymentRow;
  onClose: () => void;
  onPay: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col dark:border-slate-700 dark:bg-slate-800">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Payment Details</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {row.code || row.accessionNo || `Queue #${row.id}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-4">

          {/* Queue Info section */}
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Queue Information
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Queue No.</p>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-100">{row.code || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Accession No.</p>
                <p className="font-mono text-slate-700 dark:text-slate-300">{row.accessionNo || "—"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">Patient</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{row.patientName || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Type</p>
                <p className="text-slate-700 dark:text-slate-300">{row.patientType || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Date / Time</p>
                <p className="text-slate-700 dark:text-slate-300">{formatDateTime(row.dateTime)}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary section */}
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Payment Summary
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Amount</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {row.txCount > 0 ? formatAmount(row.totalAmount) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Remaining Balance</p>
                <p className={`font-semibold ${
                  row.txCount > 0 && row.totalRemaining > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}>
                  {row.txCount > 0 ? formatAmount(row.totalRemaining) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
                <p className="text-slate-700 dark:text-slate-300">{row.txCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                <div className="mt-0.5">
                  <PaymentBadge status={row.status} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onPay}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]"
          >
            <CreditCard className="h-4 w-4" />
            {row.status === 210 ? "View Payment" : "Process Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PaymentClient() {
  const router = useRouter();
  const { toasts, toast, dismiss } = useToast();

  const [rows,         setRows]         = useState<PaymentRow[]>([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(false);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter,   setDateFilter]   = useState("");
  const [sortKey,      setSortKey]      = useState<keyof PaymentRow | "">("");
  const [sortDir,      setSortDir]      = useState<SortDir>("asc");
  const [viewRow,      setViewRow]      = useState<PaymentRow | null>(null);

  function handleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key as keyof PaymentRow); setSortDir("asc"); }
    setPage(1);
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
        ...(search       ? { search }              : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(dateFilter   ? { date: dateFilter }     : {}),
      });
      const res = await apiFetch<ApiResponse>(`/api/payment?${params}`);
      setRows(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to load payments.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, dateFilter, toast]);

  useEffect(() => { setPage(1); }, [search, statusFilter, dateFilter]);
  useEffect(() => { void fetchData(); }, [fetchData]);

  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx   = Math.min(page * PAGE_SIZE, total);
  const sorted   = sortRows(rows, sortKey, sortDir);

  return (
    <div className="space-y-4">

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, queue no…"
              className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            <option value="">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Fully Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-700">
                <SortableHeader label="Queue No."  colKey="code"           sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Patient"    colKey="patientName"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Type"       colKey="patientType"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Date"       colKey="dateTime"       sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Amount"     colKey="totalAmount"    sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                <SortableHeader label="Remaining"  colKey="totalRemaining" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="right" />
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-slate-300 dark:text-slate-600" />
                    <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Loading payments…</p>
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <CreditCard className="mx-auto h-8 w-8 text-slate-200 dark:text-slate-700" />
                    <p className="mt-2 text-sm font-medium text-slate-400 dark:text-slate-500">No payment records found</p>
                    {search && (
                      <p className="text-xs text-slate-300 dark:text-slate-600">Try adjusting your search</p>
                    )}
                  </td>
                </tr>
              ) : (
                sorted.map((row) => (
                  <tr key={row.id} className="group transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-700">

                    {/* Queue No. */}
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {row.code || row.accessionNo || `#${row.id}`}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                          {(row.patientName?.[0] ?? "?").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate dark:text-slate-100">
                            {row.patientName || "—"}
                          </p>
                          <p className="text-xs text-slate-400 truncate dark:text-slate-500">
                            {row.accessionNo || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {row.patientType || <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {formatDateTime(row.dateTime)}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 text-right font-medium text-slate-700 dark:text-slate-200">
                      {row.txCount > 0
                        ? formatAmount(row.totalAmount)
                        : <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>

                    {/* Remaining */}
                    <td className={`px-4 py-4 text-right font-medium ${
                      row.txCount > 0 && row.totalRemaining > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {row.txCount > 0
                        ? formatAmount(row.totalRemaining)
                        : <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <PaymentBadge status={row.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => setViewRow(row)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/queue/${row.id}/payment`)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                          title={row.status === 210 ? "View Payment" : "Process Payment"}
                        >
                          <CreditCard className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-600 dark:text-slate-300">{startIdx}–{endIdx}</span>{" "}
              of{" "}
              <span className="font-medium text-slate-600 dark:text-slate-300">{total}</span> records
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
                if (totalPages <= 5)             pageNum = i + 1;
                else if (page <= 3)              pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else                             pageNum = page - 2 + i;
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

      {/* ── View Modal ── */}
      {viewRow && (
        <ViewPaymentModal
          row={viewRow}
          onClose={() => setViewRow(null)}
          onPay={() => {
            const id = viewRow.id;
            setViewRow(null);
            router.push(`/queue/${id}/payment`);
          }}
        />
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
