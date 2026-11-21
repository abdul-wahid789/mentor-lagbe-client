import { z } from "zod";
import { validateAvatarFile } from "@/lib/imgbb";

export const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Programming",
  "English & IELTS",
  "Accounting & Finance",
] as const;

export const CLASS_LEVEL_OPTIONS = [
  "Class 6–8",
  "Class 9–10 (SSC)",
  "Class 11–12 (HSC)",
  "Programming",
  "Admission",
] as const;

export const MODE_OPTIONS = ["Online", "Home"] as const;

export const DAYS_PER_WEEK_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

export const postTuitionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tuition title is required.")
    .min(4, "Title must be at least 4 characters.")
    .max(100, "Title must not exceed 100 characters."),
  subject: z.string().min(1, "Please select a subject."),
  classLevel: z.string().min(1, "Please select a class level."),
  mode: z.enum(["Online", "Home"], {
    message: "Please choose Online or Home tuition.",
  }),
  location: z
    .string()
    .trim()
    .min(1, "Location or meeting link is required.")
    .min(3, "Enter a valid meeting link or address."),
  monthlyFee: z.coerce
    .number({ error: "Monthly fee must be a valid number." })
    .min(500, "Monthly fee must be at least ৳500.")
    .max(200000, "Monthly fee seems too high."),
  daysPerWeek: z.coerce
    .number({ error: "Select days per week." })
    .int()
    .min(1, "At least 1 day per week.")
    .max(7, "At most 7 days per week."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .min(20, "Write at least 20 characters explaining your batch or mentorship.")
    .max(1500, "Description must not exceed 1500 characters."),
  bannerFile: z
    .custom<File | null>((val) => val === null || val instanceof File)
    .refine((file) => {
      if (!file) return true;
      return validateAvatarFile(file) === null;
    }, "Banner must be a JPG, PNG, WebP, or GIF image up to 5 MB."),
});

export type PostTuitionFormInput = z.input<typeof postTuitionSchema>;
export type PostTuitionFormValues = z.output<typeof postTuitionSchema>;