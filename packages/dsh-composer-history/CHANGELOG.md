# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-10-18

### Added

- Clear action in the history palette footer. It hides all previously recorded prompts for the
  current conversation and persists a per-conversation time cutoff.
- Prompt history settings tab. It lists the records the plugin has collected in this browser, supports
  expanding full text, deleting one record, and clearing all plugin records.
- A bounded browser-local record cache (500 records) and managed state under
  `dsh.composerHistory.managedSettings`, with 1000 hidden keys.

### Changed

- Host messages and Session logs are still never modified; delete and clear only affect this plugin's
  browser-local view and record cache.
- Clear-all uses a global timestamp cutoff so existing history stays hidden while new prompts are
  recorded normally.

### Verified

- `node scripts/check.mjs`: 29 checks green, including panel clear confirmation, settings list,
  individual delete, clear-all, expandable records, and the existing suite.

## [1.1.0] - 2026-10-18

### Changed

- `↑` on an empty composer now inserts the previous prompt directly into the composer instead of
  opening the palette. Repeated `↑` presses walk older prompts; `↓` walks back toward the newest
  prompt and finally restores the original draft. Editing a recalled prompt cancels the cycle
  instead of overwriting the edit.
- The clock trigger and `Ctrl/Cmd + ↑` still open the searchable history palette.

### Verified

- `node scripts/check.mjs`: 26 checks green, including direct recall, repeated `↑`, reverse `↓`,
  edit cancellation, empty history and the existing palette interactions.
- Verified in a live Desktop profile: `↑` inserted a previous prompt into the empty composer without
  sending it or opening a panel.

## [1.0.0] - 2026-10-18

### Added

- Searchable prompt-history palette for the conversation composer.
- Clock trigger in the composer tool row.
- Quick recall: `↑` on an empty composer opened the palette; `Ctrl/Cmd + ↑` opened it from any
  draft.
- Keyboard selection and search, with Chinese and English copy.
- Zero-dependency verification suite (22 checks).

### Verification

- Built against DeepSeek Harness `0.2.1-rc.2`; client APIs remain pre-stable.
- Verified in a live Desktop profile: the clock trigger opened the palette and choosing a prompt
  wrote it back into the draft without sending.
