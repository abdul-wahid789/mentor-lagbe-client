"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatarToImgBB } from "@/lib/imgbb";
import { AvatarUploadField } from "@/components/auth/AvatarUploadField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DashboardUser } from "@/types/dashboard";

export function ProfileFormCard({ user }: { user: DashboardUser }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [bio, setBio] = useState(user.bio || "");
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSaving(true);
    try {
      let nextImage = imageUrl;
      if (avatarFile) {
        nextImage = await uploadAvatarToImgBB(avatarFile);
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          image: nextImage || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update profile.");
      }

      if (nextImage) setImageUrl(nextImage);
      setAvatarFile(null);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-2xl border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Update profile
        </CardTitle>
        <CardDescription>
          Manage your account details, contact phone, bio, and profile photo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AvatarUploadField
            file={avatarFile}
            disabled={saving}
            onFileChange={setAvatarFile}
          />

          <div className="space-y-1.5">
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              value={name}
              disabled={saving}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-phone">Phone number</Label>
            <Input
              id="profile-phone"
              type="tel"
              placeholder="+880 17XX-XXXXXX"
              value={phone}
              disabled={saving}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-bio">Bio</Label>
            <textarea
              id="profile-bio"
              rows={4}
              disabled={saving}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your academic background, teaching focus, or learning goals..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button type="submit" disabled={saving} className="h-9 px-4 text-xs font-semibold">
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                <span>Saving changes...</span>
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                <span>Save profile</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}