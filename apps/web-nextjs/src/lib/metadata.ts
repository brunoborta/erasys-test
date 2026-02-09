import type { Metadata } from "next";
import type { Profile } from "@borta/user-pictures";
import { buildImageUrl, getSafePictures } from "@borta/user-pictures";

export function generateProfileMetadata(profile: Profile): Metadata {
  const safePictures = getSafePictures(profile);
  const description = profile.headline || `View ${profile.name}'s photo gallery with ${safePictures.length} photos`;

  return {
    title: profile.name,
    description,
    openGraph: {
      title: `${profile.name} | Erasys Test`,
      description,
      type: "profile",
      images: safePictures.length > 0 ? [
        {
          url: buildImageUrl(safePictures[0].url_token),
          width: safePictures[0].width,
          height: safePictures[0].height,
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
  const safePictures = getSafePictures(profile);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": profile.name,
      "description": profile.headline,
      "identifier": profile.id,
    },
    "image": safePictures.length > 0 ? {
      "@type": "ImageGallery",
      "numberOfItems": safePictures.length,
      "image": safePictures.slice(0, 10).map((pic, idx) => ({
        "@type": "ImageObject",
        "contentUrl": buildImageUrl(pic.url_token),
        "width": pic.width,
        "height": pic.height,
        "caption": `${profile.name} - Photo ${idx + 1}`,
      })),
    } : undefined,
  };
}
