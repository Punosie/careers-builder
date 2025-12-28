// app/api/company/[id]/layout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type LayoutSectionId = "about" | "life" | "benefits" | "jobs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("pageLayout")
    .select("layout_order")
    .eq("company", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      {
        layout_order: [
          "about",
          "life",
          "benefits",
          "jobs",
        ] as LayoutSectionId[],
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ layout_order: data.layout_order });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const supabase = await createSupabaseServerClient();
  const body = await req.json();

  const layout_order = body.layout_order as LayoutSectionId[] | undefined;
  if (!layout_order || !Array.isArray(layout_order)) {
    return NextResponse.json(
      { error: "layout_order must be an array" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("pageLayout").upsert(
    {
      company: id,
      layout_order,
    },
    { onConflict: "company" }
  );

  if (error) {
    console.error("Layout update error:", error);
    return NextResponse.json(
      { error: "Failed to save layout" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
