import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const PHOTO_PUBLIC_PATH = "/images/avatar.png";

/**
 * Looks for a real photo at public/images/avatar.png. When present, it's
 * used automatically — drop the file in and the placeholder disappears,
 * no code change needed. Falls back to the generated initials placeholder
 * otherwise (this check runs server-side, at render/build time).
 */
function hasAvatarPhoto() {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "images", "avatar.png"));
  } catch {
    return false;
  }
}

export function Avatar({
  initials,
  name,
  size = "default",
}: {
  initials: string;
  name: string;
  /** "sm" is the small footer-signature variant: no glow, a hairline accent ring instead. */
  size?: "default" | "sm";
}) {
  const hasPhoto = hasAvatarPhoto();
  const isSmall = size === "sm";

  return (
    <div
      className={
        isSmall
          ? "relative h-[30px] w-[30px] shrink-0"
          : "relative h-24 w-24 sm:h-[6.5rem] sm:w-[6.5rem]"
      }
    >
      <div
        className={
          isSmall
            ? "relative flex h-full w-full items-center justify-center overflow-hidden rounded-full ring-1 ring-inset ring-[color-mix(in_srgb,var(--primary-strong)_35%,transparent)]"
            : "relative flex h-full w-full items-center justify-center overflow-hidden rounded-full shadow-[var(--shadow-glow-soft)]"
        }
        style={
          hasPhoto
            ? undefined
            : {
                background:
                  "radial-gradient(120% 120% at 25% 15%, color-mix(in oklab, var(--color-primary) 55%, transparent) 0%, var(--color-surface) 55%, var(--color-elevated) 100%)",
              }
        }
      >
        {hasPhoto ? (
          <Image
            src={PHOTO_PUBLIC_PATH}
            alt={`Foto de ${name}`}
            fill
            sizes={isSmall ? "30px" : "104px"}
            priority={!isSmall}
            className="object-cover"
          />
        ) : (
          <span
            className={
              isSmall
                ? "font-display text-[0.625rem] font-semibold tracking-tight text-fg"
                : "font-display text-2xl font-semibold tracking-tight text-fg"
            }
          >
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
