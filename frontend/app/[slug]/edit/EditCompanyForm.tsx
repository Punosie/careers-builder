// app/[slug]/edit/EditCompanyForm.tsx
"use client";

import { useState } from "react";

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

  if (!company) return <p>No company found.</p>;

  return (
    <div>
      <h1>Edit Company</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Slug:</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Company"}
        </button>
      </form>
    </div>
  );
}
