import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Search,
    Send,
    Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HOW_IT_WORKS_STEPS } from "@/data/home-data";
import { cn } from "@/lib/utils";

const STEP_ICONS = [Search, Send, Sparkles];

export function HowItWorksSection() {
    return (
        <section
            id="how-it-works"
            className="w-full bg-background py-14 sm:py-20"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            Your next chapter
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            From searching to succeeding.
                        </h2>
                        <p className="max-w-xl text-sm text-muted-foreground">
                            Whether you&apos;re looking for 1-on-1 guidance or joining a
                            focused batch, getting started takes three simple steps.
                        </p>
                    </div>

                    <Link href="/tuitions">
                     <Button
                        variant="outline"
                        size="sm"
                        className="w-fit border-border bg-card text-xs font-medium hover:border-primary/40"

                    >
                        Explore tuitions
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                    </Link>

                </div>

                {/* 3-Step Progression Grid */}
                <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Desktop horizontal progression line behind cards */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-11 left-[16%] right-[16%] hidden h-px bg-gradient-to-r from-primary/30 via-accent/40 to-success/40 md:block"
                    />

                    {HOW_IT_WORKS_STEPS.map((item, idx) => {
                        const Icon = STEP_ICONS[idx] ?? Search;
                        const isMiddle = idx === 1;
                        const isLast = idx === 2;

                        return (
                            <Card
                                key={item.step}
                                className="group relative flex flex-col justify-between border-border bg-card transition-all hover:border-primary/45 hover:shadow-xs"
                            >
                                <CardContent className="flex h-full flex-col justify-between p-6">
                                    <div className="space-y-4">
                                        {/* Top Row: Step Pill + Icon Badge */}
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={cn(
                                                        "inline-flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold",
                                                        isLast
                                                            ? "bg-success-tint text-success"
                                                            : isMiddle
                                                                ? "bg-accent-tint text-accent"
                                                                : "bg-secondary text-primary"
                                                    )}
                                                >
                                                    {item.step}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-md border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            </div>

                                            <div
                                                className={cn(
                                                    "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                                                    isLast
                                                        ? "border-success/20 bg-success-tint/60 text-success"
                                                        : isMiddle
                                                            ? "border-accent/20 bg-accent-tint/60 text-accent"
                                                            : "border-primary/20 bg-secondary/70 text-primary"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-1.5 pt-1">
                                            <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom Domain Highlight */}
                                    <div className="mt-6 flex items-center gap-2 border-t border-border/60 pt-3.5 text-xs text-muted-foreground">
                                        <CheckCircle2
                                            className={cn(
                                                "h-3.5 w-3.5 shrink-0",
                                                isLast
                                                    ? "text-success"
                                                    : isMiddle
                                                        ? "text-accent"
                                                        : "text-primary"
                                            )}
                                        />
                                        <span className="font-medium text-foreground/85">
                                            {item.highlight}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}