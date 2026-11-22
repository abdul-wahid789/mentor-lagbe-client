import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    plan?: string;
    amount?: string;
    tx?: string;
    email?: string;
    paidAt?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;
  const isStudentPlan = params.plan === "pro-student";
  const planTitle = isStudentPlan
    ? "Pro Student · Monthly membership"
    : "Pro Tutor · Monthly membership";
  const amountPaid =
    params.amount || (isStudentPlan ? "$10.00 USD" : "$15.00 USD");
  const transactionId = params.tx || "pi_3R8K2L9M4N6P";
  const paidOn = params.paidAt || "19 Nov 2026";
  const receiptEmail = params.email || "arif@example.com";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-xl border-border bg-card shadow-xs">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-success">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Payment confirmed</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl">
                Your next chapter is Pro.
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isStudentPlan
                  ? "Your Pro Student membership is active. You now have unlimited applications and priority placement with tutors."
                  : "Your Pro Tutor membership is active. You can now post unlimited tuitions and keep your teaching community growing."}
              </p>
            </div>

            <div className="space-y-2.5 rounded-xl bg-secondary/75 p-4 sm:p-5">
              <p className="text-sm font-bold text-primary">{planTitle}</p>

              <dl className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <dt className="w-24 shrink-0 text-muted-foreground">
                    Amount paid
                  </dt>
                  <dd className="font-mono font-medium text-foreground tabular-nums">
                    {amountPaid}
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="w-24 shrink-0 text-muted-foreground">
                    Transaction
                  </dt>
                  <dd className="truncate font-mono text-xs text-foreground sm:text-sm">
                    {transactionId}
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="w-24 shrink-0 text-muted-foreground">
                    Paid on
                  </dt>
                  <dd className="text-foreground">{paidOn}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="w-24 shrink-0 text-muted-foreground">
                    Receipt sent to
                  </dt>
                  <dd className="truncate text-foreground">{receiptEmail}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="sm"
                className="h-9 px-4 text-xs font-semibold sm:text-sm"
                render={
                  <Link href="/dashboard">
                    <span>Go to dashboard</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                }
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-primary/25 px-4 text-xs font-semibold text-primary sm:text-sm"
                render={
                  <Link href="/dashboard/admin/transactions">
                    View transactions
                  </Link>
                }
              />
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}