"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { createTuitionFeedback } from "@/lib/actions/feedback";
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
  DashboardUser,
  StudentApplicationItem,
  TuitionFeedbackItem,
} from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface StudentFeedbackClientProps {
  user: DashboardUser;
  approvedTuitions: StudentApplicationItem[];
  initialFeedbacksByTuition: Record<string, TuitionFeedbackItem[]>;
}

function formatDate(raw?: string): string {
  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function StudentFeedbackClient({
  user,
  approvedTuitions,
  initialFeedbacksByTuition,
}: StudentFeedbackClientProps) {
  const [selectedTuitionId, setSelectedTuitionId] = useState<string>(
    approvedTuitions[0]?.tuitionId ? String(approvedTuitions[0].tuitionId) : ""
  );
  const [feedbacksByTuition, setFeedbacksByTuition] = useState<
    Record<string, TuitionFeedbackItem[]>
  >(initialFeedbacksByTuition);

  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedTuition = useMemo(
    () =>
      approvedTuitions.find(
        (item) => String(item.tuitionId) === String(selectedTuitionId)
      ) || null,
    [approvedTuitions, selectedTuitionId]
  );

  const currentTuitionFeedbacks = useMemo(() => {
    if (!selectedTuitionId) return [];
    return feedbacksByTuition[selectedTuitionId] || [];
  }, [feedbacksByTuition, selectedTuitionId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTuitionId || !selectedTuition) {
      showErrorToast("Please select an approved tuition first.");
      return;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      showErrorToast("Please write your feedback comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createTuitionFeedback(selectedTuitionId, {
        rating,
        comment: trimmedComment,
      });

      if (res.error) {
        showErrorToast(res.msg || "Could not submit feedback.");
        return;
      }

      const created: TuitionFeedbackItem = res.data || {
        id: `feedback-${Date.now()}`,
        tuitionId: selectedTuitionId,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        rating,
        comment: trimmedComment,
        createdAt: new Date().toISOString(),
      };

      setFeedbacksByTuition((prev) => ({
        ...prev,
        [selectedTuitionId]: [created, ...(prev[selectedTuitionId] || [])],
      }));

      setComment("");
      setRating(5);
      showSuccessToast("Feedback submitted for your tuition.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Share your class feedback.
          </h1>
          <p className="text-sm text-muted-foreground">
            Leave reviews for tuitions where your application has been approved.
          </p>
        </div>

        <Badge
          variant="secondary"
          className="w-fit rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
        >
          Student
        </Badge>
      </div>

      {approvedTuitions.length === 0 ? (
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="space-y-3 p-10 text-center">
            <p className="text-sm font-semibold text-foreground">
              No approved tuitions available for feedback yet.
            </p>
            <p className="mx-auto max-w-md text-xs text-muted-foreground">
              You can submit feedback once a tutor approves your application.
              Check your current applications or browse available tuitions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button
                size="sm"
                nativeButton={false}
                className="h-9 rounded-lg px-4 text-xs font-semibold"
                render={
                  <Link href="/dashboard/student/applications">
                    View applications
                  </Link>
                }
              />
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                className="h-9 rounded-lg px-4 text-xs font-semibold"
                render={
                  <Link href="/dashboard/student/tuitions">
                    Browse tuitions
                  </Link>
                }
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Feedback Form */}
          <Card className="rounded-2xl border-border bg-card shadow-xs lg:col-span-6">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-foreground">
                Write feedback
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="feedback-tuition-select"
                    className="text-xs font-semibold text-foreground"
                  >
                    Approved tuition
                  </Label>
                  <Select
                    value={selectedTuitionId}
                    onValueChange={(val) => setSelectedTuitionId(val ?? "")}
                  >
                    <SelectTrigger
                      id="feedback-tuition-select"
                      className="h-10 w-full bg-background/70"
                    >
                      <SelectValue placeholder="Select an approved tuition" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvedTuitions.map((item, idx) => {
                        const value = item.tuitionId
                          ? String(item.tuitionId)
                          : `tuition-${idx}`;
                        return (
                          <SelectItem key={value} value={value}>
                            {item.tuitionTitle} — {item.tutorName || "Tutor"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTuition && (
                  <div className="rounded-xl border border-border/70 bg-muted/25 px-3.5 py-2.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {selectedTuition.tuitionTitle}
                    </span>{" "}
                    · Tutor: {selectedTuition.tutorName || "Tutor"} · ৳
                    {Number(selectedTuition.monthlyFee || 0).toLocaleString()}
                    /month
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Rating
                  </Label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const active = starValue <= (hoveredRating || rating);
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoveredRating(starValue)}
                          onMouseLeave={() => setHoveredRating(0)}
                          aria-label={`Rate ${starValue} out of 5`}
                          className="rounded-md p-1 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Star
                            className={cn(
                              "h-5 w-5 transition-colors",
                              active
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 font-mono text-xs font-medium text-muted-foreground">
                      {rating} / 5
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="student-feedback-comment"
                    className="text-xs font-semibold text-foreground"
                  >
                    Feedback note
                  </Label>
                  <textarea
                    id="student-feedback-comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How are the lessons, pacing, and guidance going?"
                    className="w-full rounded-xl border border-input bg-background/70 p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !selectedTuitionId}
                  className="h-10 rounded-lg px-5 text-xs font-semibold sm:text-sm"
                >
                  {submitting ? "Submitting..." : "Submit feedback"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right: Feedbacks for Selected Tuition */}
          <Card className="rounded-2xl border-border bg-card shadow-xs lg:col-span-6">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  Tuition feedback history
                </h2>
                <span className="font-mono text-xs text-muted-foreground">
                  {currentTuitionFeedbacks.length}{" "}
                  {currentTuitionFeedbacks.length === 1 ? "entry" : "entries"}
                </span>
              </div>

              {currentTuitionFeedbacks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background/60 p-8 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    No feedback posted for this tuition yet.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use the form on the left to share your first review.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentTuitionFeedbacks.map((fb, idx) => (
                    <div
                      key={fb.id || fb._id || `fb-${idx}`}
                      className="space-y-2 rounded-xl border border-border/70 bg-muted/25 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            {fb.studentName || user.name}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  n <= Number(fb.rating || 0)
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground/35"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(fb.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-foreground/90 sm:text-sm">
                        {fb.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}