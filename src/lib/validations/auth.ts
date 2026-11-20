import { z } from "zod";
import { validateAvatarFile } from "@/lib/imgbb";

export const signupSchema = z
  .object({
    role: z.enum(["student", "tutor"], {
      message: "Please select whether you are a Student or a Tutor.",
    }),
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .min(2, "Full name must be at least 2 characters.")
      .max(80, "Full name must not exceed 80 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required.")
      .email("Please enter a valid email address."),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(64, "Password must not exceed 64 characters.")
      .refine((val) => !/\s/.test(val), "Password cannot contain spaces.")
      .refine(
        (val) => /[A-Z]/.test(val),
        "Include at least one uppercase letter (A–Z)."
      )
      .refine(
        (val) => /[a-z]/.test(val),
        "Include at least one lowercase letter (a–z)."
      )
      .refine(
        (val) => /[0-9]/.test(val),
        "Include at least one number (0–9)."
      )
      .refine(
        (val) => /[^A-Za-z0-9]/.test(val),
        "Include at least one special character (e.g. @, #, $, !)."
      ),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    avatarFile: z
      .custom<File | null>((val) => val === null || val instanceof File)
      .refine((file) => {
        if (!file) return true;
        return validateAvatarFile(file) === null;
      }, "Please upload a valid image (JPG, PNG, WebP, or GIF) up to 5 MB."),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    const emailUser = data.email.trim().split("@")[0]?.toLowerCase() ?? "";
    if (
      emailUser.length >= 3 &&
      data.password.toLowerCase().includes(emailUser)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password should not contain your email username.",
      });
    }
  });

export type SignupSchemaValues = z.infer<typeof signupSchema>;


export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean(),
});

export type SigninSchemaValues = z.infer<typeof signinSchema>;