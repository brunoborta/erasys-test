import { Picture, Profile } from "../types"

export const buildImageUrl = (urlToken: string): string => {
    return `https://www.hunqz.com/img/usr/original/0x0/${urlToken}.jpg`
}

export const getPublicPictures = (profile: Profile): Picture[] => {
    return profile.pictures.filter(picture => picture.is_public);
}

export const getSafePictures = (profile: Profile) => {
    return profile.pictures.filter(picture => picture.rating === "APP_SAFE" || picture.rating === "NEUTRAL" );
}

export const getPreviewImageUrl = (profile: Profile): string | null => {
    return profile.preview_pic ? buildImageUrl(profile.preview_pic.url_token) : null;
}

export const getAllImageUrls = (profile: Profile, onlyPublic = true): string[] => {
    const pictures = onlyPublic ? getPublicPictures(profile) : profile.pictures;
    return pictures.map(picture => buildImageUrl(picture.url_token));
}