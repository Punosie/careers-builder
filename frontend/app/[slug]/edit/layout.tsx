// app/[slug]/edit/layout.tsx
import type { ReactNode } from "react";

export default function EditSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8_0,transparent_50%),radial-gradient(circle_at_bottom,#0ea5e9_0,transparent_55%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />
      <div className="relative z-10 w-full max-w-7xl px-4 py-10 sm:px-6">
        {children}
      </div>
    </div>
  );
}
