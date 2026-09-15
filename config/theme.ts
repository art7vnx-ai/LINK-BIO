import type { CSSProperties } from "react";

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
