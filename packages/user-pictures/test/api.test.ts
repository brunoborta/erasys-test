import { describe, it, expect, vi } from "vitest";
import { getProfile } from "../src/api/index.js";
import { ApiError } from "../src/types/index.js";
import type { Profile } from "../src/types/index.js";

const mockProfileData: Profile = {
  id: "41469841",
  name: "msescortplus",
  headline: "Test headline",
  pictures: [
    { id: "1", url_token: "token1", width: 366, height: 650, rating: "NEUTRAL", is_public: true },
  ],
  preview_pic: {
    id: "preview",
    url_token: "preview-token",
    width: 366,
    height: 650,
    rating: "NEUTRAL",
    is_public: true,
  },
};

describe("getProfile", () => {
  it("fetches the default profile using default baseUrl and slug", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(mockProfileData), { status: 200 }));

    const profile = await getProfile(undefined, { fetchFn });

    expect(fetchFn).toHaveBeenCalledWith(
      "https://www.hunqz.com/api/opengrid/profiles/msescortplus",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );

    expect(profile).toEqual(mockProfileData);
  });

  it("fetches profile using a custom slug", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(mockProfileData), { status: 200 }));

    await getProfile("customslug", { fetchFn });

    expect(fetchFn).toHaveBeenCalledWith(
      "https://www.hunqz.com/api/opengrid/profiles/customslug",
      expect.any(Object)
    );
  });

  it("respects config.baseUrl", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(mockProfileData), { status: 200 }));

    await getProfile("msescortplus", { baseUrl: "/api", fetchFn });

    expect(fetchFn).toHaveBeenCalledWith("/api/profiles/msescortplus", expect.any(Object));
  });

  it("throws ApiError with status and url on non-ok HTTP responses", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));

    await expect(getProfile(undefined, { fetchFn })).rejects.toBeInstanceOf(ApiError);

    await expect(getProfile(undefined, { fetchFn })).rejects.toMatchObject({
      status: 404,
      url: "https://www.hunqz.com/api/opengrid/profiles/msescortplus",
    });
  });

  it("converts AbortError into a timeout error with explicit message", async () => {
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";

    const fetchFn = vi.fn().mockRejectedValue(abortError);

    await expect(getProfile("msescortplus", { timeout: 5000, fetchFn })).rejects.toThrow(
      "Request timeout after 5000ms"
    );
  });

  it("propagates unknown/network errors unchanged", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error("Network error"));

    await expect(getProfile(undefined, { fetchFn })).rejects.toThrow("Network error");
  });
});
