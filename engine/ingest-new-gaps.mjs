#!/usr/bin/env node
// Ingest one Phase 4 proposed-gap file.
//
// Proposed gaps live in new_gaps, never in gm_gaps, so verify-additive.mjs stays
// trivially true. Their ids are prefixed 'new-'; minting a Convergent-style UUID
// would make a proposal indistinguishable from their data downstream, which is the
// one thing this table exists to prevent.
//
// Usage: node engine/ingest-new-gaps.mjs research-log/new-gaps/<file>.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node engine/ingest-new-gaps.mjs <file.json>'); process.exit(1); }

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const batch = JSON.parse(readFileSync(file, 'utf8'));
const fields = new Set(db.prepare('SELECT id FROM gm_fields').all().map((r) => r.id));
const words = (s) => s.trim().split(/\s+/).length;

db.exec('BEGIN');
let n = 0;
try {
  // Clear every proposed gap this file is responsible for before inserting, rather
  // than deleting id-by-id as we go. Deleting only the ids still present in the file
  // means a withdrawn gap silently survives in the table: Gate B withdrew two, and
  // id-by-id deletion would have left them in new_gaps and in the artifact. There is
  // one proposed-gaps file and it is the whole set, so clearing the table is the
  // honest reset.
  db.prepare('DELETE FROM new_gaps').run();
  for (const g of batch.gaps) {
    if (!g.id.startsWith('new-')) throw new Error(`${g.id}: proposed gap ids must be prefixed 'new-'`);
    if (!fields.has(g.field_id)) throw new Error(`${g.id}: unknown field_id ${g.field_id}`);
    // The corpus runs 12-192 words, median 38, IQR 26-59. Outside 20-70 a description
    // stops reading like theirs, so it fails here rather than in review.
    const w = words(g.description);
    if (w < 20 || w > 70) throw new Error(`${g.id}: description is ${w} words, outside the 20-70 house range`);

    db.prepare(`INSERT INTO new_gaps
      (id, name, slug, description, field_id, outcome, ai_type, maturity, tier,
       tension_test, unlock_test, dedup_check, nearest, funding_check, rationale, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(g.id, g.name, g.slug, g.description, g.field_id, g.outcome, g.ai_type,
           g.maturity, g.tier, g.tension_test, g.unlock_test, g.dedup_check,
           g.nearest ?? null, g.funding_check, g.rationale, g.confidence);
    n++;
    console.log(`  ${g.id.padEnd(34)} ${String(w).padStart(2)}w  ${g.tier}`);
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED: ${e.message}`);
  process.exit(1);
}
console.log(`new gaps: ${n} row(s)`);
