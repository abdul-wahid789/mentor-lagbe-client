import { Response } from "@/types/server";
import { getPromise } from "../server";
import { User } from "@/types/auth";

export async function getUser(): Promise<Response<User>> {
    return await getPromise<User>('/user')
}