"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Company {
  Id: number; Code: string | null; Name: string | null; ShortName: string | null;
  BillingType: string | null; Status: string | null; ErosCode: string | null;
  UsedClinic: string | null; StartDate: string | null; EndDate: string | null;
}
interface ItemPrice {
  Id: number; Code: string | null; Description: string | null; CompanyCode: string | null;
  Price: number; PriceType: string | null; ClinicCode: string | null; Status: number; ItemUsed: number;
}
interface ItemMaster {
  Id: number; Code: string | null; Description: string | null; ShortName: string | null;
  Group: string | null; SubGroup: string | null; DepartmentGroup: string | null; Price: number;
}
interface Paged<T> { data: T[]; total: number; page: number; pageSize: number; totalPages: number; }

type Tab = "Companies" | "Items & Packages" | "Item Master List";

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}
        className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-700"><ChevronLeft className="h-4 w-4" /></button>
      <span className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}
        className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-700"><ChevronRight className="h-4 w-4" /></button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";

function Modal({ title, onClose, children, onSave, saving }: {
  title: string; onClose: () => void; children: React.ReactNode; onSave: () => void; saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-900" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">{children}</div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300">Cancel</button>
          <button onClick={onSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ label, onClose, onConfirm, saving }: {
  label: string; onClose: () => void; onConfirm: () => void; saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 className="mb-2 text-base font-semibold text-slate-800 dark:text-slate-100">Delete?</h3>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Delete <strong>{label}</strong>? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">Cancel</button>
          <button onClick={onConfirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
            {saving ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, onSearch, placeholder }: {
  value: string; onChange: (v: string) => void; onSearch: () => void; placeholder: string;
}) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={value} onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearch()}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      </div>
      <button onClick={onSearch} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Search</button>
    </div>
  );
}

// ── Companies Tab ─────────────────────────────────────────────────────────────

type CompanyForm = { Code: string; Name: string; ShortName: string; BillingType: string; Status: string; ErosCode: string; UsedClinic: string; Address: string; Phone: string; Email: string; };
const emptyCompany: CompanyForm = { Code: "", Name: "", ShortName: "", BillingType: "", Status: "Active", ErosCode: "", UsedClinic: "", Address: "", Phone: "", Email: "" };

