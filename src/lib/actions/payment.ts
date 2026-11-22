import { postPromise } from "../server";
import type { Response } from "@/types/server";

export type UpgradePlanKey = "pro-student" | "pro-tutor";

export interface UpgradePlanPayload {
  plan: UpgradePlanKey;
}

export async function planUpgrade(
  data: UpgradePlanPayload
): Promise<Response<null>> {
  return await postPromise<UpgradePlanPayload>("/checkout", "POST", data);
}