# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-18

### Added

- Continue action in the composer's right control cluster when the latest turn reached a terminal
  state (`turn/end`) or stopped with a trailing `turn/start`.
- Visibility guards for running, blank, loading, removed, subagent and pending-submission states.
- One-click queued prompt submission through `Session.prompt()` with a local submission echo.
- Localized button label, tooltip, prompt text and failure message.

### Verified

- `node scripts/check.mjs`: 18 checks green.
- Built against DeepSeek Harness `0.2.1-rc.2`; client APIs remain pre-stable.
