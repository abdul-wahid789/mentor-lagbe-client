import { TuitionPostItem } from "@/types/dashboard";
import { postPromise } from "../server";
import { Response } from "@/types/server";

export async function createTuition(data: TuitionPostItem):Promise<Response<null>>{
    return await postPromise<TuitionPostItem>('/tuition', 'POST', data)
}