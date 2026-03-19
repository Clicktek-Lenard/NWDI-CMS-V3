"use client";

import Link from "next/link";
import {
  Users, FlaskConical, Scan, Activity, Stethoscope, PackageCheck, Lock,
} from "lucide-react";

interface Department {
  key: string;
  label: string;
  href: string;
  department: string;
  color: string;
  allowed: boolean;
}

interface Props {
  departments: Department[];
}

const ICONS: Record<string, React.ReactNode> = {
  reception:    <Users className="h-8 w-8" />,
  extraction:   <FlaskConical className="h-8 w-8" />,
  imaging:      <Scan className="h-8 w-8" />,
  vitalsigns:   <Activity className="h-8 w-8" />,
  consultation: <Stethoscope className="h-8 w-8" />,
  releasing:    <PackageCheck className="h-8 w-8" />,
};

const COLOR_MAP: Record<string, { card: string; icon: string; badge: string }> = {
  blue:    { card: "border-blue-200 dark:border-blue-800",    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",    badge: "bg-blue-600 hover:bg-blue-700" },
  purple:  { card: "border-purple-200 dark:border-purple-800", icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", badge: "bg-purple-600 hover:bg-purple-700" },
  indigo:  { card: "border-indigo-200 dark:border-indigo-800", icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400", badge: "bg-indigo-600 hover:bg-indigo-700" },
  emerald: { card: "border-emerald-200 dark:border-emerald-800", icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", badge: "bg-emerald-600 hover:bg-emerald-700" },
  amber:   { card: "border-amber-200 dark:border-amber-800",  icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",  badge: "bg-amber-500 hover:bg-amber-600" },
  rose:    { card: "border-rose-200 dark:border-rose-800",    icon: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",    badge: "bg-rose-600 hover:bg-rose-700" },
};

export function KioskLandingClient({ departments }: Props) {
  const allowed = departments.filter((d) => d.allowed);
  const locked  = departments.filter((d) => !d.allowed);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Queueing — Kiosk</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Select your department queue station</p>
      </div>

      {allowed.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
          Your account does not have any kiosk queue roles assigned. Contact ICT to add the required <code>[KIOSK-*]</code> role tag to your account.
        </div>
      )}

      {allowed.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Your Queues</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allowed.map((dept) => {
              const colors = COLOR_MAP[dept.color] ?? COLOR_MAP.blue;
              return (
                <Link
                  key={dept.key}
                  href={dept.href}
                  className={`group flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800 ${colors.card}`}
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${colors.icon}`}>
                    {ICONS[dept.key]}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{dept.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Department: {dept.department}</p>
                  </div>
                  <span className={`self-start rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors ${colors.badge}`}>
                    Open Queue →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">No Access</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((dept) => (
              <div
                key={dept.key}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 opacity-50 dark:border-slate-700 dark:bg-slate-800/50"
              >
                <Lock className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{dept.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Role not assigned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
