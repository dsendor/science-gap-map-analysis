# Maturity repair: notes not required by the deliverable

## Recommendations on the four escalations

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
