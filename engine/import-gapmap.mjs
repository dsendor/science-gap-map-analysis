#!/usr/bin/env node
// Import the Convergent Research export into the gm_* baseline tables, verbatim.
//
// This is the ONLY script permitted to write gm_*. Everything else treats them as
// read-only. Their ids and slugs are preserved exactly so the augmentation can be
// joined back to their source data.
//
// Usage: node engine/import-gapmap.mjs [--snapshot 2026-07-29]

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const snapshot = args.includes('--snapshot') ? args[args.indexOf('--snapshot') + 1] : '2026-07-29';

const root = new URL('..', import.meta.url).pathname;
const DB_PATH = `${root}db/gapmap.sqlite`;
const SRC = `${root}data/baseline/${snapshot}/gapmap-data.json`;

if (!existsSync(SRC)) {
  console.error(`no snapshot at ${SRC}`);
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);
db.exec(readFileSync(`${root}db/schema.sql`, 'utf8'));
db.exec('PRAGMA foreign_keys = ON');

// Re-importing must be safe once Phase 1 labels exist. Dropping the file would
// destroy them, so the baseline is cleared and rebuilt in place instead.
//
// The clear and the reload MUST share one transaction. The augmentation tables hold
// foreign keys into gm_gaps, and defer_foreign_keys postpones the check to COMMIT —
// so committing the deletes separately checks them while gm_gaps is empty and fails
// with FOREIGN KEY constraint failed. Everything below runs inside the single
// transaction opened here and committed after the inserts.
//
// If the snapshot ever drops a gap that carries labels, that one COMMIT fails loudly,
// which is the correct outcome.
db.exec('BEGIN');
db.exec('PRAGMA defer_foreign_keys = ON');
for (const t of [
  'gm_capability_resources', 'gm_gap_capabilities',
  'gm_resources', 'gm_capabilities', 'gm_gaps', 'gm_fields',
]) db.exec(`DELETE FROM ${t}`);

const data = JSON.parse(readFileSync(SRC, 'utf8'));
const { fields, gaps, capabilities, resources, metadata } = data;

const ins = (sql) => db.prepare(sql);
const J = (v) => JSON.stringify(v ?? []);

const insField = ins('INSERT INTO gm_fields (id, name, slug, description) VALUES (?, ?, ?, ?)');
for (const f of fields) insField.run(f.id, f.name, f.slug, f.description ?? null);

const insGap = ins('INSERT INTO gm_gaps (id, name, slug, description, field_id, tags_json) VALUES (?, ?, ?, ?, ?, ?)');
for (const g of gaps) insGap.run(g.id, g.name, g.slug, g.description ?? null, g.field?.id ?? null, J(g.tags));

const insCap = ins('INSERT INTO gm_capabilities (id, name, slug, description, tags_json) VALUES (?, ?, ?, ?, ?)');
for (const c of capabilities) insCap.run(c.id, c.name, c.slug, c.description ?? null, J(c.tags));

const insRes = ins('INSERT INTO gm_resources (id, title, url, summary, types_json) VALUES (?, ?, ?, ?, ?)');
for (const r of resources) insRes.run(r.id, r.title, r.url ?? null, r.summary ?? null, J(r.types));

// Edges. Union of both directions on principle, though the capability side is
// empty in the 2026-07-29 export — see docs/integrity-report.md.
const insGC = ins('INSERT OR IGNORE INTO gm_gap_capabilities (gap_id, capability_id) VALUES (?, ?)');
let fromGapSide = 0, fromCapSide = 0;
for (const g of gaps) for (const cid of g.foundationalCapabilities ?? []) { insGC.run(g.id, cid); fromGapSide++; }
for (const c of capabilities) for (const gid of c.gaps ?? []) { insGC.run(gid, c.id); fromCapSide++; }

const insCR = ins('INSERT OR IGNORE INTO gm_capability_resources (capability_id, resource_id) VALUES (?, ?)');
for (const c of capabilities) for (const rid of c.resources ?? []) insCR.run(c.id, rid);

db.exec('COMMIT');

const count = (t) => db.prepare(`SELECT count(*) AS c FROM ${t}`).get().c;
const actual = {
  fields: count('gm_fields'),
  gaps: count('gm_gaps'),
  capabilities: count('gm_capabilities'),
  resources: count('gm_resources'),
};

console.log(`imported snapshot ${snapshot} (exportDate ${metadata.exportDate})`);
for (const [k, v] of Object.entries(actual)) {
  const declared = metadata.counts[k];
  const ok = declared === v ? 'ok' : `MISMATCH (metadata says ${declared})`;
  console.log(`  ${k.padEnd(13)} ${String(v).padStart(5)}  ${ok}`);
}
console.log(`  edges         ${String(count('gm_gap_capabilities')).padStart(5)}  (gap side ${fromGapSide}, capability side ${fromCapSide})`);
console.log(`  cap-resources ${String(count('gm_capability_resources')).padStart(5)}`);

const mismatched = Object.entries(actual).filter(([k, v]) => metadata.counts[k] !== v);
if (mismatched.length) {
  console.error('\nimport does not match declared counts — refusing to pass');
  process.exit(1);
}
