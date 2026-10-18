# dsh-queue-withdraw

[简体中文](README.md) | English

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web client plugin that adds a
**Withdraw to input** action to queued composer messages, alongside the shipped edit, delete and
steer actions.

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/version-1.1.1-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)
![Checks](https://img.shields.io/badge/checks-17-brightgreen)

## Why

DSH's queue rows can be edited, removed or steered. If you only want the message back so you can
change it, removing loses the content and editing is less direct than having it in the composer.

`dsh-queue-withdraw` appends one compact action to each rendered queue row:

- moves the queued text back into the composer draft
- removes the item through `Session.updateQueue(itemId, { kind: 'remove' })`
- appends to an existing draft instead of overwriting it
- restores the previous draft when removal is rejected, leaving the message queued
- supports image attachments: reads their bytes through the Session and rebuilds them as draft
  image files; file attachments still have no public read/restore path and stay disabled

## Behavior

- decorates Host `[data-queue-dock]` rows only; local pending echo rows are ignored
- the action follows the row when the queue is expanded; it is hidden while the queue is collapsed
- QueueDock remains the owner of edit/remove/steer and the queue state
- no decoration when the Session's queue is immutable (for example a non-continuable subagent)

The click flow:

1. read the queued text blocks;
2. append the text to the current draft;
3. rehydrate images through the conversation draft registry and add them to the draft;
4. call the public `session.updateQueue(itemId, { kind: 'remove' })`;
4. on acceptance the row disappears and the restored draft is the feedback, so no persistent
   success notice is shown; on rejection the old draft is restored and an error is shown.

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
   New-Item -ItemType Junction -Path "$profile\node_modules\dsh-queue-withdraw" `
            -Target "<absolute path to this directory>"
   ```

2. Add the `link:` dependency and append the package to `dsh.profile.bundles` in the profile's
   `package.json`. Only the ordered bundle list triggers a live recomposition.

### Requirements

- DeepSeek Harness `0.2.1-rc.2` (Web or Desktop Web surface)
- No build step and no runtime dependencies

## How it works

The plugin registers in the `conversation.input.dock` slot and reads the `next-turn` queue through
`useProjection('inbox')`:

1. a MutationObserver tracks `[data-queue-dock]` rendering and appends one compact action to each
   Host queue row;
2. the action restores text and supported image attachments; file attachments are disabled;
3. on click it writes the text into the session-scoped input shell draft, then calls
   `updateQueue(remove)`;
4. a rejection restores the old draft and reports an error.

No new remote endpoint is added and QueueDock's own edit/remove/steer behavior is unchanged.

## Known limitations

- **File attachments are unsupported**: the Host exposes image reads only, with no file
  attachment download/restore path. Image attachments can be withdrawn
- Image withdrawal relies on the conversation draft-attachment registry (`createDrafts` /
  `addAttachments`); DSH upgrades may require a compatibility update
- The queue must be rendered in the current conversation; expand a collapsed queue to see the action
- Subagent queues that disallow mutation are not decorated
- Text is appended to the draft; images are added as new draft image attachments
- DSH client APIs are pre-stable; the DOM attribute contract may need maintenance after upgrades

## Development and testing

```sh
node scripts/check.mjs
```

The zero-dependency suite covers the manifest, bundle patch, locale, queue text extraction,
successful and rejected withdrawal, draft restoration, image rehydration, file-attachment refusal,
Host queue-row button injection and theme styling across 17 checks.

## License

[MIT](LICENSE)
