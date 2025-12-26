// app/[slug]/edit/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import EditCompanyLayout from "./EditCompanyLayout";

interface Company {
  id: string;
  slug: string | null;
  name: string | null;
  logo: string | null;
  banner: string | null;
  short_description: string | null;
  long_description: string | null;
  life_at_company: string | null;
  benefits: string | null;
  theme: {
    primary_color?: string;
    secondary_color?: string;
    bg_color?: string;
    text_color?: string;
  } | null;
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { slug } = await params;

  const { data: company, error } = await supabase
    .from("company")
    .select(
      "id, slug, name, logo, banner, short_description, long_description, life_at_company, theme, benefits"
    )
    .eq("slug", slug) // ✅ no user filter, middleware already enforced ownership
    .single();

  if (error || !company) {
    // Slug doesn't exist at all → 404 (or keep 403 if you prefer)
    redirect("/404");
    // or: redirect("/403");
  }

  return <EditCompanyLayout company={company as Company} />;
}
