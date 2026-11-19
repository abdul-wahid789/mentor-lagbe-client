"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import heroImageSrc from "@/assets/images/hero.png"

interface HeroSectionProps {
  heroImageSrc?: string;
}

export function HeroSection({
}: HeroSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/tuitions?q=${encodeURIComponent(trimmed)}` : "/tuitions"
    );
  };

  return (
    <section className="w-full bg-secondary/75 border-b border-border/60 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Eyebrow, Headline, Search Form & Quick Modes */}
          <div className="lg:col-span-6 space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              A better way to learn
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
              Find Your Ideal Tutor or Mentorship Batch Today
            </h1>

            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Big milestones start with the right guide. Connect with verified
              tutors, find your rhythm, and make progress that lasts.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 pt-1 max-w-md"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a subject or tutor..."
                  aria-label="Search a subject or tutor"
                  className="h-10 bg-card pl-9 text-sm border-border focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" size="sm" className="h-10 px-4 shrink-0">
                Find a tutor
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </form>

            <div className="flex items-center gap-3 pt-0.5 text-xs text-muted-foreground">
              <span className="font-mono text-primary">→</span>
              <button
                type="button"
                onClick={() => router.push("/tuitions?mode=online")}
                className="hover:text-foreground transition-colors"
              >
                Online classes
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => router.push("/tuitions?mode=home")}
                className="hover:text-foreground transition-colors"
              >
                Home tuitions
              </button>
            </div>
          </div>

          {/* Right Column: Mentorship Photo + Callout Card */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <Image
                src={heroImageSrc}
                alt="Tutor guiding a student during a mentorship session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="eager"
              />
            </div>

            <Card className="border-border bg-card py-3.5 shadow-xs">
              <CardContent className="px-4 sm:px-5">
                <p className="text-sm font-semibold text-foreground">
                  Your potential. Their guidance.
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Learn one-on-one or grow with a small batch.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}