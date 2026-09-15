---
name: Vinicius Muniz — Link Bio Template
description: Editorial, dark, single-accent personal page template for designers and creative freelancers.
colors:
  canvas: "#09090c"
  elevated: "#111116"
  surface: "#131318"
  surface-featured: "#221114"
  hairline: "rgba(247,246,251,0.08)"
  hairline-strong: "rgba(247,246,251,0.16)"
  bone: "#f6f5f9"
  smoke: "#9a97a8"
  smoke-light: "#c3c0cf"
  signal-red: "#B70C01"
  signal-red-deep: "#C50C00"
  signal-red-light: "#D0615A"
  signal-red-wash: "rgba(183,12,1,0.14)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontWeight: 500
rounded:
  card: "1.25rem"
  pill: "999px"
  tile: "0.85rem"
  focus-ring: "4px"
spacing:
  section-gap: "2.5rem"
  card-padding: "1rem"
components:
  link-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.bone}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  link-card-featured:
    backgroundColor: "{colors.surface-featured}"
    textColor: "{colors.bone}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  link-card-spotlight:
    # Actual fill/border are gradients (--spotlight-fill / --spotlight-border,
    # see Cards / Containers) — this is the nearest flat approximation.
    backgroundColor: "{colors.surface-featured}"
    textColor: "{colors.bone}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
---

# Design System: Vinicius Muniz — Link Bio Template

## Overview

**Creative North Star: "The Editorial Dossier"**

