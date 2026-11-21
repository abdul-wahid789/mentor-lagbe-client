import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StatMetric } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface StatCardProps {
  metric: StatMetric;
  highlighted?: boolean;
}

export function StatCard({ metric, highlighted = false }: StatCardProps) {
  return (
    <Card
      className={cn(
        "border bg-card transition-colors",
        highlighted
          ? "border-primary/50 shadow-xs"
          : "border-border hover:border-primary/30"
      )}
    >
      <CardContent className="flex h-full flex-col justify-between space-y-4 p-5">
        <p className="text-xs font-medium text-muted-foreground">
          {metric.label}
        </p>

        <p className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl tabular-nums">
          {metric.value}
        </p>

        {metric.href ? (
          <Link
            href={metric.href}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            <span>{metric.subtext}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <p className="text-xs font-medium text-primary">{metric.subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}