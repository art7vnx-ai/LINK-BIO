import { socialLinks } from "./social";

export type LinkIcon = "behance" | "instagram" | "whatsapp" | "locker";

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: LinkIcon;
  /**
   * The one "destaque" tier: a red border, a subtle glow, and a slightly
   * brighter surface. WhatsApp and LOCKER share this — it's a family, not a
   * one-off; any future card can join by setting this true, with no new CSS
   * to write. All cards (featured or not) share the same hover sweep — see
   * `--sweep-light-featured` vs `--sweep-light-neutral` in globals.css.
   */
  featured?: boolean;
  active: boolean;
}

const behanceHref = socialLinks.find((s) => s.id === "behance")!.href;
const instagramHref = socialLinks.find((s) => s.id === "instagram")!.href;
const whatsappHref = socialLinks.find((s) => s.id === "whatsapp")!.href;

export const links: LinkItem[] = [
  {
    id: "whatsapp",
    title: "Fale comigo no WhatsApp",
    description: "Vamos conversar sobre o seu projeto.",
    url: whatsappHref,
    icon: "whatsapp",
    featured: true,
    active: true,
  },
  {
    id: "portfolio",
    title: "Portfólio",
    description: "Confira meus principais projetos e trabalhos de design.",
    url: behanceHref,
    icon: "behance",
    active: true,
  },
  {
    id: "instagram",
    title: "Instagram",
    description: "Acompanhe meu trabalho e conteúdo diário.",
    url: instagramHref,
    icon: "instagram",
    active: true,
  },
  {
    id: "locker",
    title: "LOCKER | Gestão simples para sua loja",
    description: "Meu produto: conheça e veja como funciona.",
    url: "https://www.lockerapp.com.br/landing",
    icon: "locker",
    featured: true,
    active: true,
  },
];
