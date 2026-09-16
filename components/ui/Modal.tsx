"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Minimal reusable dialog: portal to `document.body`, overlay + Escape to
 * close (both no-ops while `busy`, so an in-flight upload can't be
 * interrupted), body-scroll lock, focus moved to the panel on open, and a
 * Tab/Shift+Tab loop that keeps focus inside the panel. Generic on purpose —
 * this is the first modal in the project; reuse it instead of building
 * another one-off overlay.
 */
export function Modal({
  open,
  onClose,
  titleId,
  busy = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** id of the element inside `children` that holds the dialog's title, wired to aria-labelledby. */
  titleId: string;
  /** Suppresses overlay-click / Escape dismissal while a real operation (e.g. upload) is in flight. */
  busy?: boolean;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const labelId = titleId || generatedId;

  // `open` flipping to false used to unmount this instantly — an entrance
  // with no matching exit. `rendered` stays true a moment longer so the
  // panel/backdrop can play `--animate-rise-out` before actually leaving
  // the DOM; `onAnimationEnd` below is what finally unmounts them. Derived
  // during render (React's documented pattern for "adjust state when a
  // prop changes"), not in an effect — the write happens before this
  // render commits, so there's no extra render pass or flash of stale UI.
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setRendered(true);
      setClosing(false);
    } else if (rendered) {
      setClosing(true);
    }
  }

  // `onAnimationEnd` below is the primary trigger, but browsers never fire it
  // for a near-zero-duration animation — exactly what the project's blanket
  // `prefers-reduced-motion: reduce` rule collapses `--animate-rise-out` to
  // (`animation-duration: 0.001ms !important`). Without this fallback, a
  // reduced-motion user's modal would never unmount after closing. Reads the
  // real computed duration so full-motion users get the same safety net,
  // just one that never wins the race against the real animationend.
  useEffect(() => {
    if (!closing) return;
    const panel = panelRef.current;
    const durationMs = panel ? parseFloat(getComputedStyle(panel).animationDuration) * 1000 : 0;
    const timer = window.setTimeout(() => setRendered(false), durationMs + 50);
    return () => window.clearTimeout(timer);
  }, [closing]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, busy, onClose]);

  if (!rendered) return null;

  const motionClass = closing ? "[animation:var(--animate-rise-out)]" : "[animation:var(--animate-rise)]";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        padding: "max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left))",
      }}
    >
      <div
        aria-hidden
        className={`absolute inset-0 bg-canvas/80 backdrop-blur-sm ${motionClass}`}
        onClick={busy ? undefined : onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className={`relative w-full max-w-[22rem] rounded-card-lg border border-border-strong bg-elevated p-5 shadow-[var(--shadow-card-featured)] outline-none ${motionClass}`}
        onAnimationEnd={() => {
          if (closing) setRendered(false);
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
