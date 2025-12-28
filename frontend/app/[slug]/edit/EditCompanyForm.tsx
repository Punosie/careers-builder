// app/[slug]/edit/EditCompanyForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Theme {
  primary_color?: string;
  secondary_color?: string;
  bg_color?: string;
  text_color?: string;
}

interface Company {
  id: string;
  slug: string | null;
  name: string | null;
  user: string;
  logo: string | null;
  created_at: string | null;
  updated_at: string | null;
  theme: Theme | null;
}

export default function EditCompanyForm({ company }: { company: Company }) {
  const [name, setName] = useState(company.name ?? "");
  const [slug, setSlug] = useState(company.slug ?? "");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      const res = await fetch(`/api/company/${company.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update company");

      alert("Company updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update company");
    } finally {
      setUpdating(false);
    }
  };

  if (!company) return <p className="text-slate-400">No company found.</p>;

  const inputClass = cn(
    "h-12 rounded-xl border-slate-700/70 bg-slate-900/70 text-sm text-slate-50",
    "placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">Basic Info</h1>
        <p className="text-sm text-slate-400">
          Update your company name and slug
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-900/20 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Company Name
          </Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Slug
          </Label>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={updating}
          className="w-full rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-sky-700/40 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed"
        >
          {updating ? "Updating..." : "Update Company"}
        </Button>
      </form>
    </div>
  );
}
