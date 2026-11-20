export type SignupRole = "student" | "tutor";

export interface SignupFormValues {
  role: SignupRole;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarFile: File | null;
}

export type SignupFieldErrors = Partial<
  Record<
    "fullName" | "email" | "password" | "confirmPassword" | "avatar",
    string
  >
>;