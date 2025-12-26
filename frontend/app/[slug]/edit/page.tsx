// app/[slug]/edit/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import EditCompanyForm from "./EditCompanyForm";

interface Company {
  id: string;
  slug: string | null;
  name: string | null;
  user: string;
  logo: string | null;
  created_at: string | null;
  updated_at: string | null;
  theme: Record<string, any> | null;
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Note: params is now a Promise
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  //AWAIT params before accessing slug
  const { slug } = await params;

  // Verify user owns this company AND slug matches URL
  const { data: company, error } = await supabase
    .from("company")
    .select("*")
    .eq("slug", slug) // Now works - slug is unwrapped
    .eq("user", user.id)
    .single();

  if (error || !company) {
    redirect("/403");
  }

  return <EditCompanyForm company={company} />;
}
