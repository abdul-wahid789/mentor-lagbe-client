"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardUser, TuitionPostItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { StatCard } from "./StatCard";
import { RevenueBarChart } from "./RevenueBarChart";

interface AdminOverviewProps {
  user: DashboardUser;
  totalUsers: number;
  studentCount: number;
  tutorCount: number;
  adminCount: number;
  pendingTuitions: TuitionPostItem[];
  approvedTuitionsCount: number;
  totalRevenue: number;
  onModerateTuition?: (id: string, status: "approved" | "rejected") => void;
}

export function AdminOverview({
  user,
  totalUsers,
  studentCount,
  tutorCount,
  adminCount,
  pendingTuitions,
  approvedTuitionsCount,
  totalRevenue,
  onModerateTuition,
}: AdminOverviewProps) {
  const firstName = user.name.split(" ")[0] || "Admin";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          A healthy learning community.
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {firstName}. Here&apos;s what needs your attention.
        </p>
      </div>

      {/* 4 Required Admin Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          metric={{
            label: "Total users",
            value: totalUsers.toLocaleString(),
            subtext: `${studentCount.toLocaleString()} Students · ${tutorCount} Tutors · ${adminCount} Admins`,
          }}
        />
        <StatCard
          metric={{
            label: "Total tutors",
            value: tutorCount.toLocaleString(),
            subtext: "In the teaching community",
          }}
        />
        <StatCard
          metric={{
            label: "Pending / approved",
            value: `${pendingTuitions.length} / ${approvedTuitionsCount}`,
            subtext: "Review the queue",
            href: "/dashboard/admin/tuitions",
          }}
        />
        <StatCard
          metric={{
            label: "Stripe revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            subtext: "Lifetime membership revenue",
            href: "/dashboard/admin/transactions",
          }}
        />
      </div>

      <RevenueBarChart totalRevenue={totalRevenue} />

      {/* Tuition Approval Queue */}
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <h2 className="text-base font-bold text-foreground">
            Tuition approval queue
          </h2>

          <div className="space-y-3">
            {pendingTuitions.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-border/80 p-4 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.tutorName} · Submitted {item.createdAt}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.subject} · {item.classLevel} · {item.mode} · ৳
                    {item.monthlyFee.toLocaleString()}/month
                  </p>
                  <span className="mt-1 inline-flex rounded-md border border-warning/30 bg-warning-tint px-2 py-0.5 text-[11px] font-semibold text-warning">
                    Pending
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onModerateTuition?.(item.id, "approved")}
                    className="h-8 px-4 text-xs font-semibold"
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onModerateTuition?.(item.id, "rejected")}
                    className="h-8 border-destructive/20 bg-destructive-tint/70 px-4 text-xs font-semibold text-destructive hover:bg-destructive-tint"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}