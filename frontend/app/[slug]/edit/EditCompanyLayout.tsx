// app/[slug]/edit/EditCompanyLayout.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import BrandingTab from "./tabs/BrandingTab";
import JobsTab from "./tabs/JobsTab";
import LayoutOrderEditor from "./tabs/LayoutOrderEditor";
import EditLayout from "./layout";

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
  logo: string | null;
  banner: string | null;
  short_description: string | null;
  long_description: string | null;
  life_at_company: string | null;
  benefits: string | null;
  theme: Theme | null;
}

type LayoutSectionId = "about" | "life" | "benefits" | "jobs";
type TabId = "branding" | "jobs" | "layout";

export default function EditCompanyLayout({ company }: { company: Company }) {
  const [activeTab, setActiveTab] = useState<TabId>("branding");
  const [layoutOrder, setLayoutOrder] = useState<LayoutSectionId[] | null>(
    null
  );
  const [loadingLayout, setLoadingLayout] = useState(false);

  useEffect(() => {
    if (activeTab !== "layout" || layoutOrder) return;

    const fetchLayout = async () => {
      setLoadingLayout(true);
      try {
        const res = await fetch(`/api/company/${company.id}/layout`, {
          method: "GET",
        });
        if (!res.ok) {
          setLayoutOrder(["about", "life", "benefits", "jobs"]);
          return;
        }
        const json = await res.json();
        setLayoutOrder(
          (json.layout_order as LayoutSectionId[]) ?? [
            "about",
            "life",
            "benefits",
            "jobs",
          ]
        );
      } catch {
        setLayoutOrder(["about", "life", "benefits", "jobs"]);
      } finally {
        setLoadingLayout(false);
      }
    };

    fetchLayout();
  }, [activeTab, company.id, layoutOrder]);

  return (
    <EditLayout
      title="Branding & careers page"
      subtitle="Configure how your company appears on the FlowHire careers experience"
    >
      {/* full viewport height */}
      <div className="h-screen w-full">
        <div className="mx-auto flex h-full max-w-full px-4 sm:px-0">
          {/* glass shell, full height */}
          <div className="flex h-full w-full overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-950/70 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
            {/* sidebar */}
            <aside className="flex h-full w-64 shrink-0 border-r border-slate-800/60 bg-slate-950/80">
              <Sidebar
                activeTab={activeTab}
                onChangeTab={setActiveTab}
                slug={company.slug!}
              />
            </aside>

            {/* main content column */}
            <div className="flex h-full flex-1 flex-col bg-linear-to-b from-slate-950/40 to-slate-950/80 text-slate-50">
              {/* optional header for layout tab only */}
              {activeTab === "layout" && (
                <header className="flex-none border-b border-slate-800/60 px-8 py-6">
                  <h1 className="mb-1 text-2xl font-semibold">Page layout</h1>
                  <p className="text-sm text-slate-400">
                    Choose how sections appear on your public careers page.
                  </p>
                </header>
              )}

              {/* scrollable tab body */}
              <main className="flex-1 overflow-auto px-8 py-6">
                {activeTab === "branding" && <BrandingTab company={company} />}

                {activeTab === "jobs" && <JobsTab companyId={company.id} />}

                {activeTab === "layout" && (
                  <>
                    {loadingLayout || !layoutOrder ? (
                      <p className="text-sm text-slate-400">
                        Loading layout configuration...
                      </p>
                    ) : (
                      <LayoutOrderEditor
                        companyId={company.id}
                        initialOrder={layoutOrder}
                        onOrderChange={setLayoutOrder}
                      />
                    )}
                  </>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </EditLayout>
  );
}
