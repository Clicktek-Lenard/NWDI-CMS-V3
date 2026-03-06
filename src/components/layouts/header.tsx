"use client";

import { MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  userName?: string;
  clinicName?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Header({ userName = "User", clinicName = "—" }: HeaderProps) {
  const initials = getInitials(userName);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Central Management System
        </h2>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MapPin className="h-3 w-3 text-slate-400" />
          <p className="text-xs text-slate-500 dark:text-slate-400">{clinicName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-800 leading-tight dark:text-slate-100">{userName}</span>
            <span className="text-[11px] text-slate-400 leading-tight">Logged in</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
