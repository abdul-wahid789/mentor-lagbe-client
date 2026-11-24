"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  removeTuitionBookmark,
  type BookmarkRecord,
} from "@/lib/actions/application";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DashboardUser, TuitionPostItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const FREE_BOOKMARK_LIMIT = 5;

export interface BookmarkedTuitionEntry {
  bookmark: BookmarkRecord;
  tuition: TuitionPostItem | null;
}

interface StudentBookmarksClientProps {
  user: DashboardUser;
  isPro: boolean;
  initialBookmarks: BookmarkedTuitionEntry[];
}

function formatSavedDate(raw?: string): string {
  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function StudentBookmarksClient({
  user,
  isPro,
  initialBookmarks,
}: StudentBookmarksClientProps) {
  const [items, setItems] = useState<BookmarkedTuitionEntry[]>(initialBookmarks);
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const isProStudent = isPro || user.plan === "pro";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter(({ bookmark, tuition }) => {
      const title = tuition?.title?.toLowerCase() || "";
      const subject = tuition?.subject?.toLowerCase() || "";
      const classLevel = tuition?.classLevel?.toLowerCase() || "";
      const tutorName = tuition?.tutorName?.toLowerCase() || "";
      const id = String(bookmark.tuitionId).toLowerCase();
      return (
        title.includes(q) ||
        subject.includes(q) ||
        classLevel.includes(q) ||
        tutorName.includes(q) ||
        id.includes(q)
      );
    });
  }, [items, search]);

  const handleRemoveBookmark = async (tuitionId: string) => {
    setRemovingId(tuitionId);
    try {
      const res = await removeTuitionBookmark(tuitionId);
      if (res.error) {
        showErrorToast(res.msg || "Could not remove bookmark.");
        return;
      }

      setItems((prev) =>
        prev.filter((entry) => String(entry.bookmark.tuitionId) !== tuitionId)
      );
      showSuccessToast("Bookmark removed.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Saved tuitions.
          </h1>
          <p className="text-sm text-muted-foreground">
            Review your bookmarked tuitions, open details, or remove ones you no
            longer need.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isProStudent ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pro Student · Unlimited</span>
            </span>
          ) : (
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Bookmarks: {items.length}/{FREE_BOOKMARK_LIMIT} used
            </span>
          )}
          <Badge
            variant="secondary"
            className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
          >
            Student
          </Badge>
        </div>
      </div>

      {/* Search & Browse CTA */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <Label
            htmlFor="search-bookmarks"
            className="text-xs font-semibold text-foreground"
          >
            Search bookmarks
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-bookmarks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject, class level, or tutor..."
              className="h-10 bg-card pl-9"
            />
          </div>
        </div>

        <Button
          nativeButton={false}
          className="h-10 px-4 text-xs font-semibold sm:text-sm"
          render={
            <Link href="/dashboard/student/tuitions">
              <Search className="mr-1.5 h-4 w-4" />
              <span>Browse tuitions</span>
            </Link>
          }
        />
      </div>

      {/* Bookmarks List */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-foreground">
              Your bookmarks
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "saved" : "saved"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/60 p-8 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                <Bookmark className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {items.length === 0
                  ? "No bookmarked tuitions yet."
                  : "No bookmarks match your search."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {items.length === 0
                  ? "Save tuitions while browsing so you can compare and apply later."
                  : "Try clearing or adjusting your search query."}
              </p>
              {items.length === 0 && (
                <div className="pt-4">
                  <Button
                    size="sm"
                    nativeButton={false}
                    className="h-9 rounded-lg px-4 text-xs font-semibold"
                    render={
                      <Link href="/dashboard/student/tuitions">
                        Explore approved tuitions
                      </Link>
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(({ bookmark, tuition }, idx) => {
                const tuitionId = String(bookmark.tuitionId);
                const isBusy = removingId === tuitionId;
                const isOnline = tuition?.mode === "Online";
                const savedDate = formatSavedDate(bookmark.createdAt);

                return (
                  <div
                    key={bookmark.id || `${tuitionId}-${idx}`}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-border/70 bg-muted/25 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-secondary/60 sm:flex sm:items-center sm:justify-center">
                        {tuition?.bannerUrl ? (
                          <Image
                            src={tuition.bannerUrl}
                            alt={tuition.title || "Tuition banner"}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {tuition?.subject && (
                            <Badge
                              variant="secondary"
                              className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary"
                            >
                              {tuition.subject}
                            </Badge>
                          )}
                          {tuition?.mode && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-md px-2 py-0.5 text-[11px] font-medium",
                                isOnline
                                  ? "border-success/30 bg-success-tint text-success"
                                  : "border-border bg-card text-muted-foreground"
                              )}
                            >
                              {tuition.mode}
                            </Badge>
                          )}
                          {savedDate && (
                            <span className="text-[11px] text-muted-foreground">
                              Saved {savedDate}
                            </span>
                          )}
                        </div>

                        <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
                          {tuition?.title || `Tuition #${tuitionId.slice(-6)}`}
                        </h3>

                        <p className="truncate text-xs text-muted-foreground">
                          {tuition ? (
                            <>
                              {tuition.classLevel || "All levels"} ·{" "}
                              {tuition.tutorName || "Verified Tutor"} · ৳
                              {Number(tuition.monthlyFee || 0).toLocaleString()}
                              /month
                            </>
                          ) : (
                            "This tuition may have been closed or removed by the tutor."
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {tuition && (
                        <Button
                          variant="outline"
                          size="sm"
                          nativeButton={false}
                          className="h-8 rounded-lg border-primary/25 bg-card px-3 text-xs font-semibold text-primary hover:bg-secondary/60"
                          render={
                            <Link
                              href={`/dashboard/student/tuitions/${tuitionId}`}
                            >
                              <span>View</span>
                              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                            </Link>
                          }
                        />
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => handleRemoveBookmark(tuitionId)}
                        className="h-8 rounded-lg border-destructive/20 bg-destructive-tint/70 px-3 text-xs font-semibold text-destructive hover:bg-destructive-tint"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        <span>{isBusy ? "Removing..." : "Delete"}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
