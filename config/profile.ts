/**
 * TODO: replace with the real production domain before deploying — this
 * placeholder is intentionally the IANA reserved documentation domain
 * (never a guessed-at real one) so canonical/OG/sitemap URLs stay honest
 * until the actual domain is known. Used by app/layout.tsx, app/robots.ts,
 * and app/sitemap.ts — change it once here.
 */
export const siteUrl = "https://example.com";

export const profile = {
  name: "Vinicius Muniz",
  username: "vinicius.dsgn7",
  /** Two letters used by the generated placeholder avatar when no photo exists at public/images/avatar.png. */
  initials: "VM",
  badge: "Designer Gráfico",
  bio: "Design que conecta marcas e pessoas. Criando identidades visuais, interfaces e experiências digitais.",
  /** Short line used where space is tight (OG image, meta description fallback). */
  tagline: "Design que conecta marcas e pessoas.",
  location: "São Paulo, Brasil",
} as const;

/** Copy for the welcome headline/phrase inside the profile header. */
export const welcome = {
  headline: "Seja bem-vindo(a)",
  text: "Tem um projeto em mente? Clique abaixo e vamos transformar sua ",
  /** Rendered in the accent color at the end of `text` — keep this short; never recolor the whole sentence. */
  textHighlight: "ideia em realidade.",
} as const;
