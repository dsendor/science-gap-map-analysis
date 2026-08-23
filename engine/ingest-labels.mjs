#!/usr/bin/env node
// Ingest one label batch file into the augmentation tables.
//
// One file per field. The lead ingests serially — parallel labelers write files,
// they never touch SQLite. Carried over from ai-science-gap-map/engine/ingest.mjs;
// the point is that a batch is idempotent and a write never contends.
//
// Usage: node engine/ingest-labels.mjs research-log/labels/<field>.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node engine/ingest-labels.mjs <file.json>');
  process.exit(1);
}

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const batch = JSON.parse(readFileSync(file, 'utf8'));
const by = batch.labeled_by ?? 'unknown';

const known = new Set(db.prepare('SELECT id FROM gm_gaps').all().map((r) => r.id));

db.exec('BEGIN');
let n = 0;
try {
  for (const g of batch.gaps) {
    if (!known.has(g.gap_id)) throw new Error(`unknown gap id ${g.gap_id} — labels must join to their data`);

    db.prepare('DELETE FROM gap_outcomes WHERE gap_id = ?').run(g.gap_id);
    db.prepare(
      'INSERT INTO gap_outcomes (gap_id, outcome, rationale, confidence, labeled_by) VALUES (?, ?, ?, ?, ?)'
    ).run(g.gap_id, g.outcome.outcome, g.outcome.rationale, g.outcome.confidence, by);

    db.prepare('DELETE FROM gap_ai_types WHERE gap_id = ?').run(g.gap_id);
    const primaries = g.ai_types.filter((t) => t.is_primary === 1).length;
    if (primaries !== 1) throw new Error(`${g.gap_id}: needs exactly one primary AI type, got ${primaries}`);
    for (const t of g.ai_types) {
      db.prepare(
        'INSERT INTO gap_ai_types (gap_id, ai_type, maturity, is_primary, rationale, confidence, labeled_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(g.gap_id, t.ai_type, t.maturity, t.is_primary, t.rationale, t.confidence, by);
    }

    db.prepare('DELETE FROM gap_measurability WHERE gap_id = ?').run(g.gap_id);
    db.prepare(
      'INSERT INTO gap_measurability (gap_id, tier, rationale, confidence, labeled_by) VALUES (?, ?, ?, ?, ?)'
    ).run(g.gap_id, g.measurability.tier, g.measurability.rationale, g.measurability.confidence, by);
    n++;
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED (${batch.field}): ${e.message}`);
  process.exit(1);
}
console.log(`${batch.field}: ${n} gaps labeled`);
