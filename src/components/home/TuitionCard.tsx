"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TuitionListing } from "@/types/home";
import type { TuitionMode, TuitionPostItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export type ReusableTuitionCardData = TuitionPostItem | TuitionListing;

export interface TuitionCardProps {
  data?: ReusableTuitionCardData;
  tuition?: ReusableTuitionCardData;
  listing?: ReusableTuitionCardData;
  index?: number;
  fromDashboard?: boolean;
  className?: string;
}

function isPostItem(item: ReusableTuitionCardData): item is TuitionPostItem {
  return "classLevel" in item || "monthlyFee" in item;
}

export function TuitionCard({
  data,
  tuition,
  listing,
  index = 0,
  fromDashboard = false,
  className,
}: TuitionCardProps) {
  const [imgError, setImgError] = useState(false);

  const item = data ?? tuition ?? listing;

  if (!item) return null;

  const isPost = isPostItem(item);

  const id = isPost
    ? item._id
      ? String(item._id)
      : `tuition-${index}`
    : "";

  const href = isPost
    ? fromDashboard
      ? `/dashboard/student/tuitions/${id}`
      : `/tuitions/${id}`
    : item.href;

  const mode: TuitionMode = item.mode === "Home" ? "Home" : "Online";
  const isOnline = mode === "Online";

  const bannerUrl = item.bannerUrl?.trim() || "";
  const showBanner = Boolean(bannerUrl) && !imgError;

  const metaLine = isPost
    ? `${item.classLevel || "All levels"} · ${Number(item.daysPerWeek || 3)} days / week`
    : `${item.level} · ${item.schedule}`;

  const tutorLine = isPost
    ? `${item.tutorName || "Verified Tutor"} · Verified tutor`
    : item.verified
    ? `${item.tutorName} · Verified tutor`
    : item.tutorName;

  const feeText = isPost
    ? `৳${Number(item.monthlyFee || 0).toLocaleString()}`
    : item.monthlyRate;

  return (
    <Link
      href={href}
      aria-label={`View details for ${item.title}`}
      className={cn(
        "group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <Card className="flex h-full flex-col justify-between gap-0 overflow-hidden border-border bg-card p-0 shadow-xs transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:border-primary/45 group-hover:shadow-md">
        {/* Banner Image or Fallback Cover */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden border-b border-border/60 bg-muted/40">
          {showBanner ? (
            <>
              <Image
                src={bannerUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImgError(true)}
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </>
          ) : (
            <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-primary/15 via-secondary/70 to-primary/5 p-4 transition-colors duration-300">
              {/* Subtle decorative pattern */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-primary/15 blur-xl transition-transform duration-300 group-hover:scale-125"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-primary/10 blur-lg"
              />

              <div className="relative flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-2xs backdrop-blur-xs">
                  {item.subject}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {mode}
                </span>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-background/85 text-primary shadow-xs backdrop-blur-xs transition-transform duration-300 group-hover:scale-105">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground/90">
                    {isPost ? item.classLevel || "All Levels" : item.level}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    1-on-1 &amp; Batch Mentorship
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col justify-between space-y-5 p-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary"
              >
                {item.subject}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-md px-2.5 py-0.5 text-xs font-medium",
                  isOnline
                    ? "border-success/30 bg-success-tint text-success"
                    : "border-border bg-muted/60 text-muted-foreground"
                )}
              >
                {mode}
              </Badge>
            </div>

            <h2 className="text-lg font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
              {item.title}
            </h2>

            <div className="space-y-1 text-xs text-muted-foreground">
              <p>{metaLine}</p>
              <p>{tutorLine}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="font-mono text-base font-bold text-foreground tabular-nums">
              {feeText}{" "}
              <span className="font-sans text-xs font-normal text-muted-foreground">
                / month
              </span>
            </p>

            <span className="inline-flex h-8 items-center gap-1 rounded-lg bg-secondary px-3 text-xs font-semibold text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
              <span>View details</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
