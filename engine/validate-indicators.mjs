#!/usr/bin/env node
// Validate the sources behind Phase 3 progress indicators.
//
// Adapted from ai-science-gap-map/engine/validate-citations.mjs, retargeted from that
// project's data_sources table onto gap_indicators. Checks arXiv, then Crossref, then
// plain URL reachability, and writes the verdict back to gap_indicators.source_checked.
//
// A scholarly verification ends the chain. A bare URL check only establishes that a
// page exists, which is weaker, so it is recorded as such rather than as a pass.
//
// Requires open network access: arXiv and Crossref are blocked behind the remote
// session's egress proxy, which is why Phase 3 runs locally.
//
// Usage:
//   node engine/validate-indicators.mjs           # unchecked rows only
//   node engine/validate-indicators.mjs --all     # re-check everything

import { DatabaseSync } from 'node:sqlite';

const root = new URL('..', import.meta.url).pathname;
const db = new DatabaseSync(`${root}db/gapmap.sqlite`);
const revalidateAll = process.argv.includes('--all');

const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

// Token overlap rather than string equality: tolerant of subtitle truncation and
// punctuation drift, which are the usual causes of a false mismatch.
function titlesMatch(a, b) {
  const ta = new Set(normalize(a).split(' ').filter((w) => w.length > 3));
  const tb = new Set(normalize(b).split(' ').filter((w) => w.length > 3));
  if (!ta.size || !tb.size) return false;
  const overlap = [...ta].filter((w) => tb.has(w)).length;
  return overlap / Math.min(ta.size, tb.size) >= 0.6;
}

const extractArxivId = (r) =>
  r.source_doi?.match(/arxiv\.(\d{4}\.\d{4,5})/i)?.[1] ??
  r.source_url?.match(/arxiv\.org\/(?:abs|pdf)\/([\d.]+)/i)?.[1] ?? null;

const extractDoi = (r) =>
  r.source_doi ?? (r.source_url?.match(/doi\.org\/(10\.\S+)/i)?.[1] ? decodeURIComponent(r.source_url.match(/doi\.org\/(10\.\S+)/i)[1]) : null);

async function checkArxiv(id, row) {
  const res = await fetch(`https://export.arxiv.org/api/query?id_list=${id}`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const t = xml.match(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/);
  if (!t) return { status: 'unreachable', detail: `arXiv ${id}: no entry` };
  return titlesMatch(t[1], row.source_title)
    ? { status: 'verified', detail: `arXiv ${id} title matches` }
    : { status: 'metadata-mismatch', detail: `arXiv ${id} title is "${t[1].trim().slice(0, 90)}"` };
}

async function checkCrossref(doi, row) {
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: { 'User-Agent': 'gap-map-indicator-validator' }, signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const t = (await res.json()).message?.title?.[0];
  if (!t) return { status: 'unreachable', detail: `Crossref ${doi}: no title` };
  return titlesMatch(t, row.source_title)
    ? { status: 'verified', detail: `Crossref ${doi} title matches` }
    : { status: 'metadata-mismatch', detail: `Crossref ${doi} title is "${t.slice(0, 90)}"` };
}

async function checkUrl(row) {
  try {
    const res = await fetch(row.source_url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (gap-map-indicator-validator)' },
      signal: AbortSignal.timeout(20000),
    });
    // Reachability is not verification of the claim, only of the page.
    return res.ok
      ? { status: 'unchecked', detail: `URL reachable (HTTP ${res.status}) but source not scholarly-verified` }
      : { status: 'unreachable', detail: `HTTP ${res.status}` };
  } catch (e) {
    return { status: 'unreachable', detail: String(e.message || e) };
  }
}

const rows = db.prepare(`
  SELECT id, gap_id, quantity, source_title, source_url, source_doi, source_checked
  FROM gap_indicators
  WHERE is_null_result = 0 ${revalidateAll ? '' : "AND (source_checked IS NULL OR source_checked = 'unchecked')"}`).all();

if (!rows.length) { console.log('nothing to validate'); process.exit(0); }
console.log(`Validating ${rows.length} indicator source(s)...`);

let pass = 0, flag = 0;
for (const row of rows) {
  const arxivId = extractArxivId(row);
  const doi = extractDoi(row);
  const attempts = [];
  if (arxivId) attempts.push(['arxiv', () => checkArxiv(arxivId, row)]);
  if (doi) attempts.push(['crossref', () => checkCrossref(doi, row)]);
  attempts.push(['url-check', () => checkUrl(row)]);

  let final = { status: 'unreachable', detail: 'no method reached this source', method: 'all' };
  for (const [method, fn] of attempts) {
    try {
      const r = await fn();
      final = { ...r, method };
      if (r.status === 'verified' || r.status === 'metadata-mismatch') break;
    } catch (e) {
      final = { status: 'unreachable', detail: String(e.message || e), method };
    }
    await new Promise((r) => setTimeout(r, 350)); // be polite to free APIs
  }

  db.prepare('UPDATE gap_indicators SET source_checked = ? WHERE id = ?').run(final.status, row.id);
  const ok = final.status === 'verified';
  ok ? pass++ : flag++;
  console.log(`  [${ok ? 'PASS' : 'FLAG'}] #${row.id} ${final.method}/${final.status} — ${final.detail.slice(0, 90)}`);
}
console.log(`Done: ${pass} verified, ${flag} flagged.`);
