# Gap Map augmentation

An **additive** augmentation of Convergent Research's Fundamental Development Gap Map
(gap-map.org, v1.0: 103 R&D gaps, 369 foundational capabilities, 20 fields).

We propose two things they do not have: **critical paths**, decomposing a gap into the
steps the work runs through and showing which of their capabilities act on each, and a
**kind-of-work label** on every gap saying what stands in the way and whether AI reaches
it. It ships as a public artifact and a short note.

It is a **contribution, not a critique.** They say the map is not comprehensive and
invite contributions. Tone follows from that everywhere.

## Always, in every session

1. **Never commit or merge to `main`, and never edit this file, without asking David.**
   Work on a branch, push it, ask. This holds even when the change looks obviously right
   and even when a brief names `main` as the working branch. Asking costs one message.
2. **Lead with the answer.** Every document, page and reply opens with a TL;DR readable
   in one pass. Detail below, clearly separated. `methodology/writing.md`.
3. **Additive only.** Never modify `gm_*` outside `engine/import-gapmap.mjs`.
   `node engine/verify-additive.mjs` must pass before every commit. Do not fix their typos.
4. **Never rank their gaps.** No score column exists, by design. They deferred
   prioritisation deliberately. We may rank what we create.
5. **Named values only.** Every taxonomy value is a CHECK constraint. An invented enum
   value is a write failure, and that is the point.
6. **Every judgment carries a rationale and a confidence** (`confident` or `guess`). A
   run that produces no guesses is not confident, it is dishonest.
7. **Preserve their ids and slugs**, so the additions join back to their data.
8. **One track, one worktree.** `node engine/worktree.mjs <track>` before starting.
9. **Ask before anything outward-facing or hard to reverse** — a push to `main`, a
   merge, a deploy, a public visibility change, a message to Convergent. Everything else,
   decide and proceed: `docs/architecture.md`.

## The four failure modes, in the order they happen here

1. **Burying the story in method.** They want to know what their map looks like with the
   attributes added, not how the labelling was audited.
2. **Shipping a number nobody sanity-checked.** Agreement is not validity. Sort by the
   new label and read the top and bottom ten rows before any chart ships.
3. **Confessing at length.** One clear statement of a limitation beats four.
4. **Acting where you should have asked.** See rule 9.

## Start here

```bash
node engine/worktree.mjs <track-name>      # ../wt-<track>, new branch, .env copied
cd ../wt-<track> && node engine/rebuild.mjs && node engine/preflight.mjs
```

`git fetch` first. The primary clone is coordination space, not a workspace. If you find
commits you did not make, stop and report before merging.

## Commands

```bash
node engine/preflight.mjs        # node, database, additive guardrail, key, network, branch stamp
node engine/rebuild.mjs          # recreate the database from the snapshot + research-log
node engine/verify-additive.mjs  # the guardrail — must pass before every commit
node engine/export-artifact.mjs  # regenerate data.json and the CSV
```

## Where to look

| | |
|---|---|
| What is outstanding | `docs/todo.md` — update it when you pick something up |
| What every term means, and whose word it is | `docs/glossary.md` |
| What the work found | `docs/findings.md` |
| How to write anything here | `methodology/writing.md`, and the `writing-like-convergent` skill |
| How to write *this* file | `docs/claude-md-guidelines.md` |
| Taxonomy values and discriminating examples | `methodology/taxonomy.md` |
| Critical paths, and what "binding" means | `methodology/critical-path.md` |
| Auditing and sanity-checking labels | `methodology/audit-protocol.md` |
| Research tooling and sourcing rules | `methodology/research-method.md` |
| Repo layout, the derived database, decision protocol | `docs/architecture.md` |
| Working in parallel without collisions | `docs/worktrees.md` |
| Deployment and access control | `docs/vercel-deploy.md` |
