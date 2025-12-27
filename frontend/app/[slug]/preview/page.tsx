// app/[slug]/preview/page.tsx
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Image from "next/image";
import JobsPreview from "./JobsPreview";
import { Skeleton } from "@/components/ui/skeleton";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { slug } = await params;

  const { data: company } = await supabase
    .from("company")
    .select(
      "id, slug, name, logo, banner, short_description, long_description, life_at_company, benefits, theme"
    )
    .eq("slug", slug)
    .single();

  if (!company) {
    return <div className="max-w-5xl mx-auto p-8">Company not found.</div>;
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select(
      "id, title, description, location, salary_range, job_slug, is_remote, department, employment_type, experience_level"
    )
    .eq("company", company.id);

  console.log("Preview jobs:", {
    companyId: company.id,
    count: jobs?.length,
    jobsError,
  });

  const theme = company.theme || {};
  const bg = theme.bg_color || "#ffffff";
  const text = theme.text_color || "#111827";
  const primary = theme.primary_color || "#2563eb";

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, color: text }}>
      <header className="max-w-5xl mx-auto py-10 px-4 flex gap-6 items-center">
        {company.logo ? (
          <Image
            src={company.logo}
            alt={company.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <Skeleton className="w-16 h-16 rounded-lg" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          {company.short_description ? (
            <p className="mt-2 text-sm opacity-80">
              {company.short_description}
            </p>
          ) : (
            <Skeleton className="mt-2 h-4 w-64" />
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        {company.banner ? (
          <Image
            src={company.banner}
            alt="Banner"
            width={1200}
            height={400}
            className="w-full rounded-xl object-cover"
          />
        ) : (
          <Skeleton className="w-full h-56 rounded-xl" />
        )}
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {company.long_description ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">About {company.name}</h2>
            <p className="text-sm leading-relaxed opacity-90">
              {company.long_description}
            </p>
          </section>
        ) : (
          <section className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </section>
        )}

        {company.life_at_company ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Life at {company.name}</h2>
            <p className="text-sm leading-relaxed opacity-90">
              {company.life_at_company}
            </p>
          </section>
        ) : null}

        {company.benefits ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Benefits</h2>
            <p className="text-sm leading-relaxed opacity-90">
              {company.benefits}
            </p>
          </section>
        ) : null}

        <JobsPreview
          jobs={jobs || []}
          primaryColor={primary}
          textColor={text}
        />
      </main>
    </div>
  );
}
