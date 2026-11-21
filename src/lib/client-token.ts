import { authClient } from "@/lib/auth-client"

export async function getClientToken():Promise<string> {
    const { data, error } = await authClient.token()
    if (data) {
        const jwtToken = data.token
        return jwtToken
    }
    return ""

}