"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertCircle,
    ArrowRight,
    ImagePlus,
    Loader2,
    Lock,
    Sparkles,
    Trash2,
    Upload,
} from "lucide-react";
import { toast } from "sonner";
import { uploadAvatarToImgBB } from "@/lib/imgbb";
import {
    CLASS_LEVEL_OPTIONS,
    DAYS_PER_WEEK_OPTIONS,
    MODE_OPTIONS,
    postTuitionSchema,
    SUBJECT_OPTIONS,
    type PostTuitionFormInput,
    type PostTuitionFormValues,
} from "@/lib/validations/tuition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { DashboardUser } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { useEffect, useRef, type ChangeEvent } from "react";
import { createTuition } from "@/lib/actions/tuition";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";

interface PostTuitionFormProps {
    user: DashboardUser;
    existingTuitionsCount: number;
}

function BannerUploaderInline({
    file,
    error,
    disabled,
    onFileChange,
}: {
    file: File | null;
    error?: string;
    disabled?: boolean;
    onFileChange: (file: File | null) => void;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        onFileChange(selected);
        e.target.value = "";
    };

    return (
        <div className="space-y-1.5">
            <div
                className={cn(
                    "rounded-xl border bg-background/70 p-4 transition-colors",
                    error
                        ? "border-destructive bg-destructive-tint/30"
                        : "border-border hover:border-primary/40"
                )}
            >
                {previewUrl ? (
                    <div className="space-y-3">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewUrl}
                                alt="Tuition banner preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-foreground">
                                    {file?.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    {file ? `${(file.size / 1024).toFixed(0)} KB · Ready for ImgBB` : ""}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={disabled}
                                    onClick={() => inputRef.current?.click()}
                                    className="h-8 px-3 text-xs font-medium text-primary"
                                >
                                    Change image
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={disabled}
                                    onClick={() => onFileChange(null)}
                                    className="h-8 border-destructive/25 bg-destructive-tint/60 px-2.5 text-xs font-medium text-destructive"
                                >
                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Upload className="h-4 w-4 shrink-0" />
                            <Label
                                htmlFor="tuition-banner-file"
                                className="cursor-pointer text-xs font-bold text-primary sm:text-sm"
                            >
                                Add a tuition banner
                            </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Upload to ImgBB · JPG or PNG, up to 5 MB
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Recommended aspect ratio 16:9
                        </p>
                        <div className="pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                                onClick={() => inputRef.current?.click()}
                                className="h-8 border-primary/25 bg-card px-3 text-xs font-semibold text-primary hover:bg-secondary/60"
                            >
                                <ImagePlus className="mr-1.5 h-3.5 w-3.5" />
                                Choose image
                            </Button>
                        </div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    id="tuition-banner-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={disabled}
                    onChange={handleSelect}
                    className="sr-only"
                />
            </div>

            {error && (
                <p role="alert" className="text-xs font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

export function PostTuitionForm({
    user,
    existingTuitionsCount,
}: PostTuitionFormProps) {
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);
    const [statusText, setStatusText] = useState<string | null>(null);

    const isPro = user.plan === "pro";
    const hasReachedFreeLimit = !isPro && existingTuitionsCount >= 2;

    const resolver = zodResolver(postTuitionSchema) as Resolver<
        PostTuitionFormInput,
        unknown,
        PostTuitionFormValues
    >;

    const form = useForm<PostTuitionFormInput, unknown, PostTuitionFormValues>({
        resolver,
        mode: "onTouched",
        defaultValues: {
            title: "",
            subject: "",
            classLevel: "",
            mode: "Online",
            location: "",
            monthlyFee: 3500,
            daysPerWeek: 3,
            description: "",
            bannerFile: null,
        },
    });

    const {
        control,
        handleSubmit,
        watch,
        formState: { isSubmitting },
    } = form;

    const selectedMode = watch("mode");
    const isBusy = isSubmitting || hasReachedFreeLimit;

    const onSubmit = async (values: PostTuitionFormValues) => {
        setFormError(null);

        if (hasReachedFreeLimit) {
            const msg =
                "Free Plan tutors can create up to 2 tuition posts. Upgrade to Pro Tutor for unlimited posts.";
            setFormError(msg);
            toast.error(msg);
            return;
        }

        try {
            let bannerUrl: string | undefined;

            if (values.bannerFile) {
                setStatusText("Uploading banner to ImgBB...");
                bannerUrl = await uploadAvatarToImgBB(values.bannerFile);
            }

            setStatusText("Submitting tuition for approval...");
            const data = {
                title: values.title.trim(),
                subject: values.subject,
                classLevel: values.classLevel,
                mode: values.mode,
                location: values.location.trim(),
                monthlyFee: values.monthlyFee,
                daysPerWeek: values.daysPerWeek,
                description: values.description.trim(),
                ...(bannerUrl ? { bannerUrl } : {}),
                isActive: true,
            }

            // export interface TuitionPostItem {

            //   approvalStatus: ApprovalStatus;
            //   isActive: boolean;
            //   applicantsCount: number;
            //   createdAt: string;
            // }


            const response = await createTuition(data)
            if (response.error) {
                showErrorToast(response.msg);
            }

            showSuccessToast("Tuition submitted for Admin approval!");
            // router.push("/dashboard/tutor/my-tuitions");
            // router.refresh();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Could not submit tuition.";
            setFormError(message);
            showErrorToast(message);
        } finally {
            setStatusText(null);
        }
    };

    const onInvalid = () => {
        setFormError("Please complete all required fields before submitting.");
        showErrorToast("Please fix the highlighted fields.");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Share what you know.
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create a tuition that helps the right students find you.
                    </p>
                </div>
                <Badge
                    variant="secondary"
                    className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
                >
                    Tutor
                </Badge>
            </div>

            <Card
                className={cn(
                    "border shadow-none",
                    hasReachedFreeLimit
                        ? "border-warning/35 bg-warning-tint/70"
                        : "border-primary/20 bg-secondary/65"
                )}
            >
                <CardContent className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center sm:px-5">
                    <div className="space-y-0.5">
                        <p
                            className={cn(
                                "flex items-center gap-1.5 text-xs font-bold sm:text-sm",
                                hasReachedFreeLimit ? "text-warning" : "text-primary"
                            )}
                        >
                            {hasReachedFreeLimit ? (
                                <Lock className="h-3.5 w-3.5" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5" />
                            )}
                            <span>
                                {isPro
                                    ? "Pro Tutor · Unlimited possibilities"
                                    : `Free Tutor · ${existingTuitionsCount}/2 tuition posts used`}
                            </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Your plan includes unlimited posts. Free Tutors can publish up to 2
                            tuitions.
                        </p>
                    </div>

                    {!isPro && (
                        <Button
                            size="sm"
                            className="h-8 shrink-0 px-3.5 text-xs font-semibold"
                            render={<Link href="/#pricing">Upgrade to Pro</Link>}
                        />
                    )}
                </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-xs">
                <CardContent className="space-y-5 p-5 sm:p-7">
                    <h2 className="text-lg font-bold text-foreground">Tuition details</h2>

                    {formError && (
                        <div
                            role="alert"
                            className="flex items-start gap-2.5 rounded-xl border border-destructive/35 bg-destructive-tint p-3 text-xs font-medium text-destructive"
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
                            {/* Tuition Title */}
                            <Controller
                                name="title"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="tuition-title"
                                            className="text-xs font-semibold text-foreground"
                                        >
                                            Tuition title
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="tuition-title"
                                            disabled={isBusy}
                                            placeholder="e.g. Mathematics, made simple"
                                            aria-invalid={fieldState.invalid}
                                            className={cn(
                                                "h-10 bg-background/70",
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

                            {/* Subject & Class Level (shadcn Select) */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="subject"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel
                                                htmlFor="tuition-subject"
                                                className="text-xs font-semibold text-foreground"
                                            >
                                                Subject
                                            </FieldLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={(val) => {
                                                    field.onChange(val ?? "");
                                                    field.onBlur();
                                                }}
                                                disabled={isBusy}
                                            >
                                                <SelectTrigger
                                                    id="tuition-subject"
                                                    aria-invalid={fieldState.invalid}
                                                    className={cn(
                                                        "h-10 w-full bg-background/70",
                                                        fieldState.invalid && "border-destructive"
                                                    )}
                                                >
                                                    <SelectValue placeholder="Select subject" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SUBJECT_OPTIONS.map((subj) => (
                                                        <SelectItem key={subj} value={subj}>
                                                            {subj}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="classLevel"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel
                                                htmlFor="tuition-class-level"
                                                className="text-xs font-semibold text-foreground"
                                            >
                                                Class level
                                            </FieldLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={(val) => {
                                                    field.onChange(val ?? "");
                                                    field.onBlur();
                                                }}
                                                disabled={isBusy}
                                            >
                                                <SelectTrigger
                                                    id="tuition-class-level"
                                                    aria-invalid={fieldState.invalid}
                                                    className={cn(
                                                        "h-10 w-full bg-background/70",
                                                        fieldState.invalid && "border-destructive"
                                                    )}
                                                >
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CLASS_LEVEL_OPTIONS.map((lvl) => (
                                                        <SelectItem key={lvl} value={lvl}>
                                                            {lvl}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            {/* Learning Mode (shadcn Select) & Location */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="mode"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel
                                                htmlFor="tuition-mode"
                                                className="text-xs font-semibold text-foreground"
                                            >
                                                Learning mode
                                            </FieldLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={(val) => {
                                                    if (val === "Online" || val === "Home") {
                                                        field.onChange(val);
                                                    }
                                                    field.onBlur();
                                                }}
                                                disabled={isBusy}
                                            >
                                                <SelectTrigger
                                                    id="tuition-mode"
                                                    aria-invalid={fieldState.invalid}
                                                    className={cn(
                                                        "h-10 w-full bg-background/70",
                                                        fieldState.invalid && "border-destructive"
                                                    )}
                                                >
                                                    <SelectValue placeholder="Select mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MODE_OPTIONS.map((m) => (
                                                        <SelectItem key={m} value={m}>
                                                            {m}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="location"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel
                                                htmlFor="tuition-location"
                                                className="text-xs font-semibold text-foreground"
                                            >
                                                Location / meeting link
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="tuition-location"
                                                disabled={isBusy}
                                                placeholder={
                                                    selectedMode === "Online"
                                                        ? "Google Meet or physical address"
                                                        : "e.g. Dhanmondi, Mirpur, or Savar"
                                                }
                                                aria-invalid={fieldState.invalid}
                                                className={cn(
                                                    "h-10 bg-background/70",
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
                            </div>

                            {/* Monthly Fee & Days per Week (shadcn Select) */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Controller
                                    name="monthlyFee"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel
                                                htmlFor="tuition-fee"
                                                className="text-xs font-semibold text-foreground"
                                            >
                                                Monthly fee (BDT)
                                            </FieldLabel>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
                                                    ৳
                                                </span>
                                                <Input
                                                    id="tuition-fee"
                                                    type="number"
                                                    min={0}
                                                    step={100}
                                                    disabled={isBusy}
                                                    value={
                                                        typeof field.value === "number" ||
                                                            typeof field.value === "string"
                                                            ? field.value
                                                            : ""
                                                    }
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    onBlur={field.onBlur}
                                                    aria-invalid={fieldState.invalid}
                                                    className={cn(
                                                        "h-10 bg-background/70 pl-7 font-mono tabular-nums",
                                                        fieldState.invalid &&
                                                        "border-destructive focus-visible:ring-destructive"
                                                    )}
                                                />
                                            </div>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="daysPerWeek"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel
                                                htmlFor="tuition-days"
                                                className="text-xs font-semibold text-foreground"
                                            >
                                                Days per week
                                            </FieldLabel>
                                            <Select
                                                value={String(field.value ?? 3)}
                                                onValueChange={(val) => {
                                                    field.onChange(Number(val));
                                                    field.onBlur();
                                                }}
                                                disabled={isBusy}
                                            >
                                                <SelectTrigger
                                                    id="tuition-days"
                                                    aria-invalid={fieldState.invalid}
                                                    className={cn(
                                                        "h-10 w-full bg-background/70",
                                                        fieldState.invalid && "border-destructive"
                                                    )}
                                                >
                                                    <SelectValue placeholder="Select days" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DAYS_PER_WEEK_OPTIONS.map((d) => (
                                                        <SelectItem key={d} value={String(d)}>
                                                            {d} {d === 1 ? "day" : "days"}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            {/* Description */}
                            <Controller
                                name="description"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="tuition-description"
                                            className="text-xs font-semibold text-foreground"
                                        >
                                            Description
                                        </FieldLabel>
                                        <textarea
                                            {...field}
                                            id="tuition-description"
                                            rows={4}
                                            disabled={isBusy}
                                            placeholder="Describe your teaching style, learning goals, and schedule..."
                                            aria-invalid={fieldState.invalid}
                                            className={cn(
                                                "w-full rounded-xl border border-input bg-background/70 p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
                                                fieldState.invalid && "border-destructive"
                                            )}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Banner Upload */}
                            <Controller
                                name="bannerFile"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <BannerUploaderInline
                                            file={field.value ?? null}
                                            error={fieldState.error?.message}
                                            disabled={isBusy}
                                            onFileChange={(file) => {
                                                field.onChange(file);
                                                field.onBlur();
                                            }}
                                        />
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <p className="text-xs text-muted-foreground">
                            New tuitions are reviewed by an Admin before appearing in Browse.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Button
                                type="submit"
                                disabled={isBusy}
                                className="h-10 px-5 text-xs font-semibold sm:text-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>{statusText || "Submitting..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit for approval</span>
                                        <ArrowRight className="ml-1.5 h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                disabled={isSubmitting}
                                className="h-10 border-primary/25 px-4 text-xs font-semibold text-primary sm:text-sm"
                                render={<Link href="/dashboard/tutor">Cancel</Link>}
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}