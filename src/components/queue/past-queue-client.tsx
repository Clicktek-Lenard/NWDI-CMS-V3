"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { QueueEntry, PaginatedResponse } from "@/types";

type PastQueueEntry = QueueEntry & {
  date: string;
  anteDateReason?: string;
  anteDateCode?: string;
};

// ── Status color palette ──────────────────────────────────────
const PALETTE = [
  { bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-700 dark:text-amber-300",   dot: "bg-amber-500"   },
  { bg: "bg-blue-50 dark:bg-blue-900/20",     text: "text-blue-700 dark:text-blue-300",     dot: "bg-blue-500"    },
  { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  { bg: "bg-red-50 dark:bg-red-900/20",       text: "text-red-700 dark:text-red-300",       dot: "bg-red-500"     },
  { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500"  },
  { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500"  },
  { bg: "bg-slate-50 dark:bg-slate-700/50",   text: "text-slate-600 dark:text-slate-300",   dot: "bg-slate-400"   },
];

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Amendment Panel ───────────────────────────────────────────
function AmendmentPanel() {
  const [amendments, setAmendments] = useState<PastQueueEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [busy, setBusy]             = useState<number | null>(null);
  const [rejectId, setRejectId]     = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchAmendments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json: PaginatedResponse<PastQueueEntry> = await apiFetch(
        "/api/queue/past?status=202&pageSize=100"
      );
      setAmendments(json.data);
    } catch {
      setError("Failed to load amendments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAmendments(); }, [fetchAmendments]);

  async function handleApprove(id: number) {
    setBusy(id);
    try {
      await apiFetch(`/api/queue/${id}/approve-amendment`, { method: "POST" });
      fetchAmendments();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to approve");
    } finally {
      setBusy(null);
    }
  }

  async function handleReject() {
    if (!rejectId || !rejectReason.trim()) return;
    setBusy(rejectId);
    try {
      await apiFetch(`/api/queue/${rejectId}/reject-amendment`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason }),
      });
      setRejectId(null);
      setRejectReason("");
      fetchAmendments();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to reject");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Reject reason modal */}
      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <h3 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">
              Reject Amendment
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection…"
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => { setRejectId(null); setRejectReason(""); }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || busy === rejectId}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {busy === rejectId ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Amendment Code</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Patient</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Original Queue</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Reason</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Requested By</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                      Loading amendments…
                    </div>
                  </td>
                </tr>
              ) : amendments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    No pending amendments.
                  </td>
                </tr>
              ) : (
                amendments.map((q) => (
                  <tr key={q.id} className="hover:bg-amber-50/40 dark:hover:bg-amber-900/10">
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">{q.code}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {q.patientName || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {q.anteDateCode || "—"}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                      {q.anteDateReason || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                      {q.inputBy}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(q.id)}
                          disabled={busy === q.id}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {busy === q.id ? "…" : "Approve"}
                        </button>
                        <button
                          onClick={() => { setRejectId(q.id); setRejectReason(""); }}
                          disabled={busy === q.id}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export function PastQueueClient() {
  const [tab, setTab]           = useState<"history" | "amendments">("history");
  const [records, setRecords]   = useState<PastQueueEntry[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // Filters
  const [search, setSearch]     = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [page, setPage]         = useState(1);
  const pageSize                = 100;

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (dateFrom)       params.set("dateFrom", dateFrom);
    if (dateTo)         params.set("dateTo", dateTo);
    if (statusFilter)   params.set("status", statusFilter);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    return `/api/queue/past?${params.toString()}`;
  }, [search, dateFrom, dateTo, statusFilter, page]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json: PaginatedResponse<PastQueueEntry> = await apiFetch(buildUrl());
      setRecords(json.data);
      setTotal(json.total);
    } catch (e) {
      console.error(e);
      setError("Failed to load past queue records.");
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // Unique statuses from current results for the filter dropdown
  const uniqueStatuses = useMemo(() => {
    const seen = new Set<string>();
    for (const r of records) seen.add(r.statusName);
    return [...seen].sort();
  }, [records]);

  const statusColorMap = useMemo(() => {
    const map = new Map<string, (typeof PALETTE)[0]>();
    [...uniqueStatuses].forEach((name, i) => {
      map.set(name, PALETTE[i % PALETTE.length]);
    });
    return map;
  }, [uniqueStatuses]);

  const totalPages = Math.ceil(total / pageSize);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  }

  const INP = "block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-500";

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Past Queue</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Historical queue records and pending amendments</p>
        </div>
        {tab === "history" && (
          <button
            onClick={() => { setPage(1); fetchRecords(); }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/50">
        {(["history", "amendments"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {t === "history" ? "Queue History" : "Pending Amendments"}
          </button>
        ))}
      </div>

      {tab === "amendments" && <AmendmentPanel />}
      {tab === "history" && (
      <>
      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Patient name search */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Patient Name</label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name..."
                className={`${INP} pl-9`}
              />
            </div>
          </div>

          {/* Date From */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={INP}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={INP}
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={INP}
            >
              <option value="">All statuses</option>
              {uniqueStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {loading ? "Loading…" : `${total.toLocaleString()} record${total !== 1 ? "s" : ""} found`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSearch(""); setDateFrom(""); setDateTo(""); setStatusFilter(""); setPage(1);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">#</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Queue Code</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Patient Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Input By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                      Loading…
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
                    No past queue records found.
                  </td>
                </tr>
              ) : (
                records.map((q, idx) => {
                  const sc = statusColorMap.get(q.statusName) ?? PALETTE[6];
                  const rowNum = (page - 1) * pageSize + idx + 1;
                  return (
                    <tr key={q.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          {rowNum}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Link
                          href={`/past-queue/${q.id}/edit`}
                          className="font-mono text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {q.code}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                        {q.patientName || <span className="text-slate-400 dark:text-slate-500">—</span>}
                        {q.age != null && (
                          <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
                            {q.age}y {q.gender}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                        {formatDate(q.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${sc.bg} ${sc.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                          {q.statusName}
                        </span>
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

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing {records.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total.toLocaleString()} records
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ‹ Prev
              </button>
              <span className="px-2 text-xs text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
