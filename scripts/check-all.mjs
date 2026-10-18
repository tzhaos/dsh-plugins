/**
 * Run every package verification suite without third-party dependencies.
 *
 * Each package keeps its own `scripts/check.mjs`; this runner only discovers
 * them in deterministic order, streams their output and aggregates failures.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..')
const PACKAGES_DIR = join(ROOT, 'packages')

const packages = readdirSync(PACKAGES_DIR)
  .filter((name) => statSync(join(PACKAGES_DIR, name)).isDirectory())
  .filter((name) => existsSync(join(PACKAGES_DIR, name, 'package.json')))
  .sort()

if (packages.length === 0) {
  console.error('no packages found under packages/')
  process.exit(1)
}

let failed = 0
let totalChecks = 0
const started = Date.now()

for (const name of packages) {
  const script = join(PACKAGES_DIR, name, 'scripts', 'check.mjs')
  if (!existsSync(script)) {
    console.error(`FAIL ${name}: scripts/check.mjs is missing`)
    failed += 1
    continue
  }
  console.log(`\n=== ${name} ===`)
  const result = spawnSync(process.execPath, [script], {
    cwd: join(PACKAGES_DIR, name),
    encoding: 'utf8',
  })
  if (result.stdout !== '') process.stdout.write(result.stdout)
  if (result.stderr !== '') process.stderr.write(result.stderr)
  const passed = (result.stdout ?? '').match(/^ok /gm)
  if (passed !== null) totalChecks += passed.length
  if (result.status !== 0) {
    failed += 1
    console.error(`FAIL ${name}: exit ${String(result.status)}`)
  }
}

const elapsed = ((Date.now() - started) / 1000).toFixed(1)
if (failed > 0) {
  console.error(`\n${String(failed)} package(s) failed; ${String(totalChecks)} checks passed; ${elapsed}s`)
  process.exit(1)
}
console.log(`\nall packages passed: ${String(packages.length)} packages, ${String(totalChecks)} checks, ${elapsed}s`)
