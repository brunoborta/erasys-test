import type { Metadata } from "next";
import type { Profile } from "@borta/user-pictures";
import { getAllImageUrls, getPublicPictures } from "@borta/user-pictures";

export function generateProfileMetadata(profile: Profile): Metadata {
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

export function generateJsonLDData(profile: Profile) {
  const publicPictures = getPublicPictures(profile);
  const imageUrls = getAllImageUrls(profile, true);

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
        "contentUrl": imageUrls[idx],
        "width": pic.width,
        "height": pic.height,
        "caption": `${profile.name} - Photo ${idx + 1}`,
      })),
    } : undefined,
  };
}
