"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
  // Schedule
  branchcode: string;
  nwdbranch: string;
  schedule: string;
  timestart: string;
  timeend: string;
  byappointment: boolean;
  // Position
  pcp: boolean;
  specialist: boolean;
  regular: boolean;
  reliever: boolean;
  visiting: boolean;
  referring: boolean;
  resigndoctor: boolean;
  // Requirements
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

export function PhysicianFormModal({ record, onClose, onSaved }: Props) {
  const isEdit = !!record;
  const [form, setForm] = useState<FormState>(() => initForm(record));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
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

  const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500";
  const labelCls = "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1";
  const sectionCls = "mb-6";
  const sectionTitleCls = "text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 pb-1 border-b border-slate-100 dark:border-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl dark:bg-slate-800 my-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800 rounded-t-xl">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              {isEdit ? "Edit Physician" : "Physician Accreditation Form"}
            </h2>
            {isEdit && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{record!.fullname}</p>
            )}
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-6">

            {/* ── Section 1: Personal Data ─────────────────────────────────── */}
            <div className={sectionCls}>
              <h3 className={sectionTitleCls}>Personal Data</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input type="text" value={form.lastname} onChange={(e) => set("lastname", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>First Name</label>
                  <input type="text" value={form.firstname} onChange={(e) => set("firstname", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Middle Name</label>
                  <input type="text" value={form.middlename} onChange={(e) => set("middlename", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Suffix</label>
                  <input type="text" placeholder="Jr., Sr., III..." value={form.suffix} onChange={(e) => set("suffix", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Specialization / Degree</label>
                  <input type="text" value={form.degree} onChange={(e) => set("degree", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Group</label>
                  <input type="text" value={form.group} onChange={(e) => set("group", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sub-Group</label>
                  <input type="text" value={form.subgroup} onChange={(e) => set("subgroup", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>PRC No.</label>
                  <input type="text" value={form.prcno} onChange={(e) => set("prcno", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>PRC Validity</label>
                  <input type="date" value={form.prcvalidity} onChange={(e) => set("prcvalidity", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mobile</label>
                  <input type="text" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* ── Section 2: Clinic Schedule ───────────────────────────────── */}
            <div className={sectionCls}>
              <h3 className={sectionTitleCls}>Clinic Schedule</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>Branch Code</label>
                  <input type="text" maxLength={3} value={form.branchcode} onChange={(e) => set("branchcode", e.target.value.toUpperCase())} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Schedule Start</label>
                  <input type="time" value={form.timestart} onChange={(e) => set("timestart", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Schedule End</label>
                  <input type="time" value={form.timeend} onChange={(e) => set("timeend", e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <label className={labelCls}>NWD Branch</label>
                  <textarea rows={2} value={form.nwdbranch} onChange={(e) => set("nwdbranch", e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <label className={labelCls}>Schedule</label>
                  <textarea rows={2} value={form.schedule} onChange={(e) => set("schedule", e.target.value)} className={inputCls} />
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-3">
                  <input
                    type="checkbox"
                    id="byappointment"
                    checked={form.byappointment}
                    onChange={(e) => set("byappointment", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="byappointment" className="text-sm text-slate-700 dark:text-slate-300">By Appointment Only</label>
                </div>
              </div>
            </div>

            {/* ── Section 3: Position ──────────────────────────────────────── */}
            <div className={sectionCls}>
              <h3 className={sectionTitleCls}>Position</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {([
                  ["pcp",          "PCP (Primary Care Physician)"],
                  ["specialist",   "Specialist"],
                  ["regular",      "Regular"],
                  ["reliever",     "Reliever"],
                  ["visiting",     "Visiting"],
                  ["referring",    "Referring"],
                  ["resigndoctor", "Resign Doctor"],
                ] as [keyof FormState, string][]).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={form[key] as boolean}
                      onChange={(e) => set(key, e.target.checked as FormState[typeof key])}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={key} className="text-sm text-slate-700 dark:text-slate-300">{label}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 4: Requirements ──────────────────────────────────── */}
            <div className={sectionCls}>
              <h3 className={sectionTitleCls}>Requirements</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`req-${key}`}
                      checked={form[key] as boolean}
                      onChange={(e) => set(key, e.target.checked as FormState[typeof key])}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`req-${key}`} className="text-sm text-slate-700 dark:text-slate-300">{label}</label>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
