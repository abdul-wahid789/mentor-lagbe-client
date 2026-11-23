"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getTransactions } from "@/lib/actions/payment";
import { showErrorToast } from "@/lib/toaster";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DashboardUser, PaymentTransactionRecord } from "@/types/dashboard";

export default function AdminTransactionsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("this-month");
  const [transactions, setTransactions] = useState<PaymentTransactionRecord[]>(
    []
  );

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login");
      return;
    }

    getTransactions().then((res) => {
      if (res.error) {
        showErrorToast(res.msg || "Could not load transactions.");
        return;
      }
      if (Array.isArray(res.data)) {
        setTransactions(res.data);
      }
    });
  }, [session, isPending, router]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (item) =>
        item.userName.toLowerCase().includes(q) ||
        item.userEmail.toLowerCase().includes(q) ||
        item.transactionId.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  if (isPending || !session?.user) {
    return null;
  }

  const rawUser = session.user as Record<string, unknown>;
  const user: DashboardUser = {
    id: String(rawUser.id),
    name: String(rawUser.name || "Admin"),
    email: String(rawUser.email || ""),
    image: typeof rawUser.image === "string" ? rawUser.image : null,
    role:
      rawUser.role === "admin" || rawUser.role === "tutor"
        ? rawUser.role
        : "admin",
    plan: rawUser.plan === "pro" ? "pro" : "free",
  };

  const totalRevenue = filtered.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );
  const tutorSubs = filtered.filter((t) => t.planName === "Pro Tutor");
  const studentSubs = filtered.filter((t) => t.planName === "Pro Student");
  const tutorTotal = tutorSubs.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );
  const studentTotal = studentSubs.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  return (
    <DashboardShell user={user} breadcrumbLabel="Transactions">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Every payment, accounted for.
          </h1>
          <p className="text-sm text-muted-foreground">
            A clear record of Stripe membership transactions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            metric={{
              label: "Total revenue",
              value: `$${totalRevenue.toLocaleString()}`,
              subtext: "USD · Lifetime",
            }}
          />
          <StatCard
            metric={{
              label: "Tutor subscriptions",
              value: tutorSubs.length,
              subtext: `$${tutorTotal.toLocaleString()} total`,
            }}
          />
          <StatCard
            metric={{
              label: "Student subscriptions",
              value: studentSubs.length,
              subtext: `$${studentTotal.toLocaleString()} total`,
            }}
          />
          <StatCard
            metric={{
              label: "This month",
              value: `$${totalRevenue.toLocaleString()}`,
              subtext: "November 2026",
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="payment-search"
              className="text-xs font-semibold text-foreground"
            >
              Find a payment
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="payment-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, email, transaction ID..."
                className="h-10 bg-card pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="payment-date-range"
              className="text-xs font-semibold text-foreground"
            >
              Date range
            </label>
            <Select
              value={dateRange}
              onValueChange={(v) => setDateRange(v ?? "this-month")}
            >
              <SelectTrigger
                id="payment-date-range"
                className="h-10 w-full bg-card"
              >
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This month</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="all-time">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <h2 className="text-base font-bold text-foreground">
              Membership payments
            </h2>

            {filtered.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No transactions found.
              </p>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/60 text-muted-foreground">
                        <th className="rounded-l-lg px-4 py-2.5 font-medium">
                          User / Email
                        </th>
                        <th className="px-4 py-2.5 font-medium">Role / Plan</th>
                        <th className="px-4 py-2.5 font-medium">Amount</th>
                        <th className="px-4 py-2.5 font-medium">
                          Transaction ID
                        </th>
                        <th className="rounded-r-lg px-4 py-2.5 font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/70">
                      {filtered.map((tx) => (
                        <tr key={tx.id} className="bg-muted/25 align-top">
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-foreground">
                              {tx.userName}
                            </p>
                            <p className="text-muted-foreground">
                              {tx.userEmail}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            <p className="capitalize">{tx.role}</p>
                            <p>{tx.planName}</p>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-sm font-bold text-foreground tabular-nums">
                            ${tx.amount} {tx.currency}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                            {tx.transactionId}
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground">
                            {tx.paidAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 md:hidden">
                  {filtered.map((tx) => (
                    <div
                      key={tx.id}
                      className="space-y-1.5 rounded-xl border border-border/70 bg-muted/30 p-4 text-xs"
                    >
                      <p className="font-semibold text-foreground">
                        {tx.userName}
                      </p>
                      <p className="text-muted-foreground">{tx.userEmail}</p>
                      <p className="pt-1 capitalize text-muted-foreground">
                        {tx.role} · {tx.planName}
                      </p>
                      <p className="font-mono text-sm font-bold text-foreground">
                        ${tx.amount} {tx.currency}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {tx.transactionId}
                      </p>
                      <p className="text-muted-foreground">{tx.paidAt}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}