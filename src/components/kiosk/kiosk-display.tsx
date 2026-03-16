"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface QueueEntry {
  Id: number;
  Code: string | null;
  QFullName: string | null;
  QFirstName: string | null;
  QLastName: string | null;
  PatientType: string | null;
  Status: number;
  DateTime: string;
  IdBU: string | null;
  AccessionNo: string | null;
}

const REFRESH_MS = 10_000;

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusLabel(s: number) {
  if (s === 201) return "Waiting";
  if (s === 205) return "Partial Pay";
  if (s === 210) return "Paid";
  if (s >= 300 && s < 400) return "For Specimen";
  if (s >= 400 && s < 500) return "Accession";
  if (s >= 500 && s < 650) return "In Progress";
  return "Done";
}

function isServing(s: number)  { return s >= 300 && s < 650; }
function isWaiting(s: number)  { return s === 201; }

function priorityBadge(pt: string | null) {
  if (!pt) return null;
  const t = pt.toUpperCase();
  if (t.includes("VIP"))
    return <span className="rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-black text-yellow-900">VIP</span>;
  if (t.includes("PRIORITY") || t.includes("SENIOR") || t.includes("PWD"))
    return <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-black text-white">P</span>;
  return null;
}

function patientDisplayName(q: QueueEntry) {
  return (q.QFullName ?? `${q.QLastName ?? ""}, ${q.QFirstName ?? ""}`.trim()) || "—";
}

// ── Clock ─────────────────────────────────────────────────────────────────────
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-right leading-tight">
      <div className="text-5xl font-black tabular-nums tracking-tight text-white">
        {now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: "Asia/Manila" })}
      </div>
      <div className="mt-0.5 text-sm font-medium text-blue-300">
        {now.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Manila" })}
      </div>
    </div>
  );
}

// ── "NOW SERVING" card ────────────────────────────────────────────────────────
function ServingCard({ q }: { q: QueueEntry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-emerald-400/40 bg-emerald-900/30 p-5 backdrop-blur-sm">
      <div className="w-full truncate text-center font-mono text-2xl font-black text-white">{q.Code}</div>
      <div className="mt-1 w-full truncate text-center text-sm font-semibold text-emerald-200">
        {patientDisplayName(q)}
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        {priorityBadge(q.PatientType)}
        <span className="rounded-full bg-emerald-800/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          {statusLabel(q.Status)}
        </span>
      </div>
    </div>
  );
}

