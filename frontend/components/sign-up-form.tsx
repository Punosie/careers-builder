"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

export interface Company {
  id: string;
  slug: string | null;
  name: string | null;
  user: string; // owner id
  logo: string | null;
  created_at: string | null;
  updated_at: string | null;
  theme: Record<string, any> | null; // JSONB field
}

export default function EditPage() {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    async function fetchUserAndCompany() {
      try {
        setLoading(true);
        setError(null);

        // 1. Get logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("No user logged in");
        setUser(user);

        // 2. Fetch company
        const { data: companyData, error } = await supabase
          .from("company")
          .select("*")
          .eq("user", user.id)
          .single();

        if (error) throw error;
        setCompany(companyData ?? null);

        // 3. Set form values
        if (companyData) {
          setName(companyData.name ?? "");
          setSlug(companyData.slug ?? "");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndCompany();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    try {
      setUpdating(true);
      setError(null);

      const { data, error } = await supabase
        .from("company")
        .update({
          name,
          slug,
        })
        .eq("id", company.id)
        .select()
        .single();

      if (error) throw error;

      setCompany(data);
      alert("Company updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update company");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to see this page.</p>;
  if (!company) return <p>No company found for this user.</p>;

  return (
    <div>
      <h1>Edit Company</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2"
          />
        </div>

        <div>
          <label>Slug:</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border p-2"
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {updating ? "Updating..." : "Update Company"}
        </button>
      </form>
    </div>
  );
}
