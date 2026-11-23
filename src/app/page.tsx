import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { FeaturedTuitionsSection } from "@/components/home/FeaturedTuitionsSection";
import { SubjectsSection } from "@/components/home/SubjectsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { getHomeStats, getRecentFeedbacks } from "@/lib/actions/home";
import { getApprovedTuitions } from "@/lib/actions/tuition";

export default async function HomePage() {
  const [stats, tuitionsRes, recentFeedbacks] = await Promise.all([
    getHomeStats(),
    getApprovedTuitions(),
    getRecentFeedbacks(3),
  ]);

  const approvedTuitions =
    !tuitionsRes.error && Array.isArray(tuitionsRes.data)
      ? tuitionsRes.data
      : [];
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsStrip stats={stats} />
        <FeaturedTuitionsSection tuitions={approvedTuitions} />
        <SubjectsSection tuitions={approvedTuitions} />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialSection feedbackPayload={recentFeedbacks} />
      </main>
      <Footer />
    </div>
  );
}