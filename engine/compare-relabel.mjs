#!/usr/bin/env node
// Score the relabel against research-log/prereg-relabel.md and write research-log/relabel-report.md.
//
// The four predictions were fixed in an earlier commit. This scores them mechanically
// so the outcome is not a matter of interpretation after the fact.

import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const all = (s, ...p) => db.prepare(s).all(...p);
const one = (s, ...p) => db.prepare(s).get(...p);

const CONTROL = 'Real-time control of physical systems';
const n = one('SELECT count(*) c FROM relabels').c;
if (!n) { console.error('no relabels ingested'); process.exit(1); }

const L = [];
const w = (s = '') => L.push(s);
const pct = (a, b) => `${(100 * a / b).toFixed(0)}%`;

w('# Relabel report — AI-type dimension, 8-category taxonomy');
w();
w(`Independent blind relabel of **all ${n} gaps** by labelers that never saw v1. Predictions were fixed in \`research-log/prereg-relabel.md\` in an earlier commit; this report scores them mechanically.`);
w();

const tAgree = one('SELECT count(*) c FROM relabels WHERE type_agreed = 1').c;
const mAgree = one('SELECT count(*) c FROM relabels WHERE maturity_agreed = 1').c;
w('## Agreement between the two independent passes');
w();
w('| Dimension | Agree | Disagree | Disagreement |');
w('|---|---:|---:|---:|');
w(`| Primary AI type | ${tAgree} | ${n - tAgree} | ${pct(n - tAgree, n)} |`);
w(`| Maturity | ${mAgree} | ${n - mAgree} | ${pct(n - mAgree, n)} |`);
w();
w('This is a census, not a sample, so it supersedes the 33% AI-type figure from the Phase 2 stratified audit for this dimension.');
w();
w('**The maturity figure needs a caveat and probably deserves more weight than the type figure.** v1 maturity was assigned before the per-gap-versus-per-class semantics were pinned down, so part of any disagreement is the specification change rather than labeler variance. But only part: both v1 and the Phase 2 auditors were already using the per-gap reading, which is why pinning it changed no label. A large residual disagreement means maturity is the least reliable thing on this dimension, and any claim resting on it — the working-now gradient above all — has to carry that caveat.');
w();

// P1 — uptake of the new category
const controlRows = all('SELECT gap_id, v1_type, v2_maturity FROM relabels WHERE v2_type = ?', CONTROL);
const p1 = controlRows.length >= 3 && controlRows.length <= 7;
w('## Prediction scoring');
w();
w(`### P1 — uptake between 3 and 7 gaps: **${p1 ? 'CONFIRMED' : 'REFUTED'}** (${controlRows.length} gaps)`);
w();
if (controlRows.length) {
  w('| Gap | v1 type | New maturity |');
  w('|---|---|---|');
  for (const r of controlRows) {
    const name = one('SELECT name FROM gm_gaps WHERE id = ?', r.gap_id).name.replace(/\s+/g, ' ');
    w(`| ${name} | ${r.v1_type} | ${r.v2_maturity} |`);
  }
  w();
}

// P2 — control's working-now share vs the rest
const wnShare = (type) => {
  const rows = all('SELECT v2_maturity FROM relabels WHERE v2_type = ?', type);
  if (!rows.length) return null;
  return { wn: rows.filter((r) => r.v2_maturity === 'Working now').length, n: rows.length };
};
const gradient = all('SELECT DISTINCT v2_type t FROM relabels').map((r) => {
  const s = wnShare(r.t);
  return { type: r.t, ...s, pct: 100 * s.wn / s.n };
}).sort((a, b) => b.pct - a.pct);
const ctrl = gradient.find((g) => g.type === CONTROL);
const ctrlRank = ctrl ? gradient.indexOf(ctrl) + 1 : null;
const p2 = ctrl ? (ctrlRank <= 3) : false;
w(`### P2 — control lands in the top three by working-now share: **${ctrl ? (p2 ? 'CONFIRMED' : 'REFUTED') : 'N/A — category unused'}**${ctrl ? ` (rank ${ctrlRank} of ${gradient.length}, ${pct(ctrl.wn, ctrl.n)})` : ''}`);
w();

// P3 — gradient shape survives
const pb = gradient.find((g) => g.type === 'Physical build and manipulation');
const llm = gradient.find((g) => g.type === 'LLM reasoning and synthesis');
const pbFromControl = controlRows.filter((r) => r.v1_type === 'Physical build and manipulation').length;
const p3 = pb && pb.wn === 0 && llm && gradient.indexOf(llm) <= 1 && pbFromControl <= 1;
w(`### P3 — gradient shape survives: **${p3 ? 'CONFIRMED' : 'REFUTED'}**`);
w();
w(`- Physical build working-now: ${pb ? `${pb.wn}/${pb.n} (${pct(pb.wn, pb.n)})` : 'category unused'} ${pb && pb.wn === 0 ? '— still zero' : '— **no longer zero, headline finding changes**'}`);
w(`- LLM reasoning rank: ${llm ? `${gradient.indexOf(llm) + 1} of ${gradient.length}` : 'unused'}`);
w(`- Gaps control took from physical build: ${pbFromControl} (predicted at most 1)`);
w();

const dis = n - tAgree;
const p4 = 100 * dis / n >= 20 && 100 * dis / n <= 35;
const controlExplains = all('SELECT count(*) c FROM relabels WHERE type_agreed = 0 AND v2_type = ?', CONTROL)[0].c;
w(`### P4 — total disagreement 20-35%: **${p4 ? 'CONFIRMED' : 'REFUTED'}** (${pct(dis, n)})`);
w();
w(`Of ${dis} disagreements, ${controlExplains} involve the new category and ${dis - controlExplains} do not. The latter is the test-retest noise floor for this dimension: two independent labelers applying the same eight categories to the same text.`);
w();

w('## Working-now gradient, v2');
w();
w('| Primary AI type | Working now | Total | Share |');
w('|---|---:|---:|---:|');
for (const g of gradient) w(`| ${g.type} | ${g.wn} | ${g.n} | ${g.pct.toFixed(0)}% |`);
w();

w('## Where the two passes disagreed');
w();
w('| Gap | v1 | v2 |');
w('|---|---|---|');
for (const r of all('SELECT gap_id, v1_type, v2_type FROM relabels WHERE type_agreed = 0 ORDER BY v2_type')) {
  const name = one('SELECT name FROM gm_gaps WHERE id = ?', r.gap_id).name.replace(/\s+/g, ' ');
  w(`| ${name.slice(0, 62)} | ${r.v1_type} | ${r.v2_type} |`);
}
w();

writeFileSync(`${root}research-log/relabel-report.md`, L.join('\n'));
console.log(`wrote research-log/relabel-report.md`);
console.log(`type disagreement ${pct(dis, n)} | control uptake ${controlRows.length} | physical build working-now ${pb ? pb.wn : 'n/a'}`);
