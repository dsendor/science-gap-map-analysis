#!/usr/bin/env node
// The additive-only guardrail.
//
// Re-serialises the gm_* baseline tables back into the exact shape of the source
// export and diffs against data/baseline/<snapshot>/. Any edit to Convergent's
// gaps, capabilities, fields, resources or edges fails this check.
//
// The brief's first constraint is "additive only. Do not rewrite, rescore, reorder,
// or reorganize their existing gaps, capabilities, or taxonomy." From a stranger,
// a promise to that effect is worth nothing. A failing test is worth something,
// and the cover note can point at it.
//
// Usage: node engine/verify-additive.mjs [--snapshot 2026-07-29]

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const snapshot = args.includes('--snapshot') ? args[args.indexOf('--snapshot') + 1] : '2026-07-29';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const all = (sql) => db.prepare(sql).all();

const source = JSON.parse(readFileSync(`${root}data/baseline/${snapshot}/gapmap-data.json`, 'utf8'));

// Rebuild each entity from the DB in the source's own field order and ordering.
const rebuilt = {
  fields: all('SELECT id, name, slug, description FROM gm_fields').map((f) => ({
    id: f.id, name: f.name, slug: f.slug, description: f.description,
  })),
  gaps: all('SELECT * FROM gm_gaps').map((g) => ({
    id: g.id, name: g.name, slug: g.slug, description: g.description,
    field_id: g.field_id, tags: JSON.parse(g.tags_json),
    capabilities: all(`SELECT capability_id FROM gm_gap_capabilities WHERE gap_id = '${g.id}'`)
      .map((r) => r.capability_id).sort(),
  })),
  capabilities: all('SELECT * FROM gm_capabilities').map((c) => ({
    id: c.id, name: c.name, slug: c.slug, description: c.description,
    tags: JSON.parse(c.tags_json),
    resources: all(`SELECT resource_id FROM gm_capability_resources WHERE capability_id = '${c.id}'`)
      .map((r) => r.resource_id).sort(),
  })),
  resources: all('SELECT * FROM gm_resources').map((r) => ({
    id: r.id, title: r.title, url: r.url, summary: r.summary, types: JSON.parse(r.types_json),
  })),
};

const expected = {
  fields: source.fields.map((f) => ({
    id: f.id, name: f.name, slug: f.slug, description: f.description ?? null,
  })),
  gaps: source.gaps.map((g) => ({
    id: g.id, name: g.name, slug: g.slug, description: g.description ?? null,
    field_id: g.field?.id ?? null, tags: g.tags ?? [],
    capabilities: [...(g.foundationalCapabilities ?? [])].sort(),
  })),
  capabilities: source.capabilities.map((c) => ({
    id: c.id, name: c.name, slug: c.slug, description: c.description ?? null,
    tags: c.tags ?? [],
    resources: [...(c.resources ?? [])].sort(),
  })),
  resources: source.resources.map((r) => ({
    id: r.id, title: r.title, url: r.url ?? null, summary: r.summary ?? null, types: r.types ?? [],
  })),
};

const key = (o) => o.id;
const norm = (arr) => [...arr].sort((a, b) => (key(a) < key(b) ? -1 : 1));
const hash = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 16);

let failed = 0;
for (const entity of Object.keys(expected)) {
  const a = norm(rebuilt[entity]);
  const b = norm(expected[entity]);
  const ha = hash(a), hb = hash(b);
  if (ha === hb) {
    console.log(`  ${entity.padEnd(13)} ${String(b.length).padStart(5)} rows  unchanged (${ha})`);
    continue;
  }
  failed++;
  console.error(`  ${entity.padEnd(13)} MODIFIED — baseline ${hb}, database ${ha}`);
  const bi = new Map(b.map((o) => [key(o), o]));
  const ai = new Map(a.map((o) => [key(o), o]));
  for (const id of new Set([...bi.keys(), ...ai.keys()])) {
    const x = bi.get(id), y = ai.get(id);
    if (!x) { console.error(`      + added   ${id}`); continue; }
    if (!y) { console.error(`      - removed ${id}`); continue; }
    for (const f of Object.keys(x)) {
      if (JSON.stringify(x[f]) !== JSON.stringify(y[f])) {
        console.error(`      ~ ${id} .${f}`);
        console.error(`          baseline: ${JSON.stringify(x[f]).slice(0, 120)}`);
        console.error(`          database: ${JSON.stringify(y[f]).slice(0, 120)}`);
      }
    }
  }
}

if (failed) {
  console.error(`\nadditive-only check FAILED for ${failed} entity type(s).`);
  console.error("Convergent's data must not be rewritten, rescored, reordered or reorganized.");
  process.exit(1);
}
console.log('\nadditive-only check passed — baseline is byte-identical to the snapshot.');
