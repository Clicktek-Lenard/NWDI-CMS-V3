"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export interface PatientResult {
  id: number;
  code: string | null;
  fullName: string | null;
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string;
  dob: string | null;
  pictureLink?: string | null;
}

interface DuplicatePatient {
  id: number;
  code: string | null;
  fullName: string | null;
  dob: string | null;
  contactNo: string;
  pictureLink: string | null;
  score: number;
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

  // Photo state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState<DuplicatePatient[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [duplicateConfirmed, setDuplicateConfirmed] = useState(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const streamRef = useRef<MediaStream | null>(null);

  // Seed form when editing or reset when creating
  useEffect(() => {
    if (open) {
      if (patient) {
        setForm({
          lastName:   patient.lastName,
          firstName:  patient.firstName,
          middleName: patient.middleName,
          suffix:     "",
          gender:     (patient.gender === "Female" || patient.gender === "F" ? "Female" : "Male"),
          dob:        patient.dob ?? "",
          contactNo:  "",
          email:      "",
          address:    "",
          philHealth: "",
          seniorId:   "",
          pwd:        "",
        });
        setPhotoPreview(patient.pictureLink ?? null);
      } else {
        setForm({ ...EMPTY });
        setPhotoPreview(null);
      }
      setPhotoFile(null);
      setError("");
      setDuplicates([]);
      setDuplicateConfirmed(false);
    }
  }, [open, patient]);

  // Duplicate detection — debounced, only in create mode
  const checkDuplicates = useCallback(async (lastName: string, firstName: string, dob: string) => {
    if (!lastName.trim() || !firstName.trim() || !dob) {
      setDuplicates([]);
      return;
    }
    setCheckingDuplicates(true);
    try {
      const params = new URLSearchParams({ firstName, lastName, dob });
      const res = await apiFetch<{ duplicates: DuplicatePatient[] }>(`/api/patients/duplicates?${params}`);
      setDuplicates(res.duplicates ?? []);
    } catch {
      setDuplicates([]);
    } finally {
      setCheckingDuplicates(false);
    }
  }, []);

  useEffect(() => {
    if (isEdit || !open) return;
    setDuplicateConfirmed(false); // reset confirmation whenever fields change
    const timer = setTimeout(() => {
      checkDuplicates(form.lastName, form.firstName, form.dob);
    }, 600);
    return () => clearTimeout(timer);
  }, [form.lastName, form.firstName, form.dob, isEdit, open, checkDuplicates]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function uploadPhoto(patientId: number) {
    if (!photoFile) return;
    setPhotoUploading(true);
    const fd = new FormData();
    fd.append("photo", photoFile);
    try {
      await fetch(`/api/patients/${patientId}/photo`, { method: "POST", body: fd });
    } catch {
      // non-fatal — patient saved, photo can be re-uploaded
    } finally {
      setPhotoUploading(false);
    }
  }

  async function openCamera() {
    setCameraError("");
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setCameraError("Could not access camera. Check browser permissions.");
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraError("");
  }

  function capturePhoto() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(blob));
      closeCamera();
    }, "image/jpeg", 0.92);
  }

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
      const data = await apiFetch<PatientResult>(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (photoFile) await uploadPhoto(data.id);
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

          {/* Duplicate warning banner — create mode only */}
          {!isEdit && duplicates.length > 0 && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-700/50 dark:bg-amber-900/20">
              <div className="flex items-start gap-2 px-3 py-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Possible duplicate{duplicates.length > 1 ? "s" : ""} found
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                    {duplicates.length} existing patient{duplicates.length > 1 ? "s" : ""} match this name and date of birth.
                    {duplicateConfirmed
                      ? " Registration unlocked — you may proceed."
                      : " Click \"Save Anyway\" below to confirm this is a new patient."}
                  </p>
                </div>
                {checkingDuplicates && (
                  <svg className="h-4 w-4 animate-spin text-amber-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
              </div>
              <ul className="divide-y divide-amber-100 dark:divide-amber-800/40 border-t border-amber-100 dark:border-amber-700/40">
                {duplicates.slice(0, 3).map((dup) => (
                  <li key={dup.id} className="flex items-center gap-3 px-3 py-2">
                    {dup.pictureLink ? (
                      <img src={dup.pictureLink} alt="" className="h-8 w-8 rounded-lg object-cover flex-shrink-0 border border-amber-200 dark:border-amber-700" />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-800/40">
                        <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-amber-900 dark:text-amber-200 truncate">{dup.fullName}</p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">
                        DOB: {dup.dob} · {dup.code ?? "—"} · {dup.score}% match
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {!duplicateConfirmed ? (
                <div className="border-t border-amber-100 dark:border-amber-700/40 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setDuplicateConfirmed(true)}
                    className="w-full rounded-lg border border-amber-400 bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/60"
                  >
                    Save Anyway — This is a new, unique patient
                  </button>
                </div>
              ) : (
                <div className="border-t border-amber-100 dark:border-amber-700/40 px-3 py-2">
                  <p className="text-center text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    ✓ Confirmed — registration is enabled
                  </p>
                </div>
              )}
            </div>
          )}

          {!isEdit && checkingDuplicates && duplicates.length === 0 && (
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking for duplicates…
            </div>
          )}

          {/* Photo upload */}
          <div className="mb-5 flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Patient photo"
                  className="h-20 w-20 rounded-xl object-cover border border-slate-200 dark:border-slate-600"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-600">
                  <svg className="h-9 w-9 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              )}
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(null); setPhotoFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                  title="Remove photo"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Patient Photo</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload
                </button>
                <button
                  type="button"
                  onClick={openCamera}
                  disabled={photoUploading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  Camera
                </button>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">JPG/PNG · max 5 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

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
              disabled={submitting || (!isEdit && duplicates.length > 0 && !duplicateConfirmed)}
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

      {/* Hidden canvas for webcam capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera overlay */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Take Photo</h4>
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {cameraError ? (
              <div className="flex items-center gap-2 rounded-lg bg-red-900/40 px-3 py-3 text-xs text-red-300">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                {cameraError}
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-xl bg-black"
                  style={{ aspectRatio: "4/3" }}
                />
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  Capture
                </button>
              </>
            )}
          </div>
        </div>
      )}
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
