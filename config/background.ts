/**
 * Centralized parameters for the page's ambient background layer
 * (see components/BackgroundLayer.tsx): two soft, bottom-anchored,
 * blurred red blooms that drift slowly in opposite directions, a corner
 * vignette, and an optional static dot-matrix texture for depth — nothing
 * else. No particles, no dust, no starfield. Tuning the look should mean
 * editing values here, not touching the component.
 *
 * Every color reads from the existing --primary/--secondary tokens via
 * color-mix, so a future palette change still only touches config/theme.ts.
 */
export const backgroundConfig = {
  /** Primary bloom, bottom-left — the dominant layer. Drifts right/up. */
  glowA: {
    /** CSS radial-gradient position (x y). */
    position: "10% 108%",
    /** CSS radial-gradient size (ellipse width height). */
    size: "78% 58%",
    /** 0–1 mix of --primary into transparent at the gradient's center. */
    intensity: 0.13,
    /** Drift distance in px at full amplitude — visible flow, not a static glow. */
    driftPx: 48,
    /** Deliberately far slower than the cards' 1.4s ring: "environment," not "energy." */
    durationMs: 13000,
    /** Softens the gradient further into a genuinely diffuse bloom. */
    blurPx: 46,
  },
  /** Secondary bloom, bottom-right — fainter, adds depth without symmetry. Drifts left/down (opposite of glowA). */
  glowB: {
    position: "96% 102%",
    size: "62% 48%",
    intensity: 0.09,
    driftPx: 40,
    durationMs: 16000,
    blurPx: 40,
  },
  /** Base canvas vignette so corners read slightly darker than center. */
  vignetteIntensity: 0.5,
  /**
   * Optional static dot-matrix texture (a uniform grid, not scattered
   * "stars" — that starfield/cosmic-dust direction was tried and rejected,
   * see DESIGN.md). Deliberately motionless: adds depth without competing
   * for attention. Masked off behind the profile header so it never sits
   * directly under the headline/handle text.
   */
  dotGrid: {
    enabled: true,
    opacity: 0.05,
    tilePx: 22,
    dotPx: 1,
  },
} as const;
