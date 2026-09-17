#!/usr/bin/env node
// Check a chain pre-registration before committing it, and print what you will need next.
//
// Pre-registration is the first commit of a new critical path: the gap, the axis, the
// axes left out, and the prediction, written before any step exists. The full chain is
// later refused by engine/ingest-critical-paths.mjs unless those fields match exactly.
// This validates the pre-registration on its own, and lists the capabilities Convergent
// attach to the gap, because mapping them to steps comes next and they must be quoted
// by exact name.
//
// Usage: node engine/check-preregistration.mjs research-log/critical-paths/preregistered/<id>.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const file = process.argv[2];
if (!file) {
  console.error('usage: node engine/check-preregistration.mjs research-log/critical-paths/preregistered/<id>.json');
  process.exit(1);
}
const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const reg = JSON.parse(readFileSync(file, 'utf8'));
const errors = [];
const text = (v) => typeof v === 'string' && v.trim().length > 0;

const ALLOWED = new Set(['id', 'gap_id', 'axis', 'axis_kind', 'axes_excluded', 'expectation', 'registered_by', 'registered_on']);
for (const k of Object.keys(reg)) if (!ALLOWED.has(k)) errors.push(`unknown field "${k}"`);
if (!/^path-[a-z0-9-]+$/.test(reg.id ?? '')) errors.push('id must look like "path-lowercase-words"');
if (basename(file) !== `${reg.id}.json`) errors.push(`file must be named ${reg.id}.json`);
for (const k of ['gap_id', 'axis', 'axes_excluded', 'expectation', 'registered_by', 'registered_on']) {
  if (!text(reg[k])) errors.push(`${k} is required`);
}
if (!['time', 'cost'].includes(reg.axis_kind)) errors.push('axis_kind must be "time" or "cost"');

const gap = db.prepare('SELECT name, description FROM gm_gaps WHERE id = ?').get(reg.gap_id ?? '');
if (!gap) errors.push(`gap_id "${reg.gap_id}" is not a gap in the baseline`);

if (errors.length) {
  console.error(`FAILED: ${file}\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

const caps = db.prepare(`SELECT c.name, c.slug FROM gm_gap_capabilities gc
  JOIN gm_capabilities c ON c.id = gc.capability_id WHERE gc.gap_id = ? ORDER BY c.name`).all(reg.gap_id);
console.log(`OK: ${reg.id}`);
console.log(`gap: ${gap.name.replace(/\s+/g, " ").trim()}`);
console.log(`\nCapabilities attached to this gap (${caps.length}). Use these names in each step's "capabilities".`);
console.log('Shown as JSON strings: some of Convergent\'s names contain line breaks that a terminal hides.');
console.log('The ingest matches ignoring whitespace, so the single-line form is fine.');
for (const c of caps) {
  const oneLine = c.name.replace(/\s+/g, ' ').trim();
  const note = oneLine !== c.name ? '   (stored with hidden whitespace)' : '';
  console.log(`  ${JSON.stringify(oneLine)}${note}\n      https://www.gap-map.org/capabilities/${c.slug}/`);
}
console.log('\nNext: commit this file on its own, before writing any step.');
