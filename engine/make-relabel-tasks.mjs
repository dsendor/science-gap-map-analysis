#!/usr/bin/env node
// Blind task files for the full-coverage AI-type relabel. Convergent's data only —
// no v1 labels, no tiers, no outcomes. Batched by field so each agent sees coherent
// context, then packed into N roughly equal batches.
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const N = Number(process.argv.includes('--batches') ? process.argv[process.argv.indexOf('--batches') + 1] : 5);

const gaps = db.prepare(`
  SELECT g.id, g.name, g.description, f.name AS field
  FROM gm_gaps g JOIN gm_fields f ON f.id = g.field_id ORDER BY f.name, g.name`).all();
const caps = db.prepare(`
  SELECT c.name FROM gm_gap_capabilities gc JOIN gm_capabilities c ON c.id = gc.capability_id
  WHERE gc.gap_id = ? ORDER BY c.name`);

const batches = Array.from({ length: N }, () => []);
gaps.forEach((g, i) => batches[i % N].push({
  gap_id: g.id, field: g.field, name: g.name, description: g.description,
  convergent_capabilities: caps.all(g.id).map((r) => r.name),
}));

mkdirSync(`${root}research-log/relabel-tasks`, { recursive: true });
batches.forEach((b, i) => {
  writeFileSync(`${root}research-log/relabel-tasks/batch-${i + 1}.json`, JSON.stringify({ batch: i + 1, gaps: b }, null, 2));
  console.log(`batch-${i + 1}.json: ${b.length} gaps`);
});
console.log(`total ${gaps.length}`);
