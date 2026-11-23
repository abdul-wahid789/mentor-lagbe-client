import { getPromise, postPromise } from "../server";
import type { Response } from "@/types/server";
import type { PaymentTransactionRecord } from "@/types/dashboard";

export type UpgradePlanKey = "pro-student" | "pro-tutor";

export interface UpgradePlanPayload {
  plan: UpgradePlanKey;
}

export interface PaidStatusData {
  isPro: boolean;
  plan: "free" | "pro";
  latestPayment: PaymentTransactionRecord | null;
  payments: PaymentTransactionRecord[];
}

export async function planUpgrade(
  data: UpgradePlanPayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<UpgradePlanPayload>("/checkout", "POST", data, token);
}

export async function getTransactions(
  token?: string
): Promise<Response<PaymentTransactionRecord[]>> {
  return await getPromise<PaymentTransactionRecord[]>(
    "/transactions",
    "GET",
    token
  );
}

export async function getPaidStatus(
  token?: string
): Promise<Response<PaidStatusData>> {
  return await getPromise<PaidStatusData>("/user/paid", "GET", token);
}