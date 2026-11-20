"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Camera, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AvatarUploadFieldProps {
  file: File | null;
  error?: string;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}

export function AvatarUploadField({
  file,
  error,
  disabled,
  onFileChange,
}: AvatarUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onFileChange(selected);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label
          htmlFor="avatar-upload"
          className="text-xs font-semibold text-foreground"
        >
          Profile photo
        </Label>
        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Optional
        </span>
      </div>

      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border bg-background/70 p-3 transition-colors",
          error
            ? "border-destructive bg-destructive-tint/30"
            : "border-border hover:border-primary/40"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Selected profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/logo.png"
                alt="Default profile placeholder"
                width={28}
                height={28}
                className="h-7 w-7 object-contain opacity-75"
              />
            )}
          </div>

          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-xs font-medium text-foreground">
              {file ? file.name : "Add a photo so tutors & students recognize you"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {file
                ? `${(file.size / 1024).toFixed(0)} KB · Ready to upload`
                : "JPG, PNG, WebP or GIF · Max 5 MB"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <input
            ref={inputRef}
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={disabled}
            onChange={handleInputChange}
            className="sr-only"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="h-8 border-border bg-card px-2.5 text-xs font-medium hover:border-primary/40"
          >
            {file ? (
              <>
                <Camera className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Change
              </>
            ) : (
              <>
                <UploadCloud className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Upload
              </>
            )}
          </Button>

          {file && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label="Remove selected photo"
              onClick={() => onFileChange(null)}
              className="h-8 w-8 text-muted-foreground hover:bg-destructive-tint hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}