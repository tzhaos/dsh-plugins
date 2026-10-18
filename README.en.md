# DSH Plugins

[简体中文](README.md) | English

A monorepo of small DeepSeek Harness Web client plugins. Each plugin remains independently
installable, testable and versioned; the repository owns shared CI, development installation and
release metadata.

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/monorepo-1.0.0-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)

## Packages

| Package | Version | Checks | Description |
|---|---|---|---|
| [`dsh-sidebar-sections`](packages/dsh-sidebar-sections) | 2.3.0 | 67 | Four-section sidebar (Pinned / Projects / Recent / Archived) with drag ordering, context menus, safe delete, settings and file-manager shortcuts. |
| [`dsh-file-link-actions`](packages/dsh-file-link-actions) | 1.0.0 | 20 | Right-click actions for conversation file links: open in default app, reveal containing folder, copy path. |
| [`dsh-composer-history`](packages/dsh-composer-history) | 1.2.0 | 29 | Composer prompt history with search, direct `↑` recall, palette clear and a Settings tab to view/delete/clear records. |
| [`dsh-hover-polish`](packages/dsh-hover-polish) | 1.0.11 | 34 | Unified button/tab hover, Codex-style tooltips, explanatory bubbles, full tab titles and shortcut dedupe. |
| [`dsh-continue`](packages/dsh-continue) | 1.1.0 | 18 | Turns the empty-composer send button into a one-click play/continue control after a terminal turn. |
| [`dsh-queue-withdraw`](packages/dsh-queue-withdraw) | 1.1.1 | 17 | Withdraw queued messages back into the draft, including text and images; file attachments remain limited by Host APIs. |

All suites total **185 checks**, with no runtime dependencies.

## Install

### Install every plugin (development / local)

```powershell
node scripts/install-all.mjs
```

The script:

1. creates a junction for each package under `~/.dsh/profiles/desktop/node_modules`;
2. writes `link:` dependencies into the profile `package.json`;
3. appends the six plugins to `dsh.profile.bundles` in order.

A custom profile is supported:

```powershell
node scripts/install-all.mjs --profile "$env:USERPROFILE\.dsh\profiles\desktop"
```

### Install one plugin

Every package is still a complete DSH bundle:

```text
plugin_manager(action="install_bundle", target="<repository>/packages/<plugin-folder>")
```

## Development

```sh
node scripts/check-all.mjs     # run every package's zero-dependency suite
```

Or run one package:

```sh
cd packages/dsh-hover-polish
node scripts/check.mjs
```

Repository rules:

- no build step and no runtime dependencies
- each package owns its `package.json` / `cordis.patch.yml` / `client.js` / locale / tests
- the root owns shared CI, editor settings and the development installer
- each package's `README.md` is the Chinese primary document and `README.en.md` is its English pair

## Layout

```text
.
├── packages/
│   ├── dsh-sidebar-sections/
│   ├── dsh-file-link-actions/
│   ├── dsh-composer-history/
│   ├── dsh-hover-polish/
│   ├── dsh-continue/
│   └── dsh-queue-withdraw/
├── scripts/
│   ├── check-all.mjs
│   └── install-all.mjs
├── .github/workflows/check.yml
├── README.md / README.en.md
├── MIGRATION.md
└── CHANGELOG.md
```

## Versioning and releases

- the monorepo root version changes when the repository itself is reorganized or gains a package
- each plugin keeps its own `package.json` version, tags and `CHANGELOG.md`
- the root `CHANGELOG.md` records repository-level changes only; user-visible plugin changes stay in
  the plugin's own changelog

## Known limitations

- plugins still use pre-stable DSH client APIs and a few Host DOM contracts; upgrades may need
  compatibility updates
- `install-all.mjs` is a development path-link installer; distribution should use Plugin Manager
- file attachments still cannot be withdrawn because the Host exposes image attachment reads only

## Migrated from standalone repositories

This repository starts with a fresh Git history and consolidates the previously independent plugin
repositories; the mapping is in [MIGRATION.md](MIGRATION.md).

## License

[MIT](LICENSE). Each package also carries its own LICENSE copy.
