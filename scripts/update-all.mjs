/**
 * Update a GitHub-cloned monorepo and refresh the local DSH profile links.
 *
 * Usage:
 *   node scripts/update-all.mjs             # git pull --ff-only, then install
 *   node scripts/update-all.mjs --no-pull   # only re-link the current checkout
 *   node scripts/update-all.mjs --dry-run   # print the plan, change nothing
 */

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..')
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const noPull = args.includes('--no-pull')

/** Run one command and inherit output. */
function run(command, commandArgs) {
  if (dryRun) {
    console.log(`[dry-run] ${command} ${commandArgs.join(' ')}`)
    return 0
  }
  const result = spawnSync(command, commandArgs, { cwd: ROOT, stdio: 'inherit', shell: false })
  return result.status ?? 1
}

if (!existsSync(resolve(ROOT, '.git'))) {
  console.error(`not a Git checkout: ${ROOT}`)
  process.exit(1)
}

if (!noPull) {
  const status = spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' })
  if (status.status !== 0) {
    console.error('unable to read git status; update manually')
    process.exit(1)
  }
  if ((status.stdout ?? '').trim() !== '') {
    console.error('working tree has local changes; commit/stash them, or rerun with --no-pull')
    process.exit(1)
  }
  if (run('git', ['pull', '--ff-only']) !== 0) {
    console.error('git pull failed; resolve it and rerun, or update manually')
    process.exit(1)
  }
}

if (run(process.execPath, ['scripts/install-all.mjs']) !== 0) {
  console.error('install-all failed')
  process.exit(1)
}

console.log('\nupdate complete: fully quit DSH and start it again to load new client bundles.')
