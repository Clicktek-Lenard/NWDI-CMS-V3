"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────

interface QueueData {
  id: number;
  code: string;
  idBU: string;
  idPatient: number;
  patientName: string;
  lastName: string;
  firstName: string;
  middleName: string;
  gender: string;
  dob: string | null;
  age: number | null;
  status: number;
  patientType: string;
  accessionNo: string;
  notes: string;
  inputBy: string;
  dateTime: string;
}

interface TransactionData {
  id: number;
  idDoctor: number | null;
  nameDoctor: string;
  idCompany: number;
  nameCompany: string;
  transactionType: string;
  codeItemPrice: string;
  descriptionItemPrice: string;
  amount: number;
  cardNumber: string;
  inputBy: string;
  status: number;
  statusName: string;
  groupItemMaster: string;
}

interface VitalsData {
  medication: string;
  lastDose: string;
  lastPeriod: string;
}

interface StatusOption {
  id: number;
  name: string;
}

interface PhysicianDetail {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  displayName: string;
  prcNo: string;
  degree: string;
  status: string;
  branchCode: string;
  declineReason: string;
}

interface CompanyResult {
  Id: number;
  Code: string;
  Name: string;
  ErosCode: string;
  ShortName: string | null;
}

interface PhysicianResult {
  id: number;
  code: string;
  erosCode: string;
  fullName: string;
  displayName: string;
  degree: string;
}

interface ItemPriceResult {
  IdItem:      number;
  Code:        string;
  Description: string;
  Price:       number;
  PriceGroup:  string;
  PDefault:    string;
  ItemUsed:    number;
  CompanyCode: string;
  Group:       string;
  IMSubGroup:  string;
  IMAllowQty:  string;
  SubGroup:    string;
  readersFee:  number;
  origAmount:  number;
}

interface TransactionTypeResult {
  Code:        string;
  Description: string | null;
}

interface NewTransactionRow {
  key: string;
  idCompany:            number;
  nameCompany:          string;
  idDoctor:             number | null;
  nameDoctor:           string;
  transactionType:      string;
  idItemPrice:          number;
  codeItemPrice:        string;
  descriptionItemPrice: string;
  priceGroupItemPrice:  string;
  amountItemPrice:      number;
  readersFee:           number;
  origAmount:           number;
  groupItemMaster:      string;
}

interface EditQueueFormProps {
  queue: QueueData;
  transactions: TransactionData[];
  vitals: VitalsData;
  statuses: StatusOption[];
  isBmRole?: boolean;
  isResultsReleasing?: boolean;
  isPayment?: boolean;
  isCsrView?: boolean;
  isHl7Btn?: boolean;
  hl7SentGroups?: string[];
}

// ── Helpers ────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function useDebounce<T>(value: T, ms: number) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return dv;
}

// ── Searchable dropdown ────────────────────────────────────────

