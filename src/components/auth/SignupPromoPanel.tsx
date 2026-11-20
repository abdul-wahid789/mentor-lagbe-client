import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SignUpImg from '@/assets/images/signup-cover.png'

const PLATFORM_HIGHLIGHTS = [
  {
    icon: BookOpen,
    title: "Online & Home Tuitions",
    subtitle: "Filter by subject, class & budget",
  },
  {
    icon: Users,
    title: "1-on-1 or Small Batches",
    subtitle: "Structured learning that fits your pace",
  },
];

export function SignupPromoPanel() {
  return (
    <Card className="relative hidden overflow-hidden border-primary/20 bg-gradient-to-b from-secondary/80 via-secondary/50 to-card p-7 shadow-xs lg:flex lg:flex-col lg:justify-between">
      {/* Subtle decorative radial glow in top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
      />

      <CardContent className="relative z-10 flex h-full flex-col justify-between space-y-6 p-0">
        {/* Top Editorial Header */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Your next chapter starts here
            </p>
            <Badge
              variant="outline"
              className="rounded-full border-accent/30 bg-accent-tint px-2.5 py-0.5 text-[11px] font-medium text-accent"
            >
              <ShieldCheck className="mr-1 h-3 w-3" />
              Verified community
            </Badge>
          </div>

          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-foreground xl:text-[2.2rem]">
            The right guidance changes everything.
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Join a trusted learning community built for real academic progress—whether
            you&apos;re finding a dedicated mentor or leading subject batches.
          </p>
        </div>

        {/* Framed Mentorship Image + Floating Status Pill */}
        <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/90 bg-card shadow-xs">
          <Image
            src={SignUpImg}
            alt="Tutor guiding a student during a mentorship session"
            fill
            sizes="(max-width: 1280px) 45vw, 520px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Subtle bottom gradient for badge contrast */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
          />

          {/* Floating Community Proof Pill */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-lg border border-white/15 bg-background/90 px-3.5 py-2 backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-tint text-success">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <p className="truncate text-xs font-semibold text-foreground">
                450+ Admin-Approved Tutors
              </p>
            </div>
            <span className="shrink-0 font-mono text-[11px] font-semibold text-primary">
              2,400+ learners
            </span>
          </div>
        </div>

        {/* Two-Column Feature Highlights */}
        <div className="grid grid-cols-2 gap-3">
          {PLATFORM_HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-border/80 bg-card/85 p-3.5 transition-colors hover:border-primary/35"
              >
                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Free Plan Assurance Strip */}
        <div className="space-y-2.5 rounded-xl border border-border/80 bg-card/90 p-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <GraduationCap className="h-4 w-4 text-primary" />
              Included on your Free account
            </span>
            <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              ৳0 · Forever
            </span>
          </div>

          <ul className="grid grid-cols-1 gap-1.5 text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
              <span>Real-time application tracking</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
              <span>Upgrade to Pro anytime</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}