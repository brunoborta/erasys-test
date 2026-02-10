# Architectural Decisions

Cheat sheet for interview questions about non-trivial choices in this project.

---

## Monorepo structure

**Why pnpm + Turborepo?**

pnpm's strict node_modules structure prevents phantom dependencies (packages that work by accident because a transitive dep hoists them). Turborepo adds task orchestration with caching — `pnpm check` runs lint, test, type-check, and build in parallel, respecting dependency order (`^build` ensures packages build before apps). Cache hits skip unchanged work entirely.

**Why NOT `workspace:` protocol?**

Packages are published to npm with concrete version numbers. `workspace:` would require a publish step to replace `workspace:*` with real versions. Using `^1.2.0` directly keeps package.json honest — what's in the file is what npm consumers see. Changesets handles versioning and publishing.

---

## Build tooling

**Why tsup over raw tsc?**

tsup wraps esbuild for bundling and tsc for `.d.ts` generation. It outputs both ESM (`.js`) and CJS (`.cjs`) from a single config. Raw tsc can't produce both formats without two separate tsconfig files. tsup also handles CSS entry points (`globals.css` in web-ui).

**Why dual ESM + CJS format?**

Maximum compatibility. Modern bundlers (Vite, Next.js) use the ESM export via the `"import"` condition in package.json `exports`. Older Node.js scripts or tools that use `require()` fall back to the CJS export. The `exports` map controls which format each consumer gets.

**Why `noEmit: true` in apps?**

Both Next.js (SWC) and Vite (esbuild) have their own compilers that are 10-100x faster than tsc. TypeScript is used **only for type checking** — the bundler produces the actual JS. That's why apps have `noEmit: true` and the `type-check` script runs `tsc --noEmit`.

---

## TypeScript

**Why `noUncheckedIndexedAccess: true`?**

Array index access (`arr[0]`) returns `T` by default, hiding the fact that the element might not exist. With this flag, it returns `T | undefined`, forcing you to handle the empty case. We use truthiness narrowing:

```ts
const first = arr[0];
if (first) {
  // TypeScript knows `first` is T here, not T | undefined
}
```

This caught a real issue in `metadata.ts` where `publicPictures[0]` was accessed after a `.length > 0` check — TS can't narrow from `.length`, but it can narrow from a variable truthiness check.

**Why `target: ES2017` in Next.js but `ES2022` in base?**

Next.js's SWC compiler handles syntax downleveling based on browserslist. The TS `target` only controls what tsc considers valid syntax during type-checking — `ES2017` is the conventional setting for Next.js projects. The packages use `ES2022` (from base) because they target Node.js 18+.

**Why `moduleResolution: "bundler"`?**

This mode understands modern package.json `exports` maps and doesn't require file extensions in imports. It matches how Vite, tsup, and Turbopack actually resolve modules. The older `"node"` mode doesn't understand `exports`, and `"node16"` requires explicit `.js` extensions.

---

## CSS & Theming

**Why Tailwind v4 with `@theme inline` and space-separated RGB?**

Tailwind v4 uses CSS-native theming via `@theme`. Space-separated RGB values (`15 23 42` instead of `rgb(15, 23, 42)`) let Tailwind compose colors with opacity: `bg-background/50` becomes `rgba(15, 23, 42, 0.5)`. If we stored full `rgb()` values, opacity utilities wouldn't work.

**Why dark-first theme?**

The design called for dark as default. `:root` sets dark values, `.light` class overrides them. A `@media (prefers-color-scheme: light)` fallback applies light mode for users who haven't toggled the switch, using `html:not(.light):not(.dark)` to avoid specificity conflicts with explicit class toggles.

**How does the SPA override the theme?**

The SPA imports `@borta/web-ui/globals.css` (which sets blue theme defaults) then overrides `:root` variables with brown values in its own `globals.css`. Since both selectors have the same specificity, the later declaration wins (CSS cascade). The SPA is dark-only, so no `.light` override is needed.

---

## Accessibility

**Why skip-to-content link?**

WCAG 2.1 SC 2.4.1 requires a mechanism to bypass repeated navigation blocks. Keyboard users pressing Tab see a "Skip to content" link that jumps to `#main-content`, skipping the ThemeSwitcher and any future nav elements. It's invisible by default (`sr-only`) and only appears on focus (`focus:not-sr-only`).

**Why `aria-pressed` on ThemeSwitcher?**

The theme toggle is a button that maintains state (dark/light). `aria-pressed={theme === "dark"}` tells screen readers the current state: "Dark mode toggle, pressed" vs "Dark mode toggle, not pressed". Without it, screen reader users can't tell which theme is active.

**Why `sr-only` captions on photos?**