This is a single-column personal dossier, not a directory of buttons: a centered identity mark, a proof-carrying social row, and a small, deliberately short set of premium content cards, closed by one quiet credit line. Density and ornament are rationed — glow, gradient, and motion are used at exactly the moments that carry meaning (the avatar's ambient light, the featured card's lift, a status dot's slow pulse) and nowhere else. The system explicitly rejects the generic link-in-bio look: a flat stack of same-weight buttons on a loud gradient background. Instead, one restrained red accent sits on a near-black field, and hierarchy comes from type scale, spacing, and card weight rather than color noise.

**Key Characteristics:**
- Near-black canvas with a single red accent used sparingly (never a full-bleed gradient wash).
- Bricolage Grotesque display type paired with Manrope body copy and JetBrains Mono for the `@handle`.
- Soft, long-throw glow (never a hard neon edge) behind the avatar and the featured card only.
- A short, curated link list (identity → proof → one conversion path), not an exhaustive directory — brevity is part of the premium feel.
- Every heading is a real heading, never a small tracked eyebrow sitting above one.
- A near-invisible ambient background layer (`components/BackgroundLayer.tsx`, params in `config/background.ts`) sits behind everything — two soft, `filter: blur`-softened red blooms, bottom-anchored (bottom-left primary, bottom-right secondary), drifting independently in clearly opposite horizontal directions (one right/up, one left/down) on its own slow (13s/16s) cycle — roughly 10x slower than the cards' 1.4s ring, "atmosphere," not "energy" — plus a corner vignette and an optional static dot-matrix texture (a perfectly uniform grid, masked off behind the profile header) for depth. The blur is applied to elements that only ever animate `transform`, so it's a one-time cost per layer, not a per-frame recompute. A cosmic-dust/particle (scattered, varied-size "stars") variant was tried and explicitly rejected — don't reintroduce a starfield or particle texture without being asked again; the dot-matrix grid is deliberately the opposite of that (uniform, motionless, reads as technical/architectural rather than cosmic).

## Colors

Restrained strategy: neutrals carry the page, one red accent is spent only on focal actions, proof (featured link), and the identity glow.

### Primary
- **Signal Red** (`#B70C01`): the brand primary. Solid fills, borders, and icon glyphs at large-enough scale (never small running text — it's too dark to clear 4.5:1 against the canvas at text sizes).
- **Signal Red Deep** (`#C50C00`): the brand secondary — the gradient's end-stop, held in reserve for whenever a solid two-stop brand fill is needed again (e.g. a future primary button).
- **Signal Red Light** (`#D0615A`): not a separate brand color — a fixed, verified-accessible tint of Signal Red (contrast ≈ 5.2:1 on canvas), used anywhere the accent sits on text or a fine line: the `@handle` label, hover-state icon accents, and the site-wide focus ring.
- **Signal Red Wash** (`rgba(183,12,1,0.14)`): the accent as a low-opacity fill (icon tiles, radial glow overlays) — never as a solid fill.

### Named Rules
**The One Gradient Rule.** Exactly one gradient is canon — `linear-gradient(135deg, #B70C01 0%, #C50C00 100%)`. It has one live use today: lifted to `--primary-strong`/`--secondary` as the LOCKER spotlight card's border, so the edge reads as luminous rather than a dark maroon line (see Cards / Containers). Reserve it as-is for the day a solid brand fill is needed again (a primary button, a badge). Don't invent a second red gradient — reuse this one, tinted the same way if the raw colors are too dark for the context.

### Neutral
- **Void Black** (`#09090c`): page canvas.
- **Elevated Black** (`#111116`): hover surface for social icons.
- **Card Ink** (`#131318`): default link-card surface.
- **Garnet Ink** (`#221114`): the featured link card's surface — the one surface allowed to carry a visible red tint, mixed at roughly 10% Signal Red into Elevated Black.
- **Bone White** (`#f6f5f9`): primary text.
- **Smoke** (`#9a97a8`): secondary/muted text (contrast ≈ 7:1 on canvas) — a plain neutral gray, deliberately kept out of the accent family so long runs of muted copy never fight the red for attention.
- **Smoke Light** (`#c3c0cf`): bio copy and card descriptions, one step brighter than Smoke.
- **Hairline** (`rgba(247,246,251,0.08)`) / **Hairline Strong** (`rgba(247,246,251,0.16)`): all card borders; brightens on hover, never changes hue.

### Named Rules
**The One Accent Rule.** Signal Red (in any of its three roles above) appears in a handful of fixed spots per screen at most — featured card, status dot, handle label, focus ring, icon-tile borders — and never becomes a background field or a text-gradient.
**The Text-Never-Gets-The-Dark-Red Rule.** `#B70C01` and `#C50C00` are for fills, borders, and large glyphs only. Any text or hairline UI element that needs the accent uses Signal Red Light instead — the raw brand red is under 3:1 against the canvas at that scale and reads as broken, not on-brand.

## Typography

**Display Font:** Bricolage Grotesque (with system-ui, sans-serif fallback)
**Body Font:** Manrope (with system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono

**Character:** A geometric grotesque with quirky bracket-serif details at large sizes (Bricolage Grotesque) carries the welcome headline; Manrope's cleaner, humanist grotesque carries body copy so the intro phrase and card descriptions stay effortless to read; JetBrains Mono marks the `@handle` as data, not prose.

### Hierarchy
- **Display** (600, 2rem / 32px, tight leading): the welcome headline ("Seja bem-vindo(a)") — the single largest text on the page. The designer's name is not displayed on the page itself (it lives in metadata/OG only — see Welcome / Intro Section below).
- **Body** (400–500, 0.9375rem / 15px, 1.625 line-height on the intro phrase / 1.5 on card titles): the intro phrase, card titles. The intro phrase caps at `30ch` on mobile (a natural 3-line wrap) and widens to `42ch` at `sm:` and up, so desktop settles into the intended ~2-line reading shape instead of inheriting the narrower mobile measure.
- **Label** (500, 0.8125rem / 13px): card descriptions, footer credit, muted meta text.
- **Mono label** (500, 0.875rem / 14px): the `@username` handle, in Signal Red Light.

### Named Rules
**The No-Eyebrow Rule.** No small tracked label ever sits above a heading. The heading carries its own weight.

## Layout

Single centered column, `max-width: 30rem` (480px), `1.25rem` side padding — held constant from 375px mobile up through desktop, so desktop never grows into a multi-column app shell; it stays a personal page, just parked in the middle of a wider viewport. Vertical rhythm between the top-level blocks (profile header, link list, footer) is a flat `2.5rem` (40px) gap — none of them carry their own padding/border/background, so the same gap token is the only separation between any two of them. Card-to-card spacing inside the link list is `0.75rem` (12px). The whole page is a single vertical stack — no horizontal scrollers, no multi-section rail. Mobile is the designed size; desktop inherits the identical composition rather than a separate layout.

### Welcome / Intro Section
The profile header's primary content **is** the welcome moment — there is no separate section for it, and nothing sits between the header and the link list. Order: avatar → status badge ("Designer Gráfico") → headline ("Seja bem-vindo(a)", the page's largest text) → `@handle` → a one-sentence intro phrase ending in a short Signal Red Light–colored phrase (never the whole sentence). The designer's name and the old bio paragraph are deliberately not rendered on the page (name lives in metadata/OG only, via `profile.name`; the bio field still feeds the meta description). An earlier iteration added a small "MEUS LINKS E PROJETOS" marker between the header and the links — removed; the phrase's own "clique abaixo" already tells the visitor what's next, so a second label was redundant.

**Two-tier rhythm, not one flat gap.** Badge, headline, handle, and intro are one continuous statement in four parts, so they share a single tight internal wrapper (`gap-3`, 12px) — only the avatar above gets the more generous `gap-6` (24px), since a photograph and a block of text are a genuinely bigger transition than a headline and the sentence that follows it. Earlier this was a single flat `gap-5` (20px) between all three children (avatar, badge+headline+handle, intro); that read as one repeated interval regardless of which relationship it was expressing. Keep this distinction — don't collapse the welcome block back into siblings of the avatar just to reuse one gap value.

## Elevation & Depth

Hybrid: mostly flat, tonal surfaces (Card Ink / Elevated Black step up in lightness rather than using shadow to imply stacking), with soft diffuse shadow reserved for two moments — the avatar's ambient glow and the featured card's outward red glow. Shadows always carry an offset and blur; a flat, zero-offset colored halo is never used as a stand-in for depth. All accent-tinted shadows are computed with `color-mix(in srgb, var(--primary) X%, transparent)` rather than a hardcoded rgb triplet, so a future palette swap only touches the `--primary` token.

### Shadow Vocabulary
- **card** (`0 1px 0 0 rgba(247,246,251,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.65)`): default link card at rest.
- **card-hover** (`0 1px 0 0 rgba(247,246,251,0.04) inset, 0 0 0 1px color-mix(in srgb, var(--primary) 20%, transparent), 0 24px 44px -22px rgba(0,0,0,0.7), 0 16px 32px -20px color-mix(in srgb, var(--primary) 20%, transparent)`): default link card on hover — adds a thin red ring and a soft red-tinted lift shadow.
- **card-featured** (`0 1px 0 0 rgba(247,246,251,0.06) inset, 0 24px 60px -20px color-mix(in srgb, var(--primary) 35%, transparent), 0 20px 40px -24px rgba(0,0,0,0.7)`): the featured (Portfólio) link card.
- **glow-soft** (`0 0 0 2px var(--accent-hot), 0 0 32px 3px color-mix(in srgb, var(--primary) 55%, transparent), 0 0 72px 8px color-mix(in srgb, var(--primary) 24%, transparent)`): the avatar's ring + bloom + outer diffusion, layered in one shadow.

### Named Rules
**The Glow-Is-Rare Rule.** Only three elements on the page ever carry an outward glow: the avatar, the featured link card (Portfólio), and the spotlight card (LOCKER) — and the spotlight's is the only one gradient-tinted rather than single-hue. Everything else stays flat.
**The One Hot Core Rule.** `--accent-hot` (`color-mix(in srgb, white 35%, var(--primary-strong))`) is the single recipe for "the brightest point of red" anywhere on the page — the avatar ring's innermost 2px line, the status badge's solid dot, and the featured cards' hover sweep tint (`--sweep-light-featured`). One shared token instead of separately-tuned reds, so every hot point of the accent reads as the same light. Derived from `--primary-strong`, so it stays correct if the owner ever picks a different accent color.

## Shapes

Corners are large and consistent: `1.25rem` (20px) on every link card, full circle (`999px`) on the status `Badge` pill and the avatar. Icon tiles inside link cards use a smaller `0.85rem` radius so they read as a nested, secondary shape rather than a smaller copy of the card. The site-wide `:focus-visible` outline uses its own small `4px` radius, deliberately tighter than any content shape so the ring reads as an indicator, not another card. Borders are hairline (1px) everywhere; nothing uses a heavier or colored side-border.

## Components

### Cards / Containers
- **Link card** — **Corner:** 1.25rem. **Padding:** 1rem, 1rem gap between icon tile and text. Whole card is one link; hover lifts 2px, scales to a barely-there 1.012 ("the cursor selected this," never "the card jumped"), brightens, and plays the light sweep (see Card Hover Sweep below — every card, featured or plain); the trailing arrow nudges up-right on hover, then a touch further on the actual `:active` tap/click — hover reads as "selected," the extra active step reads as "launched," a small honest acknowledgment right as the tap commits and before the new tab takes over. Same two-step nudge on every card, featured or plain — no one-off treatment. All cards share one transition timing (`--duration-card`, 450ms) and one easing (`--ease-card`, a gentle symmetric curve — not the site's expo-out "snap") for the hover state. Order: WhatsApp, Portfólio, Instagram, LOCKER — a deliberately short list, not a directory.
- **Featured tier** (`featured: true` in `config/links.ts`) — the one "destaque" system, currently WhatsApp and LOCKER, meant to read as one family rather than two one-off treatments. **Background:** Garnet Ink (`--surface-featured`) — a whisper of the brand accent, not a full tint. **Border:** `primary/30` at rest, `primary/40` on hover. **Shadow:** `--shadow-card-featured` / `-hover` — a controlled glow, quieter than it looks, so the card reads as premium rather than neon. **Icon tile:** `primary-strong/30` border + a small contained glow. **Arrow:** tinted Signal Red Light at rest with a small, restrained `drop-shadow`. Any future card can join this tier by setting the one flag; no new CSS to write.
- **Icon tile** — every card's icon tile carries a subtle Signal Red border (`primary/25` plain, `primary-strong/30` + a small glow featured) with the glyph rendered in Bone White or Signal Red Light — never dimmed gray, even at rest.

### Named Rules
**The Selected-Not-Recolored Rule.** Every clickable card shares one hover language: a ~1.012 scale, a lift, a red-tinted border — never a full color change. The sensation is "the cursor selected this," not "this card turned red." "Less movement, more sophistication": animation is finish, not the main attraction — it should never be the first thing a visitor notices about a card.
**The Featured-Is-A-Family Rule.** Featured cards share one visual system, not a collection of bespoke one-offs. A second (or third) featured card should look like a sibling of the first — same border/glow/background math, differing only in content — never a new, unrelated "special" treatment invented per card.

### Card Hover Sweep
A one-shot light sweep plays across **every** card (WhatsApp, Portfólio, Instagram, LOCKER alike) on hover-enter: a soft, wide reflection band (a gradual ramp to one gentle peak and back — never a hard-edged bar) translates from fully off the left edge to fully off the right edge over 600ms (`--ease-card`). Two color variants, same system: `--sweep-light-neutral` (Bone White, ~7–10% alpha) on the plain dark cards, `--sweep-light-featured` (`--accent-hot`, a white-touched red, ~10–15% alpha) on the two featured cards — a plain white sweep read as a mismatched cool highlight on their warm red surface. Implemented as CSS `transform` + `@keyframes` only (no JS, no layout-affecting properties), scoped inside the card's existing `overflow-hidden`; fires once per hover-enter (`animation-iteration-count: 1`, no `infinite`) and re-fires on the next hover-enter after the pointer leaves and returns.

**Reduced motion is an exception, not a kill switch, for this one effect.** Every other animation/transition on the page collapses to ~0ms under `prefers-reduced-motion: reduce` — the sweep gets its own carve-out (`.sweep-light` in globals.css) that keeps it alive at a shorter 320ms and 55% opacity, because it's purely decorative and user-triggered (never autoplaying). If it ever looks off, check `.sweep-light`'s reduced-motion rule before assuming a real bug.

**Retired: the perimeter-light "Featured Ring."** WhatsApp and LOCKER previously carried a continuously-travelling SVG stroke-dasharray light around their border (several tuning passes: a conic-gradient prototype, then measured-perimeter SVG builds at 24%, 10%, and finally a tapered 2–7% multi-layer "comet"). Removed entirely at the user's request — it never read as the intended "light traveling a wire," and the featured tier now uses the exact same hover sweep as every other card, just tinted for the red surface. No trace of the technique remains: `components/links/FeaturedRing.tsx` is deleted, `config/links.ts`'s `ringAntiphase` field is gone, and `.ring-track`/`.ring-core`/`.ring-halo`/`.ring-bloom`/`@keyframes ring-travel`/`--ring-duration` are gone from `globals.css`. Don't reintroduce a perimeter-travelling light without being asked again.

### Card Entrance
Each link card rises in on page load — the same `rise` keyframes (opacity 0→1, `translateY(14px)→0`) the profile header already uses, on its own `--duration-card-rise` (600ms) token so tuning the cards never touches the header's timing. Staggered 80ms apart in list order (WhatsApp 0ms, Portfólio 80ms, Instagram 160ms, LOCKER 240ms) so the list reads as content arriving, not a single block popping in. `animation-fill-mode: both` holds the pre-animation (invisible) state before its delay elapses and the post-animation (visible) state forever after — under `prefers-reduced-motion: reduce` the animation still runs (collapsed to ~0ms by the global override) and ends on that same visible state, so cards are never gated behind motion to appear.

### Inputs / Fields
None in this template (no forms — contact routes to WhatsApp via a link card).

### Navigation
None — this is a single-scroll page with three sections. In-page wayfinding is the section rhythm only.

### Signature Component: Avatar
Server-side (now an async Server Component): resolves the photo in priority order — the current Vercel Blob upload (`lib/avatar-store.ts`), then a real photo at `public/images/avatar.png`, then a generated monogram (initials on a radial red-to-ink gradient disc). Either way it's ringed by the same layered glow — a crisp 2px `--accent-hot` ring, a medium red bloom, and a soft outer diffusion — the page's single most prominent use of the accent, since it's also the first thing a visitor sees. The innermost ring intentionally quotes the featured-card ring's own white-touched core (see The One Hot Core Rule) rather than a flat `--primary-strong`, so the page's two ring devices — one static, one traveling — read as the same hand rather than two coincidentally-similar reds. Sized 96px on mobile, 104px at `sm:` and up. The footer's small `size="sm"` variant swaps the glow for a hairline accent ring and never shows the edit badge.

### Status Badge
`components/ui/Badge.tsx` — the pill above the headline ("Designer Gráfico") sets its text in JetBrains Mono, not the body sans, so it echoes the `@handle` two lines below it rather than reading as a generic rounded-pill/status-dot component borrowed from a SaaS template. It stays a bounded chip (border, background, padding) on purpose — it must never become bare tracked text floating above the headline, which would be an eyebrow (banned, see Don't). The live dot's solid center uses `--accent-hot`, the same one-hot-core recipe as the avatar ring.

### Editable Avatar (owner-only)
A small camera badge (`components/profile/AvatarEditButton.tsx`) sits at the avatar's bottom-right — 32px visible circle, its actual hit area quietly expanded a few px past the visible circle so it stays touch-friendly without looking bigger. **Muted at rest, on-brand on hover/focus**: a neutral border/icon color and 75% opacity until hovered or focused, the same restraint the footer's palette icon already used — a first-time visitor scanning the page shouldn't read this as "the" interactive element to try; the red-accent, full-opacity treatment only shows up once someone has actually reached for it. `:focus-visible` uses a bone-white outline (`--color-fg`), not the site-wide red ring — the avatar's own permanent glow and the default red focus ring would otherwise sit on top of each other and make focus invisible; this is the one control on the page that needs its own outline color for exactly that reason. A small `-rotate-6` on the camera glyph itself on hover/focus is the one deliberate delight touch here. It never carries a strong glow at rest (Glow-Is-Rare stays intact) and it's absent from the footer's small avatar — only the main profile photo is editable. Clicking it opens `components/ui/Modal.tsx` (the project's first modal — reuse it before building another) through a password → picker/preview → uploading → success sequence, styled with the same surface/border/radius tokens as the rest of the page (no separate visual language for "admin" UI). The success checkmark (shared with `ThemeColorEditButton.tsx`) pops in (`--animate-pop`, scale + fade, 420ms) rather than cutting in flat — these are rare, identity-level actions for the one person who ever sees them, so the state change is allowed a small, considered arrival instead of feeling routine. One-shot on mount, not a loop; collapses under `prefers-reduced-motion` like everything else.

### Social presence
There is no dedicated social-icon row on the page. Instagram, Behance, and WhatsApp are represented purely as link cards (Behance doubles as the featured Portfólio card) — one consistent surface for every outbound link instead of a duplicated icon row plus a card list. (`components/social/SocialLinks.tsx` was removed for this reason; `components/social/icons.tsx` remains, since `LinkCard` still uses those same brand glyphs.)

## Do's and Don'ts

### Do:
- **Do** keep Signal Red to the roles listed in the Colors section — featured card, status dot, handle, focus ring, icon-tile borders.
- **Do** use Signal Red Light (never the raw brand hexes) for the accent on text and hairline UI — it's the one tint verified to clear WCAG contrast on the canvas.
- **Do** keep the link list short and curated (three cards today) rather than growing it into an exhaustive directory — brevity is the point.
- **Do** keep the page a single centered column (max 30rem) at every viewport, including desktop.
- **Do** respect `prefers-reduced-motion`: all transitions and the entrance animation collapse to near-zero duration.

### Don't:
- **Don't** add a kicker/eyebrow label above any heading.
- **Don't** let glow spread beyond the avatar and the featured link card.
- **Don't** use gradient text for emphasis — weight and size carry emphasis instead.
- **Don't** create a second red gradient — reuse the canon 135deg brand gradient the day a solid brand fill is needed again.
- **Don't** introduce a second accent color; if a status/semantic color is ever needed (e.g. an error state), derive it from outside the red family and use it as sparingly as red is used here.
