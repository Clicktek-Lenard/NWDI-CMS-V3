"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Plus, Pencil, Trash2, RefreshCw, X, Check, Server,
  Wifi, Globe, Network, Database, Radio, ChevronDown, ChevronUp,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useToast, ToastContainer } from "@/components/ui/toast";

// ── Types ──────────────────────────────────────────────────────

interface Counter {
  id: number;
  station_number: string | null;
  ipv4: string | null;
  department: string | null;
  location: string | null;
  idbu: string | null;
  input_by: string | null;
  input_date: string | null;
  update_by: string | null;
  update_date: string | null;
}

interface Branch {
  code: string;
  name: string;
}

const DEPARTMENTS = [
  "Reception",
  "Extraction",
  "Imaging",
  "Vital Signs",
  "Consultation",
  "Releasing",
];

const EMPTY_FORM = { station_number: "", ipv4: "", department: "", location: "", idbu: "" };

type SubTab = "workstations" | "services";
type ServiceTool = "ping" | "checkip" | "jasper" | "socket" | "sql" | "hl7";

const SERVICE_TOOLS: { key: ServiceTool; label: string; icon: React.ReactNode }[] = [
  { key: "ping",    label: "Ping",          icon: <Wifi className="h-4 w-4" /> },
  { key: "checkip", label: "Check Your IP", icon: <Globe className="h-4 w-4" /> },
  { key: "jasper",  label: "Jasper Server", icon: <Server className="h-4 w-4" /> },
  { key: "socket",  label: "Socket",        icon: <Radio className="h-4 w-4" /> },
  { key: "sql",     label: "SQL",           icon: <Database className="h-4 w-4" /> },
  { key: "hl7",     label: "HL7",           icon: <Network className="h-4 w-4" /> },
];

const NETWORK_COMMANDS = ["Center", "DNS", "Gateway", "Traceroute"] as const;

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

// ── WorkstationForm sub-component ─────────────────────────────

type FormState = { station_number: string; ipv4: string; department: string; location: string; idbu: string };

function WorkstationForm({ form, onChange }: { form: FormState; onChange: (f: FormState) => void }) {
  const f = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...form, [key]: e.target.value });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Station Number <span className="text-red-500">*</span>
        </label>
        <input value={form.station_number} onChange={f("station_number")} placeholder="e.g. 1"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          IP Address <span className="text-red-500">*</span>
        </label>
        <input value={form.ipv4} onChange={f("ipv4")} placeholder="e.g. 10.30.169.206"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Department <span className="text-red-500">*</span>
        </label>
        <select value={form.department} onChange={f("department")}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
          <option value="">Select department...</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Branch <span className="text-red-500">*</span>
        </label>
        <input value={form.idbu} onChange={f("idbu")} placeholder="e.g. DTU"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Location{" "}
          <span className="text-xs font-normal text-slate-400">(for Imaging subgroups)</span>
        </label>
        <input value={form.location} onChange={f("location")} placeholder="e.g. XRAY"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────

