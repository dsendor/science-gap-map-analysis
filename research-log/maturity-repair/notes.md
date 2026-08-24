# Maturity repair: notes not required by the deliverable

## The four escalations were answered — all four to `2-5 years`

David ruled on 2026-08-23 and all four are applied. Three went the way this pass leaned;
*Ephemeral Societal Data* went against the weak lean recorded below, on the strongest
version of the argument: the technology has been solved for years and the data is still
disappearing, which is itself the evidence that the blocker is institutional. The
recommendations below are left as written, unedited, so the calibration is checkable.

Two of the four were labels both independent passes had agreed on. See "Making agreement
overridable" at the bottom.

## Two things David raised that are not this branch's work

**A `5-10 years` maturity value.** Raised against *AI is Still Narrow*, where he thought
`2-5 years` was clearly better than `Speculative` but not obviously right either. The
diagnostic supports him: after this repair **63 of 103 gaps sit in `2-5 years`**, 61% in
one bucket, and a bucket holding three fifths of the data is barely a label. `Speculative`
is also doing double duty — it means *no clear path*, which is a claim about kind, while
`2-5 years` is a claim about time, so a gap with a perfectly clear path that simply takes
fifteen years has nowhere to go.

Recommendation is still **not now**, and the reason is not caution. Adding a fourth value
means re-reviewing all 63 gaps currently at `2-5 years`, because a value nobody has applied
to the whole set is worse than three honest ones — the 63 would silently mean "2-5 or
5-10, unexamined". That is a full pass, on the scale of the v2 relabel, and it should be
its own branch with its own blind second reader. It should also probably split the two
axes rather than adding a bucket to one of them: *how long* and *is there a path* are
different questions and the current three values conflate them. Recorded as a decision.

**A "blocked on adoption, not capability" dimension.** David's note on the clinical-trials
ruling — "there are similar institutional issues that we should investigate in a further
version of the gap map." This repair kept running into it: the reason for eleven of the
downgrades is not that the technique is missing but that nobody has adopted it. Malicious
bioengineering (screening exists, adoption does not), scientific publishing, development
economics, civic deliberation, longitudinal cohorts, ephemeral data, clinical trials.
Maturity currently absorbs all of that and reports it as "not ready", which is the wrong
diagnosis for a funder: the intervention for an unadopted capability is not more research.
That would be a genuinely new contribution to their map rather than a correction to ours,
and it is out of scope here.

## Recommendations on the four escalations, as written before the answers

Kept here rather than in `escalations.md` so the question is read before the answer.

- **Ephemeral Societal Data.** Weak lean to `2-5 years`. The pinned example says
  permission-as-blocker is the gap, and treating archiving-where-permitted as working
  now is the availability reading wearing a technical costume. But this is the case the
  plan itself flagged as genuinely two-sided and I do not think it is mine to close.
- **Clinical Trials Are Poorly Optimized.** Lean to keeping `Working now`. RECOVERY and
  I-SPY2 are a real difference in kind from vTaiwan and Novissi: the mechanism reached
  regulatory scale and changed practice, rather than being demonstrated in pilots. If
  that distinction does not hold, this should go to `2-5 years` and coordination is left
  with at most one working-now gap.
- **Inadequate Emergency Climate Interventions.** Lean to `2-5 years`, fairly strongly.
  The neighbouring gap already carries the modelling claim, and a label that adds nothing
  to its neighbour is the category-not-gap failure. Escalated only because it is the one
  place in this pass where I overturn a label both independent passes agreed on.
- **AI is Still Narrow.** Lean to `2-5 years`. `Speculative` means no clear path, and
  reasoning-trace RL is a path that is visibly working, whatever one thinks of where it
  tops out.

## Types that look wrong, recorded and left alone (out of scope, per the plan)

- **Uncertainty and Noise in the Science of Room-Temperature Superconductivity** —
  primary `Coordination and institutional`. The description has two halves: irreproducible
  and fragmented measurement, which really is coordination, and whether metallic hydrogen
  superconducts at reasonable pressures, which is condensed-matter physics. The maturity
  label was set against the coordination half because that is the type on the row.
