"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, RefreshCw, Shield } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ActivityLog {
  id:          number;
  clinic_code: string;
  user_id:     string;
  username:    string;
  ip_address:  string | null;
  action:      string;
  resource:    string;
  resource_id: string | null;
  detail:      Record<string, unknown> | null;
  created_at:  string;
}

interface AuditResponse {
  data:       ActivityLog[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

// ── Action badge colours ───────────────────────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
  CREATE_QUEUE:       "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  CANCEL_QUEUE:       "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  APPROVE_AMENDMENT:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  REJECT_AMENDMENT:   "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  RECORD_PAYMENT:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  CANCEL_PAYMENT:     "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  RELEASE_RESULT:     "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  RECEIVE_SPECIMEN:   "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  ASSIGN_ACCESSION:   "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  CREATE_USER:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  UPDATE_USER:        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  USER_LOGIN:         "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  USER_LOGOUT:        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  DEACTIVATE_USER:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  SAVE_PRESCRIPTION:  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  ENCODE_RESULT:      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
};

const DEFAULT_BADGE = "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";

// ── Component ──────────────────────────────────────────────────────────────────

export function AuditLogClient() {
  const [page,     setPage]     = useState(1);
  const [action,   setAction]   = useState("");
  const [resource, setResource] = useState("");
  const [username, setUsername] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");

  // Committed filter state — only updates on Search click
  const [committed, setCommitted] = useState({
    action: "", resource: "", username: "", dateFrom: "", dateTo: "",
  });

  const queryKey = ["audit-logs", page, committed];

  const { data, isFetching, refetch } = useQuery<AuditResponse>({
    queryKey,
    queryFn: () => {
      const sp = new URLSearchParams({ page: String(page), pageSize: "50" });
      if (committed.action)   sp.set("action",   committed.action);
      if (committed.resource) sp.set("resource", committed.resource);
      if (committed.username) sp.set("username", committed.username);
      if (committed.dateFrom) sp.set("dateFrom", committed.dateFrom);
      if (committed.dateTo)   sp.set("dateTo",   committed.dateTo);
      return apiFetch(`/api/audit-logs?${sp}`);
    },
    staleTime: 30_000,
  });

  const handleSearch = useCallback(() => {
    setPage(1);
    setCommitted({ action, resource, username, dateFrom, dateTo });
  }, [action, resource, username, dateFrom, dateTo]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const logs       = data?.data       ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total      = data?.total      ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Audit Log</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">System activity trail — all write operations are recorded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {/* Action */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Action</label>
            <input
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. CREATE_QUEUE"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Resource */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Resource</label>
            <input
              type="text"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. queue"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Filter by user"
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-lg border border-slate-300 p-1.5 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
              title="Refresh"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Date / Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">IP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {isFetching && logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">Loading…</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No audit log entries found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                      {log.username}
                      <span className="ml-1 text-slate-400 dark:text-slate-500">[{log.clinic_code}]</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${ACTION_COLORS[log.action] ?? DEFAULT_BADGE}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 capitalize">
                      {log.resource}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                      {log.resource_id ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                      {log.ip_address ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate" title={log.detail ? JSON.stringify(log.detail) : ""}>
                      {log.detail ? (
                        <span className="font-mono">{JSON.stringify(log.detail)}</span>
                      ) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {total > 0
              ? `${(page - 1) * 50 + 1}–${Math.min(page * 50, total)} of ${total.toLocaleString()} entries`
              : "No entries"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-slate-300 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Page {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-slate-300 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