function SearchDropdown<T>({
  label, placeholder, required, value, displayValue,
  onSelect, onClear, results, loading, onSearch, renderItem, renderSelected,
}: {
  label: string; placeholder: string; required?: boolean;
  value: T | null; displayValue: string;
  onSelect: (item: T) => void; onClear: () => void;
  results: T[]; loading: boolean; onSearch: (q: string) => void;
  renderItem: (item: T) => React.ReactNode;
  renderSelected: (item: T) => React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQ = useDebounce(q, 260);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { onSearch(debouncedQ); }, [debouncedQ, onSearch]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (value) {
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          {label}{required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
          <div className="min-w-0 flex-1 text-sm">{renderSelected(value)}</div>
          <button type="button" onClick={() => { onClear(); setQ(""); }}
            className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          {loading
            ? <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>}
        </div>
        <input type="text" value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} placeholder={placeholder}
          className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
        />
        {open && results.length > 0 && (
          <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {results.map((item, i) => (
              <button key={i} type="button"
                onMouseDown={() => { onSelect(item); setQ(displayValue); setOpen(false); }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-blue-50">
                {renderItem(item)}
              </button>
            ))}
          </div>
        )}
        {open && !loading && results.length === 0 && q.length >= 2 && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow-lg">
            No results for &ldquo;{q}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}

// ── Transaction type dropdown ──────────────────────────────────

function TxTypeDropdown({ value, options, onChange }: {
  value: string; options: TransactionTypeResult[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((t) => t.Code === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref}>
      <label className="mb-1 block text-xs font-medium text-slate-600">Transaction Type</label>
      <div className="relative">
        <button type="button" onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left focus:border-blue-400 focus:outline-none">
          {selected ? (
            <div>
              <p className="text-sm font-semibold text-slate-800">{selected.Code}</p>
              {selected.Description && <p className="text-xs text-slate-500">{selected.Description}</p>}
            </div>
          ) : <span className="text-sm text-slate-400">Select type…</span>}
          <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {open && options.length > 0 && (
          <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {options.map((t) => (
              <button key={t.Code} type="button"
                onMouseDown={() => { onChange(t.Code); setOpen(false); }}
                className={`block w-full px-3 py-2 text-left hover:bg-blue-50 ${value === t.Code ? "bg-blue-50" : ""}`}>
                <p className="font-medium text-slate-800">{t.Code}</p>
                {t.Description && <p className="text-xs text-slate-400">{t.Description}</p>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function EditQueueForm({
  queue, transactions, vitals, statuses,
  isBmRole = false, isResultsReleasing = false, isPayment = false, isCsrView = false,
  isHl7Btn = false, hl7SentGroups = [],
}: EditQueueFormProps) {
  const router = useRouter();

  // Editable queue fields
  const [status, setStatus]           = useState(queue.status);
  const [accessionNo, setAccessionNo] = useState(queue.accessionNo);
  const [notes, setNotes]             = useState(queue.notes);
  const [medication, setMedication]   = useState(vitals.medication);
  const [lastDose, setLastDose]       = useState(vitals.lastDose);
  const [lastPeriod, setLastPeriod]   = useState(vitals.lastPeriod);

  // Add Items panel state
  const [addPanelOpen, setAddPanelOpen]         = useState(false);
  const [panelCompany, setPanelCompany]         = useState<CompanyResult | null>(null);
  const [panelPhysician, setPanelPhysician]     = useState<PhysicianResult | null>(null);
  const [companyResults, setCompanyResults]     = useState<CompanyResult[]>([]);
  const [physicianResults, setPhysicianResults] = useState<PhysicianResult[]>([]);
  const [companyLoading, setCompanyLoading]     = useState(false);
  const [physicianLoading, setPhysicianLoading] = useState(false);
  const [items, setItems]                       = useState<ItemPriceResult[]>([]);
  const [itemsLoading, setItemsLoading]         = useState(false);
  const [selectedItemIds, setSelectedItemIds]   = useState<Set<number>>(new Set());
  const [txType, setTxType]                     = useState("");
  const [txTypes, setTxTypes]                   = useState<TransactionTypeResult[]>([]);
  const [panelError, setPanelError]             = useState("");

  // Newly staged (unsaved) transactions
  const [newRows, setNewRows] = useState<NewTransactionRow[]>([]);

  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  // Physician modal state
  const [viewModal, setViewModal]               = useState<number | null>(null); // physicianId
  const [editModal, setEditModal]               = useState<number | null>(null); // physicianId
  const [physicianDetail, setPhysicianDetail]   = useState<PhysicianDetail | null>(null);
  const [modalLoading, setModalLoading]         = useState(false);
  const [editStatus, setEditStatus]             = useState("");
  const [editDeclineReason, setEditDeclineReason] = useState("");
  const [physicianSaving, setPhysicianSaving]   = useState(false);
  const [physicianError, setPhysicianError]     = useState("");

  // Edit transaction modal state
  const [editingTx, setEditingTx]                   = useState<TransactionData | null>(null);
  const [editTxCompany, setEditTxCompany]             = useState<CompanyResult | null>(null);
  const [editTxPhysician, setEditTxPhysician]         = useState<PhysicianResult | null>(null);
  const [editTxType, setEditTxType]                   = useState("");
  const [editTxItems, setEditTxItems]                 = useState<ItemPriceResult[]>([]);
  const [editTxItemsLoading, setEditTxItemsLoading]   = useState(false);
  const [editTxSelectedItemId, setEditTxSelectedItemId] = useState<number | null>(null);
  const [editTxSaving, setEditTxSaving]               = useState(false);
  const [editTxError, setEditTxError]                 = useState("");

  // Remove transaction confirm modal
  const [removingTx, setRemovingTx]     = useState<TransactionData | null>(null);
  const [removeReason, setRemoveReason] = useState("");
  const [removeSaving, setRemoveSaving] = useState(false);
  const [removeError, setRemoveError]   = useState("");

  // Cancel queue / ante-date modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason]       = useState("");
  const [cancelAnteDate, setCancelAnteDate]   = useState("");
  const [cancelSaving, setCancelSaving]       = useState(false);
  const [cancelError, setCancelError]         = useState("");

  // View Deleted transactions modal
  const [viewDeletedOpen, setViewDeletedOpen] = useState(false);

  // Amendment Approve
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [approveSaving, setApproveSaving]           = useState(false);
  const [approveError, setApproveError]             = useState("");

  // Re-Generate Lab PDF
  const [regenSaving, setRegenSaving] = useState(false);
  const [regenMsg, setRegenMsg]       = useState("");

  // To Comeback
  const [toComeBack, setToComeBack]   = useState(false);
  const [qrLoading, setQrLoading]     = useState(false);

  // HL7 resend — tracks which itemGroups have been sent this session
  const [hl7Sent, setHl7Sent]         = useState<Set<string>>(new Set(hl7SentGroups));
  const [hl7Sending, setHl7Sending]   = useState<Set<number>>(new Set()); // txId set

  async function handleGenerateQR() {
    if (!toComeBack) return;
    setQrLoading(true);
    try {
      const url = `/api/reports/to-comeback?queueId=${queue.id}`;
      window.open(url, "_blank");
    } finally {
      setQrLoading(false);
    }
  }

  async function handleHl7Resend(tx: TransactionData) {
    if (hl7Sending.has(tx.id)) return;
    setHl7Sending((prev) => new Set(prev).add(tx.id));
    try {
      const res = await fetch(`/api/transactions/${tx.id}/hl7-resend`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json() as { itemGroup?: string };
      const group = data.itemGroup ?? tx.groupItemMaster;
      setHl7Sent((prev) => { const next = new Set(prev); next.add(group); return next; });
    } catch {
      // silent — button stays in sending state briefly then resets
    } finally {
      setHl7Sending((prev) => { const next = new Set(prev); next.delete(tx.id); return next; });
    }
  }

  // Fetch transaction types on mount
  useEffect(() => {
    fetch("/api/transaction-types")
      .then((r) => r.json())
      .then((json: { data: TransactionTypeResult[] }) => {
        const types = json.data ?? [];
        setTxTypes(types);
        if (types.length > 0) setTxType(types[0].Code);
      })
      .catch(() => {});
  }, []);

  // Load items when company selected
  useEffect(() => {
    if (!panelCompany) { setItems([]); setSelectedItemIds(new Set()); return; }
    setItemsLoading(true);
    setSelectedItemIds(new Set());
    fetch(`/api/item-prices?companyId=${panelCompany.Id}&clinicCode=${encodeURIComponent(queue.idBU)}`)
      .then((r) => r.json())
      .then((json: { data: ItemPriceResult[] }) => setItems(json.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setItemsLoading(false));
  }, [panelCompany, queue.idBU]);

  // Load items when edit-tx company changes
  useEffect(() => {
    if (!editTxCompany) { setEditTxItems([]); setEditTxSelectedItemId(null); return; }
    setEditTxItemsLoading(true);
    fetch(`/api/item-prices?companyId=${editTxCompany.Id}&clinicCode=${encodeURIComponent(queue.idBU)}`)
      .then((r) => r.json())
      .then((json: { data: ItemPriceResult[] }) => setEditTxItems(json.data ?? []))
      .catch(() => setEditTxItems([]))
      .finally(() => setEditTxItemsLoading(false));
  }, [editTxCompany?.Id, queue.idBU]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-select the current item after edit-tx items load
  useEffect(() => {
    if (!editingTx || editTxItems.length === 0) return;
    const match = editTxItems.find((i) => i.Code === editingTx.codeItemPrice);
    if (match) setEditTxSelectedItemId(match.IdItem);
  }, [editTxItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchCompanies = useCallback(async (q: string) => {
    setCompanyLoading(true);
    try {
      const res = await fetch(`/api/companies?q=${encodeURIComponent(q)}&limit=15`);
      const json: { data: CompanyResult[] } = await res.json();
      setCompanyResults(json.data ?? []);
    } finally { setCompanyLoading(false); }
  }, []);

  const searchPhysicians = useCallback(async (q: string) => {
    setPhysicianLoading(true);
    try {
      const res = await fetch(`/api/physicians?q=${encodeURIComponent(q)}&limit=15`);
      const json: { data: PhysicianResult[] } = await res.json();
      setPhysicianResults(json.data ?? []);
    } finally { setPhysicianLoading(false); }
  }, []);

  function toggleItem(id: number) {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addSelectedItems() {
    if (!panelCompany) return;
    if (!panelPhysician) { setPanelError("Doctor is required."); return; }
    setPanelError("");
    const toAdd = items.filter((it) => selectedItemIds.has(it.IdItem));
    const staged: NewTransactionRow[] = toAdd.map((it) => ({
      key:                  `${Date.now()}-${it.IdItem}`,
      idCompany:            panelCompany.Id,
      nameCompany:          panelCompany.Name,
      idDoctor:             panelPhysician.id,
      nameDoctor:           panelPhysician.displayName,
      transactionType:      txType,
      idItemPrice:          it.IdItem,
      codeItemPrice:        it.Code,
      descriptionItemPrice: it.Description,
      priceGroupItemPrice:  it.PriceGroup,
      amountItemPrice:      it.Price,
      readersFee:           it.readersFee,
      origAmount:           it.origAmount,
      groupItemMaster:      it.Group,
    }));
    setNewRows((prev) => [...prev, ...staged]);
    setPanelCompany(null);
    setPanelPhysician(null);
    setItems([]);
    setSelectedItemIds(new Set());
    setAddPanelOpen(false);
  }

  function removeNewRow(key: string) {
    setNewRows((prev) => prev.filter((r) => r.key !== key));
  }

  const existingTotal = transactions.reduce((s, tx) => s + tx.amount, 0);
  const newTotal      = newRows.reduce((s, r) => s + r.amountItemPrice, 0);
  const totalAmount   = existingTotal + newTotal;

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/queue/${queue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status, accessionNo, notes, medication, lastDose, lastPeriod,
          newTransactions: newRows.length > 0
            ? newRows.map(({ key: _k, ...rest }) => rest)
            : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to save");
      }
      setNewRows([]);
      setSuccess(true);
      setTimeout(() => router.refresh(), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  // ── Physician modal handlers ──────────────────────────────────

  async function fetchPhysicianDetail(id: number): Promise<PhysicianDetail | null> {
    try {
      const res = await fetch(`/api/physicians/${id}`);
      if (!res.ok) return null;
      return await res.json() as PhysicianDetail;
    } catch { return null; }
  }

  async function openViewModal(id: number) {
    setViewModal(id);
    setEditModal(null);
    setPhysicianDetail(null);
    setPhysicianError("");
    setModalLoading(true);
    const data = await fetchPhysicianDetail(id);
    setPhysicianDetail(data);
    setModalLoading(false);
  }

  async function openEditModal(id: number) {
    setEditModal(id);
    setViewModal(null);
    setPhysicianDetail(null);
    setPhysicianError("");
    setModalLoading(true);
    const data = await fetchPhysicianDetail(id);
    setPhysicianDetail(data);
    if (data) { setEditStatus(data.status); setEditDeclineReason(data.declineReason); }
    setModalLoading(false);
  }

  function closeModals() {
    setViewModal(null);
    setEditModal(null);
    setPhysicianDetail(null);
    setPhysicianError("");
  }

  async function handlePhysicianStatusChange(id: number, newStatus: string) {
    setPhysicianSaving(true);
    setPhysicianError("");
    try {
      const res = await fetch(`/api/physicians/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to update");
      }
      setPhysicianDetail((prev) => prev ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      setPhysicianError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setPhysicianSaving(false);
    }
  }

  async function handlePhysicianSave() {
    if (!editModal) return;
    setPhysicianSaving(true);
    setPhysicianError("");
    try {
      const res = await fetch(`/api/physicians/${editModal}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, declineReason: editDeclineReason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to save");
      }
      setPhysicianDetail((prev) =>
        prev ? { ...prev, status: editStatus, declineReason: editDeclineReason } : prev
      );
      closeModals();
    } catch (err) {
      setPhysicianError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setPhysicianSaving(false);
    }
  }

  // ── Edit Transaction handlers ─────────────────────────────────

  function openEditTx(tx: TransactionData) {
    setEditingTx(tx);
    setEditTxCompany({ Id: tx.idCompany, Code: "", Name: tx.nameCompany, ErosCode: "", ShortName: null });
    setEditTxPhysician(
      tx.idDoctor
        ? { id: tx.idDoctor, code: "", erosCode: "", fullName: tx.nameDoctor, displayName: tx.nameDoctor, degree: "" }
        : null
    );
    setEditTxType(tx.transactionType);
    setEditTxItems([]);
    setEditTxSelectedItemId(null);
    setEditTxError("");
  }

  async function handleEditTxSave() {
    if (!editingTx)    { setEditTxError("No transaction selected."); return; }
    if (!editTxCompany) { setEditTxError("Company is required."); return; }
    if (!editTxPhysician) { setEditTxError("Doctor is required."); return; }
    const item = editTxItems.find((i) => i.IdItem === editTxSelectedItemId);
    if (!item) { setEditTxError("Please select an item."); return; }

    setEditTxSaving(true);
    setEditTxError("");
    try {
      const res = await fetch(`/api/transactions/${editingTx.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idCompany:            editTxCompany.Id,
          nameCompany:          editTxCompany.Name,
          idDoctor:             editTxPhysician.id,
          nameDoctor:           editTxPhysician.displayName,
          transactionType:      editTxType,
          idItemPrice:          item.IdItem,
          codeItemPrice:        item.Code,
          descriptionItemPrice: item.Description,
          priceGroupItemPrice:  item.PriceGroup,
          amountItemPrice:      item.Price,
          readersFee:           item.readersFee,
          origAmount:           item.origAmount,
          groupItemMaster:      item.Group,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to save");
      }
      setEditingTx(null);
      setTimeout(() => router.refresh(), 300);
    } catch (err) {
      setEditTxError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setEditTxSaving(false);
    }
  }

  // ── Remove Transaction handlers ───────────────────────────────

  function openRemoveTx(tx: TransactionData) {
    setRemovingTx(tx);
    setRemoveReason("");
    setRemoveError("");
  }

  async function handleRemoveTx() {
    if (!removingTx || !removeReason.trim()) return;
    setRemoveSaving(true);
    setRemoveError("");
    try {
      const url = `/api/transactions/${removingTx.id}?reason=${encodeURIComponent(removeReason.trim())}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to remove");
      }
      setRemovingTx(null);
      setTimeout(() => router.refresh(), 300);
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setRemoveSaving(false);
    }
  }

  // ── Cancel Queue handlers ─────────────────────────────────────

  async function handleCancelQueue() {
    if (!cancelReason.trim()) { setCancelError("Reason is required."); return; }
    if (!cancelAnteDate)       { setCancelError("New date is required."); return; }
    setCancelSaving(true);
    setCancelError("");
    try {
      const res = await fetch(`/api/queue/${queue.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anteDateReason: cancelReason.trim(), anteDate: cancelAnteDate }),
      });
      const data = await res.json().catch(() => ({})) as { newQueueId?: number; newQueueCode?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to cancel queue");
      setCancelModalOpen(false);
      router.push(`/queue/${data.newQueueId}/edit`);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setCancelSaving(false);
    }
  }

  // ── Amendment Approve handler ─────────────────────────────────

  async function confirmApproveAmendment() {
    setApproveConfirmOpen(false);
    setApproveSaving(true);
    setApproveError("");
    try {
      const res = await fetch(`/api/queue/${queue.id}/approve-amendment`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? "Failed to approve amendment");
      }
      router.refresh();
    } catch (err) {
      setApproveError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setApproveSaving(false);
    }
  }

  // ── Re-Generate Lab PDF handler ───────────────────────────────

  async function handleRegenPdf() {
    setRegenSaving(true);
    setRegenMsg("");
    try {
      const res = await fetch(`/api/queue/${queue.id}/regenerate-pdf`, { method: "POST" });
      const data = await res.json().catch(() => ({})) as { success?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to queue PDF regeneration");
      setRegenMsg(data.message ?? "PDF regeneration queued.");
      setTimeout(() => setRegenMsg(""), 4000);
    } catch (err) {
      setRegenMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setRegenSaving(false);
    }
  }

  // Group existing transactions by doctor
  const existingGroups: { doctorName: string; idDoctor: number | null; rows: TransactionData[] }[] = [];
  const existingSeen = new Map<string, number>();
  for (const tx of transactions) {
    const dk = tx.nameDoctor || "No Doctor Assigned";
    if (!existingSeen.has(dk)) {
      existingSeen.set(dk, existingGroups.length);
      existingGroups.push({ doctorName: dk, idDoctor: tx.idDoctor, rows: [] });
    }
    existingGroups[existingSeen.get(dk)!].rows.push(tx);
  }

  // Group new (staged) transactions by doctor
  const newGroups: { doctorName: string; idDoctor: number | null; rows: NewTransactionRow[] }[] = [];
  const newSeen = new Map<string, number>();
  for (const row of newRows) {
    const dk = row.nameDoctor || "No Doctor Assigned";
    if (!newSeen.has(dk)) {
      newSeen.set(dk, newGroups.length);
      newGroups.push({ doctorName: dk, idDoctor: row.idDoctor, rows: [] });
    }
    newGroups[newSeen.get(dk)!].rows.push(row);
  }

  const hasTransactions = transactions.length > 0 || newRows.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Queue</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            <span className="font-mono font-semibold text-slate-700">{queue.code}</span>
            {" · "}
            <span className="font-semibold text-slate-700">{queue.patientName}</span>
          </p>
        </div>
        <button type="button" onClick={() => router.push("/queue")}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Queue
        </button>
      </div>

      {/* ── Error / Success banners ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-emerald-700">Queue updated successfully.</p>
        </div>
      )}

      {/* ── Info Panel ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Info</h2>
        </div>
        <div className="grid gap-x-6 gap-y-4 p-5 sm:grid-cols-3">

          {/* LEFT: Patient */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Patient&apos;s Name</label>
              <input readOnly value={queue.patientName}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">DOB</label>
                <input readOnly value={queue.dob ?? "—"}
                  className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-2 py-2 text-xs text-slate-900 outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Gender</label>
                <input readOnly value={queue.gender || "—"}
                  className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-2 py-2 text-xs text-slate-900 outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Age</label>
                <input readOnly value={queue.age != null ? `${queue.age}` : "—"}
                  className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-2 py-2 text-xs text-slate-900 outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                placeholder="Notes..."
                className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
            </div>
          </div>

          {/* MIDDLE: Vitals */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">PID / Accession No.</label>
              <input type="text" value={accessionNo} onChange={(e) => setAccessionNo(e.target.value)}
                placeholder="Accession number"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Medication</label>
              <input type="text" value={medication} onChange={(e) => setMedication(e.target.value)}
                placeholder="Current medication"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Last Dose</label>
              <input type="datetime-local" value={lastDose} onChange={(e) => setLastDose(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Last Period</label>
              <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
            </div>
          </div>

          {/* RIGHT: Queue meta */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Queue No.</label>
              <input readOnly value={queue.code}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Queue Status</label>
              <select value={status} onChange={(e) => setStatus(Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30">
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Input By</label>
              <input readOnly value={queue.inputBy}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Date Time</label>
              <input readOnly value={formatDateTime(queue.dateTime)}
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
            </div>
            {/* To Comeback */}
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-amber-800">
                <input
                  type="checkbox"
                  checked={toComeBack}
                  onChange={(e) => setToComeBack(e.target.checked)}
                  className="h-4 w-4 rounded border-amber-400 accent-amber-600"
                />
                To Comeback
              </label>
              {toComeBack && (
                <button
                  type="button"
                  onClick={handleGenerateQR}
                  disabled={qrLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                  </svg>
                  {qrLoading ? "Opening…" : "Generate QR"}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Transaction(s) Panel ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-emerald-50/60 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Transaction(s)</h2>
          <div className="flex items-center gap-3">
            {hasTransactions && (
              <span className="text-xs text-slate-500">
                {transactions.length + newRows.length} item{(transactions.length + newRows.length) !== 1 ? "s" : ""} · Total: ₱{totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            )}
            {!addPanelOpen && (
              <button type="button"
                onClick={() => setAddPanelOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add
              </button>
            )}
          </div>
        </div>

        {/* ── Add Items Panel ── */}
        {addPanelOpen && (
          <div className="border-b border-slate-100 bg-slate-50/40 p-5">
            <div className="mb-4 grid gap-4 sm:grid-cols-3">
              <SearchDropdown<CompanyResult>
                label="Company / HMO" placeholder="Search company..." required
                value={panelCompany} displayValue={panelCompany?.Name ?? ""}
                onSelect={setPanelCompany}
                onClear={() => { setPanelCompany(null); setItems([]); setSelectedItemIds(new Set()); }}
                results={companyResults} loading={companyLoading} onSearch={searchCompanies}
                renderItem={(c) => (<div><p className="font-medium text-slate-800">{c.Name}</p><p className="text-xs text-slate-400">{c.Code}</p></div>)}
                renderSelected={(c) => (<div><p className="text-sm font-semibold text-slate-800">{c.Name}</p><p className="text-xs text-slate-500">{c.Code}</p></div>)}
              />
              <SearchDropdown<PhysicianResult>
                label="Doctor" placeholder="Search physician..." required
                value={panelPhysician} displayValue={panelPhysician?.displayName ?? ""}
                onSelect={setPanelPhysician} onClear={() => setPanelPhysician(null)}
                results={physicianResults} loading={physicianLoading} onSearch={searchPhysicians}
                renderItem={(p) => (<div><p className="font-medium text-slate-800">{p.displayName}</p><p className="text-xs text-slate-400">{p.degree}</p></div>)}
                renderSelected={(p) => (<div><p className="text-sm font-semibold text-slate-800">{p.displayName}</p><p className="text-xs text-slate-500">{p.degree}</p></div>)}
              />
              <TxTypeDropdown value={txType} options={txTypes} onChange={setTxType} />
            </div>

            {panelCompany && (
              <div className="mt-3">
                {itemsLoading ? (
                  <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Loading items for {panelCompany.Name}…
                  </div>
                ) : items.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">No items found for this company.</p>
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{items.length} items · {selectedItemIds.size} selected</span>
                      <button type="button" onClick={() => setSelectedItemIds(new Set(items.map(i => i.IdItem)))}
                        className="text-xs text-blue-600 hover:underline">Select all</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="w-8 px-3 py-2"></th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Code</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Description</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Category</th>
                            <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map((item) => (
                            <tr key={item.IdItem} onClick={() => toggleItem(item.IdItem)}
                              className={`cursor-pointer transition-colors ${selectedItemIds.has(item.IdItem) ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                              <td className="px-3 py-2 text-center">
                                <input type="checkbox" checked={selectedItemIds.has(item.IdItem)}
                                  onChange={() => toggleItem(item.IdItem)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600" />
                              </td>
                              <td className="whitespace-nowrap px-3 py-2 font-mono text-slate-600">{item.Code}</td>
                              <td className="px-3 py-2 text-slate-800">
                                {item.Description}
                                {item.PDefault && <span className="ml-1 text-xs text-red-500">{item.PDefault}</span>}
                              </td>
                              <td className="px-3 py-2 text-slate-500">{item.Group || item.PriceGroup}</td>
                              <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-slate-700">
                                ₱{item.Price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {panelError && <p className="mt-3 text-xs font-medium text-red-600">{panelError}</p>}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button"
                onClick={() => { setAddPanelOpen(false); setPanelCompany(null); setPanelPhysician(null); setItems([]); setSelectedItemIds(new Set()); setPanelError(""); }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="button" onClick={addSelectedItems}
                disabled={!panelCompany || selectedItemIds.size === 0}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add {selectedItemIds.size > 0 ? `${selectedItemIds.size} Selected` : "Selected"}
              </button>
            </div>
          </div>
        )}

        {/* ── Transaction table ── */}
        {!hasTransactions && !addPanelOpen ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-slate-400">
            <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
            <p>No transactions on this queue entry.</p>
          </div>
        ) : hasTransactions ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-700 text-white">
                  <th className="px-4 py-2.5 font-semibold">Company Name</th>
                  <th className="px-4 py-2.5 font-semibold">Item Code</th>
                  <th className="px-4 py-2.5 font-semibold">Item Description</th>
                  <th className="px-4 py-2.5 font-semibold">Card Number</th>
                  <th className="px-4 py-2.5 font-semibold">Type</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Item Amount</th>
                  <th className="px-4 py-2.5 font-semibold">Input By</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>

                {/* Existing saved transactions grouped by doctor */}
                {existingGroups.flatMap(({ doctorName, idDoctor, rows }) => [
                  <tr key={`hdr-${doctorName}`}>
                    <td colSpan={9} className="bg-slate-100 px-4 py-1.5">
                      <div className="flex items-center gap-2">
                        {idDoctor ? (
                          <>
                            <button type="button"
                              onClick={() => openViewModal(idDoctor)}
                              className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                              View
                            </button>
                            <button type="button"
                              onClick={() => openEditModal(idDoctor)}
                              className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                              </svg>
                              Edit
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-400">
                            No Doctor
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-600">{doctorName}</span>
                      </div>
                    </td>
                  </tr>,
                  ...rows.map((tx) => (
                    <tr key={tx.id}
                      className={`border-t border-slate-100 ${tx.status === 650 ? "bg-red-50/20" : "hover:bg-slate-50/60"}`}>
                      <td className={`px-4 py-2.5 ${tx.status === 650 ? "text-slate-400 line-through" : "text-blue-600"}`}>{tx.nameCompany}</td>
                      <td className={`px-4 py-2.5 font-mono ${tx.status === 650 ? "text-slate-400 line-through" : "text-slate-700"}`}>{tx.codeItemPrice}</td>
                      <td className={`px-4 py-2.5 ${tx.status === 650 ? "text-slate-400 line-through" : "text-slate-800"}`}>{tx.descriptionItemPrice}</td>
                      <td className={`px-4 py-2.5 ${tx.status === 650 ? "text-slate-400" : "text-slate-500"}`}>{tx.cardNumber || "—"}</td>
                      <td className={`px-4 py-2.5 ${tx.status === 650 ? "text-slate-400" : "text-slate-500"}`}>{tx.transactionType}</td>
                      <td className="px-4 py-2.5">
                        {tx.status === 650 ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">
                            Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {statuses.find((s) => s.id === tx.status)?.name ?? tx.status}
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-medium ${tx.status === 650 ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        ₱{tx.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-4 py-2.5 ${tx.status === 650 ? "text-slate-400" : "text-slate-500"}`}>{tx.inputBy}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-0.5">
                          {tx.status < 210 && (
                            <>
                              <button type="button" onClick={() => openRemoveTx(tx)}
                                title="Remove transaction"
                                className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                              <button type="button" onClick={() => openEditTx(tx)}
                                title="Amendment — edit doctor / company / item"
                                className="rounded p-1 text-slate-300 hover:bg-emerald-50 hover:text-emerald-600">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                            </>
                          )}
                          {/* HL7 Resend button — only for [HL7BTN] role */}
                          {isHl7Btn && tx.status < 210 && (() => {
                            const sent    = hl7Sent.has(tx.groupItemMaster);
                            const sending = hl7Sending.has(tx.id);
                            return (
                              <button
                                type="button"
                                onClick={() => !sent && handleHl7Resend(tx)}
                                disabled={sending}
                                title={sent ? "HL7 message sent" : "Resend HL7 message"}
                                className={`rounded p-1 ${sent ? "cursor-default text-green-600" : "text-blue-500 hover:bg-blue-50 hover:text-blue-700"}`}
                              >
                                {sending ? (
                                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                  </svg>
                                ) : sent ? (
                                  /* checkmark */
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                ) : (
                                  /* repeat/refresh */
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                  </svg>
                                )}
                              </button>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  )),
                ])}

                {/* Newly staged (unsaved) transactions grouped by doctor */}
                {newGroups.flatMap(({ doctorName, rows }) => [
                  <tr key={`new-hdr-${doctorName}`}>
                    <td colSpan={9} className="bg-amber-50 px-4 py-1.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">New</span>
                        <span className="text-xs font-semibold text-slate-600">{doctorName}</span>
                      </div>
                    </td>
                  </tr>,
                  ...rows.map((row) => (
                    <tr key={row.key} className="border-t border-amber-100 bg-amber-50/30 hover:bg-amber-50/60">
                      <td className="px-4 py-2.5 text-blue-600">{row.nameCompany}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-700">{row.codeItemPrice}</td>
                      <td className="px-4 py-2.5 text-slate-800">{row.descriptionItemPrice}</td>
                      <td className="px-4 py-2.5 text-slate-400">—</td>
                      <td className="px-4 py-2.5 text-slate-500">{row.transactionType}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                          Pending Save
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-slate-700">
                        ₱{row.amountItemPrice.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">—</td>
                      <td className="px-4 py-2.5">
                        <button type="button" onClick={() => removeNewRow(row.key)}
                          className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )),
                ])}

              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td colSpan={6} className="px-4 py-2.5 text-right text-xs font-semibold text-slate-600">Total Amount</td>
                  <td className="px-4 py-2.5 text-right text-sm font-bold text-slate-800">
                    ₱{totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : null}
      </div>

      {/* ── Action bar ── */}
      {/* Re-generate feedback toast */}
      {regenMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <p className="text-sm font-medium text-blue-700">{regenMsg}</p>
        </div>
      )}
      {approveError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{approveError}</p>
        </div>
      )}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Left row: Amendment Que | View Deleted | Amendment Approve | Re-Generate Lab PDF */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
          {/* Amendment Que — opens cancel/ante-date modal; disabled if already cancelled or ante-dated */}
          <button type="button"
            onClick={() => setCancelModalOpen(true)}
            disabled={queue.status >= 650 || queue.status === 202}
            title={queue.status === 202 ? "Already an ante-date queue" : queue.status >= 650 ? "Queue is cancelled" : "Create amendment / ante-date queue"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 hover:enabled:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Amendment Que
          </button>

          <button type="button" onClick={() => setViewDeletedOpen(true)}
            disabled={transactions.filter((tx) => tx.status === 650).length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700 hover:enabled:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.573-3.007-9.964-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            View - Deleted
          </button>

          {/* Amendment Approve — always visible; active only for BM-ROLE when status === 202 */}
          <button type="button"
            onClick={() => setApproveConfirmOpen(true)}
            disabled={approveSaving || !isBmRole || queue.status !== 202}
            title={!isBmRole ? "Requires BM-ROLE" : queue.status !== 202 ? "Only available for ante-date queues (status 202)" : "Approve amendment"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 hover:enabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
            {approveSaving ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
            Amendment Approve
          </button>

          {/* Re-Generate Lab PDF — always visible; active only for RESULTS-RELEASING role */}
          <button type="button"
            onClick={handleRegenPdf}
            disabled={regenSaving || !isResultsReleasing}
            title={!isResultsReleasing ? "Requires Results-Releasing role" : "Re-generate lab PDF result"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:enabled:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40">
            {regenSaving ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            )}
            Re-Generate Lab PDF Result
          </button>

          {/* View Lab Result PDF — opens generated PDF in new tab */}
          <a
            href={`/api/queue/${queue.id}/pdf?type=lab-result`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            View Lab PDF
          </a>

          {/* spacer pushes Payment + Save to the right */}
          <div className="flex-1" />

          {/* Payment button — hidden for [CMS-CSR-VIEW] role (matches PHP CMS) */}
          {!isCsrView && (
            <button type="button"
              onClick={() => router.push(`/payment/${queue.id}`)}
              disabled={queue.status >= 650}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-700 hover:enabled:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              Payment
            </button>
          )}

          <button type="button" onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>

        {/* Back row — below the main action bar */}
        <div className="border-t border-slate-100 px-5 py-2">
          <button type="button" onClick={() => router.push("/queue")}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* ── Physician View Modal ── */}
      {viewModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModals} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-base font-bold text-slate-900">Physician Information View</h3>
              <button type="button" onClick={closeModals}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4">
              {modalLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span className="text-sm">Loading…</span>
                </div>
              ) : physicianDetail ? (
                <dl className="space-y-3">
                  {([
                    ["Last Name",             physicianDetail.lastName],
                    ["First Name",            physicianDetail.firstName],
                    ["Middle Name",           physicianDetail.middleName],
                    ["Display Name",          physicianDetail.displayName],
                    ["PRC No.",               physicianDetail.prcNo],
                    ["Specialization",        physicianDetail.degree],
                    ["Branch Request Origin", physicianDetail.branchCode],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-5 gap-2">
                      <dt className="col-span-2 text-xs font-medium text-slate-500">{label}</dt>
                      <dd className="col-span-3 text-sm text-slate-800">{value || "—"}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-5 gap-2">
                    <dt className="col-span-2 text-xs font-medium text-slate-500">Status</dt>
                    <dd className="col-span-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        physicianDetail.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : physicianDetail.status === "Declined"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {physicianDetail.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="py-10 text-center text-sm text-slate-400">Physician data not found.</p>
              )}
              {physicianError && (
                <p className="mt-3 text-xs font-medium text-red-600">{physicianError}</p>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={closeModals}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Close
              </button>
              {physicianDetail && (
                <div className="flex items-center gap-2">
                  <button type="button" disabled={physicianSaving}
                    onClick={() => handlePhysicianStatusChange(viewModal, "Declined")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                    Decline
                  </button>
                  <button type="button" disabled={physicianSaving}
                    onClick={() => handlePhysicianStatusChange(viewModal, "Active")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50">
                    {physicianSaving ? "Saving…" : "Approve"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Physician Edit Modal ── */}
      {editModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModals} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-base font-bold text-slate-900">Physician Information Edit</h3>
              <button type="button" onClick={closeModals}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4">
              {modalLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span className="text-sm">Loading…</span>
                </div>
              ) : physicianDetail ? (
                <div className="space-y-3">
                  {([
                    ["Last Name",             physicianDetail.lastName],
                    ["First Name",            physicianDetail.firstName],
                    ["Middle Name",           physicianDetail.middleName],
                    ["Display Name",          physicianDetail.displayName],
                    ["PRC No.",               physicianDetail.prcNo],
                    ["Specialization",        physicianDetail.degree],
                    ["Branch Request Origin", physicianDetail.branchCode],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-5 items-center gap-2">
                      <label className="col-span-2 text-xs font-medium text-slate-500">{label}</label>
                      <input readOnly value={value || ""}
                        className="col-span-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 outline-none" />
                    </div>
                  ))}

                  {/* Editable: Status */}
                  <div className="grid grid-cols-5 items-center gap-2">
                    <label className="col-span-2 text-xs font-medium text-slate-500">Status</label>
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}
                      className="col-span-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Declined">Declined</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Editable: Reason For Revision */}
                  <div className="grid grid-cols-5 items-start gap-2">
                    <label className="col-span-2 pt-2 text-xs font-medium text-slate-500">Reason For Revision</label>
                    <textarea value={editDeclineReason} onChange={(e) => setEditDeclineReason(e.target.value)}
                      rows={2} placeholder="Enter reason…"
                      className="col-span-3 resize-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
                  </div>
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-slate-400">Physician data not found.</p>
              )}
              {physicianError && (
                <p className="mt-3 text-xs font-medium text-red-600">{physicianError}</p>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={closeModals}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Close
              </button>
              {physicianDetail && (
                <button type="button" onClick={handlePhysicianSave} disabled={physicianSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                  {physicianSaving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Saving…
                    </>
                  ) : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Transaction Modal ── */}
      {editingTx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingTx(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Amendment For — Doctor / Company / Transaction Type</h3>
                <p className="mt-0.5 text-xs text-slate-500 font-mono">{editingTx.codeItemPrice} — {editingTx.descriptionItemPrice}</p>
              </div>
              <button type="button" onClick={() => setEditingTx(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Doctor / Company / TxType row — order matches v1 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <SearchDropdown<PhysicianResult>
                  label="Doctor's Name" placeholder="Search physician…" required
                  value={editTxPhysician} displayValue={editTxPhysician?.displayName ?? ""}
                  onSelect={setEditTxPhysician} onClear={() => setEditTxPhysician(null)}
                  results={physicianResults} loading={physicianLoading} onSearch={searchPhysicians}
                  renderItem={(p) => (<div><p className="font-medium text-slate-800">{p.displayName}</p><p className="text-xs text-slate-400">{p.degree}</p></div>)}
                  renderSelected={(p) => (<div><p className="text-sm font-semibold text-slate-800">{p.displayName}</p><p className="text-xs text-slate-500">{p.degree}</p></div>)}
                />
                <SearchDropdown<CompanyResult>
                  label="Company Name" placeholder="Search company…" required
                  value={editTxCompany} displayValue={editTxCompany?.Name ?? ""}
                  onSelect={setEditTxCompany}
                  onClear={() => { setEditTxCompany(null); setEditTxItems([]); setEditTxSelectedItemId(null); }}
                  results={companyResults} loading={companyLoading} onSearch={searchCompanies}
                  renderItem={(c) => (<div><p className="font-medium text-slate-800">{c.Name}</p><p className="text-xs text-slate-400">{c.Code}</p></div>)}
                  renderSelected={(c) => (<div><p className="text-sm font-semibold text-slate-800">{c.Name}</p><p className="text-xs text-slate-500">{c.Code}</p></div>)}
                />
                <TxTypeDropdown value={editTxType} options={txTypes} onChange={setEditTxType} />
              </div>

              {/* Item selection */}
              {editTxCompany && (
                editTxItemsLoading ? (
                  <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Loading items…
                  </div>
                ) : editTxItems.length === 0 ? (
                  <p className="py-4 text-center text-sm text-slate-400">No items found for this company.</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 sticky top-0">
                          <th className="w-8 px-3 py-2"></th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-600">Code</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-600">Description</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-600">Category</th>
                          <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {editTxItems.map((item) => (
                          <tr key={item.IdItem}
                            onClick={() => setEditTxSelectedItemId(item.IdItem)}
                            className={`cursor-pointer transition-colors ${editTxSelectedItemId === item.IdItem ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                            <td className="px-3 py-2 text-center">
                              <input type="radio" checked={editTxSelectedItemId === item.IdItem}
                                onChange={() => setEditTxSelectedItemId(item.IdItem)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-3.5 w-3.5 border-slate-300 text-blue-600" />
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 font-mono text-slate-600">{item.Code}</td>
                            <td className="px-3 py-2 text-slate-800">
                              {item.Description}
                              {item.PDefault && <span className="ml-1 text-xs text-red-500">{item.PDefault}</span>}
                            </td>
                            <td className="px-3 py-2 text-slate-500">{item.Group || item.PriceGroup}</td>
                            <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-slate-700">
                              ₱{item.Price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {editTxError && <p className="text-xs font-medium text-red-600">{editTxError}</p>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={() => setEditingTx(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Close
              </button>
              <button type="button" onClick={handleEditTxSave} disabled={editTxSaving || !editTxSelectedItemId}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                {editTxSaving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Saving…
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove Transaction Confirm Modal ── */}
      {removingTx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="rounded-t-xl bg-green-600 px-6 py-3">
              <h3 className="text-base font-bold text-white">Transaction - Remove</h3>
            </div>

            {/* Body */}
            <div className="space-y-3 px-6 py-5">
              {/* Item Code */}
              <div className="flex items-center gap-4">
                <label className="w-28 shrink-0 text-right text-sm font-semibold text-slate-700">
                  Item Code<span className="ml-0.5 text-red-500">*</span>
                </label>
                <input readOnly value={removingTx.codeItemPrice}
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 outline-none" />
              </div>
              {/* Item Name */}
              <div className="flex items-center gap-4">
                <label className="w-28 shrink-0 text-right text-sm font-semibold text-slate-700">
                  Item Name<span className="ml-0.5 text-red-500">*</span>
                </label>
                <input readOnly value={removingTx.descriptionItemPrice}
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 outline-none" />
              </div>
              {/* Item Status */}
              <div className="flex items-center gap-4">
                <label className="w-28 shrink-0 text-right text-sm font-semibold text-slate-700">
                  Item Status
                </label>
                <input readOnly value={removingTx.statusName}
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 outline-none" />
              </div>
              {/* Input By */}
              <div className="flex items-center gap-4">
                <label className="w-28 shrink-0 text-right text-sm font-semibold text-slate-700">
                  Input By
                </label>
                <input readOnly value={removingTx.inputBy}
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 outline-none" />
              </div>
              {/* Reason */}
              <div className="flex items-center gap-4">
                <label className="w-28 shrink-0 text-right text-sm font-semibold text-slate-700">
                  Reason<span className="ml-0.5 text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={removeReason}
                  onChange={(e) => setRemoveReason(e.target.value)}
                  placeholder="Reason"
                  className="flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30"
                />
              </div>
              {/* NOTE */}
              <div className="flex items-start gap-4">
                <label className="w-28 shrink-0 text-right text-sm font-bold text-red-600">NOTE</label>
                <div className="flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-red-600">
                  Re-Billing required for any removed / deleted procedure.
                </div>
              </div>
              {removeError && (
                <p className="text-center text-xs font-medium text-red-600">{removeError}</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={() => setRemovingTx(null)}
                className="rounded border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Close
              </button>
              <button type="button" onClick={handleRemoveTx}
                disabled={removeSaving || !removeReason.trim()}
                className="inline-flex items-center gap-1.5 rounded bg-amber-500 px-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50">
                {removeSaving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Removing…
                  </>
                ) : "Remove & Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Amendment Approve Confirmation Modal ── */}
      {approveConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setApproveConfirmOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            {/* Icon + Title */}
            <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900">Approve Amendment</h3>
              <p className="text-sm text-slate-500">
                Approve this ante-date queue? The queue will be activated and the original cancelled queue will be voided.
              </p>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={() => setApproveConfirmOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="button" onClick={confirmApproveAmendment}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Queue / Ante-date Modal ── */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancelModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Cancel / Ante-date Queue</h3>
                <p className="mt-0.5 font-mono text-xs font-semibold text-slate-500">{queue.code}</p>
              </div>
              <button type="button" onClick={() => setCancelModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Info note */}
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <p className="text-xs text-amber-700">
                  This will cancel the current queue and create a new ante-date queue (Status 202) with all active transactions copied over. You will be redirected to the new queue.
                </p>
              </div>

              {/* New date */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  New Scheduled Date <span className="text-red-500">*</span>
                </label>
                <input type="date" value={cancelAnteDate}
                  onChange={(e) => setCancelAnteDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30" />
              </div>

              {/* Reason */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Reason / Notes <span className="text-red-500">*</span>
                </label>
                <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                  rows={3} placeholder="Enter reason for cancellation / rescheduling…"
                  className="block w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30" />
              </div>

              {cancelError && <p className="text-xs font-medium text-red-600">{cancelError}</p>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={() => setCancelModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Close
              </button>
              <button type="button" onClick={handleCancelQueue} disabled={cancelSaving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50">
                {cancelSaving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Deleted Transactions Modal ── */}
      {viewDeletedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewDeletedOpen(false)} />
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Transaction History — Deleted / Cancelled</h3>
                <p className="mt-0.5 font-mono text-xs font-semibold text-slate-500">{queue.code}</p>
              </div>
              <button type="button" onClick={() => setViewDeletedOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              {transactions.filter((tx) => tx.status === 650).length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                  </svg>
                  <p className="text-sm">No cancelled transactions found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-700 text-white">
                        <th className="px-4 py-2.5 font-semibold">Item Code</th>
                        <th className="px-4 py-2.5 font-semibold">Item Description</th>
                        <th className="px-4 py-2.5 font-semibold">Company</th>
                        <th className="px-4 py-2.5 font-semibold">Type</th>
                        <th className="px-4 py-2.5 font-semibold">Status</th>
                        <th className="px-4 py-2.5 font-semibold">Input By</th>
                        <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.filter((tx) => tx.status === 650).map((tx) => (
                        <tr key={tx.id} className="bg-red-50/20">
                          <td className="px-4 py-2.5 font-mono text-slate-500 line-through">{tx.codeItemPrice}</td>
                          <td className="px-4 py-2.5 text-slate-500 line-through">{tx.descriptionItemPrice}</td>
                          <td className="px-4 py-2.5 text-slate-500">{tx.nameCompany}</td>
                          <td className="px-4 py-2.5 text-slate-400">{tx.transactionType}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">
                              Cancelled
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-400">{tx.inputBy}</td>
                          <td className="px-4 py-2.5 text-right font-medium text-slate-400 line-through">
                            ₱{tx.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end border-t border-slate-100 px-6 py-4">
              <button type="button" onClick={() => setViewDeletedOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
