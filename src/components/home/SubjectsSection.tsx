import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SUBJECT_CATEGORIES } from "@/data/home-data";

export function SubjectsSection() {
  return (
    <section className="w-full bg-secondary/50 border-y border-border/60 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Follow your curiosity
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What do you want to learn?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECT_CATEGORIES.map((item) => (
            <Link key={item.index} href={item.href} className="group block">
              <Card className="h-full border-border bg-card transition-colors group-hover:border-primary/50">
                <CardContent className="flex flex-col justify-between gap-4 p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {item.index}
                    </span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Explore batches ↗
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}