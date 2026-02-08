import { getAllImageUrls, getProfile, getPublicPictures } from "@borta/user-pictures";
import { ProfileHeader } from "@/components/features/ProfileHeader";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { MasonryGrid } from "@/components/ui/MasonryGrid";
import { StatsSection } from "@/components/features/StatsSection";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export default async function Home() {
  const profile = await getProfile();
  const imageUrls = getAllImageUrls(profile, true);
  const publicPictures = getPublicPictures(profile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary">
      <ThemeSwitcher />
      <main className="container mx-auto px-4 py-12">
        <ProfileHeader profile={profile} />
        
        <MasonryGrid>
          {publicPictures.map((picture, index) => (
            <PhotoCard
              key={picture.id}
              picture={picture}
              imageUrl={imageUrls[index]}
              profileName={profile.name}
              index={index}
            />
          ))}
        </MasonryGrid>

        <StatsSection 
          publicCount={publicPictures.length}
          totalCount={profile.pictures.length}
        />
      </main>
    </div>
  );
}
