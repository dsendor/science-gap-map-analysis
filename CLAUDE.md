# Gap Map augmentation

## Always, in every session

1. **Never commit or merge to `main` without asking David.** Work on a branch, push
   the branch, and ask. This holds even when a change looks obviously right and even
   when a task brief names `main` as the working branch. Asking costs one message.
2. **Lead with the answer.** Every document, every page, every reply opens with a
   TL;DR — a short bulleted list of the things to know, readable in one pass without
   scrolling. Detail goes below, clearly separated. Never make someone read the
   working to find the conclusion. Full rules: `methodology/writing.md`.
3. **Additive only.** Never modify `gm_*` tables outside `engine/import-gapmap.mjs`.
   `node engine/verify-additive.mjs` must pass before every commit. Do not "fix" their
   typos.
4. **Never rank their gap map items.** No numeric score column exists in the schema, by design. They
   deferred prioritisation deliberately; a stranger ranking their map is presumptuous. We can rank what we create.
5. **Named values only.** Every taxonomy value is a CHECK constraint. An invented enum
   value is a write failure, and that is the point.
6. **Every judgment carries a rationale and a confidence.** `rationale` is NOT NULL;
   `confidence` is `confident` or `guess`. A run that produces no guesses is not a
   confident run, it is a dishonest one.
7. **Preserve their IDs and slugs**, so the additions join back to their source data.
8. **One track of work, one worktree.** `node engine/worktree.mjs <track>` before you
   start anything. See below.

## What this project is

An **additive** augmentation of Convergent Research's Fundamental Development Gap Map
(gap-map.org, v1.0, ~103 R&D gaps and 369 foundational capabilities across 20 fields).
We propose two things they do not have: **critical paths**, which decompose a gap into
the ordered steps the work runs through and show which of their own capabilities act on
each, and a **kind-of-work label** on every gap saying what stands in the way and
whether AI reaches it. A per-gap outcome, a measurability tier and progress indicators
were also built; they are in the export and are deliberately not proposed, because a
chain's stated axis and its per-step figures do those jobs better. Ships as an artifact
plus a short cover note.

The deliverable is a **contribution to their map, not a critique of it.** They say
repeatedly that the map is not comprehensive and not a prioritised roadmap, and they
invite contributions. Tone follows from that everywhere.

**The goal: give Convergent Research a simple, clear story showing how an AI-focused
update to their Gap Map would add value.** Accurate *and* clear. Those pull against
each other and the resolution is not to retreat into hedging. A caveat a reader cannot
act on is not honesty, it is noise.

## The four failure modes, in order of how easily they happen here

1. **Burying the story in method.** A page that leads with how the labelling was
   audited is a page about us. They want to know what their map looks like with the
   attributes added. Lead with that.
2. **Shipping a number nobody sanity-checked.** Agreement is not validity — a label
   can survive the audit and still be absurd next to the gap it describes. Before any
   chart or distribution ships, sort by the new label and read the top and bottom ten
   rows. The instance that forced this rule, and the definitional error behind it:
   `methodology/audit-protocol.md`.
3. **Confessing at length.** One clear statement of a limitation beats four. The
   argument page carries one claim about *their map*; withdrawn findings, method and
   nuance live on the pages behind it.
4. **Acting where you should have asked.** Anything outward-facing or hard to reverse
   — a push to `main`, a merge, a deploy, a message to Convergent — is David's call,
   not a judgment call. Everything else, decide and proceed (see below).

## Start here: take a worktree

```bash
node engine/worktree.mjs <track-name>      # ../wt-<track>, new branch, .env copied
cd ../wt-<track> && node engine/rebuild.mjs && node engine/preflight.mjs
```

A branch is a label; a directory is isolation. A clone has exactly one HEAD, so two
agents in one directory silently switch each other's checkout and carry uncommitted
work onto someone else's branch. `git fetch` before starting. The primary clone is
coordination space, not a workspace. If you find commits you did not make, stop and
report before merging. The nine rules and the two incidents behind them:
`docs/worktrees.md`.

## Commands

```bash
node engine/preflight.mjs          # node, database, additive guardrail, Brave key, network, workspace stamp
node engine/import-gapmap.mjs      # rebuild baseline from the snapshot (destructive, idempotent)
node engine/verify-additive.mjs    # the additive-only guardrail — must pass before every commit
node engine/integrity-report.mjs   # regenerate docs/integrity-report.md
node engine/search.mjs "query" --phase 1 --gap <id>   # cached Brave search, logged to search_log
```

## Where to look

| | |
|---|---|
| What is outstanding and who has it | `docs/todo.md` — update it when you pick something up |
| **What every term means, and whose word it is** | `docs/glossary.md` — read this first if anything below uses a word oddly |
| What the work actually found | `docs/findings.md` |
| How to write anything here | `methodology/writing.md`, and the `writing-like-convergent` skill |
| The critical-path method, and what "binding" means | `methodology/critical-path.md` |
| Taxonomy values and their discriminating examples | `methodology/taxonomy.md` |
| Auditing and sanity-checking labels | `methodology/audit-protocol.md` |
| Working in parallel without collisions | `docs/worktrees.md` |
| Deployment, access control, the Vercel gotcha | `docs/vercel-deploy.md` |

The original brief lives in a private Notion doc and is not part of this repository.
Everything it asked for that still stands is in this file and in `methodology/`.

## What is not in the repository, and why

`db/*.sqlite` is gitignored and that is deliberate. **Tested on 2026-09-06**: a fresh
clone with no network and no cache runs `node engine/rebuild.mjs` and produces a
database identical to the working one on every table, and an artifact whose only
differences are autoincrement row ids and rebuild timestamps. The sources of record are
`data/baseline/` and the JSON in `research-log/`, both reviewable in a diff, which a
committed binary is not.

`research-cache/` is gitignored too. It is the Brave disk cache, 47 files and about
250K, and nothing in `engine/rebuild.mjs` reads it — the database does not need it. The
search transcript that *does* back the honest nulls is committed, at
`research-log/searches/`.

`.vercel/project.json` **is** committed, deliberately. It holds a project id, an org id
and a name, and no credentials. Committing it is what stops a fresh worktree deploying
into a brand-new Vercel project with no deployment protection.

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
```

**Deliberately not ported from `ai-science-gap-map`:** the ToC / claims / DALY /
`impact_models` / `aggregates` stack. That machinery exists to score and rank, which is
forbidden here. This is the main trap in reusing that repo.

## Autonomous decision protocol

Within a track, decide per the methodology docs, write a `decisions` row (decision,
rationale, runner_up, confidence, reversal_condition), proceed immediately, prefer the
reversible option. Never stall, never silently hard-code.

This covers judgment calls about labels, wording and method. It does not cover the
irreversible or outward-facing ones in failure mode 4 — those go to David, always.
