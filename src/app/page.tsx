import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PricingSection } from "@/components/home/PricingSection";
import {
  FeaturedTuitionsStream,
  StatsStripStream,
  SubjectsSectionStream,
  TestimonialSectionStream,
} from "@/components/home/HomeDataSections";
import {
  FeaturedTuitionsSkeleton,
  StatsStripSkeleton,
  SubjectsSectionSkeleton,
  TestimonialSectionSkeleton,
} from "@/components/home/HomeSkeletons";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />

        <Suspense fallback={<StatsStripSkeleton />}>
          <StatsStripStream />
        </Suspense>

        <Suspense fallback={<FeaturedTuitionsSkeleton />}>
          <FeaturedTuitionsStream />
        </Suspense>

        <Suspense fallback={<SubjectsSectionSkeleton />}>
          <SubjectsSectionStream />
        </Suspense>

        <HowItWorksSection />
        <PricingSection />

        <Suspense fallback={<TestimonialSectionSkeleton />}>
          <TestimonialSectionStream />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}