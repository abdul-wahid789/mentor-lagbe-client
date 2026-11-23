import { Response } from "@/types/server";
import { getPromise } from "../server";
import { User } from "@/types/auth";

export async function getUser(token: string = ""): Promise<Response<User>> {
    return await getPromise<User>('/user', "GET", token)
}