#!/usr/bin/env node
// Apply the relabel adjudication to gap_ai_types.
//
// Rules, from research-log/relabel-adjudication.json:
//   - Both passes agree            -> keep, confidence 'confident'
//   - Disagree, adjudicated        -> take the adjudicated value, confidence per the entry
//   - Disagree, unresolved         -> take the adjudicated value, confidence 'guess'
//
// Adjudication lives in a file rather than being applied inline so it is reviewable in
// a diff and reproducible by rebuild, like every other durable fact in this project.

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const file = `${root}research-log/relabel-adjudication.json`;
if (!existsSync(file)) { console.log('no adjudication file yet — skipping'); process.exit(0); }
const { adjudications } = JSON.parse(readFileSync(file, 'utf8'));
const byGap = new Map(adjudications.map((a) => [a.gap_id, a]));

const rows = db.prepare('SELECT * FROM relabels').all();
db.exec('BEGIN');
let agreed = 0, resolved = 0, unresolved = 0;
for (const r of rows) {
  let type, maturity, confidence, note;
  if (r.type_agreed && r.maturity_agreed) {
    type = r.v1_type; maturity = r.v1_maturity; confidence = 'confident';
    note = 'both independent passes agreed';
    agreed++;
  } else {
    const a = byGap.get(r.gap_id);
    if (!a) { db.exec('ROLLBACK'); console.error(`no adjudication for disagreed gap ${r.gap_id}`); process.exit(1); }
    type = a.type; maturity = a.maturity; confidence = a.confidence; note = a.note;
    confidence === 'guess' ? unresolved++ : resolved++;
  }
  db.prepare('UPDATE relabels SET adjudicated_type=?, adjudicated_maturity=?, adjudication_note=? WHERE gap_id=?')
    .run(type, maturity, note, r.gap_id);
  db.prepare('DELETE FROM gap_ai_types WHERE gap_id=? AND is_primary=1').run(r.gap_id);
  db.prepare(`INSERT INTO gap_ai_types (gap_id, ai_type, maturity, is_primary, rationale, confidence, labeled_by)
              VALUES (?,?,?,1,?,?,?)
              ON CONFLICT(gap_id, ai_type) DO UPDATE SET
                maturity=excluded.maturity, is_primary=1, rationale=excluded.rationale,
                confidence=excluded.confidence, labeled_by=excluded.labeled_by`)
    .run(r.gap_id, type, maturity, note, confidence, 'v1+v2 adjudicated');
}
db.exec('COMMIT');
console.log(`relabel applied: ${agreed} agreed, ${resolved} adjudicated confident, ${unresolved} adjudicated guess`);
