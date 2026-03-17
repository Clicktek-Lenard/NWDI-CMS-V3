"use client";

import { useState, useEffect, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown, ChevronRight, FlaskConical, ScanLine,
  CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle,
  Microscope, Radio, PackageOpen, ClipboardEdit, ShieldCheck, X, Mail, Send,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useCreateSendout, useSendouts, useSendoutSummary, useReceiveSendout, useCompleteSendout } from "@/hooks/use-sendouts";

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
  resultFlag: string | null;
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
type MainTab    = "monitoring" | "blood" | "specimen" | "imaging" | "releasing" | "sendout";

interface TubeCount { purple: number; yellow: number; blue: number; red: number; gray: number; }
interface ItemDraft { status: ItemStatus; notes: string; tubes: TubeCount; }

/* ─── Station config ─────────────────────────────────────────────────────── */

const STATIONS: Record<MainTab, { label: string; groups: string[]; icon: React.ReactNode }> = {
  monitoring: { label: "Monitoring",        groups: [],                                          icon: <CheckCircle  className="h-4 w-4" /> },
  blood:      { label: "Blood Extraction",  groups: ["HEMATOLOGY","CHEMISTRY","IMMUNOLOGY"],    icon: <FlaskConical className="h-4 w-4" /> },
  specimen:   { label: "Specimen",          groups: ["MICROSCOPY","MICROBIOLOGY"],               icon: <Microscope   className="h-4 w-4" /> },
  imaging:    { label: "Imaging",           groups: ["XRAY","ECG"],                              icon: <Radio        className="h-4 w-4" /> },
  releasing:  { label: "Releasing",         groups: [],                                          icon: <PackageOpen  className="h-4 w-4" /> },
  sendout:    { label: "Branch Sendout",    groups: [],                                          icon: <ScanLine     className="h-4 w-4" /> },
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

/* ─── Imaging Encoding Modal ─────────────────────────────────────────────── */

interface ImagingDraft {
  accessionId:    number;
  accessionNo:    string;
  itemDescription:string;
  interpretation: string;
  impression:     string;
  radiologistName:string;
}

function ImagingModal({ queue, onClose, onSaved }: {
  queue: QueueRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const imagingAccessions = queue.accessions.filter((a) =>
    ["XRAY", "ECG", "IMAGING", "RADIOLOGY"].includes((a.itemSubGroup || a.itemGroup || "").toUpperCase())
  );
  const [drafts, setDrafts] = useState<Record<number, ImagingDraft>>(() => {
    const init: Record<number, ImagingDraft> = {};
    for (const a of imagingAccessions) {
      init[a.id] = { accessionId: a.id, accessionNo: a.accessionNo, itemDescription: a.itemDescription, interpretation: "", impression: "", radiologistName: "" };
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateDraft(id: number, field: keyof ImagingDraft, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      await Promise.all(
        Object.values(drafts)
          .filter((d) => d.interpretation.trim() || d.impression.trim())
          .map((d) =>
            apiFetch(`/api/results/${queue.id}/imaging-encode`, {
              method: "POST",
              body: JSON.stringify({
                accession_id:     d.accessionId,
                item_description: d.itemDescription,
                interpretation:   d.interpretation || null,
                impression:       d.impression || null,
                radiologist_name: d.radiologistName || null,
              }),
            })
          )
      );
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-900" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Encode Imaging Results</h3>
            <p className="text-xs text-slate-500">{queue.code} — {queue.patientName}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4">
          {imagingAccessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No imaging accessions found for this queue.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Radiologist / Physician</label>
                <input
                  type="text"
                  value={drafts[imagingAccessions[0]?.id]?.radiologistName ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDrafts((prev) => {
                      const updated = { ...prev };
                      for (const k of Object.keys(updated)) updated[Number(k)] = { ...updated[Number(k)], radiologistName: v };
                      return updated;
                    });
                  }}
                  placeholder="Dr. Name"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              {imagingAccessions.map((a) => {
                const d = drafts[a.id];
                if (!d) return null;
                return (
                  <div key={a.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="mb-3 flex items-center gap-2">
                      <Radio className="h-4 w-4 text-sky-500" />
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{a.accessionNo}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{a.itemDescription}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Interpretation / Findings</label>
                        <textarea
                          value={d.interpretation}
                          onChange={(e) => updateDraft(a.id, "interpretation", e.target.value)}
                          rows={3}
                          placeholder="Radiological findings..."
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Impression / Conclusion</label>
                        <textarea
                          value={d.impression}
                          onChange={(e) => updateDraft(a.id, "impression", e.target.value)}
                          rows={2}
                          placeholder="Impression..."
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ClipboardEdit className="h-4 w-4" />}
            Save Imaging
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Encoding Modal ─────────────────────────────────────────────────────── */

interface ResultDraft {
  accessionId: number;
  accessionNo: string;
  itemDescription: string;
  resultValue: string;
  resultUnit: string;
  normalRange: string;
  flag: "" | "H" | "L" | "C";
  remarks: string;
}

const FLAG_ROW_STYLE: Record<string, string> = {
  H: "border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20",
  L: "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20",
  C: "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20",
};
const FLAG_BADGE_STYLE: Record<string, string> = {
  H: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  L: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  C: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};
const FLAG_LABEL: Record<string, string> = { H: "H — High", L: "L — Low", C: "C — Critical" };

function EncodingModal({ queue, onClose, onSaved }: {
  queue: QueueRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const labAccessions = queue.accessions.filter((a) => a.type === "LAB");
  const [drafts, setDrafts] = useState<Record<number, ResultDraft>>(() => {
    const init: Record<number, ResultDraft> = {};
    for (const a of labAccessions) {
      init[a.id] = { accessionId: a.id, accessionNo: a.accessionNo, itemDescription: a.itemDescription, resultValue: "", resultUnit: "", normalRange: "", flag: "", remarks: "" };
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing encoded values on mount and pre-populate drafts
  const { data: existingData } = useQuery<{ data: Array<{ accessionId: number; resultValue: string | null; resultUnit: string | null; normalRange: string | null; flag: string | null; remarks: string | null }> }>({
    queryKey: ["encode", queue.id],
    queryFn: () => apiFetch(`/api/results/${queue.id}/encode`),
    staleTime: 0,
  });
  useEffect(() => {
    if (!existingData?.data?.length) return;
    setDrafts((prev) => {
      const next = { ...prev };
      for (const ev of existingData.data) {
        if (next[ev.accessionId]) {
          next[ev.accessionId] = {
            ...next[ev.accessionId],
            resultValue: ev.resultValue ?? "",
            resultUnit:  ev.resultUnit  ?? "",
            normalRange: ev.normalRange ?? "",
            flag:        (ev.flag as "" | "H" | "L" | "C") ?? "",
            remarks:     ev.remarks     ?? "",
          };
        }
      }
      return next;
    });
  }, [existingData]);

  function updateDraft(id: number, field: keyof ResultDraft, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      await Promise.all(
        Object.values(drafts)
          .filter((d) => d.resultValue.trim())
          .map((d) =>
            apiFetch(`/api/results/${queue.id}/encode`, {
              method: "POST",
              body: JSON.stringify({
                accession_id:     d.accessionId,
                item_description: d.itemDescription,
                result_value:     d.resultValue,
                result_unit:      d.resultUnit || null,
                normal_range:     d.normalRange || null,
                flag:             d.flag || null,
                remarks:          d.remarks || null,
              }),
            })
          )
      );
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-900" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Encode Lab Results
            </h3>
            <p className="text-xs text-slate-500">{queue.code} — {queue.patientName}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4">
          {labAccessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No lab accessions found for this queue.</p>
          ) : (
            <div className="space-y-4">
              {labAccessions.map((a) => {
                const d = drafts[a.id];
                if (!d) return null;
                return (
                  <div key={a.id} className={cn("rounded-xl border p-4 transition-colors", d.flag ? FLAG_ROW_STYLE[d.flag] : "border-slate-200 dark:border-slate-700")}>
                    <div className="mb-3 flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-purple-500" />
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{a.accessionNo}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{a.itemDescription}</span>
                      {d.flag && (
                        <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold", FLAG_BADGE_STYLE[d.flag])}>
                          {FLAG_LABEL[d.flag]}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Result Value</label>
                        <input
                          type="text"
                          value={d.resultValue}
                          onChange={(e) => updateDraft(a.id, "resultValue", e.target.value)}
                          placeholder="e.g. 12.5"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Unit</label>
                        <input
                          type="text"
                          value={d.resultUnit}
                          onChange={(e) => updateDraft(a.id, "resultUnit", e.target.value)}
                          placeholder="g/dL"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Flag</label>
                        <select
                          value={d.flag}
                          onChange={(e) => updateDraft(a.id, "flag", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        >
                          <option value="">Normal</option>
                          <option value="H">H — High</option>
                          <option value="L">L — Low</option>
                          <option value="C">C — Critical</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Normal Range</label>
                        <input
                          type="text"
                          value={d.normalRange}
                          onChange={(e) => updateDraft(a.id, "normalRange", e.target.value)}
                          placeholder="e.g. 12.0–16.0"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Remarks</label>
                        <input
                          type="text"
                          value={d.remarks}
                          onChange={(e) => updateDraft(a.id, "remarks", e.target.value)}
                          placeholder="Optional"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ClipboardEdit className="h-4 w-4" />}
            Save Results
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Releasing Panel ────────────────────────────────────────────────────── */

function ReleasingPanel({ queues, date }: { queues: QueueRow[]; date: string }) {
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [encodingQueue, setEncodingQueue] = useState<QueueRow | null>(null);
  const [imagingQueue, setImagingQueue]   = useState<QueueRow | null>(null);
  const [emailQueue, setEmailQueue]       = useState<QueueRow | null>(null);
  const [emailAddress, setEmailAddress]   = useState("");

  const mutation = useMutation({
    mutationFn: (queueId: number) =>
      apiFetch(`/api/results/${queueId}/release`, { method: "PATCH" }),
    onMutate: (id) => setLoadingId(id),
    onSettled: () => setLoadingId(null),
    onSuccess: (_, id) => {
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 2000);
      queryClient.invalidateQueries({ queryKey: ["results", date] });
    },
  });

  const validateMutation = useMutation({
    mutationFn: (queueId: number) =>
      apiFetch(`/api/results/${queueId}/validate`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["results", date] }),
  });

  const emailMutation = useMutation({
    mutationFn: ({ queueId, email }: { queueId: number; email: string }) =>
      apiFetch(`/api/results/${queueId}/send-email`, { method: "POST", body: JSON.stringify({ email }) }),
    onSuccess: () => {
      setEmailQueue(null);
      setEmailAddress("");
    },
  });

  const awaitingQueues = queues.filter((q) => q.status >= 311 && q.status < 500);
  const releasedQueues = queues.filter((q) => q.status >= 500 && q.status < 650);

  if (awaitingQueues.length === 0 && releasedQueues.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No queues pending release for {date}
      </p>
    );
  }

  return (
    <>
    {encodingQueue && (
      <EncodingModal
        queue={encodingQueue}
        onClose={() => setEncodingQueue(null)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["results", date] })}
      />
    )}
    {imagingQueue && (
      <ImagingModal
        queue={imagingQueue}
        onClose={() => setImagingQueue(null)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["results", date] })}
      />
    )}
    {emailQueue && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Send Lab Results by Email
            </h3>
            <button onClick={() => { setEmailQueue(null); setEmailAddress(""); }}>
              <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            Patient: <span className="font-medium text-slate-700 dark:text-slate-200">{emailQueue.patientName}</span>
          </p>
          <input
            type="email"
            placeholder="patient@email.com"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          {emailMutation.isError && (
            <p className="mb-3 text-xs text-red-600">
              {emailMutation.error instanceof Error ? emailMutation.error.message : "Failed to send"}
            </p>
          )}
          {emailMutation.isSuccess && (
            <p className="mb-3 text-xs text-green-600">Email sent successfully.</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setEmailQueue(null); setEmailAddress(""); }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={() => emailMutation.mutate({ queueId: emailQueue.id, email: emailAddress })}
              disabled={!emailAddress || emailMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {emailMutation.isPending
                ? <RefreshCw className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />}
              Send
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* ── LEFT: Awaiting Release ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Awaiting Release
          {awaitingQueues.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {awaitingQueues.length}
            </span>
          )}
        </h3>

        {awaitingQueues.length === 0 && (
          <p className="text-sm text-slate-400">All results released.</p>
        )}

        <div className="space-y-2">
          {awaitingQueues.map((q) => (
            <div
              key={q.id}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
                      {q.code}
                    </span>
                    <span className="truncate text-sm text-slate-700 dark:text-slate-200">
                      {q.patientName}
                    </span>
                    <StatusBadge status={q.status} name={q.statusName} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {q.accessions.map((a) => (
                      <span
                        key={a.id}
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs",
                          a.resultFlag === "C"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-semibold"
                            : a.resultFlag === "H"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            : a.resultFlag === "L"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : a.type === "LAB"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
                        )}
                      >
                        {a.type === "LAB"
                          ? <FlaskConical className="h-3 w-3" />
                          : <ScanLine className="h-3 w-3" />}
                        {a.accessionNo || a.itemCode}
                        {a.resultFlag ? <span className="ml-0.5 font-bold">[{a.resultFlag}]</span> : null}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <a
                    href={`/api/results/${q.id}/barcode-labels`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    title="Print specimen labels"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                    </svg>
                    Labels
                  </a>
                  {q.accessions.some((a) => a.type === "LAB") && (
                    <button
                      onClick={() => setEncodingQueue(q)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      <ClipboardEdit className="h-3.5 w-3.5" />
                      Encode
                    </button>
                  )}
                  {q.accessions.some((a) => ["XRAY","ECG","IMAGING","RADIOLOGY"].includes((a.itemSubGroup || a.itemGroup || "").toUpperCase())) && (
                    <button
                      onClick={() => setImagingQueue(q)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-900/20 dark:text-sky-300"
                    >
                      <Radio className="h-3.5 w-3.5" />
                      Imaging
                    </button>
                  )}
                  <button
                    onClick={() => validateMutation.mutate(q.id)}
                    disabled={validateMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Validate
                  </button>
                  <button
                    onClick={() => mutation.mutate(q.id)}
                    disabled={loadingId === q.id}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loadingId === q.id
                      ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      : <PackageOpen className="h-3.5 w-3.5" />}
                    Release
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Released Today ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Released Today
          {releasedQueues.length > 0 && (
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
              {releasedQueues.length}
            </span>
          )}
        </h3>

        {releasedQueues.length === 0 && (
          <p className="text-sm text-slate-400">No results released yet today.</p>
        )}

        <div className="space-y-2">
          {releasedQueues.map((q) => (
            <div
              key={q.id}
              className={cn(
                "rounded-lg border px-4 py-3",
                successId === q.id
                  ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
                  {q.code}
                </span>
                <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                  {q.patientName}
                </span>
                <StatusBadge status={q.status} name={q.statusName} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1">
                {q.accessions.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="font-mono">{a.accessionNo || a.itemCode}</span>
                  </span>
                ))}
                <div className="ml-auto flex shrink-0 flex-wrap gap-1">
                  {q.accessions.some((a) => a.type === "LAB") && (
                    <a
                      href={`/api/queue/${q.id}/pdf?type=lab-result`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                    >
                      Lab PDF
                    </a>
                  )}
                  {q.accessions.some((a) => ["XRAY","ECG","IMAGING","RADIOLOGY"].includes((a.itemSubGroup || a.itemGroup || "").toUpperCase())) && (
                    <a
                      href={`/api/queue/${q.id}/pdf?type=imaging-result`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs text-sky-700 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-900/20 dark:text-sky-300"
                    >
                      Imaging PDF
                    </a>
                  )}
                  <button
                    onClick={() => { setEmailQueue(q); setEmailAddress(""); }}
                    className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    title="Send results by email"
                  >
                    <Mail className="h-3 w-3" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

/* ─── Sendout Panel ──────────────────────────────────────────────────────── */

function SendoutPanel({ queues }: { queues: QueueRow[] }) {
  const [sendoutTo, setSendoutTo] = useState<Record<number, string>>({});
  const [sendoutView, setSendoutView] = useState<"create" | "tracking">("create");
  const createSendout = useCreateSendout();
  const { data: sendouts, isLoading: sendoutsLoading } = useSendouts();
  const { data: summary } = useSendoutSummary();
  const receiveSendout = useReceiveSendout();
  const completeSendout = useCompleteSendout();

  const { data: branchData } = useQuery<{ success: boolean; data: { code: string; description: string }[] }>({
    queryKey: ["branches"],
    queryFn:  () => apiFetch("/api/results/branches"),
    staleTime: 5 * 60 * 1000,
  });
  const branches = branchData?.data ?? [];

  // Show all queues with accession items (any status), as potential sendouts
  const relevantQueues = queues.filter((q) => q.accessions.length > 0);

  const handleSendout = async (q: QueueRow) => {
    const destBranch = sendoutTo[q.id];
    if (!destBranch) return;

    const items = JSON.stringify(q.accessions.map(a => ({
      code: a.itemCode,
      description: a.itemDescription,
      type: a.type,
    })));

    await createSendout.mutateAsync({
      idQueue:     q.id,
      queueCode:   q.code,
      patientName: q.patientName,
      idBUTo:      destBranch,
      items,
    });

    // Also open the PDF
    window.open(
      `/api/queue/${q.id}/pdf?type=referral-slip&to=${encodeURIComponent(destBranch)}`,
      "_blank"
    );
  };

  const sendoutStatusLabel = (status: number) => {
    if (status === 201) return { label: "Sent",      cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" };
    if (status === 301) return { label: "Received",  cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
    if (status === 501) return { label: "Completed", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
    return { label: String(status), cls: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" };
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center dark:border-amber-800 dark:bg-amber-950">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{summary.pending}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Pending</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-800 dark:bg-blue-950">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{summary.received}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Received</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center dark:border-emerald-800 dark:bg-emerald-950">
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{summary.completed}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Completed</p>
          </div>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSendoutView("create")}
          className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            sendoutView === "create"
              ? "bg-teal-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          )}
        >
          <ScanLine className="mr-1 inline h-3.5 w-3.5" />
          New Sendout
        </button>
        <button
          onClick={() => setSendoutView("tracking")}
          className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            sendoutView === "tracking"
              ? "bg-teal-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          )}
        >
          <Send className="mr-1 inline h-3.5 w-3.5" />
          Tracking
        </button>
      </div>

      {/* Create sendout view */}
      {sendoutView === "create" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a queue and receiving branch, then click Send & Print to create a tracked sendout and generate the referral slip.
          </p>
          {relevantQueues.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No accession records for today.</p>
          ) : (
            relevantQueues.map((q) => (
              <div
                key={q.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">{q.code}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{q.patientName}</span>
                    <StatusBadge status={q.status} name={q.statusName} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {q.accessions.length} test{q.accessions.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={sendoutTo[q.id] ?? ""}
                    onChange={(e) => setSendoutTo((p) => ({ ...p, [q.id]: e.target.value }))}
                    className="w-44 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="">— Receiving branch —</option>
                    {branches.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.code} — {b.description}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSendout(q)}
                    disabled={!sendoutTo[q.id] || createSendout.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ScanLine className="h-3.5 w-3.5" />
                    Send & Print
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tracking view */}
      {sendoutView === "tracking" && (
        <div>
          {sendoutsLoading ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : !sendouts || sendouts.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No sendout records found.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Queue</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Patient</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">From</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">To</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Sent</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-600 dark:text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {sendouts.map((s) => {
                    const st = sendoutStatusLabel(s.status);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                        <td className="px-3 py-2 font-mono text-xs text-slate-700 dark:text-slate-200">{s.queueCode}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{s.patientName}</td>
                        <td className="px-3 py-2 text-xs text-slate-500">{s.idBUFrom}</td>
                        <td className="px-3 py-2 text-xs text-slate-500">{s.idBUTo}</td>
                        <td className="px-3 py-2 text-xs text-slate-500">{new Date(s.sentDate).toLocaleDateString("en-PH")}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          {s.status === 201 && (
                            <button
                              onClick={() => receiveSendout.mutate(s.id)}
                              disabled={receiveSendout.isPending}
                              className="rounded-md border border-blue-200 bg-white px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-400"
                            >
                              Receive
                            </button>
                          )}
                          {s.status === 301 && (
                            <button
                              onClick={() => completeSendout.mutate(s.id)}
                              disabled={completeSendout.isPending}
                              className="rounded-md border border-emerald-200 bg-white px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-800 dark:text-emerald-400"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
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
          const pending       = t === "releasing"
            ? allQueues.filter(q => q.status >= 311 && q.status < 500).length
            : t !== "monitoring"
              ? stationQueues.filter(q => stationAccessions(q.accessions, t).some(a => a.status === 360)).length
              : 0;
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
                  <Fragment key={q.id}>
                    <tr
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
                      <tr>
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
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── STATION TABS (receiving) ── */}
      {!isLoading && tab !== "monitoring" && tab !== "releasing" && tab !== "sendout" && (
        <ReceivingPanel queues={allQueues} tab={tab} date={date} />
      )}

      {/* ── RELEASING TAB ── */}
      {!isLoading && tab === "releasing" && (
        <ReleasingPanel queues={allQueues} date={date} />
      )}

      {/* ── SENDOUT TAB ── */}
      {!isLoading && tab === "sendout" && (
        <SendoutPanel queues={allQueues} />
      )}
    </div>
  );
}
