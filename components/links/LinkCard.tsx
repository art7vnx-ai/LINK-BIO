import { ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";
import type { LinkIcon, LinkItem } from "@/config/links";
import { socialIcons } from "@/components/social/icons";
import { LockerIcon } from "./LockerIcon";

const icons: Record<LinkIcon, ComponentType<{ size?: number }>> = {
  behance: socialIcons.behance,
  instagram: socialIcons.instagram,
  whatsapp: socialIcons.whatsapp,
  locker: LockerIcon,
};

export function LinkCard({ link }: { link: LinkItem }) {
  const Icon = icons[link.icon];

  // "LOCKER | GESTÃO SIMPLES..." — split so the product name and tagline can
  // carry different weight. Only meaningful for the spotlight card; any
  // other title without " | " just renders as-is.
  const [titleMain, ...titleRestParts] = link.title.split(" | ");
  const titleTagline = titleRestParts.join(" | ");

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "group relative flex items-center gap-4 overflow-hidden rounded-card border p-4 transition-all duration-[var(--duration-card)] ease-[var(--ease-out-expo)]",
        "hover:-translate-y-0.5 hover:scale-[1.018] active:scale-[0.985]",
        link.spotlight
          ? "shadow-[var(--shadow-card-spotlight)] hover:shadow-[var(--shadow-card-spotlight-hover)]"
          : link.featured
            ? "border-primary/30 bg-surface-featured shadow-[var(--shadow-card-featured)] hover:border-primary/50"
            : "border-border bg-surface shadow-[var(--shadow-card)] hover:border-primary/25 hover:bg-elevated hover:shadow-[var(--shadow-card-hover)]",
      ].join(" ")}
      style={
        link.spotlight
          ? {
              backgroundImage: "var(--spotlight-fill), var(--spotlight-border)",
              backgroundOrigin: "padding-box, padding-box, border-box",
              backgroundClip: "padding-box, padding-box, border-box",
              border: "1.5px solid transparent",
            }
          : undefined
      }
    >
      {link.featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(140% 100% at 0% 0%, color-mix(in oklab, var(--color-primary) 20%, transparent) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Light sweep: one-shot pass on hover-enter, off-screen (invisible) at rest and at the animation's end — see @keyframes card-sweep. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 [transform:translateX(-100%)] motion-reduce:hidden group-hover:[animation:var(--animate-sweep)]"
        style={{ backgroundImage: "var(--sweep-light)" }}
      />

      {/* aria-hidden: brand-icon SVGs (Behance/Instagram/WhatsApp/LOCKER) carry their
          own internal <title>, which would otherwise leak into this link's accessible
          name ahead of the title/description text below — the actual label. */}
      <span
        aria-hidden
        className={[
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.85rem] border",
          link.spotlight
            ? "border-primary-strong/40 bg-elevated/80 text-fg shadow-[0_0_16px_-4px_color-mix(in_srgb,var(--primary)_55%,transparent)]"
            : link.featured
              ? "border-primary/30 bg-primary-soft text-primary-strong"
              : "border-primary/25 bg-elevated text-fg",
        ].join(" ")}
      >
        <Icon size={20} />
      </span>

      <span
        className={[
          "relative flex min-w-0 flex-1 flex-col gap-0.5 text-left",
        ].join(" ")}
      >
        {link.spotlight && titleTagline ? (
          <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-base font-bold tracking-tight text-fg">
              {titleMain}
            </span>
            <span aria-hidden className="text-primary-strong/70">
              |
            </span>
            <span className="text-[0.9375rem] font-semibold text-fg/90">
              {titleTagline}
            </span>
          </span>
        ) : (
          <span className="truncate text-[0.9375rem] font-medium text-fg">
            {link.title}
          </span>
        )}
        <span className="line-clamp-2 text-[0.8125rem] leading-snug text-muted">
          {link.description}
        </span>
      </span>

      <ArrowUpRight
        size={18}
        strokeWidth={1.75}
        className={[
          "relative shrink-0 transition-all duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          link.spotlight
            ? "text-primary-strong drop-shadow-[0_0_6px_rgba(208,97,90,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(208,97,90,0.85)]"
            : "text-muted group-hover:text-primary-strong",
        ].join(" ")}
      />
    </a>
  );
}
