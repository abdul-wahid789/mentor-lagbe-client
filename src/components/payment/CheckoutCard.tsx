"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { showErrorToast, showInfoToast } from "@/lib/toaster";
import { planUpgrade, type UpgradePlanKey } from "@/lib/actions/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type CheckoutPlanKey = UpgradePlanKey;

const PLAN_DETAILS: Record<
  CheckoutPlanKey,
  {
    name: string;
    badge: string;
    priceLabel: string;
    roleHint: string;
    summary: string;
    benefits: string[];
  }
> = {
  "pro-student": {
    name: "Pro Student",
    badge: "Monthly membership",
    priceLabel: "$10.00 USD",
    roleHint: "Student",
    summary: "Priority applications and unlimited tuition requests.",
    benefits: [
      "Unlimited tuition & batch applications",
      "Priority placement in tutor applicant lists",
      "Pro Student badge & early batch access",
    ],
  },
  "pro-tutor": {
    name: "Pro Tutor",
    badge: "Monthly membership",
    priceLabel: "$15.00 USD",
    roleHint: "Tutor",
    summary: "Unlimited tuition posts and verified Pro visibility.",
    benefits: [
      "Unlimited tuition & batch listings (vs. 2 on Free)",
      "Verified Pro Tutor badge on listings & profile",
      "Higher visibility in subject & home searches",
    ],
  },
};

export function CheckoutCard({ plan }: { plan: CheckoutPlanKey }) {
  const [loading, setLoading] = useState(false);
  const details = PLAN_DETAILS[plan];

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      showInfoToast("Redirecting to Stripe Checkout...");
      const response = await planUpgrade({ plan });

      if (response?.error || !response?.data) {
        throw new Error(
          response?.msg || "Could not start Stripe Checkout session."
        );
      }

      window.location.href = response.data;
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Failed to initialize payment."
      );
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl border-border bg-card shadow-xs">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            <span>Stripe Checkout</span>
          </span>
          <Badge
            variant="secondary"
            className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary"
          >
            {details.roleHint}
          </Badge>
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Upgrade to {details.name}.
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {details.summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-xl border border-primary/20 bg-secondary/65 p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-primary">
                {details.name} · {details.badge}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Billed monthly in USD via Stripe
              </p>
            </div>
            <p className="font-mono text-2xl font-bold text-foreground tabular-nums">
              {details.priceLabel}
            </p>
          </div>

          <ul className="mt-4 space-y-2 border-t border-border/70 pt-3.5 text-xs text-foreground/90 sm:text-sm">
            {details.benefits.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-success" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-3 pt-1">
        <Button
          type="button"
          disabled={loading}
          onClick={handleStripeCheckout}
          className="h-10 px-5 text-xs font-semibold sm:text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Redirecting to Stripe...</span>
            </>
          ) : (
            <>
              <span>Continue to Stripe</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="h-10 border-primary/25 px-4 text-xs font-semibold text-primary sm:text-sm"
          render={
            <Link href="/#pricing">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              <span>Back to pricing</span>
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}