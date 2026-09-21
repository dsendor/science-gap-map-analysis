#!/usr/bin/env node
// Emit the two artifacts a stranger can use without this repo:
//
//   app/public/data.json   everything the static site renders
//   app/public/gap-map-augmented.csv
//     one row per gap, keyed on THEIR id and slug so it joins straight back to
//     their source export. That is the whole point of preserving their keys.
//
// No ordering anywhere is by anything that could read as a rank. Gaps come out in
// the order their export has them.
//
// Usage: node engine/export-artifact.mjs

import { DatabaseSync } from 'node:sqlite';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const all = (s, ...p) => db.prepare(s).all(...p);

// Their export order, preserved. Any other default order is an editorial act.
const exportOrder = JSON.parse(readFileSync(`${root}data/baseline/2026-07-29/gapmap-data.json`, 'utf8'))
  .gaps.map((g) => g.id);
const rank = Object.fromEntries(exportOrder.map((id, i) => [id, i]));

const gaps = all(`
  SELECT g.id, g.slug, g.name, g.description, f.name AS field,
         o.outcome, o.rationale AS outcome_rationale, o.confidence AS outcome_confidence,
         m.tier, m.rationale AS tier_rationale, m.confidence AS tier_confidence
  FROM gm_gaps g
  LEFT JOIN gm_fields f ON f.id = g.field_id
  LEFT JOIN gap_outcomes o ON o.gap_id = g.id
  LEFT JOIN gap_measurability m ON m.gap_id = g.id`);

const aiTypes = all('SELECT * FROM gap_ai_types');
const byGap = (rows) => rows.reduce((a, r) => ((a[r.gap_id] ??= []).push(r), a), {});
const aiByGap = byGap(aiTypes);
const indByGap = byGap(all('SELECT * FROM gap_indicators'));
const capsByGap = byGap(all(`
  SELECT gc.gap_id, c.id, c.name, c.description
  FROM gm_gap_capabilities gc JOIN gm_capabilities c ON c.id = gc.capability_id`));

