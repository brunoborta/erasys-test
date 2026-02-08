import type { Metadata } from "next";
import { getAllImageUrls, getPublicPictures } from "@borta/user-pictures";
import { ProfileHeader } from "@/components/features/ProfileHeader";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { MasonryGrid } from "@/components/ui/MasonryGrid";
import { StatsSection } from "@/components/features/StatsSection";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { getProfile } from "@/lib/profile";
import { generateProfileMetadata, generateJsonLDData } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return generateProfileMetadata(profile);
}

export default async function Home() {
  const profile = await getProfile();
  const imageUrls = getAllImageUrls(profile, true);
  const publicPictures = getPublicPictures(profile);

  // Generate JSON-LD structured data for SEO
  const structuredData = generateJsonLDData(profile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      <ThemeSwitcher />
      <main className="container mx-auto px-4 py-12">
        <ProfileHeader profile={profile} />
        
        <section aria-label="Photo Gallery">
          <h2 className="sr-only">Photo Gallery</h2>
          <MasonryGrid>
            {publicPictures.map((picture, index) => (
              <figure className="mb-4 break-inside-avoid" key={picture.id}>
                <PhotoCard
                  picture={picture}
                  imageUrl={imageUrls[index]}
                  profileName={profile.name}
                  index={index}
                />
              </figure>
              
            ))}
          </MasonryGrid>
        </section>

        <StatsSection 
          publicCount={publicPictures.length}
          totalCount={profile.pictures.length}
        />
      </main>
    </div>
  );
}
