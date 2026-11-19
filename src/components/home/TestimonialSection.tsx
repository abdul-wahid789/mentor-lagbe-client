import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TESTIMONIALS } from "@/data/home-data";
import { cn } from "@/lib/utils";

export function TestimonialSection() {
  const featured = TESTIMONIALS.find((t) => t.featured) ?? TESTIMONIALS[0];
  const secondary = TESTIMONIALS.filter((t) => t.id !== featured.id);

  return (
    <section className="w-full bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Real people. Real progress.
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Stories from our learning community.
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span className="font-mono font-semibold text-foreground">4.9/5</span>
            <span>from 450+ verified sessions</span>
          </div>
        </div>

        {/* Bento Layout: Featured Story + Secondary Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Featured Spotlight Card */}
          <Card className="relative flex flex-col justify-between overflow-hidden border-primary/30 bg-secondary/40 lg:col-span-7">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Quote className="h-4 w-4" />
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-md bg-card text-[11px] font-medium text-secondary-foreground border border-border"
                  >
                    {featured.subject}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-md text-[11px] font-medium",
                      featured.mode === "Online"
                        ? "border-accent/25 bg-accent-tint text-accent"
                        : "border-success/25 bg-success-tint text-success"
                    )}
                  >
                    {featured.mode}
                  </Badge>
                </div>
              </div>

              <blockquote className="text-xl font-bold tracking-tight text-foreground sm:text-2xl leading-snug">
                &ldquo;{featured.headline}&rdquo;
              </blockquote>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featured.quote}
              </p>
            </CardContent>

            <CardFooter className="flex items-center gap-3 border-t border-border/60 bg-card/70 px-6 py-4 sm:px-8">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {featured.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {featured.authorName}
                </p>
                <p className="text-xs text-muted-foreground">{featured.role}</p>
              </div>
            </CardFooter>
          </Card>

          {/* Secondary Stacked Reviews */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            {secondary.map((item) => (
              <Card
                key={item.id}
                className="flex flex-1 flex-col justify-between border-border bg-card transition-colors hover:border-primary/40"
              >
                <CardContent className="space-y-2.5 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5 text-warning">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>

                    <span className="font-mono text-[11px] text-muted-foreground">
                      {item.subject} · {item.mode}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-foreground">
                    &ldquo;{item.headline}&rdquo;
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.quote}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center gap-2.5 border-t border-border/60 px-5 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {item.authorName}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {item.role}
                    </p>
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