// app/[slug]/edit/Sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Palette,
  Eye,
  Globe2,
  LogOut,
  LayoutTemplate,
} from "lucide-react";
import Link from "next/link";

type TabId = "branding" | "jobs" | "layout";

export default function Sidebar({
  activeTab,
  onChangeTab,
  slug,
}: {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  slug: string;
}) {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/auth/login";
    } catch {
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="flex h-full flex-col px-4 py-6">
      <div>
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Company settings
        </h2>
        <div className="space-y-2">
          <Button
            variant={activeTab === "branding" ? "secondary" : "ghost"}
            className={`w-full justify-start gap-2 rounded-xl border border-transparent px-3 py-2 text-sm ${
              activeTab === "branding"
                ? "bg-slate-800/80 text-sky-300 shadow-sm shadow-sky-900/40 hover:bg-sky-900/40"
                : "text-slate-300 hover:bg-slate-900/70 hover:text-slate-50"
            }`}
            onClick={() => onChangeTab("branding")}
          >
            <Palette className="h-4 w-4" />
            Branding
          </Button>

          <Button
            variant={activeTab === "jobs" ? "secondary" : "ghost"}
            className={`w-full justify-start gap-2 rounded-xl border border-transparent px-3 py-2 text-sm ${
              activeTab === "jobs"
                ? "bg-slate-800/80 text-sky-300 shadow-sm shadow-sky-900/40 hover:bg-sky-900/40"
                : "text-slate-300 hover:bg-slate-900/70 hover:text-slate-50"
            }`}
            onClick={() => onChangeTab("jobs")}
          >
            <Briefcase className="h-4 w-4" />
            Jobs
          </Button>

          <Button
            variant={activeTab === "layout" ? "secondary" : "ghost"}
            className={`w-full justify-start gap-2 rounded-xl border border-transparent px-3 py-2 text-sm ${
              activeTab === "layout"
                ? "bg-slate-800/80 text-sky-300 shadow-sm shadow-sky-900/40 hover:bg-sky-900/40"
                : "text-slate-300 hover:bg-slate-900/70 hover:text-slate-50"
            }`}
            onClick={() => onChangeTab("layout")}
          >
            <LayoutTemplate className="h-4 w-4" />
            Layout
          </Button>
        </div>
      </div>

      <div className="mt-auto space-y-2 border-t border-slate-800/60 pt-6">
        <Link href={`/${slug}/preview`} target="_blank">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2 rounded-xl border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 hover:border-sky-500/80 hover:text-slate-50 hover:bg-sky-900/90"
          >
            <Eye className="h-4 w-4 text-slate-300" />
            <span>Preview</span>
          </Button>
        </Link>

        <Link href={`/${slug}/careers`} target="_blank">
          <Button
            type="button"
            variant="outline"
            className="mt-1 w-full justify-start gap-2 rounded-xl border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 hover:border-emerald-500/80 hover:text-slate-50 hover:bg-emerald-900/90"
          >
            <Globe2 className="h-4 w-4 text-slate-300" />
            <span>Live Page</span>
          </Button>
        </Link>

        <Button
          type="button"
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-2 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
