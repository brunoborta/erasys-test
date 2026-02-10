# Erasys Test

Monorepo with two shared packages and three applications that display user profile data fetched from a remote API.

## Live demos

- **Next.js** (SSR): https://erasys-test-web-nextjs.vercel.app/
- **SPA** (client-side): https://erasys-test-web-spa.vercel.app/
- **Mobile**: Expo Go (see [Running the mobile app](#running-the-mobile-app))

## Tech stack

| Layer            | Technology                                            |
| ---------------- | ----------------------------------------------------- |
| Monorepo         | pnpm workspaces + Turborepo                           |
| Packages         | tsup (ESM + CJS), Changesets for publishing           |
| Next.js app      | Next.js 16, App Router, Turbopack, ISR                |
| SPA              | Vite 6, React 19, client-side only                    |
| Mobile           | Expo SDK 54, React Native 0.81                        |
| Styling (web)    | Tailwind CSS v4, CSS custom properties                |
| Styling (mobile) | StyleSheet.create, dark green theme                   |
| Testing          | Vitest, @testing-library/react, V8 coverage           |
| Code quality     | ESLint 9 (flat config), Prettier, Husky + lint-staged |

## Project structure

```
erasys-test/
├── packages/
│   ├── user-pictures/   @borta/user-pictures — API client & image utilities
│   └── ui/              @borta/web-ui — shared React components + theme CSS
├── apps/
│   ├── web-nextjs/      Next.js 16 — SSR, SEO, ISR
│   ├── web-spa/         Vite + React — client-side SPA, dark-only brown theme
│   └── mobile/          Expo — React Native, dark green theme
├── turbo.json
├── tsconfig.base.json
└── pnpm-workspace.yaml
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Expo Go** app on your phone (for mobile development)

## Getting started

```bash
# Install dependencies
pnpm install

# Build shared packages (required before running apps)
pnpm build

# Run all apps in parallel
pnpm dev
```

## Running individual apps

```bash
# Next.js (http://localhost:3000)
pnpm dev:next

# SPA (http://localhost:5173)
pnpm dev:spa

# Mobile (Expo Go via tunnel)
pnpm dev:mobile
```

### Running the mobile app

The mobile app uses Expo with tunnel mode so it works on any network:

```bash
pnpm dev:mobile
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). The app fetches data directly from the API — no local server needed.

## Quality checks

```bash
# Run all quality gates (lint, test, type-check, build)
pnpm check

# Individual commands
pnpm lint
pnpm test
pnpm type-check
```

## Shared packages

### @borta/user-pictures

Zero-dependency SDK for fetching profile data from the Hunqz API. Works in Node.js, browsers, and React Native.

- `getProfile(slug?, config?)` — fetch a user profile
- `getSafePictures(profile)` — filter to public + safe-rated pictures
- `getPublicPictures(profile)` — filter to public pictures
- `buildImageUrl(urlToken)` — construct a full image URL

### @borta/web-ui

Shared React components with a dark-first theme system using Tailwind CSS v4.

- `ProfileHeader`, `StatsSection`, `PhotoCard`, `Overlay`, `MasonryGrid`
- `globals.css` — theme variables (space-separated RGB for Tailwind opacity support)
- Light/dark mode toggle support via CSS custom properties

## Key architectural decisions

- **pnpm over npm/yarn** — strict `node_modules` prevents phantom dependencies
- **No `workspace:` protocol** — packages use concrete versions since they're published to npm
- **tsup for packages** — dual ESM + CJS output from a single config
- **Tailwind v4 `@theme inline`** — CSS-native theming with space-separated RGB for opacity utilities
- **No NativeWind on mobile** — `StyleSheet.create` keeps the mobile app simple and dependency-light

See `docs/DECISIONS.md` for detailed rationale on every architectural choice.

## Documentation

The `docs/` folder contains detailed reference material:

| File                                                          | Description                                                                               |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [DECISIONS.md](docs/DECISIONS.md)                             | Architectural decisions with rationale — useful for interview discussions                 |
| [CONFIG_REFERENCE.md](docs/CONFIG_REFERENCE.md)               | Every config file in the repo explained (turbo, tsconfig, tsup, vitest, eslint, prettier) |
| [CONFIG_REFERENCE_MOBILE.md](docs/CONFIG_REFERENCE_MOBILE.md) | Mobile-specific config reference (metro, app.json, expo)                                  |
| [RELEASE_WORKFLOW.md](docs/RELEASE_WORKFLOW.md)               | How to version and publish packages with Changesets                                       |
| [TOOLS.md](docs/TOOLS.md)                                     | Dev tooling overview (ESLint, Prettier, Husky, lint-staged)                               |
| [TSCONFIG_REFERENCE.md](docs/TSCONFIG_REFERENCE.md)           | TypeScript configuration details per project                                              |
| [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)                         | Step-by-step setup guide from scratch                                                     |
