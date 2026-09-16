import type { CSSProperties } from "react";
import { backgroundConfig } from "@/config/background";

/**
 * A field of tiny, near-invisible red lights scattered across the
 * background — each wandering its own slow, irregular path and
 * occasionally flashing brighter for a moment. See `ambientLights` in
 * config/background.ts for the per-light data and the reasoning behind
 * this existing at all, and DESIGN.md's Ambient Lights for the full
 * writeup. Rendered inside BackgroundLayer.tsx; never used standalone.
 */
export function AmbientLights() {
  return (
    <>
      {backgroundConfig.ambientLights.map((light, index) => (
        <span
          key={index}
          aria-hidden
          className="ambient-light absolute"
          style={
            {
              top: light.top,
              left: light.left,
              width: `${light.sizePx}px`,
              height: `${light.sizePx}px`,
              "--light-drift": `light-drift-${light.drift}`,
              "--light-drift-x": light.driftPx,
              "--light-drift-y": light.driftPy,
              "--light-drift-duration": `${light.driftS}s`,
              "--light-drift-delay": `${light.driftDelayS}s`,
              "--light-twinkle-duration": `${light.twinkleS}s`,
              "--light-twinkle-delay": `${light.twinkleDelayS}s`,
              "--light-op-min": light.opMin,
              "--light-op-max": light.opMax,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}
