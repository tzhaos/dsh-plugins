# dsh-composer-history

[简体中文](README.md) | English

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web client plugin that adds a
searchable prompt-history palette and quick recall to the conversation composer.

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)
![Checks](https://img.shields.io/badge/checks-29-brightgreen)

## Why

Long conversations make it hard to reuse an earlier prompt: you scroll back, copy the message, and
paste it again. DSH has no composer history and no "recall previous prompt" shortcut.

This plugin adds a clock button to the composer's tool row. Open it to browse the current
conversation's prompt history; more directly, press `↑` in an empty composer and the previous prompt
is inserted immediately.

## Features

- **Prompt-history palette** — real user prompts from the current conversation, newest first
- **Search** — filter by keyword to recover an older prompt
- **Recall directly into the composer** — press `↑` in an empty composer to insert the previous prompt; keep pressing `↑` to go older, and `↓` to move back toward the draft
- **Full history palette** — click the clock button in the composer tool row, or press `Ctrl/Cmd + ↑`, to search all prompts
- **Keyboard control** — `↑` / `↓` select, `Enter` inserts, `Esc` closes
- **No Host mutation** — reads the browser-side event window and writes the chosen text back to the
  composer draft only
- **Clear and manage** — the palette footer can clear the current conversation; Settings adds a
  Prompt history tab to view, delete one record or clear all plugin records
- Bilingual Chinese and English UI

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
   New-Item -ItemType Junction -Path "$profile\node_modules\dsh-composer-history" `
            -Target "<absolute path to this directory>"
   ```

2. Add the `link:` dependency and append the package to `dsh.profile.bundles` in the profile's
   `package.json`. Only the ordered bundle list triggers a live recomposition.

### Requirements

- DeepSeek Harness `0.2.1-rc.2` (Web or Desktop Web surface)
- No build step and no runtime dependencies

## Usage

**Direct recall**: leave the composer empty and press `↑` to insert the newest prompt. Keep pressing `↑` to walk older; press `↓` to walk back toward newer prompts and finally restore the original empty draft.

**Open the palette**: click the clock button in the composer tool row, or press `Ctrl/Cmd + ↑`. Search, then click a prompt or select with `↑` / `↓` and press `Enter`.

**Clear history**: use **Clear** in the palette footer and confirm. It hides older prompts for the
current conversation; Host messages are not deleted.

**Manage history**: Settings → Plugins → Prompt history. The page lists prompts recorded by the
plugin, lets you expand full text, delete one record or clear everything.

## How it works

The plugin registers in the `conversation.input.left` slot and uses the session-scoped input shell to
read and write the draft:

1. read `user/message` events from the current `session.eventSource` window and keep only events
   whose `source.kind === 'user'`;
2. join the text blocks into a prompt, newest first;
3. on an empty draft, `↑` recalls the newest prompt and advances through older ones, while `↓` walks back and finally restores the original draft; the palette writes a selection through `inputActions.setDraft` (never submits it);
4. render the palette in a portal using only `--dsw-*` theme tokens;
5. viewing history refreshes the plugin's browser-local record cache; Settings reads that cache.
   Delete and clear use local tombstones and a per-session/global time cutoff, so Session logs are
   never modified.

State lives in `localStorage` under `dsh.composerHistory.managedSettings` (max 500 records and 1000
hidden keys). Clear-all sets a global time cutoff, so only prompts older than the cutoff are hidden;
new prompts are still recorded.

## Known limitations

- History comes from the loaded event window; a very long conversation may not have the oldest
  events in that window
- Text only: attachments, images and file references are not captured
- Duplicate prompts may appear because they were really sent by the user
- Delete and clear only affect browser-local plugin records, never Session messages; state is not
  synced across devices or preserved after clearing browser data
- Settings can only manage prompts the plugin has recorded in this browser; prompts from
  conversations never opened here enter the list after their palette is opened
- DSH client APIs are still pre-stable; upgrades may require a compatibility update

## Development and testing

```sh
node scripts/check.mjs
```

The zero-dependency suite covers the manifest, bundle patch, locale, style tokens, history
extraction and filtering, direct recall/cycling, trigger/palette interaction, Escape/outside-click closing
and listener cleanup across 29 checks.

## License

[MIT](LICENSE)
