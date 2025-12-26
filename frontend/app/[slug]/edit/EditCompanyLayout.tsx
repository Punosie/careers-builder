"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import BrandingTab from "./tabs/BrandingTab";
import JobsTab from "./tabs/JobsTab";

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

type TabId = "branding" | "jobs";

// EditCompanyLayout.tsx
export default function EditCompanyLayout({ company }: { company: Company }) {
  const [activeTab, setActiveTab] = useState<TabId>("branding");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-6xl mx-auto">
        <Sidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          slug={company.slug!} // assumes slug is not null
        />
        <main className="flex-1 p-8">
          {activeTab === "branding" && <BrandingTab company={company} />}
          {activeTab === "jobs" && <JobsTab companyId={company.id} />}
        </main>
      </div>
    </div>
  );
}
