import { useEffect, useState } from "react";
import {
  buildImageUrl,
  getPublicPictures,
  getSafePictures,
  type Profile,
} from "@borta/user-pictures";
import { PhotoCard, Overlay, ProfileHeader, StatsSection } from "@borta/web-ui";
import "./globals.css";

const slug = import.meta.env.VITE_PROFILE_SLUG || "msescortplus";
const API_URL = `/api/profile/${slug}`;

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Profile) => {
        setProfile(data);
        document.title = `${data.name} | Erasys Test`;
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-background-secondary">
        <p className="text-foreground-secondary text-lg">Failed to load profile: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-background-secondary">
        <p className="text-foreground-secondary text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  const safePictures = getSafePictures(profile);
  const publicPictures = getPublicPictures(profile);

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background-secondary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-card-bg focus:text-foreground focus:border focus:border-border focus:outline-none"
      >
        Skip to content
      </a>
      <main id="main-content" className="container mx-auto px-4 py-12">
        <ProfileHeader name={profile.name} headline={profile.headline} profileId={profile.id} />

        <section aria-label="Photo Gallery">
          <h2 className="sr-only">Photo Gallery</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {safePictures.map((picture, index) => (
              <PhotoCard
                key={picture.id}
                className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)]"
                aspectRatio={3 / 4}
                imageSlot={
                  <img
                    src={buildImageUrl(picture.url_token)}
                    alt={`Photo by ${profile.name} - ${picture.width}x${picture.height} pixels, rating ${picture.rating}`}
                    className="absolute inset-0 w-full h-full object-cover"
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
          </div>
        </section>

        <StatsSection
          stats={[
            { value: safePictures.length, label: "Safe Photos" },
            { value: publicPictures.length, label: "Public Photos" },
            { value: profile.pictures.length, label: "Total Photos" },
          ]}
        />
      </main>
    </div>
  );
}
