# What is left

**Updated 2026-09-05.** Branch `front-page-rewrite`. The page is too long (1,284 words
of prose), reads as AI-written, and looks like a Claude artifact. Four tracks below, in
the order they should happen: look, then the chain view, then the words. Nothing on this
list is started.

---

## You decide first — these change the work

- [ ] **"Carries the cost" is undefined. Define it, rename it, or drop it?**
      It is the `is_binding` flag. `methodology/critical-path.md` says to record
      "whether it is binding" and never says what binding means, and the chains page
      already half-disowns it: *"On a strictly sequential chain that is circular."*
      On the publishing chain it means "this is where reviewer and editor labour
      concentrates", which is a judgment with no per-step number behind it.
      My recommendation: drop the flag from the step rows. Once each row shows AI
      impact, AI maturity and a capability count, "carries the cost" is a fourth
      unquantified opinion competing with three quantified facts.
- [ ] **Accept a time bar with holes in it?** Four of the seven publishing steps have a
      defensible published duration. Three do not, and one of those three is credit and
      legitimacy. A bar that visibly stops at step 5 says *the steps we cannot measure
      are the ones that bind*, which is the argument. The alternative is no bar.
- [ ] **Which takeaway leads?** Your draft says drafting is where AI has had the biggest
      impact. The chain currently says the drafting saving was real and did not show up
      as cheaper publishing, because the load moved downstream to desk screening. Both
      are true and the emphasis is opposite. Pick one.
- [ ] **Does the telescope survive?** It is one sentence on the front page plus its own
      chain. Your draft does not mention it.
- [ ] **Any colour or type direction**, or do I take a swing and you react?

## 1. Look — `frontend-design`

- [ ] **Replace the palette and the type.** Your read is right and it is specific:
      `--page: #f3f2eb` is the Claude cream, and every heading is Georgia via
      `--font-serif`. That pairing is the tell.
- [ ] The `frontend-design` plugin skill is installed but is not being listed as
      available (it registers with `version: unknown`). Its file is readable at
      `~/.claude/plugins/cache/claude-plugins-official/frontend-design/unknown/skills/`
      and I will work from it directly.
- [ ] Check both themes and both widths after. `TIER_COLOR`'s light-to-dark ramp still
      reads good-to-bad and can be fixed in the same pass.

## 2. The chain view — vertical scroll, one step per row

- [ ] **One row per step**, replacing the current horizontal node strip.
- [ ] Columns per row: step name · does AI impact it · **how mature that AI is** ·
      capability count with links · duration bar (pending your call above).
- [ ] **Step-level AI maturity is already in the database and has never been shown.**
      Every link carries `ai_type` and `maturity`. Publishing runs: drafting and
      screening *Working now*, recruitment and review judgment *2-5 years*, credit and
      legitimacy *Speculative*. That is your gap-level measure at step level, already
      labelled, free to display.
- [ ] **Deep-link every capability to gap-map.org.**
      `https://www.gap-map.org/capabilities/<slug>/` resolves 200, and we hold the
      slugs. Confirmed against four publishing capabilities.
- [ ] Capabilities may map to more than one step, and two already do.
- [ ] Named initiatives per capability: their export carries resources per capability,
      so the initiative links come from their data rather than from ours.

## 3. Duration and investment per step (research)

- [ ] Decide what is measurable, and publish the holes rather than filling them.
      Candidate sources: submission-to-acceptance and acceptance-to-publication medians
      (a systematic review of 69 studies gives 70-558 days across biomedicine), and the
      per-step figures the chain already carries for steps 1-4.
- [ ] Credit and legitimacy has no time measure and probably cannot have one. That is a
      finding, not a gap in the research.

## 4. The words

- [ ] **Rewrite from your draft, not from the current page.** Yours is roughly 250 words
      against 1,284 and the structure is better. Clean it up, do not expand it.
- [ ] Anything I add beyond your draft goes on the page in a distinct colour for you to
      accept or cut, and comes off before it ships.
- [ ] Re-run `docs/check ai language.md` at the end, not during.

## Still true from before

- [ ] **The cover note.** `docs/cover-note.md` is the email and it is the last blocking
      item. It also now describes a page that is about to change again.
- [ ] No repository link anywhere, so file citations on the site are dead.
- [ ] `findings.md` still points readers at the empty `search_log` table.
- [ ] Delete merged branches: `worktree-isolation`, `vercel-deploy-prep`,
      `review-gates`, `maturity-repair`, `site-story`, `gate-d-rerun`,
      `front-page-one-example`, `convergent-voice`.

## Known weak, not being fixed

- Outcomes have never had a second pass, except the one gap David worked through.
- "Proxy only" ran 78% disagreement and probably should be dropped. 19 gaps hold it.
- Outcomes and progress indicators are built, in the export, and not proposed.

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
