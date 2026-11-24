"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/lib/actions/profile";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DashboardUser } from "@/types/dashboard";

interface MyProfileClientProps {
  user: DashboardUser;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "MW";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatRoleLabel(role: DashboardUser["role"]): string {
  if (role === "tutor") return "Tutor";
  if (role === "admin") return "Admin";
  return "Student";
}

function formatPlanLabel(plan: DashboardUser["plan"]): string {
  return plan === "pro" ? "Pro" : "Free";
}

export function MyProfileClient({ user }: MyProfileClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fullName, setFullName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [bio, setBio] = useState(user.bio || "");
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImgBBChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showErrorToast("Please choose a JPG or PNG image.");
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      showErrorToast("Image must be 5 MB or smaller.");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      showErrorToast("ImgBB API key is not configured.");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const json = await response.json();
      const uploadedUrl = json?.data?.url || json?.data?.display_url;

      if (!response.ok || !json?.success || !uploadedUrl) {
        showErrorToast(json?.error?.message || "ImgBB upload failed.");
        return;
      }

      setImageUrl(String(uploadedUrl));
      showSuccessToast("Photo uploaded to ImgBB.");
    } catch {
      showErrorToast("Could not upload photo right now.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleReset = () => {
    setFullName(user.name || "");
    setPhone(user.phone || "");
    setBio(user.bio || "");
    setImageUrl(user.image || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showErrorToast("Full name is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await updateUserProfile({
        name: fullName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        image: imageUrl.trim(),
      });

      if (res.error) {
        showErrorToast(res.msg || "Could not update profile.");
        return;
      }

      showSuccessToast("Profile updated.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const displayName = fullName.trim() || user.name || "Member";
  const activeAvatar = imageUrl.trim() || user.image || "";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Make yourself known.
        </h1>
        <p className="text-sm text-muted-foreground">
          Keep your profile up to date across MentorLagbe.
        </p>
      </div>

      {/* Avatar Summary Card */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {activeAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeAvatar}
                alt={displayName}
                className="h-16 w-16 shrink-0 rounded-full border border-border object-cover sm:h-20 sm:w-20"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-bold text-primary sm:h-20 sm:w-20">
                {getInitials(displayName)}
              </div>
            )}

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                {displayName}
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {user.email} · {formatRoleLabel(user.role)} ·{" "}
                {formatPlanLabel(user.plan)}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 w-fit rounded-lg border-border bg-card px-4 text-xs font-semibold text-primary hover:bg-secondary/60"
          >
            {uploadingImage ? "Uploading..." : "Change photo"}
          </Button>
        </CardContent>
      </Card>

      {/* Personal Information Form Card */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">
                Personal information
              </h2>
              <p className="text-xs text-muted-foreground">
                The same profile settings are available to Students, Tutors, and
                Admins.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="profile-name"
                  className="text-xs font-semibold text-foreground"
                >
                  Full name
                </Label>
                <Input
                  id="profile-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="h-10 bg-background/70"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="profile-phone"
                  className="text-xs font-semibold text-foreground"
                >
                  Phone number
                </Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1712 345678"
                  className="h-10 bg-background/70"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="profile-bio"
                className="text-xs font-semibold text-foreground"
              >
                Bio
              </Label>
              <textarea
                id="profile-bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a short bio about your learning goals or teaching experience..."
                className="w-full rounded-xl border border-input bg-background/70 p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="profile-image-url"
                className="text-xs font-semibold text-foreground"
              >
                Profile picture URL
              </Label>
              <Input
                id="profile-image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://i.ibb.co/your-photo.jpg"
                className="h-10 bg-background/70"
              />
            </div>

            {/* ImgBB Upload Box */}
            <div className="space-y-3 rounded-xl bg-secondary/45 p-4 sm:p-5">
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary">
                  Or upload a photo with ImgBB
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG or PNG · Up to 5 MB · Square photos work best
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImgBBChange}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="h-9 rounded-lg border-border bg-card px-4 text-xs font-semibold text-primary hover:bg-secondary/60"
              >
                {uploadingImage ? "Uploading..." : "Choose image"}
              </Button>
            </div>

            {/* Form Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                type="submit"
                disabled={saving || uploadingImage}
                className="h-10 rounded-lg px-5 text-xs font-semibold sm:text-sm"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={saving || uploadingImage}
                onClick={handleReset}
                className="h-10 rounded-lg border-border bg-card px-4 text-xs font-semibold text-primary hover:bg-secondary/60 sm:text-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}