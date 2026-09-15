import SiInstagram from "@icons-pack/react-simple-icons/icons/SiInstagram";
import SiBehance from "@icons-pack/react-simple-icons/icons/SiBehance";
import SiWhatsapp from "@icons-pack/react-simple-icons/icons/SiWhatsapp";
import type { ComponentType } from "react";
import type { SocialId } from "@/config/social";

export const socialIcons: Record<SocialId, ComponentType<{ size?: number }>> = {
  instagram: SiInstagram,
  behance: SiBehance,
  whatsapp: SiWhatsapp,
};
