/**
 * Host half of the composer-history bundle.
 *
 * The plugin is pure browser UI: it reads the client-side Session event window
 * and writes a selected prompt into the composer draft through the scoped input
 * shell. The Host has nothing to install, but this entry exists so the Client
 * module registry discovers the browser bundle from an active Loader row.
 */
export function apply() {}
