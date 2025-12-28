// app/[slug]/edit/tabs/BrandingTab.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

// Quick preset themes
const THEME_PRESETS = [
  {
    id: "deep-ocean",
    label: "Deep Ocean",
    primary: "#0ea5e9",
    secondary: "#1d4ed8",
    bg: "#020617",
    text: "#e5e7eb",
  },
  {
    id: "sunset",
    label: "Sunset Glow",
    primary: "#fb923c",
    secondary: "#f97316",
    bg: "#111827",
    text: "#f9fafb",
  },
  {
    id: "emerald",
    label: "Emerald",
    primary: "#10b981",
    secondary: "#065f46",
    bg: "#022c22",
    text: "#ecfdf5",
  },
  {
    id: "violet",
    label: "Violet Noir",
    primary: "#a855f7",
    secondary: "#6d28d9",
    bg: "#020617",
    text: "#f5f3ff",
  },
  {
    id: "light",
    label: "Light Minimal",
    primary: "#2563eb",
    secondary: "#0f172a",
    bg: "#f9fafb",
    text: "#020617",
  },
];

// shallow compare helper for plain objects [web:114]
function shallowEqual(a: Record<string, any>, b: Record<string, any>) {
  const keys1 = Object.keys(a);
  const keys2 = Object.keys(b);
  if (keys1.length !== keys2.length) return false;
  for (const k of keys1) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

export default function BrandingTab({ company }: { company: Company }) {
  const [slug, setSlug] = useState(company.slug ?? "");
  const [name, setName] = useState(company.name ?? "");
  const [shortDescription, setShortDescription] = useState(
    company.short_description ?? ""
  );
  const [longDescription, setLongDescription] = useState(
    company.long_description ?? ""
  );
  const [lifeAtCompany, setLifeAtCompany] = useState(
    company.life_at_company ?? ""
  );
  const [benefits, setBenefits] = useState(company.benefits ?? "");
  const [primaryColor, setPrimaryColor] = useState(
    company.theme?.primary_color ?? "#111827"
  );
  const [secondaryColor, setSecondaryColor] = useState(
    company.theme?.secondary_color ?? "#2563eb"
  );
  const [bgColor, setBgColor] = useState(company.theme?.bg_color ?? "#ffffff");
  const [textColor, setTextColor] = useState(
    company.theme?.text_color ?? "#111827"
  );

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreviewName, setLogoPreviewName] = useState<string | null>(null);
  const [bannerPreviewName, setBannerPreviewName] = useState<string | null>(
    null
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inputClass =
    "h-10 rounded-xl border-slate-700/70 bg-slate-900/40 text-sm text-slate-50 " +
    "placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  const textareaClass =
    "rounded-xl border-slate-700/70 bg-slate-900/40 text-sm text-slate-50 " +
    "placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  // Snapshot of initial values for dirty check
  const initialState = useMemo(
    () => ({
      slug: company.slug ?? "",
      name: company.name ?? "",
      shortDescription: company.short_description ?? "",
      longDescription: company.long_description ?? "",
      lifeAtCompany: company.life_at_company ?? "",
      benefits: company.benefits ?? "",
      primaryColor: company.theme?.primary_color ?? "#111827",
      secondaryColor: company.theme?.secondary_color ?? "#2563eb",
      bgColor: company.theme?.bg_color ?? "#ffffff",
      textColor: company.theme?.text_color ?? "#111827",
    }),
    [company]
  );

  const currentState = {
    slug,
    name,
    shortDescription,
    longDescription,
    lifeAtCompany,
    benefits,
    primaryColor,
    secondaryColor,
    bgColor,
    textColor,
  };

  const isDirty = !shallowEqual(initialState, currentState);

  // Auto-hide success/error after 3s [web:109][web:112]
  useEffect(() => {
    if (!success && !error) return;
    const timeout = setTimeout(() => {
      setSuccess(false);
      setError(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [success, error]);

  // Apply preset theme
  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setBgColor(preset.bg);
    setTextColor(preset.text);
  };

  const processSquareImage = async (file: File) => {
    return new Promise<File>((resolve, reject) => {
      const img = new window.Image();

      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const startX = (img.width - side) / 2;
        const startY = (img.height - side) / 2;

        const targetSide = Math.max(250, Math.min(500, side));

        const canvas = document.createElement("canvas");
        canvas.width = targetSide;
        canvas.height = targetSide;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        ctx.drawImage(
          img,
          startX,
          startY,
          side,
          side,
          0,
          0,
          targetSide,
          targetSide
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create image blob"));
              return;
            }
            const squaredFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            });
            resolve(squaredFile);
          },
          "image/jpeg",
          0.9
        );
      };

      img.onerror = (e) => reject(e);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogoFile(null);
      setLogoPreviewName(null);
      return;
    }
    try {
      const processed = await processSquareImage(file);
      setLogoFile(processed);
      setLogoPreviewName(
        `${processed.name} (${Math.round(processed.size / 1024)} KB)`
      );
    } catch (err) {
      console.error(err);
      setError("Failed to process logo image");
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);
    setBannerPreviewName(
      file ? `${file.name} (${Math.round(file.size / 1024)} KB)` : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("name", name);
    formData.append("short_description", shortDescription);
    formData.append("long_description", longDescription);
    formData.append("life_at_company", lifeAtCompany);
    formData.append("benefits", benefits);
    formData.append(
      "theme",
      JSON.stringify({
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        bg_color: bgColor,
        text_color: textColor,
      })
    );
    if (logoFile) formData.append("logo", logoFile);
    if (bannerFile) formData.append("banner", bannerFile);

    try {
      const res = await fetch(`/api/company/${company.id}/branding`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save branding");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to save branding");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="space-y-8 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 text-slate-50 shadow-xl shadow-slate-950/50 backdrop-blur-2xl"
      onSubmit={handleSubmit}
    >
      <div>
        <h1 className="mb-1 text-2xl font-semibold">Branding</h1>
        <p className="text-sm text-slate-400">
          Configure how your company appears on the careers page.
        </p>
      </div>

      {/* Company section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Company</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Logo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              required={!company.logo}
              onChange={handleLogoChange}
              className={
                inputClass +
                " file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 " +
                "file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 " +
                "file:hover:bg-slate-700"
              }
            />
            {logoPreviewName && (
              <p className="mt-1 text-xs text-slate-300">{logoPreviewName}</p>
            )}
            {!logoPreviewName && (
              <p className="mt-1 text-xs text-slate-400">
                Image will be cropped to a square (250–500px).
              </p>
            )}
            {company.logo && !logoPreviewName && (
              <div className="mt-2">
                <p className="mb-1 text-xs text-slate-400">Current logo</p>
                <Image
                  src={company.logo}
                  alt={company.name || "Logo"}
                  width={80}
                  height={80}
                  className="rounded-md border border-slate-700/80 object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Banner <span className="text-red-500">*</span>
            </Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              required={!company.banner}
              onChange={handleBannerChange}
              className={
                inputClass +
                " file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 " +
                "file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 " +
                "file:hover:bg-slate-700"
              }
            />
            {bannerPreviewName && (
              <p className="mt-1 text-xs text-slate-300">{bannerPreviewName}</p>
            )}
            {!bannerPreviewName && (
              <p className="mt-1 text-xs text-slate-400">
                Wide image works best for the banner.
              </p>
            )}
            {company.banner && !bannerPreviewName && (
              <div className="mt-2">
                <p className="mb-1 text-xs text-slate-400">Current banner</p>
                <Image
                  src={company.banner}
                  alt="Banner"
                  width={240}
                  height={80}
                  className="rounded-md border border-slate-700/80 object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Short Description
          </Label>
          <Textarea
            id="short_description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={2}
            className={textareaClass}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Long Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="long_description"
            required
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            rows={4}
            className={textareaClass}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Life At Company <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="life_at_company"
            required
            value={lifeAtCompany}
            onChange={(e) => setLifeAtCompany(e.target.value)}
            rows={4}
            className={textareaClass}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Benefits <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="benefits"
            required
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            rows={4}
            className={textareaClass}
          />
        </div>
      </section>

      {/* Theme section with presets */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Theme</h2>
          <div className="flex flex-wrap gap-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/60 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:border-sky-500/80 hover:bg-slate-900"
              >
                <span
                  className="h-4 w-4 rounded-full border border-slate-700/80"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                  }}
                />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Primary Color <span className="text-red-500">*</span>
            </Label>
            <Input
              id="primary_color"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              required
              className={inputClass + " cursor-pointer"}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Secondary Color <span className="text-red-500">*</span>
            </Label>
            <Input
              id="secondary_color"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              required
              className={inputClass + " cursor-pointer"}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Background Color <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bg_color"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              required
              className={inputClass + " cursor-pointer"}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
              Text Color <span className="text-red-500">*</span>
            </Label>
            <Input
              id="text_color"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              required
              className={inputClass + " cursor-pointer"}
            />
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-400">Branding saved successfully.</p>
      )}

      <Button
        type="submit"
        disabled={saving || !isDirty}
        className="rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-sm font-semibold shadow-lg shadow-sky-900/50 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : isDirty ? "Save changes" : "No changes"}
      </Button>
    </form>
  );
}
