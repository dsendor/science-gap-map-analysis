# How to extend this analysis

**Start here if you are building a critical path, relabeling gaps, or researching
evidence for either.** This page tells you what to read, in what order, and what every
piece of work has in common. What to work on is `docs/future-work.md`.

## TL;DR

- **Every piece of work has the same shape:** a worktree, a prediction or definition
  written first, the work, `node engine/rebuild.mjs` to validate it, a review by a
  different agent, then David. Nothing merges or publishes without him.
- **Building a critical path?** Read `critical-path.md`, then `chain-schema.md`, then
  `research-method.md`. Hand a sub-agent `agents/chain-builder.md`.
- **Labeling gaps?** Read `taxonomy.md`, then `audit-protocol.md`. Hand a sub-agent
  `agents/labeler.md`, and a different one `agents/auditor.md`.
- **Researching evidence?** `research-method.md`. Save your searches with
  `engine/export-searches.mjs` before anyone rebuilds.
- **Unfamiliar word?** `docs/glossary.md`. It marks which words are Convergent's and
  which are ours.

---

## I want to…

| Task | Read, in this order | Hand a sub-agent |
|---|---|---|
| Build a critical path for a gap | `critical-path.md` → `chain-schema.md` → `research-method.md` | `agents/chain-builder.md` |
| Review a critical path | `critical-path.md` → `agents/reviewer.md`, mode C | `agents/reviewer.md`, mode C |
| Label gaps, or relabel a dimension | `taxonomy.md` → `audit-protocol.md` | `agents/labeler.md` |
| Audit labels | `audit-protocol.md` | `agents/auditor.md` |
| Find and cite a number | `research-method.md` | — |
| Propose a new gap | `house-format.md` → `agents/reviewer.md`, mode B | `agents/reviewer.md`, mode B |
| Write anything a reader will see | `writing.md`, and the `writing-like-convergent` skill | — |

## The shape every piece of work shares

1. **A worktree of your own.** `node engine/worktree.mjs <task>`, then rebuild and
   preflight inside it. The primary clone is not a workspace.
2. **Commit the prediction or definition first.** A chain's expectation, a new label's
   definition. Written before the work, it is evidence; written after, it is a story.
   For chains the ingest enforces this.
3. **Do the work into files under `research-log/`.** Never into the database directly:
   it is rebuilt from scratch every time, and anything not in a file is lost.
4. **Validate with `node engine/rebuild.mjs`.** It ingests every file, refuses bad data
   with every problem listed, and ends with the check that Convergent's data is untouched.
5. **A different agent reviews it**, without seeing your reasoning first. Fixing and
   judging in the same pass produces agreement by construction.
6. **Push the branch and ask David.** He merges, publishes, and is the only one who marks
   anything human-checked.

## Which review for which output

| Output | Review | Why this one |
|---|---|---|
| Labels on gaps | Blind relabel of a sample; publish the disagreement rate (`audit-protocol.md`) | Agreement can be counted, so count it. |
| A critical path | Adversarial check (`agents/reviewer.md`, mode C) | There is nothing to count; argue the time or cost sits elsewhere and re-fetch every figure. |
| A proposed gap | Novelty refutation (`agents/reviewer.md`, mode B) | Default to "already covered" and make the proposal survive. |
| Anything published | Completeness check (`agents/reviewer.md`, mode D) | The last thing before a reader sees it. |

## Commands for this work

```bash
node engine/rebuild.mjs                                   # validate everything; lists every problem
node engine/check-preregistration.mjs <file>              # check a chain's prediction before committing it
node engine/search.mjs "query" --phase <name> --gap <id>  # a logged, cached search
node engine/export-searches.mjs <name> --phase <name>     # save searches into research-log/searches/
node engine/export-artifact.mjs                           # regenerate the site's data
```

## What lives where

| Folder | Holds |
|---|---|
| `methodology/` | How to do each kind of work. This folder. |
| `agents/` | Briefs to hand a sub-agent, one per role. |
| `research-log/` | Every judgment and every piece of evidence, as files. The source of record. |
| `research-log/critical-paths/preregistered/` | Chain predictions, committed before the chain. Not read by rebuild. |
| `research-log/searches/` | Saved searches, restored into `search_log` on rebuild. |
| `docs/` | What was found, what is open, and how the repo runs. |
