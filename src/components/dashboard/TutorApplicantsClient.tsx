"use client";

import { useMemo, useState } from "react";
import { updateApplicationStatus } from "@/lib/actions/application";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ApplicationStatus,
  StudentApplicationItem,
  TuitionPostItem,
} from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface TutorApplicantsClientProps {
  initialApplicants: StudentApplicationItem[];
  tuitions?: TuitionPostItem[];
}

function getStatusBadgeStyle(status: ApplicationStatus): string {
  if (status === "accepted") {
    return "border-success/35 bg-success-tint text-success";
  }
  if (status === "rejected") {
    return "border-destructive/35 bg-destructive-tint text-destructive";
  }
  return "border-warning/40 bg-warning-tint text-warning";
}

function formatStatusLabel(status: ApplicationStatus): string {
  if (status === "accepted") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export function TutorApplicantsClient({
  initialApplicants,
  tuitions = [],
}: TutorApplicantsClientProps) {
  const [applicants, setApplicants] =
    useState<StudentApplicationItem[]>(initialApplicants);
  const [tuitionFilter, setTuitionFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const tuitionOptions = useMemo(() => {
    const map = new Map<string, string>();
    tuitions.forEach((t) => {
      if (t._id && t.title) {
        map.set(String(t._id), t.title);
      }
    });
    applicants.forEach((a) => {
      if (a.tuitionId && a.tuitionTitle && !map.has(String(a.tuitionId))) {
        map.set(String(a.tuitionId), a.tuitionTitle);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [tuitions, applicants]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((item) => {
      const matchesTuition =
        tuitionFilter === "All" ||
        String(item.tuitionId) === String(tuitionFilter) ||
        item.tuitionTitle === tuitionFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesTuition && matchesStatus;
    });
  }, [applicants, tuitionFilter, statusFilter]);

  const handleDecision = async (
    applicationId: string,
    nextStatus: "accepted" | "rejected"
  ) => {
    setUpdatingId(applicationId);
    try {
      const res = await updateApplicationStatus(applicationId, {
        status: nextStatus,
      });

      if (res.error) {
        showErrorToast(res.msg || "Could not update application status.");
        return;
      }

      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: nextStatus } : app
        )
      );

      showSuccessToast(
        nextStatus === "accepted"
          ? "Student approved for this tuition."
          : "Application rejected."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Meet your next learners.
          </h1>
          <p className="text-sm text-muted-foreground">
            Review applications and welcome the right students.
          </p>
        </div>

        <Badge
          variant="secondary"
          className="w-fit rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
        >
          Tutor
        </Badge>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="applicant-tuition-filter"
            className="text-xs font-semibold text-foreground"
          >
            Tuition
          </Label>
          <Select
            value={tuitionFilter}
            onValueChange={(val) => setTuitionFilter(val ?? "All")}
          >
            <SelectTrigger
              id="applicant-tuition-filter"
              className="h-10 w-full bg-card"
            >
              <SelectValue placeholder="All tuitions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All tuitions</SelectItem>
              {tuitionOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="applicant-status-filter"
            className="text-xs font-semibold text-foreground"
          >
            Application status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val ?? "All")}
          >
            <SelectTrigger
              id="applicant-status-filter"
              className="h-10 w-full bg-card"
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applicants List */}
      {filteredApplicants.length === 0 ? (
        <Card className="border-dashed border-border bg-card">
          <CardContent className="space-y-2 p-10 text-center">
            <p className="text-sm font-semibold text-foreground">
              No student applications found.
            </p>
            <p className="text-xs text-muted-foreground">
              Try changing the tuition or status filter above to see other
              applications.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => {
            const isBusy = updatingId === app.id;
            const isPending = app.status === "pending";

            return (
              <Card
                key={app.id}
                className="border-border bg-card shadow-xs transition-colors hover:border-primary/35"
              >
                <CardContent className="space-y-4 p-5 sm:p-6">
                  {/* Top Row: Student Info + Status Badge */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-foreground sm:text-lg">
                        {app.studentName}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {app.studentEmail}
                        {app.studentPhone ? ` · ${app.studentPhone}` : ""}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "w-fit rounded-md px-2.5 py-0.5 text-xs font-semibold",
                        getStatusBadgeStyle(app.status)
                      )}
                    >
                      {formatStatusLabel(app.status)}
                    </Badge>
                  </div>

                  {/* Tuition Title & Applied Date */}
                  <p className="text-xs font-semibold text-primary">
                    {app.tuitionTitle}
                    {app.appliedAt ? ` · Applied ${app.appliedAt}` : ""}
                  </p>

                  {/* Preferred Schedule */}
                  {app.preferredSchedule && (
                    <p className="text-xs text-foreground">
                      <span className="font-medium">Preferred schedule:</span>{" "}
                      {app.preferredSchedule}
                    </p>
                  )}

                  {/* Student Note */}
                  {app.note && (
                    <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      “{app.note}”
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isBusy || app.status === "accepted"}
                      onClick={() => handleDecision(app.id, "accepted")}
                      className="h-9 rounded-lg px-4 text-xs font-semibold"
                    >
                      {isBusy && isPending
                        ? "Updating..."
                        : app.status === "accepted"
                        ? "Approved"
                        : "Approve student"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isBusy || app.status === "rejected"}
                      onClick={() => handleDecision(app.id, "rejected")}
                      className="h-9 rounded-lg bg-destructive-tint px-4 text-xs font-semibold text-destructive hover:bg-destructive/15 hover:text-destructive"
                    >
                      {app.status === "rejected" ? "Rejected" : "Reject"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}