#!/usr/bin/env node
// One-command environment check. Run this before starting any phase.
//
// Everything here is machine-checkable, so the agent runs it rather than asking a
// human to work through a checklist. It exits non-zero on anything that would block
// work, so a failure is impossible to skim past.
//
// Usage: node engine/preflight.mjs

import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { context, stamp } from './workspace.mjs';

const root = new URL('..', import.meta.url).pathname;
const results = [];
const ok = (name, detail) => results.push({ level: 'ok', name, detail });
const warn = (name, detail) => results.push({ level: 'warn', name, detail });
const fail = (name, detail) => results.push({ level: 'fail', name, detail });

// 0. Where am I. Two agents in one directory share a HEAD, and a `git checkout` by
// either one moves the other's files with no warning. This is the check that names
// the workspace out loud before anything else runs, and stamps the branch so
// rebuild.mjs can tell later if it moved.
const ws = context();
if (ws.isPrimary && ws.worktreeCount > 1) {
  warn('workspace', `${ws.branch} in the PRIMARY clone, with ${ws.worktreeCount - 1} worktree(s) attached — `
    + 'others may switch this HEAD under you. Take your own: node engine/worktree.mjs <track>');
} else if (ws.isPrimary) {
  ok('workspace', `${ws.branch} @ ${ws.head}, primary clone, sole worktree`);
} else {
  ok('workspace', `${ws.branch} @ ${ws.head}, isolated worktree at ${ws.toplevel}`);
}

// 1. Node version — node:sqlite needs 22+, and is stable from 24.
const major = Number(process.versions.node.split('.')[0]);
if (major >= 24) ok('node', `v${process.versions.node}`);
else if (major >= 22) warn('node', `v${process.versions.node} — works, but node:sqlite is experimental before 24; CI uses 24`);
else fail('node', `v${process.versions.node} — node:sqlite requires 22+`);

// 2. Database built and populated.
const dbPath = `${root}db/gapmap.sqlite`;
if (!existsSync(dbPath)) {
  fail('database', 'db/gapmap.sqlite missing — run: node engine/rebuild.mjs');
} else {
  try {
    const db = new DatabaseSync(dbPath);
    const c = (t) => db.prepare(`SELECT count(*) c FROM ${t}`).get().c;
    const gaps = c('gm_gaps'), outcomes = c('gap_outcomes'), types = c('gap_ai_types'), tiers = c('gap_measurability');
    if (gaps !== 103) fail('database', `${gaps} gaps, expected 103 — run: node engine/rebuild.mjs`);
    else if (outcomes !== 103 || tiers !== 103) fail('database', `labels incomplete (${outcomes} outcomes, ${tiers} tiers) — run: node engine/rebuild.mjs`);
    else ok('database', `103 gaps, ${outcomes} outcomes, ${types} AI-type rows, ${tiers} tiers, ${c('audits')} audit rows, ${c('decisions')} decisions`);
  } catch (e) {
    fail('database', `unreadable: ${e.message} — run: node engine/rebuild.mjs`);
  }
}

// 3. Additive guardrail.
try {
  execFileSync(process.execPath, [`${root}engine/verify-additive.mjs`], { stdio: 'pipe' });
  ok('additive guardrail', "Convergent's data unmodified");
} catch {
  fail('additive guardrail', 'FAILED — their data has been modified. Fix before anything else.');
}

// 4. Brave key, from the environment or .env.
let key = process.env.BRAVE_API_KEY;
if (!key && existsSync(`${root}.env`)) {
  const m = readFileSync(`${root}.env`, 'utf8').match(/^\s*BRAVE_API_KEY\s*=\s*(.+)$/m);
  if (m) key = m[1].trim().replace(/^["']|["']$/g, '');
}
if (key) ok('brave key', `present (${key.slice(0, 4)}…), ${process.env.BRAVE_API_KEY ? 'exported' : 'from .env — export it too if you want the Brave MCP tool'}`);
else fail('brave key', 'BRAVE_API_KEY not found in environment or .env — Phase 3 cannot source anything');

// 5. Network. Phases 3-6 need open egress; the remote session did not have it.
// An egress proxy answers 403 to a blocked host, which looks like a normal HTTP
// response. Treating any sub-500 status as reachable would pass a fully blocked
// environment — the exact false green that lets Phase 3 start and produce unsourced
// numbers. So 401/403/407 are treated as blocked, and the body is read to surface the
// proxy's own message when there is one.
const probe = async (url, label) => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'follow' });
    if ([401, 403, 407].includes(res.status)) {
      const body = await res.text().catch(() => '');
      const hint = /allowlist|egress|proxy|blocked/i.test(body)
        ? body.replace(/\s+/g, ' ').trim().slice(0, 90)
        : 'blocked, or the host requires auth';
      return fail(label, `HTTP ${res.status} — ${hint}`);
    }
    if (res.status >= 500) return warn(label, `HTTP ${res.status} — host may be down; retry`);
    return ok(label, `reachable (HTTP ${res.status})`);
  } catch (e) {
    return fail(label, `unreachable: ${String(e.message || e).slice(0, 80)}`);
  }
};
await probe('https://arxiv.org/', 'network: arxiv.org');
await probe('https://api.crossref.org/works/10.1038/nature12373', 'network: crossref');
await probe('https://api.search.brave.com/', 'network: brave api');

const pad = Math.max(...results.map((r) => r.name.length));
console.log();
for (const r of results) {
  const mark = r.level === 'ok' ? ' ok ' : r.level === 'warn' ? 'warn' : 'FAIL';
  console.log(`  [${mark}] ${r.name.padEnd(pad)}  ${r.detail}`);
}
const failed = results.filter((r) => r.level === 'fail');
console.log();
if (failed.length) {
  console.error(`${failed.length} blocking issue(s). Do not start a phase until these are clear.`);
  process.exit(1);
}
stamp(ws);
console.log(`preflight passed — safe to start on '${ws.branch}'.`);
