# dsh-tab-middle-click

[简体中文](README.md) | English

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web client plugin that closes a
sidebar/dock tab with a middle-click.

## Why

DSH tabs already have a close control and a keyboard close path, but the middle mouse button is not
bound. People used to browser tabs naturally try a middle-click, and nothing happens.

This plugin does one thing: it finds the close control DSH already renders inside the tab and clicks
it for the user. It never removes tabs itself, changes layouts, or touches session data.

## Behaviour

- handles only `[data-dockkit-tab]` / `[data-sidebar-right-tab]` elements
- triggers on middle-click (`auxclick button === 1`)
- closes through the tab's existing close control, preserving DSH's close logic
- prevents middle-click autoscroll while over a tab
- leaves tabs without a close control alone
- ignores left/right clicks and ordinary clicks

## Implementation

The plugin registers an empty global layer in `shell.overlay`:

1. listens for document-level `auxclick` and `mousedown`;
2. walks from the event target to the nearest dock tab;
3. finds a control inside it with `data-dockkit-close`, `data-close`, a close aria-label/title, or a
   close class;
4. calls that control's `click()`, so DSH's own close flow runs.

## Install

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-tab-middle-click")
```

Or install the whole monorepo:

```powershell
node scripts/install-all.mjs
```

Fully quit and relaunch DSH after installing.

## Known limitations

- depends on DockKit's `data-dockkit-tab` and the close control remaining inside the tab
- if DSH moves the close control outside the tab or replaces it with a keyboard-only action, this
  plugin needs an update
- adds middle-click only; no new keyboard shortcut

## Development and tests

```sh
node scripts/check.mjs
```

The zero-dependency suite covers manifest/patch/locale/icon, overlay registration, middle-click
closing, non-middle clicks, missing-close protection, autoscroll prevention and listener cleanup —
13 checks.

## License

[MIT](LICENSE)
