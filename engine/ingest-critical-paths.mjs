#!/usr/bin/env node
// Ingest one Phase 5 critical path file.
//
// `expectation` is NOT NULL by design and is written in a commit of its own, before
// the link analysis exists. A prediction recorded in advance and then confirmed is
// evidence; the same prediction written afterwards is a story, and git is what makes
// the difference checkable by someone who does not trust us.
//
// Usage: node engine/ingest-critical-paths.mjs research-log/critical-paths/<file>.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node engine/ingest-critical-paths.mjs <file.json>'); process.exit(1); }

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

const batch = JSON.parse(readFileSync(file, 'utf8'));
const known = new Set(db.prepare('SELECT id FROM gm_gaps').all().map((r) => r.id));

db.exec('BEGIN');
let n = 0, links = 0, binding = 0;
try {
  for (const p of batch.paths) {
    if (p.gap_id && !known.has(p.gap_id)) throw new Error(`${p.id}: unknown gap id ${p.gap_id}`);
    db.prepare('DELETE FROM critical_path_links WHERE path_id = ?').run(p.id);
    db.prepare('DELETE FROM critical_paths WHERE id = ?').run(p.id);
    db.prepare(`INSERT INTO critical_paths (id, gap_id, title, axis, axes_excluded, expectation, finding,
                duration_basis, programmes_json, reviewed, axis_kind)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(p.id, p.gap_id ?? null, p.title, p.axis, p.axes_excluded, p.expectation, p.finding ?? null,
           p.duration_basis ?? null, JSON.stringify(p.programmes ?? []), p.reviewed ?? 'ai-only', p.axis_kind ?? 'time');
    for (const [i, l] of (p.links ?? []).entries()) {
      db.prepare(`INSERT INTO critical_path_links
        (path_id, seq, link, blocker, ai_type, maturity, is_binding, evidence, rationale,
         duration_years, duration_span, duration_note, figure, ai_acts, capabilities_json,
         duration_days, duration_span_note, duration_covers_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(p.id, l.seq ?? i + 1, l.link, l.blocker, l.ai_type ?? null, l.maturity ?? null,
             l.is_binding ?? 0, l.evidence ?? null, l.rationale,
             l.duration_jwst_years ?? null, l.duration_jwst_span ?? null, l.duration_note ?? null,
             l.figure ?? null, l.ai_acts ? 1 : 0,
             JSON.stringify(l.capabilities ?? []),
             l.duration_days ?? null, l.duration_span_note ?? null,
             l.duration_covers ? JSON.stringify(l.duration_covers) : null);
      links++;
      if (l.is_binding) binding++;
    }
    n++;
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED: ${e.message}`);
  process.exit(1);
}
console.log(`critical paths: ${n} chain(s), ${links} link(s), ${binding} binding`);
