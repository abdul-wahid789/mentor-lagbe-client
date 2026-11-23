"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { createTuitionFeedback } from "@/lib/actions/feedback";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { DashboardUser, TuitionFeedbackItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface TuitionFeedbackSectionProps {
  tuitionId: string;
  initialFeedbacks: TuitionFeedbackItem[];
  currentUser?: DashboardUser | null;
}

function formatFeedbackDate(raw?: string): string {
  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TuitionFeedbackSection({
  tuitionId,
  initialFeedbacks,
  currentUser,
}: TuitionFeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<TuitionFeedbackItem[]>(
    Array.isArray(initialFeedbacks) ? initialFeedbacks : []
  );
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const summary = useMemo(() => {
    if (feedbacks.length === 0) {
      return { average: 0, count: 0 };
    }
    const total = feedbacks.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    return {
      average: Number((total / feedbacks.length).toFixed(1)),
      count: feedbacks.length,
    };
  }, [feedbacks]);

  const canSubmitFeedback =
    Boolean(currentUser) && currentUser?.role === "student";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmitFeedback) {
      showErrorToast("Sign in with a student account to leave feedback.");
      return;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      showErrorToast("Please write your feedback before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createTuitionFeedback(tuitionId, {
        rating,
        comment: trimmedComment,
      });

      if (res.error) {
        showErrorToast(res.msg || "Could not submit feedback.");
        return;
      }

      const created: TuitionFeedbackItem = res.data || {
        id: `local-${Date.now()}`,
        tuitionId,
        studentName: currentUser?.name || "Student",
        studentEmail: currentUser?.email,
        rating,
        comment: trimmedComment,
        createdAt: new Date().toISOString(),
      };

      setFeedbacks((prev) => [created, ...prev]);
      setComment("");
      setRating(5);
      showSuccessToast("Feedback posted.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl border-border bg-card shadow-xs">
      <CardContent className="space-y-6 p-5 sm:p-6">
        {/* Header & Average Score */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Student feedback
            </h2>
            <p className="text-xs text-muted-foreground">
              Honest experiences from learners in this tuition.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3.5 py-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-mono text-sm font-bold text-foreground tabular-nums">
              {summary.count > 0 ? summary.average.toFixed(1) : "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              ({summary.count} {summary.count === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {/* Submission Form */}
        {canSubmitFeedback ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Your rating
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
                      aria-label={`Rate ${starValue} out of 5 stars`}
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
                htmlFor="tuition-feedback-comment"
                className="text-xs font-semibold text-foreground"
              >
                Your review
              </Label>
              <textarea
                id="tuition-feedback-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share how the tutor teaches, explains concepts, and keeps sessions structured..."
                className="w-full rounded-xl border border-input bg-background/80 p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
                className="h-9 rounded-lg px-4 text-xs font-semibold"
              >
                {submitting ? "Posting..." : "Post feedback"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-background/60 p-4 text-xs text-muted-foreground">
            Only signed-in students can submit feedback for a tuition.
          </p>
        )}

        {/* Feedback List */}
        {feedbacks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background/60 p-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              No feedback yet.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Be the first student to share how this class helped you.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((item, idx) => (
              <div
                key={item.id || item._id || `feedback-${idx}`}
                className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {item.studentName || "Student"}
                    </p>
                    <div
                      className="flex items-center gap-0.5"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={cn(
                            "h-3.5 w-3.5",
                            n <= Number(item.rating || 0)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/35"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {formatFeedbackDate(item.createdAt)}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-foreground/90 sm:text-sm">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}