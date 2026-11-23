import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SUBJECT_CATEGORIES } from "@/data/home-data";
import type { TuitionPostItem } from "@/types/dashboard";

interface SubjectCardItem {
  index: string;
  name: string;
  href: string;
  count?: number;
}

interface SubjectsSectionProps {
  tuitions?: TuitionPostItem[];
}

export function SubjectsSection({ tuitions = [] }: SubjectsSectionProps) {
  const categories: SubjectCardItem[] = (() => {
    if (!Array.isArray(tuitions) || tuitions.length === 0) {
      return SUBJECT_CATEGORIES;
    }

    const counts = new Map<string, number>();
    tuitions.forEach((item) => {
      const subject = (item.subject || "").trim();
      if (!subject) return;
      counts.set(subject, (counts.get(subject) || 0) + 1);
    });

    if (counts.size === 0) {
      return SUBJECT_CATEGORIES;
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count], idx) => ({
        index: String(idx + 1).padStart(2, "0"),
        name,
        href: `/tuitions?subject=${encodeURIComponent(name)}`,
        count,
      }));
  })();

  return (
    <section className="w-full border-y border-border/60 bg-secondary/50 py-14 sm:py-16">
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
          {categories.map((item) => (
            <Link key={item.index} href={item.href} className="group block">
              <Card className="h-full border-border bg-card transition-colors group-hover:border-primary/50">
                <CardContent className="flex flex-col justify-between gap-4 p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {item.index}
                    </span>
                    <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {typeof item.count === "number"
                      ? `${item.count} ${
                          item.count === 1 ? "batch" : "batches"
                        } available ↗`
                      : "Explore batches ↗"}
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