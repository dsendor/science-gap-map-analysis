# Cover note — draft, not sent

**Status: draft.** External communication is David's. Nothing here has been sent to
anyone at Convergent Research.

---

Subject: An augmented copy of the Gap Map, plus one thing worth knowing about your export

Hi —

I've been working with the Fundamental Development Gap Map v1.0 export and ended up
building something on top of it. It's a contribution rather than a critique: your own
data, untouched, with four columns added to every gap. Sending it in case it's useful,
and because there's a bug in the export that I think you'd want to know about.

**What's in it**

For all 103 gaps:

- **A stated outcome** — one sentence on what becomes knowable or buildable if the gap
  closes.
- **An AI capability type and maturity** — which of seven named kinds of AI would
  actually move this gap, and whether that kind is working now, two-to-five years out,
  or speculative.
- **A measurability tier** — whether the gap has an agreed observable, only a proxy, a
  contested observable, or a quantity that is inherently counterfactual.

Plus a stratified sample of eight **progress indicators** with real sources, four
**proposed new gaps** written to your house format and kept in their own table, and two
worked **critical paths** with the evidence behind each link.

Every added judgment carries its own rationale and a confidence flag, and the ones that
were uncertain are marked `guess` rather than smoothed over — 24 of the 103
measurability tiers and 20 of the primary AI-type assignments are flagged that way. A
second labeller relabelled a stratified 36-gap sample blind; the population-weighted
disagreement rate on tier is 15%, and 33% raw on AI type. Those numbers are in the
artifact rather than in a footnote, because they are the honest measure of how much
weight these labels bear.

**It is provably additive**

Your five baseline tables are re-serialised and diffed against a hash-pinned copy of the
2026-07-29 export on every commit — `engine/verify-additive.mjs`. If anything of yours
changed, the build fails. The additions live in separate tables and your ids and slugs
are preserved exactly, so the CSV joins straight back to your source data on `id`. There
is no score column anywhere in the schema, by design: you deferred prioritisation
deliberately and a stranger ranking your map would be presumptuous.

**How long it took**

79 minutes of agent time across six phases, and zero minutes of human review. Both
numbers are instrumented rather than estimated and they are reported separately, since a
single blended figure would be the first thing anyone reasonably objected to. Phase 0's
start was never instrumented, so the 79 is a lower bound.

**The export bug**

This is the part I'd want to know if it were mine.

`schema.json` documents `capabilities[].gaps` as "IDs of R&D gaps addressed by this
capability". In the 2026-07-29 export **that array is empty for all 369 capabilities**.
All 389 edges exist only on the gap side, in `gaps[].foundationalCapabilities`.

The graph is still complete — nothing is lost — but any consumer that trusts the
documented capability-side field builds an empty graph and silently reports that no
capability addresses any gap. Anyone starting from `capabilities.json` alone gets
nothing at all.

Two smaller things from the same pass:

- Two capability records have no `description`, which `schema.json` marks required:
  `Earthquake Prediction` and `Subduction Zone Observation`.
- Six resources are referenced by no capability, so they are unreachable by navigation.

Full detail in `docs/integrity-report.md`.

**One structural finding, because it argues for the next piece of work**

The two critical paths were picked to be as unalike as possible — a telescope, on
elapsed time, and research publishing, on reviewer labour cost. They turned out to share
a binding link.

Facility approval and telescope time are both allocated by peer review of proposals: a
decadal survey is a review panel, and so is a time allocation committee. That isn't an
analogy I'm imposing. It is ESO's own stated reason for changing the mechanism — when
they introduced Distributed Peer Review they wrote that panel load "has become
unsustainable" and that "it has become progressively harder to find scientists willing
to serve in the panels and in the OPC", which is the publishing chain's binding link
written by an observatory about telescope time.

Two gaps in two different fields of your map blocked by the same thing is something a
catalogue structurally cannot show — there's one row per gap and nowhere to record that
two rows share a blocker. Chains can, and once you have chains the recurrence is
countable rather than anecdotal.

**Where I think the harder work is**

Four things, roughly in order of how much I'd want to do them with you rather than at
you:

1. **Outcomes as a proper many-to-many entity.** I modelled an outcome as a text field
   on a gap, which is wrong and I've said so in the artifact's limitations. There are
   almost certainly more outcomes than gaps, and one capability can unlock outcomes
   across several fields. Fixing it is a schema change, which is not a thing to arrive
   unsolicited from outside.
2. **Chains across the whole map.** Two is enough to show the method discriminates. The
   value is in counting how often a binding link recurs, and that needs all of them.
3. **Progress tracking as a maintained system** rather than a sample of eight. Two of my
   eight are nulls, and I think that ratio is informative rather than embarrassing — but
   eight is a demonstration, not coverage.
4. **Typed capability edges.** Nothing currently marks a capability as necessary,
   sufficient or partial for its gap. That is the single most consequential absence for
   anyone reasoning about what unblocks what, and it is why the chain work had to
   reconstruct link semantics by hand for two gaps only. It also connects to the urgency
   and impact attributes you've already said you want.

Everything is in the artifact and the CSV. Happy to hand over the whole repository,
including the decision ledger — eleven calls where the runner-up was usually the more
flattering option, recorded with what would reverse each one.

Best,
David

---

## Notes for David, not for sending

- **Numbers checked before drafting.** The 79-minute figure, the 15% and 33%
  disagreement rates, the 24 and 20 guess counts, and the 369/389/6/2 export figures are
  all regenerated from the database rather than typed in.
- **Three figures from the brief were cut, not softened.** The 3ie comparison —
  approximately 42 evidence gap maps, a Development Evidence Portal at roughly 21,800
  impact evaluations and 1,700 systematic reviews, and the absolute-gap versus
  synthesis-gap distinction — did not survive verification. 3ie's own gap maps page
  shows on the order of forty maps but states no total; their published portal figures
  disagree with each other by a factor of three across sources (3,745 impact evaluations
  in one 3ie blog post, "more than 11,000" in another), and nothing found states 21,800
  or 1,700; and neither the gap maps page nor the Snilstveit working paper page uses the
  terms "absolute gap" or "synthesis gap". The substance of the distinction *is* on their
  page — gaps are where "few or no impact evaluations or systematic reviews exist" versus
  "where there is a concentration of impact evaluations but no recent high-quality
  systematic review" — so if a 3ie comparison is wanted later, that quote is the
  defensible version and the numbers are not.
- **Aaron Tohuvavohu** is verified twice: as resource `1c3cb37e-2a00-80a1-8ddf-fb19d0b8b0ee`
  (type Individual) cited by the capability "Space Telescope Factory", which is attached
  to the telescope gap; and by name in the acknowledgments on gap-map.org/about. If the
  artifact leads with that gap there is a named person already associated with it.
- **Tone check.** Every statement about their capability set is phrased as an
  observation. The telescope chain says their three capabilities act on fabrication,
  integration and launch and not on ranking or funding — and immediately notes that two
  of the four binding links are ones they hit, which is better than chance. The
  publishing chain notes that half their capabilities for that gap act directly on a
  binding link.
