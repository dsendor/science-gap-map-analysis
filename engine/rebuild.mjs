#!/usr/bin/env node
// Rebuild the database from scratch: baseline snapshot + every ingested label file.
//
// db/gapmap.sqlite is gitignored on purpose. The sources of record are the pinned
// snapshot in data/baseline/ and the JSON files in research-log/, both of which are
// reviewable in a diff. A committed binary is neither. Anyone — including CI — can
// reconstruct the exact database from what is in the repo.
//
// Usage: node engine/rebuild.mjs

import { execFileSync } from 'node:child_process';
import { readdirSync, existsSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const run = (script, ...args) =>
  execFileSync(process.execPath, [`${root}engine/${script}`, ...args], { stdio: 'inherit' });

run('import-gapmap.mjs');

for (const [dir, script] of [
  ['research-log/labels', 'ingest-labels.mjs'],
  ['research-log/audits', 'ingest-audits.mjs'],
  ['research-log/indicators', 'ingest-indicators.mjs'],
  ['research-log/new-gaps', 'ingest-new-gaps.mjs'],
  ['research-log/critical-paths', 'ingest-critical-paths.mjs'],
  ['research-log/ledger', 'ingest-ledger.mjs'],
]) {
  const path = `${root}${dir}`;
  if (!existsSync(path) || !existsSync(`${root}engine/${script}`)) continue;
  const files = readdirSync(path).filter((f) => f.endsWith('.json')).sort();
  for (const f of files) run(script, `${path}/${f}`);
  if (files.length) console.log(`ingested ${files.length} file(s) from ${dir}`);
}

run('verify-additive.mjs');
