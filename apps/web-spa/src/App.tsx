import { useEffect, useState } from "react";
import {
  getImageUrls,
  getPublicPictures,
  type Profile,
} from "@borta/user-pictures";
import {
  PhotoCard,
  Overlay,
  ProfileHeader,
  StatsSection,
} from "@borta/web-ui";
import "./globals.css";

const API_URL = "/api/profile/msescortplus";

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-background-secondary">
        <p className="text-foreground-secondary text-lg">
          Failed to load profile: {error}
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-background-secondary">
        <p className="text-foreground-secondary text-lg animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  const imageUrls = getImageUrls(profile);
  const publicPictures = getPublicPictures(profile);

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background-secondary">
      <main className="container mx-auto px-4 py-12">
        <ProfileHeader
          name={profile.name}
          headline={profile.headline}
          profileId={profile.id}
        />

        <section aria-label="Photo Gallery">
          <h2 className="sr-only">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {publicPictures.map((picture, index) => (
              <figure className="w-full" key={picture.id}>
                <PhotoCard
                  aspectRatio={3 / 4}
                  imageSlot={
                    <img
                      src={imageUrls[index]}
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
                      Photo {index + 1} by {profile.name}, dimensions{" "}
                      {picture.width} by {picture.height} pixels
                    </figcaption>
                  }
                />
              </figure>
            ))}
          </div>
        </section>

        <StatsSection
          publicCount={publicPictures.length}
          totalCount={profile.pictures.length}
        />
      </main>
    </div>
  );
}
