// app/api/company/[id]/theme/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // unwrap Promise

  const supabase = await createSupabaseServerClient();
  const body = await req.json();

  const { theme } = body as {
    theme: {
      primary_color?: string;
      secondary_color?: string;
      bg_color?: string;
      text_color?: string;
    };
  };

  const { error } = await supabase
    .from("company")
    .update({ theme })
    .eq("id", id);

  if (error) {
    console.error("Update theme error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
