#!/usr/bin/env node
// Brave Search client with a disk cache.
//
// Why a script rather than only the Brave MCP tool: at 103 gaps the labeling phase
// issues a few hundred queries. Routing them through a cached client means the run
// is reproducible, a re-run costs nothing, and — the part that matters for the
// artifact — the AUDITOR sees exactly the evidence the LABELER saw. An honest null
// in the indicator sample is then provable from the cache rather than asserted.
//
// The MCP tool and WebSearch remain available for interactive one-offs. This is for
// the bulk, repeatable passes.
//
// Usage:
//   node engine/search.mjs "query text" [--count 10] [--phase 1] [--gap <uuid>]
//   node engine/search.mjs --file queries.txt        # one query per line
//   node engine/search.mjs "query" --fresh           # bypass cache
//
// Requires BRAVE_API_KEY in the environment (see .env.example). Never commit it.

import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const CACHE_DIR = `${root}research-cache`;
const ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';

// Brave's free tier is rate limited to roughly one query per second. Exceeding it
// returns 429s that are easy to mistake for empty results, which would silently
// corrupt a null finding — so the limiter is not optional.
const MIN_INTERVAL_MS = 1100;
let lastCall = 0;

const args = process.argv.slice(2);
const flag = (name, fallback = null) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const has = (name) => args.includes(name);

const cacheKey = (q, count) => createHash('sha256').update(`${q}::${count}`).digest('hex').slice(0, 32);

async function braveSearch(query, count = 10, { fresh = false } = {}) {
  const key = cacheKey(query, count);
  const path = `${CACHE_DIR}/${key}.json`;

  if (!fresh && existsSync(path)) {
    const hit = JSON.parse(readFileSync(path, 'utf8'));
    return { ...hit, cached: true, cache_key: key };
  }

  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) throw new Error('BRAVE_API_KEY is not set — see .env.example');

  const wait = MIN_INTERVAL_MS - (Date.now() - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();

  const url = `${ENDPOINT}?q=${encodeURIComponent(query)}&count=${count}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'X-Subscription-Token': apiKey },
  });
  if (!res.ok) throw new Error(`Brave ${res.status}: ${(await res.text()).slice(0, 200)}`);

  const body = await res.json();
  const results = (body.web?.results ?? []).map((r) => ({
    title: r.title, url: r.url, description: r.description,
    age: r.age ?? null, published: r.page_age ?? null,
  }));

  const record = { query, count, fetched_at: new Date().toISOString(), results };
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(path, JSON.stringify(record, null, 2));
  return { ...record, cached: false, cache_key: key };
}

function logSearch({ phase, gapId, query, cacheKey: key, n }) {
  const dbPath = `${root}db/gapmap.sqlite`;
  if (!existsSync(dbPath)) return;
  const db = new DatabaseSync(dbPath);
  db.prepare(
    'INSERT INTO search_log (phase, gap_id, provider, query, cache_key, n_results) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(phase, gapId, 'brave', query, key, n);
}

const queries = has('--file')
  ? readFileSync(flag('--file'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean)
  : args.filter((a) => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') !== true);

if (!queries.length) {
  console.error('usage: node engine/search.mjs "query" [--count 10] [--phase 1] [--gap <uuid>] [--fresh]');
  process.exit(1);
}

const count = Number(flag('--count', 10));
const phase = flag('--phase', 'ad-hoc');
const gapId = flag('--gap', null);

for (const q of queries) {
  const out = await braveSearch(q, count, { fresh: has('--fresh') });
  logSearch({ phase, gapId, query: q, cacheKey: out.cache_key, n: out.results.length });
  console.log(JSON.stringify({
    query: q, cached: out.cached, cache_key: out.cache_key,
    n: out.results.length, results: out.results,
  }, null, 2));
}
