import { list, put } from "@vercel/blob";
import { DEFAULT_CANVAS_HEX, deriveTheme, isValidHex, normalizeHex, type DerivedTheme } from "@/lib/color";

/**
 * Fixed pathname (no random suffix, no database) so a plain `list()` call
 * is enough to find "the current color" — same pattern as the avatar photo
 * in lib/avatar-store.ts. Holds the *only* the user-chosen primary hex;
 * every other token is re-derived from it on read, so the derivation logic
 * only lives in one place (lib/color.ts).
 */
const THEME_PATHNAME = "theme/color.json";

interface StoredTheme {
  primary: string;
  updatedAt: string;
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Returns the persisted accent color's fully-derived theme, or null when
 * Vercel Blob isn't configured or no custom color has been saved yet — the
 * caller falls back to the shipped default (config/theme.ts). Never throws.
 */
export async function getPersistedTheme(): Promise<DerivedTheme | null> {
  if (!hasBlobToken()) return null;

  try {
    const { blobs } = await list({ prefix: THEME_PATHNAME, limit: 5 });
    if (blobs.length === 0) return null;
    const newest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
    const res = await fetch(newest.url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<StoredTheme>;
    if (!data.primary || !isValidHex(data.primary)) return null;
    return deriveTheme(data.primary, DEFAULT_CANVAS_HEX);
  } catch {
    return null;
  }
}

/** Just the saved primary hex (for prefilling the picker) — null if unset/unconfigured. */
export async function getPersistedPrimaryHex(): Promise<string | null> {
  const theme = await getPersistedTheme();
  return theme?.primary ?? null;
}

/** Validates, derives, and persists a new accent color. Throws on invalid input or a Blob failure. */
export async function saveThemeColor(primaryHex: string): Promise<DerivedTheme> {
  if (!isValidHex(primaryHex)) throw new Error("Invalid hex color");
  if (!hasBlobToken()) throw new Error("BLOB_READ_WRITE_TOKEN not configured");

  const primary = normalizeHex(primaryHex);
  const payload: StoredTheme = { primary, updatedAt: new Date().toISOString() };

  await put(THEME_PATHNAME, JSON.stringify(payload), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });

  return deriveTheme(primary, DEFAULT_CANVAS_HEX);
}
