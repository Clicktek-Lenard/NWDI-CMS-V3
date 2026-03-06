"use client";

import { useState, useCallback, useEffect } from "react";
import {
  CreditCard, RefreshCw, Search, ChevronLeft, ChevronRight,
  CheckCircle, ArrowRightLeft, PackageCheck, ShieldCheck, Plus,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { RegisterCardModal } from "./register-card-modal";

interface CardEnrollment {
  id: number;
  cardNumber: string;
  companyCode: string;
  companyName: string;
  enrollmentDate: string | null;
  receivedBy: string | null;
  receivedDate: string | null;
  releaseTo: string | null;
  releaseBy: string | null;
  dateRelease: string | null;
  transferTo: string | null;
  transferBy: string | null;
  dateTransfer: string | null;
  status: number | null;
  dateReceived: string | null;
  ictReceived: string | null;
  lifecycle: "REGISTERED" | "RECEIVED" | "VERIFIED" | "TRANSFERRED";
}

type TabKey = "REGISTERED" | "RECEIVED" | "VERIFIED" | "TRANSFERRED";

interface ApiResponse {
  success: boolean;
  data: CardEnrollment[];
  total: number;
  totalPages: number;
}

function lifecycleBadge(lc: string) {
  const map: Record<string, string> = {
    REGISTERED:  "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    RECEIVED:    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    VERIFIED:    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    TRANSFERRED: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[lc] ?? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
      {lc}
    </span>
  );
}

function fmt(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

/** Returns the relevant "person" label and value per lifecycle tab */
function personCol(tab: TabKey, card: CardEnrollment): { label: string; value: string } {
  switch (tab) {
    case "RECEIVED":    return { label: "Received By",  value: card.receivedBy ?? "—" };
    case "VERIFIED":    return { label: "Released To",  value: card.releaseTo ?? "—" };
    case "TRANSFERRED": return { label: "Transferred To", value: card.transferTo ?? "—" };
    default:            return { label: "Enrolled",     value: "—" };
  }
}

/** Returns the relevant date per lifecycle tab */
function dateCol(tab: TabKey, card: CardEnrollment): string | null {
  switch (tab) {
    case "RECEIVED":    return card.receivedDate ?? card.dateReceived;
    case "VERIFIED":    return card.dateRelease;
    case "TRANSFERRED": return card.dateTransfer;
    default:            return card.enrollmentDate;
  }
}

export function EnrollmentClient() {
  const [activeTab, setActiveTab] = useState<TabKey>("REGISTERED");
  const [cards, setCards] = useState<CardEnrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        status: activeTab,
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (search) params.set("search", search);
      const json = await apiFetch<ApiResponse>(`/api/enrollment/cards?${params}`);
      setCards(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search]);

  useEffect(() => { setPage(1); }, [activeTab, search]);
  useEffect(() => { fetchCards(); }, [fetchCards]);

  async function handleAction(id: number, action: "receive" | "verify" | "transfer") {
    setActionLoading(id);
    setError("");
    try {
      await apiFetch(`/api/enrollment/cards/${id}/${action}`, { method: "PATCH" });
      await fetchCards();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  const TABS: { key: TabKey; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "REGISTERED",  label: "Registration", icon: <CreditCard className="h-4 w-4" />,     color: "amber"   },
    { key: "RECEIVED",    label: "Receiving",     icon: <PackageCheck className="h-4 w-4" />,   color: "blue"    },
    { key: "VERIFIED",    label: "Verification",  icon: <ShieldCheck className="h-4 w-4" />,    color: "emerald" },
    { key: "TRANSFERRED", label: "Transfer",      icon: <ArrowRightLeft className="h-4 w-4" />, color: "purple"  },
  ];

  const activeColor: Record<string, string> = {
    amber:   "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400",
    blue:    "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400",
    purple:  "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-900/10 dark:text-purple-400",
  };

  const colDateLabel: Record<TabKey, string> = {
    REGISTERED:  "Enrolled Date",
    RECEIVED:    "Received Date",
    VERIFIED:    "Release Date",
    TRANSFERRED: "Transfer Date",
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Card Enrollment</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Register, receive, verify, and transfer health cards</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCards} disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          {activeTab === "REGISTERED" && (
            <button onClick={() => setRegisterOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Register Card
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? `${activeColor[tab.color]} border-current`
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search card number or company..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400" />
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{total} record{total !== 1 ? "s" : ""}</span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">{error}</div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Card Number</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Company</th>
              {activeTab !== "REGISTERED" && (
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                  {personCol(activeTab, {} as CardEnrollment).label}
                </th>
              )}
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">{colDateLabel[activeTab]}</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">Loading...</td></tr>
            ) : cards.length === 0 ? (
              <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
                No {activeTab.toLowerCase()} cards found
              </td></tr>
            ) : cards.map((card) => (
              <tr key={card.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-700">
                <td className="px-4 py-3 font-mono text-slate-800 font-medium dark:text-slate-100">{card.cardNumber}</td>
                <td className="px-4 py-3">
                  <div className="text-slate-700 dark:text-slate-200">{card.companyName || "—"}</div>
                  <div className="text-xs text-slate-400">{card.companyCode}</div>
                </td>
                {activeTab !== "REGISTERED" && (
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                    {personCol(activeTab, card).value}
                  </td>
                )}
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                  {fmt(dateCol(activeTab, card))}
                </td>
                <td className="px-4 py-3">{lifecycleBadge(card.lifecycle)}</td>
                <td className="px-4 py-3 text-right">
                  {activeTab === "REGISTERED" && (
                    <button onClick={() => handleAction(card.id, "receive")}
                      disabled={actionLoading === card.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                      <PackageCheck className="h-3.5 w-3.5" />
                      {actionLoading === card.id ? "..." : "Mark Received"}
                    </button>
                  )}
                  {activeTab === "RECEIVED" && (
                    <button onClick={() => handleAction(card.id, "verify")}
                      disabled={actionLoading === card.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {actionLoading === card.id ? "..." : "Verify"}
                    </button>
                  )}
                  {activeTab === "VERIFIED" && (
                    <button onClick={() => handleAction(card.id, "transfer")}
                      disabled={actionLoading === card.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50">
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                      {actionLoading === card.id ? "..." : "Transfer"}
                    </button>
                  )}
                  {activeTab === "TRANSFERRED" && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">Complete</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-700">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <RegisterCardModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegistered={() => { fetchCards(); }}
      />
    </div>
  );
}
