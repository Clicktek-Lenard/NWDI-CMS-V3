"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { QueueEntry, PaginatedResponse } from "@/types";

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
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <span className="ml-3 text-sm text-slate-500">Loading payment queue...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Payment</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

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
  );
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "slate" | "yellow" | "blue" | "emerald";
}) {
  const styles = {
    slate:   { bg: "bg-slate-50",   text: "text-slate-700",   dark: "dark:bg-slate-700" },
    yellow:  { bg: "bg-yellow-50",  text: "text-yellow-700",  dark: "dark:bg-yellow-950" },
    blue:    { bg: "bg-blue-50",    text: "text-blue-700",    dark: "dark:bg-blue-950" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", dark: "dark:bg-emerald-950" },
  }[color];

  return (
    <div className={`rounded-xl border border-slate-200 p-4 ${styles.bg} ${styles.dark} dark:border-slate-700`}>
      <p className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${styles.text}`}>{value}</p>
    </div>
  );
}
