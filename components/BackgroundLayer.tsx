import type { CSSProperties } from "react";
import { backgroundConfig } from "@/config/background";

/**
 * Decorative, page-wide ambient layer sitting behind all content: two soft,
 * blurred red blooms drifting slowly in opposite directions, a corner
 * vignette, and an optional static dot-matrix texture — nothing else.
 * `filter: blur` is applied to elements that only ever animate `transform`,
 * so the browser blurs once and composites the translation cheaply rather
 * than re-blurring every frame. Deliberately inert: aria-hidden,
 * pointer-events-none, negative z-index (renders behind normal-flow content
 * with no need to touch page/layout stacking), `overflow-hidden` on the
 * outer box as a defensive guard, and no layout box of its own (`fixed`,
 * `inset-0`) so it can never cause overflow or shift anything.
 */
export function BackgroundLayer() {
  const { glowA, glowB, vignetteIntensity, dotGrid } = backgroundConfig;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={
          {
            backgroundImage: `radial-gradient(120% 120% at 50% 45%, transparent 55%, color-mix(in srgb, black ${Math.round(vignetteIntensity * 100)}%, transparent) 100%)`,
          } as CSSProperties
        }
      />

      <div
        className="absolute inset-0 motion-safe:[animation:var(--animate-glow-drift-a)]"
        style={
          {
            "--glow-drift": `${glowA.driftPx}px`,
            "--glow-drift-duration": `${glowA.durationMs}ms`,
            filter: `blur(${glowA.blurPx}px)`,
            backgroundImage: `radial-gradient(ellipse ${glowA.size} at ${glowA.position}, color-mix(in srgb, var(--primary) ${Math.round(glowA.intensity * 100)}%, transparent) 0%, transparent 70%)`,
          } as CSSProperties
        }
      />

      <div
        className="absolute inset-0 motion-safe:[animation:var(--animate-glow-drift-b)]"
        style={
          {
            "--glow-drift": `${glowB.driftPx}px`,
            "--glow-drift-duration": `${glowB.durationMs}ms`,
            filter: `blur(${glowB.blurPx}px)`,
            backgroundImage: `radial-gradient(ellipse ${glowB.size} at ${glowB.position}, color-mix(in srgb, var(--secondary) ${Math.round(glowB.intensity * 100)}%, transparent) 0%, transparent 70%)`,
          } as CSSProperties
        }
      />

      {/* Wide-viewport "stage light": a soft, wide highlight centered behind
          the content column — desktop (lg: and up) is otherwise a ~30rem
          column surrounded by untouched black, which reads as sparse rather
          than minimal. Mobile/tablet are untouched; static (no drift) so it
          reads as a deliberate spotlight, not another moving element. */}
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={
          {
            backgroundImage:
              "radial-gradient(60% 48% at 50% 36%, color-mix(in srgb, var(--primary) 7%, transparent) 0%, transparent 72%)",
          } as CSSProperties
        }
      />

      {dotGrid.enabled && (
        <div
          className="bg-dot-grid absolute inset-0"
          style={
            {
              "--dot-grid-opacity": dotGrid.opacity,
              backgroundImage: `radial-gradient(circle, color-mix(in srgb, var(--text) 70%, transparent) ${dotGrid.dotPx}px, transparent ${dotGrid.dotPx}px)`,
              backgroundSize: `${dotGrid.tilePx}px ${dotGrid.tilePx}px`,
            } as CSSProperties
          }
        />
      )}
    </div>
  );
}
