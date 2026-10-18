# dsh-file-link-actions

[简体中文](README.md) | English

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web client plugin that adds a
context menu to file links in conversations: open with the default application, reveal in the file
manager, or copy the file path.

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)
![Checks](https://img.shields.io/badge/checks-20-brightgreen)

## Why

DSH renders local file references in a conversation as links. A left click opens the shipped document
preview in the sidebar; opening the file in its default application, or jumping to its folder,
means hunting down the path by hand.

This plugin adds one gesture: **right-click a file link and get a system-level action menu**.

## Features

- **Open with default app** — hand the file to the operating system association
- **Open containing folder** — reveal the file in the OS file manager
- **Copy file path** — copy the resolved absolute path
- Works with inline file mentions and markdown file links
- Resolves relative paths against the owning conversation workspace before calling the Host
- Leaves the shipped left-click preview and Host data untouched

## Install

### Plugin Manager (recommended)

From a Creator-preset session:

```text
plugin_manager(action="install_bundle", target="<absolute path to this directory>")
```

`target` must be an absolute path. If the profile already has the same package installed, the call
answers `already-installed`; run `remove_bundle` first, or use the manual install.

### Manual install (development)

1. Make the package resolvable from the profile:

   ```powershell
   $profile = "$env:USERPROFILE\.dsh\profiles\desktop"
   New-Item -ItemType Directory -Force -Path "$profile\node_modules" | Out-Null
   New-Item -ItemType Junction -Path "$profile\node_modules\dsh-file-link-actions" `
            -Target "<absolute path to this directory>"
   ```

2. Add the `link:` dependency and append the package to `dsh.profile.bundles` in the profile's
   `package.json`. Only the ordered bundle list triggers a live recomposition.

### Requirements

- DeepSeek Harness `0.2.1-rc.2` (Web or Desktop Web surface)
- No build step and no runtime dependencies

## Usage

Right-click a file link in a conversation:

- **Open with default app** — open the file using the OS association
- **Open containing folder** — reveal the file in the file manager
- **Copy file path** — copy the resolved absolute path

Left-click keeps the shipped document preview behavior.

## How it works

The plugin registers a global overlay in `shell.overlay` and listens to document-level
`contextmenu` events:

1. the target must be inside conversation markdown and be a button carrying a `fileLink` /
   `fileMention` class;
2. the path comes from the button's `title` attribute;
3. the owning conversation comes from the nearest `[data-conversation-session]`; its workspace
   `cwd` resolves a relative path to an absolute path;
4. the Host runs `remote.session.openWorkspacePath` with the default open, or with
   `action: 'reveal'`.

Every color comes from a `--dsw-*` theme token; there is no build step and no runtime dependency.

## Known limitations

- Only local file links in conversation markdown are handled; ordinary web links and image preview
  buttons are ignored
- If the link has no usable absolute path and the conversation provides no workspace path, the
  plugin reports that it cannot locate the file
- DSH client APIs are still pre-stable; upgrades may require a compatibility update

## Development and testing

```sh
node scripts/check.mjs
```

The zero-dependency suite covers the manifest, bundle patch, locale, style tokens, context-menu
targeting, relative path resolution, default open / reveal / copy, Host failure notices and listener
cleanup across 20 checks.

## License

[MIT](LICENSE)
