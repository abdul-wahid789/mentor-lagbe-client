"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardUser, TuitionPostItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { StatCard } from "./StatCard";

interface MonthlyRevenuePoint {
  month: string;
  amount: number;
}

const DEFAULT_REVENUE_SERIES: MonthlyRevenuePoint[] = [
  { month: "Jun", amount: 420 },
  { month: "Jul", amount: 510 },
  { month: "Aug", amount: 630 },
  { month: "Sep", amount: 760 },
  { month: "Oct", amount: 890 },
  { month: "Nov", amount: 1050 },
];

export function RevenueBarChart({
  series = DEFAULT_REVENUE_SERIES,
  totalRevenue = 4260,
  proCount = 336,
}: {
  series?: MonthlyRevenuePoint[];
  totalRevenue?: number;
  proCount?: number;
}) {
  const maxVal = Math.max(...series.map((d) => d.amount), 1);

  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-foreground">
            Membership revenue
          </h2>
          <Badge
            variant="secondary"
            className="rounded-md bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-primary"
          >
            Last 6 months
          </Badge>
        </div>

        <div className="grid grid-cols-6 items-end gap-2 pt-4 sm:gap-4">
          {series.map((item, idx) => {
            const isLatest = idx === series.length - 1;
            const heightPct = Math.max(22, Math.round((item.amount / maxVal) * 100));

            return (
              <div
                key={item.month}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="font-mono text-[10px] text-muted-foreground sm:text-xs tabular-nums">
                  ${item.amount}
                </span>
                <div className="flex h-28 w-full items-end">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={cn(
                      "w-full rounded-lg transition-all",
                      isLatest
                        ? "bg-primary"
                        : "bg-secondary hover:bg-primary/25"
                    )}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          Total ${totalRevenue.toLocaleString()} · {proCount} Pro subscriptions
          · USD
        </p>
      </CardContent>
    </Card>
  );
}