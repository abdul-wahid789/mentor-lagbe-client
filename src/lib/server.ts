import { Method, Response } from "@/types/server";
import { getClientToken } from "./client-token";

const base_url = process.env.NEXT_PUBLIC_SERVER_URL as string;

export async function postPromise<T>(
  url: string,
  method: Method,
  data?: T
): Promise<Response<null>> {
  const token = await getClientToken();
  try {
    const response = await fetch(`${base_url}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  token: string,
  method: Method = "GET"
): Promise<Response<T>> {
  if(!token)
    token = await getClientToken();
  try {
    const response = await fetch(`${base_url}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    console.log("token", token)
    console.log(url, response)
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