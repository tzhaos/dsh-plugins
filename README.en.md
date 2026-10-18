<div align="center">

# DSH Plugins

**Twelve independent DeepSeek Harness Web client plugins.**

Sidebar sections · File-link actions · Composer history · Hover · One-click continue · Queue withdraw · Tab middle-click · Selection fork

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
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). The twelve packages can be
installed together or independently, enabled and disabled separately, and each is still a complete
DSH bundle.

They add missing everyday interactions only. They do not replace host components, take over
sessions, or reimplement the agent.

| Plugin | One line | Version | Checks |
|---|---|---|---|
| [`dsh-sidebar-sections`](https://github.com/tzhaos/dsh-sidebar-sections) | Pinned / Projects / Recent / Archived sidebar with safe delete on every row | 2.4.0 | 68 |
| [`dsh-file-link-actions`](https://github.com/tzhaos/dsh-file-link-actions) | File-link context menu: default app, reveal folder, copy path | 1.0.0 | 20 |
| [`dsh-composer-history`](https://github.com/tzhaos/dsh-composer-history) | Searchable composer history with `↑` recall | 1.2.0 | 29 |
| [`dsh-hover-polish`](https://github.com/tzhaos/dsh-hover-polish) | Unified button/tab hover and Codex-style tooltips | 1.0.11 | 34 |
| [`dsh-continue`](https://github.com/tzhaos/dsh-continue) | Play control in the send button after a stop/error/truncation | 1.1.1 | 19 |
| [`dsh-queue-withdraw`](https://github.com/tzhaos/dsh-queue-withdraw) | Edit-by-withdraw, drag reordering and draft attachment persistence | 1.5.1 | 22 |
| [`dsh-tab-middle-click`](https://github.com/tzhaos/dsh-tab-middle-click) | Close sidebar/dock tabs with a middle-click | 1.0.0 | 13 |
| [`dsh-long-paste`](https://github.com/tzhaos/dsh-long-paste) | Turn long pasted text into a `.txt` attachment, expandable back into the composer | 1.1.0 | 15 |
| [`dsh-sidebar-file-drop`](https://github.com/tzhaos/dsh-sidebar-file-drop) | Drag a sidebar file into the composer as a reference and bridge Desktop file paths | 1.1.0 | 15 |
| [`dsh-nav-back-forward`](https://github.com/tzhaos/dsh-nav-back-forward) | Back/forward session controls in the top-left | 1.3.3 | 11 |
| [`dsh-left-rail`](https://github.com/tzhaos/dsh-left-rail) | Codex-style left rail + brand workspace menu | 1.8.0 | 25 |
| [`dsh-quick-fork`](https://github.com/tzhaos/dsh-quick-fork) | Select text and open a temporary side conversation in the right sidebar | 0.1.0 | 11 |

All packages: **213 zero-dependency checks**; no build step, no runtime npm dependencies.

## Agent install prompt

Send an agent the repository URL and the task below to fetch every plugin in one go:

```text
Clone https://github.com/tzhaos/dsh-plugins with submodules:

git clone --recurse-submodules https://github.com/tzhaos/dsh-plugins.git
cd dsh-plugins
node scripts/check-all.mjs
node scripts/install-all.mjs

Then fully quit DeepSeek Harness and start it again.
```

If the repository was cloned without submodules:

```powershell
git submodule update --init --recursive
```

## Quick start

### Install everything

Clone from GitHub:

```powershell
git clone --recurse-submodules https://github.com/tzhaos/dsh-plugins.git
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

`target` must be absolute. All twelve targets:

```text
<monorepo>/packages/dsh-sidebar-sections
<monorepo>/packages/dsh-file-link-actions
<monorepo>/packages/dsh-composer-history
<monorepo>/packages/dsh-hover-polish
<monorepo>/packages/dsh-continue
<monorepo>/packages/dsh-queue-withdraw
<monorepo>/packages/dsh-tab-middle-click
<monorepo>/packages/dsh-quick-fork
<monorepo>/packages/dsh-long-paste
<monorepo>/packages/dsh-sidebar-file-drop
<monorepo>/packages/dsh-nav-back-forward
<monorepo>/packages/dsh-left-rail
```

### Install one package with the `dsh plugin` CLI

`dsh plugin` forwards to pnpm, so it **can** install one local package:

```powershell
git clone --recurse-submodules https://github.com/tzhaos/dsh-plugins.git
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

The script checks the working tree, runs `git pull --ff-only`, syncs and initializes submodules, then runs `install-all.mjs`. Options:

```powershell
node scripts/update-all.mjs --dry-run   # print the plan only
node scripts/update-all.mjs --no-pull   # sources already updated; only re-link
```

Manual equivalent:

```powershell
git status --short          # make sure there are no local changes to lose
git pull --ff-only
git submodule update --init --recursive
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

[![version](https://img.shields.io/badge/version-2.4.0-blue)](https://github.com/tzhaos/dsh-sidebar-sections)
[![checks](https://img.shields.io/badge/checks-68-brightgreen)](https://github.com/tzhaos/dsh-sidebar-sections/blob/main/scripts/check.mjs)

Turns the sidebar into four first-class sections: **Pinned / Projects / Recent / Archived**.

![dsh-sidebar-sections 2.3.0: four sidebar sections, section menu and project menu](https://raw.githubusercontent.com/tzhaos/dsh-sidebar-sections/main/docs/screenshot.png)

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

[Docs](https://github.com/tzhaos/dsh-sidebar-sections/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-sidebar-sections#readme)

---

### dsh-file-link-actions

[![version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/tzhaos/dsh-file-link-actions)
[![checks](https://img.shields.io/badge/checks-20-brightgreen)](https://github.com/tzhaos/dsh-file-link-actions/blob/main/scripts/check.mjs)

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

[Docs](https://github.com/tzhaos/dsh-file-link-actions/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-file-link-actions#readme)

---

### dsh-composer-history

[![version](https://img.shields.io/badge/version-1.2.0-blue)](https://github.com/tzhaos/dsh-composer-history)
[![checks](https://img.shields.io/badge/checks-29-brightgreen)](https://github.com/tzhaos/dsh-composer-history/blob/main/scripts/check.mjs)

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

[Docs](https://github.com/tzhaos/dsh-composer-history/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-composer-history#readme)

---

### dsh-hover-polish

[![version](https://img.shields.io/badge/version-1.0.11-blue)](https://github.com/tzhaos/dsh-hover-polish)
[![checks](https://img.shields.io/badge/checks-34-brightgreen)](https://github.com/tzhaos/dsh-hover-polish/blob/main/scripts/check.mjs)

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

[Docs](https://github.com/tzhaos/dsh-hover-polish/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-hover-polish#readme)

---

### dsh-continue

[![version](https://img.shields.io/badge/version-1.1.1-blue)](https://github.com/tzhaos/dsh-continue)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](https://github.com/tzhaos/dsh-continue/blob/main/scripts/check.mjs)

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

[Docs](https://github.com/tzhaos/dsh-continue/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-continue#readme)

---

### dsh-queue-withdraw

[![version](https://img.shields.io/badge/version-1.3.0-blue)](https://github.com/tzhaos/dsh-queue-withdraw)
[![checks](https://img.shields.io/badge/checks-20-brightgreen)](https://github.com/tzhaos/dsh-queue-withdraw/blob/main/scripts/check.mjs)

**Edit-by-withdraw and drag reordering for queued messages.**

- The Host edit icon always withdraws the whole message (text + attachments) into the composer
- A leading drag handle reorders pending messages; the Host applies `Inbox.splice()` atomically
- Text appends to the existing draft instead of overwriting it
- Image attachments can be restored
- File attachments are cached in browser IndexedDB when selected and re-registered as draft files on
  withdraw
- Messages with attachment blocks are editable: the Host edit action is enabled and redirected to
  withdraw the whole message into the composer
- Removes the queue item through public `Session.updateQueue(remove)`
- On rejection the previous draft is restored and the message stays queued

**Limitations:** only files selected after this plugin loaded are cached; pre-existing queued files
have no cache. Clearing site data, private browsing, an IndexedDB failure or a cache older than 24
hours can make a file unrestorable. Cache matching uses `name + size`.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-queue-withdraw")
```

[Docs](https://github.com/tzhaos/dsh-queue-withdraw/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-queue-withdraw#readme)

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

[Docs](https://github.com/tzhaos/dsh-tab-middle-click/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-tab-middle-click#readme)

---

### dsh-quick-fork

Select text in a conversation, click **Fork**, and open a temporary side conversation in the right sidebar.

- a **Fork** action appears above the selection
- creates a child Session through `sessions.fork` and opens a native right-sidebar tab
- the panel shows the quote, transcript and composer with send/stop
- closing the tab or the app removes it from view
- the Fork action is hidden inside the side panel to prevent recursion

**Version:** 0.1.0 — a compact side chat, not a full replica of the main conversation.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-quick-fork")
```

[Docs](https://github.com/tzhaos/dsh-quick-fork/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-quick-fork#readme)

---

### dsh-long-paste

Very long plain-text pastes become a `.txt` attachment instead of filling the composer.

- Intercepts composer plain-text paste at or above 2,000 characters
- Creates a `Pasted text (N chars) N.txt` file through the conversation draft registry
- DSH uploads, displays and sends the attachment normally
- The attachment card offers **Show in text field**: remove it and put the full text back into the composer
- Short text, image/file paste, queue editor and other conversations are left alone

**Limitations:** the model receives a file attachment rather than inline text; the threshold is fixed
at 2,000 characters.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-long-paste")
```

[Docs](https://github.com/tzhaos/dsh-long-paste/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-long-paste#readme)

---

### dsh-sidebar-file-drop

Drag files from a sidebar file tree into the composer as file references.

- Path-bearing sidebar file rows become draggable
- Dropping on the current composer inserts a file-reference chip
- Paths are converted to workspace-relative paths when possible
- On Desktop, `__DSH_DESKTOP_FILE_PATH__` is bridged to the composer's `__DSH_HOST_PATHS__`, so non-image files can become `@path` references instead of uploads
- Native image drags keep DSH's upload path

**Limitations:** the row must expose an absolute path (`title` / `aria-label` / `data-path`); the
result is a reference, not an uploaded copy.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-sidebar-file-drop")
```

[Docs](https://github.com/tzhaos/dsh-sidebar-file-drop/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-sidebar-file-drop#readme)

---

### dsh-nav-back-forward

**Back / Forward** controls for Session navigation pinned to the window top-left corner.

- Records the main view's Session switches
- Back/Forward calls `uiWorkspace.openSession()`
- Buttons disable when there is nowhere to go
- `Alt+Left` / `Alt+Right` shortcuts
- A new external navigation truncates the forward branch

**Limitations:** Sessions only; right-sidebar tabs, file tabs and scroll positions are not tracked.
History restarts from the current Session after a refresh.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-nav-back-forward")
```

[Docs](https://github.com/tzhaos/dsh-nav-back-forward/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-nav-back-forward#readme)

---

### dsh-left-rail

A Codex-style icon rail left of the existing sidebar.

- a fixed 46px rail at the far left; `#root` shifts right
- icon order: Conversations, Plugins, Automation, Settings
- Plugins/Automation switch panels through `ctx.layout.selectPanel()`
- unavailable panels are disabled
- Settings opens an account menu with avatar/account, Settings, Feedback and Log out

**Limitations:** Automation requires a registered `schedules` main panel; Settings depends on the
host button's aria-label text.

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-left-rail")
```

[Docs](https://github.com/tzhaos/dsh-left-rail/blob/main/README.en.md) · [中文](https://github.com/tzhaos/dsh-left-rail#readme)

---

## Repository layout

```text
.
├── packages/          # twelve complete DSH bundles
├── scripts/
│   ├── check-all.mjs
│   └── install-all.mjs
├── .github/workflows/check.yml
├── README.md / README.en.md
└── CHANGELOG.md
```

Directories under `packages/` are Git submodules pointing at independent repositories. The main
repository stores only the submodule pins, install scripts and shared documentation. Each package
contains `package.json`, `cordis.patch.yml`, a Host `index.js`, browser `client.js`, locale files,
READMEs, CHANGELOG and zero-dependency tests.

Packages are separate so they can be installed, rolled back and debugged independently. The
monorepo only unifies Git, CI and install scripts.

## Verification

```sh
node scripts/check-all.mjs
```

```text
all packages passed: 8 packages, 213 checks
```

| Package | Checks |
|---|---|
| `dsh-sidebar-sections` | 68 |
| `dsh-file-link-actions` | 20 |
| `dsh-composer-history` | 29 |
| `dsh-hover-polish` | 34 |
| `dsh-continue` | 19 |
| `dsh-queue-withdraw` | 22 |
| `dsh-tab-middle-click` | 13 |
| `dsh-long-paste` | 15 |
| `dsh-sidebar-file-drop` | 15 |
| `dsh-nav-back-forward` | 11 |
| `dsh-left-rail` | 25 |
| `dsh-quick-fork` | 11 |

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

This repository once consolidated the standalone plugins, then split them back into independent
repositories referenced as Git submodules; see [MIGRATION.md](MIGRATION.md).

[MIT](LICENSE). Each package also includes a LICENSE copy.
