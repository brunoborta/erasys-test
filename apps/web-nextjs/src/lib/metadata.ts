import type { Metadata } from "next";
import type { Profile } from "@borta/user-pictures";
import { buildImageUrl, getPublicPictures } from "@borta/user-pictures";

export function generateProfileMetadata(profile: Profile): Metadata {
  const publicPictures = getPublicPictures(profile);
  const description = profile.headline || `View ${profile.name}'s photo gallery with ${publicPictures.length} photos`;

  return {
    title: profile.name,
    description,
    openGraph: {
      title: `${profile.name} | Erasys Test`,
      description,
      type: "profile",
      images: publicPictures.length > 0 ? [
        {
          url: buildImageUrl(publicPictures[0].url_token),
          width: publicPictures[0].width,
          height: publicPictures[0].height,
          alt: `${profile.name} - Featured Photo`,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} | Erasys Test`,
      description,
    },
  };
}

export function generateJsonLDData(profile: Profile) {
  const publicPictures = getPublicPictures(profile);

  return {
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
        "contentUrl": buildImageUrl(pic.url_token),
        "width": pic.width,
        "height": pic.height,
        "caption": `${profile.name} - Photo ${idx + 1}`,
      })),
    } : undefined,
  };
}
