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
        aspectRatio={16/9}
        imageSlot={<img src="..." />}
        overlaySlot={<Overlay title="Hello" />}
      />
    </MasonryGrid>
  );
}
```

## Theming

The package uses CSS variables for theming. You can override them in your app's CSS:

```css
:root {
  --background: 226 232 240;      /* RGB channels */
  --foreground: 15 23 42;
  --card-bg: 248 250 252;
  /* etc */
}
```

Dark mode works via `.dark` class or `@media (prefers-color-scheme: dark)`.
