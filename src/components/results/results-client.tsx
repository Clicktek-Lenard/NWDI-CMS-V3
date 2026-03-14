"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown, ChevronRight, FlaskConical, ScanLine,
  CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle,
  Microscope, Radio,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface AccessionRow {
  id: number;
  idTransaction: number | null;
  accessionNo: string;
  itemCode: string;
  itemDescription: string;
  itemGroup: string;
  itemSubGroup: string;
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

type ItemStatus = "received" | "waived" | "rejected" | "refused" | "doneOutside";
type MainTab    = "monitoring" | "blood" | "specimen" | "imaging";

interface TubeCount { purple: number; yellow: number; blue: number; red: number; gray: number; }
interface ItemDraft { status: ItemStatus; notes: string; tubes: TubeCount; }

/* ─── Station config ─────────────────────────────────────────────────────── */

const STATIONS: Record<MainTab, { label: string; groups: string[]; icon: React.ReactNode }> = {
  monitoring: { label: "Monitoring",        groups: [],                                          icon: <CheckCircle className="h-4 w-4" /> },
  blood:      { label: "Blood Extraction",  groups: ["HEMATOLOGY","CHEMISTRY","IMMUNOLOGY"],    icon: <FlaskConical className="h-4 w-4" /> },
  specimen:   { label: "Specimen",          groups: ["MICROSCOPY","MICROBIOLOGY"],               icon: <Microscope   className="h-4 w-4" /> },
  imaging:    { label: "Imaging",           groups: ["XRAY","ECG"],                              icon: <Radio        className="h-4 w-4" /> },
};

function stationAccessions(accessions: AccessionRow[], tab: MainTab) {
  const groups = STATIONS[tab].groups;
  if (groups.length === 0) return accessions;
  return accessions.filter(a =>
    groups.includes((a.itemSubGroup || a.itemGroup || "").toUpperCase())
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const ITEM_STATUS_OPTIONS: { value: ItemStatus; label: string; color: string }[] = [
  { value: "received",    label: "Received",    color: "text-green-600 dark:text-green-400" },
  { value: "waived",      label: "Waived",      color: "text-blue-600 dark:text-blue-400"  },
  { value: "rejected",    label: "Rejected",    color: "text-red-600 dark:text-red-400"    },
  { value: "refused",     label: "Refused",     color: "text-orange-600 dark:text-orange-400" },
  { value: "doneOutside", label: "Done Outside", color: "text-purple-600 dark:text-purple-400" },
];

const TUBE_COLORS: { key: keyof TubeCount; label: string; dot: string }[] = [
  { key: "purple", label: "Purple", dot: "bg-purple-500" },
  { key: "yellow", label: "Yellow", dot: "bg-yellow-400" },
  { key: "blue",   label: "Blue",   dot: "bg-blue-500"   },
  { key: "red",    label: "Red",    dot: "bg-red-500"    },
  { key: "gray",   label: "Gray",   dot: "bg-slate-400"  },
];

function defaultDraft(): ItemDraft {
  return { status: "received", notes: "", tubes: { purple: 0, yellow: 0, blue: 0, red: 0, gray: 0 } };
}

function StatusBadge({ status, name }: { status: number; name: string }) {
  let cls = "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  if (status === 311)              cls = "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
  else if (status === 360)         cls = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  else if (status === 210 || status === 205) cls = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  else if (status >= 877)          cls = "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  else if (status === 888)         cls = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", cls)}>
      {name || String(status)}
    </span>
  );
}

function accessionStatusIcon(status: number) {
  if (status === 311)  return <CheckCircle  className="h-3.5 w-3.5 text-green-500" />;
  if (status === 360)  return <Clock        className="h-3.5 w-3.5 text-amber-500" />;
  if (status >= 877)   return <XCircle      className="h-3.5 w-3.5 text-red-500"   />;
  if (status === 888)  return <AlertTriangle className="h-3.5 w-3.5 text-blue-500" />;
  return null;
}