// ---------------------------------------------------------------------------
// Rationales, said in words a reader outside this repo can resolve.
//
// The labelling run recorded how each label was settled, and the record is
// accurate: two passes, a mechanical adjudication rule, a maturity repair. That
// vocabulary belongs in research-log/, which is the record of what happened, and
// it is the reason it is not rewritten there. What it does not belong in is the
// answer to "why these labels" on a public card, where "v2 taken because it had
// the complete eight-category taxonomy available" tells a reader nothing about
// their gap and several things about our process. A clarity audit found this text
// on 102 of 103 gaps.
//
// So the record stays and the published sentence is translated here. Every rule
// below preserves what was decided and what was disagreed about; only the internal
// names for the passes come out. Anything the rules do not recognise is published
// unchanged, so a substantive rationale can never be silently dropped.
const readableRationale = (raw) => {
  if (!raw) return raw;
  let t = String(raw).trim();

  // "both independent passes agreed" — 88 of them, and the whole rationale.
  if (/^both independent passes agreed\.?$/i.test(t)) {
    return 'Two readers labelled this gap separately and reached the same answer.';
  }

  // "Independent passes disagreed (type: A vs B; ). v2 taken because …; flagged
  // guess because …" — note the empty clause before the bracket, which is a bug in
  // the string builder rather than a missing thought.
  const split = t.match(
    /^Independent passes disagreed \((type|maturity): (.+?)\s+vs\s+(.+?);\s*\)\.\s*v2 taken[^.]*\.\s*(.*)$/i
  );
  if (split) {
    const [, dimension, a, b] = split;
    const what =
      dimension.toLowerCase() === 'maturity'
        ? 'on how soon AI could move this gap'
        : 'on what kind of work is in the way';
    // The "flagged guess" clause sits inside the same sentence as "v2 taken", so it
    // is looked for in the whole string rather than in what is left after it.
    const rest = /flagged guess/i.test(t)
      ? ' The label is flagged a guess because the two readings did not converge.'
      : '';
    return `Two readers labelled this gap separately and split ${what}, between ${a} and ${b}. ${b} was taken.${rest}`;
  }

  // "Maturity re-adjudicated on the merits (v1 X / v2 Y; mechanical rule had given
  // Z). <the actual reasoning> Type unchanged from the mechanical adjudication."
  // The reasoning in the middle is the part worth reading, so it leads.
  const readj = t.match(
    /^Maturity re-adjudicated on the merits \(v1 (.+?) \/ v2 (.+?);[^)]*\)\.\s*(.*)$/i
  );
  if (readj) {
    const [, v1, v2, body] = readj;
    const substance = body
      .replace(/\s*Type unchanged(?: from the mechanical adjudication)?\.?\s*$/i, '')
      .trim();
    const split_note = `Two readers split on how soon AI could move this gap, between ${v1} and ${v2}.`;
    return substance ? `${substance} ${split_note}` : split_note;
  }

  // The audit rounds were lettered A to D in the record. A reader has no way to
  // resolve a letter, and does not need to: what matters is that somebody checked the
  // row and what they concluded. Same for the field names that leak out of the
  // indicator rows, and for the author's first name, which appears on the masthead
  // but not as an authority a rationale can cite without introducing him.
  t = t
    .replace(/\bREVISED after Gate [ABCD],?\s*(which\s+)?/gi, 'Revised after a second reader ')
    .replace(/\bNULL CORROBORATED by Gate [ABCD]\b/gi, 'Null corroborated by a second reader')
    .replace(/\bCONTESTED after Gate [ABCD]\b/gi, 'Contested by a second reader')
    .replace(/\bGate [ABCD] (found|re-fetched|graded|established|corrected)\b/gi, 'A second reader $1')
    .replace(/\bGate [ABCD]\b/gi, 'a second reader')
    .replace(/\bthe gates\b/gi, 'these checks')
    // The chains were numbered while there were two of them. The site names them by
    // gap, so the numbers resolve to nothing a reader can see.
    .replace(/\bchain 1\b/gi, 'the telescope chain')
    .replace(/\bchain 2\b/gi, 'the publishing chain')
    .replace(/\bis_binding\b/g, 'the carries-the-cost flag')
    .replace(/\bai_acts\b/g, 'the AI-reaches-it flag')
    .replace(/\bre-adjudicat(ing|ed|ion)\b/gi, (_m, tail) => `re-decid${tail === 'ion' ? 'ing' : tail}`)
    .replace(/\bdecided by David\b/gi, 'decided by the author rather than by a model')
    .replace(/\bDavid ruled\b/g, 'The author ruled')
    .replace(/\bDavid notes\b/g, 'The author notes')
    .replace(/\bDavid\b/g, 'the author')
    // A repo path is not evidence to somebody reading a website, and the note about
    // an empty table is an internal defect report that escaped onto a public page.
    .replace(
      /\(recorded in research-log\/[^)]*?\)/gi,
      '(the six searches are recorded in the public repository)'
    )
    .replace(/\s*—\s*the search_log database table is empty, so that file is the provenance/gi, '')
    .replace(/\bresearch-log\/[A-Za-z0-9._\/-]+/g, 'the public repository')
    .replace(/\bengine\/[A-Za-z0-9._-]+\.mjs/g, 'the build scripts')
    // "Grepped … on /a|b|c/" prints a regular expression at a reader. The terms are
    // the useful part, so they are kept and the delimiters and pipes are not.
    .replace(/\bGrepped\b/g, 'Searched')
    .replace(/ on \/([^/]+)\/\./g, (_m, terms) => {
      const list = terms.split('|').map((x) => x.trim()).filter(Boolean);
      const last = list.pop();
      return ` for ${list.join(', ')} and ${last}.`;
    })
    .replace(/\bsource_checked\b/g, 'the source-check field');

  // Everything else: take out the internal names sentence by sentence and leave the
  // reasoning alone.
  t = t
    .replace(/\bthe mechanical rule\b/gi, 'the automatic tie-break')
    .replace(/\bthe mechanical adjudication\b/gi, 'the automatic tie-break')
    .replace(/\bthe maturity repair\b/gi, 'a later re-reading of the maturity labels')
    .replace(/\bv1 said\b/gi, 'the first reader said')
    .replace(/\bv2 said\b/gi, 'the second reader said')
    .replace(/\bv1\b/gi, 'the first reading')
    .replace(/\bv2\b/gi, 'the second reading')
    .replace(/\bindependent passes\b/gi, 'the two readers')
    .replace(/\bre-adjudicated\b/gi, 're-decided')
    .replace(/\s*Type unchanged(?: from the automatic tie-break)?\.?\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return t;
};

