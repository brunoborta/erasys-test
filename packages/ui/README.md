# @borta/ui

Shared UI components for the Erasys Test application.

## Requirements

This package requires the consuming application to have:

- **React 19+**
- **Tailwind CSS v4** (configured with PostCSS)

## Installation

```bash
pnpm add @borta/ui
```

## Setup

### 1. Import Global Styles

You **MUST** import the package's global CSS in your app's entry point CSS file (e.g., `app/globals.css` in Next.js):

```css
@import "tailwindcss";
@import "@borta/ui/globals.css"; /* ← Add this BEFORE your custom styles */

/* Your custom CSS variables and styles... */
:root {
  /* You can override theme variables here if needed */
}
```

**Why?** The package's `globals.css` contains:

- Default theme variables (light/dark mode)
- Tailwind v4 `@theme` mappings
- Ensures components work out-of-the-box

### 2. Configure Tailwind Content Scanning (if needed)

With Tailwind v4, importing the CSS should automatically work. If classes aren't being generated, add the package to your `postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/src/**/*.{ts,tsx}", // Scan UI package
      ],
    },
  },
};
```

## Usage

```tsx
import { PhotoCard, Overlay, MasonryGrid } from "@borta/ui";

export function Gallery() {
  return (
    <MasonryGrid>
      <PhotoCard
        aspectRatio={16 / 9}
        imageSlot={<img src="..." />}
        overlaySlot={<Overlay title="Hello" />}
      />
    </MasonryGrid>
  );
}
```

## Theming

The package uses CSS custom properties for theming. **Dark mode is the default** — light mode is opt-in via the `.light` class. All values are **space-separated RGB channels** (not `rgb()` functions) so Tailwind v4 can compose them with opacity utilities.

### CSS Variables Reference

| Variable                 | Dark default (`:root`) | Light value (`--light-*`) | Used by                              |
| ------------------------ | ---------------------- | ------------------------- | ------------------------------------ |
| `--background`           | `15 23 42`             | `226 232 240`             | Page background                      |
| `--background-secondary` | `30 41 59`             | `203 213 225`             | Gradient endpoint                    |
| `--foreground`           | `248 250 252`          | `15 23 42`                | Primary text                         |
| `--foreground-secondary` | `203 213 225`          | `51 65 85`                | Secondary text, profile headline     |
| `--muted`                | `148 163 184`          | `100 116 139`             | Muted/dimmed text (ProfileHeader ID) |
| `--border`               | `51 65 85`             | `148 163 184`             | Card and button borders              |
| `--card-bg`              | `51 65 85`             | `248 250 252`             | StatCard background                  |
| `--card-hover`           | `66 75 105`            | `226 232 240`             | StatCard hover background            |

These map to Tailwind utilities via `@theme inline`:

| CSS Variable                   | Tailwind class              | Example                                    |
| ------------------------------ | --------------------------- | ------------------------------------------ |
| `--color-background`           | `bg-background`             | `<div class="bg-background">`              |
| `--color-background-secondary` | `bg-background-secondary`   | gradient `to-background-secondary`         |
| `--color-foreground`           | `text-foreground`           | `<p class="text-foreground">`              |
| `--color-foreground-secondary` | `text-foreground-secondary` | `<span class="text-foreground-secondary">` |
| `--color-muted`                | `text-muted`                | `<small class="text-muted">`               |
| `--color-border`               | `border-border`             | `<div class="border border-border">`       |
| `--color-card-bg`              | `bg-card-bg`                | `<div class="bg-card-bg">`                 |
| `--color-card-hover`           | `bg-card-hover`             | `hover:bg-card-hover`                      |

### How theme switching works

1. **Dark mode** — `:root` values are used by default (no class needed)
2. **Light mode via class** — add `class="light"` to `<html>`, the `.light` selector overrides using `--light-*` counterparts
3. **Light mode via OS** — if no `.light`/`.dark` class is set, `@media (prefers-color-scheme: light)` applies automatically
4. **Dark mode via class** — adding `class="dark"` to `<html>` has no CSS effect (already dark), but it blocks the OS light fallback media query

### Overriding the theme

**Option A: Import globals.css and override variables** (best when you want light/dark support)

```css
@import "tailwindcss";
@import "@borta/web-ui/globals.css";

:root {
  --background: 30 15 5; /* custom dark (default) */
  --light-background: 255 245 235; /* custom light */
  /* override both --xxx and --light-xxx for each variable */
}
```

> **Specificity note:** the package's `@media (prefers-color-scheme: light)` uses `:root:not(.light):not(.dark)` which has specificity `(0,3,0)`. A plain `:root` override `(0,1,0)` won't win. Either override `--light-*` variables, or add the `.light` class to `<html>`.

**Option B: Skip globals.css entirely** (best for single-theme apps)

```css
@import "tailwindcss";

:root {
  --background: 20 12 5;
  --background-secondary: 45 22 8;
  --foreground: 255 247 237;
  --foreground-secondary: 253 186 116;
  --muted: 180 120 70;
  --border: 154 52 18;
  --card-bg: 55 28 10;
  --card-hover: 75 38 14;
}

@theme inline {
  --color-background: rgb(var(--background));
  --color-background-secondary: rgb(var(--background-secondary));
  --color-foreground: rgb(var(--foreground));
  --color-foreground-secondary: rgb(var(--foreground-secondary));
  --color-muted: rgb(var(--muted));
  --color-border: rgb(var(--border));
  --color-card-bg: rgb(var(--card-bg));
  --color-card-hover: rgb(var(--card-hover));
}
```

This gives you full control with zero specificity conflicts. If using `@tailwindcss/vite`, component classes are detected automatically via the module graph. With `@tailwindcss/postcss`, add a `@source` directive pointing to the package dist.
