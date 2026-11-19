import { HERO_STATS } from "@/data/home-data";

export function StatsStrip() {
  return (
    <section className="w-full border-b border-border/60 bg-background py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="space-y-0.5 mx-auto">
              <p className="font-mono text-xl text-center font-bold tracking-tight text-foreground sm:text-2xl tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-center text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}