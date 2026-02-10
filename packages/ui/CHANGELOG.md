# @borta/web-ui

## 1.2.1

### Patch Changes

- Add README documentation to npm package

## 1.2.0

### Minor Changes

- Replace fixed publicCount/totalCount props in StatsSection with a dynamic stats array. Each consumer now passes an array of { value, label } objects to render any combination of stat cards.

## 1.1.0

### Minor Changes

- Invert default theme: dark is now the default, light is opt-in via `.light` class. Renamed `--dark-*` CSS variables to `--light-*`. Media query fallback changed from `prefers-color-scheme: dark` to `prefers-color-scheme: light`.

## 1.0.0

### Major Changes

- Initial release of shared UI components including PhotoCard, MasonryGrid, and Overlay.
