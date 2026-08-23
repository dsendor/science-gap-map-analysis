#!/usr/bin/env node
// Ingest one Phase 3 progress-indicator file.
//
// Same file-per-unit → serial-ingest pattern as ingest-labels.mjs. The schema CHECK
// permits a NULL current_value only when is_null_result = 1, so an unsourced number
// is a write failure rather than a review finding.
//
// Usage: node engine/ingest-indicators.mjs research-log/indicators/<file>.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node engine/ingest-indicators.mjs <file.json>'); process.exit(1); }

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const batch = JSON.parse(readFileSync(file, 'utf8'));
const known = new Set(db.prepare('SELECT id FROM gm_gaps').all().map((r) => r.id));

db.exec('BEGIN');
let n = 0, nulls = 0;
try {
  for (const i of batch.indicators) {
    if (!known.has(i.gap_id)) throw new Error(`unknown gap id ${i.gap_id}`);
    db.prepare('DELETE FROM gap_indicators WHERE gap_id = ? AND quantity = ?').run(i.gap_id, i.quantity);
    db.prepare(`INSERT INTO gap_indicators
      (gap_id, quantity, current_value, unit, as_of, target_value, target_basis,
       source_title, source_url, source_doi, source_checked, reads_as, direction, context, caveat,
       is_null_result, rationale, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(i.gap_id, i.quantity, i.current_value ?? null, i.unit ?? null, i.as_of ?? null,
           i.target_value ?? null, i.target_basis ?? null, i.source_title ?? null,
           i.source_url ?? null, i.source_doi ?? null, i.source_checked ?? null,
           i.reads_as ?? null, i.direction ?? null, i.context ?? null, i.caveat ?? null,
           i.is_null_result ?? 0, i.rationale, i.confidence);
    n++;
    if (i.is_null_result) nulls++;
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED: ${e.message}`);
  process.exit(1);
}
console.log(`indicators: ${n} row(s), ${nulls} honest null(s)`);
