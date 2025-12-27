"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";

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
  textColor,
}: {
  jobs: Job[] | null | undefined;
  primaryColor: string;
  textColor: string;
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

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: textColor }}>
            Open Roles
          </h2>
          <p className="text-sm opacity-70">
            Search and filter through all available roles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs opacity-70">
          <span>Rows per page</span>
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
                    "h-7 w-9 flex items-center justify-center rounded-md text-xs transition-colors " +
                    (isActive ? "text-white" : "hover:bg-neutral-100")
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

      {/* Search + text input filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-full md:w-64">
          <label className="text-xs opacity-70 mb-1 block">Search</label>
          <Input
            placeholder="Search by title, location, department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="text-sm h-9"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-70">Location</label>
          <div className="relative">
            <Input
              placeholder="Filter location..."
              value={filters.location}
              onChange={(e) => {
                setFilters((f) => ({ ...f, location: e.target.value }));
                setPage(1);
              }}
              className="text-sm h-9 w-44 pr-8"
            />
            {filters.location && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => clearFilter("location")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-70">Department</label>
          <div className="relative">
            <Input
              placeholder="Filter department..."
              value={filters.department}
              onChange={(e) => {
                setFilters((f) => ({ ...f, department: e.target.value }));
                setPage(1);
              }}
              className="text-sm h-9 w-44 pr-8"
            />
            {filters.department && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => clearFilter("department")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-70">Job Type</label>
          <div className="relative">
            <Input
              placeholder="Filter job type..."
              value={filters.employment_type}
              onChange={(e) => {
                setFilters((f) => ({ ...f, employment_type: e.target.value }));
                setPage(1);
              }}
              className="text-sm h-9 w-40 pr-8"
            />
            {filters.employment_type && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => clearFilter("employment_type")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-70">Experience</label>
          <div className="relative">
            <Input
              placeholder="Filter experience..."
              value={filters.experience_level}
              onChange={(e) => {
                setFilters((f) => ({ ...f, experience_level: e.target.value }));
                setPage(1);
              }}
              className="text-sm h-9 w-52 pr-8"
            />
            {filters.experience_level && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => clearFilter("experience_level")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-9"
            onClick={clearFilters}
            style={{ color: primaryColor }}
          >
            Clear all filters
          </Button>
        )}
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
              className="rounded-lg bg-white overflow-hidden transition-shadow"
              style={{
                borderColor: primaryColor + "33", // light tint
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-medium" style={{ color: textColor }}>
                    {job.title}
                  </h3>
                  <p className="text-xs opacity-70">
                    {job.location}
                    {job.employment_type ? ` · ${job.employment_type}` : ""}
                    {job.is_remote ? " · Remote" : ""}
                  </p>
                  {job.salary_range && (
                    <p className="text-xs opacity-70">
                      Salary: {job.salary_range}
                    </p>
                  )}
                </div>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      backgroundColor: isOpen
                        ? primaryColor + "0D"
                        : "transparent",
                    }}
                    className="flex items-center gap-1"
                  >
                    {isOpen ? "Close" : "View"}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="border-t border-gray-100">
                <div className="px-4 py-3 space-y-3 animate-in fade-in-0 slide-in-from-top-1">
                  {(job.department ||
                    job.employment_type ||
                    job.experience_level) && (
                    <div className="flex flex-wrap gap-1">
                      {job.department && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: primaryColor + "55",
                            color: primaryColor,
                          }}
                        >
                          {job.department}
                        </Badge>
                      )}
                      {job.employment_type && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: primaryColor + "55",
                            color: primaryColor,
                          }}
                        >
                          {job.employment_type}
                        </Badge>
                      )}
                      {job.experience_level && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: primaryColor + "55",
                            color: primaryColor,
                          }}
                        >
                          {job.experience_level}
                        </Badge>
                      )}
                    </div>
                  )}

                  <p className="text-sm" style={{ color: textColor }}>
                    {job.description ||
                      "Detailed description for this role will appear here."}
                  </p>

                  <Button
                    className="w-full"
                    style={{
                      backgroundColor: primaryColor,
                      color: "#ffffff",
                    }}
                  >
                    Apply now
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {!paginatedJobs.length && (
          <p className="text-sm opacity-70">
            No roles match your search or filters.
          </p>
        )}
      </div>

      {/* Pagination controls */}
      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-between text-xs opacity-70 pt-2">
          <span>
            Showing {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, filteredJobs.length)} of{" "}
            {filteredJobs.length} roles
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              {safePage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
