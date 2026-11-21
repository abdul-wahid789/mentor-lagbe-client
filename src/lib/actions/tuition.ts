import { TuitionPostItem } from "@/types/dashboard";
import { postPromise } from "../server";

export async function createTuition(data: TuitionPostItem){
    console.log(data)
    await postPromise<TuitionPostItem>('/tuition', 'POST', data)
}