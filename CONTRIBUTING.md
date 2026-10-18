# Contributing

Thanks for improving the DSH plugins monorepo.

## Scope

Each directory under `packages/` is one complete DSH bundle. The repository root owns shared CI,
editor configuration, installation scripts and repository-level documentation.

## Rules

- **No build step and no runtime dependencies.**
- **Do not replace the Host app root.** Client bundles work through documented slots, overlays and
  scoped inputs.
- **Theme tokens only.** Use `--dsw-*` variables; never hard-code colors.
- **Keep Chinese primary and English paired.** Each package keeps `README.md` and `README.en.md` in
  sync; user-visible plugin changes go in the package `CHANGELOG.md`.
- **Restore native attributes.** If a plugin removes a Host attribute while a hover/overlay is open,
  it must restore it on leave and on cleanup.

## Verification

```sh
node scripts/check-all.mjs
```

For a single package:

```sh
cd packages/<package>
node scripts/check.mjs
```

CI runs `node scripts/check-all.mjs` on every push and pull request.

## Installation during development

```sh
node scripts/install-all.mjs
```

Use `--dry-run` to inspect the planned profile changes first.
