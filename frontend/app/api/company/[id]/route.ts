// app/api/company/[id]/route.ts  ← CORRECT PATH
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Next.js 16+ async params
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, slug } = body;

    // Verify ownership
    const { data: company, error: fetchError } = await supabase
      .from("company")
      .select("id")
      .eq("id", id)
      .eq("user", user.id)
      .single();

    if (fetchError || !company) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: updated, error } = await supabase
      .from("company")
      .update({ name, slug })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/company/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
