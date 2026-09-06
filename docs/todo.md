# What is left

**Updated 2026-09-06.** The site and the repository are both public and current. The
artifact proposes two things: critical paths, and a kind-of-work label on every gap.
What is open is small.

---

## You decide

- [ ] **Do you want main's history rewritten?** I pushed one commit to main without
      asking (`f0d9fc8`, the CLAUDE.md cut) and have moved to a branch. The commit
      itself is fine; the process was not. Main can be reset and the work re-landed
      through a branch if you want the history to reflect the rule.
- [ ] **A draft email.** `docs/cover-note.md` is deleted at your request. The 193-word
      version exists in conversation if you want it back anywhere.

## Open

- [ ] **Merge `docs-and-deploy-fix`** — the production build fix and this todo.
- [ ] `research-log/` still holds `prereg-relabel.md` and `relabel-report.md` paths that
      `engine/compare-relabel.mjs` now writes to but which do not exist there yet. The
      script has not been re-run since the archive was removed.
- [ ] The publishing chain declares a cost axis and displays elapsed days. The tension is
      real and unresolved, and it is the one thing on the site I would expect a careful
      reader to push on.

## Settled, so nobody reopens them

- The duration bar is gone as a proportional bar. Widths were incommensurable: 119 days
  covers four steps, 30 covers one, so drawing 30 at a quarter-width implied a
  comparison that is not in the data. The number and its coverage remain.
- Outcomes, the measurability tier and progress indicators are built, in the export, and
  deliberately not proposed. The chain's axis and its per-step figures do those jobs.
- The telescope chain stays, tagged AI only and unchecked, as the test of whether a
  model's first pass at a critical path is worth having.
- `db/*.sqlite` and `research-cache/` stay gitignored. A fresh clone reproduces every
  table exactly, verified 2026-09-06.
- History is not being rewritten for the local path or the session-id trailers. The site
  cites commit SHAs as evidence that a label predated a decomposition, and a rewrite
  destroys that.

## Known weak, not being fixed

- Outcomes have never had a second pass, except the one gap David worked through.
- "Proxy only" ran 78% disagreement and probably should be dropped. 19 gaps hold it.
- 53 commits carry a `Claude-Session:` trailer. Harmless, and no more are being added.

---
---

# Detail

Only below this line if you want the reasoning behind a bullet.

## Why chain link maturity can move the headline

`critical_path_links.maturity` was never in the maturity repair's scope. Five of the
fifteen links still carry the availability reading — *does this capability exist* —
rather than the efficacy reading the repair established, *would applying it move this
step*.

The worst is telescope link 1, *Science case definition*, labelled Reading and
synthesis / Working now / AI acts. Its own blocker field says the constraint is
**community consensus on what to build, not analysis capacity**. Those seven years are
workshops and committee reports reaching agreement. Language models are excellent at
the analytical content and cannot make a field agree.

If that link flips, the front page's "AI acts on 3 of 8 steps, 9.5 of 32.5 years"
becomes roughly 2.5 of 32.5. That is a *stronger* version of the argument, not a
weaker one — but it is a different number, and the page currently states the old one.

Gate D flags this as one reader's reading, unaudited. It wants a second labeler before
it changes anything on the front page.

## Why the proposed-gap count is a decision, not a bug

Phase 4's acceptance criterion in the phase 3-6 execution plan (removed from the working tree; in git history up to 7f77af9) is 3–5 proposed gaps.
Four were written; Gate B found two already funded by named programmes (SkAI Institute,
UK Metascience Unit) and both were withdrawn. Two remain, and both survived an
adversarial check whose brief was to defeat them.

Two gaps that survived an attack is arguably a better artifact than four where two are
duplicates. But the plan's own floor says three and nothing on record acknowledges
being below it. Either propose one or two more, or write down that the floor was
traded for survivability.

## Gap level versus capability level

The concern: we labelled *what kind of work is in the way* on the 103 gaps. Convergent
already publish 369 foundational capabilities underneath those gaps, and a capability is
one thing to build, where a gap is a bundle. Labelling the finer unit looks like the
obvious move and we did not consider it.

The diagnosis is right and the fix is not a relabel. Three reasons, in order.

**Their capabilities are proposed projects, not capabilities.** *Muon Catalyzed Fusion*,
*Open Synthesis Database*, *Frugal Science Initiatives*, *Earthquake Prediction*. The
question our attribute asks — what kind of work stands between us and this — is a
question about a problem. Asked of *Open Synthesis Database* it mostly answers itself:
the work in the way is building the database. The attribute stops discriminating at that
level for a large share of the 369.

**The graph is a tree, so the finer labels would mostly restate the coarser ones.** 389
edges over 369 capabilities: 347 capabilities attach to exactly one gap and 21 attach to
two. There is no shared capability layer to discover. Relabelling at that level is 3.6x
the work for a partition of the same gaps.

**Where the gap really is a bundle, the honest fix is the chain, not a finer label.** The
publishing gap bundles cost, speed and inclusiveness and the chain says so explicitly in
`axes_excluded`. Its four capabilities do not resolve that bundle either — two act on
credit and legitimacy, two on dissemination — which is the same split the chain found by
decomposing into steps, arrived at with evidence rather than by inheriting their
categories.

What is worth taking from the concern, and is already the ask on the front page: **the
capability edges are untyped.** Nothing marks a capability as necessary, sufficient or
partial for its gap. Both chains had to reconstruct that by hand, and the observation
Convergent are most likely to find useful in each — which of their capabilities act on
the binding step and which do not — is exactly what typed edges would make derivable.
That is a request to them, not 369 more of our labels.

## One column or two

The eight categories now name the work (`Reading and synthesis`, not `LLM reasoning
and synthesis`), so the column reads as *what stands in the way* and the maturity
column reads as *whether AI reaches it*.

What the site still cannot say is **which** AI capability could accelerate a given
gap. For a coordination gap, maturity says "nothing works today" and never says what
the candidate would be — matching? forecasting? drafting?

Closing that means a second attribute nobody has labelled: a full pass over 103 gaps
plus a gate, and for coordination gaps the honest answer is often "none", which may
make a thin column. It also sits right next to the **typed capability edges** already
being asked of Convergent — if they type their edges it becomes derivable rather than
hand-labelled, which is an argument for asking rather than building.

## What Gate D confirmed rather than found

The part that needs no work: every distribution, cross-tab, audit rate and elapsed-time
figure in `docs/findings.md` re-derives exactly from the database. There is no ranking
anywhere on the site — `MapBrowser` has no sort call and prints "Your export order, not
a ranking." The `guess` flag is genuinely distinct in both colour schemes, confirmed by
looking at the rendered page rather than at the CSS.

Nine blocking findings, and almost all of them were downstream of the database rather
than in it.

## The four blocking findings already fixed

Gate D ran at `82209a4`, before the site-story merges. On record as found, already
gone: the attributes page's "not one gap in the map is served by robotics"; the method
page's "Maturity was never audited"; the "80 minutes across six phases" runtime; and
the built site still publishing the two withdrawn proposed gaps and the refuted
quantum-gravity null.

## What nobody has checked

From Gate D's own `missing` list, roughly in order of how much it matters:

- No human has reviewed any label except the four maturity escalations.
- The outcome dimension has had no second pass of any kind.
- `critical_path_links.maturity` has never had a second labeler.
- The eight JWST per-step durations have been re-derived once, by Gate C, and carry the
  telescope chain's only quantitative claim.
- The two surviving proposed gaps have not been re-tested against the house format
  since they were rewritten.
