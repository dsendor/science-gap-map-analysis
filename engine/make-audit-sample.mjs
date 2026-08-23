#!/usr/bin/env node
// Build a deterministic stratified audit sample and write blind task files.
//
// Stratified by measurability tier, deliberately oversampling the rare tiers:
// tier-3 and tier-4 calls are where the taxonomy is hardest and where a
// disagreement rate is most informative. Oversampling biases the raw overall
// rate upward, so engine/audit-report.mjs reports per-stratum rates and a
// population-weighted overall rate rather than the raw sample rate.
//
// Selection is every k-th gap by sorted id within each stratum: deterministic,
// reproducible, and independent of anything the labeler decided.
//
// The task files contain Convergent's data only. They never contain our labels —
// an auditor that has seen the answer measures nothing.

import { DatabaseSync } from 'node:sqlite';
import { writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const all = (sql, ...p) => db.prepare(sql).all(...p);

const TARGETS = {
  'Verification contested': 11,
  'Counterfactual required': 1,
  'Proxy only': 9,
  'Directly measurable': 15,
};

const picked = [];
for (const [tier, target] of Object.entries(TARGETS)) {
  const rows = all('SELECT gap_id FROM gap_measurability WHERE tier = ? ORDER BY gap_id', tier);
  const k = Math.max(1, Math.floor(rows.length / target));
  const take = [];
  for (let i = 0; i < rows.length && take.length < target; i += k) take.push(rows[i].gap_id);
  for (let i = 0; take.length < target && i < rows.length; i++) {
    if (!take.includes(rows[i].gap_id)) take.push(rows[i].gap_id);
  }
  picked.push(...take.map((id) => ({ id, stratum: tier })));
  console.log(`${tier.padEnd(26)} ${rows.length} in population, ${take.length} sampled`);
}

// Deal round-robin into three batches so no auditor sees only hard strata.
const BATCHES = 3;
const batches = Array.from({ length: BATCHES }, () => []);
picked.forEach((p, i) => batches[i % BATCHES].push(p));

mkdirSync(`${root}research-log/audit-tasks`, { recursive: true });
const gapRow = db.prepare(`
  SELECT g.id, g.name, g.description, f.name AS field
  FROM gm_gaps g JOIN gm_fields f ON f.id = g.field_id WHERE g.id = ?`);
const caps = db.prepare(`
  SELECT c.name FROM gm_gap_capabilities gc JOIN gm_capabilities c ON c.id = gc.capability_id
  WHERE gc.gap_id = ? ORDER BY c.name`);

batches.forEach((batch, i) => {
  const gaps = batch.map(({ id }) => {
    const g = gapRow.get(id);
    return {
      gap_id: g.id, field: g.field, name: g.name, description: g.description,
      convergent_capabilities: caps.all(id).map((r) => r.name),
    };
  });
  writeFileSync(`${root}research-log/audit-tasks/batch-${i + 1}.json`, JSON.stringify({ batch: i + 1, gaps }, null, 2));
  console.log(`batch-${i + 1}.json: ${gaps.length} gaps`);
});

const manifest = picked.map((p) => ({ gap_id: p.id, stratum: p.stratum }));
writeFileSync(`${root}research-log/audit-tasks/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`\nsample: ${picked.length} of 103 gaps`);
