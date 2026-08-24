#!/usr/bin/env node
// Adjudicate the blind audit.
//
// The protocol is: disagreements are re-adjudicated on the merits, and where
// adjudication does not resolve them the label is downgraded to confidence 'guess'
// rather than argued into agreement. This script applies the downgrades.
//
// Two rules, both derived from what the audit actually measured:
//
// 1. Every sampled gap where the auditor disagreed is downgraded on that dimension.
//    A disagreement between two independent labelers applying the same written
//    taxonomy is the definition of a call that does not deserve 'confident'.
//
// 2. Every 'Proxy only' tier assignment is downgraded, sampled or not. The stratum
//    ran 78% disagreement against 0% for 'Directly measurable' and 9% for
//    'Verification contested', and all three auditors independently reported that
//    'Proxy only' was repeatedly the nearest alternative and almost never won. That
//    is a category that cannot be applied reliably, so no label that uses it has
//    earned 'confident' — including the ones that happened not to be sampled.
//
// Rule 2 is deliberately broader than the sample. Downgrading only the sampled
// failures would let an unreliable category keep its confidence everywhere the
// auditor happened not to look.

import { DatabaseSync } from 'node:sqlite';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);

db.exec('BEGIN');

const tierDis = db.prepare("SELECT gap_id FROM audits WHERE dimension='measurability' AND agreed=0").all();
for (const r of tierDis)
  db.prepare("UPDATE gap_measurability SET confidence='guess' WHERE gap_id=?").run(r.gap_id);

const typeDis = db.prepare("SELECT gap_id FROM audits WHERE dimension='ai_type' AND agreed=0").all();
for (const r of typeDis)
  db.prepare("UPDATE gap_ai_types SET confidence='guess' WHERE gap_id=? AND is_primary=1").run(r.gap_id);

const proxy = db.prepare("UPDATE gap_measurability SET confidence='guess' WHERE tier='Proxy only' AND confidence='confident'").run();

db.exec('COMMIT');

console.log(`downgraded ${tierDis.length} sampled tier disagreements`);
console.log(`downgraded ${typeDis.length} sampled AI-type disagreements`);
console.log(`downgraded ${proxy.changes} further 'Proxy only' tiers on category unreliability`);

const q = (s) => db.prepare(s).get().c;
// Intermediate, not final. When rebuild.mjs runs the full pipeline, apply-relabel.mjs
// runs after this and downgrades further, so these counts are superseded. rebuild.mjs
// prints the settled figures at the end; a reader who stopped here saw 83/20 for what
// is really 46/57.
console.log('\nconfidence after adjudication (intermediate — see the final counts at the end of a full rebuild):');
for (const [d, t, w] of [['measurability', 'gap_measurability', ''], ['ai_type (primary)', 'gap_ai_types', 'is_primary=1 AND']]) {
  const c = q(`SELECT count(*) c FROM ${t} WHERE ${w} confidence='confident'`);
  const g = q(`SELECT count(*) c FROM ${t} WHERE ${w} confidence='guess'`);
  console.log(`  ${d.padEnd(18)} confident ${String(c).padStart(3)}  guess ${String(g).padStart(3)}  (${(100 * g / (c + g)).toFixed(0)}% flagged)`);
}
