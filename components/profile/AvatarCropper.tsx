"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
export const CROP_OUTPUT_SIZE = 1024;

type Point = { x: number; y: number };

/**
 * Real pan/zoom crop editor, not a zoom-only preview: the circular guide is
 * fixed in place and the photo moves and scales behind it via CSS
 * `transform` on a plain `<img>`, driven by Pointer Events (which unify
 * mouse drag, touch drag, and — by tracking two simultaneous pointers —
 * genuine pinch-to-zoom, so desktop and mobile share one implementation
 * instead of a touch-specific bolt-on). `zoom` is a multiplier on top of
 * `coverScale` (the minimum scale at which the photo fully fills the square
 * crop area, computed from its natural size vs. the container's rendered
 * size), so `zoom === MIN_ZOOM` is already "fully covered" — the floor a
 * photo can never zoom out past, which is what guarantees the circle can
 * never reveal empty space. Panning is clamped the same way, to half the
 * overflow between the rendered photo and the container at the current
 * zoom.
 *
 * `onConfirm` reads pixels back out of the same `<img>` via
 * `CanvasRenderingContext2D.drawImage`'s 9-argument form — no re-fetch, no
 * library. `src` is always a same-origin `blob:` object URL (from the
 * file input's own `File`), so the canvas is never tainted and `toBlob`
 * always resolves.
 */
