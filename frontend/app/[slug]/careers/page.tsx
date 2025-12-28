// app/[slug]/careers/page.tsx
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Image from "next/image";
import JobsPreview from "../preview/JobsPreview";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

type LayoutSectionId = "about" | "life" | "benefits" | "jobs";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { slug } = await params;

  // Company + theme
  const { data: company } = await supabase
    .from("company")
    .select(
      "id, slug, name, logo, banner, short_description, long_description, life_at_company, benefits, theme"
    )
    .eq("slug", slug)
    .single();

  if (!company) {
    return (
      <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-slate-950 text-slate-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8_0,transparent_50%),radial-gradient(circle_at_bottom,#0ea5e9_0,transparent_55%)] opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />
        <div className="relative z-10 rounded-2xl border border-slate-200/10 bg-slate-900/60 px-6 py-4 text-sm shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          Company not found.
        </div>
      </div>
    );
  }

  // Jobs
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select(
      "id, title, description, location, salary_range, job_slug, is_remote, department, employment_type, experience_level"
    )
    .eq("company", company.id);

  if (jobsError) {
    console.error("Careers jobs error:", jobsError);
  }

  // Layout order
  const { data: layoutRow } = await supabase
    .from("pageLayout")
    .select("layout_order")
    .eq("company", company.id)
    .single();

  const defaultOrder: LayoutSectionId[] = ["about", "life", "benefits", "jobs"];
  const layoutOrder: LayoutSectionId[] =
    (layoutRow?.layout_order as LayoutSectionId[] | null) ?? defaultOrder;

  const theme = company.theme || {};
  const bg = theme.bg_color || "#020617";
  const text = theme.text_color || "#e5e7eb";
  const primary = theme.primary_color || "#0ea5e9";
  const secondary = theme.secondary_color || "#1d4ed8";

  const cardBg = "rgba(0,0,0,0.55)";
  const cardBorder = "rgba(255,255,255,0.08)";

  const sections: Record<LayoutSectionId, ReactNode> = {
    about: company.long_description ? (
      <section
        key="about"
        className="space-y-2 rounded-2xl p-5 backdrop-blur-xl"
        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h2 className="text-xl font-semibold" style={{ color: primary }}>
          About {company.name}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: text }}>
          {company.long_description}
        </p>
      </section>
    ) : null,
    life: company.life_at_company ? (
      <section
        key="life"
        className="space-y-2 rounded-2xl p-5 backdrop-blur-xl"
        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h2 className="text-xl font-semibold" style={{ color: primary }}>
          Life at {company.name}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: text }}>
          {company.life_at_company}
        </p>
      </section>
    ) : null,
    benefits: company.benefits ? (
      <section
        key="benefits"
        className="space-y-2 rounded-2xl p-5 backdrop-blur-xl"
        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <h2 className="text-xl font-semibold" style={{ color: primary }}>
          Benefits
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: text }}>
          {company.benefits}
        </p>
      </section>
    ) : null,
    jobs: (
      <section
        key="jobs"
        className="rounded-2xl p-5 backdrop-blur-xl"
        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
      >
        <JobsPreview
          jobs={jobs || []}
          primaryColor={primary}
          secondaryColor={secondary}
          textColor={text}
          companyId={company.id}
        />
      </section>
    ),
  };

  return (
    <div className="relative flex min-h-svh w-full items-start justify-center overflow-hidden bg-slate-950">
      {/* gradient + noise based on bg + secondary (identical to preview) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(circle at top, ${bg} 0, transparent 55%),
            radial-gradient(circle at bottom, ${secondary} 0, transparent 55%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-25 mix-blend-soft-light" />

      {/* main content (no FlowHire logo for public careers page) */}
      <div className="relative z-10 w-full max-w-5xl px-4 pb-16 pt-20">
        <header className="mb-6 flex items-center gap-6">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-xl border bg-black/40 object-cover shadow-lg"
              style={{ borderColor: cardBorder }}
            />
          ) : (
            <Skeleton className="h-16 w-16 rounded-xl" />
          )}
          <div className="space-y-1">
            <h1
              className="text-3xl font-semibold tracking-tight"
              style={{ color: text }}
            >
              {company.name}
            </h1>
            {company.short_description ? (
              <p className="text-sm opacity-85" style={{ color: text }}>
                {company.short_description}
              </p>
            ) : (
              <Skeleton className="mt-1 h-4 w-64" />
            )}
          </div>
        </header>

        <div className="mb-8">
          {company.banner ? (
            <div
              className="overflow-hidden rounded-2xl shadow-xl"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
              }}
            >
              <Image
                src={company.banner}
                alt="Banner"
                width={1200}
                height={400}
                className="h-56 w-full object-cover md:h-72"
              />
            </div>
          ) : (
            <Skeleton className="h-56 w-full rounded-2xl md:h-72" />
          )}
        </div>

        <main className="space-y-8">
          {layoutOrder.map((id) => sections[id])}
        </main>
      </div>
    </div>
  );
}
