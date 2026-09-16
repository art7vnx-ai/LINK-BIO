/**
 * Centralized parameters for the page's ambient background layer
 * (see components/BackgroundLayer.tsx): two soft, bottom-anchored,
 * blurred red blooms that drift slowly in opposite directions, a corner
 * vignette, a static dot-matrix texture, and a field of tiny ambient
 * lights (see `ambientLights` below and components/AmbientLights.tsx).
 * Tuning the look should mean editing values here, not touching the
 * components.
 *
 * Every color reads from the existing --primary/--secondary/--accent-hot
 * tokens via color-mix, so a future palette change still only touches
 * config/theme.ts.
 *
 * Note on `ambientLights`: an earlier pass in this project explicitly
 * rejected a "cosmic dust" / starfield / scattered-particle direction —
 * this is a deliberately different, much more restrained thing: a handful
 * of near-invisible red micro-lights that occasionally flash, confirmed
 * and requested by the user afterward with an explicit reference
 * technique. If asked to remove it again, remove the whole
 * `ambientLights` block and its render in BackgroundLayer.tsx rather than
 * just dimming it further.
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
  /**
   * Tiny ambient lights scattered across the viewport — near-invisible at
   * rest, each wandering its own slow, irregular path (one of three shared
   * `@keyframes` "drift" shapes, `driftPx`/`driftPy` sets the direction and
   * distance so no two instances that share a shape look identical) and
   * occasionally flashing brighter for a moment before fading back down
   * (a second, independent `@keyframes` for opacity + glow, on its own
   * unrelated duration so drift and flash never land in a fixed pattern).
   * Position is a `top`/`left` percentage of the fixed background layer's
   * own viewport-sized box — a few intentionally sit past 0%/100% so they
   * drift partly off-frame rather than every light having a clean edge.
   * Hand-placed, not generated, so the spread reads as organic (loose
   * pairs in some areas, open gaps in others) rather than evenly gridded.
   */
  ambientLights: [
    { top: "8%", left: "22%", sizePx: 3, drift: "a", driftPx: "2.2vw", driftPy: "-2.8vh", driftS: 14, driftDelayS: -3, twinkleS: 8, twinkleDelayS: -1, opMin: 0.12, opMax: 0.6 },
    { top: "14%", left: "78%", sizePx: 2, drift: "b", driftPx: "-1.8vw", driftPy: "2.4vh", driftS: 17, driftDelayS: -9, twinkleS: 10, twinkleDelayS: -4, opMin: 0.1, opMax: 0.55 },
    { top: "26%", left: "6%", sizePx: 4, drift: "c", driftPx: "2.6vw", driftPy: "2.2vh", driftS: 11, driftDelayS: -2, twinkleS: 7, twinkleDelayS: -2.5, opMin: 0.15, opMax: 0.7 },
    { top: "32%", left: "92%", sizePx: 3, drift: "a", driftPx: "-2.4vw", driftPy: "-1.9vh", driftS: 19, driftDelayS: -6, twinkleS: 12, twinkleDelayS: -7, opMin: 0.1, opMax: 0.6 },
    { top: "38%", left: "45%", sizePx: 2, drift: "b", driftPx: "1.6vw", driftPy: "2.8vh", driftS: 15, driftDelayS: -11, twinkleS: 9, twinkleDelayS: -3, opMin: 0.08, opMax: 0.5 },
    { top: "44%", left: "15%", sizePx: 5, drift: "c", driftPx: "-2vw", driftPy: "1.8vh", driftS: 13, driftDelayS: -4, twinkleS: 11, twinkleDelayS: -8, opMin: 0.14, opMax: 0.65 },
    { top: "48%", left: "85%", sizePx: 3, drift: "a", driftPx: "2.8vw", driftPy: "-2.2vh", driftS: 20, driftDelayS: -14, twinkleS: 6, twinkleDelayS: -1.5, opMin: 0.1, opMax: 0.55 },
    { top: "55%", left: "60%", sizePx: 2, drift: "b", driftPx: "-1.4vw", driftPy: "-2.6vh", driftS: 9, driftDelayS: -5, twinkleS: 13, twinkleDelayS: -9, opMin: 0.12, opMax: 0.6 },
    { top: "60%", left: "30%", sizePx: 4, drift: "c", driftPx: "2.2vw", driftPy: "2vh", driftS: 16, driftDelayS: -8, twinkleS: 8, twinkleDelayS: -6, opMin: 0.1, opMax: 0.65 },
    { top: "65%", left: "94%", sizePx: 3, drift: "a", driftPx: "-2.6vw", driftPy: "1.6vh", driftS: 12, driftDelayS: -1, twinkleS: 10, twinkleDelayS: -2, opMin: 0.13, opMax: 0.6 },
    { top: "70%", left: "8%", sizePx: 2, drift: "b", driftPx: "1.8vw", driftPy: "-2.4vh", driftS: 18, driftDelayS: -12, twinkleS: 7, twinkleDelayS: -4.5, opMin: 0.09, opMax: 0.5 },
    { top: "76%", left: "52%", sizePx: 3, drift: "c", driftPx: "-2.2vw", driftPy: "2.6vh", driftS: 10, driftDelayS: -3.5, twinkleS: 9, twinkleDelayS: -7.5, opMin: 0.12, opMax: 0.6 },
    { top: "82%", left: "20%", sizePx: 4, drift: "a", driftPx: "2.4vw", driftPy: "1.4vh", driftS: 14.5, driftDelayS: -10, twinkleS: 11, twinkleDelayS: -3, opMin: 0.11, opMax: 0.55 },
    { top: "88%", left: "75%", sizePx: 2, drift: "b", driftPx: "-1.6vw", driftPy: "-1.8vh", driftS: 17.5, driftDelayS: -7, twinkleS: 6.5, twinkleDelayS: -5, opMin: 0.1, opMax: 0.6 },
    { top: "96%", left: "38%", sizePx: 3, drift: "c", driftPx: "2vw", driftPy: "-2vh", driftS: 13.5, driftDelayS: -2.5, twinkleS: 12.5, twinkleDelayS: -8.5, opMin: 0.13, opMax: 0.65 },
    { top: "-3%", left: "65%", sizePx: 3, drift: "a", driftPx: "1.4vw", driftPy: "2.2vh", driftS: 19.5, driftDelayS: -15, twinkleS: 8.5, twinkleDelayS: -2, opMin: 0.1, opMax: 0.55 },
  ],
} as const;
