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

let audited = 0;
for (const [dir, script] of [['research-log/labels', 'ingest-labels.mjs'], ['research-log/audits', 'ingest-audits.mjs']]) {
  const path = `${root}${dir}`;
  if (!existsSync(path) || !existsSync(`${root}engine/${script}`)) continue;
  const files = readdirSync(path).filter((f) => f.endsWith('.json')).sort();
  for (const f of files) run(script, `${path}/${f}`);
  if (files.length) console.log(`ingested ${files.length} file(s) from ${dir}`);
  if (dir.endsWith('audits')) audited = files.length;
}

// Adjudication is part of the derived state, not a one-off edit. Without this a
// rebuild silently restores the pre-audit confidence flags and the artifact would
// under-report its own uncertainty — the opposite of what the audit was for.
if (audited) run('adjudicate.mjs');

if (existsSync(`${root}research-log/decisions.json`)) run('ingest-decisions.mjs');
if (existsSync(`${root}research-log/runs.json`)) run('ingest-runs.mjs');
if (existsSync(`${root}research-log/frames.json`)) run('ingest-frames.mjs');

// v2 relabel comparison, then the adjudication that acts on it. Order matters: the
// comparison must be recorded against v1 before adjudication rewrites the primaries.
const v2dir = `${root}research-log/labels-v2`;
if (existsSync(v2dir) && existsSync(`${root}engine/ingest-relabels.mjs`)) {
  const files = readdirSync(v2dir).filter((f) => f.endsWith('.json')).sort();
  for (const f of files) run('ingest-relabels.mjs', `${v2dir}/${f}`);
  if (files.length) {
    console.log(`ingested ${files.length} relabel file(s)`);
    if (existsSync(`${root}research-log/relabel-adjudication.json`)) run('apply-relabel.mjs');
  }
}

run('verify-additive.mjs');
