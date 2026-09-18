#!/usr/bin/env node
// Ingest critical-path files, and refuse anything that would render wrong.
//
// This used to accept almost anything. Two failures were proven before this rewrite:
// a new time chain that wrote `duration_years` had every duration stored as NULL,
// because only the JWST-specific `duration_jwst_years` was read; and a misspelled
// capability that was not even attached to the gap was stored without complaint. Both
// would have shipped as a chain that looked finished and was not. So every problem is
// collected and reported together, and nothing is written unless the file is clean.
//
// The contract this enforces is written out in methodology/chain-schema.md.
//
// `expectation` is required and is committed on its own, before the steps exist. A
// prediction recorded in advance and then confirmed is evidence; the same prediction
// written afterwards is a story, and git is what makes the difference checkable.
//
// Usage: node engine/ingest-critical-paths.mjs research-log/critical-paths/<file>.json

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node engine/ingest-critical-paths.mjs <file.json>');
  process.exit(1);
}

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
db.exec('PRAGMA foreign_keys = ON');

// Stored names. The site displays different ones (see engine/export-artifact.mjs);
// a chain must use these, and a display name gets a pointed error below.
const KINDS = [
  'LLM reasoning and synthesis', 'ML surrogates and prediction', 'Design and optimization search',
  'Sensing and signal processing', 'Autonomous experimentation',
  'Real-time control of physical systems', 'Physical build and manipulation',
  'Coordination and institutional',
];
const DISPLAY_TO_STORED = {
  'Reading and synthesis': 'LLM reasoning and synthesis',
  'Prediction and modeling': 'ML surrogates and prediction',
  'Design search': 'Design and optimization search',
  'Measurement and sensing': 'Sensing and signal processing',
  'Running experiments': 'Autonomous experimentation',
  'Real-time control': 'Real-time control of physical systems',
  'Physical build': 'Physical build and manipulation',
  'Coordination and institutions': 'Coordination and institutional',
};
const MATURITIES = ['Working now', '2-5 years', 'Speculative'];

const PATH_KEYS = new Set([
  'id', 'gap_id', 'title', 'axis', 'axis_kind', 'axes_excluded', 'expectation', 'finding',
  'duration_basis', 'programmes', 'reviewed', 'status', 'links',
]);
const LINK_KEYS = new Set([
  'seq', 'link', 'blocker', 'ai_acts', 'ai_type', 'maturity', 'is_binding', 'capabilities',
  'evidence', 'rationale', 'figure', 'confidence',
  'duration_years', 'duration_span', 'duration_note',
  'duration_days', 'duration_span_note', 'duration_covers', 'cost_value', 'cost_unit',
  // Legacy names from the first chain, which was JWST-specific. Accepted so that file
  // still loads; new chains use duration_years and duration_span.
  'duration_jwst_years', 'duration_jwst_span',
]);

const text = (v) => typeof v === 'string' && v.trim().length > 0;

const batch = JSON.parse(readFileSync(file, 'utf8'));
const knownGaps = new Set(db.prepare('SELECT id FROM gm_gaps').all().map((r) => r.id));
const capsFor = (gapId) =>
  db.prepare(`SELECT c.name FROM gm_gap_capabilities gc
              JOIN gm_capabilities c ON c.id = gc.capability_id
              WHERE gc.gap_id = ? ORDER BY c.name`).all(gapId).map((r) => r.name);

// Nine of Convergent's capability names contain a line break or a leading space, e.g.
// "Universal Latent Variable Model of\n  Cellular State". Printed in a terminal they look
// like ordinary names, so an agent typing what it sees was rejected. Names are matched
// ignoring whitespace, and the exact stored name is what gets written, because the
// export looks capabilities up by that name. Their data is never edited.
const norm = (x) => String(x).replace(/\s+/g, ' ').trim();

// Pre-registration. A new chain's axis and expectation are committed first, in
// research-log/critical-paths/preregistered/<id>.json, before any step exists. rebuild
// does not read that folder. When the full chain arrives, these fields must match what
// was registered exactly: changing the prediction after seeing the steps would turn
// evidence back into a story, and if the chain refutes the expectation, the place to
// say so is `finding`. The two original chains predate this folder; their ordering is
// in git, at commit bbfa54f.
const LEGACY_UNREGISTERED = new Set(['path-telescope-elapsed-time', 'path-publishing-cost']);
const REGISTERED_FIELDS = ['gap_id', 'axis', 'axis_kind', 'axes_excluded', 'expectation'];

const errors = [];
const seenIds = new Set();

