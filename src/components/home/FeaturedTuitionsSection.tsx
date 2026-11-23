import Link from "next/link";
import type { TuitionPostItem } from "@/types/dashboard";
import { TuitionCard } from "./TuitionCard";

interface FeaturedTuitionsSectionProps {
  tuitions?: TuitionPostItem[];
}

export function FeaturedTuitionsSection({
  tuitions = [],
}: FeaturedTuitionsSectionProps) {
  const featured = Array.isArray(tuitions) ? tuitions.slice(0, 6) : [];

  return (
    <section className="w-full bg-background py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Find your fit
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Great teachers. Real progress.
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore hand-picked batches from our learning community.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            View all tuitions →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
            <p className="text-sm font-semibold text-foreground">
              New tuitions are being reviewed.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Check back soon or browse all available classes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item, idx) => (
              <TuitionCard
                key={item._id ? String(item._id) : `featured-tuition-${idx}`}
                data={item}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}