// The same translation, applied to the two other places the internal vocabulary
// reaches a reader: the decision ledger on the method page, and the checks behind each
// proposed gap. Both are our own prose, and both were written for a reader who had the
// repo open.
const readableFields = (row, keys) => {
  const out = { ...row };
  for (const k of keys) if (typeof out[k] === 'string') out[k] = readableRationale(out[k]);
  return out;
};

const enriched = gaps
  .map((g) => {
    const types = (aiByGap[g.id] ?? []).map(({ gap_id, created_at, labeled_by, ...t }) => ({
      ...t,
      rationale: readableRationale(t.rationale),
    }));
    const primary = types.find((t) => t.is_primary === 1) ?? null;
    return {
      ...g,
      is_new: 0,
      ai_types: types,
      primary_ai_type: primary?.ai_type ?? null,
      primary_maturity: primary?.maturity ?? null,
      primary_rationale: primary?.rationale ?? null,
      primary_confidence: primary?.confidence ?? null,
      indicators: (indByGap[g.id] ?? []).map(({ gap_id, created_at, ...i }) => ({
        ...i,
        rationale: readableRationale(i.rationale),
      })),
      capabilities: (capsByGap[g.id] ?? []).map(({ gap_id, ...c }) => c),
    };
  })
  .sort((a, b) => rank[a.id] - rank[b.id]);

const newGaps = all(`
  SELECT n.*, f.name AS field FROM new_gaps n JOIN gm_fields f ON f.id = n.field_id
  ORDER BY n.created_at, n.id`);

// Capability name -> slug, so a chain step can deep-link to their page for it.
const capBySlugName = new Map(
  all('SELECT name, slug FROM gm_capabilities').map((c) => [c.name, c])
);

// The named things already being built for each capability, from their own resource
// table. A step showing "3 capabilities" is an abstraction; a step showing PREreview
// and APPRAISE is a step a reader can go and check. Only resources typed Initiative,
// because a paper about a capability is not somebody building it.
const initiativesByCap = new Map();
for (const r of all(`
  SELECT c.name AS cap, r.title, r.url, r.types_json
  FROM gm_capability_resources cr
  JOIN gm_capabilities c ON c.id = cr.capability_id
  JOIN gm_resources r ON r.id = cr.resource_id
  ORDER BY c.name, r.title`)) {
  if (!JSON.parse(r.types_json || '[]').includes('Initiative')) continue;
  if (!initiativesByCap.has(r.cap)) initiativesByCap.set(r.cap, new Map());
  // gm_capability_resources holds the same capability/title pair twice for three
  // capabilities, so a plain push emits duplicate initiatives and duplicate React keys.
  initiativesByCap.get(r.cap).set(r.title, { title: r.title, url: r.url });
}

