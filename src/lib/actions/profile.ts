import { postPromise } from "../server";
import type { Response } from "@/types/server";

export interface UpdateProfilePayload {
  name: string;
  phone?: string;
  bio?: string;
  image?: string;
}

export async function updateUserProfile(
  data: UpdateProfilePayload,
  token?: string
): Promise<Response<null>> {
  return await postPromise<UpdateProfilePayload>(
    "/user/profile",
    "PATCH",
    data,
    token
  );
}