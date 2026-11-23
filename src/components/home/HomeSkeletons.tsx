import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function StatsStripSkeleton() {
  return (
    <section
      aria-label="Loading platform statistics"
      className="w-full border-b border-border/60 bg-background py-8"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="mx-auto flex flex-col items-center space-y-1.5"
            >
              <div className="h-7 w-20 animate-pulse rounded-md bg-muted sm:h-8 sm:w-24" />
              <div className="h-3.5 w-24 animate-pulse rounded bg-muted/70 sm:h-4 sm:w-28" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedTuitionsSkeleton() {
  return (
    <section
      aria-label="Loading featured tuitions"
      className="w-full bg-background py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted/70" />
          </div>
          <div className="h-4 w-28 animate-pulse rounded bg-muted/70" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <Card
              key={idx}
              className="border-border bg-card shadow-xs"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-5 w-20 animate-pulse rounded-md bg-secondary" />
                  <div className="h-5 w-16 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full animate-pulse rounded bg-muted/70" />
                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted/70" />
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-20 animate-pulse rounded bg-secondary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SubjectsSectionSkeleton() {
  return (
    <section
      aria-label="Loading subjects"
      className="w-full border-y border-border/60 bg-secondary/50 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 space-y-2">
          <div className="h-3 w-28 animate-pulse rounded bg-secondary" />
          <div className="h-8 w-60 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
            <Card key={idx} className="border-border bg-card">
              <CardContent className="flex flex-col justify-between gap-4 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-6 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-3.5 w-24 animate-pulse rounded bg-muted/70" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialSectionSkeleton() {
  return (
    <section
      aria-label="Loading community stories"
      className="w-full bg-background py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-secondary" />
            <div className="h-8 w-72 max-w-full animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="h-8 w-52 animate-pulse rounded-full border border-border bg-card" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="border-primary/30 bg-secondary/40 lg:col-span-7">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-primary/15" />
                <div className="flex gap-2">
                  <div className="h-5 w-20 animate-pulse rounded-md bg-card" />
                  <div className="h-5 w-16 animate-pulse rounded-md bg-card" />
                </div>
              </div>
              <div className="h-7 w-4/5 animate-pulse rounded-md bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted/70" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-muted/70" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted/70" />
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-3 border-t border-border/60 bg-card/70 px-6 py-4 sm:px-8">
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-44 animate-pulse rounded bg-muted/70" />
              </div>
            </CardFooter>
          </Card>

          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            {[0, 1].map((idx) => (
              <Card key={idx} className="flex-1 border-border bg-card">
                <CardContent className="space-y-2.5 p-5">
                  <div className="flex items-center justify-between">
                    <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-28 animate-pulse rounded bg-muted/70" />
                  </div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3.5 w-full animate-pulse rounded bg-muted/70" />
                </CardContent>
                <CardFooter className="flex items-center gap-2.5 border-t border-border/60 px-5 py-3">
                  <div className="h-7 w-7 animate-pulse rounded-full bg-secondary" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted/70" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}