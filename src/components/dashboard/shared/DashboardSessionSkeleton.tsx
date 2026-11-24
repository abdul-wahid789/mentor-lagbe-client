import { Card, CardContent } from "@/components/ui/card";

export function DashboardSessionSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading workspace"
      className="min-h-screen w-full bg-background text-foreground"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-7 w-64 max-w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted/70" />
          </div>
          <div className="h-7 w-20 animate-pulse rounded-md bg-secondary" />
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Card
              key={item}
              className="rounded-2xl border-border bg-card shadow-xs"
            >
              <CardContent className="space-y-3 p-5">
                <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                <div className="h-7 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-36 animate-pulse rounded bg-secondary" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Panel Skeleton */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="h-5 w-44 animate-pulse rounded-md bg-muted" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="h-14 w-full animate-pulse rounded-xl border border-border/60 bg-muted/35"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}