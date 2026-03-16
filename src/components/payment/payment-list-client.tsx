"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { QueueEntry, PaginatedResponse } from "@/types";

// ── Payment history record ─────────────────────────────────────
interface PaymentRecord {
  id: number;
  idQueue: number;
  queueCode: string;
  patientName: string;
  orNum: string;
  paymentType: string;
  payAmount: number;
  coverageType: string;
  coverageAmount: number;
  discType: string;
  discAmount: number;
  cashier: string;
  inputDate: string;
  refNo: string;
  bankName: string;
}

interface PaymentHistoryResponse {
  success: boolean;
  data: PaymentRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  totalPaid: number;
  totalDisc: number;
}

// Payment-relevant status codes (mirrors v1 PaymentController::index statuses)
const PAYMENT_STATUSES = new Set([
  201, 202, 203, 204, 205, 210, 211, 212, 213, 214,
  230, 250, 260, 270, 280, 300, 301, 400, 410, 420,
  500, 600, 650,
]);

// Status badge color by category
function getStatusStyle(code: number) {
  if (code === 201 || code === 202) return { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" };
  if (code >= 203 && code <= 209) return { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   };
  if (code === 210)               return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
  if (code >= 211 && code < 300)  return { bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500"   };
  if (code >= 300 && code < 500)  return { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" };
  if (code >= 500 && code < 650)  return { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" };
  if (code === 650)               return { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    };
  return { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };
}

function formatTime(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function PaymentListClient() {
  const router = useRouter();
  const [tab, setTab] = useState<"queue" | "history">("queue");

  // ── Queue tab state ──────────────────────────────────────────
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // ── History tab state ────────────────────────────────────────
  const [histRecords, setHistRecords] = useState<PaymentRecord[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [histError, setHistError] = useState<string | null>(null);
  const [histDate, setHistDate] = useState(new Date().toISOString().split("T")[0]);
  const [histMethod, setHistMethod] = useState("");
  const [histCashier, setHistCashier] = useState("");
  const [histSearch, setHistSearch] = useState("");
  const [histTotalPaid, setHistTotalPaid] = useState(0);
  const [histTotalDisc, setHistTotalDisc] = useState(0);

  const fetchQueue = useCallback(async () => {
    try {
      const json: PaginatedResponse<QueueEntry> & { stats: Record<string, number> } =
        await apiFetch("/api/queue?pageSize=500");
      // Filter to payment-relevant statuses only
      const paymentEntries = json.data.filter((q) => PAYMENT_STATUSES.has(q.statusCode));
      setQueue(paymentEntries);
      setLastRefresh(new Date());
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed to load payment queue. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const fetchHistory = useCallback(async () => {
    setHistLoading(true);
    setHistError(null);
    try {
      const params = new URLSearchParams({
        history: "true",
        date: histDate,
        ...(histMethod  ? { method:  histMethod  } : {}),
        ...(histCashier ? { cashier: histCashier } : {}),
        ...(histSearch  ? { search:  histSearch  } : {}),
        pageSize: "200",
      });
      const json: PaymentHistoryResponse = await apiFetch(`/api/payment?${params}`);
      setHistRecords(json.data);
      setHistTotalPaid(json.totalPaid);
      setHistTotalDisc(json.totalDisc);
    } catch (e) {
      console.error(e);
      setHistError("Failed to load payment history.");
    } finally {
      setHistLoading(false);
    }
  }, [histDate, histMethod, histCashier, histSearch]);

  useEffect(() => {
    if (tab === "history") fetchHistory();
  }, [tab, fetchHistory]);

  const filtered = useMemo(() => {
    if (!search.trim()) return queue;
    const s = search.toLowerCase();
    return queue.filter(
      (q) =>
        q.patientName.toLowerCase().includes(s) ||
        q.code.toLowerCase().includes(s) ||
        (q.notes ?? "").toLowerCase().includes(s) ||
        q.statusName.toLowerCase().includes(s)
    );
  }, [queue, search]);

  // Stats
  const forPaymentCount = queue.filter((q) => q.statusCode === 201 || q.statusCode === 202).length;
  const paidCount       = queue.filter((q) => q.statusCode >= 210 && q.statusCode < 650).length;
  const inProgressCount = queue.filter((q) => q.statusCode >= 203 && q.statusCode < 210).length;


  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Payment</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={tab === "queue" ? fetchQueue : fetchHistory}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800 w-fit">
        {(["queue", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
              tab === t
                ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {t === "queue" ? "Payment Queue" : "Payment History"}
          </button>
        ))}
      </div>

      {/* ── HISTORY TAB ─────────────────────────────────────── */}
      {tab === "history" && (
        <div>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Date</label>
              <input
                type="date"
                value={histDate}
                onChange={(e) => setHistDate(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Payment Method</label>
              <select
                value={histMethod}
                onChange={(e) => setHistMethod(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">All Methods</option>
                <option value="CASH">Cash</option>
                <option value="CHECK">Check</option>
                <option value="CARD">Card</option>
                <option value="HMO">HMO</option>
                <option value="CORPORATE">Corporate</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Cashier</label>
              <input
                type="text"
                value={histCashier}
                onChange={(e) => setHistCashier(e.target.value)}
                placeholder="Username…"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Search</label>
              <input
                type="text"
                value={histSearch}
                onChange={(e) => setHistSearch(e.target.value)}
                placeholder="OR #, patient, queue…"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <button
              onClick={fetchHistory}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>

          {/* Summary cards */}
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard label="OR Records" value={histRecords.length} color="slate" />
            <StatCard label={`Total Paid (${histDate})`} value={histTotalPaid} color="emerald" isCurrency />
            <StatCard label="Total Discount" value={histTotalDisc} color="blue" isCurrency />
          </div>

          {histError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{histError}</div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-700/50">
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">OR #</th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Queue No.</th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Patient</th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Method</th>
                    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Paid</th>
                    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Discount</th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Ref / Bank</th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Cashier</th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Time</th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {histLoading ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                      </td>
                    </tr>
                  ) : histRecords.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-400">
                        No payment records for {histDate}.
                      </td>
                    </tr>
                  ) : (
                    histRecords.map((r) => (
                      <tr key={r.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40">
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">{r.orNum || "—"}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <button
                            onClick={() => router.push(`/payment/${r.idQueue}`)}
                            className="font-mono text-xs text-slate-600 underline-offset-2 hover:underline dark:text-slate-300"
                          >
                            {r.queueCode || r.idQueue}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800 dark:text-slate-200">
                          {r.patientName || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {r.paymentType || "—"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {r.payAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-slate-500 dark:text-slate-400">
                          {r.discAmount > 0 ? r.discAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 }) : "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                          {r.refNo || r.bankName || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                          {r.cashier}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                          {new Date(r.inputDate).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true })}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <a
                            href={`/api/queue/${r.idQueue}/pdf?type=or`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                            </svg>
                            Print OR
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── QUEUE TAB ─────────────────────────────────────────── */}
      {tab === "queue" && (
      <div>

      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-500">Loading payment queue...</span>
        </div>
      )}

      {!loading && (
      <div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={queue.length} color="slate" />
        <StatCard label="For Payment" value={forPaymentCount} color="yellow" />
        <StatCard label="In Progress" value={inProgressCount} color="blue" />
        <StatCard label="Paid" value={paidCount} color="emerald" />
      </div>

      {/* Search */}
      <div className="mb-4 flex justify-end">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search patient, queue no., notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:w-72"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-700/50">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Queue No.</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Patient Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Notes</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Time In</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Input By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-400">
                    {queue.length === 0
                      ? "No payment entries for today."
                      : "No entries match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const sc = getStatusStyle(q.statusCode);
                  return (
                    <tr
                      key={q.id}
                      onClick={() => router.push(`/payment/${q.id}`)}
                      className="cursor-pointer transition-colors hover:bg-blue-50/60 dark:hover:bg-slate-700/50"
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {q.code}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {q.patientName || <span className="text-slate-400">—</span>}
                      </td>
                      <td className="max-w-xs px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="line-clamp-2">{q.notes || <span className="text-slate-300">—</span>}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${sc.bg} ${sc.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                          {q.statusName}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                        {formatTime(q.queueDateTime)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                        {q.inputBy}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing {filtered.length} of {queue.length} entries
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {lastRefresh && (
              <span>Updated: {lastRefresh.toLocaleTimeString("en-PH")}</span>
            )}
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Auto-refresh: 15s
            </span>
          </div>
        </div>
      </div>
      </div>
      )}
      </div>
      )}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
  isCurrency,
}: {
  label: string;
  value: number;
  color: "slate" | "yellow" | "blue" | "emerald";
  isCurrency?: boolean;
}) {
  const styles = {
    slate:   { bg: "bg-slate-50",   text: "text-slate-700",   dark: "dark:bg-slate-700" },
    yellow:  { bg: "bg-yellow-50",  text: "text-yellow-700",  dark: "dark:bg-yellow-950" },
    blue:    { bg: "bg-blue-50",    text: "text-blue-700",    dark: "dark:bg-blue-950" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", dark: "dark:bg-emerald-950" },
  }[color];

  const display = isCurrency
    ? value.toLocaleString("en-PH", { minimumFractionDigits: 2 })
    : value;

  return (
    <div className={`rounded-xl border border-slate-200 p-4 ${styles.bg} ${styles.dark} dark:border-slate-700`}>
      <p className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${styles.text}`}>{display}</p>
    </div>
  );
}
