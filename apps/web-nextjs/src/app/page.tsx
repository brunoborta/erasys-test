import type { Metadata } from "next";
import { getAllImageUrls, getProfile, getPublicPictures } from "@borta/user-pictures";
import { ProfileHeader } from "@/components/features/ProfileHeader";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { MasonryGrid } from "@/components/ui/MasonryGrid";
import { StatsSection } from "@/components/features/StatsSection";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const publicPictures = getPublicPictures(profile);
  
  return {
    title: `${profile.name} - Profile Gallery`,
    description: profile.headline || `View ${profile.name}'s photo gallery with ${publicPictures.length} public photos`,
    openGraph: {
      title: `${profile.name} - Profile Gallery`,
      description: profile.headline || `View ${profile.name}'s photo gallery`,
      type: "profile",
      images: publicPictures.length > 0 ? [
        {
          url: getAllImageUrls(profile, true)[0],
          width: publicPictures[0].width,
          height: publicPictures[0].height,
          alt: `${profile.name} - Featured Photo`,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} - Profile Gallery`,
      description: profile.headline || `View ${profile.name}'s photo gallery`,
    },
  };
}

export default async function Home() {
  const profile = await getProfile();
  const imageUrls = getAllImageUrls(profile, true);
  const publicPictures = getPublicPictures(profile);

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": profile.name,
      "description": profile.headline,
      "identifier": profile.id,
    },
    "image": publicPictures.length > 0 ? {
      "@type": "ImageGallery",
      "numberOfItems": publicPictures.length,
      "image": publicPictures.slice(0, 10).map((pic, idx) => ({
        "@type": "ImageObject",
        "contentUrl": imageUrls[idx],
        "width": pic.width,
        "height": pic.height,
        "caption": `${profile.name} - Photo ${idx + 1}`,
      })),
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
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
