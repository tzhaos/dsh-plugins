/**
 * Tab Middle Click — browser half of `dsh-tab-middle-click`.
 *
 * DSH tabs already have a close control and a keyboard shortcut. Middle-click
 * is not bound in the shipped client. This plugin listens at the document
 * level and, for a middle-click inside a dock tab, clicks that tab's existing
 * close control. It never removes tabs itself and never changes session data.
 *
 * @module dsh-tab-middle-click/client
 */

window.__ModuleLoader__.load({
  id: 'dsh-tab-middle-click',
  factory(require) {
    const React = require('react')
    const { useEffect } = React
    const h = React.createElement

    /** Labels a close control may carry in either shipped locale. */
    const CLOSE_LABEL = /关闭|close|关闭标签/i

    /**
     * Find the tab element containing an event target.
     * @param {unknown} target - composed-path node or event target.
     * @returns {Element|null} tab element.
     */
    function tabFrom(target) {
      if (target === null || target === undefined || typeof target !== 'object') return null
      if (typeof target.closest !== 'function') return null
      return target.closest('[data-dockkit-tab], [data-sidebar-right-tab]') ?? null
    }

    /**
     * Find the close control already rendered by DockKit inside one tab.
     * @param {Element} tab - dock tab element.
     * @returns {Element|null} close control.
     */
    function closeControlOf(tab) {
      if (typeof tab.querySelectorAll !== 'function') return null
      for (const node of tab.querySelectorAll('button, [role="button"]')) {
        if (node === tab) continue
        if (node.hasAttribute?.('data-dockkit-close') === true || node.hasAttribute?.('data-close') === true) return node
        const label = [
          node.getAttribute?.('aria-label'),
          node.getAttribute?.('title'),
          node.textContent,
        ].filter((value) => typeof value === 'string').join(' ')
        if (CLOSE_LABEL.test(label)) return node
      }
      const classMatched = tab.querySelector?.('[class*="close" i]')
      if (classMatched !== null && classMatched !== undefined && classMatched !== tab) return classMatched
      return null
    }

    /** @param {Event} event - auxclick/mousedown event. @returns {Element|null} tab. */
    function tabFromEvent(event) {
      const path = typeof event.composedPath === 'function' ? event.composedPath() : []
      for (const node of path) {
        const tab = tabFrom(node)
        if (tab !== null) return tab
      }
      return tabFrom(event.target)
    }

    /**
     * Close the middle-clicked tab through its existing close control.
     * @param {MouseEvent} event - auxclick event.
     */
    function onAuxClick(event) {
      if (event.button !== 1) return
      const tab = tabFromEvent(event)
      if (tab === null) return
      const close = closeControlOf(tab)
      if (close === null || typeof close.click !== 'function') return
      event.preventDefault?.()
      event.stopPropagation?.()
      close.click()
    }

    /** Prevent the browser's middle-click autoscroll while over a tab. */
    function onMouseDown(event) {
      if (event.button !== 1) return
      if (tabFromEvent(event) !== null) event.preventDefault?.()
    }

    /**
     * Global event layer. Renders nothing; attaches only document listeners.
     * @returns {null} no React output.
     */
    function TabMiddleClickLayer() {
      useEffect(() => {
        document.addEventListener('auxclick', onAuxClick, true)
        document.addEventListener('mousedown', onMouseDown, true)
        return () => {
          document.removeEventListener('auxclick', onAuxClick, true)
          document.removeEventListener('mousedown', onMouseDown, true)
        }
      }, [])
      return null
    }

    /** Register the global layer. */
    function apply(ctx) {
      ctx.effect(() => {
        const dispose = ctx.slots.register(
          { name: 'shell.overlay', id: 'tab-middle-click.overlay' },
          TabMiddleClickLayer,
        )
        return () => dispose?.()
      })
    }

    return {
      inject: ['slots'],
      apply,
    }
  },
})