export function WorkstationClient() {
  const { toasts, toast, dismiss } = useToast();
  const [subTab, setSubTab] = useState<SubTab>("workstations");

  // Workstations
  const [counters, setCounters]     = useState<Counter[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [addForm, setAddForm]       = useState<FormState>({ ...EMPTY_FORM });
  const [editForm, setEditForm]     = useState<FormState>({ ...EMPTY_FORM });
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState<number | null>(null);

  // Services
  const [branches, setBranches]             = useState<Branch[]>([]);
  const [serviceBranch, setServiceBranch]   = useState("");
  const [activeTool, setActiveTool]         = useState<ServiceTool>("ping");
  const [serviceResult, setServiceResult]   = useState("");
  const [serviceLoading, setServiceLoading] = useState(false);
  const [networkCmd, setNetworkCmd]         = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const json = await apiFetch<{ data: Counter[] }>("/api/kiosk/counter");
      setCounters(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load workstations");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const json = await apiFetch<{ data: Branch[] }>("/api/enrollment/clinics");
      setBranches(json.data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { if (subTab === "services") fetchBranches(); }, [subTab, fetchBranches]);

  function openDetail(c: Counter) {
    if (selectedId === c.id) { setSelectedId(null); return; }
    setSelectedId(c.id);
    setEditForm({
      station_number: c.station_number ?? "",
      ipv4:           c.ipv4 ?? "",
      department:     c.department ?? "",
      location:       c.location ?? "",
      idbu:           c.idbu ?? "",
    });
  }

  async function handleAdd() {
    if (!addForm.station_number || !addForm.ipv4 || !addForm.department) {
      setError("Station Number, IP Address, and Department are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiFetch("/api/kiosk/counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      toast("Workstation registered.");
      setShowAdd(false);
      fetchData();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setError(msg);
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: number) {
    if (!editForm.ipv4 || !editForm.department) {
      setError("IP Address and Department are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiFetch(`/api/kiosk/counter/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      toast("Workstation updated.");
      setSelectedId(null);
      fetchData();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Update failed";
      setError(msg);
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteId(id);
    try {
      await apiFetch(`/api/kiosk/counter/${id}`, { method: "DELETE" });
      toast("Workstation removed.");
      if (selectedId === id) setSelectedId(null);
      fetchData();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setDeleteId(null);
    }
  }

  async function runServiceTool() {
    setServiceLoading(true);
    setServiceResult("");
    try {
      const params = new URLSearchParams({ tool: activeTool });
      if (serviceBranch) params.set("branch", serviceBranch);
      if (networkCmd) params.set("cmd", networkCmd);
      const json = await apiFetch<{ result: string }>(`/api/kiosk/services?${params}`);
      setServiceResult(json.result ?? "No result returned.");
    } catch (e) {
      setServiceResult(`Error: ${e instanceof Error ? e.message : "Request failed"}`);
    } finally {
      setServiceLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Workstation Management</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Register workstation IPs to department queues and run diagnostics
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {(["workstations", "services"] as SubTab[]).map((t) => (
          <button key={t} onClick={() => setSubTab(t)}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              subTab === t
                ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}>
            {t === "workstations" ? <Server className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            {t === "workstations" ? "Workstations" : "Services"}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ── WORKSTATIONS TAB ── */}
      {subTab === "workstations" && (
        <div className="space-y-3">
          <div className="flex items-center justify-end gap-2">
            <button onClick={fetchData} disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={() => { setShowAdd((v) => !v); setSelectedId(null); setError(""); setAddForm({ ...EMPTY_FORM }); }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Register Workstation
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-900/10">
              <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Register New Workstation</p>
              <WorkstationForm form={addForm} onChange={setAddForm} />
              <div className="mt-4 flex items-center gap-2">
                <button onClick={handleAdd} disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  <Check className="h-4 w-4" />{saving ? "Saving..." : "Register"}
                </button>
                <button onClick={() => { setShowAdd(false); setError(""); }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <X className="h-4 w-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700">
                  <tr>
                    {["Station Number", "IP Address", "Department", "Location", "Branch", "Actions"].map((h, i) => (
                      <th key={h}
                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${i === 5 ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {loading ? (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-slate-400">Loading...</td></tr>
                  ) : counters.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-slate-400">No workstations registered yet</td></tr>
                  ) : counters.flatMap((c) => {
                    const isOpen = selectedId === c.id;
                    return [
                      // Summary row
                      <tr key={c.id} onClick={() => openDetail(c)}
                        className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/60">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                            {isOpen
                              ? <ChevronUp className="h-3.5 w-3.5 text-blue-500" />
                              : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                            {c.station_number ?? "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-200">{c.ipv4 ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {c.department ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.location ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.idbu ?? "—"}</td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => openDetail(c)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-600 dark:hover:text-slate-200">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(c.id)} disabled={deleteId === c.id}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>,

                      // Expanded detail + edit panel
                      ...(isOpen ? [
                        <tr key={`${c.id}-detail`}>
                          <td colSpan={6} className="border-b border-slate-100 bg-slate-50 px-6 py-5 dark:border-slate-700 dark:bg-slate-700/40">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              {/* Edit form */}
                              <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Info</p>
                                <WorkstationForm form={editForm} onChange={setEditForm} />
                                <div className="flex items-center gap-2 pt-1">
                                  <button onClick={() => handleUpdate(c.id)} disabled={saving}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                                    <Check className="h-3.5 w-3.5" />{saving ? "Saving..." : "Update"}
                                  </button>
                                  <button onClick={() => setSelectedId(null)}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                    Cancel
                                  </button>
                                </div>
                              </div>

                              {/* Audit info */}
                              <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Audit</p>
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                  <dt className="font-medium text-slate-600 dark:text-slate-300">Created by</dt>
                                  <dd className="text-slate-500 dark:text-slate-400">{c.input_by ?? "—"}</dd>
                                  <dt className="font-medium text-slate-600 dark:text-slate-300">Date Created</dt>
                                  <dd className="text-slate-500 dark:text-slate-400">{fmt(c.input_date)}</dd>
                                  <dt className="font-medium text-slate-600 dark:text-slate-300">Update by</dt>
                                  <dd className="text-slate-500 dark:text-slate-400">{c.update_by ?? "—"}</dd>
                                  <dt className="font-medium text-slate-600 dark:text-slate-300">Update date</dt>
                                  <dd className="text-slate-500 dark:text-slate-400">{fmt(c.update_date)}</dd>
                                </dl>
                              </div>
                            </div>
                          </td>
                        </tr>,
                      ] : []),
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SERVICES TAB ── */}
      {subTab === "services" && (
        <div className="space-y-4">
          {/* Tool buttons */}
          <div className="flex flex-wrap gap-2">
            {SERVICE_TOOLS.map((t) => (
              <button key={t.key}
                onClick={() => { setActiveTool(t.key); setServiceResult(""); setNetworkCmd(""); }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeTool === t.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-4">

            {/* Branch dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Branch</label>
              <select value={serviceBranch} onChange={(e) => setServiceBranch(e.target.value)}
                className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-sm focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
                <option value="">Select branch...</option>
                {branches.map((b) => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Network command buttons */}
            <div className="flex flex-wrap gap-2">
              {NETWORK_COMMANDS.map((cmd) => (
                <button key={cmd}
                  onClick={() => setNetworkCmd(networkCmd === cmd ? "" : cmd)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    networkCmd === cmd
                      ? "bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  }`}>
                  {cmd}
                </button>
              ))}
            </div>

            {/* Result box */}
            <div className="min-h-32 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {serviceLoading ? (
                <span className="animate-pulse text-slate-400">Running {activeTool}...</span>
              ) : serviceResult ? (
                <pre className="whitespace-pre-wrap break-all">{serviceResult}</pre>
              ) : (
                <span className="text-slate-400">Results will appear here</span>
              )}
            </div>

            {/* Go button */}
            <div className="flex items-center gap-3">
              <button onClick={runServiceTool} disabled={serviceLoading || !serviceBranch}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50">
                {serviceLoading
                  ? <RefreshCw className="h-4 w-4 animate-spin" />
                  : <Wifi className="h-4 w-4" />}
                Go
              </button>
              {!serviceBranch && (
                <span className="text-xs text-slate-400">Select a branch first</span>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
