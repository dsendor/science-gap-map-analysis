#!/usr/bin/env node
// Ingest the time ledger from its file source of record.
//
// The brief makes elapsed time part of the argument: the artifact is itself evidence
// that this kind of curation has become dramatically cheaper. That number therefore
// cannot live only in a gitignored derived database, where a rebuild erases it.
//
// Agent time and human-review time stay separate. A single blended figure invites the
// obvious objection.
//
// Usage: node engine/ingest-runs.mjs [research-log/runs.json]

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const file = process.argv[2] ?? `${root}research-log/runs.json`;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);

const { runs } = JSON.parse(readFileSync(file, 'utf8'));

db.exec('BEGIN');
db.exec('DELETE FROM runs');
const ins = db.prepare(
  'INSERT INTO runs (phase, kind, started_at, ended_at, model, n_units, note) VALUES (?, ?, ?, ?, ?, ?, ?)'
);
for (const r of runs)
  ins.run(r.phase, r.kind, r.started_at, r.ended_at ?? null, r.model ?? null, r.n_units ?? null, r.note ?? null);
db.exec('COMMIT');

const mins = (a, b) => (new Date(b) - new Date(a)) / 60000;
const done = runs.filter((r) => r.ended_at);
const agent = done.filter((r) => r.kind === 'agent').reduce((a, r) => a + mins(r.started_at, r.ended_at), 0);
const human = done.filter((r) => r.kind === 'human-review').reduce((a, r) => a + mins(r.started_at, r.ended_at), 0);
console.log(`runs: ${runs.length} rows | agent ${agent.toFixed(0)} min, human review ${human.toFixed(0)} min${runs.length > done.length ? ` (${runs.length - done.length} still open)` : ''}`);
