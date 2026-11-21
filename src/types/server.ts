export interface Response<T> {
    data?: T,
    error: boolean,
    msg: string
}

export type Method = 'POST' | 'DELETE' | 'PATCH' | 'PUT'