# Tooling Overview

This document explains the dev tooling configured in this monorepo and why each piece exists.

## ESLint

Static analysis for catching bugs and enforcing code quality rules.

- **Config**: `eslint.config.mjs` at the root (ESLint 9 flat config format)
- Uses `typescript-eslint` for TypeScript-aware rules across all packages
- `eslint-plugin-react` and `eslint-plugin-react-hooks` are applied to `.tsx` files in packages and the SPA
- `apps/web-nextjs` has its own config (`eslint-config-next`) since Next.js ships its own ESLint setup — we just append `eslint-config-prettier` to avoid conflicts
- Every package has a `lint` script: `pnpm run lint` at the root runs them all via Turbo

## Prettier

Opinionated code formatter — no more arguing about semicolons or trailing commas.

- **Config**: `.prettierrc` at the root
- Settings: `semi: true`, double quotes, 2-space indent, trailing commas in ES5 positions, 100-char print width
- `.prettierignore` excludes build artifacts and the lockfile
- Run `pnpm run format` to format everything, `pnpm run format:check` to verify without writing

## Husky

Manages Git hooks so they're version-controlled and shared across the team.

Without Husky, Git hooks live in `.git/hooks/` which is local and not committed. Husky moves them to `.husky/` so everyone who clones the repo gets the same hooks. The `"prepare": "husky"` script in root `package.json` ensures hooks are activated automatically after `pnpm install`.

## lint-staged

Runs linters only on staged files during a commit — not the entire codebase.

This keeps commits fast. Instead of linting every file on every commit, it only checks the files you actually changed. Configured in root `package.json`:

- `.ts`, `.tsx`, `.js`, `.mjs`, `.cjs` files → `eslint --fix` then `prettier --write`
- `.json`, `.md`, `.css`, `.yaml`, `.yml` files → `prettier --write`

## How it all fits together

1. You edit some files and `git add` them
2. You run `git commit`
3. Husky triggers the `pre-commit` hook
4. The hook runs `lint-staged`
5. lint-staged runs ESLint + Prettier only on your staged files
6. If anything fails, the commit is aborted so you can fix it first

This means broken code or inconsistent formatting can't make it into the repo.

## Other configs

- **`.editorconfig`** — Tells editors (VS Code, IntelliJ, etc.) to use 2-space indentation, UTF-8, and LF line endings. Prevents "tabs vs spaces" issues before they start.
- **`.gitattributes`** — Forces LF line endings in Git, regardless of OS. Avoids CRLF noise in diffs on Windows.
