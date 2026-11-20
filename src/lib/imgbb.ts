const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Please upload a JPG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return "Profile photo must be 5 MB or smaller.";
  }
  return null;
}

export async function uploadAvatarToImgBB(file: File): Promise<string> {
  const validationError = validateAvatarFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured (NEXT_PUBLIC_IMGBB_API_KEY).");
  }

  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("image", file);

  const response = await fetch(IMGBB_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success || !payload?.data?.url) {
    throw new Error(
      payload?.error?.message || "Failed to upload profile image to ImgBB."
    );
  }

  return String(payload.data.display_url || payload.data.url);
}