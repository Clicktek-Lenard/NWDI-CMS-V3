"use client";

import { useState } from "react";
import { Database, Download, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";

type DbOption = "cms_v2" | "cms_audit" | "all";

export function DatabaseBackupClient() {
  const [selectedDb, setSelectedDb] = useState<DbOption>("all");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleBackup() {
    setRunning(true);
    setResult(null);
    try {
      const json = await apiFetch<{ success: boolean; output?: string; error?: string }>("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ db: selectedDb }),
      });
      if (json.success) {
        setResult({ success: true, message: json.output || "Backup completed successfully." });
      } else {
        setResult({ success: false, message: json.error || "Backup failed." });
      }
    } catch (err) {
      setResult({ success: false, message: err instanceof Error ? err.message : "Backup request failed." });
    } finally {
      setRunning(false);
    }
  }

  const dbOptions: { value: DbOption; label: string; desc: string }[] = [
    { value: "all", label: "All Databases", desc: "Backup both cms_v2 and cms_audit" },
    { value: "cms_v2", label: "CMS v2", desc: "Main CMS database only" },
    { value: "cms_audit", label: "CMS Audit", desc: "Audit log database only" },
  ];

  return (
    <div className="space-y-4">
      {/* DB Selection */}
      <div className="grid grid-cols-3 gap-3">
        {dbOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => !running && setSelectedDb(opt.value)}
            className={`rounded-xl border p-3 text-left transition ${
              selectedDb === opt.value
                ? "border-blue-400 bg-blue-50 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-900/20"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500"
            }`}
            disabled={running}
          >
            <div className="flex items-center gap-2">
              <Database className={`h-4 w-4 ${selectedDb === opt.value ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
              <span className={`text-sm font-semibold ${selectedDb === opt.value ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-200"}`}>
                {opt.label}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* Backup Button */}
      <button
        type="button"
        onClick={handleBackup}
        disabled={running}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {running ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running Backup…
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Run Backup Now
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className={`flex items-start gap-3 rounded-xl border p-4 ${
          result.success
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
        }`}>
          {result.success ? (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          )}
          <pre className={`whitespace-pre-wrap text-sm ${
            result.success ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
          }`}>
            {result.message}
          </pre>
        </div>
      )}
    </div>
  );
}
