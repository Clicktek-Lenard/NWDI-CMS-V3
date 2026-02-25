"use client";

import { useState, useMemo, useCallback } from "react";
import type { QueueEntry, QueueStatus } from "@/types";
import { AddToQueueModal } from "./add-to-queue-modal";

// ── Initial Sample Data ──────────────────────────────────────
const INITIAL_QUEUE: QueueEntry[] = [
  {
    id: 1,
    queueNumber: 1,
    patientId: "P-2024-00145",
    patientName: "DELA CRUZ, JUAN PABLO",
    companyCode: "MAXICARE",
    companyName: "Maxicare Health Corp.",
    status: "COMPLETED",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    queueNumber: 2,
    patientId: "P-2024-00289",
    patientName: "REYES, MARIA CLARA",
    companyCode: "INTEL",
    companyName: "Intellicare Inc.",
    status: "COMPLETED",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    queueNumber: 3,
    patientId: "P-2024-01023",
    patientName: "SANTOS, JOSE RIZAL",
    companyCode: "PHHEALTH",
    companyName: "PhilHealth",
    status: "IN_PROGRESS",
    priorityLevel: 1,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    queueNumber: 4,
    patientId: "P-2024-00512",
    patientName: "GARCIA, ANA PATRICIA",
    companyCode: "MEDICARD",
    companyName: "Medicard Phil. Inc.",
    status: "IN_PROGRESS",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    queueNumber: 5,
    patientId: "P-2024-00078",
    patientName: "BAUTISTA, CARLOS MIGUEL",
    companyCode: "CASH",
    companyName: "Cash / Walk-in",
    status: "IN_PROGRESS",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    queueNumber: 6,
    patientId: "P-2024-00934",
    patientName: "VILLANUEVA, SOFIA MARIE",
    companyCode: "MAXICARE",
    companyName: "Maxicare Health Corp.",
    status: "WAITING",
    priorityLevel: 1,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    queueNumber: 7,
    patientId: "P-2024-01150",
    patientName: "RAMOS, ANTONIO JR.",
    companyCode: "PHHEALTH",
    companyName: "PhilHealth",
    status: "WAITING",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    queueNumber: 8,
    patientId: "P-2024-00667",
    patientName: "MENDOZA, ISABELLA ROSE",
    companyCode: "CASH",
    companyName: "Cash / Walk-in",
    status: "WAITING",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    queueNumber: 9,
    patientId: "P-2024-00401",
    patientName: "CRUZ, RAFAEL ENRIQUE",
    companyCode: "INTEL",
    companyName: "Intellicare Inc.",
    status: "WAITING",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    queueNumber: 10,
    patientId: "P-2024-01288",
    patientName: "TORRES, GABRIELA FAITH",
    companyCode: "MEDICARD",
    companyName: "Medicard Phil. Inc.",
    status: "WAITING",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    queueNumber: 11,
    patientId: "P-2024-00190",
    patientName: "FERNANDEZ, MARCO LUIGI",
    companyCode: "CASH",
    companyName: "Cash / Walk-in",
    status: "WAITING",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    queueNumber: 12,
    patientId: "P-2024-00823",
    patientName: "AQUINO, DANIELA GRACE",
    companyCode: "MAXICARE",
    companyName: "Maxicare Health Corp.",
    status: "WAITING",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 13,
    queueNumber: 13,
    patientId: "P-2024-00055",
    patientName: "LIM, BENEDICT JAMES",
    companyCode: "PHHEALTH",
    companyName: "PhilHealth",
    status: "CANCELLED",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 14,
    queueNumber: 14,
    patientId: "P-2024-00742",
    patientName: "CASTILLO, KATRINA MAE",
    companyCode: "CASH",
    companyName: "Cash / Walk-in",
    status: "NO_SHOW",
    priorityLevel: 0,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
  },
];

