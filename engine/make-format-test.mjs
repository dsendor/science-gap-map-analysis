#!/usr/bin/env node
// Build the house-format blind test for Phase 4.
//
// The brief requires new gaps "written in Convergent's own house format and voice so
// they can drop them straight in". That is testable rather than assertable: mix our
// proposed gaps with real ones, strip identifying markers, and see whether a reader
// can pick ours out. Scoring at chance means the format matches. Reliably spotting
// ours means it does not, and *what gave them away* is directly actionable.
//
// Order is a deterministic hash shuffle, so the test is reproducible and the key is
// not recoverable from position.
//
// Usage: node engine/make-format-test.mjs [--decoys 12]

import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const args = process.argv.slice(2);
const nDecoys = Number(args.includes('--decoys') ? args[args.indexOf('--decoys') + 1] : 12);

const ours = db.prepare('SELECT id, name, description FROM new_gaps').all();
if (!ours.length) {
  console.error('no rows in new_gaps — run Phase 4 drafting first');
  process.exit(1);
}

// Decoys drawn from the fields our new gaps sit in, so field vocabulary cannot be
// the tell. Deterministic pick by sorted id.
const fields = db.prepare(
  `SELECT DISTINCT f.name FROM new_gaps n JOIN gm_fields f ON f.id = n.field_id`
).all().map((r) => r.name);

let pool = db.prepare(`
  SELECT g.id, g.name, g.description FROM gm_gaps g JOIN gm_fields f ON f.id = g.field_id
  WHERE f.name IN (${fields.map(() => '?').join(',')}) ORDER BY g.id`).all(...fields);

// Astrophysics has 4 gaps and Nanoscale Fabrication 3, so a same-field pool can starve
// below the decoy target. Widen to the whole map rather than silently shipping a test
// with three decoys, where the reviewer can score well by luck.
if (pool.length < nDecoys) {
  console.log(`same-field pool has only ${pool.length} gaps; widening to the full map to reach ${nDecoys} decoys`);
  pool = db.prepare('SELECT id, name, description FROM gm_gaps ORDER BY id').all();
}

const step = Math.max(1, Math.floor(pool.length / nDecoys));
const decoys = [];
for (let i = 0; i < pool.length && decoys.length < nDecoys; i += step) decoys.push(pool[i]);

const items = [
  ...ours.map((g) => ({ ...g, mine: 1 })),
  ...decoys.map((g) => ({ ...g, mine: 0 })),
];

// Hash shuffle: stable across runs, unrelated to source order.
const rank = (s) => createHash('sha256').update(s).digest('hex');
items.sort((a, b) => (rank(a.id) < rank(b.id) ? -1 : 1));

const test = items.map((g, i) => ({
  item: i + 1,
  name: g.name,
  description: g.description,
}));
const key = items.map((g, i) => ({ item: i + 1, id: g.id, is_ours: g.mine }));

writeFileSync(`${root}research-log/format-test.json`, JSON.stringify({
  instructions: 'Some of these R&D gap statements were written by Convergent Research and some were not. For each item, say whether you believe it is theirs or not, give a confidence from 0 to 1, and state what decided it.',
  items: test,
}, null, 2));
writeFileSync(`${root}research-log/format-test-key.json`, JSON.stringify(key, null, 2));

console.log(`format-test.json: ${test.length} items (${ours.length} ours, ${decoys.length} decoys)`);
console.log(`chance-level accuracy is ${(100 * Math.max(ours.length, decoys.length) / test.length).toFixed(0)}% by always guessing the majority class;`);
console.log(`the informative number is recall on OUR items — if the reviewer finds most of them, the format does not match.`);
