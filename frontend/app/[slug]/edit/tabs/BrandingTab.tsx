"use client";

import { useState } from "react";
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

  const processSquareImage = async (file: File) => {
    return new Promise<File>((resolve, reject) => {
      // Always use the browser Image constructor
      const img = new window.Image(); // type: HTMLImageElement

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
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <h1 className="text-2xl font-semibold mb-1">Branding</h1>
        <p className="text-sm text-gray-500">
          Configure how your company appears on the careers page.
        </p>
      </div>

      {/* Company section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Company</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slug">
              Slug<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">
              Name<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <Label htmlFor="logo">
              Logo<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              required={!company.logo}
              onChange={handleLogoChange}
            />
            {logoPreviewName && (
              <p className="text-xs text-gray-600 mt-1">{logoPreviewName}</p>
            )}
            {!logoPreviewName && (
              <p className="text-xs text-gray-500 mt-1">
                Image will be cropped to a square (250–500px).
              </p>
            )}
            {company.logo && !logoPreviewName && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Current logo</p>
                <Image
                  src={company.logo}
                  alt={company.name || "Logo"}
                  width={80}
                  height={80}
                  className="rounded-md object-cover border border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">
              Banner<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              required={!company.banner}
              onChange={handleBannerChange}
            />
            {bannerPreviewName && (
              <p className="text-xs text-gray-600 mt-1">{bannerPreviewName}</p>
            )}
            {!bannerPreviewName && (
              <p className="text-xs text-gray-500 mt-1">
                Wide image works best for the banner.
              </p>
            )}
            {company.banner && !bannerPreviewName && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Current banner</p>
                <Image
                  src={company.banner}
                  alt="Banner"
                  width={240}
                  height={80}
                  className="rounded-md object-cover border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="short_description">Short Description</Label>
          <Textarea
            id="short_description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="long_description">
            Long Description<span className="text-red-500 ml-0.5">*</span>
          </Label>
          <Textarea
            id="long_description"
            required
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="life_at_company">
            Life At Company<span className="text-red-500 ml-0.5">*</span>
          </Label>
          <Textarea
            id="life_at_company"
            required
            value={lifeAtCompany}
            onChange={(e) => setLifeAtCompany(e.target.value)}
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="benefits">
            Benefits<span className="text-red-500 ml-0.5">*</span>
          </Label>
          <Textarea
            id="benefits"
            required
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            rows={4}
          />
        </div>
      </section>

      {/* Theme section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="primary_color">
              Primary Color<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="primary_color"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="secondary_color">
              Secondary Color<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="secondary_color"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="bg_color">
              Background Color<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="bg_color"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="text_color">
              Text Color<span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              id="text_color"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-600">Branding saved successfully.</p>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
