"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, X } from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface QueueSummary {
  id: number;
  code: string;
  patientName: string;
  patientType: string;
  status: number;
  statusName: string;
  dateTime: string;
}

interface TransactionRow {
  id: number;
  idDoctor: number | null;
  nameDoctor: string;
  nameCompany: string;
  codeItemPrice: string;
  descriptionItemPrice: string;
  priceGroupItemPrice: string;
  amount: number;
  amountRemaining: number;
  transactionType: string;
  status: number;
  statusName: string;
}

const PAYMENT_METHODS = ["Cash", "GCash", "Credit Card", "Cheque", "Online Transfer"] as const;

function formatAmount(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function formatDateTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export function PaymentForm({
  queue,
  transactions,
}: {
  queue: QueueSummary;
  transactions: TransactionRow[];
}) {
  const router = useRouter();
  const { toasts, toast, dismiss } = useToast();

  const activeTxs = transactions.filter((tx) => tx.status < 650);
  const paidTxs   = transactions.filter((tx) => tx.status === 210);
  const unpaidTxs = activeTxs.filter((tx) => tx.status < 210);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(unpaidTxs.map((tx) => tx.id))
  );

  const [providerType,  setProviderType]  = useState<"PATIENT" | "HMO">("PATIENT");
  const [billTo,        setBillTo]        = useState("");
  const [cardNumber,    setCardNumber]    = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [orNumber,      setOrNumber]      = useState("");

  const [saving,      setSaving]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const alreadyFullyPaid = queue.status >= 210 && queue.status < 650;

  const selectedTotal = useMemo(
    () => unpaidTxs.filter((tx) => selectedIds.has(tx.id)).reduce((s, tx) => s + tx.amountRemaining, 0),
    [unpaidTxs, selectedIds]
  );

  function toggleTx(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function selectAll() { setSelectedIds(new Set(unpaidTxs.map((tx) => tx.id))); }
  function clearAll()  { setSelectedIds(new Set()); }

  function handleProcessClick() {
    if (selectedIds.size === 0) {
      toast("Please select at least one transaction to pay.", "error");
      return;
    }
    setShowConfirm(true);
  }

  async function handleConfirmPayment() {
    setShowConfirm(false);
    setSaving(true);
    try {
      const res = await fetch(`/api/queue/${queue.id}/payment`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerType,
          billTo:     providerType === "HMO" ? billTo : "",
          cardNumber: providerType === "HMO" ? cardNumber : "",
          paymentMethod,
          orNumber,
          transactionIds: Array.from(selectedIds),
        }),
      });
      const data = await res.json() as { success?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Payment failed");
      toast(data.message ?? "Payment processed successfully.");
      setTimeout(() => router.push(`/queue/${queue.id}/edit`), 1800);
    } catch (err) {
      toast(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setSaving(false);
    }
  }

  const INPUT_CLS = "block w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400";
  const INPUT_VALID = "border-slate-200 hover:border-slate-300 focus:border-blue-400 dark:border-slate-600 dark:hover:border-slate-500";

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Payment</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{queue.code}</span>
            {" · "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{queue.patientName}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/queue/${queue.id}/edit`)}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Queue
        </button>
      </div>

      {/* ── Queue Info ── */}
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Queue No.</p>
            <p className="font-mono font-semibold text-slate-800 dark:text-slate-100">{queue.code}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Patient</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{queue.patientName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Type</p>
            <p className="text-slate-700 dark:text-slate-300">{queue.patientType}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Date / Time</p>
            <p className="text-slate-700 dark:text-slate-300">{formatDateTime(queue.dateTime)}</p>
          </div>
        </div>
        {alreadyFullyPaid && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-900/20">
            <svg className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              All transactions have been fully paid for this queue.
            </p>
          </div>
        )}
      </div>

      {/* ── Transactions ── */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Transactions
            {unpaidTxs.length > 0 && (
              <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {selectedIds.size}/{unpaidTxs.length} selected
              </span>
            )}
          </h2>
          {unpaidTxs.length > 0 && (
            <div className="flex items-center gap-3">
              <button type="button" onClick={selectAll}
                className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                Select all
              </button>
              <button type="button" onClick={clearAll}
                className="text-xs text-slate-400 hover:underline dark:text-slate-500">
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-700">
                <th className="w-8 px-4 py-3"></th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item Code</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item Description</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                    No transactions on this queue.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isPaid      = tx.status === 210;
                  const isCancelled = tx.status === 650;
                  const isUnpaid    = !isPaid && !isCancelled;
                  const isSelected  = selectedIds.has(tx.id);

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => isUnpaid && toggleTx(tx.id)}
                      className={`transition-colors ${
                        isCancelled ? "opacity-50" :
                        isPaid      ? "bg-emerald-50/30 dark:bg-emerald-900/10" :
                        isSelected  ? "cursor-pointer bg-blue-50/40 hover:bg-blue-50/60 dark:bg-blue-900/20 dark:hover:bg-blue-900/30" :
                                      "cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-700/40"
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        {isUnpaid && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleTx(tx.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 dark:border-slate-600"
                          />
                        )}
                      </td>
                      <td className={`px-4 py-3 ${isCancelled ? "text-slate-400 line-through" : "text-blue-600 dark:text-blue-400"}`}>
                        {tx.nameCompany}
                      </td>
                      <td className={`px-4 py-3 font-mono ${isCancelled ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-300"}`}>
                        {tx.codeItemPrice}
                      </td>
                      <td className={`px-4 py-3 ${isCancelled ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}>
                        {tx.descriptionItemPrice}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{tx.transactionType}</td>
                      <td className="px-4 py-3">
                        {isCancelled ? (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            Cancelled
                          </span>
                        ) : isPaid ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Fully Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {tx.statusName}
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        isCancelled ? "text-slate-400 line-through" :
                        isPaid      ? "text-emerald-700 dark:text-emerald-400" :
                                      "text-slate-700 dark:text-slate-200"
                      }`}>
                        {formatAmount(tx.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {transactions.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50">
                  <td colSpan={5}></td>
                  <td className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {selectedIds.size > 0 ? `Selected (${selectedIds.size})` : "Total"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-sm font-bold text-slate-800 dark:text-slate-100">
                    {formatAmount(selectedIds.size > 0
                      ? selectedTotal
                      : transactions.reduce((s, tx) => s + tx.amount, 0))}
                  </td>
                </tr>
                {paidTxs.length > 0 && (
                  <tr className="border-t border-slate-100 dark:border-slate-700">
                    <td colSpan={5}></td>
                    <td className="px-4 py-2 text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Already Paid ({paidTxs.length})
                    </td>
                    <td className="px-4 py-2 text-right text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {formatAmount(paidTxs.reduce((s, tx) => s + tx.amount, 0))}
                    </td>
                  </tr>
                )}
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ── Payment details form ── */}
      {unpaidTxs.length > 0 && !alreadyFullyPaid && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Payment Details</h2>
          </div>
          <div className="px-5 py-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Provider type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Provider Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {(["PATIENT", "HMO"] as const).map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setProviderType(pt)}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        providerType === pt
                          ? "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill To (HMO only) */}
              {providerType === "HMO" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Bill To (HMO Name)
                  </label>
                  <input
                    type="text"
                    value={billTo}
                    onChange={(e) => setBillTo(e.target.value)}
                    placeholder="Enter HMO / company name…"
                    className={`${INPUT_CLS} ${INPUT_VALID}`}
                  />
                </div>
              )}

              {/* Card Number (HMO only) */}
              {providerType === "HMO" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="HMO card number…"
                    className={`${INPUT_CLS} ${INPUT_VALID}`}
                  />
                </div>
              )}

              {/* Payment method */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={`${INPUT_CLS} ${INPUT_VALID}`}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* OR Number */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  OR Number
                </label>
                <input
                  type="text"
                  value={orNumber}
                  onChange={(e) => setOrNumber(e.target.value)}
                  placeholder="Official receipt number…"
                  className={`${INPUT_CLS} ${INPUT_VALID}`}
                />
              </div>
            </div>

            {/* Payment summary */}
            {selectedIds.size > 0 && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {selectedIds.size} transaction{selectedIds.size !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    {formatAmount(selectedTotal)}
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-blue-600 dark:text-blue-400">
                  {paymentMethod} · {providerType}
                  {orNumber ? ` · OR# ${orNumber}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => router.push(`/queue/${queue.id}/edit`)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        {unpaidTxs.length > 0 && !alreadyFullyPaid && (
          <button
            type="button"
            onClick={handleProcessClick}
            disabled={saving || selectedIds.size === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Process Payment ({selectedIds.size})
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Confirmation modal (standard template) ── */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col dark:border-slate-700 dark:bg-slate-800">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Confirm Payment</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Payment Summary
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Patient</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{queue.patientName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Method</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Provider</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{providerType}</span>
                  </div>
                  {orNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">OR No.</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-100">{orNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-700">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Total</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatAmount(selectedTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 shrink-0 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98]"
              >
                <CreditCard className="h-4 w-4" />
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
