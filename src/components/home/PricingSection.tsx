import Link from "next/link";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
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
import { PRICING_TIERS } from "@/data/home-data";
import { cn } from "@/lib/utils";

export function PricingSection() {
    return (
        <section
            id="pricing"
            className="w-full bg-secondary/50 border-t border-border/60 py-14 sm:py-20"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            A little extra momentum
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Go further with Pro.
                        </h2>
                        <p className="max-w-xl text-sm text-muted-foreground">
                            Start free with core marketplace access, or upgrade your student or
                            tutor account anytime via Stripe.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-success" />
                        <span>Secure Stripe billing · Cancel anytime</span>
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {PRICING_TIERS.map((tier) => (
                        <Card
                            key={tier.id}
                            className={cn(
                                "relative flex flex-col justify-between bg-card transition-all",
                                tier.featured
                                    ? "border-primary/60 shadow-sm ring-1 ring-primary/20"
                                    : "border-border hover:border-primary/35"
                            )}
                        >
                            <div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                                            {tier.name}
                                        </CardDescription>

                                        {tier.badge && (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "rounded-md px-2 py-0.5 text-[11px] font-medium",
                                                    tier.featured
                                                        ? "border-warning/30 bg-warning-tint text-warning"
                                                        : "border-border bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {tier.featured && (
                                                    <Sparkles className="mr-1 h-3 w-3 inline" />
                                                )}
                                                {tier.badge}
                                            </Badge>
                                        )}
                                    </div>

                                    <CardTitle className="pt-2 text-3xl font-bold tracking-tight text-foreground tabular-nums">
                                        <span className="font-mono">{tier.price}</span>
                                        {tier.period && (
                                            <span className="ml-1 text-sm font-normal text-muted-foreground">
                                                {tier.period}
                                            </span>
                                        )}
                                    </CardTitle>

                                    <p className="pt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                        {tier.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="border-t border-border/60 pt-4 pb-6">
                                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        What&apos;s included
                                    </p>
                                    <ul className="space-y-2.5 text-xs sm:text-sm">
                                        {tier.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2.5 text-foreground/90"
                                            >
                                                <span
                                                    className={cn(
                                                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                                                        tier.featured
                                                            ? "bg-primary/15 text-primary"
                                                            : "bg-success-tint text-success"
                                                    )}
                                                >
                                                    <Check className="h-3 w-3 stroke-[2.5]" />
                                                </span>
                                                <span className="leading-snug">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>



                                </CardContent>
                            </div>

                            <CardFooter className="pt-0 bg-card border-0">
                                <Link href={tier.href} className="w-full"> <Button
                                    size="sm"
                                    variant={tier.featured ? "default" : "secondary"}
                                    className={cn(
                                        "w-full h-9 font-medium",
                                        !tier.featured &&
                                        "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    )}>
                                    {tier.ctaLabel}
                                </Button></Link>

                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}