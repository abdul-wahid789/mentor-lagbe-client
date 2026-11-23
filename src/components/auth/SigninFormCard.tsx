"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  signinSchema,
  type SigninSchemaValues,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";

export function SigninFormCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SigninSchemaValues>({
    resolver: zodResolver(signinSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const isBusy = isSubmitting || isGoogleLoading;

  const onSubmit = async (values: SigninSchemaValues) => {
    setFormError(null);

    try {
      const { error } = await authClient.signIn.email({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: callbackUrl,
      });

      if (error) {
        const message =
          error.message || "Invalid email or password. Please try again.";
        setFormError(message);
        showErrorToast(message);
        return;
      }

      showSuccessToast("Welcome back! Redirecting...");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not sign in right now.";
      setFormError(message);
      showErrorToast(message);
    }
  };

  const onInvalid = () => {
    setFormError("Please enter a valid email address and password.");
    showErrorToast("Please check your sign-in details.");
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (error) {
        const message =
          error.message || "Google sign-in failed. Please try again.";
        setFormError(message);
        showErrorToast(message);
        setIsGoogleLoading(false);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to start Google sign-in.";
      setFormError(message);
      showErrorToast(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Good to see you again.
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Sign in to keep your momentum going.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-destructive/35 bg-destructive-tint p-3 text-xs font-medium text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={handleGoogleSignIn}
          className="h-10 w-full border-border bg-background/70 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-secondary/50"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <FcGoogle className="mr-2 h-4 w-4" />
              <span>Continue with Google</span>
            </>
          )}
        </Button>

        {/* Clean Divider */}
        <div className="relative py-0.5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-card px-2.5 text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          className="space-y-4"
        >
          <FieldGroup className="space-y-4">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signin-email"
                    className="text-xs font-semibold text-foreground"
                  >
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    disabled={isBusy}
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

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="signin-password"
                    className="text-xs font-semibold text-foreground"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={isBusy}
                      placeholder="Enter your password"
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
                      disabled={isBusy}
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
                </Field>
              )}
            />
          </FieldGroup>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <label
                  htmlFor="signin-remember"
                  className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-primary select-none"
                >
                  <Checkbox
                    id="signin-remember"
                    checked={field.value}
                    disabled={isBusy}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                    className="border-primary/50 data-[checked]:bg-primary data-[checked]:text-primary-foreground"
                  />
                  <span>Remember me</span>
                </label>
              )}
            />

            {/* <Button
              variant="link"
              size="sm"
              nativeButton={false}
              className="h-auto p-0 text-xs font-medium text-primary hover:underline underline-offset-2"
              render={<Link href="/forgot-password">Forgot password?</Link>}
            /> */}
          </div>

          <Button
            type="submit"
            disabled={isBusy}
            className="h-10 w-full font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="pt-1 text-xs font-medium text-primary text-center">
            New to MentorLagbe?{" "}
            <Button
              variant="link"
              size="sm"
              nativeButton={false}
              className="h-auto p-0 text-xs font-medium text-primary underline underline-offset-2"
              render={<Link href="/register">Create an account</Link>}
            />
          </p>
        </form>
      </CardContent>
    </Card>
  );
}