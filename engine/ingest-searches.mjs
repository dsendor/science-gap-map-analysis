#!/usr/bin/env node
// Restore search_log from research-log/searches/<name>.json on rebuild.
//
// Every other research record already rebuilt from files; searches were persisted and
// never read back, so search_log was empty after every rebuild while the docs told
// reviewers to look in it. This is the other half of engine/export-searches.mjs.
//
// Usage: node engine/ingest-searches.mjs research-log/searches/<name>.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node engine/ingest-searches.mjs <file.json>'); process.exit(1); }

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const known = new Set(db.prepare('SELECT id FROM gm_gaps').all().map((r) => r.id));
const { searches = [] } = JSON.parse(readFileSync(file, 'utf8'));

const exists = db.prepare('SELECT 1 FROM search_log WHERE phase = ? AND query = ? AND cache_key = ? AND gap_id IS ?');
const insert = db.prepare(
  `INSERT INTO search_log (phase, gap_id, provider, query, cache_key, n_results, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);

db.exec('BEGIN');
let n = 0;
try {
  for (const s of searches) {
    const gap = s.gap_id && known.has(s.gap_id) ? s.gap_id : null;
    if (s.gap_id && !gap) throw new Error(`unknown gap_id ${s.gap_id} for query "${s.query}"`);
    if (exists.get(s.phase, s.query, s.cache_key, gap)) continue;
    insert.run(s.phase, gap, s.provider ?? 'brave', s.query, s.cache_key, s.n_results ?? null,
      s.created_at ?? new Date().toISOString());
    n++;
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED: ${file}: ${e.message}`);
  process.exit(1);
}
console.log(`searches: ${n} row(s) from ${file.split('/').pop()}`);
