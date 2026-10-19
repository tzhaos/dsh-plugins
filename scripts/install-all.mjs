/**
 * Link every package into a DSH profile and add it to the ordered bundle list.
 *
 * This is the development installer (path links). Published users can install
 * individual packages through Plugin Manager instead. Zero dependencies.
 *
 * Usage:
 *   node scripts/install-all.mjs [--profile <profile-dir>] [--dry-run]
 */

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmdirSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..')
const PACKAGES_DIR = join(ROOT, 'packages')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const profileIndex = args.indexOf('--profile')
const profile = profileIndex >= 0 && args[profileIndex + 1] !== undefined
  ? resolve(args[profileIndex + 1])
  : join(homedir(), '.dsh', 'profiles', process.env.DSH_PROFILE ?? 'desktop')

if (!existsSync(join(profile, 'package.json'))) {
  console.error(`profile package.json not found: ${profile}`)
  process.exit(1)
}

const manifestPath = join(profile, 'package.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
manifest.dependencies ??= {}
manifest.dsh ??= {}
manifest.dsh.profile ??= {}
manifest.dsh.profile.bundles ??= []

const packageNames = readdirSync(PACKAGES_DIR)
  .filter((name) => statSync(join(PACKAGES_DIR, name)).isDirectory())
  .filter((name) => existsSync(join(PACKAGES_DIR, name, 'package.json')))
  .sort()

if (packageNames.length === 0) {
  console.error('no packages found; run: git submodule update --init --recursive')
  process.exit(1)
}

const nodeModules = join(profile, 'node_modules')
const packageRoot = resolve(PACKAGES_DIR) + (process.platform === 'win32' ? '\\' : '/')
/** @param {unknown} value @returns {boolean} whether a dependency is a monorepo link. */
function isManagedDependency(value) {
  if (typeof value !== 'string' || !value.startsWith('link:')) return false
  return resolve(value.slice(5)).startsWith(packageRoot)
}

// Deletions must propagate too: drop managed dependencies, junctions and
// bundle rows whose package no longer exists in packages/.
const removed = new Set()
const external = new Set()
for (const [name, value] of Object.entries(manifest.dependencies)) {
  if (isManagedDependency(value) && !packageNames.includes(name)) {
    removed.add(name)
    delete manifest.dependencies[name]
  } else if (!isManagedDependency(value)) {
    external.add(name)
  }
}
if (manifest.dsh?.profile?.bundles !== undefined) {
  manifest.dsh.profile.bundles = manifest.dsh.profile.bundles.filter((name) => {
    if (packageNames.includes(name) || external.has(name)) return true
    if (typeof name === 'string' && name.startsWith('dsh-')) {
      removed.add(name)
      return false
    }
    return true
  })
}
for (const entry of readdirSync(nodeModules)) {
  const link = join(nodeModules, entry)
  try {
    const stat = lstatSync(link)
    if (!stat.isSymbolicLink()) continue
    const target = resolve(readlinkSafe(link) ?? '')
    if (!target.startsWith(packageRoot)) continue
    if (existsSync(join(target, 'package.json'))) continue
    removed.add(entry)
    if (!packageNames.includes(entry)) {
      if (dryRun) console.log(`would remove stale link ${entry}`)
      else unlinkSync(link)
    }
  } catch {
    // Ignore unreadable/stale entries; the manifest prune below still applies.
  }
}
for (const name of removed) {
  const link = join(nodeModules, name)
  try {
    if (existsSync(link) || isLink(link)) {
      if (dryRun) console.log(`would remove ${name} -> ${link}`)
      else unlinkSync(link)
    }
  } catch {
    // A stale row is already gone; pruning the manifest is enough.
  }
}
mkdirSync(nodeModules, { recursive: true })

for (const name of packageNames) {
  const target = join(PACKAGES_DIR, name)
  const link = join(nodeModules, name)
  if (existsSync(link) || isLink(link)) {
    const stat = lstatSync(link)
    if (!stat.isSymbolicLink()) {
      console.error(`refusing to replace non-link path: ${link}`)
      process.exit(1)
    }
    if (resolve(readlinkSafe(link) ?? '') !== target) {
      if (dryRun) console.log(`would relink ${name} -> ${target}`)
      else {
        unlinkSync(link)
        symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir')
      }
    }
  } else if (dryRun) {
    console.log(`would link ${name} -> ${target}`)
  } else {
    symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir')
  }
  if (dryRun) console.log(`would depend ${name}: link:${target}`)
  else manifest.dependencies[name] = `link:${target}`
  if (!manifest.dsh.profile.bundles.includes(name)) {
    if (dryRun) console.log(`would add bundle ${name}`)
    else manifest.dsh.profile.bundles.push(name)
  }
}

if (dryRun) {
  if (removed.size > 0) console.log(`would prune ${String(removed.size)} package(s): ${[...removed].join(', ')}`)
  console.log('dry run complete')
  process.exit(0)
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
console.log(`linked ${String(packageNames.length)} package(s) into ${profile}`)
if (removed.size > 0) console.log(`pruned ${String(removed.size)} package(s): ${[...removed].join(', ')}`)
console.log(`bundles: ${packageNames.join(', ')}`)

/** @param {string} path @returns {boolean} whether the path exists as a link. */
function isLink(path) {
  try {
    return lstatSync(path).isSymbolicLink()
  } catch {
    return false
  }
}

/** @param {string} path @returns {string|null} link target without throwing. */
function readlinkSafe(path) {
  try {
    return readlinkSync(path)
  } catch {
    return null
  }
}
