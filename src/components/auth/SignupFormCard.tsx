"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient, signUp } from "@/lib/auth-client";
import { uploadAvatarToImgBB } from "@/lib/imgbb";
import {
  signupSchema,
  type SignupSchemaValues,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AvatarUploadField } from "./AvatarUploadField";
import { RoleSelector } from "./RoleSelector";
import { zodResolver } from "@hookform/resolvers/zod";

const PASSWORD_RULES = [
  {
    id: "length",
    label: "8+ characters",
    test: (pw: string) => pw.length >= 8 && pw.length <= 64,
  },
  {
    id: "uppercase",
    label: "Uppercase (A–Z)",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    id: "lowercase",
    label: "Lowercase (a–z)",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    id: "number",
    label: "Number (0–9)",
    test: (pw: string) => /[0-9]/.test(pw),
  },
  {
    id: "special",
    label: "Special character (!@#$)",
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw) && !/\s/.test(pw),
  },
];

export function SignupFormCard() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const form = useForm<SignupSchemaValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      role: "student",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatarFile: null,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;

  const passwordValue = watch("password");

  const onSubmit = async (values: SignupSchemaValues) => {
    setFormError(null);

    try {
      let uploadedImageUrl: string | undefined;

      if (values.avatarFile) {
        setStatusText("Uploading profile photo...");
        uploadedImageUrl = await uploadAvatarToImgBB(values.avatarFile);
      }

      setStatusText("Creating your account...");
      const { error } = await signUp.email({
        name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        ...(uploadedImageUrl ? { image: uploadedImageUrl } : {}),
        role: values.role,
      } as Parameters<typeof authClient.signUp.email>[0] & {
        role: SignupSchemaValues["role"];
      });

      if (error) {
        const message =
          error.message || "Could not create your account. Please try again.";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong during sign up.";
      setFormError(message);
      toast.error(message);
    } finally {
      setStatusText(null);
    }
  };

  const onInvalid = () => {
    setFormError("Please fix the highlighted fields before continuing.");
    toast.error("Please check your form details.");
  };

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          A fresh start. A brighter future.
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Create your free MentorLagbe account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {formError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/35 bg-destructive-tint p-3 text-xs font-medium text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          className="space-y-4"
        >
          <FieldGroup className="space-y-4">
            {/* Role Selector */}
            <Controller
              name="role"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <RoleSelector
                    value={field.value}
                    onChange={(role) => {
                      field.onChange(role);
                      if (formError) setFormError(null);
                    }}
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Full Name */}
            <Controller
              name="fullName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-full-name"
                    className="text-xs font-semibold text-foreground"
                  >
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-full-name"
                    type="text"
                    autoComplete="name"
                    disabled={isSubmitting}
                    placeholder="Your full name"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      field.onChange(e);
                      if (formError) setFormError(null);
                    }}
                    className={cn(
                      "h-10 bg-background/60",
                      fieldState.invalid &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription className="text-xs font-medium text-primary">
                      Free plan included · No payment details needed
                    </FieldDescription>
                  )}
                </Field>
              )}
            />

            {/* Optional Profile Photo via ImgBB */}
            <Controller
              name="avatarFile"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <AvatarUploadField
                    file={field.value}
                    error={fieldState.error?.message}
                    disabled={isSubmitting}
                    onFileChange={(file) => {
                      field.onChange(file);
                      field.onBlur();
                      if (formError) setFormError(null);
                    }}
                  />
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-email"
                    className="text-xs font-semibold text-foreground"
                  >
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      field.onChange(e);
                      if (formError) setFormError(null);
                    }}
                    className={cn(
                      "h-10 bg-background/60",
                      fieldState.invalid &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-password"
                    className="text-xs font-semibold text-foreground"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      placeholder="Create a password (8+ characters)"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        field.onChange(e);
                        if (formError) setFormError(null);
                      }}
                      className={cn(
                        "h-10 bg-background/60 pr-10",
                        fieldState.invalid &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}

                  {passwordValue.length > 0 && (
                    <ul className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(passwordValue);
                        return (
                          <li
                            key={rule.id}
                            className={cn(
                              "flex items-center gap-1.5 transition-colors",
                              passed
                                ? "font-medium text-success"
                                : "text-muted-foreground"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 shrink-0 rounded-full",
                                passed ? "bg-success" : "bg-border"
                              )}
                            />
                            <span>{rule.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signup-confirm-password"
                    className="text-xs font-semibold text-foreground"
                  >
                    Confirm password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      placeholder="Re-enter your password"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        field.onChange(e);
                        if (formError) setFormError(null);
                      }}
                      className={cn(
                        "h-10 bg-background/60 pr-10",
                        fieldState.invalid &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
{/*
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            .
          </p> */}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>{statusText || "Creating account..."}</span>
              </>
            ) : (
              <>
                <span>Create free account</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="pt-1 text-xs font-medium text-center text-primary">
            Already have an account?{" "}
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs font-medium text-primary underline underline-offset-2"
              nativeButton={false}
              render={<Link href="/login">Sign in</Link>}
            />
          </p>
        </form>
      </CardContent>
    </Card>
  );
}