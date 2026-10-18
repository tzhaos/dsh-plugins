# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.11] - 2026-10-18

### Added

- Tabs now get a dedicated hover bubble even though they have visible text. The tab-specific path
  prefers the `title` attribute (full file path), then `aria-label`, then the visible text, and
  suppresses the native title while hovered.

### Verified

- `node scripts/check.mjs`: 34 checks green, including a truncated text tab revealing its full path.

## [1.0.10] - 2026-10-18

### Fixed

- Clicking a control now dismisses its hover tooltip immediately. Previously a tooltip could remain
  visible after opening a menu because the pointer never left the anchor; `pointerdown` and `click`
  now close the layer and stop host-tooltip centering.

### Verified

- `node scripts/check.mjs`: 33 checks green, including click dismissal and the new listeners.

## [1.0.9] - 2026-10-18

### Fixed

- Repeated adjacent keycaps in a Host tooltip are collapsed to one. The shipped stop tooltip no
  longer shows `Esc Esc`; the custom tooltip applies the same dedupe to ARIA shortcut tokens.

### Verified

- `node scripts/check.mjs`: 32 checks green, including custom and Host keycap dedupe.

## [1.0.8] - 2026-10-18

### Fixed

- Removing the insertion-window marker immediately on pointerleave exposed the Host bubble for one
  frame at its default lower-left position just before the Host removed it. The marker now stays for
  a short 200 ms grace period, so the disappearing bubble cannot flash to the wrong position; a new
  hover cancels the grace timer and keeps the marker set.

### Verified

- `node scripts/check.mjs`: 31 checks green, including delayed marker cleanup.

## [1.0.7] - 2026-10-18

### Fixed

- Host Tooltips no longer paint once at their default lower-left/end position before our centered
  position is applied. While a control hover is active the root carries an insertion-window marker;
  Host bubbles stay hidden until the plugin has positioned them and marked the final bubble ready.
- Leaving the control removes the insertion-window marker immediately.

### Verified

- `node scripts/check.mjs`: 31 checks green, including first-paint readiness and insertion-window
  cleanup.

## [1.0.6] - 2026-10-18

### Added

- Explanatory tooltips for complex labeled controls: model/reasoning selection, permission mode,
  add/file entry points, prompt history, search and generic option menus.
- Explanations come from a localized description instead of repeating the control's visible label.
- Labeled controls without a known explanation still get no custom bubble.

### Verified

- `node scripts/check.mjs`: 30 checks green, including a labeled model selector that receives an
  explanatory tooltip rather than its own text.

## [1.0.5] - 2026-10-18

### Fixed

- Host tooltip detection no longer requires the CSS-module class name to contain the literal word
  `bubble`. Production hashes may be opaque, and the previous check silently disabled centering for
  every Host tooltip. A tooltip now qualifies through its `data-side` attribute plus explicit
  foreign-card exclusions.
- This fixes tooltips such as the sidebar archive action staying at the default `side="bottom"
  align="end"` position instead of being centered above the control.

### Verified

- `node scripts/check.mjs`: 29 checks green; the host-centering regression now uses an opaque
  CSS-module class name.

## [1.0.4] - 2026-10-18

### Added

- Hover feedback for every `[role="tab"]`: file/dockkit tabs, conversation tabs and settings tabs.
- Selected tabs also get a hover ring without replacing their selected fill, so hovering the active tab
  is visibly acknowledged.

### Changed

- The inactive-tab hover now uses a full inset ring plus outline in addition to the hover background;
  the previous effect was too close to the shipped tab hover to notice.

## [1.0.3] - 2026-10-18

### Changed

- Custom tooltips are now limited to icon-only controls. Buttons with a visible text label skip the
  bubble entirely, since repeating their label is noise.
- The composer send/queue-send control is skipped: no custom tooltip and no extra hover surface.
- Bubbles prefer the space above the control and flip below only when the top edge cannot fit.
- Host re-anchoring positions a bubble once and stops, rather than looping against the Host layout.

### Verified

- `node scripts/check.mjs`: 29 checks green (labeled-button skip, send skip, top-first placement,
  foreign-card guard, strict Host-bubble signature, tab hover/type contract).

## [1.0.2] - 2026-10-18

### Fixed

- Do not treat other plugins' hover cards (`role="tooltip"` without the Host
  bubble's `data-side`/`bubble` class) as Host tooltips. The sidebar plugin's hover preview could be pulled to
  the top-left and fought its own positioning, causing visible flicker. Only real Host bubbles
  are centered now; foreign cards are left untouched. Centering is also bounded to a short settling
  window instead of running forever, and legacy `data-side`/`data-align` markers left on foreign
  cards are cleaned up.

### Added

- Right-sidebar document tabs get a clear hover background, label color and 120 ms transition.
- One Codex-like type scale for tooltips and tabs: 12/13 px labels, 500 weight, 8 px corners.

### Verified

- `node scripts/check.mjs`: 29 checks green (foreign-card guard, labeled/send-button skips,
  top-first placement, tab hover/type contract, plus the existing suite).

## [1.0.1] - 2026-10-18

### Fixed

- Re-anchor Host tooltips to the horizontal center of the hovered control. Host bubbles that defaulted
  to the right side or `align="end"` no longer sit off-center; the same center is kept inside the
  viewport near an edge.

### Verified

- `node scripts/check.mjs`: 23 checks green, including the Host-tooltip centering regression.

## [1.0.0] - 2026-10-18

### Added

- Codex-style tooltip layer for buttons that only had a native `title` bubble.
- Custom tooltips for `aria-label` / `aria-labelledby` buttons when the Host has no visible tooltip.
- Shared hover background and transition for transparent icon-only buttons.
- Shortcut keycaps from `aria-keyshortcuts` / `data-shortcut`.
- Keyboard focus support and `Esc` / scroll dismissal.
- Small host-tooltip consistency pass (corner radius and elevation).

### Verified

- Built against DeepSeek Harness `0.2.1-rc.2`; client APIs remain pre-stable.
- Zero-dependency test suite: 22 checks.