// ── Waiting card ──────────────────────────────────────────────────────────────
function WaitingCard({ q, pos }: { q: QueueEntry; pos: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <span className="w-6 shrink-0 text-center text-xs font-bold text-slate-500">{pos}</span>
      <div className="font-mono text-lg font-extrabold text-white">{q.Code}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-slate-200">{patientDisplayName(q)}</div>
        <div className="mt-0.5 flex items-center gap-1">
          {priorityBadge(q.PatientType)}
          <span className="text-[11px] font-medium text-amber-400">Waiting</span>
        </div>
      </div>
      <span className="shrink-0 text-xs text-slate-500">
        {new Date(q.DateTime).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Manila" })}
      </span>
    </div>
  );
}

// ── Check-in Modal ────────────────────────────────────────────────────────────
function CheckInModal({ clinicCode, onClose }: { clinicCode: string; onClose: () => void }) {
  type Step = "form" | "success";
  const [step, setStep]     = useState<Step>("form");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [issued, setIssued] = useState<{ code: string; name: string } | null>(null);
  const [form, setForm]     = useState({
    lastName: "", firstName: "", middleName: "",
    gender: "", dob: "", patientType: "OUT-PATIENT",
  });

  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.lastName.trim() || !form.firstName.trim()) {
      setError("First and Last name are required.");
      return;
    }
    setSaving(true); setError(null);
    try {
      const res = await fetch("/api/kiosk/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clinicCode }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Check-in failed."); return; }
      setIssued({ code: json.code, name: json.name });
      setStep("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const iCls = "w-full rounded-xl border border-white/20 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-base";
  const lCls = "mb-1 block text-sm font-semibold text-slate-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-blue-900/40 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white">Patient Check-In</h2>
            <p className="text-sm text-blue-300">Self-service queue registration</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-900/30 px-4 py-3 text-sm text-red-300">{error}</div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lCls}>Last Name *</label>
                <input value={form.lastName} onChange={f("lastName")} placeholder="Dela Cruz" className={iCls} required />
              </div>
              <div>
                <label className={lCls}>First Name *</label>
                <input value={form.firstName} onChange={f("firstName")} placeholder="Juan" className={iCls} required />
              </div>
            </div>
            <div>
              <label className={lCls}>Middle Name</label>
              <input value={form.middleName} onChange={f("middleName")} placeholder="Optional" className={iCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lCls}>Gender</label>
                <select value={form.gender} onChange={f("gender")} className={iCls}>
                  <option value="" className="bg-slate-800 text-white">— Select —</option>
                  <option value="Male" className="bg-slate-800 text-white">Male</option>
                  <option value="Female" className="bg-slate-800 text-white">Female</option>
                  <option value="Other" className="bg-slate-800 text-white">Other</option>
                </select>
              </div>
              <div>
                <label className={lCls}>Date of Birth</label>
                <input type="date" value={form.dob} onChange={f("dob")} className={iCls} />
              </div>
            </div>
            <div>
              <label className={lCls}>Patient Type</label>
              <select value={form.patientType} onChange={f("patientType")} className={iCls}>
                <option value="OUT-PATIENT" className="bg-slate-800 text-white">Out-Patient</option>
                <option value="IN-PATIENT" className="bg-slate-800 text-white">In-Patient</option>
                <option value="SENIOR" className="bg-slate-800 text-white">Senior Citizen</option>
                <option value="PWD" className="bg-slate-800 text-white">PWD</option>
                <option value="PRIORITY" className="bg-slate-800 text-white">Priority</option>
              </select>
            </div>
            <button type="submit" disabled={saving}
              className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 text-base font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60">
              {saving ? "Processing…" : "Get Queue Number"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/30">
              <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <p className="mb-1 text-sm font-medium text-slate-400">Your queue number is</p>
            <div className="font-mono text-6xl font-black tracking-tight text-white">{issued?.code}</div>
            <p className="mt-3 text-base font-semibold text-slate-200">{issued?.name}</p>
            <p className="mt-1 text-sm text-slate-400">Please wait — your number will be called shortly.</p>
            <button onClick={onClose}
              className="mt-8 w-full rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white transition-colors hover:bg-emerald-700">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Ticker ────────────────────────────────────────────────────────────────────
function Ticker({ items }: { items: QueueEntry[] }) {
  const serving = items.filter(q => isServing(q.Status));
  if (serving.length === 0) return null;
  return (
    <div className="overflow-hidden border-t border-blue-900/60 bg-blue-950 py-2">
      <div className="flex animate-[marquee_25s_linear_infinite] gap-16 whitespace-nowrap px-8">
        {[...serving, ...serving].map((q, i) => (
          <span key={i} className="text-sm font-medium text-blue-300">
            <span className="font-mono font-black text-white">{q.Code}</span>
            <span className="mx-2 text-blue-700">·</span>
            <span>{statusLabel(q.Status)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function KioskDisplay({ clinicCode }: { clinicCode?: string }) {
  const [entries, setEntries]         = useState<QueueEntry[]>([]);
  const [asOf, setAsOf]               = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const timerRef                      = useRef<NodeJS.Timeout | null>(null);

  const load = useCallback(async () => {
    try {
      const p = new URLSearchParams();
      if (clinicCode) p.set("clinic", clinicCode);
      const res = await fetch(`/api/kiosk/queue?${p}`);
      if (!res.ok) return;
      const json = await res.json();
      setEntries(json.data ?? []);
      setAsOf(json.asOf ?? null);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [clinicCode]);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, REFRESH_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [load]);

  const serving = entries.filter(q => isServing(q.Status));
  const waiting = entries.filter(q => isWaiting(q.Status));
  const paid    = entries.filter(q => q.Status === 210);
  const total   = entries.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#060d1f]">

      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-blue-900/50 bg-gradient-to-r from-blue-950 to-[#060d1f] px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">NWD Central Medical Specialists Center</h1>
            <p className="text-xs text-blue-400">
              Queue Display Board{clinicCode ? ` · ${clinicCode}` : ""}
              {asOf && (
                <span className="ml-2 text-blue-700">
                  · Updated {new Date(asOf).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: "Asia/Manila" })}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden gap-6 md:flex">
            {[
              { val: total,          label: "Total",      cls: "text-white"        },
              { val: waiting.length, label: "Waiting",    cls: "text-amber-400"    },
              { val: serving.length, label: "Processing", cls: "text-emerald-400"  },
              { val: paid.length,    label: "Paid",       cls: "text-blue-400"     },
            ].map(({ val, label, cls }) => (
              <div key={label} className="text-center">
                <div className={`text-2xl font-black tabular-nums ${cls}`}>{val}</div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">{label}</div>
              </div>
            ))}
          </div>
          <Clock />
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex flex-1 gap-6 overflow-hidden p-6">

        {/* LEFT — Now Serving */}
        <section className="flex w-64 shrink-0 flex-col gap-3">
          <div className="flex items-center gap-2 pb-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Now Serving</h2>
          </div>
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-600">Loading…</div>
          ) : serving.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-600">
              No active patients
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto">
              {serving.map(q => <ServingCard key={q.Id} q={q} />)}
            </div>
          )}
        </section>

        {/* RIGHT — Waiting */}
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-2 pb-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Waiting Queue{waiting.length > 0 ? ` — ${waiting.length} patient${waiting.length > 1 ? "s" : ""}` : ""}
            </h2>
          </div>
          {loading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-600">Loading…</div>
          ) : waiting.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-600">
              No patients waiting
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
              {waiting.map((q, i) => <WaitingCard key={q.Id} q={q} pos={i + 1} />)}
            </div>
          )}
        </section>
      </main>

      {/* ── Ticker ── */}
      <Ticker items={entries} />

      {/* ── Check-In FAB ── */}
      <button
        onClick={() => setShowCheckIn(true)}
        className="fixed bottom-8 right-8 flex items-center gap-2.5 rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-2xl shadow-blue-600/40 transition-all hover:bg-blue-500 active:scale-95"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Check In Here
      </button>

      {/* ── Check-In Modal ── */}
      {showCheckIn && (
        <CheckInModal
          clinicCode={clinicCode || "CEN"}
          onClose={() => { setShowCheckIn(false); load(); }}
        />
      )}
    </div>
  );
}
