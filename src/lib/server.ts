import { Method, Response } from "@/types/server"
import { getClientToken } from "./client-token"

const base_url = process.env.NEXT_PUBLIC_SERVER_URL as string

export async function postPromise<T>(url: string, method: Method, data: T): Promise<Response<null>> {
    const token = await getClientToken()
    try {
        const response = await fetch(`${base_url}${url}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        console.log(response)
        try {
            const data = await response.json()
            return data

        } catch {
            return { error: true, msg: 'JSON Error' }
        }
    } catch (err) {
        return { error: true, msg: 'Server error:' + String(err) }
    }



}