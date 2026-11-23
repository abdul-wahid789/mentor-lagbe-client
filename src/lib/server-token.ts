import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerToken(): Promise<string> {
  try {
    const res = await auth.api.getToken({
      headers: await headers(),
    });
    return typeof res?.token === "string" ? res.token : "";
  } catch {
    return "";
  }
}