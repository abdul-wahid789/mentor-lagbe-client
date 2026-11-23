import { getPromise, postPromise } from "../server";
import type { Response } from "@/types/server";
import type { TuitionPostItem } from "@/types/dashboard";

export interface TuitionStatusPayload {
  isActive: boolean;
}

export async function createTuition(
  data: TuitionPostItem
): Promise<Response<null>> {
  return await postPromise<TuitionPostItem>("/tuition", "POST", data);
}

export async function getMyTuitions(token: string = ""): Promise<Response<TuitionPostItem[]>> {
  return await getPromise<TuitionPostItem[]>("/tuitions/mine", token, "GET");
}

export async function getApprovedTuitions(): Promise<
  Response<TuitionPostItem[]>
> {
  return await getPromise<TuitionPostItem[]>("/tuitions", "GET");
}

export async function updateTuition(
  id: string,
  data: Partial<TuitionPostItem>
): Promise<Response<null>> {
  return await postPromise<Partial<TuitionPostItem>>(
    `/tuition/${id}`,
    "PATCH",
    data
  );
}

export async function toggleTuitionStatus(
  id: string,
  data: TuitionStatusPayload
): Promise<Response<null>> {
  return await postPromise<TuitionStatusPayload>(
    `/tuition/${id}/status`,
    "PATCH",
    data
  );
}

export async function deleteTuition(id: string): Promise<Response<null>> {
  return await postPromise<null>(`/tuition/${id}`, "DELETE");
}