// Drafts are validated on ingest but never exported, so a partly researched chain
// cannot reach the public JSON or the site looking finished.
const paths = all("SELECT * FROM critical_paths WHERE status = 'complete' ORDER BY id").map((p) => ({
  ...p,
  programmes: JSON.parse(p.programmes_json || '[]'),
  gap_name: gaps.find((g) => g.id === p.gap_id)?.name ?? null,
  gap_field: gaps.find((g) => g.id === p.gap_id)?.field ?? null,
  // Their slug, not one of ours. The site routes a gap's critical paths at
  // /critical-paths/<slug>/ so the URL joins back to gap-map.org/gaps/<slug>/ and
  // stays stable if we ever rename a chain id.
  gap_slug: gaps.find((g) => g.id === p.gap_id)?.slug ?? null,
  links: all('SELECT * FROM critical_path_links WHERE path_id = ? ORDER BY seq', p.id).map((l) => ({
    ...l,
    capabilities: JSON.parse(l.capabilities_json || '[]'),
    duration_covers: JSON.parse(l.duration_covers_json || 'null'),
    // Their capability pages, built from the slug we preserved on import. Confirmed
    // to resolve: https://www.gap-map.org/capabilities/<slug>/ returns 200.
    capability_links: JSON.parse(l.capabilities_json || '[]').map((name) => {
      const row = capBySlugName.get(name);
      return {
        name,
        url: row ? `https://www.gap-map.org/capabilities/${row.slug}/` : null,
        initiatives: [...(initiativesByCap.get(name)?.values() ?? [])],
      };
    }),
  })),
}));

const count = (rows, key) => rows.reduce((a, r) => ((a[r[key]] = (a[r[key]] ?? 0) + 1), a), {});
const crosstab = (rows, rk, ck) => rows.reduce((a, r) => {
  ((a[r[rk]] ??= {})[r[ck]] ??= 0), a[r[rk]][r[ck]]++;
  return a;
}, {});

const withPrimary = enriched.filter((g) => g.primary_ai_type);
const summary = {
  n_gaps: enriched.length,
  n_fields: new Set(enriched.map((g) => g.field)).size,
  n_capabilities: db.prepare('SELECT count(*) c FROM gm_capabilities').get().c,
  n_edges: db.prepare('SELECT count(*) c FROM gm_gap_capabilities').get().c,
  n_new_gaps: newGaps.length,
  n_indicators: db.prepare('SELECT count(*) c FROM gap_indicators').get().c,
  n_indicator_nulls: db.prepare('SELECT count(*) c FROM gap_indicators WHERE is_null_result=1').get().c,
  tier: count(enriched.filter((g) => g.tier), 'tier'),
  ai_type: count(withPrimary, 'primary_ai_type'),
  maturity: count(withPrimary, 'primary_maturity'),
  tier_by_ai_type: crosstab(withPrimary.filter((g) => g.tier), 'primary_ai_type', 'tier'),
  tier_by_field: crosstab(enriched.filter((g) => g.tier), 'field', 'tier'),
  maturity_by_ai_type: crosstab(withPrimary, 'primary_ai_type', 'primary_maturity'),
  confidence: {
    outcome: count(enriched.filter((g) => g.outcome_confidence), 'outcome_confidence'),
    tier: count(enriched.filter((g) => g.tier_confidence), 'tier_confidence'),
    primary_ai_type: count(withPrimary, 'primary_confidence'),
  },
};

const audits = all(`
  SELECT a.gap_id, a.dimension, a.original, a.audit, a.agreed, a.adjudicated, a.auditor_note, g.name AS gap_name
  FROM audits a JOIN gm_gaps g ON g.id = a.gap_id`);

// Audit rates, computed the same way as engine/audit-report.mjs. The sample
// deliberately oversamples the rare tiers, so the raw rate is biased upward and the
// population-weighted figure is the one that means anything. Both are exported;
// publishing only the flattering one would defeat the point of running the audit.
const manifest = JSON.parse(readFileSync(`${root}research-log/audit-tasks/manifest.json`, 'utf8'));
const stratumOf = Object.fromEntries(manifest.map((m) => [m.gap_id, m.stratum]));
const TIERS = ['Directly measurable', 'Proxy only', 'Verification contested', 'Counterfactual required'];

