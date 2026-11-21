import { Method } from "@/types/server"
import { getClientToken } from "./client-token"

const base_url = process.env.NEXT_PUBLIC_SERVER_URL as string

export async function postPromise<T>(url: string, method: Method, data: T) {
    const token = await getClientToken()
    console.log(token)
    const response = await fetch(`${base_url}${url}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify(data)
    })
    console.log(response)

}