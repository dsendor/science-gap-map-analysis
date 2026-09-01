# Worktrees: one track of work, one directory

**Take your own worktree before you start, and fetch before you take it.**

```bash
node engine/worktree.mjs <track-name>      # ../wt-<track>, new branch, .env copied
cd ../wt-<track> && node engine/rebuild.mjs && node engine/preflight.mjs
```

## The rules

1. **`git fetch` before starting any track**, and again before any commit that follows
   a long gap. A stale clone is silent; nothing warns you. `worktree.mjs` fetches for
   you, which is most of why it exists.
2. **One track, one worktree.** A relabel, an artifact build and a deployment are
   three tracks. Name them for the work (`relabel-v2`, `artifact-rebuild`), not for
   the agent.
3. **The primary clone is coordination space, not a workspace.** Read it, run `git
   log` in it, do not work in it. If `preflight.mjs` warns that you are in the primary
   clone with worktrees attached, you are standing where the collisions happen.
4. **Two gitignored files do not travel with a checkout**, and neither is a reason to
   share a HEAD: `.env`, which `worktree.mjs` copies, and `db/*.sqlite`, which
   `rebuild.mjs` regenerates. A per-worktree database is a feature — two agents
   running `rebuild.mjs` in one directory are writing the same file.
5. **`preflight.mjs` stamps the branch; `rebuild.mjs` refuses if it moved.** If you
   switch branches deliberately, re-run `preflight.mjs` to re-stamp. One limitation,
   found by testing it: the check lives in the working tree, so being switched onto a
   branch that predates it takes the check with it and the rebuild runs clean. It
   protects you against a switch between branches that both carry it, which is every
   branch cut after this one — so treat a rebuild that suddenly stops mentioning the
   workspace as a signal in itself.
6. **Merge into `main` deliberately**, resolving conflicts by hand. Two agents working
   the same files will independently make the same fixes with different wording, and
   they will also make *incompatible* ones — the adjudication ordering in
   `engine/rebuild.mjs` is the example: running `adjudicate.mjs` after
   `apply-relabel.mjs` silently re-downgrades labels the relabel had just resolved.
7. **Say in the commit which session produced it.** The `Claude-Session` trailer is how
   the provenance of the seven commits below was established after the fact.
8. **If you find commits you did not make, stop and report before merging.** Do not
   assume they are yours, and do not assume they are stale.
9. **`git worktree remove ../wt-<track>` when the track is merged.** They accumulate.

# Detail

## Why a branch is not enough

A branch is a label. A worktree is a directory. **A clone has exactly one HEAD**, so
two agents working in the same directory share it: `git checkout` by either one is a
global mutation the other sees instantly and silently, and uncommitted changes ride
along across the switch onto somebody else's branch. Branches do not isolate agents.
Directories do. A worktree shares the object store, so every branch and commit stays
visible from both, and it costs almost nothing on disk.

## The two incidents that forced this

Both on 2026-08-23, and they have different causes.

*Morning, a stale clone.* Two sessions worked the same branch in parallel. One cloned
at Phase 2 and never fetched; the other pushed seven commits in the meantime,
including a rewrite of the very plan the first was executing and a full relabel that
withdrew the finding the first was building its artifact on. Five hours went into an
argument that had already been retracted. Nothing was lost, because both lines were
committed, but the reconciliation cost more than the fetch would have.

*Evening, a shared HEAD.* The session running the review gates created `review-gates`,
and had its working tree switched under it twice by other sessions — first to
`vercel-deploy-prep`, then to `maturity-repair` — carrying its uncommitted engine
edits onto a branch owned by another agent. It noticed both times by accident,
minutes later. The rule in force said "one track, one branch", and both sessions were
obeying it. That is the point: the rule was about labels, and the collision was about
directories.
