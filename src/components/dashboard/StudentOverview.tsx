'use client'

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardUser, StudentApplicationItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { StatCard } from "./StatCard";

interface StudentOverviewProps {
  user: DashboardUser;
  applications: StudentApplicationItem[];
  onCancelApplication?: (id: string) => void;
}

export function StudentOverview({
  user,
  applications,
  onCancelApplication,
}: StudentOverviewProps) {
  const totalApplied = applications.length;
  const acceptedCount = applications.filter(
    (a) => a.status === "accepted"
  ).length;
  const pendingCount = applications.filter(
    (a) => a.status === "pending"
  ).length;
  const firstName = user.name.split(" ")[0] || "Student";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            A little progress, every day.
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {firstName}. Let&apos;s find your next breakthrough.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
        >
          Student
        </Badge>
      </div>

      {/* 4 Required Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          metric={{
            label: "Total applied",
            value: totalApplied,
            subtext: "Your learning journey",
            href: "/dashboard/student/applications",
          }}
        />
        <StatCard
          highlighted
          metric={{
            label: "Accepted",
            value: acceptedCount,
            subtext: "Ready to begin",
          }}
        />
        <StatCard
          metric={{
            label: "Pending",
            value: pendingCount,
            subtext: "Awaiting tutor review",
          }}
        />
        <StatCard
          metric={{
            label: "Your plan",
            value: user.plan === "pro" ? "Pro" : "Free",
            subtext: user.plan === "pro" ? "Priority active" : "Explore Pro",
            href: "/#pricing",
          }}
        />
      </div>

      {/* Highlight Banner */}
      <Card className="border-primary/20 bg-secondary/65 shadow-none">
        <CardContent className="space-y-3 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-primary">
            Your next chapter is taking shape.
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            You have {acceptedCount} accepted{" "}
            {acceptedCount === 1 ? "application" : "applications"}. Open your
            applications to review your tutor&apos;s details.
          </p>
          <Button
            size="sm"
            className="h-9 px-4 text-xs font-semibold"
            nativeButton={false}
            render={
              <Link href="/dashboard/student/applications">
                <span>View my applications</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            }
          />
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <h2 className="text-base font-bold text-foreground">
            Recent applications
          </h2>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-muted-foreground">
                  <th className="rounded-l-lg px-4 py-2.5 font-medium">
                    Tuition &amp; tutor
                  </th>
                  <th className="px-4 py-2.5 font-medium">Monthly fee</th>
                  <th className="px-4 py-2.5 font-medium">Applied on</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="rounded-r-lg px-4 py-2.5 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {applications.slice(0, 4).map((app) => (
                  <tr key={app.id} className="align-middle">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-foreground">
                        {app.tuitionTitle}
                      </p>
                      <p className="text-muted-foreground">{app.tutorName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {app.tutorEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-medium text-foreground tabular-nums">
                      ৳{app.monthlyFee.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {app.appliedAt}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize",
                          app.status === "accepted"
                            ? "border-success/30 bg-success-tint text-success"
                            : app.status === "rejected"
                            ? "border-destructive/30 bg-destructive-tint text-destructive"
                            : "border-warning/30 bg-warning-tint text-warning"
                        )}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {app.status === "pending" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onCancelApplication?.(app.id)}
                          className="h-7 px-3 text-xs font-medium text-primary hover:border-primary/40"
                        >
                          Cancel / Delete
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-3 text-xs font-medium"
                          nativeButton={false}
                          render={
                            <Link href={`/dashboard/student/tuitions/${app.tuitionId}`}>
                              View
                            </Link>
                          }
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Stacked Cards */}
          <div className="space-y-3 md:hidden">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="space-y-2.5 rounded-xl border border-border p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {app.tuitionTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.tutorName} · {app.tutorEmail}
                  </p>
                  <p className="pt-1 font-mono text-xs text-muted-foreground">
                    ৳{app.monthlyFee.toLocaleString()} / month · Applied{" "}
                    {app.appliedAt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize",
                      app.status === "accepted"
                        ? "border-success/30 bg-success-tint text-success"
                        : app.status === "rejected"
                        ? "border-destructive/30 bg-destructive-tint text-destructive"
                        : "border-warning/30 bg-warning-tint text-warning"
                    )}
                  >
                    {app.status}
                  </span>

                  {app.status === "pending" && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onCancelApplication?.(app.id)}
                        className="h-7 px-2.5 text-xs font-medium text-primary"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onCancelApplication?.(app.id)}
                        className="h-7 border-destructive/20 bg-destructive-tint/60 px-2.5 text-xs font-medium text-destructive"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <Link
              href="/dashboard/student/applications"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              <span>View all {totalApplied} applications</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Discovery Card */}
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-5 sm:p-6">
          <h2 className="text-base font-bold text-foreground">
            Curious about something new?
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Explore Mathematics, Physics, Programming, and IELTS with a tutor
            who understands your goals.
          </p>
          <Button
            variant="secondary"
            size="sm"
            nativeButton={false}
            className="h-8 bg-secondary px-3.5 text-xs font-semibold text-primary hover:bg-secondary/80"
            render={<Link href="/tuitions">Browse tuitions</Link>}
          />
        </CardContent>
      </Card>
    </div>
  );
}