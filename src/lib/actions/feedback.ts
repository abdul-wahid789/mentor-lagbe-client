import { getPromise, postPromise } from "../server";
import type { Response } from "@/types/server";
import type { TuitionFeedbackItem } from "@/types/dashboard";

export interface CreateTuitionFeedbackPayload {
  rating: number;
  comment: string;
}

export async function getTuitionFeedbacks(
  tuitionId: string,
  token?: string
): Promise<Response<TuitionFeedbackItem[]>> {
  return await getPromise<TuitionFeedbackItem[]>(
    `/tuitions/${tuitionId}/feedbacks`,
    "GET",
    token
  );
}

export async function createTuitionFeedback(
  tuitionId: string,
  data: CreateTuitionFeedbackPayload,
  token?: string
): Promise<Response<TuitionFeedbackItem>> {
  return await postPromise<CreateTuitionFeedbackPayload, TuitionFeedbackItem>(
    `/tuitions/${tuitionId}/feedbacks`,
    "POST",
    data,
    token
  );
}