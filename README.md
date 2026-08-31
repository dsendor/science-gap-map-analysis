# science-gap-map-analysis

An additive augmentation of [Convergent Research's Fundamental Development Gap
Map](https://gap-map.org) — 103 R&D gaps and 369 foundational capabilities across 20
scientific fields.

We add, without touching any of their data:

- **A stated outcome per gap** — one sentence on what becomes knowable or buildable if
  the gap closes.
- **An AI capability type and maturity per gap** — which of seven kinds of AI would
  actually move it, and whether that kind works now, is 2–5 years out, or is
  speculative.
- **A measurability tier per gap** — directly measurable, proxy only, verification
  contested, or counterfactual required.
- **Two fully worked critical paths** — the ordered chain of links whose slowest step
  sets the pace, one binding on physics, one on institutions.

Every added judgment carries a one-line rationale and an explicit confidence flag, and
a blind audit pass publishes the disagreement rate. The point is to be auditable, not
to be confident.

**Additive only, and provably so:** `node engine/verify-additive.mjs` re-serialises the
imported baseline and diffs it against a hash-pinned snapshot of their export. Any edit
to their gaps, capabilities, fields, resources or edges fails the build.

See `docs/plan.md` for the plan, `docs/conventions.md` for the reasoning behind the
repo's rules, `docs/integrity-report.md` for what the export actually contains, and
`CLAUDE.md` for how to work in this repo.

## Quick start

```bash
cp .env.example .env          # add BRAVE_API_KEY
cp .mcp.json.example .mcp.json
node engine/import-gapmap.mjs
node engine/verify-additive.mjs
node engine/integrity-report.mjs
```

Requires Node 22+ (uses the built-in `node:sqlite`). No dependencies.
