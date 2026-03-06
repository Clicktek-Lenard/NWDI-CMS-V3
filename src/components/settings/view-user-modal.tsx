"use client";

import { useEffect, useRef } from "react";
import { X, User, Mail, Building2, ShieldCheck, Clock, Tag, Key } from "lucide-react";
import { PERMISSION_GROUPS } from "./user-modal";
import type { UserRecord } from "./user-modal";

interface Props {
  open: boolean;
  user: UserRecord | null;
  onClose: () => void;
  onEdit: () => void;
}

function parsePermissions(role: string | null): string[] {
  if (!role) return [];
  try {
    const arr = JSON.parse(role);
    if (!Array.isArray(arr)) return [];
    if (arr.length > 0 && typeof arr[0] === "string") return arr as string[];
    return [];
  } catch {
    return [];
  }
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{value || "—"}</p>
      </div>
    </div>
  );
}

export function ViewUserModal({ open, user, onClose, onEdit }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !user) return null;

  const permissions = parsePermissions(user.role);
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "Unknown";
  const initials = [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("").toUpperCase() || user.username?.[0]?.toUpperCase() || "?";

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] flex flex-col dark:border-slate-700 dark:bg-slate-800">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">User Details</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5">
          {/* Avatar + name */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-blue-500/30">
              {initials}
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{fullName}</h4>
              <p className="text-sm text-slate-400 dark:text-slate-500">@{user.username}</p>
              <span
                className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.activated
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {user.activated ? "Active" : "Inactive"}
              </span>
              {user.ldap_import && (
                <span className="ml-1.5 mt-1 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  LDAP
                </span>
              )}
            </div>
          </div>

          {/* Info rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            <InfoRow icon={<User className="h-4 w-4" />} label="Full Name" value={fullName} />
            <InfoRow icon={<Key className="h-4 w-4" />} label="Username" value={user.username ?? ""} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email ?? ""} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Department" value={user.department ?? ""} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Created" value={formatDate(user.created_at)} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Last Updated" value={formatDate(user.updated_at)} />
          </div>

          {/* Permissions */}
          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Module Access</span>
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                {permissions.length} permission{permissions.length !== 1 ? "s" : ""}
              </span>
            </div>

            {permissions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400 dark:border-slate-600 dark:text-slate-500">
                No permissions assigned
              </div>
            ) : (
              <div className="space-y-3">
                {PERMISSION_GROUPS.map((group) => {
                  const granted = group.permissions.filter((p) =>
                    permissions.includes(p.role)
                  );
                  if (granted.length === 0) return null;
                  return (
                    <div key={group.group} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {group.group}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {granted.map((p) => (
                          <span
                            key={p.role}
                            title={p.role}
                            className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {p.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-[0.98]"
          >
            Edit User
          </button>
        </div>
      </div>
    </div>
  );
}
