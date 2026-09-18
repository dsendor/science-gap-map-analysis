#!/usr/bin/env node
// Save the searches you just ran into research-log/searches/<name>.json, so they
// survive the next rebuild.
//
// engine/search.mjs logs every query to the search_log table and caches the results
// under research-cache/. Both are gone after a rebuild: the database is recreated from
// scratch, and research-cache/ is gitignored. So until this runs, the evidence behind a
// label or a chain step exists only on one machine and only until the next rebuild. The
// Phase 3 transcript survived because someone exported it by hand once; this makes that
// a command instead of a memory.
//
// Merges into an existing file rather than overwriting it, deduplicating on
// (phase, gap_id, query, cache_key), so it is safe to run after every research session.
//
// Usage:
//   node engine/export-searches.mjs <name> [--phase <phase>] [--gap <gap-id>]
//   e.g. node engine/export-searches.mjs chain-particle-accelerators --phase chain-accelerators

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') !== true);
const flag = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
if (!name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('usage: node engine/export-searches.mjs <lowercase-name> [--phase <phase>] [--gap <gap-id>]');
  process.exit(1);
}

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);

const where = [];
const params = [];
if (flag('--phase')) { where.push('phase = ?'); params.push(flag('--phase')); }
if (flag('--gap')) { where.push('gap_id = ?'); params.push(flag('--gap')); }
const rows = db.prepare(
  `SELECT phase, gap_id, provider, query, cache_key, n_results, created_at FROM search_log
   ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id`
).all(...params);

if (!rows.length) {
  console.error('no matching rows in search_log. Run searches with engine/search.mjs first, and export before rebuilding.');
  process.exit(1);
}

const out = `${root}research-log/searches/${name}.json`;
const existing = existsSync(out)
  ? JSON.parse(readFileSync(out, 'utf8'))
  : {
      note: 'Every search issued for this piece of work, with its cache key and the result ' +
        'titles and URLs returned. research-cache/ is gitignored, so this file is what makes ' +
        'the evidence, and any null result, checkable by someone else.',
      searches: [],
    };
const key = (s) => `${s.phase}|${s.gap_id}|${s.query}|${s.cache_key}`;
const seen = new Set(existing.searches.map(key));
// Rebuild restores search_log from every file in research-log/searches/, so without
// this an unfiltered export would copy other files' searches into this one.
const dir = `${root}research-log/searches`;
if (existsSync(dir)) {
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && f !== `${name}.json`)) {
    for (const s of JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).searches ?? []) seen.add(key(s));
  }
}

let added = 0, missing = 0;
for (const r of rows) {
  if (seen.has(key(r))) continue;
  const cachePath = `${root}research-cache/${r.cache_key}.json`;
  let results = null;
  if (existsSync(cachePath)) {
    results = JSON.parse(readFileSync(cachePath, 'utf8')).results.map((x) => ({ title: x.title, url: x.url }));
  } else {
    missing++;
  }
  existing.searches.push({ ...r, results });
  seen.add(key(r));
  added++;
}

mkdirSync(`${root}research-log/searches`, { recursive: true });
writeFileSync(out, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`research-log/searches/${name}.json: ${added} added, ${existing.searches.length} total`);
if (missing) {
  console.error(`WARNING: ${missing} search(es) had no cache file, so their results are recorded as null. ` +
    'The query is still logged, but a reviewer cannot see what it returned.');
}
