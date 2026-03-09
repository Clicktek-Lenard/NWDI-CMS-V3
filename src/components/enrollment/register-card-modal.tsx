"use client";

import { useEffect, useRef, useState } from "react";
import { X, CreditCard, Search, Loader2, ChevronDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface VerifiedCard {
  id: number;
  verifiedcardnumber: string;
  year: number | null;
  batch: number | null;
  month: number | null;
}

interface Clinic {
  code: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onRegistered: () => void;
}

export function RegisterCardModal({ open, onClose, onRegistered }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);

  const [availableCards, setAvailableCards] = useState<VerifiedCard[]>([]);
  const [clinics, setClinics]               = useState<Clinic[]>([]);
  const [cardSearch, setCardSearch]         = useState("");
  const [selectedCard, setSelectedCard]     = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [loadingCards, setLoadingCards]     = useState(false);
  const [error, setError]                   = useState("");

  // Reset on open + load data
  useEffect(() => {
    if (!open) return;
    setCardSearch("");
    setSelectedCard("");
    setSelectedClinic("");
    setError("");

    setLoadingCards(true);
    Promise.all([
      apiFetch<{ data: VerifiedCard[] }>("/api/enrollment/verified?available=true&pageSize=200"),
      apiFetch<{ data: Clinic[] }>("/api/enrollment/clinics"),
    ])
      .then(([verifiedJson, clinicsJson]) => {
        setAvailableCards(verifiedJson.data);
        setClinics(clinicsJson.data);
      })
      .catch(() => {
        setAvailableCards([]);
        setClinics([]);
      })
      .finally(() => setLoadingCards(false));
  }, [open]);

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filteredCards = availableCards.filter((c) =>
    c.verifiedcardnumber.toLowerCase().includes(cardSearch.toLowerCase())
  );

  async function handleSubmit(e?: { preventDefault?: () => void }) {
    e?.preventDefault?.();
    if (!selectedCard)   { setError("Please select a card number"); return; }
    if (!selectedClinic) { setError("Please select a destination clinic"); return; }
    setSubmitting(true);
    setError("");
    try {
      await apiFetch("/api/enrollment/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_number: selectedCard, release_to: selectedClinic }),
      });
      onRegistered();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Register Card</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Enroll a verified card to a clinic</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Card Number Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
              Verified Card Number <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" value={cardSearch} onChange={(e) => setCardSearch(e.target.value)}
                placeholder="Search verified card numbers..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400" />
            </div>
            <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700">
              {loadingCards ? (
                <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-400 dark:text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </div>
              ) : filteredCards.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500">
                  {availableCards.length === 0 ? "No verified cards available for enrollment" : "No matches"}
                </p>
              ) : filteredCards.slice(0, 100).map((c) => (
                <button key={c.id} type="button" onClick={() => setSelectedCard(c.verifiedcardnumber)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-mono border-b border-slate-100 last:border-0 transition-colors dark:border-slate-600 ${
                    selectedCard === c.verifiedcardnumber
                      ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/30 dark:text-blue-400"
                      : "hover:bg-white text-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  }`}>
                  {c.verifiedcardnumber}
                  {(c.year || c.batch) && (
                    <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
                      {[c.year, c.batch && `Batch ${c.batch}`, c.month && `Month ${c.month}`].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {selectedCard && (
              <p className="mt-1.5 text-xs text-emerald-600 font-medium dark:text-emerald-400">
                Selected: {selectedCard}
              </p>
            )}
          </div>

          {/* Destination Clinic */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
              Release To (Destination Clinic) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedClinic}
                onChange={(e) => setSelectedClinic(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">Select clinic...</option>
                {clinics.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <X className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-700">
          <button type="button" onClick={onClose} disabled={submitting}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting || !selectedCard || !selectedClinic}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Register Card
          </button>
        </div>
      </div>
    </div>
  );
}