export function AvatarCropper({
  src,
  outputMimeType,
  titleId,
  onCancel,
  onConfirm,
}: {
  src: string;
  outputMimeType: string;
  titleId: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [containerSize, setContainerSize] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [confirming, setConfirming] = useState(false);

  // Pointer tracking lives in refs, not state — every pointermove would
  // otherwise trigger a render just to update bookkeeping no one draws.
  const activePointers = useRef(new Map<number, Point>());
  const dragOrigin = useRef<{ pointer: Point; pan: Point } | null>(null);
  const pinchOrigin = useRef<{ distance: number; zoom: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerSize(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const coverScale = useMemo(() => {
    if (!naturalSize || !containerSize) return 1;
    return Math.max(containerSize / naturalSize.w, containerSize / naturalSize.h);
  }, [naturalSize, containerSize]);

  const displayScale = coverScale * zoom;

  const maxPan = useMemo<Point>(() => {
    if (!naturalSize || !containerSize) return { x: 0, y: 0 };
    const renderedW = naturalSize.w * displayScale;
    const renderedH = naturalSize.h * displayScale;
    return {
      x: Math.max(0, (renderedW - containerSize) / 2),
      y: Math.max(0, (renderedH - containerSize) / 2),
    };
  }, [naturalSize, containerSize, displayScale]);

  function clampPan(next: Point, limits: Point): Point {
    return {
      x: Math.min(limits.x, Math.max(-limits.x, next.x)),
      y: Math.min(limits.y, Math.max(-limits.y, next.y)),
    };
  }

  function clampZoom(next: number) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
  }

  // Zooming out shrinks maxPan — re-clamp so a photo can never end up
  // parked outside the bounds its new, smaller overflow allows. Derived
  // during render (React's documented "adjust state when a value changes"
  // pattern), not in a useEffect — the clamp lands before this render
  // commits, so there's no stray frame with the photo out of bounds.
  const [prevMaxPan, setPrevMaxPan] = useState<Point>({ x: 0, y: 0 });
  if (prevMaxPan.x !== maxPan.x || prevMaxPan.y !== maxPan.y) {
    setPrevMaxPan(maxPan);
    setPan((current) => clampPan(current, maxPan));
  }

  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // Best-effort: keeps drag/pinch tracking a pointer that leaves the
    // container mid-gesture. Some browsers throw if the id isn't (or is no
    // longer) an active pointer by the time this runs — losing capture
    // there just means that edge case stops tracking cleanly, which must
    // never take the rest of this handler down with it.
    try {
      (event.target as Element).setPointerCapture(event.pointerId);
    } catch {
      // ignored — see above
    }
    activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.current.size === 1) {
      dragOrigin.current = { pointer: { x: event.clientX, y: event.clientY }, pan };
      pinchOrigin.current = null;
    } else if (activePointers.current.size === 2) {
      dragOrigin.current = null;
      pinchOrigin.current = { distance: pointerDistance(), zoom };
    }
  }

  function pointerDistance() {
    const [a, b] = Array.from(activePointers.current.values());
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!activePointers.current.has(event.pointerId)) return;
    activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.current.size === 2 && pinchOrigin.current) {
      const ratio = pointerDistance() / pinchOrigin.current.distance;
      setZoom(clampZoom(pinchOrigin.current.zoom * ratio));
      return;
    }

    if (activePointers.current.size === 1 && dragOrigin.current) {
      const dx = event.clientX - dragOrigin.current.pointer.x;
      const dy = event.clientY - dragOrigin.current.pointer.y;
      setPan(clampPan({ x: dragOrigin.current.pan.x + dx, y: dragOrigin.current.pan.y + dy }, maxPan));
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    activePointers.current.delete(event.pointerId);
    pinchOrigin.current = null;
    if (activePointers.current.size === 1) {
      const [[, point]] = Array.from(activePointers.current.entries());
      dragOrigin.current = { pointer: point, pan };
    } else {
      dragOrigin.current = null;
    }
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    setZoom((current) => clampZoom(current - event.deltaY * 0.0015));
  }

  async function handleConfirm() {
    const img = imgRef.current;
    if (!img || !naturalSize || !containerSize || confirming) return;
    setConfirming(true);

    // The visible square, expressed in the source photo's own pixels —
    // independent of pan, since panning only shifts *which* square is
    // visible, never how much of the photo one container-width covers.
    const sourceSize = containerSize / displayScale;
    const sourceX = naturalSize.w / 2 - sourceSize / 2 - pan.x / displayScale;
    const sourceY = naturalSize.h / 2 - sourceSize / 2 - pan.y / displayScale;

    const canvas = document.createElement("canvas");
    canvas.width = CROP_OUTPUT_SIZE;
    canvas.height = CROP_OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setConfirming(false);
      return;
    }
    ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, CROP_OUTPUT_SIZE, CROP_OUTPUT_SIZE);

    canvas.toBlob(
      (blob) => {
        setConfirming(false);
        if (blob) onConfirm(blob);
      },
      outputMimeType,
      0.92,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={titleId} className="font-display text-lg font-semibold text-fg">Personalizar foto</h2>
        <p className="text-[0.8125rem] text-muted">Arraste para posicionar e ajuste o zoom.</p>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-[1.25rem] border border-border-strong bg-surface"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- panned/scaled via CSS transform and read back through canvas; next/image would fight both */}
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          onLoad={handleImageLoad}
          className="absolute left-1/2 top-1/2 max-w-none"
          style={
            naturalSize
              ? {
                  width: naturalSize.w * displayScale,
                  height: naturalSize.h * displayScale,
                  transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px)`,
                }
              : { opacity: 0 }
          }
        />

        {/* Fixed circular guide — the photo moves under it, it never moves itself.
            A huge box-shadow spread paints the scrim outside the circle in one
            declaration and is clipped clean by the container's own overflow-hidden. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border border-primary-strong/60"
          style={{ boxShadow: "0 0 0 9999px rgba(9, 9, 12, 0.72)" }}
        />
      </div>

      <div className="flex items-center gap-3 px-1">
        <ZoomOut size={16} className="shrink-0 text-muted" aria-hidden />
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={(event) => setZoom(clampZoom(Number(event.target.value)))}
          aria-label="Zoom da foto"
          className="h-1.5 w-full accent-primary"
        />
        <ZoomIn size={16} className="shrink-0 text-muted" aria-hidden />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-full px-4 text-[0.8125rem] font-medium text-muted transition-colors hover:text-fg"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!naturalSize || confirming}
          className="flex h-11 min-w-24 items-center justify-center rounded-full bg-primary px-5 text-[0.8125rem] font-semibold text-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Pronto
        </button>
      </div>
    </div>
  );
}
