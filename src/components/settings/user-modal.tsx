"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, X, UserPlus, Pencil, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

// ── Role groups (actual production role tags) ─────────────────
export const PERMISSION_GROUPS: Array<{
  group: string;
  permissions: Array<{ role: string; label: string }>;
}> = [
  {
    group: "Card Enrollment",
    permissions: [
      { role: "[CARD-REGISTRATION]",      label: "Registration" },
      { role: "[CARD-RECEIVING]",         label: "Receiving" },
      { role: "[CARD-RECEIVED]",          label: "Received" },
      { role: "[CARD-VERIFICATION]",      label: "Verification" },
      { role: "[CARD-TRANSFER]",          label: "Transfer" },
      { role: "[CARD-SEARCH]",            label: "Search" },
      { role: "[CARDNUMBER]",             label: "Card Numbers" },
      { role: "[CARD-PAGES]",             label: "Card Pages" },
      { role: "[CARD-AGENTSALES]",        label: "Agent Sales" },
      { role: "[REPORTS-CARDMANAGEMENT]", label: "Reports: Card Mgmt" },
      { role: "[DISTRIBUTION]",           label: "Distribution" },
      { role: "[VERIFIED]",               label: "Verified" },
      { role: "[VERIFIED-TEST]",          label: "Verified (Test)" },
    ],
  },
  {
    group: "Queue & Reception",
    permissions: [
      { role: "[QUEUE]",          label: "Queue" },
      { role: "[PASTQUEUE]",      label: "Past Queue" },
      { role: "[KIOSK-RECEPTION]",label: "Kiosk Reception" },
      { role: "[RECEPTION-OIC]",  label: "Reception OIC" },
      { role: "[PAGES]",          label: "Pages" },
    ],
  },
  {
    group: "Clinical",
    permissions: [
      { role: "[NURSE]",           label: "Nurse" },
      { role: "[DOCTOR]",          label: "Doctor" },
      { role: "[DOCTORS-SOAP]",    label: "Doctor SOAP" },
      { role: "[DOCTORS-HISTORY]", label: "Doctor History" },
      { role: "[DOCTORS-EVAL]",    label: "Doctor Eval" },
      { role: "[IMDOIC]",          label: "IMD OIC" },
      { role: "[IMDCMS]",          label: "IMD CMS" },
    ],
  },
  {
    group: "Laboratory & Results",
    permissions: [
      { role: "[LABORATORY]",          label: "Laboratory" },
      { role: "[RESULTS-ENTRY]",       label: "Results Entry" },
      { role: "[RESULTSMONITORING]",   label: "Results Monitoring" },
      { role: "[RESULTUPLOADING]",     label: "Results Uploading" },
      { role: "[SENDOUT]",             label: "Sendout" },
      { role: "[BRANCHSENDOUT]",       label: "Branch Sendout" },
      { role: "[LAB-RECIEVING]",       label: "Lab Receiving" },
      { role: "[LAB-RELEASING]",       label: "Lab Releasing" },
      { role: "[LAB-RELEASING-VIEW]",  label: "Lab Releasing (View)" },
      { role: "[LAB-RESULT]",          label: "Lab Result" },
      { role: "[LAB-RESULT-PRINT]",    label: "Lab Result Print" },
      { role: "[USERHCLAB]",           label: "HC Lab User" },
    ],
  },
  {
    group: "Imaging & Radiology",
    permissions: [
      { role: "[RADIOLOGY]",           label: "Radiology" },
      { role: "[IMAGING]",             label: "Imaging" },
      { role: "[IMAGING-RESULT-ENTRY]",label: "Imaging Result Entry" },
      { role: "[XRAY]",                label: "X-Ray" },
    ],
  },
  {
    group: "Payment",
    permissions: [
      { role: "[PAYMENT]",           label: "Payment" },
      { role: "[PASTPAYMENT]",       label: "Past Payment" },
      { role: "[REPORTS-DAILYSALES]",label: "Reports: Daily Sales" },
    ],
  },
  {
    group: "Patient",
    permissions: [
      { role: "[PATIENT]",      label: "Patient" },
      { role: "[PATIENT-VIEW]", label: "Patient (View)" },
    ],
  },
  {
    group: "Company (EROS)",
    permissions: [
      { role: "[COMPANY]",          label: "Company" },
      { role: "[COMPANY-VIEW]",     label: "Company (View)" },
      { role: "[SERVICEAGREEMENT]", label: "Service Agreement" },
      { role: "[USEREROS]",         label: "EROS User" },
    ],
  },
  {
    group: "Physician (EROS)",
    permissions: [
      { role: "[PHYSICIAN]",          label: "Physician" },
      { role: "[PHYSICIAN-APPROVER]", label: "Physician Approver" },
      { role: "[PHYSICIAN-VIEW]",     label: "Physician (View)" },
    ],
  },
  {
    group: "Item Master (EROS)",
    permissions: [
      { role: "[ITEMMASTER]", label: "Item Master" },
    ],
  },
  {
    group: "System Access",
    permissions: [
      { role: "[USERCMS]", label: "CMS User" },
    ],
  },
  {
    group: "Branches",
    permissions: [
      { role: "[SMB-BRANCH]", label: "SMB" },
      { role: "[LIN-BRANCH]", label: "LIN" },
      { role: "[MLB-BRANCH]", label: "MLB" },
      { role: "[BAE-BRANCH]", label: "BAE" },
      { role: "[TAR-BRANCH]", label: "TAR" },
      { role: "[UAT-BRANCH]", label: "UAT" },
    ],
  },
];

