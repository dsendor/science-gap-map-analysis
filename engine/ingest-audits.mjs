#!/usr/bin/env node
// Ingest one blind-audit batch and score it against the existing labels.
//
// Agreement is exact match on the enum dimensions (measurability tier, primary AI
// type). Outcome sentences are free text, where exact match is meaningless and a
// string heuristic would be worse than useless, so outcome rows are stored for
// qualitative comparison and excluded from the computed rate. engine/audit-report.mjs
// says so explicitly rather than quietly folding them in.
//
// Usage: node engine/ingest-audits.mjs research-log/audits/batch-1.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node engine/ingest-audits.mjs <file.json>'); process.exit(1); }

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const batch = JSON.parse(readFileSync(file, 'utf8'));
const by = batch.audited_by ?? 'unknown';

const origTier = db.prepare('SELECT tier FROM gap_measurability WHERE gap_id = ?');
const origType = db.prepare('SELECT ai_type, maturity FROM gap_ai_types WHERE gap_id = ? AND is_primary = 1');
const origOutcome = db.prepare('SELECT outcome FROM gap_outcomes WHERE gap_id = ?');

db.exec('BEGIN');
let n = 0, agree = 0, disagree = 0;
try {
  for (const l of batch.labels) {
    let original, audit;
    if (l.dimension === 'measurability') {
      original = origTier.get(l.gap_id)?.tier;
      audit = l.value;
    } else if (l.dimension === 'ai_type') {
      const o = origType.get(l.gap_id);
      original = o?.ai_type;
      audit = l.value;
    } else if (l.dimension === 'outcome') {
      original = origOutcome.get(l.gap_id)?.outcome;
      audit = l.value;
    } else {
      throw new Error(`unknown dimension ${l.dimension}`);
    }
    if (original === undefined) throw new Error(`no existing label for ${l.gap_id} / ${l.dimension}`);

    const agreed = l.dimension === 'outcome' ? 0 : (original === audit ? 1 : 0);
    if (l.dimension !== 'outcome') { agreed ? agree++ : disagree++; }

    const note = [
      l.discriminating_test ? `test: ${l.discriminating_test}` : null,
      l.nearest_alternative ? `nearest alternative: ${l.nearest_alternative}` : null,
      l.maturity ? `maturity: ${l.maturity}` : null,
      l.note || null,
    ].filter(Boolean).join(' | ');

    db.prepare(`DELETE FROM audits WHERE gap_id = ? AND dimension = ? AND audited_by = ?`)
      .run(l.gap_id, l.dimension, by);
    db.prepare(`INSERT INTO audits (gap_id, dimension, original, audit, agreed, auditor_note, audited_by)
                VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(l.gap_id, l.dimension, original, audit, agreed, note || 'no note', by);
    n++;
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED: ${e.message}`);
  process.exit(1);
}
console.log(`batch ${batch.batch}: ${n} audit rows | enum dimensions: ${agree} agree, ${disagree} disagree`);
