"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  PhoneCall, Pause, RotateCcw, CheckCircle2, LogOut, RefreshCw,
  AlertTriangle, Crown, ChevronUp, ChevronDown, ChevronsUpDown, Search, X, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useToast, ToastContainer } from "@/components/ui/toast";

// ── Types ──────────────────────────────────────────────────────

interface KioskRow {
  id: number | null;    // kiosk_queue.id — null if patient not yet processed at this station
  queueId: number;      // queue.id — always present
  station: string;
  status: string;
  priority: number | null;
  callCount: number;
  room: string | null;
  idbu: string | null;
  createdAt: string;
  fullName: string | null;
  accessionNo: string | null;
  gender: string | null;
  age: number | null;
  queueCode: string | null;
  queueStatus: number;
}

type SortDir = "asc" | "desc";

function sortRows(rows: KioskRow[], key: keyof KioskRow | "", dir: SortDir): KioskRow[] {
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

function SortableHeader({
  label, colKey, sortKey, sortDir, onSort,
}: {
  label: string; colKey: string; sortKey: string; sortDir: SortDir; onSort: (k: string) => void;
}) {
  const active = sortKey === colKey;
  return (
    <th
      onClick={() => onSort(colKey)}
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 ${active ? "text-slate-700 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active
          ? sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5 text-blue-500" /> : <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
          : <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />}
      </span>
    </th>
  );
}

// ── Status helpers ─────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  waiting:      { label: "Waiting",     cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" },
  in_progress:  { label: "In Progress", cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
  startQueue:   { label: "Started",     cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" },
  on_hold:      { label: "On Hold",     cls: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800" },
  resume_queue: { label: "Resumed",     cls: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800" },
  completed:    { label: "Completed",   cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" },
  next_room:    { label: "Next Room",   cls: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" },
};

function StatusBadge({ status }: { status: string }) {
  const entry = STATUS_BADGE[status] ?? { label: status, cls: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

// ── Props ──────────────────────────────────────────────────────

interface Props {
  department: string;
  departmentLabel: string;
  color: string;
  showHoldResume?: boolean;
  showCallCount?: boolean;
  showExit?: boolean;
  showComplete?: boolean;
  idbu?: string;
}

const REFRESH_INTERVAL = 10_000;

export function KioskQueueClient({
  department,
  departmentLabel,
  color,
  showHoldResume = true,
  showCallCount = true,
  showExit = true,
  showComplete = false,
  idbu,
}: Props) {
  const { toasts, toast, dismiss } = useToast();

  const [rows, setRows]         = useState<KioskRow[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  // Track loading state per row by queueId (always unique)
  const [actionLoading, setAL]  = useState<number | null>(null);
  const [sortKey, setSortKey]   = useState<keyof KioskRow | "">("");
  const [sortDir, setSortDir]   = useState<SortDir>("asc");
  const [search, setSearch]     = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [noWorkstation, setNoWorkstation] = useState(false);
  const loadedOnce = useRef(false);

  function handleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key as keyof KioskRow); setSortDir("asc"); }
  }

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ department });
      if (idbu) params.set("idbu", idbu);
      const json = await apiFetch<{ success: boolean; data: KioskRow[] }>(`/api/kiosk/queue?${params}`);
      setRows(json.data);
      if (!loadedOnce.current) {
        loadedOnce.current = true;
        setNoWorkstation(json.data.length === 0);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load queue");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [department, idbu]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    const interval = setInterval(() => fetchData(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  /**
   * Perform an action on a queue row.
   *
   * If the row has a kiosk_queue.id (row.id !== null) → PATCH /api/kiosk/{kioskId}/action
   * If the row has no kiosk row yet (row.id === null, action === "call") →
   *   PATCH /api/kiosk/{queueId}/action with { station, idbu } so the API creates the row.
   */
  async function doAction(row: KioskRow, action: string) {
    setAL(row.queueId);
    setError("");
    try {
      // Use kiosk_queue.id if available, otherwise use the CMS queue.id (triggers auto-create)
      const urlId = row.id !== null ? row.id : row.queueId;
      const body: Record<string, unknown> = { action };

      // When calling an unprocessed patient (no kiosk row yet), pass station + idbu
      // so the API can create the kiosk_queue row
      if (row.id === null && action === "call") {
        body.station = row.station;
        if (row.idbu) body.idbu = row.idbu;
      }

      await apiFetch(`/api/kiosk/${urlId}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await fetchData(true);
      const labels: Record<string, string> = {
        call:     "Patient called.",
        hold:     "Queue on hold.",
        resume:   "Queue resumed.",
        complete: "Marked completed.",
        exit:     "Patient exited.",
      };
      toast(labels[action] ?? "Done.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Action failed";
      setError(msg);
      toast(msg, "error");
    } finally {
      setAL(null);
    }
  }

  const colorBtn: Record<string, string> = {
    blue:    "bg-blue-600 hover:bg-blue-700",
    purple:  "bg-purple-600 hover:bg-purple-700",
    indigo:  "bg-indigo-600 hover:bg-indigo-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    amber:   "bg-amber-500 hover:bg-amber-600",
    rose:    "bg-rose-600 hover:bg-rose-700",
  };
  const primaryBtn = colorBtn[color] ?? colorBtn.blue;

  // Filter + sort
  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q
      || (r.fullName ?? "").toLowerCase().includes(q)
      || (r.accessionNo ?? "").toLowerCase().includes(q)
      || (r.queueCode ?? "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const sorted = sortRows(filtered, sortKey, sortDir);

  const waiting    = rows.filter((r) => ["waiting", "startQueue", "resume_queue"].includes(r.status)).length;
  const inProgress = rows.filter((r) => r.status === "in_progress").length;
  const onHold     = rows.filter((r) => r.status === "on_hold").length;
  const done       = rows.filter((r) => ["completed", "next_room"].includes(r.status)).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/queue/kiosk"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{departmentLabel}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Auto-refreshes every 10 seconds</p>
          </div>
        </div>
        <button onClick={() => fetchData()} disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Waiting",     value: waiting,    cls: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400" },
          { label: "In Progress", value: inProgress, cls: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" },
          { label: "On Hold",     value: onHold,     cls: "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" },
          { label: "Done",        value: done,        cls: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl border px-4 py-3 ${s.cls}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, accession, queue code..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="all">All Status</option>
          <option value="waiting">Waiting</option>
          <option value="startQueue">Started</option>
          <option value="in_progress">In Progress</option>
          <option value="on_hold">On Hold</option>
          <option value="resume_queue">Resumed</option>
        </select>
        {(search || filterStatus !== "all") && (
          <button
            onClick={() => { setSearch(""); setFilterStatus("all"); }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Clear
          </button>
        )}
        {(search || filterStatus !== "all") && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {sorted.length} of {rows.length} shown
          </span>
        )}
      </div>

      {noWorkstation && rows.length === 0 && !loading && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            No queue data found. This workstation IP may not be registered for the <strong>{department}</strong> department,
            or there are no patients queued for today.
            Contact ICT to register this workstation in Workstation Management.
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
              <tr>
                <SortableHeader label="#"         colKey="queueCode"   sortKey={String(sortKey)} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Patient"   colKey="fullName"    sortKey={String(sortKey)} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Accession" colKey="accessionNo" sortKey={String(sortKey)} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Status"    colKey="status"      sortKey={String(sortKey)} sortDir={sortDir} onSort={handleSort} />
                {showCallCount && (
                  <SortableHeader label="Called"  colKey="callCount"   sortKey={String(sortKey)} sortDir={sortDir} onSort={handleSort} />
                )}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={showCallCount ? 6 : 5} className="py-16 text-center text-sm text-slate-400">Loading...</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={showCallCount ? 6 : 5} className="py-16 text-center text-sm text-slate-400">No patients in queue</td></tr>
              ) : sorted.map((row) => {
                const isVIP      = row.priority === 4;
                const busy       = actionLoading === row.queueId;
                const isWaiting  = ["waiting", "startQueue", "resume_queue"].includes(row.status);
                const isProgress = row.status === "in_progress";
                const isHold     = row.status === "on_hold";

                return (
                  <tr key={row.queueId}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${isVIP ? "bg-amber-50/60 dark:bg-amber-900/10" : ""}`}
                  >
                    {/* # / queue code */}
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        {isVIP && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                        {row.queueCode ?? row.queueId}
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-100">{row.fullName ?? "—"}</div>
                      {(row.gender || row.age) && (
                        <div className="text-xs text-slate-400">{[row.gender, row.age ? `${row.age}y` : null].filter(Boolean).join(", ")}</div>
                      )}
                    </td>

                    {/* Accession */}
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{row.accessionNo ?? "—"}</td>

                    {/* Status */}
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>

                    {/* Call count */}
                    {showCallCount && (
                      <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{row.callCount}</td>
                    )}

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">

                        {/* Call — shown when waiting. Also works for patients with no kiosk row yet. */}
                        {isWaiting && (
                          <button onClick={() => doAction(row, "call")}
                            disabled={busy}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50 ${primaryBtn}`}>
                            <PhoneCall className="h-3.5 w-3.5" />
                            {busy ? "..." : "Call"}
                          </button>
                        )}

                        {/* Hold */}
                        {showHoldResume && isProgress && (
                          <button onClick={() => doAction(row, "hold")}
                            disabled={busy}
                            className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
                            <Pause className="h-3.5 w-3.5" /> Hold
                          </button>
                        )}

                        {/* Resume */}
                        {showHoldResume && isHold && (
                          <button onClick={() => doAction(row, "resume")}
                            disabled={busy}
                            className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50">
                            <RotateCcw className="h-3.5 w-3.5" /> Resume
                          </button>
                        )}

                        {/* Complete (Done) — for non-releasing queues */}
                        {showComplete && showExit && isProgress && (
                          <button onClick={() => doAction(row, "complete")}
                            disabled={busy}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </button>
                        )}

                        {/* Exit — move to next station */}
                        {showExit && isProgress && (
                          <button onClick={() => doAction(row, "exit")}
                            disabled={busy}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-600 disabled:opacity-50">
                            <LogOut className="h-3.5 w-3.5" /> Exit
                          </button>
                        )}

                        {/* Release — Releasing queue only (showComplete + !showExit) */}
                        {showComplete && !showExit && isProgress && (
                          <button onClick={() => doAction(row, "complete")}
                            disabled={busy}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Release
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rows.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {rows.length} patient{rows.length !== 1 ? "s" : ""} in today&apos;s queue
            </p>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
