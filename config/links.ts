import { socialLinks } from "./social";

export type LinkIcon = "behance" | "instagram" | "whatsapp" | "locker";

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: LinkIcon;
  /** Featured links get the elevated glow/gradient treatment. Keep this rare. */
  featured?: boolean;
  /**
   * A tier above `featured`: a self-product callout (dark→red→dark fill,
   * glowing gradient border, tinted arrow). Keep this to at most one card —
   * it reads as "my own product," not another portfolio/contact link.
   */
  spotlight?: boolean;
  active: boolean;
}

const behanceHref = socialLinks.find((s) => s.id === "behance")!.href;
const instagramHref = socialLinks.find((s) => s.id === "instagram")!.href;
const whatsappHref = socialLinks.find((s) => s.id === "whatsapp")!.href;

export const links: LinkItem[] = [
  {
    id: "portfolio",
    title: "Portfólio",
    description: "Confira meus principais projetos e trabalhos de design.",
    url: behanceHref,
    icon: "behance",
    featured: true,
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
    id: "whatsapp",
    title: "Fale comigo no WhatsApp",
    description: "Vamos conversar sobre o seu projeto.",
    url: whatsappHref,
    icon: "whatsapp",
    active: true,
  },
  {
    id: "locker",
    title: "LOCKER | Gestão simples para sua loja",
    description: "Meu produto: conheça e veja como funciona.",
    url: "https://www.lockerapp.com.br/landing",
    icon: "locker",
    spotlight: true,
    active: true,
  },
];
