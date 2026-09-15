import { profile } from "@/config/profile";
import { Avatar } from "@/components/profile/Avatar";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-4 pb-2 pt-1">
      {/* Hairline divider: near-invisible dark line with a faint accent
          midpoint — a signature's underline, not a section boundary. */}
      <div
        aria-hidden
        className="h-px w-full"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, var(--border-strong) 18%, color-mix(in srgb, var(--primary-strong) 45%, var(--border-strong)) 50%, var(--border-strong) 82%, transparent 100%)",
        }}
      />

      <div className="flex items-center justify-between gap-4 sm:items-start">
        {/* Mobile: avatar + name/badge signature. */}
        <div className="flex items-center gap-2.5 sm:hidden">
          <Avatar size="sm" initials={profile.initials} name={profile.name} />
          <div className="flex flex-col">
            <span className="text-[0.8125rem] font-semibold text-fg">
              {profile.name}
            </span>
            <span className="text-[0.6875rem] text-muted">{profile.badge}</span>
          </div>
        </div>

        {/* Desktop: plain credit line. */}
        <p className="hidden text-sm text-muted-strong sm:block">
          Feito por <span className="font-semibold text-fg">{profile.name}</span>
        </p>

        <div className="flex flex-col items-end text-right">
          <span className="text-[0.6875rem] text-muted-strong sm:text-xs">
            © {year}
            <span className="hidden sm:inline"> {profile.name}</span>
          </span>
          <span className="text-[0.6875rem] text-muted sm:text-xs">
            Todos os direitos reservados
          </span>
        </div>
      </div>
    </footer>
  );
}
