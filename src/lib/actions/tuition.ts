import { getPromise, postPromise } from "../server";
import type { Response } from "@/types/server";
import type { TuitionPostItem } from "@/types/dashboard";

export interface TuitionStatusPayload {
  isActive: boolean;
}

export async function createTuition(
  data: TuitionPostItem,
  token?: string
): Promise<Response<null>> {
  return await postPromise<TuitionPostItem>("/tuition", "POST", data, token);
}

export async function getMyTuitions(
  token?: string
): Promise<Response<TuitionPostItem[]>> {
  return await getPromise<TuitionPostItem[]>("/tuitions/mine", "GET", token);
}

export async function getApprovedTuitions(
  token?: string
): Promise<Response<TuitionPostItem[]>> {
  return await getPromise<TuitionPostItem[]>("/tuitions", "GET", token);
}

export async function getTuitionById(
  id: string,
  token?: string
): Promise<Response<TuitionPostItem>> {
  return await getPromise<TuitionPostItem>(`/tuitions/${id}`, "GET", token);
}

export async function updateTuition(
  id: string,
  data: Partial<TuitionPostItem>,
  token?: string
): Promise<Response<null>> {
  return await postPromise<Partial<TuitionPostItem>>(
    `/tuition/${id}`,
    "PATCH",
    data,
    token
  );
}

export async function toggleTuitionStatus(
  id: string,
  data: TuitionStatusPayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<TuitionStatusPayload>(
    `/tuition/${id}/status`,
    "PATCH",
    data,
    token
  );
}

export async function deleteTuition(
  id: string,
  token?: string
): Promise<Response<null>> {
  return await postPromise<undefined>(
    `/tuition/${id}`,
    "DELETE",
    undefined,
    token
  );
}