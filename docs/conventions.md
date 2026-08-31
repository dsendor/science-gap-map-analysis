# Conventions — why the rules in CLAUDE.md are what they are

`CLAUDE.md` states the rules. This file states the reasoning, so the rules can stay
short and the reasoning stays available when someone wants to argue with it.

## The stance

Convergent say repeatedly that the map is not comprehensive and not a prioritised
roadmap, and they invite contributions. Everything here follows from taking that at
face value: the deliverable is a contribution to their map, not a critique of it. Tone
follows from that everywhere — see `methodology/house-format.md`.

Source brief: Notion, *Claude Code brief: Gap Map augmentation*.

## Additive only, and provably so

`node engine/verify-additive.mjs` re-serialises the imported baseline and diffs it
against the hash-pinned snapshot in `data/baseline/2026-07-29/`. Any edit to their
gaps, capabilities, fields, resources or edges fails CI. This is why their typos stay:
a repo that corrects them cannot prove it changed nothing else.

Their IDs and slugs are preserved so the additions join back to their source data.

## Never rank

No numeric score column exists in the schema, by design. They deferred prioritisation
deliberately, and a stranger ranking their map is presumptuous. The constraint is
structural rather than advisory because it is the one that would erode first.

## Named values only

Every taxonomy value is a CHECK constraint. An invented enum value is a write failure,
and that is the point — the failure surfaces the drift instead of absorbing it.

## Rationale and confidence on every judgment

`rationale` is NOT NULL; `confidence` is `confident` or `guess`. A run that produces no
guesses is not a confident run, it is a dishonest one. The blind audit pass
(`methodology/audit-protocol.md`) publishes the disagreement rate for the same reason.

## Why the search cache exists

Caching `engine/search.mjs` to disk is not an optimisation. It is what lets the auditor
see exactly the evidence the labeler saw, and what makes an honest null provable rather
than asserted.

## Secrets

`BRAVE_API_KEY` lives in `.env`, which is gitignored, and `.mcp.json` is gitignored too.
The predecessor repo committed a live key into `.mcp.json` in public history; that is
the mistake this layout exists to prevent.

## Inherited from `ai-science-gap-map`

Ported: the file-per-unit → serial-ingest pattern, enum-constrained SQLite, the
skeptical-review stance (now `methodology/audit-protocol.md`), the decision ledger, the
Mermaid DAG template, run-time instrumentation.

**Deliberately not ported:** the ToC / claims / DALY / `impact_models` / `aggregates`
stack. That machinery exists to score and rank, and ranking is forbidden here. Porting
`aggregate.mjs` would drag this project toward exactly the prioritisation Convergent
deferred on purpose. This is the main trap in reusing that repo.
