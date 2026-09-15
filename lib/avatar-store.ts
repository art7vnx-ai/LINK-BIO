import { del, list, put } from "@vercel/blob";

/**
 * Fixed pathname prefix (no random suffix) so the live avatar always
 * overwrites in place instead of accumulating history, and so a plain
 * `list()` call is enough to find "the current photo" without a database.
 */
const AVATAR_PREFIX = "avatar/photo";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const ACCEPTED_AVATAR_MIME_TYPES = Object.keys(EXTENSION_BY_MIME);
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

export function extensionForMimeType(mimeType: string): string | null {
  return EXTENSION_BY_MIME[mimeType] ?? null;
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Returns the current avatar's public URL, or null when Vercel Blob isn't
 * configured (no token — e.g. local dev without env vars) or no photo has
 * been uploaded yet. Never throws: any Blob API failure degrades to null so
 * the page can fall back to the bundled local photo / initials.
 */
export async function getAvatarUrl(): Promise<string | null> {
  if (!hasBlobToken()) return null;

  try {
    const { blobs } = await list({ prefix: AVATAR_PREFIX, limit: 10 });
    if (blobs.length === 0) return null;
    const newest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
    return newest.url;
  } catch {
    return null;
  }
}

/**
 * Uploads the new photo at a fixed pathname derived from its mime type, then
 * removes any previously stored avatar at a *different* extension (e.g. a
 * png replacing an earlier jpg) so exactly one live blob exists at a time.
 */
export async function saveAvatar(file: Blob, mimeType: string): Promise<string> {
  const ext = extensionForMimeType(mimeType);
  if (!ext) throw new Error(`Unsupported mime type: ${mimeType}`);

  const pathname = `${AVATAR_PREFIX}.${ext}`;

  const { blobs: existing } = await list({ prefix: AVATAR_PREFIX, limit: 10 });
  const stale = existing.filter((b) => b.pathname !== pathname);

  const { url } = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: mimeType,
    cacheControlMaxAge: 60,
  });

  if (stale.length > 0) {
    await del(stale.map((b) => b.url)).catch(() => {
      // Best-effort cleanup: an orphaned old-format blob is harmless, never
      // worth failing the upload the visitor is waiting on.
    });
  }

  return url;
}
