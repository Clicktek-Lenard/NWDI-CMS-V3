"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface PatientResult {
  id: number;
  code: string | null;
  fullName: string | null;
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string;
  dob: string | null;
}

interface PatientFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the saved patient so the caller can auto-select it */
  onSaved: (patient: PatientResult) => void;
  /** If provided, the modal is in edit mode */
  patient?: PatientResult;
}

const EMPTY = {
  lastName: "",
  firstName: "",
  middleName: "",
  suffix: "",
  gender: "Male" as "Male" | "Female",
  dob: "",
  contactNo: "",
  email: "",
  address: "",
  philHealth: "",
  seniorId: "",
  pwd: "",
};

export function PatientFormModal({ open, onClose, onSaved, patient }: PatientFormModalProps) {
  const isEdit = !!patient;

  const [form, setForm] = useState({ ...EMPTY });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Seed form when editing or reset when creating
  useEffect(() => {
    if (open) {
      if (patient) {
        setForm({
          lastName:   patient.lastName,
          firstName:  patient.firstName,
          middleName: patient.middleName,
          suffix:     "",
          gender:     (patient.gender === "Female" ? "Female" : "Male"),
          dob:        patient.dob ?? "",
          contactNo:  "",
          email:      "",
          address:    "",
          philHealth: "",
          seniorId:   "",
          pwd:        "",
        });
      } else {
        setForm({ ...EMPTY });
      }
      setError("");
    }
  }, [open, patient]);

  function set(field: keyof typeof EMPTY, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.lastName.trim() || !form.firstName.trim() || !form.dob || !form.gender) {
      setError("Last name, first name, DOB, and gender are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url  = isEdit ? `/api/patients/${patient!.id}` : "/api/patients";
      const method = isEdit ? "PATCH" : "POST";
      const data = await apiFetch<PatientResult>(url, { method, body: form });
      onSaved(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save patient.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative mx-4 w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {isEdit ? "Edit Patient" : "New Patient"}
              </h3>
              <p className="text-xs text-slate-400">{isEdit ? "Update patient demographics" : "Register a new patient record"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </div>
          )}

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Last Name" required>
              <Input value={form.lastName} onChange={(v) => set("lastName", v)} placeholder="DELA CRUZ" />
            </Field>
            <Field label="First Name" required>
              <Input value={form.firstName} onChange={(v) => set("firstName", v)} placeholder="JUAN" />
            </Field>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Middle Name">
              <Input value={form.middleName} onChange={(v) => set("middleName", v)} placeholder="SANTOS" />
            </Field>
            <Field label="Suffix">
              <Input value={form.suffix} onChange={(v) => set("suffix", v)} placeholder="Jr., III…" />
            </Field>
          </div>

          {/* Gender + DOB */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Gender" required>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </Field>
            <Field label="Date of Birth" required>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </Field>
          </div>

          {/* Contact */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Contact No.">
              <Input value={form.contactNo} onChange={(v) => set("contactNo", v)} placeholder="09xxxxxxxxx" />
            </Field>
            <Field label="Email">
              <Input value={form.email} onChange={(v) => set("email", v)} placeholder="email@example.com" type="email" />
            </Field>
          </div>

          {/* Address */}
          <div className="mt-3">
            <Field label="Address">
              <Input value={form.address} onChange={(v) => set("address", v)} placeholder="Street, Barangay, City" />
            </Field>
          </div>

          {/* IDs */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Field label="PhilHealth ID">
              <Input value={form.philHealth} onChange={(v) => set("philHealth", v)} placeholder="" />
            </Field>
            <Field label="Senior ID">
              <Input value={form.seniorId} onChange={(v) => set("seniorId", v)} placeholder="" />
            </Field>
            <Field label="PWD ID">
              <Input value={form.pwd} onChange={(v) => set("pwd", v)} placeholder="" />
            </Field>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  {isEdit ? "Save Changes" : "Register Patient"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({
  value, onChange, placeholder, type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
    />
  );
}
