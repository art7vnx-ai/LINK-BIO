import { Container } from "@/components/ui/Container";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LinkList } from "@/components/links/LinkList";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Revalidate periodically because the avatar (ProfileHeader → Avatar) now
 * reads the current photo from Vercel Blob at render time. The upload route
 * also calls revalidatePath("/") so a new photo shows up immediately —
 * this is only the fallback cadence, not the primary refresh path.
 */
export const revalidate = 60;

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
