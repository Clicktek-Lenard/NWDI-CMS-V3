"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, X, UserPlus, Pencil, Loader2 } from "lucide-react";

// ── Permission definitions ────────────────────────────────────
export const PERMISSION_GROUPS = [
  {
    group: "CMS",
    permissions: [
      { module: "cms", tab: "queue", label: "Queue" },
      { module: "cms", tab: "enrollment", label: "Enrollment" },
      { module: "cms", tab: "payment", label: "Payment" },
      { module: "cms", tab: "results", label: "Results" },
      { module: "cms", tab: "clinical", label: "Clinical" },
      { module: "cms", tab: "settings", label: "Settings" },
      { module: "cms", tab: "reports", label: "Reports" },
    ],
  },
  {
    group: "EROS",
    permissions: [
      { module: "erosui", tab: "company", label: "Company" },
      { module: "erosui", tab: "physician", label: "Physician" },
      { module: "erosui", tab: "itemmasterlist", label: "Item Master" },
    ],
  },
];

export type UserRole = { module: string; tab: string };

function permKey(module: string, tab: string) {
  return `${module}:${tab}`;
}

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
  activated: number;
  ldap_import: number;
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
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const INPUT_CLS =
  "block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const INPUT_VALID = "border-slate-200 hover:border-slate-300 focus:border-blue-400";
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
      const roles: UserRole[] = JSON.parse(user.role);
      return roles.map((r) => permKey(r.module, r.tab));
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
        activated: user.activated === 1,
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

  function togglePermission(key: string) {
    const current = selectedPerms ?? [];
    if (current.includes(key)) {
      setValue("permissions", current.filter((k) => k !== key));
    } else {
      setValue("permissions", [...current, key]);
    }
  }

  function toggleGroup(groupPerms: { module: string; tab: string }[]) {
    const keys = groupPerms.map((p) => permKey(p.module, p.tab));
    const allSelected = keys.every((k) => selectedPerms?.includes(k));
    if (allSelected) {
      setValue("permissions", (selectedPerms ?? []).filter((k) => !keys.includes(k)));
    } else {
      const merged = Array.from(new Set([...(selectedPerms ?? []), ...keys]));
      setValue("permissions", merged);
    }
  }

  async function onSubmit(data: FormValues) {
    setApiError("");

    const roleArray: UserRole[] = (data.permissions ?? []).map((key) => {
      const [module, tab] = key.split(":");
      return { module, tab };
    });

    const payload: Record<string, unknown> = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      department: data.department,
      role: JSON.stringify(roleArray),
      activated: data.activated ? 1 : 0,
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
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setApiError(json.error || "An error occurred");
        return;
      }

      onSaved();
      onClose();
    } catch {
      setApiError("Network error — please try again");
    }
  }

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isEdit ? "bg-amber-100" : "bg-blue-100"}`}>
              {isEdit
                ? <Pencil className="h-5 w-5 text-amber-600" />
                : <UserPlus className="h-5 w-5 text-blue-600" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {isEdit ? "Edit User" : "Add New User"}
              </h3>
              <p className="text-xs text-slate-400">
                {isEdit ? `Editing @${user?.username}` : "Create a new system user"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5">
          {/* API error */}
          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
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
                  className={`${INPUT_CLS} ${errors.username ? INPUT_ERROR : INPUT_VALID} ${isEdit ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""}`}
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {/* Status toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
              <div>
                <span className="text-sm font-medium text-slate-700">Account Active</span>
                <p className="text-xs text-slate-400">Inactive users cannot log in</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" {...register("activated")} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-emerald-400/20" />
              </label>
            </div>

            {/* Permissions */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Module Permissions</p>
              <div className="space-y-3">
                {PERMISSION_GROUPS.map((group) => {
                  const keys = group.permissions.map((p) => permKey(p.module, p.tab));
                  const allSelected = keys.every((k) => selectedPerms?.includes(k));
                  const someSelected = keys.some((k) => selectedPerms?.includes(k));

                  return (
                    <div key={group.group} className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {group.group}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.permissions)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          {allSelected ? "Deselect all" : someSelected ? "Select all" : "Select all"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.permissions.map((perm) => {
                          const key = permKey(perm.module, perm.tab);
                          const selected = selectedPerms?.includes(key);
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => togglePermission(key)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                selected
                                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
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
