"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { PatientFormModal } from "@/components/queue/patient-form-modal";
import { Search, UserPlus, Pencil, ChevronLeft, ChevronRight, History, X, FlaskConical, Copy, RefreshCw, ArrowRight, CheckCircle2 } from "lucide-react";

interface PatientRow {
  id: number;
  code: string | null;
  fullName: string | null;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  gender: string;
  dob: string | null;
  contactNo: string;
  email: string;
  address: string;
  philHealth: string;
  seniorId: string;
  pwd: string;
  status: string;
  inputDate: string | null;
}

interface PatientsResponse {
  data: PatientRow[];
  hasMore: boolean;
  page: number;
  pageSize: number;
}

export function PatientManagementClient() {
  const [activeTab, setActiveTab] = useState<"patients" | "duplicates">("patients");

  const [search, setSearch]       = useState("");
  const [query, setQuery]         = useState("");
  const [page, setPage]           = useState(1);
  const [patients, setPatients]   = useState<PatientRow[]>([]);
  const [hasMore, setHasMore]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<PatientRow | null>(null);
  const [historyPatient, setHistoryPatient] = useState<PatientRow | null>(null);

  const PAGE_SIZE = 20;

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (query) params.set("search", query);
      const res = await apiFetch<PatientsResponse>(`/api/patients?${params}`);
      setPatients(res.data);
      setHasMore(res.hasMore);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  function handleSearch() {
    setQuery(search.trim());
    setPage(1);
  }

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(p: PatientRow) {
    setEditing(p);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    setEditing(null);
    fetchPatients();
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("patients")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "patients"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Search className="h-4 w-4" />
          Patients
        </button>
        <button
          onClick={() => setActiveTab("duplicates")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "duplicates"
              ? "border-amber-500 text-amber-600 dark:text-amber-400 dark:border-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Copy className="h-4 w-4" />
          Duplicates
        </button>
      </div>

      {/* Duplicates tab */}
      {activeTab === "duplicates" && <DuplicatesTab />}

      {/* Patients tab content */}
      {activeTab === "patients" && <>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name or patient code…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <UserPlus className="h-4 w-4" />
          New Patient
        </button>
      </div>

      {/* Table */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">Code</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">Full Name</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">Gender</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">Date of Birth</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">Contact</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">PhilHealth</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                  No patients found
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">{p.code ?? "—"}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-100">{p.fullName ?? "—"}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{p.gender || "—"}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{p.dob ?? "—"}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{p.contactNo || "—"}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{p.philHealth || "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setHistoryPatient(p)}
                        className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                      >
                        <History className="h-3.5 w-3.5" />
                        History
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {(page > 1 || hasMore) && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Page {page}{hasMore ? "" : " (last)"}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={!hasMore}
              onClick={() => setPage(p => p + 1)}
              className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      </> /* end patients tab */}

      {/* Patient form modal */}
      <PatientFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSaved={handleSaved}
        patient={editing ?? undefined}
      />

      {/* Patient history modal */}
      {historyPatient && (
        <PatientHistoryModal patient={historyPatient} onClose={() => setHistoryPatient(null)} />
      )}
    </div>
  );
}

/* ─── Duplicates Tab ─────────────────────────────────────────────────────── */

interface DuplicatePatientInfo {
  id: number;
  code: string | null;
  fullName: string | null;
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string;
  dob: string | null;
  contactNo: string;
  pictureLink: string | null;
  txCount: number;
}

interface DuplicatePair {
  patient1: DuplicatePatientInfo;
  patient2: DuplicatePatientInfo;
  score: number;
}

function DuplicatesTab() {
  const [pairs, setPairs]         = useState<DuplicatePair[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [merging, setMerging]     = useState<string | null>(null); // "keepId-mergeId"
  const [merged, setMerged]       = useState<Set<string>>(new Set());
  const [mergeError, setMergeError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadPairs = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasLoaded(true);
    try {
      const res = await apiFetch<{ pairs: DuplicatePair[]; total: number }>("/api/patients/duplicates");
      setPairs(res.pairs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load duplicates");
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleMerge(keepId: number, mergeId: number) {
    const key = `${keepId}-${mergeId}`;
    setMerging(key);
    setMergeError(null);
    try {
      await apiFetch("/api/patients/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keepId, mergeId }),
      });
      setMerged((prev) => new Set(prev).add(`${Math.min(keepId, mergeId)}-${Math.max(keepId, mergeId)}`));
    } catch (e) {
      setMergeError(e instanceof Error ? e.message : "Merge failed");
    } finally {
      setMerging(null);
    }
  }

  function isPairMerged(p1Id: number, p2Id: number) {
    return merged.has(`${Math.min(p1Id, p2Id)}-${Math.max(p1Id, p2Id)}`);
  }

  const activePairs = pairs.filter((p) => !isPairMerged(p.patient1.id, p.patient2.id));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Duplicate Patient Detection</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Patients with the same date of birth and similar names (≥80% match).
          </p>
        </div>
        <button
          onClick={loadPairs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {mergeError && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-300">
          {mergeError}
        </div>
      )}

      {!hasLoaded && !loading && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
          <Copy className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Duplicate scan is manual</p>
          <p className="text-xs text-center max-w-xs">Click <strong>Scan Now</strong> to search for potential duplicate patient records. This may take a moment on large databases.</p>
          <button
            onClick={loadPairs}
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Scan Now
          </button>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center text-sm text-slate-400">Scanning for duplicates…</div>
      )}

      {!loading && error && (
        <div className="py-8 text-center text-sm text-red-500">{error}</div>
      )}

      {hasLoaded && !loading && !error && activePairs.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No duplicates found</p>
          <p className="text-xs">All patient records appear to be unique.</p>
        </div>
      )}

      {!loading && activePairs.length > 0 && (
        <div className="space-y-3">
          {activePairs.map((pair, i) => {
            const mergeKey = `${pair.patient1.id}-${pair.patient2.id}`;
            const isMergingThis = merging === mergeKey || merging === `${pair.patient2.id}-${pair.patient1.id}`;
            return (
              <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-700/40 dark:bg-amber-900/10">
                {/* Score badge */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {pair.score}% match
                  </span>
                  <span className="text-xs text-slate-500">Same DOB · Similar name</span>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
                  <PatientCard patient={pair.patient1} />
                  <div className="flex flex-col items-center gap-1 pt-4">
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                  <PatientCard patient={pair.patient2} />
                </div>

                {/* Merge actions */}
                <div className="mt-3 flex items-center justify-center gap-3 border-t border-amber-100 pt-3 dark:border-amber-700/30">
                  <button
                    onClick={() => handleMerge(pair.patient1.id, pair.patient2.id)}
                    disabled={!!merging}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {isMergingThis ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    Keep Left, merge Right
                  </button>
                  <span className="text-xs text-slate-400">or</span>
                  <button
                    onClick={() => handleMerge(pair.patient2.id, pair.patient1.id)}
                    disabled={!!merging}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {isMergingThis ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    Keep Right, merge Left
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PatientCard({ patient }: { patient: DuplicatePatientInfo }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
      {patient.pictureLink ? (
        <img src={patient.pictureLink} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-cover border border-slate-200 dark:border-slate-600" />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
          <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{patient.fullName ?? "—"}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{patient.code ?? "No code"}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">DOB: {patient.dob ?? "—"}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{patient.gender || "—"} · {patient.contactNo || "No contact"}</p>
        <p className="mt-1">
          {patient.txCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {patient.txCount} visit{patient.txCount !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
              No visits
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ─── Patient History Modal ──────────────────────────────────────────────── */

interface HistoryEntry {
  id:          number;
  code:        string;
  date:        string;
  clinicCode:  string;
  statusCode:  number;
  statusName:  string;
  patientType: string;
  accessions:  { id: number; accessionNo: string; itemCode: string; itemDescription: string; status: number }[];
}

function PatientHistoryModal({ patient, onClose }: { patient: PatientRow; onClose: () => void }) {
  const [history, setHistory]     = useState<HistoryEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [expanded, setExpanded]   = useState<Set<number>>(new Set());
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch<{ data: HistoryEntry[]; total: number; totalPages: number }>(
      `/api/patients/${patient.id}/history?page=${page}&pageSize=${PAGE_SIZE}`
    )
      .then((json) => {
        setHistory(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [patient.id, page]);

  function toggleExpand(id: number) {
    setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-900" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Visit History</h3>
            <p className="text-xs text-slate-500">{patient.fullName} · {total} visits</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && <p className="py-8 text-center text-sm text-slate-400">Loading…</p>}
          {error   && <p className="py-8 text-center text-sm text-red-500">{error}</p>}
          {!loading && !error && history.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">No visit records found.</p>
          )}
          {!loading && history.length > 0 && (
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className="rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleExpand(h.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{h.code}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{h.date}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{h.clinicCode}</span>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${h.statusCode >= 600 ? "bg-green-100 text-green-700" : h.statusCode >= 300 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                        {h.statusName}
                      </span>
                    </div>
                    <span className="ml-2 text-xs text-slate-400">{h.accessions.length} test{h.accessions.length !== 1 ? "s" : ""}</span>
                  </button>
                  {expanded.has(h.id) && h.accessions.length > 0 && (
                    <div className="border-t border-slate-100 px-4 pb-3 pt-2 dark:border-slate-700">
                      <table className="w-full text-xs">
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {h.accessions.map((a) => (
                            <tr key={a.id}>
                              <td className="py-1.5">
                                <div className="flex items-center gap-1.5">
                                  <FlaskConical className="h-3 w-3 text-purple-400" />
                                  <span className="font-mono text-slate-600 dark:text-slate-300">{a.accessionNo || "—"}</span>
                                </div>
                              </td>
                              <td className="py-1.5 text-slate-600 dark:text-slate-300">{a.itemDescription}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="rounded p-1 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-700">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="rounded p-1 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-700">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
