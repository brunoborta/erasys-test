# @borta/user-pictures

SDK for fetching and processing user profile data and pictures from the Hunqz API.

## Installation

```bash
pnpm add @borta/user-pictures
```

## Quick Start

```ts
import { getProfile, getSafePictures, buildImageUrl } from "@borta/user-pictures";

const profile = await getProfile("msescortplus");
const pictures = getSafePictures(profile);

pictures.forEach((pic) => {
  console.log(buildImageUrl(pic.url_token));
});
```

## API Reference

### `getProfile(slug?, config?)`

Fetches a user profile from the API.

```ts
const profile = await getProfile(); // uses default slug "msescortplus"
const profile = await getProfile("custom-slug");
const profile = await getProfile("custom-slug", {
  baseUrl: "https://custom-api.com/api/opengrid",
  timeout: 5000,
});
```

- **slug** `string` — Profile slug (default: `"msescortplus"`)
- **config** `ApiConfig` — Optional configuration (see [Configuration](#configuration))
- **Returns** `Promise<Profile>`
- **Throws** `ApiError` on HTTP errors, `Error` on timeout

### `buildImageUrl(urlToken)`

Constructs a full image URL from a token.

```ts
buildImageUrl("abc123");
// → "https://www.hunqz.com/img/usr/original/0x0/abc123.jpg"
```

### `getPublicPictures(profile)`

Returns all pictures where `is_public` is `true`.

```ts
const publicPics = getPublicPictures(profile);
```

### `getSafePictures(profile)`

Returns all pictures that are public **and** have a safe rating (`APP_SAFE` or `NEUTRAL`).

```ts
const safePics = getSafePictures(profile);
```

### `getPreviewImageUrl(profile)`

Returns the full URL of the profile's preview picture, or `null` if none exists.

```ts
const previewUrl = getPreviewImageUrl(profile);
// → "https://www.hunqz.com/img/usr/original/0x0/token.jpg" or null
```

### `getImageUrls(profile, options?)`

Flexible image URL extraction with filtering options.

```ts
// All safe public images (default)
const urls = getImageUrls(profile);

// All public images, including non-safe
const urls = getImageUrls(profile, { safeOnly: false });

// First 5 safe public images
const urls = getImageUrls(profile, { limit: 5 });
```

| Option       | Type      | Default     | Description                    |
| ------------ | --------- | ----------- | ------------------------------ |
| `publicOnly` | `boolean` | `true`      | Filter to public pictures only |
| `safeOnly`   | `boolean` | `true`      | Filter to safe ratings only    |
| `limit`      | `number`  | `undefined` | Max number of URLs to return   |

## Types

### `Profile`

```ts
interface Profile {
  id: string;
  name: string;
  headline?: string;
  preview_pic?: Picture;
  pictures: Picture[];
}
```

### `Picture`

```ts
interface Picture {
  id: string;
  url_token: string;
  width: number;
  height: number;
  rating: "NEUTRAL" | "EROTIC" | "APP_SAFE";
  is_public: boolean;
  comment?: string;
}
```

### `ApiConfig`

```ts
type ApiConfig = {
  baseUrl?: string; // default: "https://www.hunqz.com/api/opengrid"
  timeout?: number; // default: 10000 (ms)
  fetchFn?: FetchFn; // custom fetch implementation (useful for SSR/testing)
};
```

## Configuration

You can pass a custom `ApiConfig` to `getProfile()`:

| Option    | Default                                | Description                                      |
| --------- | -------------------------------------- | ------------------------------------------------ |
| `baseUrl` | `"https://www.hunqz.com/api/opengrid"` | API base URL                                     |
| `timeout` | `10000`                                | Request timeout in milliseconds                  |
| `fetchFn` | `globalThis.fetch`                     | Custom fetch function (e.g., for SSR or testing) |

## Error Handling

The package exports an `ApiError` class for HTTP errors:

```ts
import { getProfile, ApiError } from "@borta/user-pictures";

try {
  const profile = await getProfile("nonexistent");
} catch (err) {
  if (err instanceof ApiError) {
    console.log(err.status); // HTTP status code
    console.log(err.url); // Request URL
    console.log(err.message); // Error message
  }
}
```
