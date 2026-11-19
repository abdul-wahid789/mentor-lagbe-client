import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { FeaturedTuitionsSection } from "@/components/home/FeaturedTuitionsSection";
import { SubjectsSection } from "@/components/home/SubjectsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsStrip />
        <FeaturedTuitionsSection />
        <SubjectsSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
}