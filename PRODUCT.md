# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Designers, freelancers, and creative professionals who need one link in their Instagram/TikTok bio that reads as a professional presence rather than a generic link directory. [Inferred from the brief; not separately confirmed with the user.]

## Product Purpose

A production-ready, reusable Link Bio template: a single premium personal page that works as a digital business card and a short, curated contact funnel. Ships as static, config-driven content (no login, no dashboard, no database) so it can be duplicated and re-skinned per designer/client by editing a handful of config files.

## Positioning

Refuses the generic "list of buttons on a gradient background" link-in-bio look, and also refuses to become an exhaustive link directory. The mechanism a competitor's default template can't casually copy: a deliberately short list of premium content cards (icon + title + description + affordance) with a distinct featured variant, arranged in an editorial vertical composition (a personal welcome moment → a handful of links → credit line) rather than a flat button stack or a kitchen-sink page.

## Operating Context

- Distributed as a Next.js (App Router) + TypeScript + Tailwind CSS v4 codebase.
- No backend, no auth, no database, no payments, no multi-tenant system in this version.
- Content lives in `config/` (profile, social links, link cards, theme tokens) so a new designer's site is produced by editing config and swapping assets in `public/`, not by touching components.
- Primary traffic source is a bio link tapped from Instagram/TikTok on a phone; desktop is a secondary, still-supported context.

## Capabilities and Constraints

- Confirmed: no user accounts, no CMS, no analytics/payments in this phase.
- Confirmed: mobile-first, must hold up cleanly at 375/390/414/430px and on desktop.
- Open/undecided: whether future duplicates of this template target a Brazilian-only or bilingual audience. This build uses Portuguese (pt-BR) copy.

## Evidence on Hand

The live demo now carries the real designer's own identity: name (Vinicius Muniz — used in metadata/OG only, not displayed on the page itself), handle (@vinicius.dsgn7, displayed), a real photo (`public/images/avatar.png`), and real social/portfolio links (Behance, Instagram, WhatsApp — see `config/social.ts` and `config/links.ts`). The profile header leads with a "Seja bem-vindo(a)" welcome headline and a short intro phrase instead of the name and a bio paragraph; there is no dedicated social-icon row — Behance/Instagram/WhatsApp are represented only as link cards, one consistent surface for every outbound link. Dribbble/LinkedIn/YouTube/email were never part of that set. No project case-study content is shown on the page (that section was removed — see Product Principles). The LOCKER link card (the owner's own product, a store-management tool) now has a real, confirmed URL (`https://www.lockerapp.com.br/landing`) and its official logo (`public/images/locker-icon.svg` — a lime-green rounded-square "L" mark, LOCKER's own brand color, independent of this page's red accent). The site's canonical domain (`config/profile.ts`'s `siteUrl`) is still the placeholder `https://example.com`, pending the real production domain.

## Product Principles

1. The page is a composed editorial page, not a button list — hierarchy and pacing do the work generic templates skip.
   - The link list itself stays short and curated (three cards today: portfolio, Instagram, WhatsApp) rather than growing into an exhaustive directory; the projects rail and services list sections were deliberately removed to match a reference the user provided.
2. Content is config, not code: swapping a designer's identity should never require touching a component.
3. Mobile is the primary and hardest-tested surface; desktop inherits the same composition in a constrained centered column rather than a separate layout.
4. Effects (glow, gradient, motion) are seasoning used with restraint, never the substitute for hierarchy.
5. Ship production-clean: metadata, OG, accessibility, and real focus/hover states are part of "done," not a follow-up.

## Accessibility & Inclusion

No specific standard was named. Building to WCAG 2.1 AA baseline (contrast, focus visibility, semantic structure, alt text, `prefers-reduced-motion`) as the working default.
