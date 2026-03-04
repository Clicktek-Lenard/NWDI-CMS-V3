"use client";

import { Bell, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface HeaderProps {
  userName?: string;
  clinicName?: string;
}

export function Header({ userName = "User", clinicName = "Central" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Central Management System
        </h2>
        <p className="text-xs text-slate-500">{clinicName}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-full p-2 hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">{userName}</span>
        </div>

        {/* Sign out */}
        {/* <button
          onClick={() => signOut({ redirectTo: "/login" })}
          title="Sign out"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button> */}
      </div>
    </header>
  );
}
