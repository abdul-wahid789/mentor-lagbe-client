import { headers } from "next/headers"
import { auth } from "../auth"

export async function getServerSession() {
    "use server"
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session
}