<div align="center">

# DSH Plugins

**Seven independent DeepSeek Harness Web client plugins.**

Sidebar sections · File-link actions · Composer history · Hover · One-click continue · Queue withdraw · Tab middle-click

[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)](https://github.com/deepseek-ai/deepseek-harness)
[![Checks](https://img.shields.io/badge/checks-201-brightgreen)](scripts/check-all.mjs)
[![Runtime deps](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[简体中文](README.md) | English

[Plugins](#plugins) · [Quick start](#quick-start) · [Compatibility](#compatibility) · [Development](#development)

</div>

---

## What this is

A monorepo of Web client plugins for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). The seven packages can be
installed together or independently, enabled and disabled separately, and each is still a complete
DSH bundle.

They add missing everyday interactions only. They do not replace host components, take over
sessions, or reimplement the agent.

| Plugin | One line | Version | Checks |
|---|---|---|---|
| [`dsh-sidebar-sections`](packages/dsh-sidebar-sections) | Pinned / Projects / Recent / Archived sidebar | 2.3.0 | 67 |
| [`dsh-file-link-actions`](packages/dsh-file-link-actions) | File-link context menu: default app, reveal folder, copy path | 1.0.0 | 20 |
| [`dsh-composer-history`](packages/dsh-composer-history) | Searchable composer history with `↑` recall | 1.2.0 | 29 |
| [`dsh-hover-polish`](packages/dsh-hover-polish) | Unified button/tab hover and Codex-style tooltips | 1.0.11 | 34 |
| [`dsh-continue`](packages/dsh-continue) | Play control in the send button after a stop/error/truncation | 1.1.1 | 19 |
| [`dsh-queue-withdraw`](packages/dsh-queue-withdraw) | Withdraw queued messages back into the composer | 1.2.0 | 19 |
| [`dsh-tab-middle-click`](packages/dsh-tab-middle-click) | Close sidebar/dock tabs with a middle-click | 1.0.0 | 13 |

All packages: **201 zero-dependency checks**; no build step, no runtime npm dependencies.

## Quick start

### Install everything

Clone from GitHub:

```powershell
git clone https://github.com/tzhaos/dsh-plugins.git
cd dsh-plugins
node scripts/install-all.mjs --dry-run
node scripts/install-all.mjs
```

If you already have the repository at `D:\dsh-plugins\dsh-plugins`, start with
`node scripts/install-all.mjs`. After installing, **fully quit and relaunch DSH**.

### Install one

From a Creator-preset session:

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-hover-polish")
```

`target` must be absolute. All seven targets:

```text
<monorepo>/packages/dsh-sidebar-sections
<monorepo>/packages/dsh-file-link-actions
<monorepo>/packages/dsh-composer-history
<monorepo>/packages/dsh-hover-polish
<monorepo>/packages/dsh-continue
<monorepo>/packages/dsh-queue-withdraw
<monorepo>/packages/dsh-tab-middle-click
```

### Install one package with the `dsh plugin` CLI

`dsh plugin` forwards to pnpm, so it **can** install one local package:

```powershell
git clone https://github.com/tzhaos/dsh-plugins.git
dsh plugin --profile desktop add "D:\dsh-plugins\dsh-plugins\packages\dsh-hover-polish"
```

It only installs the pnpm dependency; it **does not add the package to
`dsh.profile.bundles`**. Append `dsh-hover-polish` to `dsh.profile.bundles` in
`~/.dsh/profiles/desktop/package.json`, then fully restart DSH. `install-all.mjs` is preferred
because it updates both the dependencies and the bundle list.

The GitHub repository root cannot be used as the CLI target: it is a monorepo, not a single DSH
bundle; a `github:` URL pointing at the root does not produce a loadable Loader row.

### Verify

```sh
node scripts/check-all.mjs
```

## Updating

The repository is published at <https://github.com/tzhaos/dsh-plugins>; npm and the plugin marketplace
are not published yet. Update according to how the plugins were installed.

### Option 1: monorepo path-link install

One command pulls and re-links:

```powershell
cd D:\dsh-plugins\dsh-plugins
node scripts/update-all.mjs
# fully quit DSH, then start it again
```

The script checks the working tree, runs `git pull --ff-only`, then runs `install-all.mjs`. Options:

```powershell
node scripts/update-all.mjs --dry-run   # print the plan only
node scripts/update-all.mjs --no-pull   # sources already updated; only re-link
```

Manual equivalent:

```powershell
git status --short          # make sure there are no local changes to lose
git pull --ff-only
node scripts/install-all.mjs
```

- packages are path-linked: after `client.js` or other source changes, **fully restart DSH**; a page
  refresh is not enough
- `install-all.mjs` re-checks junctions, dependencies and `dsh.profile.bundles`
- adding/removing a package or changing the bundle list requires re-running the installer
- when only one package's source changed, a restart is usually enough; the installer is idempotent

### Option 2: Plugin Manager install

If the bundle was installed through `plugin_manager install_bundle`, reinstall it when the version or
directory changes:

```text
plugin_manager(action="remove_bundle", target="dsh-hover-polish")
plugin_manager(action="install_bundle", target="<absolute path of the new version>")
```

Then fully quit and relaunch DSH. `install_bundle` answers `already-installed` for a bundle that is
already present, so version upgrades normally need a remove first.

If only files in the same linked directory changed, a DSH restart is enough; reinstall when the path,
version or `cordis.patch.yml` changes.

### Why `dsh plugin add github:...` is not enough

`dsh plugin` only forwards to pnpm: it installs the dependency into the profile but **does not
register the bundle**. DSH loads only the packages listed in `dsh.profile.bundles`, so a CLI-only
install still needs a manual bundle-list edit.

The GitHub repository root is a monorepo, not a single DSH bundle, so a `plugin_manager` `target`
cannot point at the repository root. To install one plugin, clone first and point at the absolute
package path:

```text
plugin_manager(action="install_bundle", target="<clone directory>/packages/dsh-hover-polish")
```

To install everything, use `node scripts/install-all.mjs`. If npm packages are published later,
reinstall with the matching spec. Do not rely on a page refresh to load a new client bundle; the
browser half loads at DSH startup.

### What updates preserve

- sidebar ordering/collapse, composer history and safe-delete records stay in browser `localStorage`
- the queue-withdraw file cache stays in `IndexedDB`, but only applies while the message is queued
- sessions, messages and agent results stay under DSH control and are never changed by an update
- clearing site data or switching browsers loses local view state

## Compatibility


| Item | Value |
|---|---|
| DSH | `0.2.1-rc.2` |
| Surface | Web GUI, Desktop Web GUI |
| Node | 22+ (tests and installer only) |
| Build | None |
| Runtime deps | None |

DSH is pre-stable; client APIs, slots and DOM contracts may change between releases.

---

## Plugins

### dsh-sidebar-sections

[![version](https://img.shields.io/badge/version-2.3.0-blue)](packages/dsh-sidebar-sections)
[![checks](https://img.shields.io/badge/checks-67-brightgreen)](packages/dsh-sidebar-sections/scripts/check.mjs)

Turns the sidebar into four first-class sections: **Pinned / Projects / Recent / Archived**.

![dsh-sidebar-sections 2.3.0: four sidebar sections, section menu and project menu](packages/dsh-sidebar-sections/docs/screenshot.png)

*Image notes: left is the four-section Pinned / Projects / Recent / Archived sidebar; middle is the section menu for grouping and ordering; right is the project menu with reveal, rename and delete actions. The screenshot reflects the current 2.3.0 UI.*

- Four independent sections; Archived can be hidden in settings
- Projects and Recent can group by project or use one flat list; projects order independently
- Drag ordering with insertion line and edge auto-scroll
- Hover and context menus: pin, archive, rename, fork, copy Session ID
- Hover preview card with title, project and time
- Full-width search; matching groups expand automatically
- Settings can restore safely deleted conversations; safe delete never calls the host delete API

**Usage:** use the sidebar directly; hover a row, right-click or press `Shift+F10` for menus, drag
rows to reorder.

**Data:** ordering, collapse state, grouping and safe-delete records live in `localStorage`; pins,
archive state and titles stay host-owned.

**Limitations:** sidebar view only; dragging is disabled while filtering; very old history outside
the loaded event window may not appear.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-sidebar-sections")
```

[Docs](packages/dsh-sidebar-sections/README.en.md) · [中文](packages/dsh-sidebar-sections/README.md)

---

### dsh-file-link-actions

[![version](https://img.shields.io/badge/version-1.0.0-blue)](packages/dsh-file-link-actions)
[![checks](https://img.shields.io/badge/checks-20-brightgreen)](packages/dsh-file-link-actions/scripts/check.mjs)

Adds a **context menu** to local file links in conversations.

- Open with the default application
- Reveal in the file manager
- Copy the resolved absolute path
- Works with file references and markdown file links; relative paths resolve against the workspace
- Left-click preview and host data stay unchanged

**Usage:** right-click a file link in conversation markdown and choose an action.

**Limitations:** local file links only; no workspace path means no reveal; depends on
`openWorkspacePath`.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-file-link-actions")
```

[Docs](packages/dsh-file-link-actions/README.en.md) · [中文](packages/dsh-file-link-actions/README.md)

---

### dsh-composer-history

[![version](https://img.shields.io/badge/version-1.2.0-blue)](packages/dsh-composer-history)
[![checks](https://img.shields.io/badge/checks-29-brightgreen)](packages/dsh-composer-history/scripts/check.mjs)

Adds **searchable composer history** with quick recall.

- Panel lists real user prompts sent in the current conversation
- `↑` in an empty composer recalls the previous prompt; keep pressing to go older
- `↓` goes newer and restores the original draft
- Clock button or `Ctrl/Cmd + ↑` opens the searchable panel
- Panel and Settings can clear/delete local records
- Text only; no attachments or file references

**Data:** local records live in `localStorage` under `dsh.composerHistory.managedSettings`; cap 500.

**Limitations:** only `user/message` events in the loaded window; clearing/deleting does not modify
Session logs; state is lost after clearing site data or switching devices.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-composer-history")
```

[Docs](packages/dsh-composer-history/README.en.md) · [中文](packages/dsh-composer-history/README.md)

---

### dsh-hover-polish

[![version](https://img.shields.io/badge/version-1.0.11-blue)](packages/dsh-hover-polish)
[![checks](https://img.shields.io/badge/checks-34-brightgreen)](packages/dsh-hover-polish/scripts/check.mjs)

Unifies button/tab hover feedback and gives icon buttons Codex-style tooltips.

- Transparent icon buttons get one hover surface and transition
- Native icon-button `title` is replaced by a custom tooltip
- Model/reasoning, permission and add controls explain their action instead of repeating a label
- Tabs share hover feedback; file tabs reveal the full title/path
- Keyboard focus shows the same tooltip; `Esc`, scroll and blur dismiss

**Limitations:** only buttons with `title`/`aria-label`; menu items, dropdown options and
`data-dshhp-skip` controls are skipped; custom bubbles wait 650ms so host tooltips can win.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-hover-polish")
```

[Docs](packages/dsh-hover-polish/README.en.md) · [中文](packages/dsh-hover-polish/README.md)

---

### dsh-continue

[![version](https://img.shields.io/badge/version-1.1.1-blue)](packages/dsh-continue)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](packages/dsh-continue/scripts/check.mjs)

After a task is **stopped, errors or is truncated**, an empty composer's send button becomes a play
control.

- Clicking submits “继续” / “Continue” through the current Session's `prompt()`
- No draft insertion, no attachments, no bypassing the queue
- Typing or adding attachments restores the normal send button

**Shown for:** `aborted`, `blocked`, `error`, `max-tokens`, `interrupted`, and a trailing
`turn/start` without an end. Normal `completed` and `forked` endings do not show it.

**Limitations:** send-button/composer state only; depends on the host primary-button DOM; major layout
changes may need adaptation.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-continue")
```

[Docs](packages/dsh-continue/README.en.md) · [中文](packages/dsh-continue/README.md)

---

### dsh-queue-withdraw

[![version](https://img.shields.io/badge/version-1.2.0-blue)](packages/dsh-queue-withdraw)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](packages/dsh-queue-withdraw/scripts/check.mjs)

**Withdraws queued messages back into the composer.**

- Text appends to the existing draft instead of overwriting it
- Image attachments can be restored
- File attachments are cached in browser IndexedDB when selected and re-registered as draft files on
  withdraw
- Removes the queue item through public `Session.updateQueue(remove)`
- On rejection the previous draft is restored and the message stays queued

**Limitations:** only files selected after this plugin loaded are cached; pre-existing queued files
have no cache. Clearing site data, private browsing, an IndexedDB failure or a cache older than 24
hours can make a file unrestorable. Cache matching uses `name + size`.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-queue-withdraw")
```

[Docs](packages/dsh-queue-withdraw/README.en.md) · [中文](packages/dsh-queue-withdraw/README.md)

---

### dsh-tab-middle-click

Turns middle-click into a tab-close gesture.

- Middle-click on `[data-dockkit-tab]` / `[data-sidebar-right-tab]`
- Clicks the tab's existing close control, reusing DSH's own close flow
- Prevents middle-click autoscroll while over a tab
- Leaves tabs without a close control untouched

**Usage:** middle-click a sidebar or dock tab.

**Limitations:** depends on DockKit's tab DOM contract; middle-click only, no new keyboard shortcut.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-tab-middle-click")
```

[Docs](packages/dsh-tab-middle-click/README.en.md) · [中文](packages/dsh-tab-middle-click/README.md)

---

## Repository layout

```text
.
├── packages/          # seven complete DSH bundles
├── scripts/
│   ├── check-all.mjs
│   └── install-all.mjs
├── .github/workflows/check.yml
├── README.md / README.en.md
└── CHANGELOG.md
```

Each package contains `package.json`, `cordis.patch.yml`, a Host `index.js`, browser `client.js`,
locale files, READMEs, CHANGELOG and zero-dependency tests.

Packages are separate so they can be installed, rolled back and debugged independently. The
monorepo only unifies Git, CI and install scripts.

## Verification

```sh
node scripts/check-all.mjs
```

```text
all packages passed: 7 packages, 201 checks
```

| Package | Checks |
|---|---|
| `dsh-sidebar-sections` | 67 |
| `dsh-file-link-actions` | 20 |
| `dsh-composer-history` | 29 |
| `dsh-hover-polish` | 34 |
| `dsh-continue` | 19 |
| `dsh-queue-withdraw` | 19 |
| `dsh-tab-middle-click` | 13 |

## Privacy and data

- no telemetry, no extra server, no network reporting
- sidebar/history view data stays in browser `localStorage`
- queue-withdraw file cache stays in browser `IndexedDB` and is cleaned after withdrawal or when the
  queue item leaves
- host data stays host-API-driven; plugins never read credentials or write session logs

## Development

```sh
node scripts/check-all.mjs
node scripts/install-all.mjs
node scripts/install-all.mjs --dry-run
node scripts/install-all.mjs --profile "<profile directory>"
```

Release flow: bump the package's `package.json` version and `CHANGELOG.md`, run the full suite,
commit and tag the package. The root `CHANGELOG.md` records repository-level changes only.

## Migration and license

This repository starts with a fresh history and consolidates the previous standalone repositories;
see [MIGRATION.md](MIGRATION.md). Old directories remain as an archive.

[MIT](LICENSE). Each package also includes a LICENSE copy.
