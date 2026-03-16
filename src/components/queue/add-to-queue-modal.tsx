"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PatientFormModal } from "./patient-form-modal";

// ── Types ─────────────────────────────────────────────────────
interface PatientResult {
  id: number;
  code: string;
  fullName: string;
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string;
  dob: string | null;
}

interface AddToQueueModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // caller refreshes the queue list
}

// ── Helpers ───────────────────────────────────────────────────
function calcAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

// ── Component ────────────────────────────────────────────────
export function AddToQueueModal({ open, onClose, onSuccess }: AddToQueueModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Patient search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PatientResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form fields
  const [patientType, setPatientType] = useState("OUT-PATIENT");
  const [notes, setNotes] = useState("");

  // New patient modal
  const [showNewPatient, setShowNewPatient] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setSearchResults([]);
      setSelectedPatient(null);
      setShowDropdown(false);
      setPatientType("OUT-PATIENT");
      setNotes("");
      setApiError("");
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  }, [open]);

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Debounced patient search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/patients/search?q=${encodeURIComponent(q)}&limit=8`);
      if (!res.ok) throw new Error();
      const json: { data: PatientResult[] } = await res.json();
      setSearchResults(json.data);
      setShowDropdown(true);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearchTerm(val);
    setSelectedPatient(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 280);
  }

  function selectPatient(p: PatientResult) {
    setSelectedPatient(p);
    setSearchTerm(p.fullName);
    setShowDropdown(false);
    setSearchResults([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatient) {
      setApiError("Please search and select a patient.");
      return;
    }
    setSubmitting(true);
    setApiError("");

    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPatient:   selectedPatient.id,
          fullName:    selectedPatient.fullName,
          lastName:    selectedPatient.lastName,
          firstName:   selectedPatient.firstName,
          middleName:  selectedPatient.middleName,
          gender:      selectedPatient.gender,
          dob:         selectedPatient.dob,
          patientType,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || `HTTP ${res.status}`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to add to queue.");
    } finally {
      setSubmitting(false);
    }
  }

  function handlePatientSaved(p: PatientResult) {
    selectPatient(p);
    setShowNewPatient(false);
  }

  if (!open) return null;

  const age = calcAge(selectedPatient?.dob ?? null);

  return (
    <>
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Add to Queue</h3>
              <p className="text-xs text-slate-400">Search a patient and confirm details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Error banner */}
          {apiError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {apiError}
            </div>
          )}

          {/* ── Patient search ── */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Patient <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowNewPatient(true)}
                className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Patient
              </button>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {searching ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                )}
              </div>
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                placeholder="Type patient name or code…"
                className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={() => selectPatient(p)}
                      className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-blue-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                        {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{p.fullName}</p>
                        <p className="text-xs text-slate-400">
                          {p.code} · {p.gender} · {p.dob ?? "DOB unknown"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showDropdown && !searching && searchResults.length === 0 && searchTerm.length >= 2 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-slate-400">No patients found for &ldquo;{searchTerm}&rdquo;</span>
                    <button
                      type="button"
                      onMouseDown={() => { setShowDropdown(false); setShowNewPatient(true); }}
                      className="ml-3 shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      + New Patient
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Selected patient card ── */}
          {selectedPatient && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-200 text-sm font-bold text-blue-700">
                  {selectedPatient.firstName.charAt(0)}{selectedPatient.lastName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">{selectedPatient.fullName}</p>
                  <p className="text-xs text-slate-500">
                    Code: <span className="font-mono">{selectedPatient.code}</span>
                    {age !== null && <span className="ml-2">{age}y</span>}
                    {selectedPatient.gender && <span className="ml-1">{selectedPatient.gender}</span>}
                    {selectedPatient.dob && <span className="ml-2">DOB: {selectedPatient.dob}</span>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedPatient(null); setSearchTerm(""); searchRef.current?.focus(); }}
                  className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-blue-100 hover:text-slate-600"
                  title="Clear selection"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── Patient Type ── */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Patient Type
            </label>
            <div className="flex flex-wrap gap-2">
              {["OUT-PATIENT", "IN-PATIENT", "ER", "OB"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPatientType(type)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    patientType === type
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedPatient}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add to Queue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* New patient sub-modal */}
    <PatientFormModal
      open={showNewPatient}
      onClose={() => setShowNewPatient(false)}
      onSaved={handlePatientSaved}
    />
  </>
  );
}
