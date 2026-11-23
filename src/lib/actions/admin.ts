import { getPromise, postPromise } from "../server";
import type { Response } from "@/types/server";
import type {
  PaymentTransactionRecord,
  TuitionPostItem,
  UserRole,
} from "@/types/dashboard";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: "free" | "pro";
  phone?: string;
  image?: string;
  createdAt?: string;
}

export interface UpdateTuitionApprovalPayload {
  approvalStatus: "approved" | "rejected";
}

export async function getAllUsers(
  token?: string
): Promise<Response<AdminUserRecord[]>> {
  return await getPromise<AdminUserRecord[]>("/admin/users", "GET", token);
}

export async function getAllTuitionsAdmin(
  token?: string
): Promise<Response<TuitionPostItem[]>> {
  return await getPromise<TuitionPostItem[]>("/admin/tuitions", "GET", token);
}

export async function getAllTransactionsAdmin(
  token?: string
): Promise<Response<PaymentTransactionRecord[]>> {
  return await getPromise<PaymentTransactionRecord[]>(
    "/transactions",
    "GET",
    token
  );
}

export interface UpdateUserRolePayload {
  role: UserRole;
}

export async function updateUserRole(
  userId: string,
  data: UpdateUserRolePayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<UpdateUserRolePayload>(
    `/admin/users/${userId}/role`,
    "PATCH",
    data,
    token
  );
}

export interface UpdateTuitionApprovalPayload {
  approvalStatus: "approved" | "rejected";
  rejectionNote?: string;
}

export async function updateTuitionApproval(
  tuitionId: string,
  data: UpdateTuitionApprovalPayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<UpdateTuitionApprovalPayload>(
    `/admin/tuitions/${tuitionId}/approval`,
    "PATCH",
    data,
    token
  );
}