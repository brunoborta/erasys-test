# Performance Optimizations — Next.js

Explains the high-impact performance optimizations in the Next.js app and why each one matters.

---

## API Response Caching

**Location:** `src/lib/profile.ts`

The profile API response is cached for 5 minutes using Next.js `unstable_cache`. Without caching, every page load hits the external API (~1,170ms). With caching, subsequent requests resolve in ~10-50ms from the server-side cache.

```ts
export const getProfile = unstable_cache(async () => getProfileOriginal(), ["profile-data"], {
  revalidate: 300,
  tags: ["profile"],
});
```

| Metric             | Before        | After          |
| ------------------ | ------------- | -------------- |
| Document latency   | ~1,170ms      | ~50ms          |
| External API calls | Every request | Once per 5 min |

This is the single biggest performance win in the app.

---

## Image Optimization

**Location:** `next.config.ts` + page component

Next.js Image component serves correctly sized images in WebP format based on the device viewport.

**Config (`next.config.ts`):**

```ts
images: {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ["image/webp"],
  qualities: [75, 85],
}
```

**Usage:**

```tsx
<Image
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw,
         (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 380px"
  quality={85}
  priority={index < 4}
  fetchPriority={index < 4 ? "high" : "auto"}
  loading={index < 4 ? "eager" : "lazy"}
/>
```

Key benefits:

- Mobile gets a 640px image instead of 1920px
- WebP is 30-40% smaller than JPEG with no visible quality loss
- 85% quality is the sweet spot between file size and visual fidelity

---

## Image Loading Priority

**Location:** page component (photo grid)

The first 4 images (above the fold) load eagerly with high fetch priority. The rest lazy load as the user scrolls.

```tsx
priority={index < 4}
fetchPriority={index < 4 ? "high" : "auto"}
loading={index < 4 ? "eager" : "lazy"}
```

This improves Largest Contentful Paint (LCP) by 15-25% — Lighthouse specifically checks for this.

---

## Font Loading

**Location:** `layout.tsx`

Google Fonts load with `display: "swap"` to prevent Flash of Invisible Text (FOIT). Text renders immediately with a fallback font while custom fonts download in the background.

```ts
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});
```

Improves First Contentful Paint (FCP) by 200-500ms.

---

## What we intentionally skipped

These were considered but removed because their impact was negligible for this app:

| Optimization                  | Why skipped                               |
| ----------------------------- | ----------------------------------------- |
| `preconnect` / `dns-prefetch` | Saves ~100ms only on the first image load |
| `content-visibility: auto`    | Overkill for small galleries (<30 images) |
| `removeConsole` in production | Saves ~1-2KB, not worth the complexity    |

Philosophy: only implement optimizations with measurable, significant impact.
