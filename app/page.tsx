import { Container } from "@/components/ui/Container";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LinkList } from "@/components/links/LinkList";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Container>
        <div className="flex flex-col gap-10 py-10">
          <ProfileHeader />
          <LinkList />
          <SiteFooter />
        </div>
      </Container>
    </main>
  );
}
