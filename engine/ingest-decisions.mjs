#!/usr/bin/env node
// Ingest the decision ledger from its file source of record.
//
// The Autonomous Decision Protocol requires a decisions row for every non-obvious
// call. Those rows were originally written straight into SQLite, which meant they
// lived only in a gitignored derived file and vanished on the next rebuild — the
// ledger was neither reviewable in a diff nor reproducible. research-log/decisions.json
// is now the source of record and this replays it.
//
// Idempotent: clears and reloads, so re-running never duplicates.
//
// Usage: node engine/ingest-decisions.mjs [research-log/decisions.json]

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const file = process.argv[2] ?? `${root}research-log/decisions.json`;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);

const { decisions } = JSON.parse(readFileSync(file, 'utf8'));

db.exec('BEGIN');
db.exec('DELETE FROM decisions');
const ins = db.prepare(
  'INSERT INTO decisions (phase, decision, rationale, runner_up, confidence, reversal_condition) VALUES (?, ?, ?, ?, ?, ?)'
);
for (const d of decisions)
  ins.run(d.phase, d.decision, d.rationale, d.runner_up ?? null, d.confidence, d.reversal_condition);
db.exec('COMMIT');

console.log(`decisions: ${decisions.length} rows`);
