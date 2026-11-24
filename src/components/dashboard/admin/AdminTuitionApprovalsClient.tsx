"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, Search } from "lucide-react";
import { updateTuitionApproval } from "@/lib/actions/admin";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApprovalStatus, TuitionPostItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface AdminTuitionApprovalsClientProps {
  initialTuitions: TuitionPostItem[];
}

function getApprovalBadgeStyle(status: ApprovalStatus): string {
  if (status === "approved") {
    return "border-success/35 bg-success-tint text-success";
  }
  if (status === "rejected") {
    return "border-destructive/35 bg-destructive-tint text-destructive";
  }
  return "border-warning/40 bg-warning-tint text-warning";
}

function formatApprovalLabel(status: ApprovalStatus): string {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function formatSubmittedDate(raw?: unknown): string {
  if (!raw) return "";
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  if (typeof raw === "string" || typeof raw === "number") {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    return typeof raw === "string" ? raw : "";
  }
  return "";
}

export function AdminTuitionApprovalsClient({
  initialTuitions,
}: AdminTuitionApprovalsClientProps) {
  const [tuitions, setTuitions] = useState<TuitionPostItem[]>(
    Array.isArray(initialTuitions) ? initialTuitions : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [rejectionNote, setRejectionNote] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<TuitionPostItem | null>(
    null
  );

  const noteTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    tuitions.forEach((t) => {
      const status = t?.approvalStatus || "pending";
      if (status === "approved") approved += 1;
      else if (status === "rejected") rejected += 1;
      else pending += 1;
    });

    return {
      all: tuitions.length,
      pending,
      approved,
      rejected,
    };
  }, [tuitions]);

  const filteredTuitions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tuitions.filter((item) => {
      const status = item?.approvalStatus || "pending";
      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      const matchesQuery =
        !q ||
        (item.title || "").toLowerCase().includes(q) ||
        (item.tutorName || "").toLowerCase().includes(q) ||
        (item.tutorEmail || "").toLowerCase().includes(q) ||
        (item.subject || "").toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [tuitions, searchQuery, statusFilter]);

  const openRejectDialog = (item: TuitionPostItem) => {
    setRejectTarget(item);
    setRejectionNote(item.rejectionNote || "");
    setNoteError(null);
  };

  const closeRejectDialog = () => {
    if (updatingId) return;
    setRejectTarget(null);
    setRejectionNote("");
    setNoteError(null);
  };

  const handleDecision = async (
    tuitionId: string,
    nextStatus: "approved" | "rejected",
    noteText?: string
  ) => {
    if (!tuitionId) return;

    const trimmedNote = (noteText ?? rejectionNote).trim();

    if (nextStatus === "rejected" && !trimmedNote) {
      setNoteError(
        "Please write a rejection note explaining what the tutor should update."
      );
      showErrorToast("Rejection note is required before rejecting.");
      noteTextareaRef.current?.focus();
      return;
    }

    setNoteError(null);
    setUpdatingId(tuitionId);

    try {
      const res = await updateTuitionApproval(tuitionId, {
        approvalStatus: nextStatus,
        ...(nextStatus === "rejected" ? { rejectionNote: trimmedNote } : {}),
      });

      if (res.error) {
        showErrorToast(res.msg || "Could not update tuition approval.");
        return;
      }

      setTuitions((prev) =>
        prev.map((item) =>
          String(item._id) === String(tuitionId)
            ? {
                ...item,
                approvalStatus: nextStatus,
                isActive: nextStatus === "approved",
                ...(nextStatus === "rejected"
                  ? { rejectionNote: trimmedNote }
                  : {}),
              }
            : item
        )
      );

      if (nextStatus === "rejected") {
        setRejectionNote("");
        setRejectTarget(null);
      }

      showSuccessToast(
        nextStatus === "approved"
          ? "Tuition approved and published."
          : "Tuition rejected with feedback note."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Quality starts with a careful review.
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve trusted tuitions before they go live.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="admin-tuition-search"
            className="text-xs font-semibold text-foreground"
          >
            Search tuitions
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-tuition-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Title or tutor..."
              className="h-10 bg-card pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="admin-tuition-status"
            className="text-xs font-semibold text-foreground"
          >
            Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val ?? "pending")}
          >
            <SelectTrigger
              id="admin-tuition-status"
              className="h-10 w-full bg-card"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">
                Pending ({counts.pending})
              </SelectItem>
              <SelectItem value="approved">
                Approved ({counts.approved})
              </SelectItem>
              <SelectItem value="rejected">
                Rejected ({counts.rejected})
              </SelectItem>
              <SelectItem value="all">All ({counts.all})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tuition Approval Queue Card */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground">
            Tuition approval queue
          </h2>

          {filteredTuitions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/60 p-10 text-center">
              <p className="text-sm font-semibold text-foreground">
                No tuitions in this view.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Switch the status filter or clear your search to view other
                submissions.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredTuitions.map((item, idx) => {
                const rawId = item._id ? String(item._id) : "";
                const key = rawId || `tuition-approval-${idx}`;
                const isBusy = updatingId === rawId;
                const status: ApprovalStatus =
                  item.approvalStatus || "pending";
                const modeLabel = item.mode === "Home" ? "Offline" : "Online";
                const submittedDate = formatSubmittedDate(item.createdAt);
                const existingNote = item.rejectionNote;

                return (
                  <div
                    key={key}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-border/80 bg-muted/25 p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      {/* Responsive Banner Thumbnail */}
                      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg border border-border/70 bg-secondary/50 sm:h-20 sm:w-28 md:w-32">
                        {item.bannerUrl ? (
                          <Image
                            src={item.bannerUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 128px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary/15 via-secondary/70 to-primary/5 px-2 text-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="max-w-full truncate text-[10px] font-semibold text-primary/90 sm:hidden">
                              {item.subject}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <h3 className="truncate text-base font-bold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.tutorName || "Tutor"}
                          {submittedDate ? ` · Submitted ${submittedDate}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.subject} · {item.classLevel} · {modeLabel} · ৳
                          {Number(item.monthlyFee || 0).toLocaleString()}/month
                        </p>

                        {existingNote && status === "rejected" && (
                          <p className="text-xs text-destructive">
                            Note: {existingNote}
                          </p>
                        )}

                        <div className="pt-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                              getApprovalBadgeStyle(status)
                            )}
                          >
                            {formatApprovalLabel(status)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-stretch">
                      <Button
                        type="button"
                        size="sm"
                        disabled={isBusy || !rawId || status === "approved"}
                        onClick={() => handleDecision(rawId, "approved")}
                        className="h-9 rounded-lg px-4 text-xs font-semibold"
                      >
                        {isBusy
                          ? "Updating..."
                          : status === "approved"
                          ? "Approved"
                          : "Approve"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isBusy || !rawId || status === "rejected"}
                        onClick={() => openRejectDialog(item)}
                        className="h-9 rounded-lg bg-destructive-tint px-4 text-xs font-semibold text-destructive hover:bg-destructive/15 hover:text-destructive"
                      >
                        {status === "rejected" ? "Rejected" : "Reject"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Card Footer Note */}
          <p className="text-xs text-muted-foreground">
            Only approved and active tuitions appear publicly.
          </p>
        </CardContent>
      </Card>

      {/* Rejection Note Dialog */}
      <Dialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) closeRejectDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject tuition submission</DialogTitle>
            <DialogDescription>
              {rejectTarget ? (
                <>
                  Provide a clear reason for rejecting{" "}
                  <span className="font-semibold text-foreground">
                    {rejectTarget.title}
                  </span>{" "}
                  by {rejectTarget.tutorName || "Tutor"}.
                </>
              ) : (
                "Explain what the tutor should update before resubmitting."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label
              htmlFor="admin-rejection-note"
              className="text-xs font-semibold text-foreground"
            >
              Rejection note
            </Label>
            <textarea
              ref={noteTextareaRef}
              id="admin-rejection-note"
              rows={4}
              value={rejectionNote}
              disabled={Boolean(updatingId)}
              onChange={(e) => {
                setRejectionNote(e.target.value);
                if (noteError && e.target.value.trim()) {
                  setNoteError(null);
                }
              }}
              placeholder="Explain what the tutor should update..."
              aria-invalid={Boolean(noteError)}
              className={cn(
                "w-full rounded-xl border bg-background/70 p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                noteError ? "border-destructive" : "border-input"
              )}
            />
            {noteError && (
              <p className="text-xs font-medium text-destructive">
                {noteError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={Boolean(updatingId)}
              onClick={closeRejectDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={Boolean(updatingId) || !rejectTarget?._id}
              onClick={() => {
                if (rejectTarget?._id) {
                  handleDecision(
                    String(rejectTarget._id),
                    "rejected",
                    rejectionNote
                  );
                }
              }}
            >
              {updatingId ? "Rejecting..." : "Confirm rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}