- **Some Proteins Are Still Recalcitrant to Experimental Structure Analysis** — primary
  `Design and optimization search`. The obvious lever on this gap is structure prediction,
  which is `ML surrogates and prediction`. Keeping the stated type is what produced the
  `2-5 years` call: under design search the relevant capability is designed crystallisation
  and cryo-EM chaperones, which are emerging rather than routine. Under ML surrogates the
  answer would probably have been `Working now`. Flagging because the maturity label here
  is unusually sensitive to a type this pass did not adjudicate.
- **Inadequate Interventions for Greenhouse Gas Removal** — primary `Sensing and signal
  processing`. Defensible, since measurement really is the named blocker for natural
  carbon removal, but the gap is mostly about interventions. Not in the review set;
  noticed during the spot-check and left.

## Calls that were close, decided, and would not embarrass anyone who disagreed

- **Protein Design Has Been Limited to Static, Bio-mimetic Structures** → `Working now`.
  Turns entirely on whether designed dynamics counts. De novo structure design is
  unambiguously working; LOCKR-style switches and designed hinges exist but are not
  routine. Went with `Working now` because the gap's primary complaint is biomimicry and
  that one is answered.
- **Modeling Mechanical Systems is Hard** → `Working now`. Learned surrogates ship in
  commercial CAE tools. The counter-argument is that they interpolate inside their
  training distribution and are not trusted for certification, which is a real limit
  but is not the gap as stated.
- **Incomplete Resolution of the Possibility of Low-Energy Nuclear Reactions** — kept at
  `Working now`, which looks startling next to the gap name. It is right: the gap is an
  underexplored parameter space in materials and calorimetry, which is exactly the shape
  a bench-scale self-driving lab searches. Working now on the search, not on the physics.
- **We Can't Take High-Resolution Movies of ... Brain Computation** — kept at
  `Working now` while its neighbour *Light Scattering in Living Tissue* went to
  `2-5 years`. The split is deliberate: ML spike sorting and denoising are what make
  large-scale single-neuron recording usable today, whereas the depth gains of the last
  decade came from three-photon hardware rather than from algorithms.
- **Limited Tools for Improving ... Epistemics in the Face of Misinformation** — left at
  `2-5 years`. Community Notes is a deployed algorithmic epistemic intervention with
  measured effects, which is a genuine working-now instance, but it is one feature on one
  platform against the gap as written.

## A note on where the repair had to be applied

The plan said maturity lives in `research-log/labels/*.json`. For primaries it does not:
`engine/apply-relabel.mjs` deletes and rewrites every `is_primary=1` row from `relabels`
plus `research-log/relabel-adjudication.json`, so editing the v1 label files would have
changed nothing visible and would have silently corrupted the v1-vs-v2 agreement
statistics that `docs/relabel-report.md` and `methodology/taxonomy.md` both cite. The
repair went into the adjudication file instead, which is also the more honest structure:
v1 and v2 are records of two independent passes and should stay as they were written;
adjudication is where judgement belongs. Detail in `report.md`.

## Making agreement overridable

Two of the four rulings — *Ephemeral Societal Data* and *Inadequate Emergency Climate
Interventions* — were on gaps both independent passes agreed on, and `apply-relabel.mjs`
had no way to express that. Its agreed branch took v1 unconditionally and never looked at
the adjudication file, so agreement was a rule that could not be overridden.

That is the same defect as "on disagreement take v2", one layer down, and it is how this
project got here: two passes sharing a misreading is exactly what happened to *AI Could Be
Misused*. Agreement is evidence, not proof.

`engine/apply-relabel.mjs` now treats agreement as a default. An explicit adjudication
entry wins even where the passes agreed, and the rebuild log prints the override count on
its own line so it can never happen quietly. Current output:
`44 agreed, 9 adjudicated confident, 48 adjudicated guess` plus `2 gap(s) both passes
AGREED on were overridden`.

`engine/` belongs to the review-gate branch for the duration of these two tracks, so this
was checked first: `review-gates` modifies `adjudicate.mjs`, `audit-report.mjs`,
`ingest-indicators.mjs`, `ingest-new-gaps.mjs` and `rebuild.mjs`, and not this file. The
change is 13 lines in one file that branch does not touch.
