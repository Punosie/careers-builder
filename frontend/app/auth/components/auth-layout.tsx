// app/(auth)/components/auth-layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-slate-950 text-slate-50">
      {/* background gradient + noise */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8_0,transparent_50%),radial-gradient(circle_at_bottom,#0ea5e9_0,transparent_55%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />

      {/* gradient or logo in corner */}
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-sky-400 to-blue-600 text-lg font-semibold shadow-lg shadow-sky-500/40">
          F
        </div>
        <div className="hidden flex-col text-sm font-medium text-slate-100/90 sm:flex">
          <span>FlowHire</span>
          <span className="text-xs text-slate-300/80">Developer Console</span>  
        </div>
      </div>

      {/* right-bottom CTA */}
      <div className="pointer-events-none absolute bottom-6 right-6 hidden max-w-xs text-right text-xs text-slate-200/70 md:block">
        <p className="font-medium text-slate-50/80">{title}</p>
        {subtitle && <p className="mt-1 text-slate-300/70">{subtitle}</p>}
      </div>

      {/* main card */}
      <div className="relative z-10 w-full max-w-md px-4 py-10 sm:px-0">
        <div className="group rounded-3xl border border-slate-200/10 bg-slate-900/40 px-6 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:px-8 sm:py-9">
          {/* card header */}
          <div className="mb-6 space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-slate-50">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-300/80">{subtitle}</p>
            )}
          </div>

          {children}

          {/* tiny divider */}
          <div className="mt-6 flex items-center gap-3 text-[11px] text-slate-400">
            <span className="h-px flex-1 bg-linear-to-r from-slate-700/0 via-slate-500/60 to-slate-700/0" />
            <span>Secure by FlowHire</span>
            <span className="h-px flex-1 bg-linear-to-l from-slate-700/0 via-slate-500/60 to-slate-700/0" />
          </div>
        </div>

        {/* footer links */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-300/70">
          <p>© {new Date().getFullYear()} FlowHire Labs</p>
          <div className="flex items-center gap-3">
            <Link
              href="/legal/privacy"
              className="hover:text-sky-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="hover:text-sky-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/support"
              className="hover:text-sky-400 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