/* ─── Tube Selector ──────────────────────────────────────────────────────── */

function TubeSelector({ tubes, onChange }: {
  tubes: TubeCount;
  onChange: (t: TubeCount) => void;
}) {
  return (
    <div className="mt-1 flex flex-wrap gap-2">
      {TUBE_COLORS.map(({ key, label, dot }) => (
        <label key={key} className="flex items-center gap-1.5 text-xs">
          <span className={cn("inline-block h-3 w-3 rounded-full", dot)} />
          <span className="text-slate-600 dark:text-slate-400">{label}</span>
          <input
            type="number"
            min={0}
            max={9}
            value={tubes[key]}
            onChange={(e) => onChange({ ...tubes, [key]: Math.max(0, Number(e.target.value)) })}
            className="w-10 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-center text-xs dark:border-slate-600 dark:bg-slate-800"
          />
        </label>
      ))}
    </div>
  );
}

/* ─── Item Edit Row ──────────────────────────────────────────────────────── */

function ItemEditRow({
  acc, draft, checked, isHematology,
  onCheck, onStatusChange, onNotesChange, onTubesChange,
}: {
  acc: AccessionRow;
  draft: ItemDraft;
  checked: boolean;
  isHematology: boolean;
  onCheck: () => void;
  onStatusChange: (s: ItemStatus) => void;
  onNotesChange: (n: string) => void;
  onTubesChange: (t: TubeCount) => void;
}) {
  const isEditable = acc.status === 360;
  return (
    <div className={cn(
      "rounded-lg border p-3 transition-colors",
      checked
        ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
        : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800",
      !isEditable && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={!isEditable}
          onChange={onCheck}
          className="mt-0.5 rounded"
        />
        <div className="min-w-0 flex-1 space-y-2">
          {/* Item header */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
              {acc.accessionNo || acc.itemCode}
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-200">{acc.itemDescription}</span>
            <span className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
              acc.type === "LAB"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
            )}>
              {acc.itemSubGroup || acc.itemGroup}
            </span>
            {!isEditable && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                {accessionStatusIcon(acc.status)}
                {acc.statusName}
              </span>
            )}
          </div>

          {/* Controls — only if editable and checked */}
          {isEditable && checked && (
            <div className="space-y-2 pt-1">
              {/* Status selector */}
              <div className="flex flex-wrap gap-1.5">
                {ITEM_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onStatusChange(opt.value)}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                      draft.status === opt.value
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Notes */}
              <input
                type="text"
                placeholder="Notes (optional)"
                value={draft.notes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />

              {/* Tubes — only for HEMATOLOGY + received status */}
              {isHematology && draft.status === "received" && (
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">Tubes</p>
                  <TubeSelector tubes={draft.tubes} onChange={onTubesChange} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Receiving Panel ────────────────────────────────────────────────────── */

function ReceivingPanel({
  queues, tab, date,
}: {
  queues: QueueRow[];
  tab: MainTab;
  date: string;
}) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  // drafts: queueId → accId → ItemDraft
  const [drafts, setDrafts]   = useState<Map<number, Map<number, ItemDraft>>>(new Map());
  // checked: queueId → Set<accId>
  const [checked, setChecked] = useState<Map<number, Set<number>>>(new Map());

  const mutation = useMutation({
    mutationFn: ({ queueId, items }: { queueId: number; items: { id: number; status: ItemStatus; notes: string; tubes?: TubeCount }[] }) =>
      apiFetch(`/api/results/${queueId}/receive-specimen`, {
        method: "PATCH",
        body: JSON.stringify({ items }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results", date] });
      setChecked(new Map());
      setDrafts(new Map());
    },
  });

  const awaitingQueues  = queues.filter(q => stationAccessions(q.accessions, tab).some(a => a.status === 360));
  const processedQueues = queues.filter(q => {
    const sta = stationAccessions(q.accessions, tab);
    return sta.length > 0 && sta.every(a => a.status !== 360);
  });

  function toggleExpand(id: number) {
    setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function getDraft(queueId: number, accId: number): ItemDraft {
    return drafts.get(queueId)?.get(accId) ?? defaultDraft();
  }

  function setDraft(queueId: number, accId: number, patch: Partial<ItemDraft>) {
    setDrafts(p => {
      const n = new Map(p);
      const qm = new Map(n.get(queueId) ?? []);
      qm.set(accId, { ...getDraft(queueId, accId), ...patch });
      n.set(queueId, qm);
      return n;
    });
  }

  function isChecked(queueId: number, accId: number) {
    return checked.get(queueId)?.has(accId) ?? false;
  }

  function toggleCheck(queueId: number, accId: number) {
    setChecked(p => {
      const n  = new Map(p);
      const s  = new Set(n.get(queueId) ?? []);
      s.has(accId) ? s.delete(accId) : s.add(accId);
      n.set(queueId, s);
      return n;
    });
  }

  function selectAll(queueId: number, accs: AccessionRow[]) {
    setChecked(p => {
      const n = new Map(p);
      n.set(queueId, new Set(accs.filter(a => a.status === 360).map(a => a.id)));
      return n;
    });
  }

  function handleSubmit(q: QueueRow) {
    const stationAcc = stationAccessions(q.accessions, tab);
    const sel = checked.get(q.id) ?? new Set<number>();
    const items = stationAcc
      .filter(a => sel.has(a.id))
      .map(a => {
        const d = getDraft(q.id, a.id);
        return { id: a.id, status: d.status, notes: d.notes, tubes: d.tubes };
      });
    if (items.length === 0) return;
    mutation.mutate({ queueId: q.id, items });
  }

  if (awaitingQueues.length === 0 && processedQueues.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No {STATIONS[tab].label.toLowerCase()} queues for {date}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* ── LEFT: Awaiting ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Awaiting Receiving
          {awaitingQueues.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {awaitingQueues.length}
            </span>
          )}
        </h3>

        {awaitingQueues.length === 0 && (
          <p className="text-sm text-slate-400">All specimens received.</p>
        )}

        <div className="space-y-3">
          {awaitingQueues.map(q => {
            const stationAcc = stationAccessions(q.accessions, tab);
            const pending    = stationAcc.filter(a => a.status === 360);
            const sel        = checked.get(q.id) ?? new Set<number>();
            const isOpen     = expanded.has(q.id);

            return (
              <div key={q.id} className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                {/* Queue row */}
                <button
                  className="flex w-full items-center gap-2 px-4 py-3 text-left"
                  onClick={() => toggleExpand(q.id)}
                >
                  {isOpen
                    ? <ChevronDown  className="h-4 w-4 shrink-0 text-slate-400" />
                    : <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">{q.code}</span>
                      <span className="truncate text-sm text-slate-700 dark:text-slate-200">{q.patientName}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {pending.length} item{pending.length !== 1 ? "s" : ""} pending · {new Date(q.dateTime).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <StatusBadge status={q.status} name={q.statusName} />
                </button>

                {/* Expanded items */}
                {isOpen && (
                  <div className="border-t border-slate-100 px-4 pb-4 pt-3 dark:border-slate-700">
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        onClick={() => selectAll(q.id, stationAcc)}
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Select all pending
                      </button>
                      <button
                        onClick={() => handleSubmit(q)}
                        disabled={sel.size === 0 || mutation.isPending}
                        className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Submit ({sel.size})
                      </button>
                    </div>

                    <div className="space-y-2">
                      {stationAcc.map(acc => {
                        const isHema = (acc.itemSubGroup || "").toUpperCase() === "HEMATOLOGY";
                        return (
                          <ItemEditRow
                            key={acc.id}
                            acc={acc}
                            draft={getDraft(q.id, acc.id)}
                            checked={isChecked(q.id, acc.id)}
                            isHematology={isHema}
                            onCheck={() => toggleCheck(q.id, acc.id)}
                            onStatusChange={(s) => setDraft(q.id, acc.id, { status: s })}
                            onNotesChange={(n) => setDraft(q.id, acc.id, { notes: n })}
                            onTubesChange={(t) => setDraft(q.id, acc.id, { tubes: t })}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: Already received ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Received Today
          {processedQueues.length > 0 && (
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
              {processedQueues.length}
            </span>
          )}
        </h3>

        {processedQueues.length === 0 && (
          <p className="text-sm text-slate-400">No received items yet today.</p>
        )}

        <div className="space-y-2">
          {processedQueues.map(q => {
            const stationAcc = stationAccessions(q.accessions, tab);
            return (
              <div key={q.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">{q.code}</span>
                  <span className="truncate text-sm text-slate-600 dark:text-slate-300">{q.patientName}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {stationAcc.map(a => (
                    <span key={a.id} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {accessionStatusIcon(a.status)}
                      <span className="font-mono">{a.accessionNo || a.itemCode}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export function ResultsClient() {
  const today = new Date().toLocaleDateString("en-CA");
  const [date, setDate] = useState(today);
  const [tab, setTab]   = useState<MainTab>("monitoring");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const { data, isLoading, refetch, isFetching } = useQuery<{ queues: QueueRow[] }>({
    queryKey: ["results", date],
    queryFn: () => apiFetch(`/api/results?date=${date}`),
  });

  const allQueues = data?.queues ?? [];

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
      <div className="flex flex-wrap gap-0 border-b border-slate-200 dark:border-slate-700">
        {(Object.keys(STATIONS) as MainTab[]).map((t) => {
          const stationQueues = t === "monitoring" ? allQueues : allQueues.filter(q => stationAccessions(q.accessions, t).length > 0);
          const pending       = t !== "monitoring" ? stationQueues.filter(q => stationAccessions(q.accessions, t).some(a => a.status === 360)).length : 0;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              )}
            >
              {STATIONS[t].icon}
              {STATIONS[t].label}
              {pending > 0 && (
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  {pending}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      )}

      {/* ── MONITORING TAB ── */}
      {!isLoading && tab === "monitoring" && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {allQueues.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No paid queues for {date}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Queue Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Accessions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {allQueues.map((q) => (
                  <>
                    <tr
                      key={q.id}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={() => setExpanded(p => { const n = new Set(p); n.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; })}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {expanded.has(q.id) ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                          {q.code}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{q.patientName}</td>
                      <td className="px-4 py-3"><StatusBadge status={q.status} name={q.statusName} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {q.accessions.map(a => (
                            <span key={a.id} className={cn(
                              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs",
                              a.type === "LAB" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                            )}>
                              {a.type === "LAB" ? <FlaskConical className="h-3 w-3" /> : <ScanLine className="h-3 w-3" />}
                              {a.accessionNo || "—"}
                            </span>
                          ))}
                          {q.accessions.length === 0 && <span className="text-xs text-slate-400">No accession</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(q.dateTime).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                    {expanded.has(q.id) && q.accessions.length > 0 && (
                      <tr key={`${q.id}-detail`}>
                        <td colSpan={5} className="bg-slate-50 px-8 pb-3 dark:bg-slate-900/40">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-slate-500 dark:text-slate-400">
                                <th className="py-1 text-left font-medium">Accession No</th>
                                <th className="py-1 text-left font-medium">Item</th>
                                <th className="py-1 text-left font-medium">Sub-group</th>
                                <th className="py-1 text-left font-medium">Status</th>
                                <th className="py-1 text-left font-medium">Received</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              {q.accessions.map(a => (
                                <tr key={a.id}>
                                  <td className="py-1 font-mono">{a.accessionNo || "—"}</td>
                                  <td className="py-1">{a.itemDescription}</td>
                                  <td className="py-1">{a.itemSubGroup || a.itemGroup}</td>
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

      {/* ── STATION TABS ── */}
      {!isLoading && tab !== "monitoring" && (
        <ReceivingPanel queues={allQueues} tab={tab} date={date} />
      )}
    </div>
  );
}
