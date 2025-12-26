import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import generateCompanySlug from "@/app/utils/slugGenerator";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();
  const { email, password, companyName } = body;

  if (!email || !password || !companyName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${new URL(req.url).origin}/auth/callback`,
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || "Failed to sign up" },
      { status: 400 }
    );
  }

  const slug = generateCompanySlug(companyName);

  const { data: company, error: companyError } = await supabase
    .from("company")
    .insert({
      name: companyName,
      slug,
      user: data.user.id,
    })
    .select()
    .single();

  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 400 });
  }

  return NextResponse.json({ companySlug: company.slug });
}
