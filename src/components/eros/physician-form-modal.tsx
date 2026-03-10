"use client";

import { useEffect, useRef, useState } from "react";
import { X, UserPlus, Pencil, Loader2 } from "lucide-react";
import type { PhysicianRecord } from "./physician-accreditation-client";

interface Props {
  record: PhysicianRecord | null; // null = create mode
  onClose: () => void;
  onSaved: () => void;
}

interface FormState {
  lastname: string;
  firstname: string;
  middlename: string;
  suffix: string;
  dob: string;
  prcno: string;
  prcvalidity: string;
  degree: string;
  group: string;
  subgroup: string;
  email: string;
  mobile: string;
  branchcode: string;
  nwdbranch: string;
  schedule: string;
  timestart: string;
  timeend: string;
  byappointment: boolean;
  pcp: boolean;
  specialist: boolean;
  regular: boolean;
  reliever: boolean;
  visiting: boolean;
  referring: boolean;
  resigndoctor: boolean;
  applicationletter: boolean;
  curriculumvitae: boolean;
  diploma: boolean;
  prcid: boolean;
  residencycertificate: boolean;
  diplomatecertificate: boolean;
  philhealth: boolean;
  ptr: boolean;
  bir: boolean;
  moa: boolean;
}

function toDate(val: unknown): string {
  if (!val) return "";
  const d = new Date(String(val));
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function flag(val: string | null): boolean {
  return val === "Y";
}

function initForm(record: PhysicianRecord | null): FormState {
  if (!record) {
    return {
      lastname: "", firstname: "", middlename: "", suffix: "", dob: "",
      prcno: "", prcvalidity: "", degree: "", group: "", subgroup: "",
      email: "", mobile: "",
      branchcode: "", nwdbranch: "", schedule: "", timestart: "", timeend: "",
      byappointment: false,
      pcp: false, specialist: false, regular: false, reliever: false,
      visiting: false, referring: false, resigndoctor: false,
      applicationletter: false, curriculumvitae: false, diploma: false,
      prcid: false, residencycertificate: false, diplomatecertificate: false,
      philhealth: false, ptr: false, bir: false, moa: false,
    };
  }
  return {
    lastname:    record.lastname    ?? "",
    firstname:   record.firstname   ?? "",
    middlename:  record.middlename  ?? "",
    suffix:      record.suffix      ?? "",
    dob:         toDate(record.dob),
    prcno:       record.prcno       ?? "",
    prcvalidity: toDate(record.prcvalidity),
    degree:      record.degree      ?? "",
    group:       record.group       ?? "",
    subgroup:    record.subgroup    ?? "",
    email:       record.email       ?? "",
    mobile:      record.mobile      ?? "",
    branchcode:  record.branchcode  ?? "",
    nwdbranch:   record.nwdbranch   ?? "",
    schedule:    record.schedule    ?? "",
    timestart:   record.timestart   ?? "",
    timeend:     record.timeend     ?? "",
    byappointment: record.byappointment === "Y",
    pcp:          flag(record.pcp),
    specialist:   flag(record.specialist),
    regular:      flag(record.regular),
    reliever:     flag(record.reliever),
    visiting:     flag(record.visiting),
    referring:    flag(record.referring),
    resigndoctor: flag(record.resigndoctor),
    applicationletter:    flag(record.applicationletter),
    curriculumvitae:      flag(record.curriculumvitae),
    diploma:              flag(record.diploma),
    prcid:                flag(record.prcid),
    residencycertificate: flag(record.residencycertificate),
    diplomatecertificate: flag(record.diplomatecertificate),
    philhealth:           flag(record.philhealth),
    ptr:                  flag(record.ptr),
    bir:                  flag(record.bir),
    moa:                  flag(record.moa),
  };
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label, required, error, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const INPUT_CLS =
  "block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400";
const INPUT_VALID =
  "border-slate-200 hover:border-slate-300 focus:border-blue-400 dark:border-slate-600 dark:hover:border-slate-500";

// ── Toggle pill (checkbox styled as button) ───────────────────────────────────

function CheckPill({
  label, checked, onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        checked
          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
      }`}
    >
      {label}
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function PhysicianFormModal({ record, onClose, onSaved }: Props) {
  const isEdit = !!record;
  const backdropRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(() => initForm(record));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Escape key to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!form.firstname.trim() && !form.lastname.trim()) {
      setError("First name or last name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = isEdit
        ? `/api/physician/accreditation/${record!.id}`
        : `/api/physician/accreditation`;
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save.");
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  const reqCount = [
    form.applicationletter, form.curriculumvitae, form.diploma,
    form.prcid, form.residencycertificate, form.diplomatecertificate,
    form.philhealth, form.ptr, form.bir, form.moa,
  ].filter(Boolean).length;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col dark:border-slate-700 dark:bg-slate-800">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isEdit ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30"
            }`}>
              {isEdit
                ? <Pencil className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                : <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {isEdit ? "Edit Physician" : "Physician Accreditation Form"}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {isEdit ? (record!.fullname ?? "") : "Submit a new accreditation application"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className="overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <X className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form id="physician-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Section 1 — Personal Data */}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Personal Data
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field label="Last Name">
                  <input type="text" value={form.lastname} onChange={(e) => set("lastname", e.target.value)}
                    placeholder="Dela Cruz" className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="First Name">
                  <input type="text" value={form.firstname} onChange={(e) => set("firstname", e.target.value)}
                    placeholder="Juan" className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Middle Name">
                  <input type="text" value={form.middlename} onChange={(e) => set("middlename", e.target.value)}
                    placeholder="Santos" className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Suffix">
                  <input type="text" value={form.suffix} onChange={(e) => set("suffix", e.target.value)}
                    placeholder="Jr., Sr., III..." className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Date of Birth">
                  <input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)}
                    className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Specialization / Degree">
                  <input type="text" value={form.degree} onChange={(e) => set("degree", e.target.value)}
                    placeholder="Internal Medicine" className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Group">
                  <input type="text" value={form.group} onChange={(e) => set("group", e.target.value)}
                    className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Sub-Group">
                  <input type="text" value={form.subgroup} onChange={(e) => set("subgroup", e.target.value)}
                    className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="PRC No.">
                  <input type="text" value={form.prcno} onChange={(e) => set("prcno", e.target.value)}
                    placeholder="0123456" className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="PRC Validity">
                  <input type="date" value={form.prcvalidity} onChange={(e) => set("prcvalidity", e.target.value)}
                    className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Email">
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    placeholder="doctor@hospital.com" className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Mobile">
                  <input type="text" value={form.mobile} onChange={(e) => set("mobile", e.target.value)}
                    placeholder="+63 9XX XXX XXXX" className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
              </div>
            </div>

            {/* Section 2 — Clinic Schedule */}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Clinic Schedule
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field label="Branch Code">
                  <input type="text" maxLength={3} value={form.branchcode}
                    onChange={(e) => set("branchcode", e.target.value.toUpperCase())}
                    placeholder="SMB" className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Schedule Start">
                  <input type="time" value={form.timestart} onChange={(e) => set("timestart", e.target.value)}
                    className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <Field label="Schedule End">
                  <input type="time" value={form.timeend} onChange={(e) => set("timeend", e.target.value)}
                    className={`${INPUT_CLS} ${INPUT_VALID}`} />
                </Field>
                <div className="col-span-2 sm:col-span-3">
                  <Field label="NWD Branch">
                    <textarea rows={2} value={form.nwdbranch} onChange={(e) => set("nwdbranch", e.target.value)}
                      className={`${INPUT_CLS} ${INPUT_VALID} resize-none`} />
                  </Field>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <Field label="Schedule">
                    <textarea rows={2} value={form.schedule} onChange={(e) => set("schedule", e.target.value)}
                      placeholder="Mon, Wed, Fri — 8:00 AM to 12:00 PM"
                      className={`${INPUT_CLS} ${INPUT_VALID} resize-none`} />
                  </Field>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-700/50">
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">By Appointment Only</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Patient must book in advance</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" checked={form.byappointment}
                    onChange={(e) => set("byappointment", e.target.checked)} className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-emerald-400/20 dark:bg-slate-600" />
                </label>
              </div>
            </div>

            {/* Section 3 — Position */}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Position
              </p>
              <div className="flex flex-wrap gap-2">
                {([
                  ["pcp",          "PCP"],
                  ["specialist",   "Specialist"],
                  ["regular",      "Regular"],
                  ["reliever",     "Reliever"],
                  ["visiting",     "Visiting"],
                  ["referring",    "Referring"],
                  ["resigndoctor", "Resign Doctor"],
                ] as [keyof FormState, string][]).map(([key, label]) => (
                  <CheckPill key={key} label={label}
                    checked={form[key] as boolean}
                    onChange={(v) => set(key, v as FormState[typeof key])} />
                ))}
              </div>
            </div>

            {/* Section 4 — Requirements */}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Requirements
                </p>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {reqCount} / 10 submitted
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {([
                  ["applicationletter",    "Application Letter"],
                  ["curriculumvitae",      "Curriculum Vitae"],
                  ["diploma",              "Diploma"],
                  ["prcid",                "PRC ID"],
                  ["residencycertificate", "Residency Certificate"],
                  ["diplomatecertificate", "Diplomate Certificate"],
                  ["philhealth",           "PhilHealth"],
                  ["ptr",                  "PTR"],
                  ["bir",                  "BIR"],
                  ["moa",                  "MOA"],
                ] as [keyof FormState, string][]).map(([key, label]) => (
                  <CheckPill key={key} label={label}
                    checked={form[key] as boolean}
                    onChange={(v) => set(key, v as FormState[typeof key])} />
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="physician-form"
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
              isEdit
                ? "bg-amber-500 shadow-amber-500/20 hover:bg-amber-600"
                : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
            }`}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Submit Application"}
          </button>
        </div>

      </div>
    </div>
  );
}
