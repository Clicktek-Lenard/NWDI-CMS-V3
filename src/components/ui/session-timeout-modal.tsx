"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { AlertTriangle, Clock, LogOut, RefreshCw } from "lucide-react";

const WARN_BEFORE_MS = 5 * 60 * 1000; // show modal 5 min before expiry
const TICK_MS        = 1_000;

export function SessionTimeoutModal() {
  const { data: session, update } = useSession();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [staying, setStaying]         = useState(false);
  const [stayError, setStayError]     = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!session?.expires) return;

    function tick() {
      if (!session?.expires) return;
      const msLeft = new Date(session.expires).getTime() - Date.now();
      if (msLeft <= 0) {
        setSecondsLeft(0);
      } else if (msLeft <= WARN_BEFORE_MS) {
        setSecondsLeft(Math.ceil(msLeft / 1000));
      } else {
        setSecondsLeft(null);
      }
    }

    tick();
    intervalRef.current = setInterval(tick, TICK_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session?.expires]);

  // Auto sign-out when time hits 0
  useEffect(() => {
    if (secondsLeft === 0) {
      signOut({ callbackUrl: "/login" });
    }
  }, [secondsLeft]);

  async function handleStayLoggedIn() {
    setStaying(true);
    setStayError(false);
    try {
      await update(); // triggers NextAuth session refresh (re-issues JWT)
      setSecondsLeft(null);
    } catch {
      setStayError(true);
    } finally {
      setStaying(false);
    }
  }

  if (secondsLeft === null) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeStr = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const urgent  = secondsLeft <= 60;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-slate-900 overflow-hidden">
        {/* Header bar */}
        <div className={`px-6 py-4 ${urgent ? "bg-red-500" : "bg-amber-500"}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-white shrink-0" />
            <h2 className="text-base font-semibold text-white">Session Expiring Soon</h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your session will expire in
          </p>

          {/* Countdown */}
          <div className={`flex items-center justify-center gap-2 rounded-xl border-2 py-4 ${urgent ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20" : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"}`}>
            <Clock className={`h-6 w-6 ${urgent ? "text-red-500" : "text-amber-500"}`} />
            <span className={`font-mono text-3xl font-bold tabular-nums ${urgent ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
              {timeStr}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click &ldquo;Stay Logged In&rdquo; to continue your session, or you will be
            automatically signed out.
          </p>

          {stayError && (
            <p className="text-xs text-red-600 dark:text-red-400">
              Failed to refresh session. Please try again.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
          <button
            onClick={handleStayLoggedIn}
            disabled={staying}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {staying
              ? <RefreshCw className="h-4 w-4 animate-spin" />
              : <RefreshCw className="h-4 w-4" />}
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
