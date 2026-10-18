# Changelog

All repository-level changes are documented here. User-visible plugin changes live in each
package's own `CHANGELOG.md`.

## [1.0.0] - 2026-10-18

### Added

- Consolidated six independently managed plugins into one monorepo under `packages/`:
  - `dsh-sidebar-sections` 2.3.0
  - `dsh-file-link-actions` 1.0.0
  - `dsh-composer-history` 1.2.0
  - `dsh-hover-polish` 1.0.11
  - `dsh-continue` 1.0.0
  - `dsh-queue-withdraw` 1.1.1
- Root `scripts/check-all.mjs` runner for all package suites.
- Root `scripts/install-all.mjs` development installer that links every package into a DSH profile.

### Changed

- Shared CI, editor settings, license and repository documentation now live at the root.
- Package-level CI workflows were removed; each package keeps its own tests, README and changelog.
