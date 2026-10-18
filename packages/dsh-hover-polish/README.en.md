# dsh-hover-polish

[简体中文](README.md) | English

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web client plugin that adds
unified, Codex-style hover feedback and tooltips to buttons across the interface.

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/version-1.0.11-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)
![Checks](https://img.shields.io/badge/checks-34-brightgreen)

## Why

Hover coverage in DSH is uneven: some controls only have the browser's native `title` bubble, some
icon buttons have no background feedback, and some only have a bare color change. Codex keeps hover
consistent: a sensible delay, one bubble style, clear shortcuts, and predictable feedback on icon
buttons.

`dsh-hover-polish` only fills that interaction layer; it does not replace any Host component.

## Features

- **Native title upgrade** — icon-only controls with `title` no longer show the OS bubble; a
  Codex-style tooltip takes over while hovered
- **Icon-only or explanatory bubbles** — labeled controls skip the bubble unless a real action
  explanation exists; the composer send/queue-send control is skipped entirely
- **Explanatory copy** — model/reasoning, permission mode and add/file entry points describe the
  action instead of repeating their label
- **Shortcut dedupe** — repeated adjacent Host keycaps (for example `Esc Esc`) render once
- **Top-first placement** — the bubble sits above the control unless the top edge cannot fit
- **Icon hover coverage** — icon buttons with transparent resting backgrounds get the shared hover
  background and a short transition
- **One bubble style** — dark rounded surface, compact padding, shortcut keycaps, theme tokens and a
  light entrance animation
- **Every tooltip horizontally centered** — Host tooltips that were side/end-aligned are re-anchored to
  the control center and clamped inside the viewport
- **Tab hover** — file, conversation and settings tabs get explicit hover feedback; selected tabs use
  a ring instead of replacing their selected fill
- **Full tab-title bubble** — truncated file tabs reveal their full title/path instead of relying on the
  browser-native tooltip
- **Shared type scale** — tooltips and tabs use 12/13 px, weight 500 and 8 px corners
- **Shortcut display** — reads `aria-keyshortcuts` / `data-shortcut`, e.g. `Ctrl+Shift+M`
- **Host-tooltip aware** — yields when a Host Tooltip is already visible, so bubbles never duplicate
- **Keyboard reachable** — `focusin` shows the same tip; `Esc`, scrolling and focus loss dismiss it
- No Host data mutation and no new backend endpoint

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
   New-Item -ItemType Junction -Path "$profile\node_modules\dsh-hover-polish" `
            -Target "<absolute path to this directory>"
   ```

2. Add the `link:` dependency and append the package to `dsh.profile.bundles` in the profile's
   `package.json`. Only the ordered bundle list triggers a live recomposition.

### Requirements

- DeepSeek Harness `0.2.1-rc.2` (Web or Desktop Web surface)
- No build step and no runtime dependencies

## How it works

The plugin registers a global hover layer in `shell.overlay` and listens for document-level
`pointerover` / `pointerout` / `focusin` / `focusout` / `scroll` / `keydown`:

1. resolve the nearest interactive `button`, skipping menus, disabled controls and elements with a
   custom skip marker;
2. read the label from `title`, `aria-label` or `aria-labelledby`; for a `title`-sourced button the
   attribute is temporarily removed so the plugin owns the visual tip, then restored on leave;
3. mark icon-only buttons with a transparent resting background with `data-dshhp-hover="icon"` so
   CSS applies the shared hover token;
4. after 650 ms, check whether the Host already shows `[role="tooltip"]`; only render the custom
   bubble when it does not;
5. render the bubble through a portal using `--dsw-*` theme tokens; `Esc`, scroll and focus loss
   dismiss it.

Host tooltips also get a small consistency pass: the same corner radius and elevation as the plugin
bubble.

## Known limitations

- Only buttons with `title` / `aria-label` / `aria-labelledby` are handled; plain text buttons get no
  extra tooltip
- Existing Host Tooltip content, shortcuts and behavior remain Host-owned and are not rebuilt
- Menu items, dropdown options and controls with `data-dshhp-skip` are skipped
- The custom bubble waits 650 ms so a Host tooltip can win; adjust the constant if that feels slow
- DSH client APIs are still pre-stable; upgrades may require a compatibility update

## Development and testing

```sh
node scripts/check.mjs
```

The zero-dependency suite covers the manifest, bundle patch, locale, style tokens, native-title
takeover/restore, Host-tooltip yielding, aria-labels, shortcuts, icon hover surface, menu/disabled
skips, focus, scroll/Escape dismissal and listener registration across 34 checks.

## License

[MIT](LICENSE)
