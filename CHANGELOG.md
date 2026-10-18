# Changelog

All repository-level changes are documented here. User-visible plugin changes live in each
package's own `CHANGELOG.md`.

## [Unreleased]

### Added

- Added `dsh-quick-fork` 0.1.0: select text in a conversation to open a temporary side conversation in the native right sidebar.

### Changed

- Split the plugin implementations back into independent GitHub repositories and linked them from
  the main repository as Git submodules.
- The main repository now provides the shared README, installer, checks and agent install prompt;
  plugin code, tests and changelogs live in their own repositories.
- `update-all.mjs` now syncs and initializes submodules before re-linking the profile.
- Expanded `README.md` and `README.en.md` into a full per-plugin guide: problem statement, features,
  usage, install command, data boundaries, limitations and package-level documentation links for each
  of the plugins.
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
- `dsh-sidebar-sections` 2.4.0 now offers safe delete from every conversation row, not only archived rows.
- `dsh-queue-withdraw` 1.2.1 moved its action from the right action cluster to the queue row leading
  edge, away from edit/delete/steer.
- Added `dsh-long-paste` 1.0.0: long composer pastes become text-file attachments; 1.1.0 adds
  **Show in text field** to expand an attachment back into the composer.
- Added `dsh-tab-middle-click` 1.0.0: middle-click closes a sidebar/dock tab through its existing
  close control.
- Clarified that `dsh plugin` only forwards to pnpm: it installs the package but does not register the
  bundle in `dsh.profile.bundles`, which is why the monorepo root or a bare `github:` URL is not a
  complete install command.
- Corrected the update docs after confirming the GitHub remote (`tzhaos/dsh-plugins`) and added
  `scripts/update-all.mjs` plus the `npm run update` alias. The README now also explains why the
  monorepo root itself cannot be passed to `plugin_manager install_bundle`.

## [1.0.0] - 2026-10-18

### Added

- Consolidated the independently managed plugins into one monorepo under `packages/`:
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
