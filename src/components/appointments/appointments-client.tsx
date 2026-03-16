"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { CalendarDays, RefreshCw, UserRound, ChevronRight } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QueueSlot {
  id:          number;
  code:        string;
  patientName: string;
  status:      number;
  inputTime:   string | null;
}

interface DoctorSchedule {
  doctorId:   string;
  doctorName: string;
  queues:     QueueSlot[];
}

interface ScheduleResponse {
  date:        string;
  clinicCode:  string;
  doctors:     DoctorSchedule[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10);
}

function statusLabel(code: number): { label: string; cls: string } {
  if (code === 201 || code === 202) return { label: "Waiting",    cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" };
  if (code >= 203 && code < 210)   return { label: "In Progress", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"   };
  if (code === 210)                 return { label: "Paid",        cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
  if (code >= 300 && code < 500)   return { label: "Specimen",    cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" };
  if (code >= 500 && code < 650)   return { label: "Released",    cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" };
  return { label: String(code), cls: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AppointmentsClient() {
  const router = useRouter();
  const [date, setDate]         = useState(today());
  const [data, setData]         = useState<ScheduleResponse | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const fetchSchedule = useCallback(async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<ScheduleResponse>(`/api/appointments/schedule?date=${d}`);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchedule(date); }, [date, fetchSchedule]);

  const totalQueues = data?.doctors.reduce((sum, d) => sum + d.queues.length, 0) ?? 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-900/30">
            <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Appointments</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Physician daily schedule
              {data && ` · ${data.clinicCode} · ${totalQueues} patient${totalQueues !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          />
          <button
            onClick={() => fetchSchedule(date)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">Loading schedule…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && data && data.doctors.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-24 dark:border-slate-700 dark:bg-slate-800">
          <CalendarDays className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No patients scheduled for {date}</p>
        </div>
      )}

      {/* Schedule grid */}
      {!loading && data && data.doctors.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.doctors.map((doc) => (
            <div
              key={doc.doctorId}
              className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {/* Doctor header */}
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                  <UserRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {doc.doctorId === "__unassigned__" ? "No Physician Assigned" : doc.doctorName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {doc.queues.length} patient{doc.queues.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Queue list */}
              <ul className="flex-1 divide-y divide-slate-100 dark:divide-slate-700/60">
                {doc.queues.map((q) => {
                  const st = statusLabel(q.status);
                  return (
                    <li key={q.id}>
                      <button
                        onClick={() => router.push(`/queue/${q.id}/edit`)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                            {q.patientName || "—"}
                          </p>
                          <p className="font-mono text-xs text-slate-400">{q.code}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>
                            {st.label}
                          </span>
                          {q.inputTime && (
                            <span className="text-xs text-slate-400">{q.inputTime}</span>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
