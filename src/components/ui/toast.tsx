"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

let _nextId = 1;

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = _nextId++;
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  return { toasts, toast, dismiss };
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

const STYLES: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg:     "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-emerald-200 dark:border-emerald-800",
    icon:   "text-emerald-600 dark:text-emerald-400",
    text:   "text-emerald-800 dark:text-emerald-200",
  },
  error: {
    bg:     "bg-red-50 dark:bg-red-900/30",
    border: "border-red-200 dark:border-red-800",
    icon:   "text-red-600 dark:text-red-400",
    text:   "text-red-800 dark:text-red-200",
  },
  warning: {
    bg:     "bg-amber-50 dark:bg-amber-900/30",
    border: "border-amber-200 dark:border-amber-800",
    icon:   "text-amber-600 dark:text-amber-400",
    text:   "text-amber-800 dark:text-amber-200",
  },
  info: {
    bg:     "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-800",
    icon:   "text-blue-600 dark:text-blue-400",
    text:   "text-blue-800 dark:text-blue-200",
  },
};

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 shrink-0" />,
  error:   <XCircle    className="h-4 w-4 shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
  info:    <Info       className="h-4 w-4 shrink-0" />,
};

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const s = STYLES[item.type];
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Fade in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  function handleDismiss() {
    setVisible(false);
    timerRef.current = setTimeout(() => onDismiss(item.id), 200);
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div
      role="alert"
      className={`flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-200
        ${s.bg} ${s.border}
        ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      <span className={s.icon}>{ICONS[item.type]}</span>
      <p className={`flex-1 text-sm font-medium ${s.text}`}>{item.message}</p>
      <button
        onClick={handleDismiss}
        className={`rounded p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${s.icon}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

export function ToastContainer({
  toasts,
  dismiss,
}: {
  toasts: ToastItem[];
  dismiss: (id: number) => void;
}) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast item={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
