# Gap Map augmentation

An **additive** augmentation of Convergent Research's Fundamental Development Gap Map
(gap-map.org, v1.0 — ~103 R&D gaps, 369 foundational capabilities, 20 fields). We add
per gap: a stated outcome, an AI capability type and maturity, and a measurability
tier — plus two worked critical paths — and ship it as an artifact with a short cover
note. It is a contribution to their map, not a critique of it.

Plan: `docs/plan.md`. Labeling rules: `methodology/`. Why the rules below are what they
are: `docs/conventions.md`.

## Rules

1. **Additive only.** Never write to `gm_*` tables outside `engine/import-gapmap.mjs`.
   Do not "fix" their typos. Preserve their IDs and slugs.
2. **Never rank.** No score, no ordering, no priority column — the schema has none by
   design, and adding one is out of scope permanently.
3. **Named values only.** Taxonomy values come from `methodology/taxonomy.md`; anything
   else is a CHECK-constraint write failure.
4. **Every judgment carries a `rationale` and a `confidence`** (`confident` | `guess`).
   A run that produces no guesses is dishonest, not confident.
5. **Decide, don't stall.** On any open question: follow the methodology docs, prefer
   the reversible option, write a `decisions` row (decision, rationale, runner_up,
   confidence, reversal_condition), and proceed. Never silently hard-code.
6. **No orchestration frameworks.** SQLite as system of record, markdown methodology,
   plain Node in `engine/`, `Task` sub-agents for parallel passes. Orchestration code
   appearing here is a smell — flag it and delete it.

## Commands

```bash
node engine/import-gapmap.mjs      # rebuild baseline from the snapshot (destructive, idempotent)
node engine/verify-additive.mjs    # additive-only guardrail — must pass before every commit
node engine/integrity-report.mjs   # regenerate docs/integrity-report.md
node engine/search.mjs "query" --phase 1 --gap <id>   # cached Brave search, logged to search_log
```

Run long or parallel passes in a `git worktree` rather than switching branches in place.

## Searching

Three tools, three jobs — do not collapse them. `engine/search.mjs` (Brave, disk-cached)
for bulk repeatable passes. `WebFetch` to read an actual number off an actual page —
required for Phase 3 indicators, since a snippet is not a source. `WebSearch` / Brave
MCP for interactive one-offs.

Search only where a label turns on a fact you do not have; most of what Phase 1 needs is
already in Convergent's gap descriptions. `BRAVE_API_KEY` lives in `.env` — `.env` and
`.mcp.json` are gitignored and must stay that way.

## Layout

```
data/baseline/2026-07-29/   Their export, verbatim and hash-pinned. Never edited.
db/schema.sql               gm_* baseline (read-only) + augmentation tables
engine/                     import, verify-additive, integrity-report, search
methodology/                taxonomy, house-format, critical-path, audit-protocol
agents/                     labeler, auditor, reviewer sub-agent briefs
research-log/labels/        one JSON per field batch, ingested serially
research-log/audits/        blind relabels
docs/                       plan, conventions, findings, integrity report
```
