import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await req.formData();

  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const short_description = formData.get("short_description") as string;
  const long_description = formData.get("long_description") as string;
  const life_at_company = formData.get("life_at_company") as string;
  const benefits = formData.get("benefits") as string;
  const themeRaw = formData.get("theme") as string;
  const theme = themeRaw ? JSON.parse(themeRaw) : null;

  const logoFile = formData.get("logo") as File | null;
  const bannerFile = formData.get("banner") as File | null;

  // Verify ownership
  const { data: company, error: companyError } = await supabase
    .from("company")
    .select("id")
    .eq("id", id)
    .eq("user", user.id)
    .single();

  if (companyError || !company) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let logoUrl: string | undefined;
  let bannerUrl: string | undefined;

  // Optional: upload to Supabase Storage
  if (logoFile && logoFile.size > 0) {
    const buffer = Buffer.from(await logoFile.arrayBuffer());
    const path = `${user.id}/logo-${Date.now()}.png`;
    const { data, error } = await supabase.storage
      .from("company-assets")
      .upload(path, buffer, {
        contentType: logoFile.type || "image/png",
        upsert: true,
      });
    if (!error && data) {
      const { data: publicUrl } = supabase.storage
        .from("company-assets")
        .getPublicUrl(data.path);
      logoUrl = publicUrl.publicUrl;
    }
  }

  if (bannerFile && bannerFile.size > 0) {
    const buffer = Buffer.from(await bannerFile.arrayBuffer());
    const path = `${user.id}/banner-${Date.now()}.png`;
    const { data, error } = await supabase.storage
      .from("company-assets")
      .upload(path, buffer, {
        contentType: bannerFile.type || "image/png",
        upsert: true,
      });
    if (!error && data) {
      const { data: publicUrl } = supabase.storage
        .from("company-assets")
        .getPublicUrl(data.path);
      bannerUrl = publicUrl.publicUrl;
    }
  }

  const updatePayload: any = {
    slug,
    name,
    short_description,
    long_description,
    life_at_company,
    benefits,
    theme,
  };
  if (logoUrl) updatePayload.logo = logoUrl;
  if (bannerUrl) updatePayload.banner = bannerUrl;

  const { error: updateError } = await supabase
    .from("company")
    .update(updatePayload)
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
