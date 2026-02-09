import { GetImageUrlsOptions, Picture, Profile } from "../types";

const IMAGE_BASE_URL = "https://www.hunqz.com/img/usr/original/0x0";
const SAFE_RATINGS = new Set<Picture["rating"]>(["APP_SAFE", "NEUTRAL"]);

const isSafeRating = (rating: Picture["rating"]) => SAFE_RATINGS.has(rating);

export const buildImageUrl = (urlToken: string): string => {
  if (!urlToken) throw new Error("url_token is required");
  return `${IMAGE_BASE_URL}/${urlToken}.jpg`;
};

export const getPublicPictures = (profile: Profile): Picture[] =>
  profile.pictures.filter((p) => p.is_public);

export const getSafePictures = (profile: Profile): Picture[] =>
  profile.pictures.filter((p) => p.is_public && isSafeRating(p.rating));

export const getPreviewImageUrl = (profile: Profile): string | null =>
  profile.preview_pic ? buildImageUrl(profile.preview_pic.url_token) : null;

export const getImageUrls = (profile: Profile, options: GetImageUrlsOptions = {}): string[] => {
  const { publicOnly = true, safeOnly = true, limit } = options;

  let pics = profile.pictures;

  if (publicOnly) pics = pics.filter((p) => p.is_public);
  if (safeOnly) pics = pics.filter((p) => isSafeRating(p.rating));
  if (typeof limit === "number") pics = pics.slice(0, limit);

  return pics.map((p) => buildImageUrl(p.url_token));
};
