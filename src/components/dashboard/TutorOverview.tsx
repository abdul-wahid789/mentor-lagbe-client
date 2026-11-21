import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  DashboardUser,
  StudentApplicationItem,
  TuitionPostItem,
} from "@/types/dashboard";
import { StatCard } from "./StatCard";

interface TutorOverviewProps {
  user: DashboardUser;
  tuitions: TuitionPostItem[];
  applicants: StudentApplicationItem[];
}

export function TutorOverview({
  user,
  tuitions,
  applicants,
}: TutorOverviewProps) {
  const totalPosted = tuitions.length;
  const activeApproved = tuitions.filter(
    (t) => t.approvalStatus === "approved" && t.isActive
  ).length;
  const pendingApplicants = applicants.filter(
    (a) => a.status === "pending"
  ).length;
  const firstName = user.name.split(" ")[0] || "Tutor";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your teaching, at a glance.
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {firstName}. Keep making a difference.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
        >
          Tutor
        </Badge>
      </div>

      {/* 4 Required Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          metric={{
            label: "Tuitions posted",
            value: totalPosted,
            subtext: "Across all subjects",
            href: "/dashboard/tutor/my-tuitions",
          }}
        />
        <StatCard
          highlighted
          metric={{
            label: "Active / approved",
            value: activeApproved,
            subtext: "Open for applications",
          }}
        />
        <StatCard
          metric={{
            label: "Applicants",
            value: applicants.length,
            subtext: `${pendingApplicants} awaiting review`,
            href: "/dashboard/tutor/applicants",
          }}
        />
        <StatCard
          metric={{
            label: "Your plan",
            value: user.plan === "pro" ? "Pro" : "Free",
            subtext:
              user.plan === "pro"
                ? "Unlimited tuition posts"
                : `${Math.max(0, 2 - totalPosted)} of 2 free posts left`,
          }}
        />
      </div>

      {/* Create Batch Banner */}
      <Card className="border-primary/20 bg-secondary/65 shadow-none">
        <CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-primary sm:text-lg">
              A new batch. A new beginning.
            </h2>
            <p className="text-base font-bold text-primary sm:text-lg">
              Create a tuition and inspire someone&apos;s next step.
            </p>
          </div>
          <Button
            size="sm"
            className="h-9 shrink-0 px-4 text-xs font-semibold"
            render={
              <Link href="/dashboard/tutor/post-tuition">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                <span>Post tuition</span>
              </Link>
            }
          />
        </CardContent>
      </Card>

      {/* Teaching Activity */}
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-5 sm:p-6">
          <h2 className="text-base font-bold text-foreground">
            Your teaching community is growing
          </h2>
          <div className="space-y-2 text-xs text-muted-foreground sm:text-sm">
            {applicants.slice(0, 3).map((app) => (
              <p key={app.id}>
                {app.appliedAt} · {app.studentName} applied to{" "}
                <span className="font-medium text-foreground">
                  {app.tuitionTitle}
                </span>
              </p>
            ))}
            {applicants.length === 0 && (
              <p>No student applications yet. Share your approved batches to reach students.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Applicants Prompt */}
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-5 sm:p-6">
          <h2 className="text-base font-bold text-foreground">
            {pendingApplicants} applications are waiting for you.
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Take a moment to review their goals and preferred schedules.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 bg-secondary px-3.5 text-xs font-semibold text-primary hover:bg-secondary/80"
            render={
              <Link href="/dashboard/tutor/applicants">
                <span>Review applicants</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}