function CompaniesTab() {
  const [search, setSearch]   = useState("");
  const [query, setQuery]     = useState("");
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState<Paged<Company> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [modal, setModal]     = useState<{ mode: "add" | "edit"; item?: Company } | null>(null);
  const [delTarget, setDelTarget] = useState<Company | null>(null);
  const [form, setForm]       = useState<CompanyForm>(emptyCompany);
  const [saving, setSaving]   = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (query) p.set("search", query);
      setData(await apiFetch<Paged<Company>>(`/api/eros/companies?${p}`));
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(emptyCompany); setFormError(null); setModal({ mode: "add" }); }
  function openEdit(c: Company) {
    setForm({ Code: c.Code ?? "", Name: c.Name ?? "", ShortName: c.ShortName ?? "", BillingType: c.BillingType ?? "", Status: c.Status ?? "Active", ErosCode: c.ErosCode ?? "", UsedClinic: c.UsedClinic ?? "", Address: "", Phone: "", Email: "" });
    setFormError(null); setModal({ mode: "edit", item: c });
  }

  async function handleSave() {
    if (!form.Code || !form.Name) { setFormError("Code and Name are required."); return; }
    setSaving(true); setFormError(null);
    try {
      if (modal?.mode === "add") {
        await apiFetch("/api/eros/companies", { method: "POST", body: JSON.stringify(form) });
      } else {
        await apiFetch(`/api/eros/companies/${modal?.item?.Id}`, { method: "PATCH", body: JSON.stringify(form) });
      }
      setModal(null); load();
    } catch (e) { setFormError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!delTarget) return;
    setSaving(true);
    try { await apiFetch(`/api/eros/companies/${delTarget.Id}`, { method: "DELETE" }); setDelTarget(null); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  const f = (k: keyof CompanyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} onSearch={() => { setQuery(search); setPage(1); }} placeholder="Search by name, code, EROS code…" /></div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Add Company
        </button>
      </div>
      {error && <div className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>{["Code","Name","Short Name","Billing Type","EROS Code","Clinics","Status",""].map(h => (
              <th key={h} className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
            : !data || data.data.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No companies found</td></tr>
            : data.data.map(c => (
              <tr key={c.Id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                <td className="px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">{c.Code ?? "—"}</td>
                <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-100">{c.Name ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{c.ShortName ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{c.BillingType ?? "—"}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{c.ErosCode ?? "—"}</td>
                <td className="px-4 py-2.5 text-xs text-slate-500">{c.UsedClinic ?? "—"}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.Status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>{c.Status ?? "—"}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(c)} className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDelTarget(c)} className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && (
        <div className="flex items-center justify-between pt-3 text-sm text-slate-500 dark:text-slate-400">
          <span>{data.total} companies</span>
          <Pager page={page} totalPages={data.totalPages} onChange={setPage} />
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add Company" : "Edit Company"} onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{formError}</p>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code *"><input value={form.Code} onChange={f("Code")} className={inputCls} /></Field>
            <Field label="EROS Code"><input value={form.ErosCode} onChange={f("ErosCode")} className={inputCls} /></Field>
          </div>
          <Field label="Name *"><input value={form.Name} onChange={f("Name")} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Short Name"><input value={form.ShortName} onChange={f("ShortName")} className={inputCls} /></Field>
            <Field label="Billing Type"><input value={form.BillingType} onChange={f("BillingType")} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select value={form.Status} onChange={f("Status")} className={inputCls}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
            <Field label="Used Clinic(s)"><input value={form.UsedClinic} onChange={f("UsedClinic")} placeholder="e.g. CEN,SMB" className={inputCls} /></Field>
          </div>
          <Field label="Address"><input value={form.Address} onChange={f("Address")} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><input value={form.Phone} onChange={f("Phone")} className={inputCls} /></Field>
            <Field label="Email"><input value={form.Email} onChange={f("Email")} className={inputCls} /></Field>
          </div>
        </Modal>
      )}
      {delTarget && <DeleteConfirm label={delTarget.Name ?? delTarget.Code ?? String(delTarget.Id)} onClose={() => setDelTarget(null)} onConfirm={handleDelete} saving={saving} />}
    </div>
  );
}

// ── Items & Packages Tab ──────────────────────────────────────────────────────

type ItemPriceForm = { Code: string; Description: string; CompanyCode: string; ClinicCode: string; Price: string; PriceType: string; ItemUsed: string; Status: string; };
const emptyItemPrice: ItemPriceForm = { Code: "", Description: "", CompanyCode: "", ClinicCode: "", Price: "0", PriceType: "", ItemUsed: "1", Status: "1" };

function ItemPricesTab() {
  const [search, setSearch]   = useState("");
  const [query, setQuery]     = useState("");
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState<Paged<ItemPrice> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [modal, setModal]     = useState<{ mode: "add" | "edit"; item?: ItemPrice } | null>(null);
  const [delTarget, setDelTarget] = useState<ItemPrice | null>(null);
  const [form, setForm]       = useState<ItemPriceForm>(emptyItemPrice);
  const [saving, setSaving]   = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (query) p.set("search", query);
      setData(await apiFetch<Paged<ItemPrice>>(`/api/eros/item-prices?${p}`));
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(emptyItemPrice); setFormError(null); setModal({ mode: "add" }); }
  function openEdit(i: ItemPrice) {
    setForm({ Code: i.Code ?? "", Description: i.Description ?? "", CompanyCode: i.CompanyCode ?? "", ClinicCode: i.ClinicCode ?? "", Price: String(i.Price), PriceType: i.PriceType ?? "", ItemUsed: String(i.ItemUsed), Status: String(i.Status) });
    setFormError(null); setModal({ mode: "edit", item: i });
  }

  async function handleSave() {
    if (!form.Code || !form.Description) { setFormError("Code and Description are required."); return; }
    setSaving(true); setFormError(null);
    const payload = { ...form, Price: parseFloat(form.Price) || 0, ItemUsed: parseInt(form.ItemUsed) || 1, Status: parseInt(form.Status) || 1 };
    try {
      if (modal?.mode === "add") await apiFetch("/api/eros/item-prices", { method: "POST", body: JSON.stringify(payload) });
      else await apiFetch(`/api/eros/item-prices/${modal?.item?.Id}`, { method: "PATCH", body: JSON.stringify(payload) });
      setModal(null); load();
    } catch (e) { setFormError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!delTarget) return;
    setSaving(true);
    try { await apiFetch(`/api/eros/item-prices/${delTarget.Id}`, { method: "DELETE" }); setDelTarget(null); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  const f = (k: keyof ItemPriceForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} onSearch={() => { setQuery(search); setPage(1); }} placeholder="Search by description or code…" /></div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>
      {error && <div className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>{["Code","Description","Company","Clinic","Price","Type","Used","Status",""].map(h => (
              <th key={h} className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
            : !data || data.data.length === 0 ? <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-400">No items found</td></tr>
            : data.data.map(i => (
              <tr key={i.Id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{i.Code ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-800 dark:text-slate-100">{i.Description ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-500">{i.CompanyCode ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-500">{i.ClinicCode ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-600">₱{i.Price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2.5 text-slate-500">{i.PriceType ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-500">{i.ItemUsed}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${i.Status === 1 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>{i.Status === 1 ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(i)} className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDelTarget(i)} className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && (
        <div className="flex items-center justify-between pt-3 text-sm text-slate-500 dark:text-slate-400">
          <span>{data.total} items</span>
          <Pager page={page} totalPages={data.totalPages} onChange={setPage} />
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add Item Price" : "Edit Item Price"} onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{formError}</p>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code *"><input value={form.Code} onChange={f("Code")} className={inputCls} /></Field>
            <Field label="Price *"><input type="number" min="0" step="0.01" value={form.Price} onChange={f("Price")} className={inputCls} /></Field>
          </div>
          <Field label="Description *"><input value={form.Description} onChange={f("Description")} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company Code"><input value={form.CompanyCode} onChange={f("CompanyCode")} className={inputCls} /></Field>
            <Field label="Clinic Code"><input value={form.ClinicCode} onChange={f("ClinicCode")} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price Type"><input value={form.PriceType} onChange={f("PriceType")} className={inputCls} /></Field>
            <Field label="Item Used">
              <select value={form.ItemUsed} onChange={f("ItemUsed")} className={inputCls}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={form.Status} onChange={f("Status")} className={inputCls}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </Field>
          </div>
        </Modal>
      )}
      {delTarget && <DeleteConfirm label={delTarget.Description ?? delTarget.Code ?? String(delTarget.Id)} onClose={() => setDelTarget(null)} onConfirm={handleDelete} saving={saving} />}
    </div>
  );
}

// ── Item Master List Tab ──────────────────────────────────────────────────────

type ItemMasterForm = { Code: string; Description: string; ShortName: string; Group: string; SubGroup: string; DepartmentGroup: string; Price: string; ItemStatus: string; };
const emptyItemMaster: ItemMasterForm = { Code: "", Description: "", ShortName: "", Group: "", SubGroup: "", DepartmentGroup: "", Price: "0", ItemStatus: "Active" };

function ItemMasterTab() {
  const [search, setSearch]   = useState("");
  const [query, setQuery]     = useState("");
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState<Paged<ItemMaster> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [modal, setModal]     = useState<{ mode: "add" | "edit"; item?: ItemMaster } | null>(null);
  const [delTarget, setDelTarget] = useState<ItemMaster | null>(null);
  const [form, setForm]       = useState<ItemMasterForm>(emptyItemMaster);
  const [saving, setSaving]   = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (query) p.set("search", query);
      setData(await apiFetch<Paged<ItemMaster>>(`/api/eros/item-master?${p}`));
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(emptyItemMaster); setFormError(null); setModal({ mode: "add" }); }
  function openEdit(i: ItemMaster) {
    setForm({ Code: i.Code ?? "", Description: i.Description ?? "", ShortName: i.ShortName ?? "", Group: i.Group ?? "", SubGroup: i.SubGroup ?? "", DepartmentGroup: i.DepartmentGroup ?? "", Price: String(i.Price), ItemStatus: "Active" });
    setFormError(null); setModal({ mode: "edit", item: i });
  }

  async function handleSave() {
    if (!form.Code || !form.Description) { setFormError("Code and Description are required."); return; }
    setSaving(true); setFormError(null);
    const payload = { ...form, Price: parseFloat(form.Price) || 0 };
    try {
      if (modal?.mode === "add") await apiFetch("/api/eros/item-master", { method: "POST", body: JSON.stringify(payload) });
      else await apiFetch(`/api/eros/item-master/${modal?.item?.Id}`, { method: "PATCH", body: JSON.stringify(payload) });
      setModal(null); load();
    } catch (e) { setFormError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!delTarget) return;
    setSaving(true);
    try { await apiFetch(`/api/eros/item-master/${delTarget.Id}`, { method: "DELETE" }); setDelTarget(null); load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  const f = (k: keyof ItemMasterForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} onSearch={() => { setQuery(search); setPage(1); }} placeholder="Search by description or code…" /></div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>
      {error && <div className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>{["Code","Description","Short Name","Group","Sub-Group","Dept","Price",""].map(h => (
              <th key={h} className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-300">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
            : !data || data.data.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No items found</td></tr>
            : data.data.map(i => (
              <tr key={i.Id} className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{i.Code ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-800 dark:text-slate-100">{i.Description ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-500">{i.ShortName ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-600">{i.Group ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-600">{i.SubGroup ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-500">{i.DepartmentGroup ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-600">₱{i.Price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(i)} className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDelTarget(i)} className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data && (
        <div className="flex items-center justify-between pt-3 text-sm text-slate-500 dark:text-slate-400">
          <span>{data.total} items</span>
          <Pager page={page} totalPages={data.totalPages} onChange={setPage} />
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add Item" : "Edit Item"} onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{formError}</p>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code *"><input value={form.Code} onChange={f("Code")} className={inputCls} /></Field>
            <Field label="Short Name"><input value={form.ShortName} onChange={f("ShortName")} className={inputCls} /></Field>
          </div>
          <Field label="Description *"><input value={form.Description} onChange={f("Description")} className={inputCls} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Group"><input value={form.Group} onChange={f("Group")} className={inputCls} /></Field>
            <Field label="Sub-Group"><input value={form.SubGroup} onChange={f("SubGroup")} className={inputCls} /></Field>
            <Field label="Dept Group"><input value={form.DepartmentGroup} onChange={f("DepartmentGroup")} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price"><input type="number" min="0" step="0.01" value={form.Price} onChange={f("Price")} className={inputCls} /></Field>
            <Field label="Status">
              <select value={form.ItemStatus} onChange={f("ItemStatus")} className={inputCls}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>
        </Modal>
      )}
      {delTarget && <DeleteConfirm label={delTarget.Description ?? delTarget.Code ?? String(delTarget.Id)} onClose={() => setDelTarget(null)} onConfirm={handleDelete} saving={saving} />}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const TABS: Tab[] = ["Companies", "Items & Packages", "Item Master List"];

export function ErosCompaniesClient() {
  const [activeTab, setActiveTab] = useState<Tab>("Companies");
  return (
    <div className="p-6">
      <div className="mb-6 flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}>{tab}</button>
        ))}
      </div>
      {activeTab === "Companies"        && <CompaniesTab />}
      {activeTab === "Items & Packages" && <ItemPricesTab />}
      {activeTab === "Item Master List" && <ItemMasterTab />}
    </div>
  );
}
