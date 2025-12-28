"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type LayoutSectionId = "about" | "life" | "benefits" | "jobs";

const ALL_SECTIONS: { id: LayoutSectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "life", label: "Life at company" },
  { id: "benefits", label: "Benefits" },
  { id: "jobs", label: "Jobs" },
];

export default function LayoutOrderEditor({
  companyId,
  initialOrder,
  onOrderChange,
}: {
  companyId: string;
  initialOrder: LayoutSectionId[];
  onOrderChange?: (order: LayoutSectionId[]) => void;
}) {
  const [order, setOrder] = useState<LayoutSectionId[]>(initialOrder);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const move = (index: number, delta: number) => {
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= order.length) return;
    const copy = [...order];
    const [item] = copy.splice(index, 1);
    copy.splice(newIndex, 0, item);
    setOrder(copy);
    onOrderChange?.(copy);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/company/${companyId}/layout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout_order: order }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save layout");
      setStatus("Layout saved");
    } catch (err: any) {
      setStatus(err.message || "Failed to save layout");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 text-slate-50 shadow-xl shadow-slate-950/50 backdrop-blur-2xl">
      <p className="text-sm text-slate-400">
        Arrange the sections as they should appear on the preview and careers
        page.
      </p>
      <ul className="space-y-2">
        {order.map((id, index) => {
          const meta = ALL_SECTIONS.find((s) => s.id === id);
          if (!meta) return null;
          return (
            <li
              key={id}
              className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm"
            >
              <span>{meta.label}</span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="h-7 rounded-lg border-slate-700/80 bg-slate-900/80 text-xs text-slate-100 hover:border-slate-500 hover:bg-slate-800/90 disabled:opacity-40"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  className="h-7 rounded-lg border-slate-700/80 bg-slate-900/80 text-xs text-slate-100 hover:border-slate-500 hover:bg-slate-800/90 disabled:opacity-40"
                >
                  ↓
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-linear-to-r from-sky-500 to-blue-600 text-sm font-semibold shadow-lg shadow-sky-900/50 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save layout"}
      </Button>
      {status && <p className="mt-1 text-xs text-slate-400">{status}</p>}
    </div>
  );
}
