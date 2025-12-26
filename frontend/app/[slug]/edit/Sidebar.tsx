// Sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Briefcase, Palette, Eye, LogOut } from "lucide-react";
import Link from "next/link";

type TabId = "branding" | "jobs";

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
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen flex flex-col py-6 px-4">
      <div>
        <h2 className="text-lg font-semibold mb-6">Company Settings</h2>
        <div className="space-y-2">
          <Button
            variant={activeTab === "branding" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => onChangeTab("branding")}
          >
            <Palette className="w-4 h-4" />
            Branding
          </Button>
          <Button
            variant={activeTab === "jobs" ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => onChangeTab("jobs")}
          >
            <Briefcase className="w-4 h-4" />
            Jobs
          </Button>
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-6 border-t border-gray-200">
        <Link href={`/${slug}/preview`} target="_blank">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            type="button"
          >
            <Eye className="w-4 h-4" />
            Preview page
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          type="button"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
