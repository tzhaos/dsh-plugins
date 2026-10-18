# Contributing

Thanks for taking the time to improve `dsh-composer-history`.

## Repository scope

This directory is one package inside the `dsh-plugins` monorepo.

- The plugin is a self-contained DSH bundle. The browser half (`client.js`) is a classic script
  loaded through `window.__ModuleLoader__.load`; it may only require modules from DSH's frozen
  platform table.
- Repository-level CI, editor settings and installation scripts live at the monorepo root. This
  package owns its manifest, bundle, tests, READMEs, CHANGELOG and this file.

## Ground rules

- **No build step and no runtime dependencies.**
- **Reuse `ui-primitives`.** Use the Host's tooltip, icons and menu controls; do not hand-copy
  artwork.
- **Theme tokens only.** Use `--dsw-*` variables; never hard-code colors.
- **Both languages stay complete.** `zh` and `en` dictionaries must have identical key sets.
- **Do not mutate Host data.** The only write is the composer draft through `inputActions.setDraft`.

## Verification

```sh
node scripts/check.mjs
```

The monorepo CI runs `node scripts/check-all.mjs`, which includes this suite.

## Documentation and commits

Keep `README.md` (Simplified Chinese, primary) and `README.en.md` in sync, and record user-visible
changes in `CHANGELOG.md`. Use Conventional Commits, e.g.:

```
feat: add prompt history palette to the composer
```
