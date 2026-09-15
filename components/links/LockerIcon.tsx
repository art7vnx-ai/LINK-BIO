import fs from "node:fs";
import path from "node:path";
import { useId } from "react";
import Image from "next/image";

const CANDIDATES = ["locker-icon.svg", "locker-icon.png", "locker-icon.jpg", "locker-icon.webp"];

/**
 * Looks for a real LOCKER logo file at public/images/locker-icon.{svg,png,jpg,webp}.
 * Drop the file in with one of those names and it's picked up automatically —
 * no code change needed. Falls back to the hand-vectorized LOCKER mark below
 * (shackle + diagonally split body, matching the reference the user supplied)
 * otherwise.
 */
function findLockerIconSrc() {
  for (const name of CANDIDATES) {
    try {
      if (fs.existsSync(path.join(process.cwd(), "public", "images", name))) {
        return `/images/${name}`;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function LockerIcon({ size = 20 }: { size?: number }) {
  const src = findLockerIconSrc();
  const clipId = useId();

  if (src) {
    return (
      <Image
        src={src}
        alt="Logo do LOCKER"
        width={size}
        height={size}
        className="object-contain"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Logo do LOCKER"
    >
      <path
        d="M7.5 11V9a4.5 4.5 0 0 1 9 0v2"
        stroke="var(--color-fg)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <clipPath id={clipId}>
        <rect x="4" y="10" width="16" height="11" rx="3" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect x="4" y="10" width="16" height="11" fill="#050506" />
        <polygon points="20,10 20,21 4,21" fill="var(--color-primary)" />
      </g>
    </svg>
  );
}
