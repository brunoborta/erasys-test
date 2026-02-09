# @borta/user-pictures

## 1.2.0

### Minor Changes

- Replace broken `getAllImageUrls` export with `getImageUrls` which uses an options object (`{ publicOnly, safeOnly, limit }`) instead of a positional boolean. Defaults match previous behavior.

## 1.1.0

### Minor Changes

- Add ApiError class, GetImageUrlsOptions type, API client and utility functions
