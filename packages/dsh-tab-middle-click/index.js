/**
 * Host half of the tab-middle-click bundle.
 *
 * The plugin is pure browser UI: it closes an existing tab by activating the
 * close control DSH already renders inside that tab. The Host process has
 * nothing to install, but this entry exists so the Client module registry
 * discovers the browser bundle from an active Loader row.
 */
export function apply() {}
