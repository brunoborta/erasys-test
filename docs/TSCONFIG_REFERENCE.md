# TypeScript Configuration Reference

This monorepo uses a shared `tsconfig.base.json` at the root. Each app and package extends it, overriding only what's specific to its context.

## tsconfig.base.json (root)

Shared options inherited by all projects.

| Option                             | Value               | What it does                                                                               |
| ---------------------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| `target`                           | `ES2022`            | JS version the compiler outputs. ES2022 includes top-level await, class fields, etc.       |
| `module`                           | `ESNext`            | Module system for output. ESNext keeps import/export as-is (bundlers handle it).           |
| `lib`                              | `["ES2022", "DOM"]` | Type definitions available. ES2022 gives modern JS APIs, DOM gives browser APIs.           |
| `moduleResolution`                 | `bundler`           | How TS finds modules. `bundler` mode matches how Vite/webpack/turbopack resolve imports.   |
| `resolveJsonModule`                | `true`              | Allows `import data from './file.json'`.                                                   |
| `allowJs`                          | `false`             | Whether `.js` files are processed by TS. Off by default — packages are TS-only.            |
| `strict`                           | `true`              | Enables all strict type-checking flags (strictNullChecks, noImplicitAny, etc).             |
| `noUnusedLocals`                   | `true`              | Error on declared but unused variables.                                                    |
| `noUnusedParameters`               | `true`              | Error on unused function parameters.                                                       |
| `noFallthroughCasesInSwitch`       | `true`              | Error when a switch case falls through without `break`.                                    |
| `noUncheckedIndexedAccess`         | `true`              | Array/object index access returns `T \| undefined` instead of just `T`. Catches bugs.      |
| `esModuleInterop`                  | `true`              | Allows `import x from 'cjs-module'` to work with CommonJS modules.                         |
| `skipLibCheck`                     | `true`              | Skips type-checking `.d.ts` files. Speeds up compilation significantly.                    |
| `forceConsistentCasingInFileNames` | `true`              | Error if import casing doesn't match the filesystem. Prevents cross-OS bugs.               |
| `isolatedModules`                  | `true`              | Ensures each file can be transpiled independently. Required by Vite, esbuild, swc.         |
| `declaration`                      | `true`              | Generates `.d.ts` type declaration files. Needed for packages consumed by other packages.  |
| `declarationMap`                   | `true`              | Generates `.d.ts.map` files. Allows "go to definition" to jump to source instead of types. |
| `sourceMap`                        | `true`              | Generates `.js.map` files for debugging.                                                   |

## Apps override `declaration: false`

Apps (web-nextjs, web-spa) are final consumers — nobody imports from them. So they disable `declaration` and `declarationMap` since those only matter for published packages.

## packages/ui

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist", // build output directory
    "rootDir": "./src", // source root (preserves folder structure in dist)
    "jsx": "react-jsx", // enables JSX with the automatic React 17+ transform
  },
}
```

Minimal — everything else comes from the base.

## packages/user-pictures

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
  },
}
```

Even simpler — no JSX needed since it's a pure TS SDK.

## apps/web-nextjs

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2017", // lower target — Next.js/SWC handles modern syntax transpilation
    "lib": ["DOM", "DOM.Iterable", "ESNext"], // adds DOM.Iterable (NodeList.forEach, etc) and full ESNext APIs
    "allowJs": true, // Next.js convention — allows .js files in the project
    "jsx": "react-jsx",
    "noEmit": true, // TS only type-checks — Next.js builds via SWC, not tsc
    "incremental": true, // caches type-check results in .tsbuildinfo for faster re-checks
    "declaration": false, // app doesn't publish types
    "declarationMap": false,
    "plugins": [{ "name": "next" }], // Next.js TS plugin (enhanced autocomplete for Next.js APIs)
    "paths": { "@/*": ["./src/*"] }, // path alias: import { x } from "@/lib/utils"
  },
}
```

## apps/web-spa

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"], // adds DOM.Iterable for iterator APIs
    "jsx": "react-jsx",
    "noEmit": true, // Vite builds via esbuild, not tsc
    "declaration": false, // app doesn't publish types
    "declarationMap": false,
  },
}
```

Leanest config — Vite handles everything else.

## Why `noEmit: true` in apps?

Both Next.js and Vite have their own compilers (SWC and esbuild). TypeScript is used **only for type checking** (`tsc -b` / `tsc --noEmit`). The actual JS output is produced by the bundler, which is much faster than tsc.

## Why `target: ES2017` only in Next.js?

Next.js's SWC compiler handles syntax downleveling based on the browserslist config. The TS `target` only affects what tsc considers valid — ES2017 is the conventional setting for Next.js projects.
