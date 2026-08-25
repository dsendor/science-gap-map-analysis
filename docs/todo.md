# What is left, and who has it

Living document. Update the status column when you pick something up, and say which
worktree you are in. If you are not in your own worktree, read
`CLAUDE.md` → *Isolation: one track of work, one worktree* before you start.

**Last updated:** 2026-08-25, after all four branches merged to `main` (`82209a4`).

## Who is working on what right now

| Owner | Track | Worktree | Status |
|---|---|---|---|
| Gate D agent | Rerun Gate D against the settled database | unknown — check | **in flight** |
| This session | Argument page rewrite, todo doc, CLAUDE.md rule | `../wt-site-story` | in progress |
| Deployment agent | Vercel setup and access control | primary clone | **done**, merged |
| Maturity agent | Maturity repair | primary clone | **done**, merged |

Two of those ran in the primary clone. That is what the isolation rule exists to stop;
new work takes a worktree.

---

## 1. The website — the biggest item

The site is eight pages and the argument page does not currently make an argument.

### 1.1 Rewrite the argument page — **highest priority**

Kill the section headed *"What I found, and what did not survive"*. It opens with a
striking result, spends three paragraphs retracting it, diagnoses the definitional
error behind it, and closes with "what survived is weaker". Every sentence is true and
the page is still about us. See `CLAUDE.md` → *The argument page carries one claim*.

**The claim the page should make**, which is about their map and is currently buried:

> Coordination and institutional work is the primary blocker for **15 of 103** gaps.
> Reading and synthesis — the thing AI is best at — is primary for **10**. The
> cognitive layer is a small slice of this map, and the critical paths show why:
> on the telescope chain AI acts on three of eight steps, 9.5 of 32.5 years.

That is accurate, repeatable, and needs no caveat to be understood.

**Where the current content goes:** the relabel non-replication, the definitional hole
in "working now", the agreement rates → *Method & audit*. The withdrawn gradient →
*What's missing*. Neither is deleted; both stop being the front page.

- [ ] Rewrite `app/src/app/page.jsx` sections "What I found, and what did not survive"
      and "The hypothesis" into one claim section
- [ ] Move the withdrawn-gradient narrative to `missing/`
- [ ] Move agreement rates and the definitional diagnosis to `method/`
- [ ] Re-check every number on the page against the current database

### 1.2 Simplify the rest of the site

- [ ] Eight pages is a lot. Decide whether *Indicators*, *Proposed gaps* and
      *Attributes* stay separate or fold together
- [ ] `TIER_COLOR` runs a light-to-dark ramp that reads good-to-bad (Gate D). Correct
      encoding for an ordered variable, wrong connotation
- [ ] No repository link anywhere on the site, so every file citation on it is dead
      (Gate D)
- [ ] Three pages tell readers to see `search_log`; that table has **0 rows**. The
      searches are real and live in `research-log/searches/phase-3.json`

## 2. The email

- [ ] Rewrite `docs/cover-note.md` — concise, gets them interested, one claim
- [ ] Its headline currently asserts the **withdrawn gradient** on withdrawn v1 numbers
      ("all 17 sit at two-to-five years or speculative"). 17 exists nowhere in the
      current database. Gate D marked this blocking
- [ ] The note claims its numbers are regenerated from the database, which is what
      stops a reader hand-checking the one that is wrong

## 3. Gate D

- [ ] **Rerun against the settled database.** The in-flight run was launched when
      AI-type confidence was 46/57; it is now **55/48** after the maturity repair, so
      every number in the existing report needs re-deriving
- [ ] Then act on it — no acting pass has run for Gate D at all
- [ ] Sequencing: Gate D is a verification gate. Run it *after* 1.1 and 2, not before,
      or it verifies a page that is about to be replaced

## 4. Deferred review findings

From `research-log/reviews/actions.json`. Twelve items, none blocking.

- [ ] **C8–C11** — chain 2's binding flags and axis choice. These contest the
      decomposition rather than a fact in it, so they are a re-derivation and belong
      with the producer
- [ ] **C1** — JWST link 4 interval. Design maturation ran to the 2010 mission CDR,
      four years past the interval it is given. The direction of the error is recorded;
      the interval is not moved because no milestone pair separates overlapping phases
- [ ] **C20, C23** — tone and a heading in `app/src/app/chains/page.jsx`. Will be
      touched anyway by item 1.2
- [ ] **C17** — attribution note on the Meyerson series
- [ ] **B4** — house-format test not re-run after the fixes. Needs a fresh decoy draw
- [ ] **C12, C13** — pre-registration quality caveat, and the empty `search_log` /
      absent `phase-5.json`. Recorded, not fixable after the fact

## 5. Data and method debt

- [ ] **`docs/findings.md` renders fifteen `NaN min` cells.** The bug in
      `engine/audit-report.mjs` is fixed; the document has not been regenerated
- [ ] **No `decisions` rows for the gate acting pass.** `research-log/decisions.json`
      was outside that pass's file ownership and a concurrent agent was writing it.
      The reasoning is in the files it did own, but the ledger is incomplete
- [ ] **"Proxy only" ran 78% disagreement** in the Phase 2 audit and probably should be
      dropped, leaving three tiers. **19 gaps** currently hold it
- [ ] **Outcomes and measurability tiers were frozen at Phase 1–2 values** and have had
      no full second pass. Maturity and type have both had two; these have had one
- [ ] `docs/review-gate-plan.md` still states AI-type confidence as 46/57

## 6. Housekeeping

- [ ] Four merged branches can be deleted: `worktree-isolation`, `vercel-deploy-prep`,
      `review-gates`, `maturity-repair`
- [ ] The primary clone is on `maturity-repair` rather than `main`, so it is still
      doubling as a workspace. Put it on `main` and leave it there
- [ ] `engine/worktree.mjs` is only on `main`, so it is unavailable from any branch cut
      before it — including the primary clone's current checkout

---

## Sequencing

The only hard ordering is that **Gate D runs last**. Everything in 1 and 2 changes the
text it checks, and it has already been run once against numbers that have since moved.

Items 4, 5 and 6 are independent and can go in parallel, in their own worktrees.
