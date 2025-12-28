// app/[slug]/preview/JobsPreview.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Job = {
  id: string;
  title: string | null;
  description: string | null;
  location: string | null;
  salary_range: string | null;
  job_slug: string | null;
  is_remote: boolean | null;
  department: string | null;
  employment_type: string | null;
  experience_level: string | null;
};

export default function JobsPreview({
  jobs,
  primaryColor,
  secondaryColor,
  textColor,
  companyId,
}: {
  jobs: Job[] | null | undefined;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  companyId: string;
}) {
  const safeJobs: Job[] = Array.isArray(jobs) ? jobs : [];

  const [search, setSearch] = useState("");
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    location: string;
    department: string;
    employment_type: string;
    experience_level: string;
  }>({
    location: "",
    department: "",
    employment_type: "",
    experience_level: "",
  });
  const [pageSize, setPageSize] = useState<10 | 25 | 50>(10);
  const [page, setPage] = useState(1);

  // Apply dialog state
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [isSubmitting, startTransition] = useTransition();

  const filteredJobs = useMemo(() => {
    return safeJobs.filter((job) => {
      const text = `${job.title || ""} ${job.location || ""} ${
        job.department || ""
      } ${job.employment_type || ""} ${
        job.experience_level || ""
      }`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesLocation =
        !filters.location ||
        (job.location || "")
          .toLowerCase()
          .includes(filters.location.toLowerCase());
      const matchesDept =
        !filters.department ||
        (job.department || "")
          .toLowerCase()
          .includes(filters.department.toLowerCase());
      const matchesType =
        !filters.employment_type ||
        (job.employment_type || "")
          .toLowerCase()
          .includes(filters.employment_type.toLowerCase());
      const matchesLevel =
        !filters.experience_level ||
        (job.experience_level || "")
          .toLowerCase()
          .includes(filters.experience_level.toLowerCase());

      return (
        matchesSearch &&
        matchesLocation &&
        matchesDept &&
        matchesType &&
        matchesLevel
      );
    });
  }, [safeJobs, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedJobs = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, safePage, pageSize]);

  const clearFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      department: "",
      employment_type: "",
      experience_level: "",
    });
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const openApply = (job: Job) => {
    setApplyJob(job);
    setApplyName("");
    setApplyEmail("");
    setApplyError(null);
    setApplySuccess(false);
  };

  const submitApplication = () => {
    if (!applyJob) return;
    setApplyError(null);
    setApplySuccess(false);

    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/company/${companyId}/jobs/${applyJob.id}/apply`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: applyName, email: applyEmail }),
          }
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to apply");

        setApplySuccess(true);
      } catch (err: any) {
        setApplyError(err.message || "Failed to apply");
      }
    });
  };

  return (
    <section className="space-y-6">
      {/* Header + page size */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: textColor }}>
            Open Roles
          </h2>
          <p className="text-sm opacity-70" style={{ color: textColor }}>
            Search and filter through all available roles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs opacity-80">
          <span style={{ color: textColor }}>Rows per page</span>
          <div className="flex items-center gap-1">
            {[10, 25, 50].map((size) => {
              const isActive = pageSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setPageSize(size as 10 | 25 | 50);
                    setPage(1);
                  }}
                  className={
                    "flex h-7 w-9 items-center justify-center rounded-md text-xs transition-colors " +
                    (isActive
                      ? "text-white"
                      : "hover:bg-white/5 hover:text-white")
                  }
                  style={
                    isActive
                      ? { backgroundColor: primaryColor }
                      : { color: textColor }
                  }
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="space-y-3 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm backdrop-blur-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search by title, location, department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 max-w-md rounded-xl border-white/10 bg-black/40 text-xs text-slate-50 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-slate-50"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {(
            [
              ["location", "Location"],
              ["department", "Department"],
              ["employment_type", "Employment Type"],
              ["experience_level", "Experience level"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <label className="text-[11px] font-medium uppercase tracking-wide text-slate-300">
                {label}
              </label>
              <div className="flex items-center gap-1">
                <Input
                  value={filters[key]}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
                    setPage(1);
                  }}
                  placeholder={`Filter by ${label.toLowerCase()}`}
                  className="h-9 rounded-xl border-white/10 bg-black/40 text-xs text-slate-50 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
                {filters[key] && (
                  <button
                    type="button"
                    onClick={() => clearFilter(key)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-[10px] text-slate-200 hover:bg-white/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs list */}
      <div className="space-y-3">
        {paginatedJobs.map((job) => {
          const isOpen = job.id === openJobId;
          return (
            <Collapsible
              key={job.id}
              open={isOpen}
              onOpenChange={(open) => setOpenJobId(open ? job.id : null)}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/15 backdrop-blur-sm transition-shadow"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <h3 className="font-medium" style={{ color: textColor }}>
                    {job.title}
                  </h3>
                  <p
                    className="text-xs opacity-80"
                    style={{ color: textColor }}
                  >
                    {job.location}
                    {job.employment_type ? ` · ${job.employment_type}` : ""}
                    {job.is_remote ? " · Remote" : ""}
                  </p>
                  {job.salary_range && (
                    <p
                      className="text-xs opacity-80"
                      style={{ color: textColor }}
                    >
                      Salary: {job.salary_range}
                    </p>
                  )}
                </div>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 rounded-lg border-white/40 bg-white/5 text-xs text-white hover:bg-white/10"
                  >
                    {isOpen ? "Close" : "View"}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="border-t border-white/10">
                <div className="space-y-3 px-4 py-3">
                  {(job.department ||
                    job.employment_type ||
                    job.experience_level) && (
                    <div className="flex flex-wrap gap-1">
                      {job.department && (
                        <Badge
                          variant="outline"
                          className="border-white/60 bg-white/5 text-xs text-white"
                        >
                          {job.department}
                        </Badge>
                      )}
                      {job.employment_type && (
                        <Badge
                          variant="outline"
                          className="border-white/60 bg-white/5 text-xs text-white"
                        >
                          {job.employment_type}
                        </Badge>
                      )}
                      {job.experience_level && (
                        <Badge
                          variant="outline"
                          className="border-white/60 bg-white/5 text-xs text-white"
                        >
                          {job.experience_level}
                        </Badge>
                      )}
                    </div>
                  )}

                  <p
                    className="text-sm opacity-95"
                    style={{ color: textColor }}
                  >
                    {job.description ||
                      "Detailed description for this role will appear here."}
                  </p>

                  <Button
                    className="w-full rounded-xl text-sm font-medium shadow-lg"
                    style={{
                      backgroundColor: primaryColor,
                      color: "#ffffff",
                    }}
                    type="button"
                    onClick={() => openApply(job)}
                  >
                    Apply now
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
        {!paginatedJobs.length && (
          <p className="text-sm opacity-70" style={{ color: textColor }}>
            No roles match your search or filters.
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-between pt-2 text-xs opacity-80">
          <span style={{ color: textColor }}>
            Page {safePage} of {totalPages} · {filteredJobs.length} roles
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Apply dialog */}
      <Dialog
        open={!!applyJob}
        onOpenChange={(open) => {
          if (!open) setApplyJob(null);
        }}
      >
        <DialogContent className="max-w-md rounded-2xl border border-white/10 bg-slate-950/90 p-6 text-slate-100 shadow-2xl shadow-slate-950/60 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle
              className="text-lg font-semibold"
              style={{ color: primaryColor }}
            >
              Apply for {applyJob?.title ?? "this role"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: textColor }}
              >
                Name
              </label>
              <Input
                value={applyName}
                onChange={(e) => setApplyName(e.target.value)}
                placeholder="Your full name"
                className="h-10 rounded-xl border-slate-700/70 bg-slate-900/60 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: textColor }}
              >
                Email
              </label>
              <Input
                type="email"
                value={applyEmail}
                onChange={(e) => setApplyEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10 rounded-xl border-slate-700/70 bg-slate-900/60 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              />
            </div>
            {applyError && <p className="text-xs text-red-400">{applyError}</p>}
            {applySuccess && (
              <p className="text-xs text-emerald-400">
                Application submitted successfully.
              </p>
            )}
          </div>

          <DialogFooter className="mt-5 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setApplyJob(null)}
              className="rounded-xl px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-semibold shadow-lg shadow-sky-900/50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor, color: "#ffffff" }}
              disabled={isSubmitting || !applyName || !applyEmail}
              onClick={submitApplication}
            >
              {isSubmitting ? "Submitting..." : "Submit application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
