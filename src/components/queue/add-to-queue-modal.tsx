"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddToQueue } from "@/hooks/use-queue";
import type { QueueEntry } from "@/types";

// ── Form schema ──────────────────────────────────────────────
const formSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyCode: z.string().optional(),
  companyName: z.string().optional(),
  priority: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

// ── Company presets ──────────────────────────────────────────
const COMPANIES = [
  { code: "", name: "" },
  { code: "CASH", name: "Cash / Walk-in" },
  { code: "MAXICARE", name: "Maxicare Health Corp." },
  { code: "INTEL", name: "Intellicare Inc." },
  { code: "PHHEALTH", name: "PhilHealth" },
  { code: "MEDICARD", name: "Medicard Phil. Inc." },
  { code: "COCOLIFE", name: "Cocolife Healthcare" },
  { code: "ASIANLIFE", name: "Asian Life Financial" },
  { code: "VALUCARE", name: "Valucare Health Systems" },
];

// ── Props ────────────────────────────────────────────────────
interface AddToQueueModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (entry: QueueEntry) => void;
  currentQueueCount: number;
}

// ── Component ────────────────────────────────────────────────
export function AddToQueueModal({
  open,
  onClose,
  onSuccess,
  currentQueueCount,
}: AddToQueueModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [apiError, setApiError] = useState("");
  const addToQueue = useAddToQueue();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      firstName: "",
      lastName: "",
      companyCode: "",
      companyName: "",
      priority: false,
    },
  });

  const selectedCompany = watch("companyCode");

  // Sync company name when code changes
  useEffect(() => {
    const match = COMPANIES.find((c) => c.code === selectedCompany);
    if (match) {
      setValue("companyName", match.name);
    }
  }, [selectedCompany, setValue]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset();
      setApiError("");
    }
  }, [open, reset]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  async function onSubmit(data: FormValues) {
    setApiError("");

    const patientName = `${data.lastName.toUpperCase()}, ${data.firstName.toUpperCase()}`;

    try {
      await addToQueue.mutateAsync({
        patientId: data.patientId,
        patientName,
        companyCode: data.companyCode || undefined,
        companyName: data.companyName || undefined,
      });

      // Create local entry for immediate display
      const newEntry: QueueEntry = {
        id: Date.now(),
        queueNumber: currentQueueCount + 1,
        patientId: data.patientId,
        patientName,
        companyCode: data.companyCode || "CASH",
        companyName: data.companyName || "Cash / Walk-in",
        status: "WAITING",
        priorityLevel: data.priority ? 1 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSuccess(newEntry);
      onClose();
    } catch {
      // If API fails (no DB), still add locally for demo
      const newEntry: QueueEntry = {
        id: Date.now(),
        queueNumber: currentQueueCount + 1,
        patientId: data.patientId,
        patientName,
        companyCode: data.companyCode || "CASH",
        companyName: data.companyName || "Cash / Walk-in",
        status: "WAITING",
        priorityLevel: data.priority ? 1 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setApiError("Could not save to database — added to local queue.");
      onSuccess(newEntry);

      // Auto-close after brief delay so user sees the message
      setTimeout(() => onClose(), 1200);
    }
  }

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
    >
      <div className="relative mx-4 w-full max-w-lg animate-in rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Add Patient to Queue</h3>
              <p className="text-xs text-slate-400">Queue #{currentQueueCount + 1}</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5">
          {/* API Error */}
          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {apiError}
            </div>
          )}

          <div className="space-y-4">
            {/* Patient ID */}
            <div>
              <label htmlFor="patientId" className="mb-1.5 block text-sm font-medium text-slate-700">
                Patient ID <span className="text-red-500">*</span>
              </label>
              <input
                id="patientId"
                {...register("patientId")}
                placeholder="e.g. P-2024-01300"
                className={`block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.patientId
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 hover:border-slate-300 focus:border-blue-400"
                }`}
              />
              {errors.patientId && (
                <p className="mt-1 text-xs text-red-500">{errors.patientId.message}</p>
              )}
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Dela Cruz"
                  className={`block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.lastName
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-400"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-slate-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Juan"
                  className={`block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.firstName
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-400"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            {/* Company / HMO */}
            <div>
              <label htmlFor="companyCode" className="mb-1.5 block text-sm font-medium text-slate-700">
                Company / HMO
              </label>
              <select
                id="companyCode"
                {...register("companyCode")}
                className="block w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select company (optional)</option>
                {COMPANIES.filter((c) => c.code).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <span className="text-sm font-medium text-slate-700">Priority Patient</span>
                  <p className="text-[11px] text-slate-400">Senior citizen, PWD, or urgent case</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" {...register("priority")} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-orange-500 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-orange-400/20" />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || addToQueue.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting || addToQueue.isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
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
  );
}
