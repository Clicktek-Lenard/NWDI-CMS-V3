"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { QueueEntry, PaginatedResponse } from "@/types";

// ── Status color palette (cycles for unknown statuses) ────────
const PALETTE = [
  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  { bg: "bg-blue-50",    text: "text-blue-700",     dot: "bg-blue-500"    },
  { bg: "bg-emerald-50", text: "text-emerald-700",  dot: "bg-emerald-500" },
  { bg: "bg-red-50",     text: "text-red-700",      dot: "bg-red-500"     },
  { bg: "bg-purple-50",  text: "text-purple-700",   dot: "bg-purple-500"  },
  { bg: "bg-indigo-50",  text: "text-indigo-700",   dot: "bg-indigo-500"  },
  { bg: "bg-slate-50",   text: "text-slate-600",    dot: "bg-slate-400"   },
];

// ── Helpers ───────────────────────────────────────────────────
function formatTime(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

// ── Main Component ────────────────────────────────────────────
export function QueueClient() {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignMsg, setAssignMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [forSpecimenLoading, setForSpecimenLoading] = useState<number | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/queue?pageSize=500");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: PaginatedResponse<QueueEntry> & { stats: Record<string, number> } =
        await res.json();
      setQueue(json.data);
      setStats(json.stats ?? {});
      setLastRefresh(new Date());
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed to load queue data. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  // Unique status names from today's data (ordered by frequency)
  const uniqueStatuses = useMemo(() => {
    const seen = new Map<string, number>();
    for (const q of queue) {
      seen.set(q.statusName, (seen.get(q.statusName) ?? 0) + 1);
    }
    return [...seen.keys()];
  }, [queue]);

  // Stable color assignment per status name
  const statusColorMap = useMemo(() => {
    const map = new Map<string, (typeof PALETTE)[0]>();
    uniqueStatuses.forEach((name, i) => {
      map.set(name, PALETTE[i % PALETTE.length]);
    });
    return map;
  }, [uniqueStatuses]);

  const filtered = useMemo(() => {
    let list = queue;
    if (filter !== "ALL") {
      list = list.filter((q) => q.statusName === filter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (q) =>
          q.patientName.toLowerCase().includes(s) ||
          q.accessionNo.toLowerCase().includes(s) ||
          q.code.toLowerCase().includes(s) ||
          q.patientType.toLowerCase().includes(s)
      );
    }
    return list;
  }, [queue, filter, search]);

  // Top 3 statuses for stat cards
  const topStatuses = useMemo(() => {
    return uniqueStatuses
      .map((name) => ({ name, count: stats[name] ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [uniqueStatuses, stats]);

  // Count of queues pending specimen collection (Status 300)
  const pendingSpecimen = useMemo(
    () => queue.filter((q) => q.statusCode === 300).length,
    [queue],
  );

  const handleForSpecimen = useCallback(async (queueId: number) => {
    setForSpecimenLoading(queueId);
    try {
      await apiFetch(`/api/queue/${queueId}/for-specimen`, { method: "POST" });
      fetchQueue();
    } catch {
      setAssignMsg({ type: "err", text: "Failed to mark queue for specimen. Try again." });
    } finally {
      setForSpecimenLoading(null);
    }
  }, [fetchQueue]);

  const handleAssignAccession = useCallback(async () => {
    setAssigning(true);
    setAssignMsg(null);
    try {
      const data = await apiFetch<{
        message?: string;
        queueCode?: string;
        assigned?: Array<{ accessionNo: string; type: string }>;
      }>("/api/accession/make", { method: "POST" });

      if (data.message) {
        setAssignMsg({ type: "ok", text: data.message });
      } else {
        const labCount = data.assigned?.filter((a) => a.type === "LAB").length ?? 0;
        const imgCount = data.assigned?.filter((a) => a.type === "IMAGING").length ?? 0;
        setAssignMsg({
          type: "ok",
          text: `Accession assigned for ${data.queueCode} — ${labCount} LAB, ${imgCount} IMAGING.`,
        });
        fetchQueue(); // refresh list
      }
    } catch {
      setAssignMsg({ type: "err", text: "Failed to assign accession numbers. Try again." });
    } finally {
      setAssigning(false);
    }
  }, [fetchQueue]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <span className="ml-3 text-sm text-slate-500">Loading today&apos;s queue...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Queue Today</h1>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchQueue}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleAssignAccession}
            disabled={assigning}
            title="Assign accession numbers to the next queue pending specimen collection (Status 300). Press only after physical specimen is collected."
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm transition-all hover:bg-amber-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {assigning ? (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
            )}
            Assign Accession No.
            {pendingSpecimen > 0 && (
              <span className="ml-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white">
                {pendingSpecimen}
              </span>
            )}
          </button>
          <button
            onClick={() => router.push("/queue/create")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add to Queue
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Accession assignment feedback */}
      {assignMsg && (
        <div
          className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            assignMsg.type === "ok"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>{assignMsg.text}</span>
          <button onClick={() => setAssignMsg(null)} className="shrink-0 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Today"
          value={stats.total ?? 0}
          paletteIndex={6}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          }
        />
        {topStatuses.map((s, i) => (
          <StatCard
            key={s.name}
            label={s.name}
            value={s.count}
            paletteIndex={i}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
          />
        ))}
      </div>

      {/* Filters + Search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              filter === "ALL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            All
            <span className="ml-1.5 text-[10px] opacity-60">{stats.total ?? 0}</span>
          </button>
          {uniqueStatuses.map((name) => (
            <button
              key={name}
              onClick={() => setFilter(name)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                filter === name
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {name}
              <span className="ml-1.5 text-[10px] opacity-60">{stats[name] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search patient, accession, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 sm:w-72"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">#</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Queue Code</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Patient Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Accession No</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Patient Type</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Time In</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Added By</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-sm text-slate-400">
                    {queue.length === 0
                      ? "No queue entries for today."
                      : "No entries match your filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const sc = statusColorMap.get(q.statusName) ?? PALETTE[6];
                  return (
                    <tr key={q.id} className="transition-colors hover:bg-slate-50/60">
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {q.rowNumber}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Link href={`/queue/${q.id}/edit`} className="font-mono text-xs text-blue-600 hover:underline">
                          {q.code}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                        {q.patientName || <span className="text-slate-400">—</span>}
                        {q.age != null && (
                          <span className="ml-2 text-xs text-slate-400">
                            {q.age}y {q.gender}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">
                        {q.accessionNo || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                        {q.patientType || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${sc.bg} ${sc.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                          {q.statusName}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="text-xs text-slate-700">{formatTime(q.queueDateTime)}</span>
                        <span className="ml-2 text-[11px] text-slate-400">{timeAgo(q.queueDateTime)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                        {q.inputBy}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {q.statusCode === 210 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleForSpecimen(q.id); }}
                            disabled={forSpecimenLoading === q.id}
                            title="Mark as For Specimen (Status 300)"
                            className="inline-flex items-center gap-1 rounded-lg border border-teal-300 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 transition-all hover:bg-teal-100 disabled:opacity-50"
                          >
                            {forSpecimenLoading === q.id ? (
                              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                            ) : (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.189 3.568a2.25 2.25 0 0 1-2.133 1.529H7.522a2.25 2.25 0 0 1-2.133-1.529L4.2 15m15.6 0H4.2" />
                              </svg>
                            )}
                            For Specimen
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3">
          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {queue.length} entries
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
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
  icon,
  paletteIndex,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  paletteIndex: number;
}) {
  const p = PALETTE[paletteIndex % PALETTE.length];
  return (
    <div className={`rounded-xl border border-slate-200 p-4 ${p.bg}`}>
      <div className="flex items-center justify-between">
        <p className="truncate pr-2 text-sm font-medium text-slate-600">{label}</p>
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/60 ${p.text}`}>
          {icon}
        </div>
      </div>
      <p className={`mt-2 text-3xl font-bold ${p.text}`}>{value}</p>
    </div>
  );
}
