export type SocialId = "instagram" | "behance" | "whatsapp";

export interface SocialLink {
  id: SocialId;
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/vinicius.dsgn7/" },
  { id: "behance", label: "Behance", href: "https://www.behance.net/vnxart7" },
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/message/HQKOFDZTYE6HA1" },
];
