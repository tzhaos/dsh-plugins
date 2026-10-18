/**
 * Queue Withdraw — browser half of the `dsh-queue-withdraw` bundle.
 *
 * DSH's composer queue can edit, remove or steer a pending message. This plugin
 * adds the missing fourth verb: withdraw one queued message back into the
 * composer draft and remove it from the queue. The host QueueDock stays the
 * owner of the queue; the plugin only decorates each rendered row with one
 * compact action and submits the normal `updateQueue({ kind: 'remove' })`
 * request plus a draft write.
 *
 * @module dsh-queue-withdraw/client
 */

window.__ModuleLoader__.load({
  id: 'dsh-queue-withdraw',
  factory(require) {
    const React = require('react')
    const { useEffect, useMemo, useRef } = React
    const h = React.createElement

    /** Locale namespace owned by this plugin. */
    const NS = 'queueWithdraw'

    const zh = {
      'button.label': '撤回到输入栏',
      'button.tooltip': '把这条排队消息撤回输入栏',
      'button.attachments': '文件附件暂不支持撤回；图片附件可以',
      'button.empty': '这条排队消息没有可撤回的文本',
      'button.failed': '撤回失败，消息仍在队列中',
    }

    const en = {
      'button.label': 'Withdraw to input',
      'button.tooltip': 'Withdraw this queued message back into the composer',
      'button.attachments': 'File attachments cannot be withdrawn yet; images are supported',
      'button.empty': 'This queued message has no text to withdraw',
      'button.failed': 'Withdraw failed; the message is still queued',
    }

    /** Icon used by the injected row action. */
    const WITHDRAW_ICON = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v7M5 6l3 3 3-3"/><path d="M3 12v1.5h10V12"/></svg>'

    /**
     * Join the text blocks of one queue message.
     * @param {unknown} content - queue message content blocks.
     * @returns {string} joined text.
     */
    function textOfContent(content) {
      if (!Array.isArray(content)) return ''
      let text = ''
      for (const block of content) {
        if (block !== null && typeof block === 'object' && block.type === 'text' && typeof block.text === 'string') {
          text += block.text
        }
      }
      return text.trim()
    }

    /**
     * Classify one queue message for withdrawal. Images can be rehydrated into
     * browser draft files through the conversation draft registry; file
     * attachments have no public bytes/restore path and stay unsupported.
     * @param {unknown} content - queue message content blocks.
     * @returns {{text: string, images: Array<object>, unsupported: boolean}} plan.
     */
    function withdrawPlan(content) {
      const text = textOfContent(content)
      const images = []
      let unsupported = false
      if (!Array.isArray(content)) return { text, images, unsupported: true }
      for (const block of content) {
        if (block === null || typeof block !== 'object') {
          unsupported = true
          continue
        }
        if (block.type === 'text') continue
        if (block.type === 'image' && typeof block.attachment?.attachmentId === 'string') {
          images.push(block.attachment)
          continue
        }
        unsupported = true
      }
      return { text, images, unsupported }
    }

    /**
     * Find the QueueDock roots owned by one conversation.
     * @param {string} sessionId - conversation id.
     * @returns {Element[]} queue dock roots.
     */
    function docksOf(sessionId) {
      if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return []
      const all = [...document.querySelectorAll('[data-queue-dock]')]
      const docks = []
      const unowned = []
      for (const dock of all) {
        const owner = dock.closest?.('[data-conversation-session]')
        if (owner === null || owner === undefined) {
          unowned.push(dock)
          continue
        }
        if (owner.getAttribute?.('data-conversation-session') === sessionId) docks.push(dock)
      }
      // A single unscoped dock can only belong to this conversation. With more
      // than one, guessing risks decorating another Session's composer.
      return docks.length > 0 ? docks : (all.length === 1 ? unowned : [])
    }

    /**
     * The queue project's host rows, excluding local pending echoes.
     * @param {Element} dock - queue dock root.
     * @returns {Element[]} rows that correspond to host queue entries.
     */
    function hostRowsOf(dock) {
      if (typeof dock.querySelectorAll !== 'function') return []
      return [...dock.querySelectorAll('li')].filter((row) => row.hasAttribute?.('data-submission-echo') !== true)
    }

    /**
     * Appends one action directly to the host row's action cluster.
     * @param {Element} row - host queue row.
     * @returns {Element} the parent that received the action.
     */
    function actionParentOf(row) {
      if (typeof row.querySelectorAll !== 'function') return row
      const buttons = [...row.querySelectorAll('button[aria-label]')]
      const parent = buttons.at(-1)?.parentElement
      return parent === null || parent === undefined ? row : parent
    }

    /**
     * The global decoration layer. It renders no visible React tree; it
     * reconciles one injected button with each host queue row.
     * @param {object} props - session id, standard hooks, injected actions and translator.
     * @returns {null} no React output.
     */
    function QueueWithdraw({ sessionId, useSession, useProjection, actions, t }) {
      const inbox = useProjection('inbox')
      const queue = useMemo(() => (Array.isArray(inbox?.['next-turn']) ? inbox['next-turn'] : []), [inbox])
      const queueMutable = useSession((snapshot) => snapshot.subagent === null
        || snapshot.subagent?.address?.mode === 'continuable')
      const queueRef = useRef(queue)
      const mutableRef = useRef(queueMutable)
      const actionsRef = useRef(actions)
      const tRef = useRef(t)
      queueRef.current = queue
      mutableRef.current = queueMutable
      actionsRef.current = actions
      tRef.current = t

      useEffect(() => {
        if (typeof document === 'undefined' || typeof MutationObserver !== 'function') return undefined
        const buttonItems = new Map()
        let frame = null
        let disposed = false
        const cancelFrame = () => {
          if (frame === null) return
          if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame)
          else clearTimeout(frame)
          frame = null
        }
        const schedule = () => {
          if (disposed || frame !== null) return
          if (typeof requestAnimationFrame === 'function') {
            frame = requestAnimationFrame(() => { frame = null; sync() })
          } else {
            frame = setTimeout(() => { frame = null; sync() }, 0)
          }
        }
        const removeButton = (button) => {
          buttonItems.delete(button)
          button.remove?.()
        }
        const syncButton = (button, item, text) => {
          buttonItems.set(button, item)
          button.dataset.dshItemId = String(item.id)
          const plan = withdrawPlan(item.content)
          const usable = !plan.unsupported && (plan.text !== '' || plan.images.length > 0)
          button.disabled = !usable
          button.title = !usable
            ? (plan.unsupported ? tRef.current('button.attachments') : tRef.current('button.empty'))
            : tRef.current('button.tooltip')
          button.setAttribute?.('aria-label', button.title)
        }
        const createButton = (row, item, text) => {
          const button = document.createElement('button')
          button.type = 'button'
          button.className = 'dshqw-withdraw'
          button.setAttribute('data-dsh-queue-withdraw', '')
          button.innerHTML = WITHDRAW_ICON
          syncButton(button, item, text)
          button.addEventListener('click', async (event) => {
            event.preventDefault?.()
            event.stopPropagation?.()
            if (button.disabled) return
            const itemId = button.dataset.dshItemId
            const current = queueRef.current.find((candidate) => String(candidate.id) === itemId)
              ?? buttonItems.get(button)
            if (current === undefined) return
            button.disabled = true
            const accepted = await actionsRef.current.withdraw(
              current,
              tRef.current('button.empty'),
              tRef.current('button.failed'),
              tRef.current('button.attachments'),
            )
            if (accepted !== true) button.disabled = false
          })
          actionParentOf(row).append?.(button)
          return button
        }
        const sync = () => {
          if (disposed) return
          const queueNow = mutableRef.current === true ? queueRef.current : []
          const docks = docksOf(sessionId)
          for (const dock of docks) {
            const rows = hostRowsOf(dock)
            for (let index = 0; index < rows.length; index += 1) {
              const item = queueNow[index]
              if (item === undefined) continue
              const text = textOfContent(item.content)
              let button = rows[index].querySelector?.('[data-dsh-queue-withdraw]')
              if (button === null || button === undefined) button = createButton(rows[index], item, text)
              else syncButton(button, item, text)
            }
          }
          for (const button of [...buttonItems.keys()]) {
            if (button.isConnected === false) {
              buttonItems.delete(button)
              continue
            }
            const owned = docks.some((dock) => dock.contains?.(button))
            if (!owned) removeButton(button)
          }
        }
        const observer = new MutationObserver(schedule)
        observer.observe(document.body, { childList: true, subtree: true })
        sync()
        return () => {
          disposed = true
          observer.disconnect()
          cancelFrame()
          for (const button of [...buttonItems.keys()]) button.remove?.()
          buttonItems.clear()
        }
      }, [sessionId, queueMutable])

      return null
    }

    /** Presentation only; colors and elevation come from the Host theme. */
    const CSS = `
.dshqw-withdraw {
  box-sizing: border-box;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: var(--dsw-radius-sm);
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
}
.dshqw-withdraw:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dshqw-withdraw:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}
.dshqw-withdraw:disabled {
  cursor: default;
  opacity: .4;
}
`

    /**
     * Register the queue-row decoration.
     * @param {object} ctx - Client root context.
     */
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'queue-withdraw: dictionaries')
      ctx.effect(() => {
        if (typeof document === 'undefined' || typeof document.createElement !== 'function') return () => {}
        const style = document.createElement('style')
        style.dataset.dshPlugin = 'dsh-queue-withdraw'
        style.textContent = CSS
        document.head.appendChild(style)
        return () => { style.remove?.() }
      }, 'queue-withdraw: styles')

      ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
        name: 'conversation.input.dock',
        id: 'queue-withdraw',
        order: 21,
        locale: NS,
        inject: (sessionId) => {
          let conversation
          let shell
          try {
            const scope = ctx.sessions.scope(sessionId)
            conversation = scope?.get('conversation')
            shell = conversation?.input?.for?.(scope)
          } catch {
            conversation = undefined
            shell = undefined
          }
          const notify = (level, text) => {
            try {
              shell?.notify?.(level, text)
            } catch {
              // A disposed scope simply loses the non-critical notice.
            }
          }
          return {
            sessionId,
            actions: {
              /**
               * Move one queued message into the draft and remove it from the
               * Host queue. The draft is written before removal and restored if
               * removal is rejected.
               * @param {object} item - queue item with id and content.
               * @param {string} empty - empty-content notice.
               * @param {string} failure - failure notice.
               * @param {string} attachment - attachment notice.
               * @returns {Promise<boolean>} whether the item was withdrawn.
               */
              withdraw: async (item, empty, failure, attachment) => {
                const plan = withdrawPlan(item?.content)
                if (plan.unsupported) {
                  notify('error', attachment)
                  return false
                }
                if (plan.text === '' && plan.images.length === 0) {
                  notify('error', empty)
                  return false
                }
                const binding = ctx.sessions.binding(sessionId)
                const session = binding?.session
                if (session === undefined || typeof session.updateQueue !== 'function') {
                  notify('error', failure)
                  return false
                }
                let previousDraft = ''
                try {
                  previousDraft = typeof shell?.snapshot?.draft === 'string' ? shell.snapshot.draft : ''
                } catch {
                  previousDraft = ''
                }
                let changedDraft = false
                const addedIds = []
                const releaseAdded = () => {
                  for (const id of addedIds) {
                    try { shell?.actions?.removeAttachment?.(id) } catch { /* best-effort */ }
                    try { conversation?.releaseDraftAttachment?.(id) } catch { /* best-effort */ }
                  }
                }
                const rollback = () => {
                  releaseAdded()
                  if (changedDraft) {
                    try { shell?.actions?.setDraft?.(previousDraft) } catch { /* best-effort restore */ }
                  }
                }
                if (plan.images.length > 0) {
                  try {
                    if (typeof conversation?.createDrafts !== 'function'
                      || typeof shell?.actions?.addAttachments !== 'function'
                      || typeof File !== 'function') return false
                    const files = []
                    for (const image of plan.images) {
                      const result = await session.readAttachment(image.attachmentId)
                      if (result?.ok !== true) throw new Error('image read failed')
                      const mediaType = result.value?.attachment?.mediaType ?? image.mediaType
                      if (typeof mediaType !== 'string' || !mediaType.startsWith('image/')) throw new Error('not an image')
                      const name = result.value?.attachment?.name ?? image.name ?? 'withdrawn-image'
                      files.push(new File([result.value.data], name, { type: mediaType }))
                    }
                    const drafts = conversation.createDrafts(sessionId, files)
                    for (const draft of drafts) {
                      if (draft?.id !== undefined) addedIds.push(draft.id)
                    }
                    if (addedIds.length !== files.length || shell.actions.addAttachments(addedIds) !== true) {
                      throw new Error('attachment draft rejected')
                    }
                  } catch {
                    releaseAdded()
                    notify('error', failure)
                    return false
                  }
                }
                if (plan.text !== '') {
                  try {
                    const nextDraft = previousDraft.trim() === ''
                      ? plan.text
                      : previousDraft.replace(/\s+$/, '') + '\n\n' + plan.text
                    shell?.actions?.setDraft?.(nextDraft)
                    changedDraft = true
                  } catch {
                    rollback()
                    notify('error', failure)
                    return false
                  }
                }
                try {
                  const result = await session.updateQueue(item.id, { kind: 'remove' })
                  if (result?.ok !== true) {
                    rollback()
                    notify('error', failure)
                    return false
                  }
                  // The queue row disappearing and the draft appearing are the
                  // feedback; an info notice would linger in the Host's notice
                  // surface and is unnecessary for a successful withdraw.
                  return true
                } catch {
                  rollback()
                  notify('error', failure)
                  return false
                }
              },
            },
          }
        },
      }, QueueWithdraw))
    }

    return {
      /** Services this Client plugin waits for before applying. */
      inject: ['slots', 'locale', 'sessions'],
      apply,
    }
  },
})
