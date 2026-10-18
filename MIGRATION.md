# Migration

This monorepo was assembled from six previously independent repositories. Per the migration choice,
the new repository starts with a fresh Git history; source file contents and each package's own
changelog were preserved, but the original commit histories are not part of this repository.

## Source mapping

| Monorepo package | Previous repository | Imported version |
|---|---|---|
| `packages/dsh-sidebar-sections` | `D:\dsh-plugins\dsh-sidebar-sections` (remote `tzhaos/dsh-sidebar-sections`) | 2.3.0 |
| `packages/dsh-file-link-actions` | `D:\dsh-plugins\dsh-file-link-actions` | 1.0.0 |
| `packages/dsh-composer-history` | `D:\dsh-plugins\dsh-composer-history` | 1.2.0 |
| `packages/dsh-hover-polish` | `D:\dsh-plugins\dsh-hover-polish` | 1.0.11 |
| `packages/dsh-continue` | `D:\dsh-plugins\dsh-continue` | 1.0.0 |
| `packages/dsh-queue-withdraw` | `D:\dsh-plugins\dsh-queue-withdraw` | 1.1.1 |

## What changed in the move

- package directories moved under `packages/` and their `.git` directories were not copied
- each package's `.github` workflow was removed; the root workflow runs all suites
- package `.editorconfig` / `.gitattributes` / `.gitignore` copies were removed in favor of root
  configuration
- root install/check scripts and a new root changelog were added
- package code, manifests, tests, READMEs and per-package changelogs were copied unchanged except
  for documentation links to the old repository layout

## Old repositories

The original standalone directories and the `tzhaos/dsh-sidebar-sections` remote are **not** deleted
by this migration. Treat them as archived unless the migration is explicitly reverted.


## Split back into independent repositories

The plugin implementations were later split back into independent GitHub repositories. The main
repository now keeps them as Git submodules under `packages/` and provides the shared installer,
checks and documentation:

- `tzhaos/dsh-sidebar-sections`
- `tzhaos/dsh-file-link-actions`
- `tzhaos/dsh-composer-history`
- `tzhaos/dsh-hover-polish`
- `tzhaos/dsh-continue`
- `tzhaos/dsh-queue-withdraw`
- `tzhaos/dsh-tab-middle-click`

Clone with `--recurse-submodules` (or run `git submodule update --init --recursive`) before running
`node scripts/install-all.mjs`.
