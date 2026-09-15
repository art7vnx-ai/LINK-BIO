import { links } from "@/config/links";
import { LinkCard } from "./LinkCard";

export function LinkList() {
  const active = links.filter((link) => link.active);

  return (
    <section aria-labelledby="links-heading" className="flex flex-col gap-3">
      <h2 id="links-heading" className="sr-only">
        Links
      </h2>
      {active.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </section>
  );
}
