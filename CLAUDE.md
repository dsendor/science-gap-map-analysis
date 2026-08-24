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

Full plan: `docs/plan.md`. Source brief: Notion, *Claude Code brief: Gap Map augmentation*.

## The goal, and what to optimise for

**Give Convergent Research a simple, clear story showing how an AI-focused update to
their Gap Map would add value.**

Accurate *and* clear. Those pull against each other and the resolution is not to
retreat into hedging. A caveat that a reader cannot act on is not honesty, it is noise.
Put the finding first, in one sentence a person can repeat; put the qualification where
someone who wants to check it will find it.

Failure modes, in order of how easily they happen here:

1. **Burying the story in method.** A page that leads with how the labelling was audited
   is a page about us. They want to know what their map looks like with the attributes
   added. Lead with that.
2. **Shipping a number nobody sanity-checked.** See below.
3. **Confessing at length.** One clear statement of a limitation beats four.

## Sanity-check every label against the gap it describes

A label can be internally consistent, survive an audit, and still be obviously wrong to
anyone who reads it next to the gap. Before any distribution or chart ships, read a
sample of the actual rows and ask whether a domain reader would accept them.

The instance that forced this rule: the relabel marked **"AI Could Be Misused"** as
`Coordination and institutional` / **`Working now`**, and *"Risks of Malicious
Bioengineering"* and *"A Limited Set of Rigid Organizational Structures..."* the same
way. Nobody believes the coordination problem around AI misuse is solved today. The
labels were consistent, adjudicated, and absurd.

Cause: `Working now` is defined per gap — *would applying this capability move this
gap* — and the relabelers read it as *does this capability exist*. Those coincide for
technical categories and come apart completely for institutional ones. Convening a
standards body is available this afternoon; getting universal DNA-synthesis screening
adopted is not.

So:

- **State the discriminating example in the taxonomy**, not just the definition.
- **Never adjudicate disagreements by a rule that cannot be wrong.** "On disagreement,
  take v2" removes author bias and also removes any check on validity. It adopted the
  wrong reading 25 times in one direction.
- **Read the extremes.** Sort by any new label and read the top and bottom ten rows. The
  absurd ones surface immediately and cost minutes.

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

## Architecture

Boring substrate, carried over from `ai-science-gap-map`: SQLite as system of record,
markdown methodology, `Task` sub-agents for the parallel passes, plain Node scripts in
`engine/`. No orchestration frameworks. If orchestration code appears here, that is a
smell — flag it and delete it.

```
data/baseline/2026-07-29/   Their export, verbatim and hash-pinned. Never edited.
db/schema.sql               gm_* baseline (read-only) + augmentation tables
engine/                     import, verify-additive, integrity-report, search
methodology/                taxonomy, house-format, critical-path, audit-protocol
agents/                     labeler, auditor sub-agent briefs
research-log/labels/        one JSON per field batch, ingested serially
research-log/audits/        blind relabels
docs/plan.md                the six-phase plan
```

## Commands

```bash
node engine/import-gapmap.mjs      # rebuild baseline from the snapshot (destructive, idempotent)
node engine/verify-additive.mjs    # the additive-only guardrail — must pass before every commit
node engine/integrity-report.mjs   # regenerate docs/integrity-report.md
node engine/search.mjs "query" --phase 1 --gap <id>   # cached Brave search, logged to search_log
```

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

## Inherited from ai-science-gap-map

Ported: the file-per-unit → serial-ingest pattern, enum-constrained SQLite, the
skeptical-review stance (now `methodology/audit-protocol.md`), the decision ledger, the
Mermaid DAG template, run-time instrumentation.

**Deliberately not ported:** the ToC / claims / DALY / `impact_models` / `aggregates`
stack. That machinery exists to score and rank, and ranking is forbidden here. Porting
`aggregate.mjs` would drag this project toward exactly the prioritisation Convergent
deferred on purpose. This is the main trap in reusing that repo.

## Branching: one track of work, one branch

**Start a new branch for every new track of work, and fetch before you start.**

This is not style advice. On 2026-08-23 two sessions worked this repo in parallel on
the same branch. One cloned at Phase 2 and never fetched; the other pushed seven
commits in the meantime, including a rewrite of the very plan the first was executing
and a full relabel that withdrew the finding the first was building its artifact on.
Five hours of work went into an argument that had already been retracted. Nothing was
lost, because both lines were committed, but the reconciliation cost more than the
branch would have.

So:

1. **`git fetch` before starting any phase**, and again before any commit that follows
   a long gap. A stale clone is silent; nothing warns you.
2. **One track, one branch.** A relabel, an artifact build and a deployment are three
   tracks. Name them for the work (`relabel-v2`, `artifact-rebuild`), not for the agent.
3. **Merge into `main` deliberately**, resolving conflicts by hand. Two agents working
   the same files will independently make the same fixes with different wording, and
   they will also make *incompatible* ones — the adjudication ordering in
   `engine/rebuild.mjs` is the example: running `adjudicate.mjs` after `apply-relabel.mjs`
   silently re-downgrades labels the relabel had just resolved.
4. **Say in the commit which session produced it.** The `Claude-Session` trailer is how
   the provenance of those seven commits was established after the fact.
5. **If you find commits you did not make, stop and report before merging.** Do not
   assume they are yours, and do not assume they are stale.

## Autonomous decision protocol

Whenever a decision would previously have gone to David: decide per the methodology
docs, write a `decisions` row (decision, rationale, runner_up, confidence,
reversal_condition), proceed immediately, prefer the reversible option. Never stall,
never silently hard-code.
