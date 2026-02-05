import { describe, it, expect } from 'vitest';
import {
  buildImageUrl,
  getPublicPictures,
  getSafePictures,
  getPreviewImageUrl,
  getAllImageUrls,
} from '../src/utils/index.js';
import type { Profile, Picture } from '../src/types/index.js';

describe('buildImageUrl', () => {
  it('should build correct image URL from url_token', () => {
    const url = buildImageUrl('abc123xyz');
    expect(url).toBe('https://www.hunqz.com/img/usr/original/0x0/abc123xyz.jpg');
  });

  it('should handle different url_tokens', () => {
    const url1 = buildImageUrl('token1');
    const url2 = buildImageUrl('token2');
    
    expect(url1).toBe('https://www.hunqz.com/img/usr/original/0x0/token1.jpg');
    expect(url2).toBe('https://www.hunqz.com/img/usr/original/0x0/token2.jpg');
  });

  it('should handle empty string', () => {
    const url = buildImageUrl('');
    expect(url).toBe('https://www.hunqz.com/img/usr/original/0x0/.jpg');
  });
});

describe('getPublicPictures', () => {
  it('should return only public pictures', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [
        { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'NEUTRAL', is_public: true },
        { id: '2', url_token: 'token2', width: 100, height: 100, rating: 'NEUTRAL', is_public: false },
        { id: '3', url_token: 'token3', width: 100, height: 100, rating: 'NEUTRAL', is_public: true },
      ],
    };

    const publicPics = getPublicPictures(profile);
    
    expect(publicPics).toHaveLength(2);
    expect(publicPics[0].id).toBe('1');
    expect(publicPics[1].id).toBe('3');
    expect(publicPics.every(pic => pic.is_public)).toBe(true);
  });

  it('should return empty array when no public pictures', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [
        { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'NEUTRAL', is_public: false },
      ],
    };

    const publicPics = getPublicPictures(profile);
    expect(publicPics).toHaveLength(0);
  });

  it('should return all pictures when all are public', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [
        { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'NEUTRAL', is_public: true },
        { id: '2', url_token: 'token2', width: 100, height: 100, rating: 'NEUTRAL', is_public: true },
      ],
    };

    const publicPics = getPublicPictures(profile);
    expect(publicPics).toHaveLength(2);
  });

  it('should handle empty pictures array', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [],
    };

    const publicPics = getPublicPictures(profile);
    expect(publicPics).toHaveLength(0);
  });
});

describe('getSafePictures', () => {
  it('should return only APP_SAFE and NEUTRAL pictures', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [
        { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'APP_SAFE', is_public: true },
        { id: '2', url_token: 'token2', width: 100, height: 100, rating: 'EROTIC', is_public: true },
        { id: '3', url_token: 'token3', width: 100, height: 100, rating: 'NEUTRAL', is_public: true },
        { id: '4', url_token: 'token4', width: 100, height: 100, rating: 'EROTIC', is_public: true },
      ],
    };

    const safePics = getSafePictures(profile);
    
    expect(safePics).toHaveLength(2);
    expect(safePics[0].rating).toBe('APP_SAFE');
    expect(safePics[1].rating).toBe('NEUTRAL');
  });

  it('should return empty array when no safe pictures', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [
        { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'EROTIC', is_public: true },
      ],
    };

    const safePics = getSafePictures(profile);
    expect(safePics).toHaveLength(0);
  });

  it('should handle only APP_SAFE pictures', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [
        { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'APP_SAFE', is_public: true },
        { id: '2', url_token: 'token2', width: 100, height: 100, rating: 'APP_SAFE', is_public: true },
      ],
    };

    const safePics = getSafePictures(profile);
    expect(safePics).toHaveLength(2);
  });

  it('should handle only NEUTRAL pictures', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [
        { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'NEUTRAL', is_public: true },
      ],
    };

    const safePics = getSafePictures(profile);
    expect(safePics).toHaveLength(1);
  });
});

describe('getPreviewImageUrl', () => {
  it('should return preview image URL when preview_pic exists', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [],
      preview_pic: {
        id: 'preview',
        url_token: 'preview-token',
        width: 200,
        height: 200,
        rating: 'NEUTRAL',
        is_public: true,
      },
    };

    const url = getPreviewImageUrl(profile);
    expect(url).toBe('https://www.hunqz.com/img/usr/original/0x0/preview-token.jpg');
  });

  it('should return null when preview_pic is undefined', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [],
    };

    const url = getPreviewImageUrl(profile);
    expect(url).toBeNull();
  });

  it('should use buildImageUrl internally', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [],
      preview_pic: {
        id: 'preview',
        url_token: 'test-token-123',
        width: 200,
        height: 200,
        rating: 'NEUTRAL',
        is_public: true,
      },
    };

    const url = getPreviewImageUrl(profile);
    const expectedUrl = buildImageUrl('test-token-123');
    expect(url).toBe(expectedUrl);
  });
});

describe('getAllImageUrls', () => {
  const mockProfile: Profile = {
    id: '1',
    name: 'Test Profile',
    pictures: [
      { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'NEUTRAL', is_public: true },
      { id: '2', url_token: 'token2', width: 100, height: 100, rating: 'NEUTRAL', is_public: false },
      { id: '3', url_token: 'token3', width: 100, height: 100, rating: 'NEUTRAL', is_public: true },
    ],
  };

  it('should return only public image URLs by default', () => {
    const urls = getAllImageUrls(mockProfile);
    
    expect(urls).toHaveLength(2);
    expect(urls[0]).toBe('https://www.hunqz.com/img/usr/original/0x0/token1.jpg');
    expect(urls[1]).toBe('https://www.hunqz.com/img/usr/original/0x0/token3.jpg');
  });

  it('should return only public image URLs when onlyPublic is true', () => {
    const urls = getAllImageUrls(mockProfile, true);
    
    expect(urls).toHaveLength(2);
  });

  it('should return all image URLs when onlyPublic is false', () => {
    const urls = getAllImageUrls(mockProfile, false);
    
    expect(urls).toHaveLength(3);
    expect(urls[0]).toBe('https://www.hunqz.com/img/usr/original/0x0/token1.jpg');
    expect(urls[1]).toBe('https://www.hunqz.com/img/usr/original/0x0/token2.jpg');
    expect(urls[2]).toBe('https://www.hunqz.com/img/usr/original/0x0/token3.jpg');
  });

  it('should return empty array when no pictures', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [],
    };

    const urls = getAllImageUrls(profile);
    expect(urls).toHaveLength(0);
  });

  it('should return empty array when no public pictures and onlyPublic is true', () => {
    const profile: Profile = {
      id: '1',
      name: 'Test Profile',
      pictures: [
        { id: '1', url_token: 'token1', width: 100, height: 100, rating: 'NEUTRAL', is_public: false },
      ],
    };

    const urls = getAllImageUrls(profile, true);
    expect(urls).toHaveLength(0);
  });
});
