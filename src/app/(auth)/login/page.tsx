"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const FACILITIES = [
  { code: "CEN", name: "Central", city: "Manila" },
  { code: "SMB", name: "San Miguel", city: "Bulacan" },
  { code: "SRL", name: "SRL", city: "Pampanga" },
  { code: "TAR", name: "Tarlac", city: "Tarlac" },
  { code: "LIN", name: "Lingayen", city: "Pangasinan" },
  { code: "PAR", name: "Paranaque", city: "Metro Manila" },
  { code: "DTU", name: "DTU", city: "Manila" },
  { code: "BAY", name: "Bayombong", city: "Nueva Vizcaya" },
  { code: "BAE", name: "Baguio", city: "Benguet" },
  { code: "DAG", name: "Dagupan", city: "Pangasinan" },
  { code: "MIR", name: "Mira-Nila", city: "Quezon City" },
  { code: "ORT", name: "Ortho", city: "Manila" },
];

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const result = await signIn("credentials", {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        clinicCode: formData.get("clinicCode") as string,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password. Please try again.");
      } else if (result?.ok) {
        router.push("/queue");
        router.refresh();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* Mobile logo (hidden on desktop since the left panel shows it) */}
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-slate-800">NWD CMS</span>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Sign in to your account to continue
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div className="group">
          <label
            htmlFor="username"
            className={`mb-1.5 block text-sm font-medium transition-colors ${
              focusedField === "username" ? "text-blue-600" : "text-slate-700"
            }`}
          >
            Username
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg
                className={`h-[18px] w-[18px] transition-colors ${
                  focusedField === "username" ? "text-blue-500" : "text-slate-400"
                }`}
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              placeholder="Enter your username"
            />
          </div>
        </div>

        {/* Password */}
        <div className="group">
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className={`text-sm font-medium transition-colors ${
                focusedField === "password" ? "text-blue-600" : "text-slate-700"
              }`}
            >
              Password
            </label>
            <button
              type="button"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg
                className={`h-[18px] w-[18px] transition-colors ${
                  focusedField === "password" ? "text-blue-500" : "text-slate-400"
                }`}
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Facility */}
        <div className="group">
          <label
            htmlFor="clinicCode"
            className={`mb-1.5 block text-sm font-medium transition-colors ${
              focusedField === "clinic" ? "text-blue-600" : "text-slate-700"
            }`}
          >
            Facility / Branch
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg
                className={`h-[18px] w-[18px] transition-colors ${
                  focusedField === "clinic" ? "text-blue-500" : "text-slate-400"
                }`}
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            </div>
            <select
              id="clinicCode"
              name="clinicCode"
              onFocus={() => setFocusedField("clinic")}
              onBlur={() => setFocusedField(null)}
              className="block w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 shadow-sm transition-all hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            >
              {FACILITIES.map((f) => (
                <option key={f.code} value={f.code}>
                  {f.name} — {f.city}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-700/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-50 px-3 text-slate-400">Secured by Active Directory</span>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400">
        Having trouble signing in?{" "}
        <button type="button" className="font-medium text-blue-600 hover:text-blue-700">
          Contact IT Support
        </button>
      </p>
    </div>
  );
}
