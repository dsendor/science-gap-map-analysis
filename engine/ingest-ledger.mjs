#!/usr/bin/env node
// Ingest the decision ledger and the run clock.
//
// db/gapmap.sqlite is gitignored, so `decisions` and `runs` — both of which are part
// of the argument rather than scratch state — have to live in reviewable files.
// These two are the source of record; the tables are a projection of them.
//
// Usage: node engine/ingest-ledger.mjs research-log/ledger/<decisions|runs>.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const file = process.argv[2];
if (!file) { console.error('usage: node engine/ingest-ledger.mjs <file.json>'); process.exit(1); }

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const rows = JSON.parse(readFileSync(file, 'utf8'));
const kind = basename(file, '.json');

db.exec('BEGIN');
try {
  if (kind === 'decisions') {
    db.exec('DELETE FROM decisions');
    for (const d of rows) {
      db.prepare(`INSERT INTO decisions (phase, decision, rationale, runner_up, confidence, reversal_condition, review_status, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(d.phase, d.decision, d.rationale, d.runner_up ?? null, d.confidence,
             d.reversal_condition, d.review_status ?? 'AI-set, pending review', d.created_at);
    }
  } else if (kind === 'runs') {
    db.exec('DELETE FROM runs');
    for (const r of rows) {
      db.prepare(`INSERT INTO runs (phase, kind, started_at, ended_at, model, n_units, note)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .run(r.phase, r.kind, r.started_at, r.ended_at ?? null, r.model ?? null, r.n_units ?? null, r.note ?? null);
    }
  } else {
    throw new Error(`unknown ledger file "${kind}" — expected decisions.json or runs.json`);
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED (${kind}): ${e.message}`);
  process.exit(1);
}
console.log(`ledger ${kind}: ${rows.length} row(s)`);
