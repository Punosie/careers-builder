// app/(edit)/layout.tsx
import type { ReactNode } from "react";

export default function EditLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-50">
      {/* background gradient + noise */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8_0,transparent_50%),radial-gradient(circle_at_bottom,#0ea5e9_0,transparent_55%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
