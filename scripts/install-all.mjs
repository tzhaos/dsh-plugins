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

const nodeModules = join(profile, 'node_modules')
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
  console.log('dry run complete')
  process.exit(0)
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
console.log(`linked ${String(packageNames.length)} package(s) into ${profile}`)
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
