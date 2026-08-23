#!/usr/bin/env node
// Ingest one v2 relabel batch and compare it against v1.
//
// v1 is the current gap_ai_types primary. v2 is the independent blind pass against
// the 8-category taxonomy. This records the pair; it does NOT overwrite v1 — the
// adjudication step decides, and doing both here would let a comparison silently
// become an edit.
//
// Usage: node engine/ingest-relabels.mjs research-log/labels-v2/batch-1.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node engine/ingest-relabels.mjs <file.json>'); process.exit(1); }

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const batch = JSON.parse(readFileSync(file, 'utf8'));
const by = batch.labeled_by ?? 'unknown';
const v1 = db.prepare('SELECT ai_type, maturity FROM gap_ai_types WHERE gap_id = ? AND is_primary = 1');

db.exec('BEGIN');
let n = 0, tAgree = 0, mAgree = 0, control = 0;
try {
  for (const g of batch.gaps) {
    const primaries = g.ai_types.filter((t) => t.is_primary === 1);
    if (primaries.length !== 1) throw new Error(`${g.gap_id}: needs exactly one primary, got ${primaries.length}`);
    const p = primaries[0];
    const old = v1.get(g.gap_id);
    if (!old) throw new Error(`${g.gap_id}: no v1 label to compare against`);

    const ta = old.ai_type === p.ai_type ? 1 : 0;
    const ma = old.maturity === p.maturity ? 1 : 0;
    tAgree += ta; mAgree += ma;
    if (p.ai_type === 'Real-time control of physical systems') control++;

    db.prepare('DELETE FROM relabels WHERE gap_id = ?').run(g.gap_id);
    db.prepare(`INSERT INTO relabels
      (gap_id, v1_type, v1_maturity, v2_type, v2_maturity, type_agreed, maturity_agreed,
       discriminating_test, nearest_alternative, v2_rationale, v2_confidence, labeled_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      g.gap_id, old.ai_type, old.maturity, p.ai_type, p.maturity, ta, ma,
      g.discriminating_test ?? null, g.nearest_alternative ?? null,
      p.rationale ?? null, p.confidence ?? null, by);
    n++;
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED (batch ${batch.batch}): ${e.message}`);
  process.exit(1);
}
console.log(`batch ${batch.batch}: ${n} gaps | type agree ${tAgree}/${n}, maturity agree ${mAgree}/${n}, control primary ${control}`);
