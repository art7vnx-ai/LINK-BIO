import { profile, welcome } from "@/config/profile";
import { Avatar } from "./Avatar";
import { Badge } from "@/components/ui/Badge";

export function ProfileHeader() {
  return (
    <header className="flex flex-col items-center gap-5 pt-4 text-center">
      <div className="[animation:var(--animate-rise)]">
        <Avatar initials={profile.initials} name={profile.name} />
      </div>

      <div
        className="flex flex-col items-center gap-3 [animation:var(--animate-rise)] [animation-delay:80ms]"
      >
        <Badge>{profile.badge}</Badge>

        <div className="flex flex-col items-center gap-1.5">
          <h1 className="font-display text-[2rem] font-semibold leading-tight tracking-tight text-fg">
            {welcome.headline}
          </h1>
          <p className="font-mono text-sm text-primary-strong">
            @{profile.username}
          </p>
        </div>
      </div>

      <p className="max-w-[30ch] sm:max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted-strong [animation:var(--animate-rise)] [animation-delay:160ms]">
        {welcome.text}
        <span className="text-primary-strong">{welcome.textHighlight}</span>
      </p>
    </header>
  );
}
