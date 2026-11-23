import { getPromise } from "../server";
import { HERO_STATS } from "@/data/home-data";
import type { Response } from "@/types/server";

export interface HeroStatItem {
  label: string;
  value: string;
}

export async function getHomeStats(): Promise<HeroStatItem[]> {
  try {
    const res: Response<HeroStatItem[]> = await getPromise<HeroStatItem[]>(
      "/stats/home",
      "GET"
    );

    if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Fall back to static HERO_STATS if backend is unreachable
  }

  return HERO_STATS;
}


export interface RecentFeedbackRecord {
  id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  mode: "Online" | "Home";
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RecentFeedbacksPayload {
  items: RecentFeedbackRecord[];
  averageRating: number;
  totalCount: number;
}

export async function getRecentFeedbacks(
  limit = 5
): Promise<RecentFeedbacksPayload | null> {
  try {
    const res = await getPromise<RecentFeedbacksPayload>(
      `/feedbacks/recent?limit=${limit}`,
      "GET"
    );

    if (!res.error && res.data && Array.isArray(res.data.items)) {
      return res.data;
    }
  } catch {
    // Fall back to static testimonials
  }

  return null;
}