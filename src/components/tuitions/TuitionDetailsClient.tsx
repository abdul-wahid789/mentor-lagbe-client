"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Send,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  addTuitionBookmark,
  applyToTuition,
  getMyBookmarks,
  removeTuitionBookmark,
  type BookmarkRecord,
} from "@/lib/actions/application";
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
import type { TuitionPostItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { getTuitionById } from "@/lib/actions/tuition";

const FREE_BOOKMARK_LIMIT = 5;

const DAY_OPTIONS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] as const;

const TIME_SLOT_OPTIONS = [
  "Morning (8:00 AM – 10:00 AM)",
  "Late Morning (10:30 AM – 12:30 PM)",
  "Afternoon (2:30 PM – 4:30 PM)",
  "Evening (5:00 PM – 7:00 PM)",
  "Night (7:30 PM – 9:30 PM)",
] as const;

interface TuitionDetailsClientProps {
  tuitionId: string;
  backHref?: string;
  backLabel?: string;
}

export function TuitionDetailsClient({
  tuitionId,
  backHref = "/tuitions",
  backLabel = "Back to tuitions",
}: TuitionDetailsClientProps) {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [tuition, setTuition] = useState<TuitionPostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);

  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Sun",
    "Tue",
    "Thu",
  ]);
  const [preferredTime, setPreferredTime] = useState<string>(
    TIME_SLOT_OPTIONS[3]
  );
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const rawUser = session?.user as Record<string, unknown> | undefined;
  const userEmail =
    typeof rawUser?.email === "string" ? rawUser.email.toLowerCase() : "";
  const userRole =
    rawUser?.role === "tutor" || rawUser?.role === "admin"
      ? rawUser.role
      : rawUser?.role === "student"
      ? "student"
      : null;
  const userPlan = rawUser?.plan === "pro" ? "pro" : "free";

  const isStudent = userRole === "student";
  const isProStudent = isStudent && userPlan === "pro";

  const isBookmarked = bookmarks.some(
    (b) => String(b.tuitionId) === String(tuitionId)
  );
  const reachedFreeBookmarkLimit =
    isStudent &&
    !isProStudent &&
    !isBookmarked &&
    bookmarks.length >= FREE_BOOKMARK_LIMIT;

  useEffect(() => {
    let active = true;

    async function loadTuition() {
      setLoading(true);
      setNotFound(false);
      const res = await getTuitionById(tuitionId);
      if (!active) return;

      if (res.error || !res.data) {
        setNotFound(true);
        setTuition(null);
      } else {
        setTuition(res.data);
      }
      setLoading(false);
    }

    loadTuition();
    return () => {
      active = false;
    };
  }, [tuitionId]);

  useEffect(() => {
    if (!isStudent || sessionPending) return;
    let active = true;

    getMyBookmarks().then((res) => {
      if (!active) return;
      if (!res.error && Array.isArray(res.data)) {
        setBookmarks(res.data);
      }
    });

    return () => {
      active = false;
    };
  }, [isStudent, sessionPending]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const formattedSchedule =
    selectedDays.length > 0 && preferredTime
      ? `${selectedDays.join(", ")} · ${preferredTime}`
      : "";

  const handleToggleBookmark = async () => {
    if (!session?.user) {
      showErrorToast("Please sign in as a student to bookmark tuitions.");
      return;
    }
    if (!isStudent) {
      showErrorToast("Only students can bookmark tuitions.");
      return;
    }
    if (reachedFreeBookmarkLimit) {
      showErrorToast(
        `Free Students can bookmark up to ${FREE_BOOKMARK_LIMIT} tuitions. Upgrade to Pro for unlimited bookmarks.`
      );
      return;
    }

    setBookmarkBusy(true);
    try {
      if (isBookmarked) {
        const res = await removeTuitionBookmark(tuitionId);
        if (res.error) {
          showErrorToast(res.msg || "Could not remove bookmark.");
          return;
        }
        setBookmarks((prev) =>
          prev.filter((b) => String(b.tuitionId) !== String(tuitionId))
        );
        showSuccessToast("Removed from bookmarks.");
      } else {
        const res = await addTuitionBookmark({ tuitionId });
        if (res.error) {
          showErrorToast(res.msg || "Could not bookmark tuition.");
          return;
        }
        setBookmarks((prev) => [
          ...prev,
          {
            id: `bm-${Date.now()}`,
            tuitionId,
            studentEmail: userEmail,
          },
        ]);
        showSuccessToast("Tuition bookmarked.");
      }
    } finally {
      setBookmarkBusy(false);
    }
  };

  const handleOpenApplyModal = () => {
    if (!session?.user) {
      showErrorToast("Please sign in as a student to apply.");
      return;
    }
    if (!isStudent) {
      showErrorToast("Only student accounts can apply for tuitions.");
      return;
    }
    setFormError(null);
    setApplyOpen(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isStudent) {
      setFormError("Only students can submit tuition applications.");
      return;
    }

    if (selectedDays.length === 0) {
      setFormError("Please select at least one preferred day.");
      return;
    }

    if (!preferredTime.trim()) {
      setFormError("Please select a preferred time slot.");
      return;
    }

    if (!phone.trim()) {
      setFormError("Please enter your phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await applyToTuition({
        tuitionId,
        tutorEmail: tuition?.tutorEmail || "",
        studentEmail: userEmail,
        preferredSchedule: formattedSchedule,
        phone: phone.trim(),
        note: note.trim(),
      });

      if (res.error) {
        setFormError(res.msg || "Could not submit application.");
        showErrorToast(res.msg || "Could not submit application.");
        return;
      }

      setSubmitted(true);
      setApplyOpen(false);
      showSuccessToast("Application submitted! Status: pending.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-muted" />
        <div className="h-72 animate-pulse rounded-2xl border border-border bg-card" />
      </div>
    );
  }

  if (notFound || !tuition) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <Card className="border-border bg-card">
          <CardContent className="space-y-4 p-8 text-center">
            <h1 className="text-xl font-bold text-foreground">
              Tuition not found
            </h1>
            <p className="text-sm text-muted-foreground">
              This tuition post may have been removed or is no longer available.
            </p>
            <Button
              nativeButton={false}
              render={<Link href={backHref}>{backLabel}</Link>}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOnline = tuition.mode === "Online";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          render={
            <Link href={backHref}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              <span>{backLabel}</span>
            </Link>
          }
        />

        {isStudent && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isProStudent ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-secondary px-2.5 py-1 font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pro Student · Unlimited bookmarks</span>
              </span>
            ) : (
              <span className="rounded-full border border-border bg-card px-2.5 py-1 font-medium">
                Bookmarks: {bookmarks.length}/{FREE_BOOKMARK_LIMIT} used
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Tuition Details */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden border-border bg-card shadow-xs">
            {tuition.bannerUrl && (
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tuition.bannerUrl}
                  alt={tuition.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary"
                >
                  {tuition.subject}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-2.5 py-0.5 text-xs font-medium",
                    isOnline
                      ? "border-success/30 bg-success-tint text-success"
                      : "border-border bg-muted/60 text-muted-foreground"
                  )}
                >
                  {isOnline ? "Online" : "Home"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-md border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tuition.classLevel}
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {tuition.title}
                </h1>
                <p className="font-mono text-xl font-bold text-foreground tabular-nums">
                  ৳{Number(tuition.monthlyFee || 0).toLocaleString()}{" "}
                  <span className="font-sans text-xs font-normal text-muted-foreground">
                    / month
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 text-xs sm:grid-cols-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    Schedule:{" "}
                    <strong>{tuition.daysPerWeek || 3} days / week</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>
                    Location: <strong>{tuition.location || "Flexible"}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>
                    Level: <strong>{tuition.classLevel}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>
                    Mode: <strong>{isOnline ? "Online" : "Home"}</strong>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-bold text-foreground">
                  About this tuition
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {tuition.description ||
                    "Structured one-on-one and batch lessons tailored to the student's pace and syllabus."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tutor Info & Student Actions */}
        <div className="space-y-5">
          {/* Tutor Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Tutor details
                  </p>
                  <h2 className="truncate text-base font-bold text-foreground">
                    {tuition.tutorName || "Verified Tutor"}
                  </h2>
                </div>
              </div>

              {tuition.tutorEmail && (
                <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">{tuition.tutorEmail}</span>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Verified MentorLagbe tutor ·{" "}
                {isOnline
                  ? "Online interactive sessions"
                  : "In-person home tuition"}
              </p>
            </CardContent>
          </Card>

          {/* Apply & Bookmark Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="space-y-3.5 p-5">
              {submitted ? (
                <div className="space-y-3 rounded-xl border border-success/35 bg-success-tint p-4 text-xs text-success">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Application submitted (Pending)</span>
                  </div>
                  <p className="text-foreground/80">
                    Your application has been sent to{" "}
                    <strong>{tuition.tutorName || tuition.tutorEmail}</strong>.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setApplyOpen(true)}
                    className="w-full text-xs font-semibold"
                  >
                    Update or apply again
                  </Button>
                </div>
              ) : isStudent ? (
                <Button
                  type="button"
                  onClick={handleOpenApplyModal}
                  className="h-10 w-full text-xs font-semibold sm:text-sm"
                >
                  <Send className="mr-2 h-4 w-4" />
                  <span>Apply for Tuition</span>
                </Button>
              ) : !session?.user ? (
                <Button
                  size="sm"
                  nativeButton={false}
                  className="h-10 w-full text-xs font-semibold"
                  render={
                    <Link href={`/login?callbackUrl=/tuitions/${tuitionId}`}>
                      Sign in as Student to Apply
                    </Link>
                  }
                />
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>Only Student accounts can apply for tuitions.</span>
                </div>
              )}

              {isStudent && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={bookmarkBusy || reachedFreeBookmarkLimit}
                  onClick={handleToggleBookmark}
                  className={cn(
                    "h-10 w-full text-xs font-semibold",
                    isBookmarked &&
                      "border-primary/40 bg-secondary/70 text-primary"
                  )}
                >
                  <Bookmark
                    className={cn(
                      "mr-2 h-4 w-4",
                      isBookmarked && "fill-current text-primary"
                    )}
                  />
                  <span>
                    {bookmarkBusy
                      ? "Saving..."
                      : isBookmarked
                      ? "Bookmarked"
                      : reachedFreeBookmarkLimit
                      ? "Bookmark limit reached (5/5)"
                      : "Bookmark tuition"}
                  </span>
                </Button>
              )}

              {reachedFreeBookmarkLimit && (
                <div className="space-y-2 rounded-xl border border-warning/35 bg-warning-tint/70 p-3 text-xs">
                  <p className="font-semibold text-warning">
                    Free plan limit: {FREE_BOOKMARK_LIMIT} bookmarks max
                  </p>
                  <Button
                    size="sm"
                    nativeButton={false}
                    className="h-8 w-full text-xs font-semibold"
                    render={
                      <Link href="/payment/checkout?plan=pro-student">
                        Upgrade to Pro Student
                      </Link>
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply for Tuition Modal with Day & Time Selector */}
      {applyOpen && isStudent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
        >
          <Card className="w-full max-w-lg border-border bg-card shadow-lg">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2
                    id="apply-modal-title"
                    className="text-lg font-bold text-foreground"
                  >
                    Apply for Tuition
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {tuition.title} · ৳
                    {Number(tuition.monthlyFee || 0).toLocaleString()}/month
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyOpen(false)}
                  aria-label="Close application modal"
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/35 bg-destructive-tint p-3 text-xs font-medium text-destructive"
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Preferred days ({selectedDays.length} selected)
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {DAY_OPTIONS.map((day) => {
                      const active = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          aria-pressed={active}
                          className={cn(
                            "h-8 rounded-lg border px-3 text-xs font-semibold transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background/70 text-foreground hover:border-primary/40 hover:bg-secondary/60"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="apply-time-slot"
                    className="text-xs font-semibold text-foreground"
                  >
                    Preferred time slot
                  </Label>
                  <Select
                    value={preferredTime}
                    onValueChange={(val) => setPreferredTime(val ?? "")}
                  >
                    <SelectTrigger
                      id="apply-time-slot"
                      className="h-10 w-full bg-background/70"
                    >
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOT_OPTIONS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formattedSchedule && (
                    <p className="text-[11px] text-muted-foreground">
                      Selected schedule:{" "}
                      <span className="font-semibold text-foreground">
                        {formattedSchedule}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="apply-phone"
                    className="text-xs font-semibold text-foreground"
                  >
                    Phone number
                  </Label>
                  <Input
                    id="apply-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    required
                    className="h-10 bg-background/70"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="apply-note"
                    className="text-xs font-semibold text-foreground"
                  >
                    Message or learning goal (optional)
                  </Label>
                  <textarea
                    id="apply-note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Share your current class, topics you need help with, or questions..."
                    className="w-full rounded-xl border border-input bg-background/70 p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={submitting}
                    onClick={() => setApplyOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}