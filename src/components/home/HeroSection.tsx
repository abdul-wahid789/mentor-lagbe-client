"use client";

import { useState, type FormEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import defaultHeroImage from "@/assets/images/hero.png";

interface HeroSectionProps {
  heroImageSrc?: StaticImageData | string;
}

export function HeroSection({
  heroImageSrc = defaultHeroImage,
}: HeroSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const navigateToTuitions = (searchText: string, mode?: "Online" | "Home") => {
    const params = new URLSearchParams();
    const trimmed = searchText.trim();

    if (trimmed) {
      params.set("q", trimmed);
    }
    if (mode) {
      params.set("mode", mode);
    }

    const qs = params.toString();
    router.push(qs ? `/tuitions?${qs}` : "/tuitions");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigateToTuitions(query);
  };

  return (
    <section className="w-full border-b border-border/60 bg-secondary/75 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Eyebrow, Headline, Search Form & Quick Modes */}
          <div className="space-y-4 lg:col-span-6">
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
              role="search"
              aria-label="Search tuitions"
              className="flex max-w-md items-center gap-2 pt-1"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setQuery("");
                    }
                  }}
                  placeholder="Search a subject or tutor..."
                  aria-label="Search a subject or tutor"
                  className="h-10 border-border bg-card pl-9 pr-8 text-sm focus-visible:ring-ring"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search query"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <Button type="submit" size="sm" className="h-10 shrink-0 px-4">
                <span>Find a tutor</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </form>

            <div className="flex items-center gap-3 pt-0.5 text-xs text-muted-foreground">
              <span className="font-mono text-primary">→</span>
              <button
                type="button"
                onClick={() => navigateToTuitions(query, "Online")}
                className="transition-colors hover:text-foreground"
              >
                Online classes
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => navigateToTuitions(query, "Home")}
                className="transition-colors hover:text-foreground"
              >
                Home tuitions
              </button>
            </div>
          </div>

          {/* Right Column: Mentorship Photo + Callout Card */}
          <div className="space-y-3 lg:col-span-6">
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