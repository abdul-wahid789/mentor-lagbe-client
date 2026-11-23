import { postPromise } from "../server";
import type { Response } from "@/types/server";

export type SelectableRole = "student" | "tutor";

export interface SelectRolePayload {
  role: SelectableRole;
}

export async function selectUserRole(
  data: SelectRolePayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<SelectRolePayload>(
    "/user/role",
    "PATCH",
    data,
    token
  );
}