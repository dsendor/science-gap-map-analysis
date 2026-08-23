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

See `docs/plan.md` for the plan, `docs/integrity-report.md` for what the export
actually contains, and `CLAUDE.md` for how to work in this repo.

## Quick start

```bash
cp .env.example .env          # add BRAVE_API_KEY
cp .mcp.json.example .mcp.json
node engine/import-gapmap.mjs
node engine/verify-additive.mjs
node engine/integrity-report.mjs
```

Requires Node 22+ (uses the built-in `node:sqlite`). No dependencies.

## The artifact

```bash
cd app && npm install && npm run build     # -> app/out/, a self-contained static site
npx serve app/out                          # or any static host
```

Deploying to Vercel: set the project's **Root Directory to `app`**. `trailingSlash` is
on and `output: 'export'` is set, so the same build works unchanged on Vercel, on a
plain static server, and from disk.

The site is two pages. `/` is the argument — the hypothesis, the evidence for it, the
two critical paths, the proposed gaps, and the ask. `/map` is the data — all 103 gaps
with the four attributes, the cross-tabs, the audit, the method and the decision ledger.
Design tokens are read from gap-map.org so the page reads as an extension of their
portal; their logo and wordmark are deliberately not used, and the masthead is David's.

`npm run build` runs `engine/export-artifact.mjs` first, which regenerates
`app/public/data.json` and `app/public/gap-map-augmented.csv` from the database. Both
are gitignored for the same reason `db/gapmap.sqlite` is: the sources of record are the
pinned snapshot and the JSON files under `research-log/`, which are reviewable in a
diff.

The CSV is one row per gap keyed on **their** `id` and `slug`, so it joins straight back
to Convergent's export.

Written outputs: `docs/findings.md` (regenerate with `engine/audit-report.mjs`),
`docs/critical-paths.md`, `docs/integrity-report.md`, and `docs/cover-note.md` — a
**draft**, not sent.
