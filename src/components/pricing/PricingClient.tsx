"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { planUpgrade, type UpgradePlanKey } from "@/lib/actions/payment";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PricingPlan {
  id: "free" | "pro-student" | "pro-tutor";
  eyebrow: string;
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    eyebrow: "FIND YOUR RHYTHM",
    name: "Free",
    price: "$0",
    subtitle: "For a confident first step.",
    features: [
      "Browse approved tuitions",
      "Apply as a Student",
      "Post up to 2 tuitions as a Tutor",
      "Manage your applications",
    ],
    ctaLabel: "Create free account",
  },
  {
    id: "pro-student",
    eyebrow: "FIND YOUR RHYTHM",
    name: "Pro Student",
    price: "$10",
    subtitle: "For a little extra momentum.",
    features: [
      "Everything in Free",
      "Pro Student membership",
      "Manage learning in one place",
      "Flexible monthly billing",
    ],
    ctaLabel: "Subscribe with Stripe",
  },
  {
    id: "pro-tutor",
    eyebrow: "FOR GROWING EDUCATORS",
    name: "Pro Tutor",
    price: "$15",
    subtitle: "For teachers ready to grow.",
    features: [
      "Everything in Free",
      "Unlimited tuition posts",
      "Manage all applicants",
      "Flexible monthly billing",
    ],
    ctaLabel: "Subscribe with Stripe",
    highlighted: true,
  },
];

const FAQ_ITEMS = [
  {
    question: "Can I start for free?",
    answer:
      "Yes. Students can explore and apply, and Tutors can post up to 2 tuitions without a subscription.",
  },
  {
    question: "What happens after I subscribe?",
    answer:
      "Once Stripe confirms payment, your account displays your Pro membership.",
  },
  {
    question: "Are tuition fees included?",
    answer:
      "No. Monthly tuition fees are shown separately on each tuition listing.",
  },
];

export function PricingClient() {
  const { data: session } = authClient.useSession();
  const [loadingPlan, setLoadingPlan] = useState<UpgradePlanKey | null>(null);

  const handleSubscribe = async (planKey: UpgradePlanKey) => {
    if (!session?.user) {
      showErrorToast("Please sign in first to start a Pro subscription.");
      return;
    }

    setLoadingPlan(planKey);
    try {
      const res = await planUpgrade({ plan: planKey });
      if (res.error) {
        showErrorToast(res.msg || "Could not start Stripe checkout.");
        return;
      }

      const payload = res as unknown as {
        url?: string;
        checkoutUrl?: string;
        data?: { url?: string; checkoutUrl?: string };
      };
      const checkoutUrl =
        payload.url ||
        payload.checkoutUrl ||
        payload.data?.url ||
        payload.data?.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      showSuccessToast("Redirecting to Stripe checkout...");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-20 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          INVEST IN YOUR NEXT CHAPTER
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          A plan for every ambition.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Start free. Choose Pro when you&apos;re ready to go further. Simple
          monthly pricing. No hidden fees.
        </p>
      </section>

      {/* Pricing Cards Grid */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const isPaidPlan =
              plan.id === "pro-student" || plan.id === "pro-tutor";
            const isBusy = loadingPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col justify-between rounded-2xl bg-card shadow-xs transition-colors",
                  plan.highlighted
                    ? "border-2 border-primary"
                    : "border border-border"
                )}
              >
                <CardContent className="flex h-full flex-col justify-between space-y-8 p-6 sm:p-7">
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                        {plan.eyebrow}
                      </p>
                      <h2 className="text-xl font-bold text-foreground">
                        {plan.name}
                      </h2>
                    </div>

                    <div className="space-y-1">
                      <p className="text-4xl font-bold tracking-tight text-foreground tabular-nums">
                        {plan.price}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        per month
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {plan.subtitle}
                    </p>

                    <ul className="space-y-2.5 text-sm text-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center justify-center">
                    {plan.id === "free" ? (
                      <Button
                        type="button"
                        variant="outline"
                        nativeButton={false}
                        className="h-10 rounded-lg border-border bg-card px-4 text-xs font-semibold text-primary hover:bg-secondary/60"
                        render={<Link href="/signup">{plan.ctaLabel}</Link>}
                      />
                    ) : (
                      <Button
                        type="button"
                        disabled={!isPaidPlan || isBusy}
                        onClick={() => handleSubscribe(plan.id)}
                        className="h-10 rounded-lg px-4 text-xs font-semibold"
                      >
                        {isBusy ? "Redirecting..." : plan.ctaLabel}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Secure checkout by Stripe · Prices in USD · Cancel anytime
        </p>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8 pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Good questions. Clear answers.
        </h2>

        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="space-y-1.5">
              <h3 className="text-base font-bold text-foreground">
                {item.question}
              </h3>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}