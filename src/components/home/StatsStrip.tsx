import { HERO_STATS } from "@/data/home-data";
import type { HeroStatItem } from "@/lib/actions/home";

interface StatsStripProps {
  stats?: HeroStatItem[];
}

export function StatsStrip({ stats = HERO_STATS }: StatsStripProps) {
  const items = Array.isArray(stats) && stats.length > 0 ? stats : HERO_STATS;

  return (
    <section className="w-full border-b border-border/60 bg-background py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {items.map((stat) => (
            <div key={stat.label} className="mx-auto space-y-0.5 text-center">
              <p className="font-mono text-xl font-bold tracking-tight text-foreground tabular-nums sm:text-2xl">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}