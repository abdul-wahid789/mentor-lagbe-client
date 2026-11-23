export type SignupRole = "student" | "tutor";

export interface SignupFormValues {
  role: SignupRole;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarFile: File | null;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: SignupRole | "admin";
  plan?: "free" | "pro";
}

export type SignupFieldErrors = Partial<
  Record<
    "fullName" | "email" | "password" | "confirmPassword" | "avatar",
    string
  >
>;