Each photo has a `<figcaption>` with descriptive text (dimensions, rating) that's visually hidden but readable by screen readers. This provides context that sighted users get from the hover overlay but screen reader users would otherwise miss.

---

## Error handling & UX

**Why `error.tsx` (Next.js error boundary)?**

App Router automatically wraps each route segment in an error boundary. Without `error.tsx`, a server-side error shows Next.js's generic "Application error" page. With it, users see a styled error message with a "Try again" button that calls `reset()` to re-render the segment without a full page reload. It must be `"use client"` because React error boundaries are class-based under the hood and need client-side state.

**Why `loading.tsx` (skeleton UI)?**

App Router wraps server components in a `<Suspense>` boundary using `loading.tsx` as the fallback. While `page.tsx` fetches data server-side (`getProfile()`), the skeleton is shown instantly — no blank white screen. The skeleton mimics the real layout (header placeholder + masonry grid of pulsing cards) so there's minimal layout shift when data arrives.

**Why `animate-pulse` for skeleton?**

It's Tailwind's built-in shimmer animation (opacity oscillation). It signals "content is loading" without the visual noise of a spinner. The card placeholders use varying `aspectRatio` values to simulate the masonry layout's natural variation.

---

## Testing

**Why Vitest over Jest?**

Vitest shares Vite's config and plugin ecosystem, so it understands TypeScript and JSX natively without extra transforms. It runs ESM-first (no CJS transform step), which makes it faster and avoids the `import`/`require` mismatches that plague Jest + ESM. The `@borta/user-pictures` tests use `environment: "node"` (pure logic), while `@borta/web-ui` tests use `environment: "jsdom"` with `@testing-library/react` for component rendering.

**Why `@vitest/coverage-v8` over Istanbul?**

V8's native coverage is faster because it instruments at the engine level instead of rewriting source code. Output includes `text` (terminal table) and `lcov` (for CI services like Codecov). The `src/index.ts` barrel file is excluded since it's just re-exports with no logic.

**Why `@testing-library/react` over Enzyme or direct `react-dom/test-utils`?**

Testing Library encourages testing from the user's perspective (what's rendered, what's accessible) rather than testing implementation details (props, state). Queries like `getByRole`, `getByText`, `getByTestId` mirror how users and assistive technologies interact with the UI.

---

## CI/CD & Tooling

**Why Husky + lint-staged?**

Husky moves Git hooks from `.git/hooks/` (local, not committed) to `.husky/` (version-controlled). lint-staged runs ESLint + Prettier only on staged files during `git commit`, so the entire codebase doesn't get re-linted on every commit. If linting fails, the commit is aborted.

**Why ESLint 9 flat config?**

ESLint 9 replaces `.eslintrc` with `eslint.config.mjs` — a plain JS file with explicit composition. No more `extends` chains or hidden config merging. The root config applies `typescript-eslint` and `eslint-plugin-react` to all packages. `web-nextjs` keeps its own config because `eslint-config-next` ships a complete setup.

**Why Changesets for releases?**

Changesets manages versioning and changelogs for published packages. You create a changeset file describing the change, then `changeset version` bumps versions and updates changelogs, and `changeset publish` publishes to npm. This separates "what changed" (authored by the developer) from "what version" (computed by the tool).

**Why `pnpm check` script?**

Single command that runs `turbo run lint test type-check build` — all quality gates in one shot. Turbo parallelizes what it can and respects dependencies. This is what CI runs and what you run locally before pushing.

---

## Turbo cache

**Why explicit `inputs` on tasks?**

Without `inputs`, Turbo watches all files in each package to determine cache validity. With explicit inputs, only relevant files are watched:

| Task         | Inputs                                                      | Why                                             |
| ------------ | ----------------------------------------------------------- | ----------------------------------------------- |
| `build`      | `src/**`, `tsconfig.json`, `tsup.config.ts`, `package.json` | Only source code and build config affect output |
| `test`       | `src/**`, `test/**`, `vitest.config.ts`, `package.json`     | Source + tests + test config                    |
| `lint`       | `src/**`, `eslint.config.*`, `.prettierrc`                  | Source + lint/format config                     |
| `type-check` | `src/**`, `tsconfig.json`, `package.json`                   | Source + TS config                              |

This means editing a README doesn't invalidate the build cache.

**Why `outputs: ["coverage/**"]` on test?\*\*

Allows caching of coverage reports. If source and tests haven't changed, `pnpm test:coverage` restores cached coverage instead of re-running tests.

**Why `clean` has `cache: false`?**

Clean tasks delete cached outputs (`dist/`, `.next/`). Caching a clean task would defeat its purpose — it must always execute.
