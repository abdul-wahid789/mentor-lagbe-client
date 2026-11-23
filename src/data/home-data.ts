import type {
  HowItWorksStep,
  PricingTier,
  SubjectCategory,
  TuitionListing,
} from "@/types/home";

export const HERO_STATS = [
  { value: "2,400+", label: "Students learning" },
  { value: "450+", label: "Verified tutors" },
  { value: "96%", label: "Positive feedback" },
];

export const FEATURED_TUITIONS: TuitionListing[] = [
  {
    id: "math-1",
    subject: "Mathematics",
    mode: "Online",
    title: "Mathematics, made simple",
    level: "Class 9–10",
    schedule: "3 days / week",
    tutorName: "Rafiq Ahmed",
    verified: true,
    monthlyRate: "৳2,500",
    href: "/tuitions/math-1",
  },
  {
    id: "physics-1",
    subject: "Physics",
    mode: "Home",
    title: "Build your physics foundation",
    level: "Class 11–12",
    schedule: "3 days / week",
    tutorName: "Nadia Islam",
    verified: true,
    monthlyRate: "৳4,000",
    href: "/tuitions/physics-1",
  },
  {
    id: "programming-1",
    subject: "Programming",
    mode: "Online",
    title: "Your first line of code",
    level: "Beginner",
    schedule: "2 days / week",
    tutorName: "Tanvir Hasan",
    verified: true,
    monthlyRate: "৳3,000",
    href: "/tuitions/programming-1",
  },
  {
    id: "ielts-1",
    subject: "IELTS",
    mode: "Online",
    title: "IELTS: your next chapter",
    level: "All levels",
    schedule: "3 days / week",
    tutorName: "Farhana Rahman",
    verified: true,
    monthlyRate: "৳5,000",
    href: "/tuitions/ielts-1",
  },
  {
    id: "chemistry-1",
    subject: "Chemistry",
    mode: "Home",
    title: "Chemistry without confusion",
    level: "Class 9–10",
    schedule: "3 days / week",
    tutorName: "Mahmudul Karim",
    verified: true,
    monthlyRate: "৳3,500",
    href: "/tuitions/chemistry-1",
  },
  {
    id: "math-2",
    subject: "Mathematics",
    mode: "Online",
    title: "Confidence in every equation",
    level: "Class 6–8",
    schedule: "3 days / week",
    tutorName: "Sumaiya Akter",
    verified: true,
    monthlyRate: "৳2,200",
    href: "/tuitions/math-2",
  },
];

export const SUBJECT_CATEGORIES: SubjectCategory[] = [
  { index: "01", name: "Mathematics", href: "/tuitions?subject=mathematics" },
  { index: "02", name: "Physics", href: "/tuitions?subject=physics" },
  { index: "03", name: "Programming", href: "/tuitions?subject=programming" },
  { index: "04", name: "IELTS", href: "/tuitions?subject=ielts" },
];


export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: "01",
    badge: "Discover",
    title: "Find your fit",
    description:
      "Filter verified tuitions by subject, class level, monthly budget, and Online or Home mode.",
    highlight: "Admin-approved listings only",
  },
  {
    step: "02",
    badge: "Connect",
    title: "Send an application",
    description:
      "Share your learning goals, preferred schedule, and academic background in one quick application.",
    highlight: "Real-time status tracking",
  },
  {
    step: "03",
    badge: "Learn",
    title: "Start growing",
    description:
      "Get accepted by your mentor, join your 1-on-1 session or batch, and make consistent progress.",
    highlight: "1-on-1 & small batches",
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    badge: "Starter",
    price: "৳0",
    period: "/ forever",
    description: "Explore approved tuitions and connect with the community.",
    features: [
      "Browse & filter all verified tuition listings",
      "Apply to up to 3 tuitions per month",
      "Real-time application status tracking",
      "Post up to 2 tuition listings (for Tutors)",
    ],
    ctaLabel: "Get started",
    href: "/register",
  },
  {
    id: "pro-student",
    name: "Pro Student",
    badge: "Most Popular",
    price: "$10",
    period: "/ month",
    description: "Priority access and unlimited applications to land your ideal tutor faster.",
    features: [
      "Unlimited tuition & batch applications",
      "Priority application placement at top of tutor inbox",
      "Pro Student badge that boosts acceptance rate",
      "Direct priority messaging & session alerts",
      "Early access to newly approved mentorship batches",
    ],
    ctaLabel: "Subscribe with Stripe",
    href: "/payment/checkout?plan=pro-student",
    featured: true,
  },
  {
    id: "pro-tutor",
    name: "Pro Tutor",
    badge: "For Educators",
    price: "$15",
    period: "/ month",
    description: "Scale your teaching with unlimited batches and top search visibility.",
    features: [
      "Unlimited active tuition & batch postings",
      "Verified Pro Tutor badge on profile & cards",
      "Featured placement in subject & home searches",
      "Fast-track admin listing review & analytics",
      "Custom banner uploads & batch seat management",
    ],
    ctaLabel: "Subscribe with Stripe",
    href: "/payment/checkout?plan=pro-tutor",
  },
];


import type { Testimonial } from "@/types/home";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "samia-ahmed",
    headline: "I finally found a tutor who gets me.",
    quote:
      "Rafiq helped me understand the why behind every equation instead of memorizing formulas. Now I walk into class feeling ready for any problem.",
    authorName: "Samia Ahmed",
    role: "Class 10 Student · Dhanmondi",
    subject: "Mathematics",
    mode: "Online",
    initials: "SA",
    featured: true,
  },
  {
    id: "tahmid-hasan",
    headline: "From struggling in Physics to top 5 in class.",
    quote:
      "Joining Nadia apu's small batch gave me structure every week. Clear notes, real past-paper practice, and zero hesitation to ask questions.",
    authorName: "Tahmid Hasan",
    role: "HSC 1st Year · Uttara",
    subject: "Physics",
    mode: "Home",
    initials: "TH",
  },
  {
    id: "nusrat-jahan",
    headline: "Peace of mind as a parent.",
    quote:
      "Seeing verified credentials, clear monthly fees, and live application updates made finding a reliable home tutor effortless for our family.",
    authorName: "Nusrat Jahan",
    role: "Parent · Mirpur",
    subject: "Chemistry",
    mode: "Home",
    initials: "NJ",
  },
];