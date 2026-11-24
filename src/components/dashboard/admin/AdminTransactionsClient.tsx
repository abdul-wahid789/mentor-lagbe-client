"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
import type { PaymentTransactionRecord } from "@/types/dashboard";

const PAGE_SIZE = 5;

type DateRangeFilter = "all" | "this-month" | "last-7-days" | "last-30-days";

interface AdminTransactionsClientProps {
  initialTransactions: PaymentTransactionRecord[];
}

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

function getTransactionDate(tx: PaymentTransactionRecord): Date | null {
  const record = tx as PaymentTransactionRecord & {
    createdAt?: unknown;
    paidAt?: unknown;
  };
  return toValidDate(record?.createdAt) ?? toValidDate(record?.paidAt) ?? null;
}

function formatTransactionDate(tx: PaymentTransactionRecord): string {
  const dt = getTransactionDate(tx);
  if (dt) {
    return dt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return typeof tx.paidAt === "string" && tx.paidAt.trim() ? tx.paidAt : "—";
}

function formatRoleLabel(role: string): string {
  const normalized = role.toLowerCase();
  if (normalized === "tutor") return "Tutor";
  if (normalized === "admin") return "Admin";
  return "Student";
}

function formatPlanLabel(tx: PaymentTransactionRecord): string {
  if (tx.planName && tx.planName.trim()) {
    return tx.planName;
  }
  if (tx.plan === "pro-tutor" || String(tx.role).toLowerCase() === "tutor") {
    return "Pro Tutor";
  }
  return "Pro Student";
}

export function AdminTransactionsClient({
  initialTransactions,
}: AdminTransactionsClientProps) {
  const [transactions] = useState<PaymentTransactionRecord[]>(
    Array.isArray(initialTransactions) ? initialTransactions : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("all");
  const [page, setPage] = useState(1);

  const paidTransactions = useMemo(() => {
    return transactions.filter((tx) => !tx?.status || tx.status === "paid");
  }, [transactions]);

  const summary = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthLabel = now.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    let totalRevenue = 0;
    let tutorCount = 0;
    let tutorRevenue = 0;
    let studentCount = 0;
    let studentRevenue = 0;
    let thisMonthRevenue = 0;

    paidTransactions.forEach((tx) => {
      const amount = Number(tx?.amount || 0);
      totalRevenue += amount;

      const roleNormalized = String(tx?.role || "").toLowerCase();
      const planNormalized = String(tx?.plan || "").toLowerCase();
      const isTutor =
        roleNormalized === "tutor" || planNormalized === "pro-tutor";

      if (isTutor) {
        tutorCount += 1;
        tutorRevenue += amount;
      } else {
        studentCount += 1;
        studentRevenue += amount;
      }

      const dt = getTransactionDate(tx);
      if (
        dt &&
        dt.getFullYear() === currentYear &&
        dt.getMonth() === currentMonth
      ) {
        thisMonthRevenue += amount;
      }
    });

    return {
      totalRevenue,
      tutorCount,
      tutorRevenue,
      studentCount,
      studentRevenue,
      thisMonthRevenue,
      monthLabel,
    };
  }, [paidTransactions]);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return paidTransactions.filter((tx) => {
      const matchesQuery =
        !q ||
        (tx.userName || "").toLowerCase().includes(q) ||
        (tx.userEmail || "").toLowerCase().includes(q) ||
        (tx.transactionId || "").toLowerCase().includes(q) ||
        (tx.planName || "").toLowerCase().includes(q);

      if (!matchesQuery) return false;

      if (dateRange === "all") return true;

      const dt = getTransactionDate(tx);
      if (!dt) return false;

      if (dateRange === "this-month") return dt >= startOfMonth;
      if (dateRange === "last-7-days") return dt >= sevenDaysAgo;
      if (dateRange === "last-30-days") return dt >= thirtyDaysAgo;

      return true;
    });
  }, [paidTransactions, searchQuery, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const isFiltered = searchQuery.trim().length > 0 || dateRange !== "all";
  const showingStart = filteredTransactions.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(
    startIndex + visibleTransactions.length,
    filteredTransactions.length
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Every payment, accounted for.
        </h1>
        <p className="text-sm text-muted-foreground">
          A clear record of Stripe membership transactions.
        </p>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="flex h-full flex-col justify-between space-y-3 p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Total revenue
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
              ${summary.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-primary">USD · Lifetime</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="flex h-full flex-col justify-between space-y-3 p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Tutor subscriptions
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
              {summary.tutorCount.toLocaleString()}
            </p>
            <p className="text-xs text-primary tabular-nums">
              ${summary.tutorRevenue.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="flex h-full flex-col justify-between space-y-3 p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Student subscriptions
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
              {summary.studentCount.toLocaleString()}
            </p>
            <p className="text-xs text-primary tabular-nums">
              ${summary.studentRevenue.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardContent className="flex h-full flex-col justify-between space-y-3 p-5">
            <p className="text-xs font-medium text-muted-foreground">
              This month
            </p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
              ${summary.thisMonthRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-primary">{summary.monthLabel}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="admin-tx-search"
            className="text-xs font-semibold text-foreground"
          >
            Find a payment
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-tx-search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Name, email, transaction ID..."
              className="h-10 bg-card pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="admin-tx-date-range"
            className="text-xs font-semibold text-foreground"
          >
            Date range
          </Label>
          <Select
            value={dateRange}
            onValueChange={(val) => {
              setDateRange((val as DateRangeFilter) ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger
              id="admin-tx-date-range"
              className="h-10 w-full bg-card"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Membership Payments Card */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground">
            Membership payments
          </h2>

          {filteredTransactions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/60 p-10 text-center">
              <p className="text-sm font-semibold text-foreground">
                No membership payments found.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try clearing your search query or changing the date range.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop & Tablet Table View (sm+) */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                      <th className="rounded-tl-lg px-4 py-3">User / Email</th>
                      <th className="px-4 py-3">Role / Plan</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Transaction ID</th>
                      <th className="rounded-tr-lg px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visibleTransactions.map((tx, idx) => {
                      const key =
                        tx.id || tx._id || tx.transactionId || `tx-${idx}`;
                      const currency = (tx.currency || "USD").toUpperCase();

                      return (
                        <tr
                          key={key}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <td className="px-4 py-4 align-middle">
                            <p className="text-sm font-bold text-foreground">
                              {tx.userName || "Member"}
                            </p>
                            <p className="text-xs text-muted-foreground break-all">
                              {tx.userEmail}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <p className="text-xs font-medium text-muted-foreground">
                              {formatRoleLabel(String(tx.role || "student"))}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground">
                              {formatPlanLabel(tx)}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-middle font-mono text-sm font-bold text-foreground tabular-nums whitespace-nowrap">
                            ${Number(tx.amount || 0).toLocaleString()}{" "}
                            {currency}
                          </td>

                          <td className="px-4 py-4 align-middle font-mono text-xs text-muted-foreground break-all">
                            {tx.transactionId || "—"}
                          </td>

                          <td className="px-4 py-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                            {formatTransactionDate(tx)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (<sm) */}
              <div className="space-y-4 sm:hidden">
                {visibleTransactions.map((tx, idx) => {
                  const key =
                    tx.id || tx._id || tx.transactionId || `tx-mobile-${idx}`;
                  const currency = (tx.currency || "USD").toUpperCase();

                  return (
                    <div
                      key={key}
                      className="space-y-2.5 rounded-xl border border-border/70 bg-muted/25 p-4"
                    >
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-foreground">
                          {tx.userName || "Member"}
                        </h3>
                        <p className="text-xs text-muted-foreground break-all">
                          {tx.userEmail}
                        </p>
                      </div>

                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        <p>{formatRoleLabel(String(tx.role || "student"))}</p>
                        <p>{formatPlanLabel(tx)}</p>
                      </div>

                      <p className="font-mono text-sm font-bold text-foreground tabular-nums">
                        ${Number(tx.amount || 0).toLocaleString()} {currency}
                      </p>

                      <p className="font-mono text-xs text-muted-foreground break-all">
                        {tx.transactionId || "—"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatTransactionDate(tx)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <p className="font-medium text-primary tabular-nums">
                  {isFiltered
                    ? `Showing ${showingStart}–${showingEnd} of ${filteredTransactions.length} filtered transactions`
                    : `Showing ${visibleTransactions.length} of ${paidTransactions.length.toLocaleString()} transactions`}
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