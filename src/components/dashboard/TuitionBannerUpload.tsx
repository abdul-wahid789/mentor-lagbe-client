"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TuitionBannerUploadProps {
  file: File | null;
  error?: string;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}

export function TuitionBannerUpload({
  file,
  error,
  disabled,
  onFileChange,
}: TuitionBannerUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
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
                htmlFor="tuition-banner-input"
                className="cursor-pointer text-xs font-bold text-primary sm:text-sm"
              >
                Add a tuition banner
              </Label>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Optional
              </span>
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
          id="tuition-banner-input"
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