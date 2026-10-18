# Changelog

All repository-level changes are documented here. User-visible plugin changes live in each
package's own `CHANGELOG.md`.

## [Unreleased]

### Changed

- Expanded `README.md` and `README.en.md` into a full per-plugin guide: problem statement, features,
  usage, install command, data boundaries, limitations and package-level documentation links for each
  of the six plugins.
- Added a quick-start section for the monorepo installer and individual `plugin_manager` install
  commands, plus compatibility, verification, privacy and development sections.
- Condensed the per-plugin sections to current behaviour; fixes from the development history are no
  longer presented as features (they remain in package changelogs).
- Added visible captions to every README screenshot, describing the panels/actions and identifying
  the current 2.3.0 sidebar UI.
- Removed the generated UI mockups from package and root READMEs. Image slots now require real
  screenshots captured from the running UI; drawn approximations are not used as documentation.
- Documented how to update an installed plugin for path-link and Plugin Manager installs, including
  the required full DSH restart and preserved local data.
- Corrected the update docs after confirming the GitHub remote (`tzhaos/dsh-plugins`) and added
  `scripts/update-all.mjs` plus the `npm run update` alias. The README now also explains why the
  monorepo root itself cannot be passed to `plugin_manager install_bundle`.

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
