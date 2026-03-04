"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  RefreshCw, Users, Clock, Loader2, Stethoscope,
  AlertCircle, ChevronRight, Activity, CheckCircle2,
  Search, MoreVertical, CheckCheck, RotateCcw, XCircle,
  PlayCircle,
} from "lucide-react";
import { EvaluationDrawer } from "./evaluation-drawer";
import type { ClinicalQueueEntry } from "./evaluation-drawer";

// ── Helpers ───────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

function statusBadge(status: string) {
  switch (status) {
    case "WAITING":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
          Waiting
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
          In Progress
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600">
          <XCircle className="h-3 w-3" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
          {status}
        </span>
      );
  }
}

interface Stats {
  waiting: number;
  inProgress: number;
  completed: number;
}

type StatusFilter = "" | "WAITING" | "IN_PROGRESS" | "COMPLETED";

// ── Dropdown menu items per status ────────────────────────────
function dropdownItems(status: string) {
  switch (status) {
    case "WAITING":
      return [
        { label: "Start Evaluation", to: "IN_PROGRESS", icon: PlayCircle, color: "text-blue-600" },
        { label: "Cancel", to: "CANCELLED", icon: XCircle, color: "text-red-500" },
      ];
    case "IN_PROGRESS":
      return [
        { label: "Mark Complete", to: "COMPLETED", icon: CheckCheck, color: "text-emerald-600" },
        { label: "Revert to Waiting", to: "WAITING", icon: RotateCcw, color: "text-amber-600" },
        { label: "Cancel", to: "CANCELLED", icon: XCircle, color: "text-red-500" },
      ];
    case "COMPLETED":
      return [
        { label: "Revert to In Progress", to: "IN_PROGRESS", icon: RotateCcw, color: "text-blue-600" },
      ];
    case "CANCELLED":
      return [
        { label: "Restore to Waiting", to: "WAITING", icon: RotateCcw, color: "text-amber-600" },
      ];
    default:
      return [];
  }
}

// ── Component ─────────────────────────────────────────────────
export function ClinicalClient() {
  const [queue, setQueue] = useState<ClinicalQueueEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ waiting: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ClinicalQueueEntry | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/clinical/queue?${params.toString()}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error);

      setQueue(json.data);
      setStats(json.stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Close dropdown on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    if (activeDropdown !== null) {
      document.addEventListener("mousedown", onOutsideClick);
    }
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [activeDropdown]);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  async function handleStatusChange(queueId: number, newStatus: string) {
    setActiveDropdown(null);
    setActionLoading(queueId);
    try {
      const res = await fetch(`/api/clinical/${queueId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchQueue();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = queue.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      q.patientName.toLowerCase().includes(s) ||
      q.patientId.toLowerCase().includes(s) ||
      q.queueNumber.toString().includes(s)
    );
  });

  const TAB_FILTERS: { label: string; value: StatusFilter; count?: number; color: string }[] = [
    { label: "All", value: "", color: "text-slate-600" },
    { label: "Waiting", value: "WAITING", count: stats.waiting, color: "text-amber-600" },
    { label: "In Progress", value: "IN_PROGRESS", count: stats.inProgress, color: "text-blue-600" },
    { label: "Completed", value: "COMPLETED", count: stats.completed, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-500">Waiting</p>
              <p className="mt-1 text-3xl font-bold text-amber-700">{stats.waiting}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-500">In Progress</p>
              <p className="mt-1 text-3xl font-bold text-blue-700">{stats.inProgress}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">Completed</p>
              <p className="mt-1 text-3xl font-bold text-emerald-700">{stats.completed}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Queue table card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex gap-1">
            {TAB_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === f.value
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {f.label}
                {f.count !== undefined && (
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    statusFilter === f.value ? "bg-white/20 text-white" : f.color
                  }`}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <button
              onClick={fetchQueue}
              disabled={loading}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-20">Queue #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Company / HMO</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Diagnosis</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Arrived</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-300" />
                    <p className="mt-2 text-sm text-slate-400">Loading queue…</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-200" />
                    <p className="mt-2 text-sm font-medium text-slate-400">No patients in queue</p>
                    <p className="text-xs text-slate-300">Queue will refresh automatically</p>
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    className={`group cursor-pointer transition-colors hover:bg-blue-50/40 ${
                      selected?.id === entry.id ? "bg-blue-50" : ""
                    }`}
                  >
                    {/* Queue number */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {entry.priority === 1 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" title="Priority" />
                        )}
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-700 font-mono">
                          #{entry.queueNumber.toString().padStart(3, "0")}
                        </span>
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-800">{entry.patientName}</p>
                      <p className="text-xs text-slate-400">{entry.patientId}</p>
                    </td>

                    {/* Company */}
                    <td className="px-4 py-4 text-slate-600 text-sm">
                      {entry.companyName || <span className="text-slate-300">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      {statusBadge(entry.status)}
                    </td>

                    {/* Diagnosis */}
                    <td className="px-4 py-4">
                      {entry.consultation?.diagnosis ? (
                        <p className="max-w-[180px] truncate text-xs text-slate-600">
                          {entry.consultation.diagnosis}
                        </p>
                      ) : (
                        <span className="text-xs text-slate-300">Not yet assessed</span>
                      )}
                    </td>

                    {/* Time */}
                    <td className="px-4 py-4 text-xs text-slate-400">
                      {timeAgo(entry.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Primary action */}
                        {actionLoading === entry.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                          <button
                            onClick={() => setSelected(entry)}
                            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all active:scale-[0.98] ${
                              entry.status === "COMPLETED"
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : entry.status === "IN_PROGRESS"
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700"
                                : entry.status === "CANCELLED"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
                            }`}
                            disabled={entry.status === "CANCELLED"}
                          >
                            <Stethoscope className="h-3.5 w-3.5" />
                            {entry.status === "COMPLETED" ? "View"
                              : entry.status === "IN_PROGRESS" ? "Continue"
                              : entry.status === "CANCELLED" ? "Cancelled"
                              : "Evaluate"}
                            {entry.status !== "CANCELLED" && (
                              <ChevronRight className="h-3 w-3 opacity-60" />
                            )}
                          </button>
                        )}

                        {/* More actions dropdown */}
                        <div className="relative" ref={activeDropdown === entry.id ? dropdownRef : null}>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === entry.id ? null : entry.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            title="More actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {activeDropdown === entry.id && (
                            <div className="absolute right-0 top-full mt-1 z-50 min-w-45 rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/60">
                              {dropdownItems(entry.status).map((item) => (
                                <button
                                  key={item.to}
                                  onClick={() => handleStatusChange(entry.id, item.to)}
                                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 ${item.color}`}
                                >
                                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                                  {item.label}
                                </button>
                              ))}
                              {dropdownItems(entry.status).length === 0 && (
                                <p className="px-3 py-2 text-xs text-slate-400">No actions available</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-400">
              Showing <span className="font-medium text-slate-600">{filtered.length}</span> patient{filtered.length !== 1 ? "s" : ""}
              {search && ` matching "${search}"`}
            </p>
          </div>
        )}
      </div>

      {/* Evaluation Drawer */}
      <EvaluationDrawer
        patient={selected}
        onClose={() => setSelected(null)}
        onCompleted={fetchQueue}
      />
    </div>
  );
}
