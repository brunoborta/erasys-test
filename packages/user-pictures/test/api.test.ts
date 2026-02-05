import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProfile } from '../src/api/index.js';
import type { Profile } from '../src/types/index.js';

// Mock profile data
const mockProfileData: Profile = {
  id: '41469841',
  name: 'msescortplus',
  headline: 'Test headline',
  pictures: [
    {
      id: '1',
      url_token: 'token1',
      width: 366,
      height: 650,
      rating: 'NEUTRAL',
      is_public: true,
    },
  ],
  preview_pic: {
    id: 'preview',
    url_token: 'preview-token',
    width: 366,
    height: 650,
    rating: 'NEUTRAL',
    is_public: true,
  },
};

describe('getProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch profile successfully with default slug', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProfileData,
    });

    const profile = await getProfile();

    expect(fetch).toHaveBeenCalledWith(
      'https://www.hunqz.com/api/opengrid/profiles/msescortplus',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
    expect(profile).toEqual(mockProfileData);
  });

  it('should fetch profile with custom slug', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProfileData,
    });

    await getProfile('customslug');

    expect(fetch).toHaveBeenCalledWith(
      'https://www.hunqz.com/api/opengrid/profiles/customslug',
      expect.any(Object)
    );
  });

  it('should use custom baseUrl from config', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProfileData,
    });

    await getProfile('msescortplus', { baseUrl: '/api' });

    expect(fetch).toHaveBeenCalledWith(
      '/api/profiles/msescortplus',
      expect.any(Object)
    );
  });

  it('should throw error when response is not ok (404)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(getProfile()).rejects.toThrow('HTTP error! Status: 404');
  });

  it('should throw error when response is not ok (500)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getProfile()).rejects.toThrow('HTTP error! Status: 500');
  });

  it('should handle network errors', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(getProfile()).rejects.toThrow('Network error');
  });

  it('should handle AbortError and convert to timeout message', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    
    globalThis.fetch = vi.fn().mockRejectedValue(abortError);

    await expect(getProfile('msescortplus', { timeout: 5000 })).rejects.toThrow(
      'Request timeout after 5000ms'
    );
  });

  it('should pass AbortSignal to fetch', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProfileData,
    });

    await getProfile();

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('should handle empty config object', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProfileData,
    });

    const profile = await getProfile('msescortplus', {});

    expect(profile).toEqual(mockProfileData);
    expect(fetch).toHaveBeenCalledWith(
      'https://www.hunqz.com/api/opengrid/profiles/msescortplus',
      expect.any(Object)
    );
  });

  it('should use default baseUrl when config.baseUrl is undefined', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProfileData,
    });

    await getProfile('msescortplus', { timeout: 5000 });

    expect(fetch).toHaveBeenCalledWith(
      'https://www.hunqz.com/api/opengrid/profiles/msescortplus',
      expect.any(Object)
    );
  });

  it('should return parsed JSON data', async () => {
    const customData = { ...mockProfileData, id: 'custom-id' };
    
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => customData,
    });

    const profile = await getProfile();

    expect(profile.id).toBe('custom-id');
  });
});