// ── Status config ────────────────────────────────────────────
const STATUS_CONFIG: Record<
  QueueStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  WAITING: {
    label: "Waiting",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  NO_SHOW: {
    label: "No Show",
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
};

const FILTER_TABS: { key: QueueStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "WAITING", label: "Waiting" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

// ── Helpers ──────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Main Component ───────────────────────────────────────────
export function QueueClient() {
  const [queue, setQueue] = useState<QueueEntry[]>(INITIAL_QUEUE);
  const [filter, setFilter] = useState<QueueStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAddSuccess = useCallback((entry: QueueEntry) => {
    setQueue((prev) => [...prev, entry]);
  }, []);

  const filtered = useMemo(() => {
    let list = queue;
    if (filter !== "ALL") {
      list = list.filter((q) => q.status === filter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (q) =>
          q.patientName.toLowerCase().includes(s) ||
          q.patientId.toLowerCase().includes(s) ||
          q.companyName.toLowerCase().includes(s)
      );
    }
    return list;
  }, [queue, filter, search]);

  const stats = useMemo(() => {
    return {
      waiting: queue.filter((q) => q.status === "WAITING").length,
      inProgress: queue.filter((q) => q.status === "IN_PROGRESS").length,
      completed: queue.filter((q) => q.status === "COMPLETED").length,
      total: queue.length,
    };
  }, [queue]);

  return (
    <div>
      {/* Add to Queue Modal */}
      <AddToQueueModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAddSuccess}
        currentQueueCount={queue.length}
      />

      {/* Header with Add button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Queue</h1>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            — Central Branch
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-700/25 active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add to Queue
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Waiting"
          value={stats.waiting}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
          color="amber"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
          color="emerald"
        />
        <StatCard
          label="Total Today"
          value={stats.total}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          }
          color="slate"
        />
      </div>

      {/* Filters + Search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                filter === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {tab.key !== "ALL" && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  {tab.key === "WAITING" && stats.waiting}
                  {tab.key === "IN_PROGRESS" && stats.inProgress}
                  {tab.key === "COMPLETED" && stats.completed}
                  {tab.key === "CANCELLED" &&
                    queue.filter((q) => q.status === "CANCELLED" || q.status === "NO_SHOW").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Q#</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Patient ID</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Patient Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Company / HMO</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Priority</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600">Checked In</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const sc = STATUS_CONFIG[q.status];
                  return (
                    <tr key={q.id} className="transition-colors hover:bg-slate-50/60">
                      {/* Queue Number */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                          {q.queueNumber}
                        </span>
                      </td>

                      {/* Patient ID */}
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                        {q.patientId}
                      </td>

                      {/* Patient Name */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                        {q.patientName}
                      </td>

                      {/* Company */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 items-center rounded bg-slate-100 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {q.companyCode}
                          </span>
                          <span className="text-xs text-slate-400">{q.companyName}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${sc.bg} ${sc.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="whitespace-nowrap px-4 py-3">
                        {q.priorityLevel === 1 ? (
                          <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            PRIORITY
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Normal</span>
                        )}
                      </td>

                      {/* Checked In */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <div>
                          <span className="text-xs text-slate-700">{formatTime(q.createdAt)}</span>
                          <span className="ml-2 text-[11px] text-slate-400">{timeAgo(q.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {q.status === "WAITING" && (
                            <button className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100">
                              Start
                            </button>
                          )}
                          {q.status === "IN_PROGRESS" && (
                            <button className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100">
                              Complete
                            </button>
                          )}
                          <button className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3">
          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {queue.length} patients
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
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

// ── Stat Card ────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const styles: Record<string, { card: string; icon: string; value: string }> = {
    amber: {
      card: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50",
      icon: "bg-amber-100 text-amber-600",
      value: "text-amber-700",
    },
    blue: {
      card: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
      icon: "bg-blue-100 text-blue-600",
      value: "text-blue-700",
    },
    emerald: {
      card: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50",
      icon: "bg-emerald-100 text-emerald-600",
      value: "text-emerald-700",
    },
    slate: {
      card: "border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100",
      icon: "bg-slate-200 text-slate-600",
      value: "text-slate-700",
    },
  };

  const s = styles[color] || styles.slate;

  return (
    <div className={`rounded-xl border p-4 ${s.card}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.icon}`}>
          {icon}
        </div>
      </div>
      <p className={`mt-2 text-3xl font-bold ${s.value}`}>{value}</p>
    </div>
  );
}
