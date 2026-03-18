"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Banknote,
  AlertTriangle,
  FlaskConical,
  RefreshCw,
  SendHorizonal,
} from "lucide-react";

interface TrendDay {
  date:    string;
  label:   string;
  visits:  number;
  revenue: number;
}

interface DashboardStats {
  today: {
    total:      number;
    waiting:    number;
    paid:       number;
    cancelled:  number;
    inProgress: number;
  };
  revenue: {
    total:            number;
    transactionCount: number;
  };
  amendments: {
    pending: number;
  };
  specimen: {
    forSpecimen:       number;
    accessionAssigned: number;
    received:          number;
    released:          number;
  };
  trend: TrendDay[];
  generatedAt: string;
}

function formatCurrency(n: number) {
  return n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

interface StatCardProps {
  label:    string;
  value:    string | number;
  sub?:     string;
  icon:     React.ReactNode;
  color:    string; // tailwind bg/text classes
  alert?:   boolean;
}

// ── Trend Chart (SVG sparkline, no external deps) ──────────────────────────

function TrendChart({ data, valueKey, color, label }: {
  data: TrendDay[];
  valueKey: "visits" | "revenue";
  color: string;
  label: string;
}) {
  const values = data.map((d) => d[valueKey]);
  const max    = Math.max(...values, 1);
  const W = 320;
  const H = 80;
  const pad = 6;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;
  const n = data.length;

  const pts = values.map((v, i) => ({
    x: pad + (i / (n - 1)) * innerW,
    y: pad + (1 - v / max) * innerH,
    v,
    label: data[i].label,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${pts[pts.length - 1].x.toFixed(1)},${(H - pad).toFixed(1)} L${pts[0].x.toFixed(1)},${(H - pad).toFixed(1)} Z`;

  const fmt = valueKey === "revenue"
    ? (v: number) => `₱${(v / 1000).toFixed(1)}k`
    : (v: number) => String(v);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: H }}>
        {/* Area fill */}
        <path d={areaD} fill={color} fillOpacity="0.12" />
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* Data points */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={color} />
            {/* Value label on top of each point */}
            <text
              x={p.x} y={p.y - 7}
              textAnchor="middle"
              fontSize="9"
              fill={color}
              fontWeight="600"
            >{fmt(p.v)}</text>
            {/* X-axis label */}
            <text
              x={p.x} y={H + 2}
              textAnchor="middle"
              fontSize="8.5"
              fill="#94a3b8"
            >{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function StatCard({ label, value, sub, icon, color, alert }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${alert ? "border-amber-300 dark:border-amber-700" : "border-slate-200 dark:border-slate-700"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ${color}`}>
          {icon}
        </div>
      </div>
      {alert && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
      )}
    </div>
  );
}

export function DashboardClient() {
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<DashboardStats>("/api/dashboard/stats");
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh every 60 seconds
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Operations Dashboard</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{today}</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {loading && !stats ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Today's Queue */}
            <section className="mb-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Today&apos;s Queue
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                  label="Total"
                  value={stats.today.total}
                  icon={<Users className="h-5 w-5 text-blue-600" />}
                  color="bg-blue-50 dark:bg-blue-900/30"
                />
                <StatCard
                  label="Waiting"
                  value={stats.today.waiting}
                  icon={<Clock className="h-5 w-5 text-amber-600" />}
                  color="bg-amber-50 dark:bg-amber-900/30"
                />
                <StatCard
                  label="In Progress"
                  value={stats.today.inProgress}
                  icon={<Activity className="h-5 w-5 text-indigo-600" />}
                  color="bg-indigo-50 dark:bg-indigo-900/30"
                />
                <StatCard
                  label="Paid"
                  value={stats.today.paid}
                  icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  color="bg-emerald-50 dark:bg-emerald-900/30"
                />
                <StatCard
                  label="Cancelled"
                  value={stats.today.cancelled}
                  icon={<XCircle className="h-5 w-5 text-red-500" />}
                  color="bg-red-50 dark:bg-red-900/30"
                />
              </div>
            </section>

            {/* Revenue + Amendments */}
            <section className="mb-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Revenue &amp; Alerts
              </h2>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <StatCard
                  label="Today's Revenue"
                  value={formatCurrency(stats.revenue.total)}
                  sub={`${stats.revenue.transactionCount.toLocaleString()} transactions`}
                  icon={<Banknote className="h-5 w-5 text-green-600" />}
                  color="bg-green-50 dark:bg-green-900/30"
                />
                <StatCard
                  label="Pending Amendments"
                  value={stats.amendments.pending}
                  sub="Require approval or rejection"
                  icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
                  color="bg-amber-50 dark:bg-amber-900/30"
                  alert={stats.amendments.pending > 0}
                />
              </div>
            </section>

            {/* Specimen Pipeline */}
            <section className="mb-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Specimen Pipeline
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard
                  label="For Specimen"
                  value={stats.specimen.forSpecimen}
                  sub="Awaiting accession"
                  icon={<FlaskConical className="h-5 w-5 text-violet-600" />}
                  color="bg-violet-50 dark:bg-violet-900/30"
                />
                <StatCard
                  label="Accession Assigned"
                  value={stats.specimen.accessionAssigned}
                  sub="Pending receipt"
                  icon={<FlaskConical className="h-5 w-5 text-blue-600" />}
                  color="bg-blue-50 dark:bg-blue-900/30"
                />
                <StatCard
                  label="Received at Lab"
                  value={stats.specimen.received}
                  sub="In processing"
                  icon={<FlaskConical className="h-5 w-5 text-teal-600" />}
                  color="bg-teal-50 dark:bg-teal-900/30"
                />
                <StatCard
                  label="Released"
                  value={stats.specimen.released}
                  sub="Results released today"
                  icon={<SendHorizonal className="h-5 w-5 text-emerald-600" />}
                  color="bg-emerald-50 dark:bg-emerald-900/30"
                />
              </div>
            </section>

            {/* 7-Day Trend */}
            {stats.trend && stats.trend.length > 1 && (
              <section className="mb-6">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  7-Day Trend
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TrendChart data={stats.trend} valueKey="visits"  color="#3b82f6" label="Daily Queue Visits" />
                  <TrendChart data={stats.trend} valueKey="revenue" color="#10b981" label="Daily Revenue (PHP)" />
                </div>
              </section>
            )}

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-600">
              Last updated: {formatTime(stats.generatedAt)} · Auto-refreshes every 60 s
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
