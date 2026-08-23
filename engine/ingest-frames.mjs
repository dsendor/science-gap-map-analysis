#!/usr/bin/env node
// Ingest the frame dimension from its file source of record.
// Usage: node engine/ingest-frames.mjs [research-log/frames.json]

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const file = process.argv[2] ?? `${root}research-log/frames.json`;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const { frames } = JSON.parse(readFileSync(file, 'utf8'));
const known = new Set(db.prepare('SELECT id FROM gm_gaps').all().map((r) => r.id));

db.exec('BEGIN');
db.exec('DELETE FROM gap_frame');
const ins = db.prepare('INSERT INTO gap_frame (gap_id, frame, rationale) VALUES (?, ?, ?)');
for (const f of frames) {
  if (!known.has(f.gap_id)) { db.exec('ROLLBACK'); console.error(`unknown gap id ${f.gap_id}`); process.exit(1); }
  ins.run(f.gap_id, f.frame, f.rationale);
}
db.exec('COMMIT');
console.log(`frames: ${frames.length} gaps marked ai-as-object (all others default to ai-as-instrument)`);