const auditSummary = { n_sampled: manifest.length, n_population: enriched.length, dimensions: {} };
for (const dim of ['measurability', 'ai_type']) {
  const rows = audits.filter((a) => a.dimension === dim);
  if (!rows.length) continue;
  const agreed = rows.filter((r) => r.agreed).length;
  const entry = {
    n: rows.length,
    agreed,
    raw_disagreement: (rows.length - agreed) / rows.length,
    strata: [],
    weighted_disagreement: null,
    disagreements: rows.filter((r) => !r.agreed).map((r) => ({ gap: r.gap_name.replace(/\s+/g, ' '), original: r.original, audit: r.audit })),
  };
  if (dim === 'measurability') {
    let weighted = 0, popTotal = 0;
    for (const tier of TIERS) {
      const inStratum = rows.filter((r) => stratumOf[r.gap_id] === tier);
      if (!inStratum.length) continue;
      const pop = summary.tier[tier] ?? 0;
      const a = inStratum.filter((r) => r.agreed).length;
      const dis = (inStratum.length - a) / inStratum.length;
      weighted += dis * pop; popTotal += pop;
      entry.strata.push({ stratum: tier, population: pop, sampled: inStratum.length, agreed: a, disagreement: dis });
    }
    entry.weighted_disagreement = weighted / popTotal;
  }
  auditSummary.dimensions[dim] = entry;
}

// The v1/v2 relabel comparison. The working-now gradient was the headline of the first
// pass and did not survive an independent full-coverage relabel, so the two passes are
// exported side by side rather than the surviving one being shown alone.
const relabelRows = all('SELECT * FROM relabels');
let relabel = null;
if (relabelRows.length) {
  const share = (rows, typeKey, matKey) => {
    const by = {};
    for (const r of rows) {
      const t = r[typeKey];
      if (!t) continue;
      (by[t] ??= { n: 0, now: 0 });
      by[t].n++;
      if (r[matKey] === 'Working now') by[t].now++;
    }
    return by;
  };
  relabel = {
    n: relabelRows.length,
    type_agreed: relabelRows.filter((r) => r.type_agreed).length,
    maturity_agreed: relabelRows.filter((r) => r.maturity_agreed).length,
    v1: share(relabelRows, 'v1_type', 'v1_maturity'),
    v2: share(relabelRows, 'adjudicated_type', 'adjudicated_maturity'),
  };
}

const out = {
  generated_at: new Date().toISOString().slice(0, 10),
  source: {
    name: 'Convergent Research — Fundamental Development Gap Map',
    version: 'v1.0',
    url: 'https://www.gap-map.org/',
    snapshot: '2026-07-29',
  },
  summary,
  gaps: enriched,
  new_gaps: newGaps.map((r) =>
    readableFields(r, [
      'rationale',
      'nearest',
      'tension_test',
      'unlock_test',
      'dedup_check',
      'funding_check',
    ])
  ),
  critical_paths: paths,
  audits,
  audit_summary: auditSummary,
  relabel,
  decisions: all(
    'SELECT phase, decision, rationale, runner_up, confidence, reversal_condition FROM decisions ORDER BY id'
  ).map((r) => readableFields(r, ['decision', 'rationale', 'runner_up', 'reversal_condition'])),
  runs: all('SELECT phase, kind, started_at, ended_at, n_units, note FROM runs ORDER BY id'),
};