for (const p of batch.paths ?? []) {
  const where = p.id ?? '(path with no id)';
  const err = (m) => errors.push(`${where}: ${m}`);

  for (const k of Object.keys(p)) if (!PATH_KEYS.has(k)) err(`unknown field "${k}"`);
  if (!/^path-[a-z0-9-]+$/.test(p.id ?? '')) err('id must look like "path-lowercase-words"');
  if (seenIds.has(p.id)) err('duplicate path id');
  seenIds.add(p.id);
  if (!knownGaps.has(p.gap_id)) err(`gap_id "${p.gap_id}" is not a gap in the baseline`);
  for (const k of ['title', 'axis', 'axes_excluded', 'expectation']) if (!text(p[k])) err(`${k} is required`);
  if (!['time', 'cost'].includes(p.axis_kind)) {
    err('axis_kind is required and must be "time" or "cost" (it no longer defaults to "time")');
  }
  if (p.reviewed !== undefined && !['ai-only', 'human'].includes(p.reviewed)) {
    err('reviewed must be "ai-only" or "human"');
  }
  const legacy = LEGACY_UNREGISTERED.has(p.id);
  if (p.status !== undefined ? !['draft', 'complete'].includes(p.status) : !legacy) {
    err('status is required and must be "draft" (not exported) or "complete"');
  }
  if (!LEGACY_UNREGISTERED.has(p.id) && /^path-[a-z0-9-]+$/.test(p.id ?? '')) {
    const regPath = `${root}research-log/critical-paths/preregistered/${p.id}.json`;
    if (!existsSync(regPath)) {
      err(`no pre-registration at research-log/critical-paths/preregistered/${p.id}.json. ` +
        'Commit the axis and expectation there first (methodology/critical-path.md, step 4).');
    } else {
      const reg = JSON.parse(readFileSync(regPath, 'utf8'));
      for (const k of REGISTERED_FIELDS) {
        if (reg[k] !== p[k]) {
          err(`${k} differs from the pre-registration. Do not edit a registered prediction; ` +
            'if the chain contradicts it, say so in `finding`.');
        }
      }
    }
  }
  if (!Array.isArray(p.links) || p.links.length === 0) {
    err('links must be a non-empty array');
    continue;
  }

  const isTime = p.axis_kind === 'time';
  const validCaps = knownGaps.has(p.gap_id) ? capsFor(p.gap_id) : [];
  const n = p.links.length;
  const covered = new Map();

  p.links.forEach((l, i) => {
    const at = `step ${l.seq ?? i + 1}`;
    const lerr = (m) => err(`${at}: ${m}`);

    for (const k of Object.keys(l)) if (!LINK_KEYS.has(k)) lerr(`unknown field "${k}"`);
    if (l.seq !== i + 1) lerr(`seq must be ${i + 1}; steps are numbered 1..${n} in order`);
    for (const k of ['link', 'blocker', 'rationale']) if (!text(l[k])) lerr(`${k} is required`);
    if (typeof l.ai_acts !== 'boolean') lerr('ai_acts is required and must be true or false');
    if (l.confidence !== undefined ? !['confident', 'guess'].includes(l.confidence)
        : !LEGACY_UNREGISTERED.has(p.id)) {
      lerr('confidence is required and must be "confident" or "guess" (CLAUDE.md, rule 6)');
    }

    if (l.ai_type !== undefined && !KINDS.includes(l.ai_type)) {
      const hint = DISPLAY_TO_STORED[l.ai_type]
        ? ` — that is the display name; use "${DISPLAY_TO_STORED[l.ai_type]}"`
        : ` — must be one of: ${KINDS.join(' | ')}`;
      lerr(`ai_type "${l.ai_type}" is not a stored value${hint}`);
    }
    if (l.maturity !== undefined && !MATURITIES.includes(l.maturity)) {
      lerr(`maturity "${l.maturity}" must be one of: ${MATURITIES.join(' | ')}`);
    }
    if (l.is_binding !== undefined && ![0, 1].includes(l.is_binding)) lerr('is_binding must be 0 or 1');
    if (isTime && l.is_binding === 1) {
      lerr('is_binding is not used on a time chain; every step adds to the total (methodology/critical-path.md)');
    }

    if (l.capabilities !== undefined && !Array.isArray(l.capabilities)) lerr('capabilities must be an array of names');
    l._canonicalCaps = [];
    for (const c of Array.isArray(l.capabilities) ? l.capabilities : []) {
      const match = validCaps.find((v) => norm(v) === norm(c));
      if (match) l._canonicalCaps.push(match);
      else {
        lerr(`capability ${JSON.stringify(c)} is not attached to this gap. Attached: ` +
          (validCaps.map((x) => JSON.stringify(norm(x))).join(', ') || '(none)'));
      }
    }

    // Durations. Each axis has one field the renderer reads; a value in the other one
    // is silently ignored on the page, so it is an error here.
    if (l.duration_years !== undefined && l.duration_jwst_years !== undefined &&
        l.duration_years !== l.duration_jwst_years) {
      lerr('duration_years and legacy duration_jwst_years disagree; use duration_years only');
    }
    const years = l.duration_years ?? l.duration_jwst_years;
    if (!isTime && years != null) lerr('duration_years on a cost chain is never displayed; use cost_value, or duration_days where elapsed time is a fair stand-in');
    if (isTime && l.duration_days != null) lerr('duration_days on a time chain is never displayed; use duration_years');
    if (isTime && (l.cost_value != null || l.cost_unit != null)) lerr('cost_value is never displayed on a time chain');
    if (l.cost_value != null && !text(l.cost_unit)) lerr('cost_value needs a cost_unit, e.g. "reviewer-hours per paper" or "USD per experiment"');
    if (l.cost_value == null && text(l.cost_unit)) lerr('cost_unit is set with no cost_value');
    if (!isTime && l.cost_value != null && l.duration_days != null) {
      lerr('a step shows one number: cost_value or duration_days, not both');
    }
    // What the step displays on this axis, and what duration_covers therefore spans.
    const value = isTime ? years : (l.cost_value ?? l.duration_days);
    if (value != null && (typeof value !== 'number' || value < 0)) lerr('duration must be a non-negative number');
    if ((value != null || text(l.figure)) && !text(l.evidence)) {
      lerr('a step carrying a number needs evidence naming its source');
    }

    if (l.duration_covers != null) {
      const c = l.duration_covers;
      const ok = Array.isArray(c) && c.length > 0 && c.every(Number.isInteger);
      if (!ok) lerr('duration_covers must be a non-empty array of step numbers');
      else {
        // The table renders a covering figure as a rowspan, which only spans downward.
        if (c[0] !== l.seq) lerr(`duration_covers must start at this step (${l.seq}), got ${c[0]}`);
        if (c.some((s, j) => j > 0 && s !== c[j - 1] + 1)) lerr('duration_covers must be consecutive steps');
        if (c.some((s) => s < 1 || s > n)) lerr(`duration_covers refers to a step outside 1..${n}`);
        if (value == null) lerr('duration_covers is set but this step carries no duration');
        for (const s of c) {
          if (covered.has(s)) lerr(`step ${s} is already covered by step ${covered.get(s)}`);
          covered.set(s, l.seq);
        }
      }
    }
  });
}