// ── Schema ────────────────────────────────────────────────────
const addSchema = z.object({
  username: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  department: z.string().optional(),
  password: z.string().min(6, "Minimum 6 characters"),
  activated: z.boolean(),
  permissions: z.array(z.string()),
});

const editSchema = addSchema.extend({
  password: z.string().min(6, "Minimum 6 characters").or(z.literal("")).optional(),
});

type AddFormValues = z.infer<typeof addSchema>;
type EditFormValues = z.infer<typeof editSchema>;
type FormValues = AddFormValues | EditFormValues;

// ── User type from API ────────────────────────────────────────
export interface UserRecord {
  id: number;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  role: string | null;
  activated: boolean;
  ldap_import: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface Props {
  open: boolean;
  mode: "add" | "edit";
  user?: UserRecord;
  onClose: () => void;
  onSaved: () => void;
}

// ── Field component ───────────────────────────────────────────
function Field({
  label,
  required,
  error,
  children,
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
const INPUT_VALID = "border-slate-200 hover:border-slate-300 focus:border-blue-400 dark:border-slate-600 dark:hover:border-slate-500";
const INPUT_ERROR = "border-red-300 focus:border-red-400";

// ── Modal ─────────────────────────────────────────────────────
export function UserModal({ open, mode, user, onClose, onSaved }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const isEdit = mode === "edit";
  const schema = isEdit ? editSchema : addSchema;

  const defaultPermissions = (): string[] => {
    if (!user?.role) return [];
    try {
      const parsed = JSON.parse(user.role);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
        return parsed as string[];
      }
      return [];
    } catch {
      return [];
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      department: "",
      password: "",
      activated: true,
      permissions: [],
    },
  });

  const selectedPerms = watch("permissions") as string[];

  // Populate form when editing
  useEffect(() => {
    if (!open) return;
    setApiError("");
    setShowPassword(false);

    if (isEdit && user) {
      reset({
        username: user.username ?? "",
        email: user.email ?? "",
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        department: user.department ?? "",
        password: "",
        activated: Boolean(user.activated),
        permissions: defaultPermissions(),
      });
    } else {
      reset({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        department: "",
        password: "",
        activated: true,
        permissions: [],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, user]);

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function togglePermission(role: string) {
    const current = selectedPerms ?? [];
    if (current.includes(role)) {
      setValue("permissions", current.filter((r) => r !== role));
    } else {
      setValue("permissions", [...current, role]);
    }
  }

  function toggleGroup(groupPerms: Array<{ role: string }>) {
    const roles = groupPerms.map((p) => p.role);
    const allSelected = roles.every((r) => selectedPerms?.includes(r));
    if (allSelected) {
      setValue("permissions", (selectedPerms ?? []).filter((r) => !roles.includes(r)));
    } else {
      setValue("permissions", Array.from(new Set([...(selectedPerms ?? []), ...roles])));
    }
  }

  async function onSubmit(data: FormValues) {
    setApiError("");

    const payload: Record<string, unknown> = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      department: data.department,
      role: JSON.stringify(data.permissions ?? []),
      activated: data.activated,
    };

    if (!isEdit) {
      payload.username = (data as AddFormValues).username;
      payload.password = (data as AddFormValues).password;
    } else if (data.password) {
      payload.password = data.password;
    }

    const url = isEdit ? `/api/users/${user!.id}` : "/api/users";
    const method = isEdit ? "PUT" : "POST";

    try {
      await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSaved();
      onClose();
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "An error occurred");
    }
  }

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col dark:border-slate-700 dark:bg-slate-800">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isEdit ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}>
              {isEdit
                ? <Pencil className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                : <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {isEdit ? "Edit User" : "Add New User"}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {isEdit ? `Editing @${user?.username}` : "Create a new system user"}
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

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5">
          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <X className="h-4 w-4 shrink-0" />
              {apiError}
            </div>
          )}

          <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Basic info grid */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" required error={errors.first_name?.message as string}>
                <input
                  {...register("first_name")}
                  placeholder="Juan"
                  className={`${INPUT_CLS} ${errors.first_name ? INPUT_ERROR : INPUT_VALID}`}
                />
              </Field>
              <Field label="Last Name" required error={errors.last_name?.message as string}>
                <input
                  {...register("last_name")}
                  placeholder="Dela Cruz"
                  className={`${INPUT_CLS} ${errors.last_name ? INPUT_ERROR : INPUT_VALID}`}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Username" required error={errors.username?.message as string}>
                <input
                  {...register("username")}
                  placeholder="jdelacruz"
                  disabled={isEdit}
                  className={`${INPUT_CLS} ${errors.username ? INPUT_ERROR : INPUT_VALID} ${isEdit ? "cursor-not-allowed bg-slate-50 text-slate-400 dark:bg-slate-600 dark:text-slate-500" : ""}`}
                />
              </Field>
              <Field label="Department" error={(errors as Record<string, { message?: string }>).department?.message}>
                <input
                  {...register("department")}
                  placeholder="Laboratory"
                  className={`${INPUT_CLS} ${INPUT_VALID}`}
                />
              </Field>
            </div>

            <Field label="Email Address" error={(errors as Record<string, { message?: string }>).email?.message}>
              <input
                {...register("email")}
                type="email"
                placeholder="jdelacruz@hospital.com"
                className={`${INPUT_CLS} ${INPUT_VALID}`}
              />
            </Field>

            <Field
              label={isEdit ? "New Password" : "Password"}
              required={!isEdit}
              error={(errors as Record<string, { message?: string }>).password?.message}
            >
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={isEdit ? "Leave blank to keep current" : "Min. 6 characters"}
                  className={`${INPUT_CLS} pr-10 ${(errors as Record<string, { message?: string }>).password ? INPUT_ERROR : INPUT_VALID}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {/* Status toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-700/50">
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Account Active</span>
                <p className="text-xs text-slate-400 dark:text-slate-500">Inactive users cannot log in</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" {...register("activated")} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-emerald-400/20 dark:bg-slate-600" />
              </label>
            </div>

            {/* Role permissions */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Role Permissions</p>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {selectedPerms?.length ?? 0} selected
                </span>
              </div>
              <div className="space-y-3">
                {PERMISSION_GROUPS.map((group) => {
                  const groupRoles = group.permissions.map((p) => p.role);
                  const allSelected = groupRoles.every((r) => selectedPerms?.includes(r));
                  const someSelected = groupRoles.some((r) => selectedPerms?.includes(r));

                  return (
                    <div key={group.group} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {group.group}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.permissions)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {allSelected ? "Deselect all" : someSelected ? "Select all" : "Select all"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.permissions.map((perm) => {
                          const selected = selectedPerms?.includes(perm.role);
                          return (
                            <button
                              key={perm.role}
                              type="button"
                              onClick={() => togglePermission(perm.role)}
                              title={perm.role}
                              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                selected
                                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                              }`}
                            >
                              {perm.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
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
            form="user-form"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
              isEdit
                ? "bg-amber-500 shadow-amber-500/20 hover:bg-amber-600"
                : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
            }`}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
