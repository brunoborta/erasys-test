# Release Workflow

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing of the two shared packages: `@borta/web-ui` and `@borta/user-pictures`.

Apps (`web-nextjs`, `web-spa`, `mobile`) are private and not published to npm.

---

## How it works

Changesets separates two concerns:

1. **What changed** — described by the developer when the change is made
2. **What version** — computed by the tool based on semver rules

This avoids version bump debates during code review and ensures changelogs are written by the person who made the change.

---

## Step by step

### 1. Make your changes

Write code, commit as usual.

### 2. Create a changeset

```bash
pnpm changeset
```

This interactive prompt asks:

- **Which packages changed?** — select one or both (`@borta/web-ui`, `@borta/user-pictures`)
- **Semver bump type?** — `patch` (bug fix), `minor` (new feature), `major` (breaking change)
- **Summary** — one-line description of the change (goes into CHANGELOG.md)

It creates a markdown file in `.changeset/` (e.g. `.changeset/funny-dogs-dance.md`). Commit this file alongside your code changes.

### 3. Version the packages

```bash
pnpm changeset version
```

This reads all pending changeset files and:

- Bumps `version` in each affected `package.json`
- Updates `CHANGELOG.md` in each affected package
- Deletes the consumed changeset files

Review the changes, then commit:

```bash
git add -A && git commit -m "chore: version packages"
```

### 4. Publish to npm

```bash
pnpm changeset publish
```

This publishes every package that has a new version not yet on the registry. Requires npm authentication (`npm login`).

After publishing, push the version commit and tags:

```bash
git push && git push --tags
```

---

## Configuration

The changeset config lives in `.changeset/config.json`:

| Setting                      | Value      | Why                                                                                |
| ---------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| `access`                     | `"public"` | Packages are published under the `@borta` scope with public access                 |
| `baseBranch`                 | `"main"`   | Changesets compares against `main` to detect pending changes                       |
| `commit`                     | `false`    | Version bumps are not auto-committed — lets you review before committing           |
| `updateInternalDependencies` | `"patch"`  | If `@borta/user-pictures` bumps, apps that depend on it get their lockfile updated |

---

## Example

Say you added a new `getPreviewImageUrl()` function to `@borta/user-pictures`:

```bash
# 1. After committing your code
pnpm changeset
# Select: @borta/user-pictures
# Bump: minor (new feature)
# Summary: "Add getPreviewImageUrl function"

# 2. Commit the changeset file
git add .changeset && git commit -m "chore: add changeset for getPreviewImageUrl"

# 3. When ready to release
pnpm changeset version
git add -A && git commit -m "chore: version packages"
pnpm changeset publish
git push && git push --tags
```

---

## Quick reference

| Command                  | What it does                                         |
| ------------------------ | ---------------------------------------------------- |
| `pnpm changeset`         | Create a new changeset (interactive)                 |
| `pnpm changeset version` | Consume changesets, bump versions, update changelogs |
| `pnpm changeset publish` | Publish new versions to npm                          |
| `pnpm changeset status`  | Show pending changesets without applying them        |
