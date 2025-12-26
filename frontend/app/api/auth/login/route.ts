// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { email, password } = await req.json();

  console.log("🔐 Login attempt for:", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.error("Auth failed:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Invalid credentials" },
      { status: 400 }
    );
  }

  console.log("User authenticated:", {
    id: data.user.id,
    email: data.user.email,
    userMetadata: data.user.user_metadata,
  });

  const { data: company, error: companyError } = await supabase
    .from("company")
    .select("slug, name, id")
    .eq("user", data.user.id)
    .single();

  if (companyError || !company) {
    console.error("No company found for user:", data.user.id, companyError);
    return NextResponse.json(
      { error: "Company not found for user" },
      { status: 400 }
    );
  }

  console.log("🏢 Company found:", company);

  return NextResponse.json({
    companySlug: company.slug,
    companyData: company,
  });
}
