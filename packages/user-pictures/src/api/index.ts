import type { ApiConfig, Profile } from "../types";

const DEFAULT_BASE_URL = 'https://www.hunqz.com/api/opengrid';
const DEFAULT_PROFILE_SLUG = 'msescortplus';
const DEFAULT_TIMEOUT = 10000;

export const getProfile = async (slug = DEFAULT_PROFILE_SLUG, config?: ApiConfig): Promise<Profile> => {
   const baseUrl = config?.baseUrl || DEFAULT_BASE_URL;
   const timeout = config?.timeout || DEFAULT_TIMEOUT;

   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), timeout);

   try {
        const response = await fetch(`${baseUrl}/profiles/${slug}`, {
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
   } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
  } finally {
        clearTimeout(timeoutId);
  }
}