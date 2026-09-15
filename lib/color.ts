/**
 * Pure color math — no DOM, no Node APIs, safe in both server and client
 * code. Lets the accent color be picked as a single hex value while every
 * derived token (the gradient's second stop, the accessible text/hover
 * tint, the focus ring) stays mathematically consistent instead of relying
 * on a human re-verifying contrast for every future color choice.
 */

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

/** The page canvas color (config/theme.ts's `background`) — never user-editable, so it's safe to duplicate here and avoid a circular import between config/theme.ts and lib/theme-store.ts. */
export const DEFAULT_CANVAS_HEX = "#09090c";

const HEX_RE = /^#?([0-9a-f]{6})$/i;

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value.trim());
}

export function normalizeHex(value: string): string {
  const match = value.trim().match(HEX_RE);
  if (!match) throw new Error(`Invalid hex color: ${value}`);
  return `#${match[1].toLowerCase()}`;
}

export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex);
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let h: number;
  switch (max) {
    case rn:
      h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) * 60;
      break;
    case gn:
      h = ((bn - rn) / delta + 2) * 60;
      break;
    default:
      h = ((rn - gn) / delta + 4) * 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100;
  const ln = l / 100;
  if (sn === 0) {
    const v = ln * 255;
    return { r: v, g: v, b: v };
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hueToRgb = (t0: number) => {
    let t = t0;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const hn = h / 360;
  return {
    r: hueToRgb(hn + 1 / 3) * 255,
    g: hueToRgb(hn) * 255,
    b: hueToRgb(hn - 1 / 3) * 255,
  };
}

/** WCAG relative luminance (sRGB → linear light → luminance). */
function relativeLuminance({ r, g, b }: RGB): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rl = channel(r);
  const gl = channel(g);
  const bl = channel(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** WCAG contrast ratio between two colors (1–21). */
export function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexToRgb(hexA));
  const lumB = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Lightens `hex` in HSL space, a step at a time, until it clears
 * `minContrast` against `backgroundHex` — the same manual process used to
 * pick the shipped #D0615A tint of #B70C01, now automatic for any color.
 * Capped at L=82% so an already-light input never gets pushed to near-white.
 */
export function deriveAccessibleTint(hex: string, backgroundHex: string, minContrast = 4.5): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  let l = hsl.l;
  let candidate = hex;

  while (l < 82) {
    // Desaturate a little as it lightens — a fully-saturated hue pushed
    // straight up in lightness reads as neon/pastel; easing saturation down
    // alongside it (floor 42%, so it never grays out to nothing) is what
    // actually produced the shipped #D0615A tint of #B70C01 by hand.
    const s = Math.max(42, hsl.s - (l - hsl.l) * 1.4);
    candidate = rgbToHex(hslToRgb({ h: hsl.h, s, l }));
    if (contrastRatio(candidate, backgroundHex) >= minContrast) return candidate;
    l += 2;
  }
  return candidate;
}

/**
 * The gradient's second stop: a slightly deeper, slightly more saturated
 * sibling of the primary — models the shipped #B70C01 → #C50C00
 * relationship (same hue family, a few points darker/more saturated)
 * instead of inventing an unrelated second color.
 */
export function deriveSecondary(hex: string): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  return rgbToHex(
    hslToRgb({
      h: hsl.h,
      s: Math.min(100, hsl.s + 4),
      l: Math.max(0, hsl.l - 3),
    }),
  );
}

export interface DerivedTheme {
  primary: string;
  secondary: string;
  primaryGradient: string;
  primaryStrong: string;
  primarySoft: string;
  ring: string;
}

/** Everything the page needs, derived from one accent hex — see config/theme.ts. */
export function deriveTheme(primaryHex: string, canvasHex: string): DerivedTheme {
  const primary = normalizeHex(primaryHex);
  const secondary = deriveSecondary(primary);
  const primaryStrong = deriveAccessibleTint(primary, canvasHex);
  const { r, g, b } = hexToRgb(primary);
  return {
    primary,
    secondary,
    primaryGradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
    primaryStrong,
    primarySoft: `rgba(${r},${g},${b},0.14)`,
    ring: primaryStrong,
  };
}
