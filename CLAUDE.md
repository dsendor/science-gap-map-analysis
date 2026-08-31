# Gap Map augmentation

## What this project is

An **additive** augmentation of Convergent Research's Fundamental Development Gap Map
(gap-map.org, v1.0, ~103 R&D gaps and 369 foundational capabilities across 20 fields).
We add four things they do not have — a stated outcome per gap, an AI capability type
and maturity per gap, a measurability tier per gap, and two worked critical paths — and
ship it as an artifact plus a short cover note.

The deliverable is a **contribution to their map, not a critique of it.** They say
repeatedly that the map is not comprehensive and not a prioritised roadmap, and they
invite contributions. Tone follows from that everywhere.

**The goal: give Convergent Research a simple, clear story showing how an AI-focused
update to their Gap Map would add value.** Accurate *and* clear. Those pull against
each other and the resolution is not to retreat into hedging.

| Where to look | |
|---|---|
| What is outstanding and who has it | `docs/todo.md` — update it when you pick something up |
| The six-phase plan | `docs/plan.md` |
| How to write anything here | `methodology/writing.md` |
| Taxonomy values and their discriminating examples | `methodology/taxonomy.md` |
| Auditing and sanity-checking labels | `methodology/audit-protocol.md` |
| Working in parallel without collisions | `docs/worktrees.md` |
| Deployment, access control, the Vercel gotcha | `docs/vercel-deploy.md` |

Source brief: Notion, *Claude Code brief: Gap Map augmentation*.

## Non-negotiables

1. **Additive only.** Never modify `gm_*` tables outside `engine/import-gapmap.mjs`.
   `node engine/verify-additive.mjs` diffs the baseline against the hash-pinned
   snapshot and fails CI on any edit to their gaps, capabilities, fields, resources or
   edges. Do not "fix" their typos.
2. **Never rank.** No numeric score column exists in the schema, by design. They
   deferred prioritisation deliberately; a stranger ranking their map is presumptuous.
3. **Named values only.** Every taxonomy value is a CHECK constraint. An invented enum
   value is a write failure, and that is the point.
4. **Every judgment carries a rationale and a confidence.** `rationale` is NOT NULL;
   `confidence` is `confident` or `guess`. A run that produces no guesses is not a
   confident run, it is a dishonest one.
5. **Preserve their IDs and slugs**, so the additions join back to their source data.
6. **Sanity-check labels against the gaps they describe** before any chart or
   distribution ships. Agreement is not validity; the audit does not catch absurdity.
   Sort by the new label, read the top and bottom ten rows. See
   `methodology/audit-protocol.md`.

## Start here: take a worktree

```bash
node engine/worktree.mjs <track-name>      # ../wt-<track>, new branch, .env copied
cd ../wt-<track> && node engine/rebuild.mjs && node engine/preflight.mjs
```

**One track of work, one worktree — a branch is a label, a directory is isolation.** A
clone has exactly one HEAD, so two agents in one directory silently switch each other's
checkout and carry uncommitted work onto someone else's branch. `git fetch` before
starting; the primary clone is coordination space, not a workspace; merge to `main` by
hand; if you find commits you did not make, stop and report before merging. The full
rules and the two incidents behind them: `docs/worktrees.md`.

## Commands

```bash
node engine/preflight.mjs          # node, database, additive guardrail, Brave key, network, workspace stamp
node engine/import-gapmap.mjs      # rebuild baseline from the snapshot (destructive, idempotent)
node engine/verify-additive.mjs    # the additive-only guardrail — must pass before every commit
node engine/integrity-report.mjs   # regenerate docs/integrity-report.md
node engine/search.mjs "query" --phase 1 --gap <id>   # cached Brave search, logged to search_log
```

## How we write

**Lead with the answer; put the detail underneath, where someone who wants it will find
it.** Applies to the artifact, to every doc, and to every reply to David. The argument
page carries one claim about *their map*; nuance, method and withdrawn findings live on
the pages behind it. A caveat that a reader cannot act on is not honesty, it is noise.
Full rules, and the worked example of getting this wrong: `methodology/writing.md`.

## Research method

Three tools, three distinct jobs. Do not collapse them:

- **`engine/search.mjs` (Brave, disk-cached)** for the bulk repeatable passes. Caching
  is not an optimisation — it is what lets the auditor see exactly the evidence the
  labeler saw, and what makes an honest null provable rather than asserted.
- **`WebFetch`** for extraction: reading the actual number off the actual page. Required
  for Phase 3 indicators; a search snippet is not a source.
- **`WebSearch` / Brave MCP** for interactive one-offs.

Search only where a label turns on a fact you do not have. Most of what Phase 1 needs is
already in Convergent's own gap descriptions.

`BRAVE_API_KEY` lives in `.env`, which is gitignored, and `.mcp.json` is gitignored too.
The predecessor repo committed a live key into `.mcp.json` in public history; that is
the mistake this layout exists to prevent.

## Architecture

Boring substrate, carried over from `ai-science-gap-map`: SQLite as system of record,
markdown methodology, `Task` sub-agents for the parallel passes, plain Node scripts in
`engine/`. No orchestration frameworks. If orchestration code appears here, that is a
smell — flag it and delete it.

```
data/baseline/2026-07-29/   Their export, verbatim and hash-pinned. Never edited.
db/schema.sql               gm_* baseline (read-only) + augmentation tables
engine/                     import, verify-additive, integrity-report, search
methodology/                taxonomy, writing, house-format, critical-path, audit-protocol
agents/                     labeler, auditor sub-agent briefs
research-log/labels/        one JSON per field batch, ingested serially
research-log/audits/        blind relabels
docs/plan.md                the six-phase plan
```

**Deliberately not ported from `ai-science-gap-map`:** the ToC / claims / DALY /
`impact_models` / `aggregates` stack. That machinery exists to score and rank, which is
forbidden here. This is the main trap in reusing that repo.

## Autonomous decision protocol

Whenever a decision would previously have gone to David: decide per the methodology
docs, write a `decisions` row (decision, rationale, runner_up, confidence,
reversal_condition), proceed immediately, prefer the reversible option. Never stall,
never silently hard-code.
