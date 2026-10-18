# Contributing

Thanks for taking the time to improve `dsh-hover-polish`.

## Repository scope

This directory is one package inside the `dsh-plugins` monorepo.

- The browser half (`client.js`) is a classic script loaded through
  `window.__ModuleLoader__.load`; it may only require modules from DSH's frozen platform table.
- Repository-level CI, editor settings and installation scripts live at the monorepo root. This
  package owns its manifest, bundle, tests, READMEs, CHANGELOG and this file.

## Ground rules

- **No build step and no runtime dependencies.**
- **No Host or app-root replacement.** Work through the documented document-level events and a
  portal; never take over the application shell.
- **Theme tokens only.** Use `--dsw-*` variables; never hard-code colors.
- **Host tooltips win.** If the Host already renders a tooltip, the plugin must not add a duplicate.
- **Restore native attributes.** A `title` removed for the custom bubble must come back on leave and
  on unmount.

## Verification

```sh
node scripts/check.mjs
```

The monorepo CI runs `node scripts/check-all.mjs`, which includes this suite.

## Documentation and commits

Keep `README.md` (Simplified Chinese, primary) and `README.en.md` in sync, and record user-visible
changes in `CHANGELOG.md`. Use Conventional Commits, e.g.:

```
feat: add consistent hover tooltips for icon buttons
```
