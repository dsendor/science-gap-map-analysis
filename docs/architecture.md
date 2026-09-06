# Architecture

Boring substrate, carried over from `ai-science-gap-map`: SQLite as the system of
record, markdown methodology, sub-agents for parallel passes, plain Node scripts in
`engine/`. **No orchestration frameworks.** If orchestration code appears here, that is
a smell — flag it and delete it.

```
data/baseline/2026-07-29/   Their export, verbatim and hash-pinned. Never edited.
db/schema.sql               gm_* baseline (read-only) + augmentation tables
db/migrations/              a record of how the schema moved; not run by anything
engine/                     import, rebuild, verify-additive, export-artifact, search
methodology/                taxonomy, writing, house-format, critical-path, audit-protocol
agents/                     labeler, auditor, reviewer sub-agent briefs
research-log/               the source of record for every judgment, one JSON per pass
app/                        the Next.js static export
```

## The database is derived, and that is load-bearing

`db/*.sqlite` is gitignored. `node engine/rebuild.mjs` deletes it and rebuilds from
`data/baseline/` plus the JSON in `research-log/`, both of which are reviewable in a
diff — which a committed binary is not.

**Verified 2026-09-06**: a fresh clone with no network and no cache reproduces every
table exactly, and an artifact differing only in autoincrement row ids and rebuild
timestamps.

`rebuild.mjs` deletes the file rather than migrating it, because `schema.sql` uses
`CREATE TABLE IF NOT EXISTS`, which creates a missing table and silently does nothing to
an existing one. Every column added to `schema.sql` therefore failed to reach any
database that already existed. Applying `db/migrations/` automatically was tried and
does not work either: SQLite cannot add a `CHECK` constraint via `ALTER TABLE`.

`research-cache/` is gitignored and nothing in the rebuild reads it. The search
transcript that backs the honest nulls is committed, at `research-log/searches/`.

`.vercel/project.json` **is** committed, deliberately. It holds a project id, an org id
and a name, no credentials. Its absence is what let a worktree deploy into a brand-new
Vercel project with no deployment protection, which published the site until the aliases
were pulled. See `docs/vercel-deploy.md`.

## Deliberately not ported from `ai-science-gap-map`

The ToC / claims / DALY / `impact_models` / `aggregates` stack. That machinery exists to
score and rank, which is forbidden here. **This is the main trap in reusing that repo.**

## Autonomous decision protocol

Within a track: decide per the methodology docs, write a `decisions` row (decision,
rationale, runner_up, confidence, reversal_condition), proceed immediately, prefer the
reversible option. Never stall, never silently hard-code.

This covers judgment calls about labels, wording and method. It does **not** cover
anything irreversible or outward-facing — those go to David, always.
