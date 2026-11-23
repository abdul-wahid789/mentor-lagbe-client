import { getPromise, postPromise } from "../server";
import type { Response } from "@/types/server";
import type { PaymentTransactionRecord } from "@/types/dashboard";

export type UpgradePlanKey = "pro-student" | "pro-tutor";

export interface UpgradePlanPayload {
  plan: UpgradePlanKey;
}

export async function planUpgrade(
  data: UpgradePlanPayload
): Promise<Response<null>> {
  return await postPromise<UpgradePlanPayload>("/checkout", "POST", data);
}

export async function getTransactions(): Promise<
  Response<PaymentTransactionRecord[]>
> {
  return await getPromise<PaymentTransactionRecord[]>("/transactions", "GET");
}

export async function getPaidStatus(token: string = ""): Promise<Response<boolean>> {
  return await getPromise<boolean>('/user/paid', token)
}
