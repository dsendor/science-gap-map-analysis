# What is left

**Updated 2026-08-31.** Front page rebuilt around the publishing gap as the single
worked example. Chart moved to Attributes. Everything not human-reviewed now carries an
"AI only" tag. What is left is three indicator rows and a cut pass.

---

## You do

- [ ] **Read the new front page.** `http://localhost:4321` after `npx next build`.
      Shorter, one example, no chart. Is it the thing you would send?
- [ ] **Pick the further cuts.** Options are in *What can still come out* below.
- [ ] **Decide: publisher operating margin as the "accepted, verified" indicator?**
      38.4%, RELX STM 2024, public and audited. The alternative is an honest null.
- [ ] **Decide: proposed gaps.** Two survived the adversarial check; the plan's floor
      was 3-5. Propose more, or record the shortfall?

## I do

- [ ] **Write the three indicator rows** for the publishing gap: cheap, quick,
      accepted-and-verified. Research is done; see *What the measurement search found*.
- [ ] **Fix the capability double-count in chain 2.** Link 6 says three of four
      Convergent capabilities act at dissemination or upstream; the finding says two of
      four act at credit and legitimacy. *New Protocols* is counted in both.
- [ ] **The cover note.** `docs/cover-note.md` still leads with the withdrawn gradient
      and a number (17) that exists nowhere in the database.
- [ ] `findings.md` still points readers at the empty `search_log` table.
- [ ] No repository link anywhere, so every file citation on the site is dead.
- [ ] Delete merged branches: `worktree-isolation`, `vercel-deploy-prep`,
      `review-gates`, `maturity-repair`, `site-story`, `gate-d-rerun`.
- [ ] Re-run the verification review last, after everything above.

## Done since 2026-08-28

- Outcome for the publishing gap rewritten by David: *"Getting a result into the
  accepted, verified scientific record is cheap and quick."* The one outcome on the map
  a human has read against its chain.
- **Fixed a silent rebuild bug.** `research-log/rewrites/outcomes-v2.json` held the real
  wording of all 103 outcome sentences and nothing replayed it — a clean rebuild
  reverted every one to the first pass with no error. `engine/ingest-outcome-rewrites.mjs`
  now replays it and `rebuild.mjs` runs it after `ingest-labels.mjs`.
- "The measure for each step" table on both chains, with an explicit *no published
  quantity exists* cell where one is missing.
- Telescope chain off the front page, referenced in one sentence.
- Maturity chart moved to Attributes, sorted by share working now.
- `AiOnly` / `HumanChecked` tags; front page carries five and one.

## Known weak, not being fixed

- Outcomes have never had a second pass. One labeller, no audit, except the one gap
  David worked through.
- "Proxy only" ran 78% disagreement and probably should be dropped. 19 gaps hold it.
- Eight pages is a lot. *Indicators*, *Proposed gaps* and *Attributes* could fold together.
- `TIER_COLOR` light-to-dark ramp reads good-to-bad.

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
