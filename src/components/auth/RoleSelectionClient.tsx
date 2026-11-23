"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { selectUserRole, type SelectableRole } from "@/lib/actions/role";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RoleSelectionClientProps {
  userName?: string;
  userEmail?: string;
}

interface RoleOption {
  id: SelectableRole;
  title: string;
  badge: string;
  description: string;
  highlights: string[];
  icon: typeof GraduationCap;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "student",
    title: "Student",
    badge: "Learn & apply",
    description:
      "Browse approved tuitions, bookmark classes, track applications, and learn with verified mentors.",
    highlights: [
      "Search tuitions by subject, class level, and mode",
      "Bookmark up to 5 tuitions on Free (unlimited on Pro)",
      "Apply with preferred days & time slots and track status",
    ],
    icon: GraduationCap,
  },
  {
    id: "tutor",
    title: "Tutor",
    badge: "Teach & mentor",
    description:
      "Create tuition listings, manage student applications, and grow your mentorship batches.",
    highlights: [
      "Publish Online or Home tuition posts for review",
      "Review, approve, or reject incoming student applicants",
      "Upgrade to Pro Tutor for expanded teaching perks",
    ],
    icon: BookOpen,
  },
];

export function RoleSelectionClient({
  userName,
  userEmail,
}: RoleSelectionClientProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<SelectableRole | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleConfirmRole = async () => {
    if (!selectedRole) {
      showErrorToast("Please choose either Student or Tutor to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await selectUserRole({ role: selectedRole });
      if (res.error) {
        showErrorToast(res.msg || "Could not save your role.");
        return;
      }

      // Refresh BetterAuth session so user.role is updated
      await authClient.getSession({
        query: { disableCookieCache: true },
      });

      showSuccessToast(
        `Role set to ${selectedRole === "tutor" ? "Tutor" : "Student"}.`
      );
      router.push(`/dashboard/${selectedRole}`);
      router.refresh();
    } catch {
      showErrorToast("Something went wrong while saving your role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            m.
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            MentorLagbe
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={signingOut || submitting}
          onClick={handleSignOut}
          className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          <span>{signingOut ? "Signing out..." : "Sign out"}</span>
        </Button>
      </div>

      {/* Main Content */}
      <main className="mx-auto my-auto w-full max-w-4xl py-8">
        <div className="space-y-2 text-center">
          <Badge
            variant="secondary"
            className="mx-auto w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary"
          >
            One last step before your dashboard
          </Badge>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            How will you use MentorLagbe?
          </h1>

          <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
            {userName ? `Welcome, ${userName}. ` : ""}
            Select your account role to unlock your workspace. You cannot access
            the dashboard until a role is selected.
          </p>

          {userEmail && (
            <p className="text-xs text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{userEmail}</span>
            </p>
          )}
        </div>

        {/* Role Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedRole === option.id;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={submitting}
                onClick={() => setSelectedRole(option.id)}
                className={cn(
                  "group text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  submitting && "cursor-not-allowed opacity-70"
                )}
              >
                <Card
                  className={cn(
                    "h-full border bg-card transition-all duration-200",
                    isSelected
                      ? "border-primary ring-2 ring-primary/25 shadow-md"
                      : "border-border shadow-xs group-hover:-translate-y-0.5 group-hover:border-primary/45 group-hover:shadow-sm"
                  )}
                >
                  <CardContent className="flex h-full flex-col justify-between space-y-5 p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary"
                          >
                            {option.badge}
                          </Badge>
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background"
                            )}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h2 className="text-xl font-bold text-foreground">
                          {option.title}
                        </h2>
                        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {option.description}
                        </p>
                      </div>

                      <ul className="space-y-2 pt-1 text-xs text-muted-foreground">
                        {option.highlights.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Confirm CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            type="button"
            size="lg"
            disabled={!selectedRole || submitting}
            onClick={handleConfirmRole}
            className="h-11 min-w-56 rounded-xl px-6 text-sm font-semibold"
          >
            <span>
              {submitting
                ? "Saving your role..."
                : selectedRole
                ? `Continue as ${selectedRole === "tutor" ? "Tutor" : "Student"}`
                : "Select a role to continue"}
            </span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>
              Required once for new Google sign-ins. Admin access is assigned by
              administrators.
            </span>
          </p>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="mx-auto w-full max-w-4xl text-center text-xs text-muted-foreground">
        MentorLagbe · Role selection is required to enter your workspace
      </footer>
    </div>
  );
}