mkdirSync(`${root}app/public`, { recursive: true });
// ---------------------------------------------------------------------------
// Display names for the eight categories.
//
// The stored enum names six of the eight after the AI that would do the work
// ("LLM reasoning and synthesis") and two after the work itself ("Physical build
// and manipulation"). The column means the second thing in both cases: the kind of
// work standing in the way. Named the first way it reads as a claim that AI does
// this, which is why "Coordination and institutional" looked out of place next to
// the others -- it was the only pair naming the same thing consistently.
//
// Renamed here rather than in the schema so the CHECK constraints, the research-log
// files and every stored judgment stay exactly as written and the change is one
// line to revert. The walk below rewrites values AND object keys, so summary
// buckets, cross-tab rows, chain links and per-gap labels all move together and no
// render site can be missed by hand.
const WORK_LABEL = {
  'LLM reasoning and synthesis': 'Reading and synthesis',
  'ML surrogates and prediction': 'Prediction and modeling',
  'Design and optimization search': 'Design search',
  'Sensing and signal processing': 'Measurement and sensing',
  'Autonomous experimentation': 'Running experiments',
  'Real-time control of physical systems': 'Real-time control',
  'Physical build and manipulation': 'Physical build',
  'Coordination and institutional': 'Coordination and institutions',
};
// Rationales refer to the categories by name too ("Independent passes disagreed
// (type: Design and optimization search vs ML surrogates and prediction)"), so the
// walk substitutes inside strings as well as replacing whole ones. Those are
// category references, not prose, and leaving them would show a reader one name in
// the label and a different one in the reason for it. The research-log files keep
// the original wording; only this emitted copy is renamed.
const WORK_PAIRS = Object.entries(WORK_LABEL);
const relabelWork = (v) => {
  if (typeof v === 'string') {
    if (WORK_LABEL[v]) return WORK_LABEL[v];
    let out = v;
    for (const [from, to] of WORK_PAIRS) out = out.split(from).join(to);
    return out;
  }
  if (Array.isArray(v)) return v.map(relabelWork);
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [WORK_LABEL[k] ?? k, relabelWork(x)])
    );
  }
  return v;
};

writeFileSync(`${root}app/public/data.json`, JSON.stringify(relabelWork(out)));

// ---- CSV: one row per gap, keyed on their id and slug ------------------------
const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const cols = [
  'gap_id', 'gap_slug', 'gap_name', 'field', 'is_new_proposed_gap',
  'outcome', 'outcome_rationale', 'outcome_confidence',
  'primary_ai_type', 'primary_ai_maturity', 'primary_ai_rationale', 'primary_ai_confidence',
  'measurability_tier', 'measurability_rationale', 'measurability_confidence',
  'secondary_ai_types', 'indicator_quantity', 'indicator_value', 'indicator_unit',
  'indicator_as_of', 'indicator_source_url', 'indicator_is_null_result',
];
const rows = [
  ...enriched.map((g) => {
    const i = g.indicators[0] ?? {};
    return [
      g.id, g.slug, g.name, g.field, 0,
      g.outcome, g.outcome_rationale, g.outcome_confidence,
      g.primary_ai_type, g.primary_maturity, g.primary_rationale, g.primary_confidence,
      g.tier, g.tier_rationale, g.tier_confidence,
      g.ai_types.filter((t) => !t.is_primary).map((t) => `${t.ai_type} (${t.maturity})`).join('; '),
      i.quantity ?? '', i.current_value ?? '', i.unit ?? '',
      i.as_of ?? '', i.source_url ?? '', i.is_null_result ?? '',
    ];
  }),
  ...newGaps.map((n) => [
    n.id, n.slug, n.name, n.field, 1,
    n.outcome, n.rationale, n.confidence,
    n.ai_type, n.maturity, n.rationale, n.confidence,
    n.tier, n.rationale, n.confidence,
    '', '', '', '', '', '', '',
  ]),
];
// The CSV carries the same display names as the site. The join key is their gap id
// and slug, not the category, so renaming this column costs nothing downstream.
for (const r of rows) {
  for (let i = 0; i < r.length; i++) r[i] = relabelWork(r[i]);
}

writeFileSync(
  `${root}app/public/gap-map-augmented.csv`,
  [cols.join(','), ...rows.map((r) => r.map(csvCell).join(','))].join('\n') + '\n'
);

console.log(`data.json: ${enriched.length} gaps, ${newGaps.length} proposed, ${paths.length} chains, ${summary.n_indicators} indicators`);
console.log(`csv: ${rows.length} rows, ${cols.length} columns, keyed on their id and slug`);
