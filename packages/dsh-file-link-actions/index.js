/**
 * Host half of the file-link-actions bundle.
 *
 * The plugin is pure browser UI: it listens to context-menu events on the
 * conversation's rendered file links and forwards native open/reveal gestures
 * to the Session Remote. The Host process has nothing to install, but this
 * entry exists so the Client module registry discovers the browser bundle from
 * an active Loader row.
 */
export function apply() {}
