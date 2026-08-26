# What is left

**Updated 2026-08-25.** All four review gates have run. Gate D re-ran against the
settled database: 38 findings, 9 blocking, 4 of those already fixed. The database
itself is clean — every figure re-derives, no ranking anywhere, additive guardrail
passes. What is left is text, one label problem, and two decisions.

---

## Needs you

- [ ] **Review the argument page.** Rewritten, live at `http://localhost:4321`. Good
      enough to send?
- [ ] **Decide: one column or two.** Categories now name the work. Do we also need a
      separate "which AI could accelerate this" attribute? Costs a full relabel.
- [ ] **Decide: proposed gaps.** Two survived Gate B; Phase 4's own floor is 3–5.
      Propose more, or record the shortfall and move on?

## Must fix before anything is sent

- [ ] **The email.** `docs/cover-note.md` still leads with the withdrawn gradient and
      a number (17) that exists nowhere in the database. Last blocking item.
- [ ] **Second labeler for `critical_path_links.maturity`.** 5 of 15 links carry the
      old availability reading. Telescope link 1 is flagged contested in its rationale
      and the front page now states a range instead of a point; flipping the label
      needs a second reader, not one.
- [ ] `findings.md` still points readers at the empty `search_log` table.

## Site

- [ ] Eight pages is a lot. Fold *Indicators*, *Proposed gaps*, *Attributes* together?
- [ ] No repository link anywhere, so every file citation on the site is dead.
- [ ] `TIER_COLOR` light-to-dark ramp reads good-to-bad.
- [ ] Cross-tabs are computed into `data.json` and rendered nowhere.

## Method debt

- [ ] **Outcomes have never had a second pass.** 102 of 103 confident, one labeler, no
      audit. Largest unverified thing in the project.
- [ ] "Proxy only" ran 78% disagreement and probably should be dropped. 19 gaps hold it.
- [ ] House-format test never re-run after the fixes.
- [ ] Gate C deferred items: chain 2's binding flags and axis choice (C8–C11).

## Housekeeping

- [ ] Delete merged branches: `worktree-isolation`, `vercel-deploy-prep`,
      `review-gates`, `maturity-repair`, `site-story`, `gate-d-rerun`.
- [ ] Re-run Gate D once more after the above. It is a verification gate and should be
      the last thing that happens.

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

Phase 4's acceptance criterion in `docs/local-agent-plan.md` is 3–5 proposed gaps.
Four were written; Gate B found two already funded by named programmes (SkAI Institute,
UK Metascience Unit) and both were withdrawn. Two remain, and both survived an
adversarial check whose brief was to defeat them.

Two gaps that survived an attack is arguably a better artifact than four where two are
duplicates. But the plan's own floor says three and nothing on record acknowledges
being below it. Either propose one or two more, or write down that the floor was
traded for survivability.

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
