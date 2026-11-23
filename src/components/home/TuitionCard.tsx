import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
      <Card className="flex h-full flex-col justify-between border-border bg-card shadow-xs transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:border-primary/45 group-hover:shadow-md">
        <CardContent className="flex h-full flex-col justify-between space-y-5 p-5">
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