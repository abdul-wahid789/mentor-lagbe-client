import { Method, Response } from "@/types/server";
import { getClientToken } from "./client-token";

const base_url = (process.env.NEXT_PUBLIC_SERVER_URL || "").replace(/\/$/, "");

async function resolveToken(explicitToken?: string): Promise<string> {
  if (typeof explicitToken === "string" && explicitToken.trim().length > 0) {
    return explicitToken.trim();
  }
  return await getClientToken();
}

export async function postPromise<T>(
  url: string,
  method: Method,
  data?: T,
  token?: string
): Promise<Response<null>> {
  const authToken = await resolveToken(token);
  try {
    const response = await fetch(`${base_url}${url}`, {
      method,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
    });

    try {
      const result: Response<null> = await response.json();
      return result;
    } catch {
      return { error: true, msg: "JSON Error" };
    }
  } catch (err) {
    return { error: true, msg: "Server error:" + String(err) };
  }
}

export async function getPromise<T>(
  url: string,
  method: Method = "GET",
  token?: string
): Promise<Response<T>> {
  const authToken = await resolveToken(token);
  try {
    const response = await fetch(`${base_url}${url}`, {
      method,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });
    console.log(response)
    try {
      const result: Response<T> = await response.json();
      return result;
    } catch {
      return { error: true, msg: "JSON Error" };
    }
  } catch (err) {
    return { error: true, msg: "Server error:" + String(err) };
  }
}