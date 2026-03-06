"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

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

  const activeTxs = transactions.filter((tx) => tx.status < 650);
  const paidTxs   = transactions.filter((tx) => tx.status === 210);
  const cancelledTxs = transactions.filter((tx) => tx.status === 650);

  // All active IDs pre-selected
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(activeTxs.filter((tx) => tx.status < 210).map((tx) => tx.id))
  );

  const [providerType,  setProviderType]  = useState<"PATIENT" | "HMO">("PATIENT");
  const [billTo,        setBillTo]        = useState("");
  const [cardNumber,    setCardNumber]    = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [orNumber,      setOrNumber]      = useState("");

  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const unpaidTxs = activeTxs.filter((tx) => tx.status < 210);

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

  async function handleSubmit() {
    if (selectedIds.size === 0) { setError("Please select at least one transaction to pay."); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/queue/${queue.id}/payment`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerType,
          billTo:        providerType === "HMO" ? billTo : "",
          cardNumber:    providerType === "HMO" ? cardNumber : "",
          paymentMethod,
          orNumber,
          transactionIds: Array.from(selectedIds),
        }),
      });
      const data = await res.json() as { success?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Payment failed");
      setSuccess(data.message ?? "Payment processed successfully.");
      setTimeout(() => router.push(`/queue/${queue.id}/edit`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  const alreadyFullyPaid = queue.status >= 210 && queue.status < 650;

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payment</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            <span className="font-mono font-semibold text-slate-700">{queue.code}</span>
            {" · "}
            <span className="font-semibold text-slate-700">{queue.patientName}</span>
          </p>
        </div>
        <button type="button" onClick={() => router.push(`/queue/${queue.id}/edit`)}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Queue
        </button>
      </div>

      {/* ── Queue Info ── */}
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Queue No.</p>
            <p className="font-mono font-semibold text-slate-800">{queue.code}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Patient</p>
            <p className="font-semibold text-slate-800">{queue.patientName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Type</p>
            <p className="text-slate-700">{queue.patientType}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Date/Time</p>
            <p className="text-slate-700">{formatDateTime(queue.dateTime)}</p>
          </div>
        </div>
        {alreadyFullyPaid && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <svg className="h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-xs font-medium text-emerald-700">All transactions have been fully paid for this queue.</p>
          </div>
        )}
      </div>

      {/* ── Banners ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-sm font-medium text-emerald-700">{success}</p>
        </div>
      )}

      {/* ── Transactions panel ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Transactions
            {unpaidTxs.length > 0 && (
              <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                {selectedIds.size}/{unpaidTxs.length} selected
              </span>
            )}
          </h2>
          {unpaidTxs.length > 0 && (
            <div className="flex items-center gap-3">
              <button type="button" onClick={selectAll}
                className="text-xs text-blue-600 hover:underline">Select all</button>
              <button type="button" onClick={clearAll}
                className="text-xs text-slate-400 hover:underline">Clear</button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-700 text-white">
                <th className="w-8 px-4 py-2.5"></th>
                <th className="px-4 py-2.5 font-semibold">Company</th>
                <th className="px-4 py-2.5 font-semibold">Item Code</th>
                <th className="px-4 py-2.5 font-semibold">Item Description</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No transactions on this queue.</td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isPaid = tx.status === 210;
                  const isCancelled = tx.status === 650;
                  const isUnpaid = !isPaid && !isCancelled;
                  const isSelected = selectedIds.has(tx.id);

                  return (
                    <tr key={tx.id}
                      onClick={() => isUnpaid && toggleTx(tx.id)}
                      className={`border-t border-slate-100 transition-colors ${
                        isCancelled ? "bg-red-50/20 opacity-50" :
                        isPaid      ? "bg-emerald-50/30" :
                        isSelected  ? "cursor-pointer bg-blue-50/40 hover:bg-blue-50/60" :
                                      "cursor-pointer hover:bg-slate-50/60"
                      }`}>
                      <td className="px-4 py-2.5 text-center">
                        {isUnpaid && (
                          <input type="checkbox" checked={isSelected}
                            onChange={() => toggleTx(tx.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600" />
                        )}
                      </td>
                      <td className={`px-4 py-2.5 ${isCancelled ? "text-slate-400 line-through" : "text-blue-600"}`}>
                        {tx.nameCompany}
                      </td>
                      <td className={`px-4 py-2.5 font-mono ${isCancelled ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        {tx.codeItemPrice}
                      </td>
                      <td className={`px-4 py-2.5 ${isCancelled ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {tx.descriptionItemPrice}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">{tx.transactionType}</td>
                      <td className="px-4 py-2.5">
                        {isCancelled ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">
                            Cancelled
                          </span>
                        ) : isPaid ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                            Fully Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {tx.statusName}
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-medium ${isCancelled ? "text-slate-400 line-through" : isPaid ? "text-emerald-700" : "text-slate-700"}`}>
                        {formatAmount(tx.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {transactions.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={5}></td>
                  <td className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">
                    {selectedIds.size > 0 ? `Selected (${selectedIds.size})` : "Total"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-sm font-bold text-slate-800">
                    {formatAmount(selectedIds.size > 0 ? selectedTotal : transactions.reduce((s, tx) => s + tx.amount, 0))}
                  </td>
                </tr>
                {paidTxs.length > 0 && (
                  <tr className="border-t border-slate-100 bg-emerald-50/50">
                    <td colSpan={5}></td>
                    <td className="px-4 py-2 text-right text-xs font-semibold text-emerald-600">
                      Already Paid ({paidTxs.length})
                    </td>
                    <td className="px-4 py-2 text-right text-sm font-bold text-emerald-700">
                      {formatAmount(paidTxs.reduce((s, tx) => s + tx.amount, 0))}
                    </td>
                  </tr>
                )}
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ── Payment form ── */}
      {unpaidTxs.length > 0 && !alreadyFullyPaid && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-700">Payment Details</h2>
          </div>
          <div className="px-5 py-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Provider type */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Provider Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {(["PATIENT", "HMO"] as const).map((pt) => (
                    <button key={pt} type="button"
                      onClick={() => setProviderType(pt)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                        providerType === pt
                          ? "border-blue-400 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}>
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill To (HMO only) */}
              {providerType === "HMO" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Bill To (HMO Name)
                  </label>
                  <input type="text" value={billTo} onChange={(e) => setBillTo(e.target.value)}
                    placeholder="Enter HMO / company name…"
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
                </div>
              )}

              {/* Card Number (HMO only) */}
              {providerType === "HMO" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Card Number
                  </label>
                  <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="HMO card number…"
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
                </div>
              )}

              {/* Payment method */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30">
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* OR Number */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">OR Number</label>
                <input type="text" value={orNumber} onChange={(e) => setOrNumber(e.target.value)}
                  placeholder="Official receipt number…"
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30" />
              </div>
            </div>

            {/* Payment summary */}
            {selectedIds.size > 0 && (
              <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-700">
                    {selectedIds.size} transaction{selectedIds.size !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-lg font-bold text-blue-800">{formatAmount(selectedTotal)}</p>
                </div>
                <p className="mt-0.5 text-xs text-blue-600">
                  {paymentMethod} · {providerType}
                  {orNumber ? ` · OR# ${orNumber}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <button type="button" onClick={() => router.push(`/queue/${queue.id}/edit`)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        {unpaidTxs.length > 0 && !alreadyFullyPaid && (
          <button type="button" onClick={handleSubmit} disabled={saving || selectedIds.size === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
            {saving ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
                Process Payment ({selectedIds.size})
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
}
