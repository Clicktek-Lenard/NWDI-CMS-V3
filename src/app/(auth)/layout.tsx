export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* Decorative shapes */}
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 left-1/4 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full border border-white/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">New World Diagnostics</span>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Central Management<br />System
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-blue-100/80">
              Unified healthcare platform managing patient queues, enrollment, payments, and clinical results across all facilities.
            </p>
            <div className="flex gap-6 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">17+</p>
                <p className="text-xs text-blue-200/70">Facilities</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">HL7</p>
                <p className="text-xs text-blue-200/70">Integrated</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-blue-200/70">Operations</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-blue-200/50">
            &copy; {new Date().getFullYear()} New World Diagnostics Inc.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
