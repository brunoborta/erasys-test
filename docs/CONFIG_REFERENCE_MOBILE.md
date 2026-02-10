# Config Reference — Mobile (Expo)

Reference for every config attribute in the mobile app. Explains **why** each setting exists.

---

## metro.config.js

Metro is React Native's bundler (equivalent to Vite/Webpack for web). It resolves imports, bundles JS, and serves the app to devices.

| Setting                         | Value                                                   | Why                                                                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unstable_enableSymlinks`       | `true`                                                  | pnpm creates symlinks in `node_modules` instead of copying packages. Metro doesn't follow symlinks by default — without this, it can't find pnpm-installed packages. Stable since Expo SDK 52.          |
| `unstable_enablePackageExports` | `true`                                                  | Our packages (`@borta/user-pictures`) use the `"exports"` field in `package.json` to map ESM vs CJS imports. Without this, Metro doesn't know which file to serve when you `import` the package.        |
| `watchFolders`                  | `[monorepoRoot]`                                        | Metro only watches the app directory by default. Since packages live in `../../packages/`, we tell Metro to watch the entire monorepo root so it detects changes in shared packages during development. |
| `nodeModulesPaths`              | `[projectRoot/node_modules, monorepoRoot/node_modules]` | pnpm may hoist some dependencies to the root `node_modules` instead of the app's. This tells Metro to search both locations when resolving imports.                                                     |

---

## tsconfig.json

| Setting              | Value                  | Why                                                                                                                                                                                                                                                       |
| -------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `extends`            | `"expo/tsconfig.base"` | Expo provides a base tsconfig tuned for React Native (correct JSX transform, module resolution, RN type definitions). We extend this instead of the monorepo's `tsconfig.base.json` because that base has `"lib": ["ES2022"]` without React Native types. |
| `strict`             | `true`                 | Matches the monorepo convention. Enables `strictNullChecks`, `noImplicitAny`, etc.                                                                                                                                                                        |
| `noUnusedLocals`     | `true`                 | Matches the monorepo convention. Errors on unused variables.                                                                                                                                                                                              |
| `noUnusedParameters` | `true`                 | Matches the monorepo convention. Errors on unused function params.                                                                                                                                                                                        |

---

## app.json

| Setting                                | Value                  | Why                                                                                                                                                    |
| -------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                                 | `"Erasys Test Mobile"` | Display name shown on the device home screen.                                                                                                          |
| `slug`                                 | `"erasys-test-mobile"` | Unique identifier for Expo's build service (EAS). Must be URL-safe.                                                                                    |
| `version`                              | `"0.1.0"`              | Matches the monorepo's app versioning convention.                                                                                                      |
| `userInterfaceStyle`                   | `"dark"`               | Tells the OS this app prefers dark mode. Affects system UI elements (status bar, navigation bar).                                                      |
| `splash.backgroundColor`               | `"#071A0F"`            | The dark green `background` color, so the splash screen matches the app theme instead of showing a white flash.                                        |
| `android.adaptiveIcon.backgroundColor` | `"#071A0F"`            | Same dark green background for the Android adaptive icon.                                                                                              |
| `newArchEnabled`                       | `true`                 | Enables React Native's New Architecture (Fabric renderer + TurboModules). Default in Expo SDK 52+. Better performance and concurrent features support. |

---

## package.json scripts

| Script       | Command                              | Why                                                                                                                                  |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `dev`        | `npx expo start`                     | Starts the Expo development server. Turbo expects a `dev` script for `turbo run dev`.                                                |
| `build`      | `echo 'Mobile build handled by EAS'` | No-op. Expo apps are built via EAS Build (cloud service), not locally by Turbo. The script exists so `turbo run build` doesn't fail. |
| `start`      | `expo start --tunnel`                | Starts with tunnel mode for cross-network device testing.                                                                            |
| `lint`       | `eslint .`                           | Lint the app. Matches the monorepo pattern.                                                                                          |
| `type-check` | `tsc --noEmit`                       | Type-check without emitting files. Same as all other packages/apps.                                                                  |
| `clean`      | `rm -rf .expo node_modules/.cache`   | Clears Expo cache and Metro cache. Equivalent to `rm -rf .next` in the Next.js app.                                                  |

---

## Dependencies

| Package                          | Why                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@borta/user-pictures`           | Shared SDK for fetching profile data and building image URLs. Works out of the box in RN (no CORS, defaults correct).                                                      |
| `expo`                           | Expo framework — managed workflow for React Native development.                                                                                                            |
| `expo-status-bar`                | Control the device status bar appearance (included by default with Expo).                                                                                                  |
| `react-native-safe-area-context` | Replaces the deprecated `SafeAreaView` from `react-native`. Provides `SafeAreaProvider` + `SafeAreaView` that correctly handle notch/hole-punch insets on iOS and Android. |
