#!/usr/bin/env node
// Replay the second pass over the 103 outcome sentences onto gap_outcomes.outcome.
//
// research-log/rewrites/outcomes-v2.json has been the real wording on the site since
// the second pass ran, but nothing replayed it: the rewrites were applied to SQLite by
// hand and rebuild.mjs never knew the file existed. A clean rebuild therefore reverted
// all 103 outcomes to the first pass silently, with no error and no diff to notice —
// the same failure mode as running adjudicate.mjs before apply-relabel.mjs, and the
// reason that ordering is pinned in rebuild.mjs with a comment.
//
// Only the sentence is rewritten. rationale, confidence and labeled_by belong to the
// judgment the first pass made and the rewrite did not revisit them.
//
// Idempotent: an UPDATE keyed on gap_id, so re-running is a no-op.
//
// Usage: node engine/ingest-outcome-rewrites.mjs [research-log/rewrites/outcomes-v2.json]

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const file = process.argv[2] ?? `${root}research-log/rewrites/outcomes-v2.json`;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);

const { outcomes } = JSON.parse(readFileSync(file, 'utf8'));

db.exec('BEGIN');
const upd = db.prepare('UPDATE gap_outcomes SET outcome = ? WHERE gap_id = ?');
let changed = 0;
let missing = 0;
for (const [gapId, outcome] of Object.entries(outcomes)) {
  const r = upd.run(outcome, gapId);
  if (r.changes) changed += 1;
  else missing += 1;
}
db.exec('COMMIT');

// A gap_id in the rewrite file with no row to update means the two files have drifted
// apart. Loud, because silence is what caused this script to be needed.
if (missing) {
  console.error(`outcome rewrites: ${missing} gap_id(s) in ${file} match no gap_outcomes row`);
  process.exit(1);
}
console.log(`outcome rewrites: ${changed} sentences replayed`);
