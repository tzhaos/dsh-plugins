# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-18

### Added

- Context menu on conversation file links:
  - open with the default application;
  - reveal the file in the OS file manager;
  - copy the resolved absolute path.
- Relative links resolve against the owning conversation workspace before calling the Host.
- Localized Chinese and English copy.
- Zero-dependency verification suite (20 checks).

### Verification

- Built against DeepSeek Harness `0.2.1-rc.2`; client APIs remain pre-stable.
- Verified in a live Desktop profile with a relative file link: the context menu opened, the default
  application opened the document, and the file manager revealed its containing folder.
