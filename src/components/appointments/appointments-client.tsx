"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  useUpcomingAppointments,
  usePhysicianAvailability,
  useCreateAppointment,
  useCancelAppointment,
} from "@/hooks/use-appointments";
import {
  CalendarDays, RefreshCw, UserRound, ChevronRight, Plus, X, Clock,
  Search, CalendarPlus, CalendarCheck, ListChecks,
} from "lucide-react";

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

interface PhysicianOption {
  id: number;
  fullName: string;
  degree: string | null;
}

interface PatientOption {
  id: number;
  fullName: string;
  code: string;
}

type Tab = "schedule" | "book" | "upcoming";

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function statusLabel(code: number): { label: string; cls: string } {
  if (code === 201 || code === 202) return { label: "Waiting",     cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" };
  if (code >= 203 && code < 210)    return { label: "In Progress", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
  if (code === 210)                  return { label: "Paid",        cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
  if (code >= 300 && code < 500)    return { label: "Specimen",    cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" };
  if (code >= 500 && code < 650)    return { label: "Released",    cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" };
  return { label: String(code), cls: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" };
}

function apptStatusLabel(status: number): { label: string; cls: string } {
  if (status === 201) return { label: "Booked",     cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
  if (status === 210) return { label: "Checked In", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
  if (status === 650) return { label: "Cancelled",  cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" };
  return { label: String(status), cls: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" };
}

const TAB_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "schedule", label: "Today's Schedule", icon: <ListChecks className="h-4 w-4" /> },
  { key: "book",     label: "Book Appointment", icon: <CalendarPlus className="h-4 w-4" /> },
  { key: "upcoming", label: "Upcoming",         icon: <CalendarCheck className="h-4 w-4" /> },
];

// ── Main Component ──────────────────────────────────────────────────────────

export function AppointmentsClient() {
  const [tab, setTab] = useState<Tab>("schedule");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-900/30">
          <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Appointments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Schedule & manage physician appointments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {TAB_ITEMS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "schedule" && <ScheduleTab />}
      {tab === "book"     && <BookTab />}
      {tab === "upcoming" && <UpcomingTab />}
    </div>
  );
}

// ── Schedule Tab (existing functionality) ───────────────────────────────────

function ScheduleTab() {
  const router = useRouter();
  const [date, setDate]       = useState(todayStr());
  const [data, setData]       = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

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
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Physician daily schedule
          {data && ` · ${data.clinicCode} · ${totalQueues} patient${totalQueues !== 1 ? "s" : ""}`}
        </p>
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

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">Loading schedule…</span>
        </div>
      )}

      {!loading && data && data.doctors.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-24 dark:border-slate-700 dark:bg-slate-800">
          <CalendarDays className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No patients scheduled for {date}</p>
        </div>
      )}

      {!loading && data && data.doctors.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.doctors.map((doc) => (
            <div key={doc.doctorId} className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                  <UserRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {doc.doctorId === "__unassigned__" ? "No Physician Assigned" : doc.doctorName}
                  </p>
                  <p className="text-xs text-slate-400">{doc.queues.length} patient{doc.queues.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
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
                          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{q.patientName || "—"}</p>
                          <p className="font-mono text-xs text-slate-400">{q.code}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
                          {q.inputTime && <span className="text-xs text-slate-400">{q.inputTime}</span>}
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
    </>
  );
}

// ── Book Appointment Tab ────────────────────────────────────────────────────

function BookTab() {
  const createAppt = useCreateAppointment();

  const [date, setDate]                     = useState(todayStr());
  const [selectedPhysician, setSelectedPhysician] = useState<PhysicianOption | null>(null);
  const [selectedPatient, setSelectedPatient]     = useState<PatientOption | null>(null);
  const [selectedSlot, setSelectedSlot]     = useState<string | null>(null);
  const [notes, setNotes]                   = useState("");
  const [success, setSuccess]               = useState<string | null>(null);

  // Physician search
  const [physQuery, setPhysQuery]           = useState("");
  const [physicians, setPhysicians]         = useState<PhysicianOption[]>([]);
  const [showPhysList, setShowPhysList]     = useState(false);

  // Patient search
  const [patQuery, setPatQuery]             = useState("");
  const [patients, setPatients]             = useState<PatientOption[]>([]);
  const [showPatList, setShowPatList]       = useState(false);

  // Availability
  const { data: availability, isLoading: loadingSlots } = usePhysicianAvailability(
    selectedPhysician?.id ?? null,
    date
  );

  // Search physicians
  useEffect(() => {
    if (physQuery.length < 2) { setPhysicians([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await apiFetch<{ id: number; fullName: string; degree: string | null }[]>(
          `/api/physicians?q=${encodeURIComponent(physQuery)}&limit=10`
        );
        setPhysicians(res.map((p) => ({ id: Number(p.id), fullName: p.fullName ?? "", degree: p.degree })));
        setShowPhysList(true);
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(t);
  }, [physQuery]);

  // Search patients
  useEffect(() => {
    if (patQuery.length < 2) { setPatients([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await apiFetch<{ id: number; fullName: string; code: string }[]>(
          `/api/patients/search?q=${encodeURIComponent(patQuery)}&limit=10`
        );
        setPatients(res.map((p) => ({ id: Number(p.id), fullName: p.fullName ?? "", code: p.code ?? "" })));
        setShowPatList(true);
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(t);
  }, [patQuery]);

  const handleBook = async () => {
    if (!selectedPatient || !selectedPhysician || !selectedSlot) return;
    setSuccess(null);

    try {
      await createAppt.mutateAsync({
        idPatient:       selectedPatient.id,
        patientName:     selectedPatient.fullName,
        idPhysician:     selectedPhysician.id,
        physicianName:   selectedPhysician.fullName,
        appointmentDate: date,
        timeSlot:        selectedSlot,
        notes:           notes || undefined,
      });
      setSuccess(`Appointment booked for ${selectedPatient.fullName} on ${date} at ${selectedSlot}`);
      setSelectedPatient(null);
      setPatQuery("");
      setSelectedSlot(null);
      setNotes("");
    } catch {
      /* error handled by mutation */
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <CalendarCheck className="h-4 w-4" />
          {success}
        </div>
      )}

      {createAppt.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {(createAppt.error as Error)?.message || "Failed to book appointment"}
        </div>
      )}

      {/* Date */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Appointment Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        />
      </div>

      {/* Physician search */}
      <div className="relative">
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Physician</label>
        {selectedPhysician ? (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-950">
            <UserRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="flex-1 text-slate-800 dark:text-slate-200">{selectedPhysician.fullName}</span>
            <button onClick={() => { setSelectedPhysician(null); setPhysQuery(""); setSelectedSlot(null); }}>
              <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={physQuery}
              onChange={(e) => setPhysQuery(e.target.value)}
              onFocus={() => physicians.length > 0 && setShowPhysList(true)}
              onBlur={() => setTimeout(() => setShowPhysList(false), 200)}
              placeholder="Search physician..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            />
            {showPhysList && physicians.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {physicians.map((p) => (
                  <li key={p.id}>
                    <button
                      onMouseDown={() => {
                        setSelectedPhysician(p);
                        setShowPhysList(false);
                        setPhysQuery("");
                        setSelectedSlot(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <span className="text-slate-800 dark:text-slate-200">{p.fullName}</span>
                      {p.degree && <span className="ml-1 text-slate-400">{p.degree}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Patient search */}
      <div className="relative">
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Patient</label>
        {selectedPatient ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-emerald-950">
            <UserRound className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="flex-1 text-slate-800 dark:text-slate-200">{selectedPatient.fullName}</span>
            <span className="font-mono text-xs text-slate-400">{selectedPatient.code}</span>
            <button onClick={() => { setSelectedPatient(null); setPatQuery(""); }}>
              <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={patQuery}
              onChange={(e) => setPatQuery(e.target.value)}
              onFocus={() => patients.length > 0 && setShowPatList(true)}
              onBlur={() => setTimeout(() => setShowPatList(false), 200)}
              placeholder="Search patient by name or code..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            />
            {showPatList && patients.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {patients.map((p) => (
                  <li key={p.id}>
                    <button
                      onMouseDown={() => {
                        setSelectedPatient(p);
                        setShowPatList(false);
                        setPatQuery("");
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <span className="text-slate-800 dark:text-slate-200">{p.fullName}</span>
                      <span className="ml-2 font-mono text-xs text-slate-400">{p.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Time slots */}
      {selectedPhysician && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Available Time Slots
            {availability?.schedule && (
              <span className="ml-2 text-xs font-normal text-slate-400">Schedule: {availability.schedule}</span>
            )}
          </label>
          {loadingSlots ? (
            <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Loading slots…
            </div>
          ) : availability?.slots && availability.slots.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {availability.slots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`rounded-lg border px-3 py-2 text-center text-sm font-medium transition-colors ${
                    selectedSlot === slot.time
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300"
                      : slot.available
                        ? "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-600"
                        : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-600"
                  }`}
                >
                  <Clock className="mx-auto mb-0.5 h-3 w-3" />
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No slots available for this date.</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          placeholder="Any special notes for this appointment..."
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleBook}
        disabled={!selectedPatient || !selectedPhysician || !selectedSlot || createAppt.isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {createAppt.isPending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Book Appointment
      </button>
    </div>
  );
}

// ── Upcoming Tab ────────────────────────────────────────────────────────────

function UpcomingTab() {
  const { data: appointments, isLoading, error } = useUpcomingAppointments();
  const cancelAppt = useCancelAppointment();

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">Loading appointments…</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {(error as Error).message}
        </div>
      )}

      {!isLoading && appointments && appointments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-24 dark:border-slate-700 dark:bg-slate-800">
          <CalendarDays className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No upcoming appointments</p>
        </div>
      )}

      {!isLoading && appointments && appointments.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Time</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Physician</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {appointments.map((appt) => {
                const st = apptStatusLabel(appt.status);
                return (
                  <tr key={appt.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/20">
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{appt.appointmentDate}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">{appt.timeSlot}</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{appt.patientName}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{appt.physicianName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {appt.status === 201 && (
                        <button
                          onClick={() => cancelAppt.mutate(appt.id)}
                          disabled={cancelAppt.isPending}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          <X className="h-3 w-3" />
                          Cancel
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
    </>
  );
}