if (!Array.isArray(batch.paths) || batch.paths.length === 0) errors.push('file has no "paths" array');

if (errors.length) {
  console.error(`FAILED: ${file}\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

db.exec('BEGIN');
let chains = 0, links = 0;
try {
  for (const p of batch.paths) {
    db.prepare('DELETE FROM critical_path_links WHERE path_id = ?').run(p.id);
    db.prepare('DELETE FROM critical_paths WHERE id = ?').run(p.id);
    db.prepare(`INSERT INTO critical_paths (id, gap_id, title, axis, axes_excluded, expectation, finding,
                duration_basis, programmes_json, reviewed, axis_kind, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(p.id, p.gap_id, p.title, p.axis, p.axes_excluded, p.expectation, p.finding ?? null,
           p.duration_basis ?? null, JSON.stringify(p.programmes ?? []), p.reviewed ?? 'ai-only',
           p.axis_kind, p.status ?? 'complete');
    for (const l of p.links) {
      db.prepare(`INSERT INTO critical_path_links
        (path_id, seq, link, blocker, ai_type, maturity, is_binding, evidence, rationale,
         duration_years, duration_span, duration_note, figure, ai_acts, capabilities_json,
         duration_days, duration_span_note, duration_covers_json, confidence,
         cost_value, cost_unit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(p.id, l.seq, l.link, l.blocker, l.ai_type ?? null, l.maturity ?? null,
             l.is_binding ?? 0, l.evidence ?? null, l.rationale,
             l.duration_years ?? l.duration_jwst_years ?? null,
             l.duration_span ?? l.duration_jwst_span ?? null, l.duration_note ?? null,
             l.figure ?? null, l.ai_acts ? 1 : 0, JSON.stringify(l._canonicalCaps ?? []),
             l.duration_days ?? null, l.duration_span_note ?? null,
             l.duration_covers ? JSON.stringify(l.duration_covers) : null, l.confidence ?? null,
             l.cost_value ?? null, l.cost_unit ?? null);
      links++;
    }
    chains++;
  }
  db.exec('COMMIT');
} catch (e) {
  db.exec('ROLLBACK');
  console.error(`FAILED: ${file}: ${e.message}`);
  process.exit(1);
}
console.log(`critical paths: ${chains} chain(s), ${links} step(s) from ${file.split('/').pop()}`);
