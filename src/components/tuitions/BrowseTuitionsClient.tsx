"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { getApprovedTuitions } from "@/lib/actions/tuition";
import { showErrorToast } from "@/lib/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TuitionPostItem } from "@/types/dashboard";
import { TuitionCard } from "../home/TuitionCard";

const PAGE_SIZE = 6;

interface BrowseTuitionsClientProps {
  fromDashboard?: boolean;
}

function getTuitionId(item: TuitionPostItem, index: number): string {
  return item._id ? String(item._id) : `tuition-${index}`;
}

export function BrowseTuitionsClient({
  fromDashboard = false,
}: BrowseTuitionsClientProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const rawMode = (searchParams.get("mode") || "").toLowerCase();
  const initialMode =
    rawMode === "online" ? "Online" : rawMode === "home" ? "Home" : "All";

  const [tuitions, setTuitions] = useState<TuitionPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState(initialMode);

  const [appliedQuery, setAppliedQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearchInput(initialQuery);
    setAppliedQuery(initialQuery);
    setModeFilter(initialMode);
    setPage(1);
  }, [initialQuery, initialMode]);

  useEffect(() => {
    let active = true;

    async function fetchTuitions() {
      setLoading(true);
      const res = await getApprovedTuitions();
      if (!active) return;

      if (res.error) {
        showErrorToast(res.msg || "Could not load tuitions.");
      } else if (Array.isArray(res.data)) {
        setTuitions(res.data);
      }
      setLoading(false);
    }

    fetchTuitions();
    return () => {
      active = false;
    };
  }, []);

  const subjectOptions = useMemo(() => {
    const set = new Set<string>();
    tuitions.forEach((t) => {
      if (t.subject) set.add(t.subject);
    });
    return Array.from(set);
  }, [tuitions]);

  const classOptions = useMemo(() => {
    const set = new Set<string>();
    tuitions.forEach((t) => {
      if (t.classLevel) set.add(t.classLevel);
    });
    return Array.from(set);
  }, [tuitions]);

  const filteredTuitions = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();

    return tuitions.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        (item.tutorName || "").toLowerCase().includes(q);

      const matchesSubject =
        subjectFilter === "All" || item.subject === subjectFilter;

      const matchesClass =
        classFilter === "All" || item.classLevel === classFilter;

      const matchesMode =
        modeFilter === "All" ||
        item.mode.toLowerCase() === modeFilter.toLowerCase();

      return matchesQuery && matchesSubject && matchesClass && matchesMode;
    });
  }, [tuitions, appliedQuery, subjectFilter, classFilter, modeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTuitions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleTuitions = filteredTuitions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedQuery(searchInput);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setAppliedQuery("");
    setSubjectFilter("All");
    setClassFilter("All");
    setModeFilter("All");
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          LEARN YOUR WAY
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your next breakthrough starts here.
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Find the right tutor, subject, and schedule for you.
        </p>
      </div>

      {/* Filter Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="browse-search"
                className="text-xs font-semibold text-foreground"
              >
                Search tuitions
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="browse-search"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setAppliedQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Title or subject..."
                  className="h-10 bg-background/70 pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
              <div className="space-y-1.5">
                <Label
                  htmlFor="filter-subject"
                  className="text-xs font-semibold text-foreground"
                >
                  Subject
                </Label>
                <Select
                  value={subjectFilter}
                  onValueChange={(val) => {
                    setSubjectFilter(val ?? "All");
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    id="filter-subject"
                    className="h-10 w-full bg-background/70"
                  >
                    <SelectValue placeholder="All subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All subject</SelectItem>
                    {subjectOptions.map((subj) => (
                      <SelectItem key={subj} value={subj}>
                        {subj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="filter-class"
                  className="text-xs font-semibold text-foreground"
                >
                  Class level
                </Label>
                <Select
                  value={classFilter}
                  onValueChange={(val) => {
                    setClassFilter(val ?? "All");
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    id="filter-class"
                    className="h-10 w-full bg-background/70"
                  >
                    <SelectValue placeholder="All class level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All class level</SelectItem>
                    {classOptions.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="filter-mode"
                  className="text-xs font-semibold text-foreground"
                >
                  Learning mode
                </Label>
                <Select
                  value={modeFilter}
                  onValueChange={(val) => {
                    setModeFilter(val ?? "All");
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    id="filter-mode"
                    className="h-10 w-full bg-background/70"
                  >
                    <SelectValue placeholder="All learning mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All learning mode</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="h-10 px-5 text-xs font-semibold sm:text-sm"
              >
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Count & Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-foreground">
          {loading
            ? "Loading tuitions..."
            : `${filteredTuitions.length} ${
                filteredTuitions.length === 1 ? "tuition" : "tuitions"
              } available`}
        </p>

        <Badge
          variant="outline"
          className="rounded-full border-success/35 bg-success-tint px-3 py-1 text-xs font-semibold text-success"
        >
          Approved &amp; active
        </Badge>
      </div>

      {/* Tuitions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-52 animate-pulse rounded-2xl border border-border/70 bg-card/60"
            />
          ))}
        </div>
      ) : visibleTuitions.length === 0 ? (
        <Card className="border-dashed border-border bg-card">
          <CardContent className="space-y-3 p-10 text-center">
            <p className="text-sm font-semibold text-foreground">
              No tuitions match your filters.
            </p>
            <p className="text-xs text-muted-foreground">
              Try clearing your search or selecting different filter options.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
            >
              Reset filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleTuitions.map((item, idx) => (
            <TuitionCard
              key={getTuitionId(item, idx)}
              data={item}
              index={idx}
              fromDashboard={fromDashboard}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredTuitions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-9 px-3 text-xs font-medium"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            <span>Previous</span>
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              type="button"
              variant={pageNum === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(pageNum)}
              className="h-9 w-9 p-0 text-xs font-semibold"
            >
              {pageNum}
            </Button>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="h-9 px-3 text-xs font-medium"
          >
            <span>Next</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}