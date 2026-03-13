"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Stethoscope,
  BarChart3,
  Settings,
  UserCheck,
  LogOut,
  Menu,
  X,
  CalendarCheck,
  History,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  module: string;
  tab?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Doctor",                href: "/clinical",       icon: <Stethoscope className="h-5 w-5" />,   module: "cms", tab: "clinical" },
  { label: "Today's Queue",         href: "/queue",          icon: <CalendarCheck className="h-5 w-5" />, module: "cms", tab: "queue" },
  { label: "Payment",               href: "/payment",        icon: <Receipt className="h-5 w-5" />,       module: "cms", tab: "payment" },
  { label: "Past Queue",            href: "/past-queue",     icon: <History className="h-5 w-5" />,       module: "cms", tab: "queue" },
  { label: "Card Management",       href: "/enrollment",     icon: <CreditCard className="h-5 w-5" />,    module: "cms", tab: "enrollment" },
  { label: "Physician Accreditation", href: "/eros/physician", icon: <UserCheck className="h-5 w-5" />, module: "erosui", tab: "physician" },
  { label: "Admin Settings",        href: "/settings",       icon: <Settings className="h-5 w-5" />,      module: "cms", tab: "settings" },
  { label: "Clinic Reports",        href: "/reports",        icon: <BarChart3 className="h-5 w-5" />,     module: "cms", tab: "reports" },
];

interface SidebarProps {
  userRoles?: string[];
}

export function Sidebar({ userRoles: _userRoles = [] }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-md bg-slate-800 p-2 text-white lg:hidden dark:bg-slate-700"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white transition-transform duration-200 lg:translate-x-0 dark:bg-slate-950 dark:border-r dark:border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-slate-700 dark:border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">CMS</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 w-full border-t border-slate-700 dark:border-slate-800 p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
