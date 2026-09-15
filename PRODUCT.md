# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Confirmed.** Two distinct roles, not one:
- **Owner/operator: Vinicius Muniz himself.** The one person who edits `config/`, swaps assets, and — via the two password-gated in-page tools — updates his own profile photo and accent color directly on the live site, without a code deploy for every small change.
- **Visitors:** people arriving from his Instagram/TikTok bio link, who need to quickly read who he is and reach his portfolio, social presence, WhatsApp, or his own product (LOCKER).

This is Vinicius's own personal site, not a multi-tenant product or a template business — reusable, config-driven architecture is an implementation quality he wanted (so *he* never has to touch components for his own edits), not a go-to-market goal of reselling or duplicating it for other designers. Earlier drafts of this file inferred a "template for other designers" framing; confirmed with the user that this is incorrect.

## Product Purpose

A production-ready personal Link Bio page for Vinicius Muniz (graphic designer): a single premium page that works as his digital business card and a short, curated contact funnel to his portfolio, Instagram, WhatsApp, and his own product (LOCKER). Ships as static, config-driven content so Vinicius can update his own identity, links, photo, and accent color without touching component code. Today that owner-editing happens through two password-gated in-page tools (profile photo, accent color) plus direct config edits; a fuller `/dashboard` is a confirmed planned next phase (not yet built) — see Capabilities and Constraints.

## Positioning

Refuses the generic "list of buttons on a gradient background" link-in-bio look, and also refuses to become an exhaustive link directory. The mechanism a generic link-in-bio tool can't casually replicate: a deliberately short list of premium content cards (icon + title + description + affordance) with a distinct featured tier (shared by WhatsApp and LOCKER today, not a one-off), arranged in an editorial vertical composition (a personal welcome moment → a handful of links → credit line) rather than a flat button stack or a kitchen-sink page.

## Operating Context

- Distributed as a Next.js (App Router) + TypeScript + Tailwind CSS v4 codebase.
- No database, no payments, no multi-tenant system, no user accounts. There are exactly two protected actions — replacing the profile photo, and picking the accent color — both gated by the same single shared admin password (see below); everything else on the page stays public, static, config-driven content.
- Content lives in `config/` (profile, social links, link cards, theme tokens) so Vinicius updates his own site by editing config and swapping assets in `public/`, not by touching components.
- Primary traffic source is a bio link tapped from Instagram/TikTok on a phone; desktop is a secondary, still-supported context.
- **Editable avatar**: a small camera badge on the profile photo opens a password-gated modal (`components/profile/AvatarEditButton.tsx`) to upload a replacement. Auth is a signed, HttpOnly cookie (`lib/admin-auth.ts`) — no user table, the password is `ADMIN_PASSWORD` from env. `POST /api/admin/login` (shared by both editors) is rate-limited per IP (`lib/rate-limit.ts`, 8 attempts / 15min, best-effort in-memory since there's no database) so the single shared password can't be brute-forced from the public internet; both editors' login step also shows a spinner and disables the form while the request is in flight, so a slow connection or an impatient double-click can't fire a second concurrent attempt. The photo itself is stored in Vercel Blob (`lib/avatar-store.ts`, fixed pathname so the URL is stable) and requires `BLOB_READ_WRITE_TOKEN` in production; without either env var the page still works exactly as before (falls back to `public/images/avatar.png` / initials), only the camera badge's login step fails closed with a clear error. Uploading calls `revalidatePath("/")`, which is also why `/` moved from fully static to ISR (`export const revalidate = 60` in `app/page.tsx`).
- **Editable accent color**: a deliberately tiny, low-opacity palette icon centered in the footer (`components/ThemeColorEditButton.tsx`) opens the same password-gated modal pattern. Picking a color live-previews it (client-side, via `lib/color.ts`'s pure derivation math) before saving. Only the accent tokens change (`--primary`, `--secondary`, `--primary-gradient`, `--primary-strong`, `--primary-soft`, `--ring`) — canvas, surfaces, and text are fixed and never user-editable. The chosen hex is the only thing persisted (`lib/theme-store.ts`, Vercel Blob, `theme/color.json`); the secondary/gradient/accessible-tint tokens are re-derived from it on every read (WCAG-contrast-checked against the canvas automatically, the same process used by hand to pick the shipped #D0615A tint of #B70C01 — see lib/color.ts's `deriveAccessibleTint`), so a future color never needs a human to re-verify contrast. Falls back to the shipped red identity when unset or Blob isn't configured. Prepared for a future `/dashboard` to read/write the same `theme/color.json` resource instead of this in-page picker.

## Capabilities and Constraints

- Confirmed: no user accounts, no CMS, no analytics/payments in this phase.
- Confirmed: mobile-first, must hold up cleanly at 375/390/414/430px and on desktop.
- Confirmed: a fuller `/dashboard` (authenticated, beyond today's two password-gated modals) is a planned next phase, not just a hypothetical extension point — the avatar/color editors and `lib/theme-store.ts`'s Blob-backed persistence were deliberately shaped so a future dashboard can read/write the same resources instead of needing a rebuild.
- Confirmed: the production domain (`config/profile.ts`'s `siteUrl`) is still pending — the `https://example.com` placeholder stays until the real domain is known.
- pt-BR copy throughout; no other locale is in scope — this is Vinicius's own site, not a template needing bilingual support.

## Evidence on Hand

The live demo now carries the real designer's own identity: name (Vinicius Muniz — used in metadata/OG only, not displayed on the page itself), handle (@vinicius.dsgn7, displayed), a real photo (`public/images/avatar.png`), and real social/portfolio links (Behance, Instagram, WhatsApp — see `config/social.ts` and `config/links.ts`). The profile header leads with a "Seja bem-vindo(a)" welcome headline and a short intro phrase instead of the name and a bio paragraph; there is no dedicated social-icon row — Behance/Instagram/WhatsApp are represented only as link cards, one consistent surface for every outbound link. Dribbble/LinkedIn/YouTube/email were never part of that set. No project case-study content is shown on the page (that section was removed — see Product Principles). The LOCKER link card (the owner's own product, a store-management tool) now has a real, confirmed URL (`https://www.lockerapp.com.br/landing`) and its official logo (`public/images/locker-icon.svg` — a lime-green rounded-square "L" mark, LOCKER's own brand color, independent of this page's red accent). The site's canonical domain (`config/profile.ts`'s `siteUrl`) is still the placeholder `https://example.com`, pending the real production domain.

## Product Principles

1. The page is a composed editorial page, not a button list — hierarchy and pacing do the work generic templates skip.
   - The link list itself stays short and curated (four cards today, in order: WhatsApp, Portfólio, Instagram, LOCKER) rather than growing into an exhaustive directory; the projects rail and services list sections were deliberately removed to match a reference the user provided. WhatsApp and LOCKER share one "featured" visual tier (see DESIGN.md); Portfólio and Instagram are plain.
2. Content is config, not code: swapping a designer's identity should never require touching a component.
3. Mobile is the primary and hardest-tested surface; desktop inherits the same composition in a constrained centered column rather than a separate layout.
4. Effects (glow, gradient, motion) are seasoning used with restraint, never the substitute for hierarchy.
5. Ship production-clean: metadata, OG, accessibility, and real focus/hover states are part of "done," not a follow-up.

## Accessibility & Inclusion

No specific standard was named. Building to WCAG 2.1 AA baseline (contrast, focus visibility, semantic structure, alt text, `prefers-reduced-motion`) as the working default.
