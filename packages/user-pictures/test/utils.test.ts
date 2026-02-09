import { describe, it, expect } from "vitest";
import {
  buildImageUrl,
  getPublicPictures,
  getSafePictures,
  getPreviewImageUrl,
  getImageUrls,
} from "../src/utils/index.js";
import type { Profile } from "../src/types/index.js";

describe("buildImageUrl", () => {
  it("builds the correct image URL from url_token", () => {
    expect(buildImageUrl("abc123xyz")).toBe(
      "https://www.hunqz.com/img/usr/original/0x0/abc123xyz.jpg"
    );
  });

  it("throws when url_token is empty", () => {
    expect(() => buildImageUrl("")).toThrow("url_token is required");
  });
});

describe("getPublicPictures", () => {
  it("returns only public pictures", () => {
    const profile: Profile = {
      id: "1",
      name: "Test Profile",
      pictures: [
        {
          id: "1",
          url_token: "token1",
          width: 100,
          height: 100,
          rating: "NEUTRAL",
          is_public: true,
        },
        {
          id: "2",
          url_token: "token2",
          width: 100,
          height: 100,
          rating: "NEUTRAL",
          is_public: false,
        },
        {
          id: "3",
          url_token: "token3",
          width: 100,
          height: 100,
          rating: "NEUTRAL",
          is_public: true,
        },
      ],
    };

    const publicPics = getPublicPictures(profile);

    expect(publicPics).toHaveLength(2);
    expect(publicPics.map((p) => p.id)).toEqual(["1", "3"]);
    expect(publicPics.every((p) => p.is_public)).toBe(true);
  });

  it("returns an empty array when there are no public pictures", () => {
    const profile: Profile = {
      id: "1",
      name: "Test Profile",
      pictures: [
        {
          id: "1",
          url_token: "token1",
          width: 100,
          height: 100,
          rating: "NEUTRAL",
          is_public: false,
        },
      ],
    };

    expect(getPublicPictures(profile)).toEqual([]);
  });
});

describe("getSafePictures", () => {
  it("returns only public pictures with APP_SAFE or NEUTRAL rating", () => {
    const profile: Profile = {
      id: "1",
      name: "Test Profile",
      pictures: [
        {
          id: "1",
          url_token: "token1",
          width: 100,
          height: 100,
          rating: "APP_SAFE",
          is_public: true,
        },
        {
          id: "2",
          url_token: "token2",
          width: 100,
          height: 100,
          rating: "EROTIC",
          is_public: true,
        },
        {
          id: "3",
          url_token: "token3",
          width: 100,
          height: 100,
          rating: "NEUTRAL",
          is_public: true,
        },
        {
          id: "4",
          url_token: "token4",
          width: 100,
          height: 100,
          rating: "NEUTRAL",
          is_public: false, // should be excluded
        },
      ],
    };

    const safePics = getSafePictures(profile);

    expect(safePics).toHaveLength(2);
    expect(safePics.map((p) => p.id)).toEqual(["1", "3"]);
    expect(safePics.every((p) => p.is_public)).toBe(true);
    expect(safePics.map((p) => p.rating)).toEqual(["APP_SAFE", "NEUTRAL"]);
  });

  it("returns an empty array when there are no safe pictures", () => {
    const profile: Profile = {
      id: "1",
      name: "Test Profile",
      pictures: [
        {
          id: "1",
          url_token: "token1",
          width: 100,
          height: 100,
          rating: "EROTIC",
          is_public: true,
        },
      ],
    };

    expect(getSafePictures(profile)).toEqual([]);
  });
});

describe("getPreviewImageUrl", () => {
  it("returns preview image URL when preview_pic exists", () => {
    const profile: Profile = {
      id: "1",
      name: "Test Profile",
      pictures: [],
      preview_pic: {
        id: "preview",
        url_token: "preview-token",
        width: 200,
        height: 200,
        rating: "NEUTRAL",
        is_public: true,
      },
    };

    expect(getPreviewImageUrl(profile)).toBe(
      "https://www.hunqz.com/img/usr/original/0x0/preview-token.jpg"
    );
  });

  it("returns null when preview_pic is missing", () => {
    const profile: Profile = {
      id: "1",
      name: "Test Profile",
      pictures: [],
    };

    expect(getPreviewImageUrl(profile)).toBeNull();
  });

  it("throws when preview_pic exists but url_token is empty (delegates to buildImageUrl)", () => {
    const profile: Profile = {
      id: "1",
      name: "Test Profile",
      pictures: [],
      preview_pic: {
        id: "preview",
        url_token: "",
        width: 200,
        height: 200,
        rating: "NEUTRAL",
        is_public: true,
      },
    };

    expect(() => getPreviewImageUrl(profile)).toThrow("url_token is required");
  });
});

describe("getImageUrls", () => {
  const profile: Profile = {
    id: "1",
    name: "Test Profile",
    pictures: [
      {
        id: "1",
        url_token: "token1",
        width: 100,
        height: 100,
        rating: "NEUTRAL",
        is_public: true,
      },
      {
        id: "2",
        url_token: "token2",
        width: 100,
        height: 100,
        rating: "NEUTRAL",
        is_public: false,
      },
      {
        id: "3",
        url_token: "token3",
        width: 100,
        height: 100,
        rating: "EROTIC",
        is_public: true,
      },
      {
        id: "4",
        url_token: "token4",
        width: 100,
        height: 100,
        rating: "APP_SAFE",
        is_public: true,
      },
    ],
  };

  it("returns public + safe URLs by default (publicOnly=true, safeOnly=true)", () => {
    const urls = getImageUrls(profile);

    expect(urls).toEqual([
      "https://www.hunqz.com/img/usr/original/0x0/token1.jpg", // public + NEUTRAL
      "https://www.hunqz.com/img/usr/original/0x0/token4.jpg", // public + APP_SAFE
    ]);
  });

  it("returns public URLs when safeOnly is false", () => {
    const urls = getImageUrls(profile, { safeOnly: false });

    expect(urls).toEqual([
      "https://www.hunqz.com/img/usr/original/0x0/token1.jpg", // public
      "https://www.hunqz.com/img/usr/original/0x0/token3.jpg", // public even if EROTIC
      "https://www.hunqz.com/img/usr/original/0x0/token4.jpg", // public
    ]);
  });

  it("returns safe URLs even if not public when publicOnly is false", () => {
    const urls = getImageUrls(profile, { publicOnly: false });

    expect(urls).toEqual([
      "https://www.hunqz.com/img/usr/original/0x0/token1.jpg", // NEUTRAL
      "https://www.hunqz.com/img/usr/original/0x0/token2.jpg", // NEUTRAL but not public (included)
      "https://www.hunqz.com/img/usr/original/0x0/token4.jpg", // APP_SAFE
    ]);
  });

  it("applies limit after filtering", () => {
    const urls = getImageUrls(profile, { limit: 1 });
    expect(urls).toHaveLength(1);
    expect(urls[0]).toBe("https://www.hunqz.com/img/usr/original/0x0/token1.jpg");
  });

  it("returns an empty array when there are no pictures", () => {
    const emptyProfile: Profile = { id: "1", name: "Test", pictures: [] };
    expect(getImageUrls(emptyProfile)).toEqual([]);
  });
});
