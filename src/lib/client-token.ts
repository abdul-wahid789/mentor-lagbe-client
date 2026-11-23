import { authClient } from "@/lib/auth-client";

export async function getClientToken(): Promise<string> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    return "";
  }
  return data.token;
}