import Link from "next/link";
import { FEATURED_TUITIONS } from "@/data/home-data";
import { TuitionCard } from "./TuitionCard";

export function FeaturedTuitionsSection() {
  return (
    <section className="w-full bg-background py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end mb-8">
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
            className="text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            View all tuitions →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TUITIONS.map((listing) => (
            <TuitionCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}