"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { deleteApplication } from "@/lib/actions/application";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "@/types/dashboard";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

interface StudentApplicationsClientProps {
  initialApplications: StudentApplicationItem[];
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
  if (status === "accepted") return "Accepted";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

export function StudentApplicationsClient({
  initialApplications,
}: StudentApplicationsClientProps) {
  const [applications, setApplications] =
    useState<StudentApplicationItem[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredApplications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return applications.filter((app) => {
      const matchesQuery =
        !q ||
        app.tuitionTitle.toLowerCase().includes(q) ||
        app.tutorName.toLowerCase().includes(q) ||
        app.tutorEmail.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleApplications = filteredApplications.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleDelete = async (applicationId: string) => {
    setDeletingId(applicationId);
    try {
      const res = await deleteApplication(applicationId);
      if (res.error) {
        showErrorToast(res.msg || "Could not remove application.");
        return;
      }

      setApplications((prev) => prev.filter((item) => item.id !== applicationId));
      showSuccessToast("Application removed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your learning, in motion.
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your applications and keep every next step in view.
          </p>
        </div>

        <Badge
          variant="secondary"
          className="w-fit rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
        >
          Student
        </Badge>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="student-app-search"
            className="text-xs font-semibold text-foreground"
          >
            Find an application
          </Label>
          <Input
            id="student-app-search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search tuition title..."
            className="h-10 bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="student-app-status"
            className="text-xs font-semibold text-foreground"
          >
            Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger
              id="student-app-status"
              className="h-10 w-full bg-card"
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications Container */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground">
            All applications
          </h2>

          {filteredApplications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/60 p-10 text-center">
              <p className="text-sm font-semibold text-foreground">
                No applications found.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Browse approved tuitions to apply for a class.
              </p>
              <Button
                size="sm"
                nativeButton={false}
                className="mt-4 h-9 rounded-lg px-4 text-xs font-semibold"
                render={
                  <Link href="/dashboard/student/tuitions">
                    Browse tuitions
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View (lg+) */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                      <th className="rounded-tl-lg px-4 py-3">
                        Tuition &amp; tutor
                      </th>
                      <th className="px-4 py-3">Monthly fee</th>
                      <th className="px-4 py-3">Applied on</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="rounded-tr-lg px-4 py-3 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visibleApplications.map((app) => {
                      const isBusy = deletingId === app.id;
                      const isPending = app.status === "pending";
                      const tuitionHref = app.tuitionId
                        ? `/dashboard/student/tuitions/${encodeURIComponent(
                            String(app.tuitionId)
                          )}`
                        : "/dashboard/student/tuitions";

                      return (
                        <tr
                          key={app.id}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <td className="px-4 py-4 align-middle">
                            <p className="text-sm font-bold text-foreground">
                              {app.tuitionTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {app.tutorName || "Tutor"}
                            </p>
                            {app.tutorEmail && (
                              <p className="text-xs text-muted-foreground">
                                {app.tutorEmail}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4 align-middle font-mono text-sm font-medium text-foreground tabular-nums">
                            ৳{Number(app.monthlyFee || 0).toLocaleString()}
                          </td>

                          <td className="px-4 py-4 align-middle text-xs text-muted-foreground">
                            {app.appliedAt || "—"}
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                                getStatusBadgeStyle(app.status)
                              )}
                            >
                              {formatStatusLabel(app.status)}
                            </Badge>
                          </td>

                          <td className="px-4 py-4 text-right align-middle">
                            {isPending ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => handleDelete(app.id)}
                                className="h-9 rounded-lg border-border bg-card px-4 text-xs font-semibold text-primary hover:bg-secondary/60"
                              >
                                {isBusy ? "Removing..." : "Cancel / Delete"}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                nativeButton={false}
                                className="h-9 rounded-lg border-border bg-card px-4 text-xs font-semibold text-primary hover:bg-secondary/60"
                                render={<Link href={tuitionHref}>View</Link>}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tablet & Mobile Card View (<lg) */}
              <div className="space-y-4 lg:hidden">
                {visibleApplications.map((app) => {
                  const isBusy = deletingId === app.id;
                  const isPending = app.status === "pending";
                  const tuitionHref = app.tuitionId
                    ? `/dashboard/student/tuitions/${encodeURIComponent(
                        String(app.tuitionId)
                      )}`
                    : "/dashboard/student/tuitions";

                  return (
                    <div
                      key={app.id}
                      className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-foreground">
                          {app.tuitionTitle}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {app.tutorName || "Tutor"}
                        </p>
                        {app.tutorEmail && (
                          <p className="text-xs text-muted-foreground">
                            {app.tutorEmail}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
                          ৳{Number(app.monthlyFee || 0).toLocaleString()}
                        </span>
                        <span>{app.appliedAt || "—"}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                            getStatusBadgeStyle(app.status)
                          )}
                        >
                          {formatStatusLabel(app.status)}
                        </Badge>

                        <div className="flex items-center gap-2">
                          {isPending ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => handleDelete(app.id)}
                                className="h-8 rounded-lg border-border bg-card px-3 text-xs font-semibold text-primary hover:bg-secondary/60"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => handleDelete(app.id)}
                                className="h-8 rounded-lg bg-destructive-tint px-3 text-xs font-semibold text-destructive hover:bg-destructive/15 hover:text-destructive"
                              >
                                {isBusy ? "..." : "Delete"}
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              nativeButton={false}
                              className="h-8 rounded-lg border-border bg-card px-3.5 text-xs font-semibold text-primary hover:bg-secondary/60"
                              render={<Link href={tuitionHref}>View</Link>}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <p className="font-medium text-primary">
                  Showing {visibleApplications.length} of{" "}
                  {filteredApplications.length}{" "}
                  {filteredApplications.length === 1
                    ? "application"
                    : "applications"}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="font-medium text-primary transition-colors hover:underline disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}