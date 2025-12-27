// app/api/company/[id]/branding/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // ← unwrap Promise

  const supabase = await createSupabaseServerClient();
  const formData = await req.formData();

  const slug = String(formData.get("slug") || "");
  const name = String(formData.get("name") || "");
  const short_description = String(formData.get("short_description") || "");
  const long_description = String(formData.get("long_description") || "");
  const life_at_company = String(formData.get("life_at_company") || "");
  const benefits = String(formData.get("benefits") || "");
  const themeRaw = formData.get("theme") as string | null;

  let theme: any = null;
  if (themeRaw) {
    try {
      theme = JSON.parse(themeRaw);
    } catch {
      return NextResponse.json(
        { error: "Invalid theme payload" },
        { status: 400 }
      );
    }
  }

  const logo = formData.get("logo") as File | null;
  const banner = formData.get("banner") as File | null;

  const { data: existing, error: existingError } = await supabase
    .from("company")
    .select("logo, banner")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let logoUrl = existing.logo as string | null;
  let bannerUrl = existing.banner as string | null;

  const uploadFile = async (
    file: File,
    folder: "logos" | "banners"
  ): Promise<string | null> => {
    const ext = file.name.split(".").pop() || "png";
    const path = `${folder}/${id}-${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("company-assets")
      .upload(path, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("company-assets").getPublicUrl(path);

    return publicUrl;
  };

  if (logo) {
    const url = await uploadFile(logo, "logos");
    if (!url) {
      return NextResponse.json(
        { error: "Failed to upload logo" },
        { status: 500 }
      );
    }
    logoUrl = url;
  }

  if (banner) {
    const url = await uploadFile(banner, "banners");
    if (!url) {
      return NextResponse.json(
        { error: "Failed to upload banner" },
        { status: 500 }
      );
    }
    bannerUrl = url;
  }

  const { error: updateError } = await supabase
    .from("company")
    .update({
      slug,
      name,
      short_description,
      long_description,
      life_at_company,
      benefits,
      theme,
      logo: logoUrl,
      banner: bannerUrl,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Branding update error:", updateError);
    return NextResponse.json(
      { error: "Failed to update company branding" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
