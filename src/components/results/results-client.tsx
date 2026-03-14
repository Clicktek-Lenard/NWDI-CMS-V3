"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  FlaskConical,
  ScanLine,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface AccessionRow {
  id: number;
  idTransaction: number | null;
  accessionNo: string;
  itemCode: string;
  itemDescription: string;
  itemGroup: string;
  type: string;
  status: number;
  statusName: string;
  receivedBU: string;
  examDate: string | null;
}

interface QueueRow {
  id: number;
  code: string;
  patientName: string;
  patientType: string;
  status: number;
  statusName: string;
  dateTime: string;
  accessions: AccessionRow[];
}

/* ─── Status helpers ─────────────────────────────────────────────────────── */

function StatusBadge({ status, name }: { status: number; name: string }) {
  let cls = "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  if (status >= 311 && status < 360) cls = "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
  else if (status === 360) cls = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  else if (status === 210 || status === 205) cls = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  else if (status >= 877) cls = "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", cls)}>
      {name || String(status)}
    </span>
  );
}

/* ─── Tabs ───────────────────────────────────────────────────────────────── */

type Tab = "monitoring" | "receiving";

/* ─── Main component ─────────────────────────────────────────────────────── */

export function ResultsClient() {
  const today = new Date().toLocaleDateString("en-CA");
  const [date, setDate]   = useState(today);
  const [tab, setTab]     = useState<Tab>("monitoring");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Map<number, Set<number>>>(new Map()); // queueId → Set<accessionId>
  const queryClient = useQueryClient();

  /* ── Data ── */
  const { data, isLoading, refetch, isFetching } = useQuery<{ queues: QueueRow[] }>({
    queryKey: ["results", date],
    queryFn: () => apiFetch(`/api/results?date=${date}`),
  });

  const receiveMutation = useMutation({
    mutationFn: ({ queueId, accessionIds, reject, rejectReason }: {
      queueId: number; accessionIds: number[]; reject: boolean; rejectReason?: string;
    }) =>
      apiFetch(`/api/results/${queueId}/receive-specimen`, {
        method: "PATCH",
        body: JSON.stringify({ accessionIds, reject, rejectReason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      setSelected(new Map());
    },
  });

  /* ── Derived data ── */
  const allQueues       = data?.queues ?? [];
  const monitoringRows  = allQueues;
  const receivingQueues = allQueues.filter((q) =>
    q.accessions.some((a) => a.status === 360)
  );

  /* ── Expand/collapse ── */
  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Selection helpers ── */
  const toggleAccession = (queueId: number, accId: number) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const set  = new Set(next.get(queueId) ?? []);
      set.has(accId) ? set.delete(accId) : set.add(accId);
      next.set(queueId, set);
      return next;
    });
  };

  const selectAll360 = (queueId: number, accessions: AccessionRow[]) => {
    setSelected((prev) => {
      const next = new Map(prev);
      next.set(queueId, new Set(accessions.filter((a) => a.status === 360).map((a) => a.id)));
      return next;
    });
  };

  const handleReceive = useCallback((queueId: number, reject = false) => {
    const ids = Array.from(selected.get(queueId) ?? []);
    if (ids.length === 0) return;
    receiveMutation.mutate({ queueId, accessionIds: ids, reject });
  }, [selected, receiveMutation]);

  /* ── Render ── */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Results Monitoring</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Specimen receiving and results tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {(["monitoring", "receiving"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            )}
          >
            {t === "monitoring" ? "Monitoring" : `Specimen Receiving${receivingQueues.length > 0 ? ` (${receivingQueues.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      )}

      {/* ── MONITORING TAB ── */}
      {!isLoading && tab === "monitoring" && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {monitoringRows.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No paid queues for {date}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Queue Code</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Patient</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Accessions</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {monitoringRows.map((q) => (
                  <>
                    <tr
                      key={q.id}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={() => toggleExpand(q.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {expanded.has(q.id)
                            ? <ChevronDown className="h-4 w-4 text-slate-400" />
                            : <ChevronRight className="h-4 w-4 text-slate-400" />}
                          {q.code}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{q.patientName}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={q.status} name={q.statusName} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {q.accessions.map((a) => (
                            <span key={a.id} className={cn(
                              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs",
                              a.type === "LAB"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                                : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                            )}>
                              {a.type === "LAB" ? <FlaskConical className="h-3 w-3" /> : <ScanLine className="h-3 w-3" />}
                              {a.accessionNo || "—"}
                            </span>
                          ))}
                          {q.accessions.length === 0 && <span className="text-xs text-slate-400">No accession</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(q.dateTime).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                    {/* Expanded accession detail */}
                    {expanded.has(q.id) && q.accessions.length > 0 && (
                      <tr key={`${q.id}-detail`}>
                        <td colSpan={5} className="bg-slate-50 px-8 pb-3 dark:bg-slate-900/40">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-slate-500">
                                <th className="py-1 text-left">Accession No</th>
                                <th className="py-1 text-left">Item</th>
                                <th className="py-1 text-left">Type</th>
                                <th className="py-1 text-left">Status</th>
                                <th className="py-1 text-left">Received At</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              {q.accessions.map((a) => (
                                <tr key={a.id}>
                                  <td className="py-1 font-mono">{a.accessionNo || "—"}</td>
                                  <td className="py-1">{a.itemDescription}</td>
                                  <td className="py-1">{a.type}</td>
                                  <td className="py-1"><StatusBadge status={a.status} name={a.statusName} /></td>
                                  <td className="py-1 text-slate-500">{a.examDate ? new Date(a.examDate).toLocaleDateString("en-PH") : "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── SPECIMEN RECEIVING TAB ── */}
      {!isLoading && tab === "receiving" && (
        <div className="space-y-3">
          {receivingQueues.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white py-12 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              No queues awaiting specimen receiving for {date}
            </div>
          ) : (
            receivingQueues.map((q) => {
              const pending360 = q.accessions.filter((a) => a.status === 360);
              const sel        = selected.get(q.id) ?? new Set<number>();
              const allSelected = pending360.length > 0 && pending360.every((a) => sel.has(a.id));
              const busy = receiveMutation.isPending;

              return (
                <div key={q.id} className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  {/* Queue header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                    <div>
                      <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">{q.code}</span>
                      <span className="ml-3 text-sm text-slate-600 dark:text-slate-400">{q.patientName}</span>
                      <span className="ml-2 text-xs text-slate-400">{q.patientType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={q.status} name={q.statusName} />
                      <button
                        onClick={() => selectAll360(q.id, q.accessions)}
                        className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => handleReceive(q.id, false)}
                        disabled={sel.size === 0 || busy}
                        className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Receive ({sel.size})
                      </button>
                      <button
                        onClick={() => handleReceive(q.id, true)}
                        disabled={sel.size === 0 || busy}
                        className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject ({sel.size})
                      </button>
                    </div>
                  </div>

                  {/* Accession rows */}
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/40">
                      <tr>
                        <th className="w-10 px-4 py-2 text-left">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => allSelected
                              ? setSelected((p) => { const n = new Map(p); n.delete(q.id); return n; })
                              : selectAll360(q.id, q.accessions)
                            }
                            className="rounded"
                          />
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Accession No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {q.accessions.map((a) => {
                        const isReceivable = a.status === 360;
                        const isChecked    = sel.has(a.id);
                        return (
                          <tr
                            key={a.id}
                            className={cn(
                              "transition-colors",
                              isReceivable ? "hover:bg-slate-50 dark:hover:bg-slate-700/40" : "opacity-60"
                            )}
                          >
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={!isReceivable}
                                onChange={() => toggleAccession(q.id, a.id)}
                                className="rounded"
                              />
                            </td>
                            <td className="px-4 py-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                              {a.accessionNo || "—"}
                            </td>
                            <td className="px-4 py-2 text-slate-700 dark:text-slate-200">{a.itemDescription}</td>
                            <td className="px-4 py-2">
                              <span className={cn(
                                "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
                                a.type === "LAB"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                                  : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                              )}>
                                {a.type === "LAB" ? <FlaskConical className="h-3 w-3" /> : <ScanLine className="h-3 w-3" />}
                                {a.type}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {a.status === 360 && (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                  <Clock className="h-3 w-3" /> Awaiting
                                </span>
                              )}
                              {a.status === 311 && (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                  <CheckCircle className="h-3 w-3" /> Received
                                </span>
                              )}
                              {a.status >= 877 && (
                                <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                  <XCircle className="h-3 w-3" /> Rejected
                                </span>
                              )}
                              {![360, 311].includes(a.status) && a.status < 877 && (
                                <StatusBadge status={a.status} name={a.statusName} />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
