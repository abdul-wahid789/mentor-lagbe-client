import { getPromise, postPromise } from "../server";
import type { Response } from "@/types/server";
import type {
  ApplicationStatus,
  StudentApplicationItem,
} from "@/types/dashboard";

export interface ApplyTuitionPayload {
  tuitionId: string;
  tutorEmail?: string;
  studentEmail?: string;
  preferredSchedule: string;
  phone: string;
  note?: string;
}

export interface BookmarkPayload {
  tuitionId: string;
}

export interface BookmarkRecord {
  id: string;
  tuitionId: string;
  studentEmail: string;
  createdAt?: string;
}

export interface UpdateApplicationStatusPayload {
  status: Extract<ApplicationStatus, "accepted" | "rejected">;
}

export async function applyToTuition(
  data: ApplyTuitionPayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<ApplyTuitionPayload>(
    "/applications",
    "POST",
    data,
    token
  );
}

export async function getMyApplications(
  token?: string
): Promise<Response<StudentApplicationItem[]>> {
  return await getPromise<StudentApplicationItem[]>(
    "/applications/mine",
    "GET",
    token
  );
}
export async function deleteApplication(
  applicationId: string,
  token?: string
): Promise<Response<null>> {
  return await postPromise<undefined>(
    `/applications/${applicationId}`,
    "DELETE",
    undefined,
    token
  );
}

export async function getTutorApplicants(
  token?: string
): Promise<Response<StudentApplicationItem[]>> {
  return await getPromise<StudentApplicationItem[]>(
    "/applications/tutor",
    "GET",
    token
  );
}

export async function updateApplicationStatus(
  id: string,
  data: UpdateApplicationStatusPayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<UpdateApplicationStatusPayload>(
    `/applications/${id}/status`,
    "PATCH",
    data,
    token
  );
}

export async function getMyBookmarks(
  token?: string
): Promise<Response<BookmarkRecord[]>> {
  return await getPromise<BookmarkRecord[]>("/bookmarks/mine", "GET", token);
}

export async function addTuitionBookmark(
  data: BookmarkPayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<BookmarkPayload>("/bookmarks", "POST", data, token);
}

export async function removeTuitionBookmark(
  tuitionId: string,
  token?: string
): Promise<Response<null>> {
  return await postPromise<undefined>(
    `/bookmarks/${tuitionId}`,
    "DELETE",
    undefined,
    token
  );
}