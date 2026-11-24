"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  updateTuitionApproval,
  type AdminUserRecord,
} from "@/lib/actions/admin";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  DashboardUser,
  PaymentTransactionRecord,
  TuitionPostItem,
} from "@/types/dashboard";
import { cn } from "@/lib/utils";

export interface AdminOverviewProps {
  user: DashboardUser;
  users: AdminUserRecord[];
  tuitions: TuitionPostItem[];
  transactions: PaymentTransactionRecord[];
}

interface MonthlyRevenuePoint {
  key: string;
  label: string;
  amount: number;
  isCurrent: boolean;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function toValidDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function parsePaymentDate(tx: PaymentTransactionRecord): Date | null {
  const record = tx as PaymentTransactionRecord & {
    createdAt?: unknown;
    paidAt?: unknown;
  };
  return toValidDate(record?.createdAt) ?? toValidDate(record?.paidAt) ?? null;
}

function formatSubmittedDate(raw?: unknown): string {
  if (!raw) return "";
  const parsed = toValidDate(raw);
  if (!parsed) return typeof raw === "string" ? raw : "";
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AdminOverview({
  user,
  users,
  tuitions: initialTuitions,
  transactions,
}: AdminOverviewProps) {
  const [tuitions, setTuitions] = useState<TuitionPostItem[]>(
    Array.isArray(initialTuitions) ? initialTuitions : []
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const firstName = user.name.trim().split(/\s+/)[0] || "Admin";

  const userStats = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    let students = 0;
    let tutors = 0;
    let admins = 0;

    list.forEach((u) => {
      if (u?.role === "tutor") tutors += 1;
      else if (u?.role === "admin") admins += 1;
      else students += 1;
    });

    return {
      total: list.length,
      students,
      tutors,
      admins,
    };
  }, [users]);

  const tuitionStats = useMemo(() => {
    const list = Array.isArray(tuitions) ? tuitions : [];
    const pendingList = list.filter(
      (t) => (t?.approvalStatus || "pending") === "pending"
    );
    const approvedCount = list.filter(
      (t) => t?.approvalStatus === "approved"
    ).length;

    return {
      pendingList,
      pendingCount: pendingList.length,
      approvedCount,
    };
  }, [tuitions]);

  const revenueStats = useMemo(() => {
    const txList = Array.isArray(transactions) ? transactions : [];
    const paidTransactions = txList.filter(
      (tx) => !tx?.status || tx.status === "paid"
    );

    const totalRevenue = paidTransactions.reduce(
      (sum, tx) => sum + Number(tx?.amount || 0),
      0
    );

    const now = new Date();
    const buckets: MonthlyRevenuePoint[] = [];

    for (let offset = 5; offset >= 0; offset -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets.push({
        key,
        label: MONTH_NAMES[d.getMonth()],
        amount: 0,
        isCurrent: offset === 0,
      });
    }

    paidTransactions.forEach((tx) => {
      const dt = parsePaymentDate(tx);
      if (!dt) return;
      const key = `${dt.getFullYear()}-${dt.getMonth()}`;
      const match = buckets.find((b) => b.key === key);
      if (match) {
        match.amount += Number(tx?.amount || 0);
      }
    });

    const maxAmount = Math.max(1, ...buckets.map((b) => b.amount));

    return {
      totalRevenue,
      subscriptionCount: paidTransactions.length,
      buckets,
      maxAmount,
    };
  }, [transactions]);

  const handleApprovalDecision = async (
    tuitionId: string,
    nextStatus: "approved" | "rejected"
  ) => {
    setUpdatingId(tuitionId);
    try {
      const res = await updateTuitionApproval(tuitionId, {
        approvalStatus: nextStatus,
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
              }
            : item
        )
      );

      showSuccessToast(
        nextStatus === "approved"
          ? "Tuition approved and published."
          : "Tuition rejected."
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
          A healthy learning community.
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {firstName}. Here&apos;s what needs your attention.
        </p>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="flex h-full flex-col justify-between space-y-3 p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Total users
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
              {userStats.total.toLocaleString()}
            </p>
            <p className="text-xs leading-relaxed text-primary">
              {userStats.students.toLocaleString()} Students ·{" "}
              {userStats.tutors.toLocaleString()} Tutors ·{" "}
              {userStats.admins.toLocaleString()} Admins
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="flex h-full flex-col justify-between space-y-3 p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Total tutors
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
              {userStats.tutors.toLocaleString()}
            </p>
            <p className="text-xs leading-relaxed text-primary">
              In the teaching community
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="flex h-full flex-col justify-between space-y-3 p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Pending / approved
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
              {tuitionStats.pendingCount} / {tuitionStats.approvedCount}
            </p>
            <Link
              href="/dashboard/admin/tuitions"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              <span>Review the queue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="flex h-full flex-col justify-between space-y-3 p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Stripe revenue
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
              ${revenueStats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs leading-relaxed text-primary">
              Lifetime membership revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Membership Revenue Chart Card */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-foreground">
              Membership revenue
            </h2>
            <Badge
              variant="secondary"
              className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
            >
              Last 6 months
            </Badge>
          </div>

          <div className="grid grid-cols-6 items-end gap-3 pt-2 sm:gap-4">
            {revenueStats.buckets.map((bucket) => {
              const heightPercent =
                bucket.amount > 0
                  ? Math.max(
                      24,
                      Math.round((bucket.amount / revenueStats.maxAmount) * 100)
                    )
                  : 18;

              return (
                <div
                  key={bucket.key}
                  className="flex flex-col items-start gap-2"
                >
                  <span className="font-mono text-xs font-medium text-muted-foreground tabular-nums">
                    ${bucket.amount.toLocaleString()}
                  </span>

                  <div className="flex h-36 w-full items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={cn(
                        "w-full rounded-lg transition-all duration-300",
                        bucket.isCurrent
                          ? "bg-primary"
                          : "bg-primary/25 hover:bg-primary/40"
                      )}
                    />
                  </div>

                  <span className="text-xs font-medium text-muted-foreground">
                    {bucket.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            Total ${revenueStats.totalRevenue.toLocaleString()} ·{" "}
            {revenueStats.subscriptionCount.toLocaleString()} Pro{" "}
            {revenueStats.subscriptionCount === 1
              ? "subscription"
              : "subscriptions"}{" "}
            · USD
          </p>
        </CardContent>
      </Card>

      {/* Tuition Approval Queue Card */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-foreground">
              Tuition approval queue
            </h2>
            {tuitionStats.pendingCount > 0 && (
              <Link
                href="/dashboard/admin/tuitions"
                className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
              >
                View all ({tuitionStats.pendingCount})
              </Link>
            )}
          </div>

          {tuitionStats.pendingList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/60 p-8 text-center">
              <p className="text-sm font-semibold text-foreground">
                No pending tuitions in the queue.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                New tuition submissions from tutors will appear here for
                approval.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tuitionStats.pendingList.slice(0, 5).map((item, idx) => {
                const id = item._id ? String(item._id) : `pending-${idx}`;
                const isBusy = updatingId === id;
                const modeLabel = item.mode === "Home" ? "Offline" : "Online";
                const submittedDate = formatSubmittedDate(
                  (item as TuitionPostItem & { createdAt?: unknown }).createdAt
                );

                return (
                  <div
                    key={id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-border/80 bg-muted/25 p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-foreground">
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
                      <div className="pt-1">
                        <Badge
                          variant="outline"
                          className="rounded-md border-warning/40 bg-warning-tint px-2.5 py-0.5 text-xs font-semibold text-warning"
                        >
                          Pending
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-stretch">
                      <Button
                        type="button"
                        size="sm"
                        disabled={isBusy || !item._id}
                        onClick={() => handleApprovalDecision(id, "approved")}
                        className="h-9 rounded-lg px-4 text-xs font-semibold"
                      >
                        {isBusy ? "Updating..." : "Approve"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isBusy || !item._id}
                        onClick={() => handleApprovalDecision(id, "rejected")}
                        className="h-9 rounded-lg bg-destructive-tint px-4 text-xs font-semibold text-destructive hover:bg-destructive/15 hover:text-destructive"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}