# Documentation audit

**What this is.** A classification of every document in the repo, and a proposal for
what to keep, merge and retire. Nothing has been deleted — this is the proposal, and
David decides.

## TL;DR

- **~2,900 lines across 26 documents.** Roughly a third describes work that is finished
  or a shape the artifact no longer has.
- **Nine documents still assert the "four attributes" framing.** The artifact now
  proposes two things: critical paths, and a kind-of-work label. Outcomes, the
  measurability tier and progress indicators are built, in the export, and explicitly
  not proposed.
- **Two documents describe the same thing under the same name.**
  `docs/critical-paths.md` and `methodology/critical-path.md`.
- **Six are one-off process records** from phases that have completed. They are history,
  not instructions, and they read as instructions.
- **Proposal: 26 documents → 11.** Four to rebuild from, four references, one live
  status, two archived sets.

---

## What you would actually need to rebuild this

Ordered by what a person would need first, with where it currently lives.

| Need | Currently | State |
|---|---|---|
| **What this is and what it argues** | `CLAUDE.md` | Current |
| **Architecture** — SQLite as record, additive guardrail, engine scripts, export | `CLAUDE.md` + `db/schema.sql` comments | Current, and the schema comments are the best documentation in the repo |
| **Terms** — gap, capability, critical path, binding, carries the cost, axis | scattered; `methodology/critical-path.md` covers binding well | **Gap: no glossary.** "Slug", "binding", "axis", "chain", "link" and "step" are used interchangeably in places |
| **Taxonomy** — the eight kinds of work, maturity, tiers | `methodology/taxonomy.md` | Current |
| **Critical path method** | `methodology/critical-path.md` | Current, rewritten 2026-09-05 |
| **How to write anything here** | `methodology/writing.md` + `.claude/skills/writing-like-convergent` + `docs/check ai language.md` | **Three documents, one subject** |
| **Research method** — search vs fetch, caching, honest nulls | `CLAUDE.md` | Current but thin |
| **Review process** — audits, gates, adjudication | `methodology/audit-protocol.md` + `docs/review-gate-plan.md` | Overlapping; the gate plan is a completed run |
| **Decisions and why** | `research-log/decisions.json` (30 rows) | Current, and underused — it is the best record of *why* and nothing surfaces it |
| **Working in parallel** | `docs/worktrees.md` | Current |
| **Deployment** | `docs/vercel-deploy.md` | Current, and the access-control gotcha is load-bearing |

---

## Classification

### Keep as is — current and load-bearing

- `CLAUDE.md` — the entry point.
- `methodology/taxonomy.md` — the eight kinds of work with discriminating examples.
- `methodology/critical-path.md` — rewritten this week; now defines binding properly.
- `methodology/house-format.md` — how to write a gap in Convergent's format.
- `docs/worktrees.md` — nine rules and the two incidents behind them.
- `docs/vercel-deploy.md` — the Standard Protection gotcha is the reason nothing has
  leaked publicly.
- `docs/todo.md` — live status.
- `agents/labeler.md`, `agents/auditor.md`, `agents/reviewer.md` — sub-agent briefs,
  still the shape of how passes are run.

### Merge — same subject, several documents

1. **Writing.** `methodology/writing.md` + `docs/check ai language.md` +
   `.claude/skills/writing-like-convergent`. The skill is the richest and is invocable;
   the other two should point at it and keep only what it does not cover (progressive
   disclosure, the TL;DR rule).
2. **Critical paths.** `docs/critical-paths.md` is a generated presentation of the two
   chains; `methodology/critical-path.md` is the method. Same name, different jobs.
   Rename the first to `docs/chains-as-published.md` or regenerate it from the database
   on demand rather than storing it.
3. **Review.** `methodology/audit-protocol.md` (method) + `docs/review-gate-plan.md`
   (a completed run). Keep the protocol, archive the run.

### Rewrite — stale in a way that would mislead

- `docs/findings.md` — 257 lines built on the four-attribute framing, and it still
  points readers at the empty `search_log` table. It is the single most misleading
  document in the repo because it reads as current.
- `docs/future-work.md` — lists outcomes-as-entity and indicator coverage as future
  work. Both are now decided: built, in the export, not proposed.
- `docs/cover-note.md` — the email. Describes four attributes, four proposed gaps and a
  withdrawn gradient. Known, and it is the last blocking item before anything is sent.

### Archive — finished process records, not instructions

Move to `docs/archive/` with a one-line header saying what run they describe and that
they are history. They are worth keeping: they are the evidence that the work was done
the way it says.

- `docs/plan.md` — the original six-phase plan.
- `docs/local-agent-plan.md` — 522 lines of execution instructions for phases 3-6, all
  complete.
- `docs/decomposition-proposal.md`
- `docs/maturity-repair-plan.md`
- `docs/prereg-relabel.md` and `docs/relabel-report.md` — the pre-registration and its
  result. The pair is a genuinely good record and should stay together.
- `docs/review-gate-plan.md`

### Delete — superseded by the thing they were drafts of

- `docs/front-page-draft.md` and `docs/front-page-draft-convergent.md`. Both were inputs
  to a blind voice comparison that has run and been acted on; the page is now the
  artifact. The comparison itself is recorded in the commit message.
- `docs/integrity-report.md` is generated by `engine/integrity-report.mjs`. Keep the
  script, stop committing the output, or say clearly at the top that it is generated.

---

## The gap worth filling

**There is no glossary.** The words that carry the argument are not defined in one
place, and at least two have caused real confusion:

- **binding / carries the cost** — undefined until 2026-09-05, and the flag had been
  rendering off a proxy for two weeks.
- **slug** — used in commit messages and docs as though it were domain vocabulary. It is
  web jargon for the URL form of a name and has nothing to do with Convergent.

Others that need one line each: gap, capability, initiative, chain, link, step, axis,
axis_kind, span, maturity, tier, frame, guess vs confident, additive.

## Proposed end state

```
CLAUDE.md                     entry point, unchanged
docs/
  glossary.md                 NEW — every term that carries the argument
  todo.md                     live status
  worktrees.md                parallel work
  vercel-deploy.md            deploy and access control
  cover-note.md               the email, rewritten
  findings.md                 rewritten against what is actually proposed
  archive/                    seven finished process records
methodology/
  taxonomy.md                 the eight kinds of work
  critical-path.md            the method, including binding
  house-format.md             their gap format
  audit-protocol.md           how a pass gets checked
  writing.md                  points at the skill, keeps the house rules
```

26 documents to 11 plus an archive.
