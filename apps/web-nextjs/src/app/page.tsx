import type { Metadata } from "next";
import Image from "next/image";
import { buildImageUrl, getPublicPictures } from "@borta/user-pictures";
import { PhotoCard, MasonryGrid, Overlay, ProfileHeader, StatsSection } from "@borta/web-ui";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

import { getProfile } from "@/lib/profile";
import { generateProfileMetadata, generateJsonLDData } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return generateProfileMetadata(profile);
}

export default async function Home() {
  const profile = await getProfile();
  const publicPictures = getPublicPictures(profile);

  // Generate JSON-LD structured data for SEO
  const structuredData = generateJsonLDData(profile);

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background-secondary">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      <ThemeSwitcher />
      <main id="main-content" className="container mx-auto px-4 py-12">
        <ProfileHeader name={profile.name} headline={profile.headline} profileId={profile.id} />

        <section aria-label="Photo Gallery">
          <h2 className="sr-only">Photo Gallery</h2>
          <MasonryGrid>
            {publicPictures.map((picture, index) => (
              <PhotoCard
                key={picture.id}
                className="mb-4 break-inside-avoid"
                aspectRatio={picture.width / picture.height}
                imageSlot={
                  <Image
                    src={buildImageUrl(picture.url_token)}
                    alt={`Photo by ${profile.name} - ${picture.width}x${picture.height} pixels, rating ${picture.rating}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 380px"
                    quality={80}
                    priority={index < 4}
                    fetchPriority={index < 4 ? "high" : "auto"}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                }
                overlaySlot={
                  <Overlay
                    title={`${picture.width} × ${picture.height}`}
                    subtitle={`Rating: ${picture.rating}`}
                  />
                }
                captionSlot={
                  <figcaption className="sr-only">
                    Photo {index + 1} by {profile.name}, dimensions {picture.width} by{" "}
                    {picture.height} pixels
                  </figcaption>
                }
              />
            ))}
          </MasonryGrid>
        </section>

        <StatsSection
          stats={[
            { value: publicPictures.length, label: "Public Photos" },
            { value: profile.pictures.length, label: "Total Photos" },
          ]}
        />
      </main>
    </div>
  );
}
