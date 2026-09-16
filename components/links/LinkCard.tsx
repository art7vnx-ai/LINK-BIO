import { ArrowUpRight } from "lucide-react";
import { type ComponentType, type CSSProperties } from "react";
import type { LinkIcon, LinkItem } from "@/config/links";
import { socialIcons } from "@/components/social/icons";
import { LockerIcon } from "./LockerIcon";

const icons: Record<LinkIcon, ComponentType<{ size?: number }>> = {
  behance: socialIcons.behance,
  instagram: socialIcons.instagram,
  whatsapp: socialIcons.whatsapp,
  locker: LockerIcon,
};

export function LinkCard({ link, enterDelayMs = 0 }: { link: LinkItem; enterDelayMs?: number }) {
  const Icon = icons[link.icon];

  // "LOCKER | GESTÃO SIMPLES..." — split so the product name and tagline can
  // carry different weight. Content-driven (any title with " | " gets this),
  // not tied to a visual tier.
  const [titleMain, ...titleRestParts] = link.title.split(" | ");
  const titleTagline = titleRestParts.join(" | ");

  // Animated Border (see `.animated-border` in globals.css): WhatsApp and
  // LOCKER only, one shared class + pseudo-element. LOCKER starts half a
  // revolution into its cycle so the two featured cards never spin in
  // visible lockstep, the same antiphase precedent the old perimeter-ring
  // effect used.
  const cardStyle = {
    ...(link.featured && link.id === "locker" ? { "--border-delay": "calc(var(--border-duration) / -2)" } : {}),
    animationDelay: `${enterDelayMs}ms`,
  } as CSSProperties;

  // Card Aura: a third, independent hover effect (see `.card-aura-host` in
  // globals.css) — a soft red glow behind the card that extends past its
  // own edges. Only WhatsApp and LOCKER (the featured pair) get the
  // `card-aura-host` class that the CSS keys off of; Portfólio/Instagram
  // get a plain wrapper with no aura at all.
  const auraClassName = link.featured ? "card-aura-host relative" : "relative";

  return (
    <div className={auraClassName}>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "group relative flex items-center gap-4 overflow-hidden rounded-card border p-4 transition-all duration-[var(--duration-card)] ease-[var(--ease-card)] [animation:var(--animate-card-rise)]",
          link.featured ? "animated-border" : "",
          "hover:-translate-y-0.5 hover:scale-[1.012] active:scale-[0.99]",
          link.featured
            ? "border-primary/30 bg-surface-featured shadow-[var(--shadow-card-featured)] hover:border-primary/40 hover:shadow-[var(--shadow-card-featured-hover)]"
            : "border-border bg-surface shadow-[var(--shadow-card)] hover:border-primary/25 hover:bg-elevated hover:shadow-[var(--shadow-card-hover)]",
        ]
          .filter(Boolean)
          .join(" ")}
        style={cardStyle}
      >
        {/* Light sweep: one-shot pass on hover-enter, off-screen (invisible) at rest and at the animation's end — see @keyframes card-sweep.
            Same system on all four cards; only the tint differs (featured cards get a warm accent-hot sweep, plain cards a neutral bone-white one).
            The plain `sweep-light` class is a CSS hook only (see globals.css's reduced-motion block) — it stays alive,
            just calmer, under prefers-reduced-motion instead of being hidden outright. A 1px blur takes the last bit of
            hardness off the gradient's own already-soft edges, cheap on a single small translating element. */}
        <span
          aria-hidden
          className="sweep-light pointer-events-none absolute inset-0 blur-[1px] [transform:translateX(-100%)] group-hover:[animation:var(--animate-sweep)]"
          style={{ backgroundImage: link.featured ? "var(--sweep-light-featured)" : "var(--sweep-light-neutral)" }}
        />

        {/* aria-hidden: brand-icon SVGs (Behance/Instagram/WhatsApp/LOCKER) carry their
            own internal <title>, which would otherwise leak into this link's accessible
            name ahead of the title/description text below — the actual label. */}
        <span
          aria-hidden
          className={[
            "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.85rem] border",
            link.featured
              ? "border-primary-strong/30 bg-primary-soft text-primary-strong shadow-[0_0_10px_-5px_color-mix(in_srgb,var(--primary)_45%,transparent)]"
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
          {titleTagline ? (
            <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              {/* Name and separator travel as one unbreakable unit so a narrow
                  width can only ever wrap the tagline onto its own line — never
                  strand the "|" glyph alone at the end of the first line. */}
              <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span className="text-base font-bold tracking-tight text-fg">
                  {titleMain}
                </span>
                <span aria-hidden className="text-primary-strong/70">
                  |
                </span>
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
          <span className="line-clamp-2 text-[0.8125rem] font-medium leading-snug text-muted">
            {link.description}
          </span>
        </span>

        <ArrowUpRight
          size={18}
          strokeWidth={1.75}
          className={[
            // Hover reads as "selected"; the extra group-active step reads as
            // "launched" — a small, honest acknowledgment right as the tap
            // commits, before the new tab takes over. Same family on every
            // card, featured or plain — no one-off treatment.
            "relative shrink-0 transition-all duration-[var(--duration-base)] ease-[var(--ease-card)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-1 group-active:-translate-y-1",
            link.featured
              ? "text-primary-strong drop-shadow-[0_0_4px_rgba(208,97,90,0.35)] group-hover:drop-shadow-[0_0_6px_rgba(208,97,90,0.55)]"
              : "text-muted group-hover:text-primary-strong",
          ].join(" ")}
        />
      </a>
    </div>
  );
}
