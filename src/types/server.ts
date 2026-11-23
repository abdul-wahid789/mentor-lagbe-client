export interface Response<T> {
  data?: T;
  error: boolean;
  msg: string;
  received?: string;
}

export type Method = "POST" | "DELETE" | "PATCH" | "PUT" | "GET";