import type { CSSProperties } from "react";
import { getPersistedTheme } from "@/lib/theme-store";

/**
 * Single source of truth for the page's color skin.
 * Change these values to re-skin a duplicate of this template —
 * no component or CSS edit required.
 *
 * `primary` / `secondary` / `primaryGradient` are the official brand identity
 * (currently the red identity). `primaryStrong` is NOT a separate brand color —
 * it's an accessible, lighter tint of `primary` used wherever the accent sits
 * on text or a fine UI line (the @handle, hover accents, the focus ring)
 * against the dark canvas, since the raw brand red is too dark to pass
 * WCAG contrast at those sizes. Keep it derived from `primary` if you change it.
 */
export const theme = {
  background: "#09090c",
  backgroundElevated: "#111116",
  surface: "#131318",
  /** Dark neutral surface for the featured link card / CTA panel — a whisper of the brand accent, not a full tint. */
  surfaceFeatured: "#221114",
  border: "rgba(247,246,251,0.08)",
  borderStrong: "rgba(247,246,251,0.16)",
  text: "#f6f5f9",
  muted: "#9a97a8",
  mutedStrong: "#c3c0cf",
  primary: "#B70C01",
  secondary: "#C50C00",
  primaryGradient: "linear-gradient(135deg, #B70C01 0%, #C50C00 100%)",
  /** Accessible text/hover/focus tint — verified ≥4.5:1 against `background`. */
  primaryStrong: "#D0615A",
  primarySoft: "rgba(183,12,1,0.14)",
  ring: "#D0615A",
} as const;

export type ThemeTokens = typeof theme;

/** Maps theme tokens to the CSS custom properties consumed in globals.css. */
export const themeCssVars: CSSProperties = {
  "--bg": theme.background,
  "--bg-elevated": theme.backgroundElevated,
  "--surface": theme.surface,
  "--surface-featured": theme.surfaceFeatured,
  "--border": theme.border,
  "--border-strong": theme.borderStrong,
  "--text": theme.text,
  "--muted": theme.muted,
  "--muted-strong": theme.mutedStrong,
  "--primary": theme.primary,
  "--secondary": theme.secondary,
  "--primary-gradient": theme.primaryGradient,
  "--primary-strong": theme.primaryStrong,
  "--primary-soft": theme.primarySoft,
  "--ring": theme.ring,
} as CSSProperties;

/**
 * Same shape as `themeCssVars`, but with the accent tokens (primary,
 * secondary, gradient, strong tint, soft wash, ring) swapped out for a
 * persisted custom color when the owner has picked one (see
 * lib/theme-store.ts / components/ThemeColorEditButton.tsx). Every other
 * token — canvas, surfaces, text, borders — is untouched: only the accent
 * is ever user-editable. Falls back to the shipped defaults above when no
 * custom color is set or Vercel Blob isn't configured.
 */
export async function getThemeCssVars(): Promise<CSSProperties> {
  const persisted = await getPersistedTheme();
  if (!persisted) return themeCssVars;

  return {
    ...themeCssVars,
    "--primary": persisted.primary,
    "--secondary": persisted.secondary,
    "--primary-gradient": persisted.primaryGradient,
    "--primary-strong": persisted.primaryStrong,
    "--primary-soft": persisted.primarySoft,
    "--ring": persisted.ring,
  } as CSSProperties;
}
