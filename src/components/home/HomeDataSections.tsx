import { getHomeStats, getRecentFeedbacks } from "@/lib/actions/home";
import { getApprovedTuitions } from "@/lib/actions/tuition";
import { StatsStrip } from "./StatsStrip";
import { FeaturedTuitionsSection } from "./FeaturedTuitionsSection";
import { SubjectsSection } from "./SubjectsSection";
import { TestimonialSection } from "./TestimonialSection";

export async function StatsStripStream() {
  const stats = await getHomeStats();
  return <StatsStrip stats={stats} />;
}

export async function FeaturedTuitionsStream() {
  const tuitionsRes = await getApprovedTuitions();
  const approvedTuitions =
    !tuitionsRes.error && Array.isArray(tuitionsRes.data)
      ? tuitionsRes.data
      : [];

  return <FeaturedTuitionsSection tuitions={approvedTuitions} />;
}

export async function SubjectsSectionStream() {
  const tuitionsRes = await getApprovedTuitions();
  const approvedTuitions =
    !tuitionsRes.error && Array.isArray(tuitionsRes.data)
      ? tuitionsRes.data
      : [];

  return <SubjectsSection tuitions={approvedTuitions} />;
}

export async function TestimonialSectionStream() {
  const recentFeedbacks = await getRecentFeedbacks(3);
  return <TestimonialSection feedbackPayload={recentFeedbacks} />;
}