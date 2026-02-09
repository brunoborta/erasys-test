import type { ApiConfig, Profile, FetchFn } from "../types";
import { ApiError } from "../types";

const DEFAULT_BASE_URL = "https://www.hunqz.com/api/opengrid";
const DEFAULT_PROFILE_SLUG = "msescortplus";
const DEFAULT_TIMEOUT = 10_000;

export const getProfile = async (
  slug: string = DEFAULT_PROFILE_SLUG,
  config?: ApiConfig
): Promise<Profile> => {
  const baseUrl = config?.baseUrl ?? DEFAULT_BASE_URL;
  const timeout = config?.timeout ?? DEFAULT_TIMEOUT;

  // Make fetch platform agnostic
  const fetchFn: FetchFn = config?.fetchFn ?? fetch;

  const url = `${baseUrl}/profiles/${slug}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetchFn(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError("Request failed", response.status, url);
    }

    const data = (await response.json()) as Profile;

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
