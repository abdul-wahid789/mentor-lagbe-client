export type TuitionMode = "Online" | "Home";

export interface TuitionListing {
  id: string;
  subject: string;
  mode: TuitionMode;
  title: string;
  level: string;
  schedule: string;
  tutorName: string;
  verified: boolean;
  monthlyRate: string;
  href: string;
  bannerUrl?: string;
}

export interface SubjectCategory {
  index: string;
  name: string;
  href: string;
}

export interface HowItWorksStep {
  step: string;
  badge: string;
  title: string;
  description: string;
  highlight: string;
}

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  href: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  headline: string;
  quote: string;
  authorName: string;
  role: string;
  subject: string;
  mode: TuitionMode;
  initials: string;
  featured?: boolean;
}