# Config Reference

Quick reference for every config file in the repo. Only documents what's actually used — not all possible options.

---

## turbo.json

```jsonc
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"], // build dependencies first (packages before apps)
      "inputs": ["src/**", "tsconfig.json", "tsup.config.ts", "package.json"],
      "outputs": ["dist/**", ".next/**", "build/**"],
    },
    "dev": { "cache": false, "persistent": true }, // never cache, long-running process
    "test": {
      "dependsOn": ["^build"], // needs built packages for type resolution
      "inputs": ["src/**", "test/**", "vitest.config.ts", "package.json"],
      "outputs": ["coverage/**"],
    },
    "lint": { "inputs": ["src/**", "eslint.config.*", ".prettierrc"] },
    "type-check": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "tsconfig.json", "package.json"],
    },
    "clean": { "cache": false }, // always run, deletes cached outputs
  },
}
```

| Key                     | Meaning                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| `dependsOn: ["^build"]` | Run `build` in dependency packages first (`^` = workspace deps)        |
| `inputs`                | Files that invalidate the cache when changed                           |
| `outputs`               | Files to cache and restore on cache hit                                |
| `cache: false`          | Always execute, never use cache                                        |
| `persistent: true`      | Long-running process (dev servers) — Turbo won't wait for it to finish |

---

## tsconfig.base.json

Shared by all packages and apps via `"extends"`.

| Option                             | Value        | Why                                                       |
| ---------------------------------- | ------------ | --------------------------------------------------------- |
| `target`                           | `ES2022`     | Node.js 18+ (class fields, top-level await)               |
| `module`                           | `ESNext`     | Keep import/export as-is — bundlers handle it             |
| `lib`                              | `["ES2022"]` | Base only needs JS APIs; apps add `DOM`                   |
| `moduleResolution`                 | `bundler`    | Understands package.json `exports` maps                   |
| `strict`                           | `true`       | All strict checks: nullChecks, noImplicitAny, etc.        |
| `noUncheckedIndexedAccess`         | `true`       | `arr[0]` returns `T \| undefined`                         |
| `noUnusedLocals`                   | `true`       | Error on unused variables                                 |
| `noUnusedParameters`               | `true`       | Error on unused function params                           |
| `noFallthroughCasesInSwitch`       | `true`       | Error on switch case without break                        |
| `isolatedModules`                  | `true`       | Required by Vite/esbuild/SWC (file-by-file transpilation) |
| `esModuleInterop`                  | `true`       | `import x from 'cjs-lib'` just works                      |
| `skipLibCheck`                     | `true`       | Skip .d.ts checking — faster builds                       |
| `forceConsistentCasingInFileNames` | `true`       | Prevents cross-OS bugs (Windows is case-insensitive)      |
| `declaration`                      | `true`       | Generate .d.ts for package consumers                      |
| `declarationMap`                   | `true`       | "Go to definition" jumps to .ts source                    |
| `sourceMap`                        | `true`       | Stack traces point to TypeScript source                   |

### Per-project overrides

| Project                  | Key overrides                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **web-nextjs**           | `target: ES2017` (SWC handles downleveling), `noEmit: true`, `jsx: react-jsx`, `allowJs: true`, `plugins: [next]`, `paths: @/*` |
| **web-spa**              | `noEmit: true`, `jsx: react-jsx`, `lib: [ES2022, DOM, DOM.Iterable]`                                                            |
| **@borta/web-ui**        | `outDir: ./dist`, `rootDir: ./src`, `jsx: react-jsx`                                                                            |
| **@borta/user-pictures** | `outDir: ./dist`, `rootDir: ./src` (no JSX)                                                                                     |

Apps set `declaration: false` and `declarationMap: false` since nobody imports from them.

---

## tsup.config.ts (packages)

Both packages use the same config shape:

```ts
defineConfig({
  entry: ["src/index.ts"], // single entry point (barrel file)
  format: ["esm", "cjs"], // dual output: .js (ESM) + .cjs (CJS)
  dts: true, // generate .d.ts via tsc
  clean: true, // rm dist/ before build
  sourcemap: true, // generate .js.map for debugging
});
```

`@borta/web-ui` also includes `"src/globals.css"` as a second entry point.

---

## vitest.config.ts

### @borta/user-pictures (Node.js SDK)

```ts
defineConfig({
  test: {
    globals: true, // describe/it/expect without imports
    environment: "node", // pure Node.js (no DOM)
    coverage: {
      provider: "v8", // V8 native coverage (faster than Istanbul)
      reporter: ["text", "lcov"],
      include: ["src/**"],
      exclude: ["src/index.ts"], // barrel file has no logic
    },
  },
});
```

### @borta/web-ui (React components)

```ts
defineConfig({
  plugins: [react()], // @vitejs/plugin-react for JSX transform
  test: {
    globals: true,
    environment: "jsdom", // simulated browser (document, window)
    setupFiles: ["./test/setup.ts"], // registers @testing-library/jest-dom matchers
    coverage: {
      /* same as above */
    },
  },
});
```

---

## .prettierrc

```jsonc
{
  "semi": true, // enforce semicolons
  "singleQuote": false, // double quotes
  "tabWidth": 2,
  "trailingComma": "es5", // trailing commas where ES5 allows (objects, arrays)
  "printWidth": 100, // line wrap at 100 chars
}
```

---

## eslint.config.mjs (root)

ESLint 9 flat config. Applies to all packages except `web-nextjs` (which uses `eslint-config-next`).

- `typescript-eslint` — TS-aware rules (no-unused-vars, etc.)
- `eslint-plugin-react` + `react-hooks` — React rules on `.tsx` files
- `eslint-config-prettier` — disables rules that conflict with Prettier

---

## .editorconfig

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
```

Ensures consistent formatting across editors (VS Code, IntelliJ, vim) without relying on Prettier.

---

## .gitattributes

```
* text=auto eol=lf
```

Forces LF line endings in Git, regardless of OS. Prevents CRLF noise in diffs on Windows.

---

## Root package.json scripts

| Script         | Command                                | What it does                         |
| -------------- | -------------------------------------- | ------------------------------------ |
| `dev`          | `turbo run dev --parallel`             | Start all dev servers simultaneously |
| `build`        | `turbo run build`                      | Build all packages and apps          |
| `test`         | `turbo run test`                       | Run all tests                        |
| `lint`         | `turbo run lint`                       | Lint all packages                    |
| `format`       | `prettier --write .`                   | Format entire codebase               |
| `format:check` | `prettier --check .`                   | Check formatting (CI)                |
| `type-check`   | `turbo run type-check`                 | Run tsc --noEmit everywhere          |
| `clean`        | `turbo run clean`                      | Delete dist/.next/build dirs         |
| `check`        | `turbo run lint test type-check build` | All quality gates in one command     |
| `prepare`      | `husky`                                | Set up Git hooks after install       |
