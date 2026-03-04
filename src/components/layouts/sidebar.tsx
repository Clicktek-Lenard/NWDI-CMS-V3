"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  CreditCard,
  ClipboardList,
  FileText,
  Stethoscope,
  BarChart3,
  Settings,
  Building2,
  LogOut,
  Menu,
  X,
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
  {
    label: "Queue",
    href: "/cms/queue",
    icon: <ClipboardList className="h-5 w-5" />,
    module: "cms",
    tab: "queue",
  },
  {
    label: "Enrollment",
    href: "/enrollment",
    icon: <CreditCard className="h-5 w-5" />,
    module: "cms",
    tab: "enrollment",
  },
  {
    label: "Payment",
    href: "/payment",
    icon: <FileText className="h-5 w-5" />,
    module: "cms",
    tab: "payment",
  },
  {
    label: "Results",
    href: "/results",
    icon: <FileText className="h-5 w-5" />,
    module: "cms",
    tab: "results",
  },
  {
    label: "Clinical",
    href: "/clinical",
    icon: <Stethoscope className="h-5 w-5" />,
    module: "cms",
    tab: "clinical",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <BarChart3 className="h-5 w-5" />,
    module: "cms",
    tab: "reports",
  },
  {
    label: "EROS",
    href: "/eros/company",
    icon: <Building2 className="h-5 w-5" />,
    module: "erosui",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    module: "cms",
    tab: "settings",
  },
];

interface SidebarProps {
  userRoles?: string[];
}

export function Sidebar({ userRoles = [] }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-md bg-slate-800 p-2 text-white lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-slate-700">
          <h1 className="text-xl font-bold">CMS</h1>
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
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
          <button
            onClick={() => signOut({ redirectTo: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
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
