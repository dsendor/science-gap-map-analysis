# Pre-registration: AI-type relabel against the 8-category taxonomy

**Written and committed before any relabeling.** The git log is the evidence. A
prediction recorded afterwards is a story, so this file exists in its own commit and
nothing in the relabel runs until it is pushed.

## What is changing and why

Blind audit found that closed-loop control of a physical system had no home in the
seven-category AI taxonomy. `Real-time control of physical systems` has been added.
Only the AI-type dimension is affected, so only that dimension is being relabeled.
Outcomes and measurability tiers are frozen at their Phase 1–2 values.

## Method, and why it is not me relabeling

I produced the v1 labels, so I cannot relabel independently — I remember them. The
relabel is therefore done by fresh sub-agents that receive the gap data and the revised
taxonomy and never see v1.

That makes this stronger than the original plan. It is a **full-coverage independent
second pass over all 103 gaps**, not a 36-gap sample, so it yields a complete
disagreement rate rather than a stratified estimate. Agreement between two independent
labelers becomes the confidence signal; disagreement is adjudicated on the merits and
downgraded to `guess` where adjudication does not resolve it.

## Predictions

Recorded so they can be scored, not so they can be confirmed.

**P1 — Uptake.** Between 3 and 7 gaps take `Real-time control of physical systems` as
primary. Named candidates: fusion plasma confinement (v1: ML surrogates), formation
flying for space interferometry (v1: Physical build), light scattering in tissue via
adaptive optics (v1: Sensing), sim-to-real robot transfer (v1: ML surrogates).

**P2 — Control is a high-maturity category.** Control has fast, objective feedback, so
verifier's law predicts early AI arrival. I expect its working-now share to land above
the map median, in the top three categories, plausibly 30–60%.

**P3 — The gradient's shape survives.** LLM reasoning stays at or near the top;
`Physical build and manipulation` stays at 0% working-now. I expect control to take **at
most one** gap from physical build.

**P4 — Test-retest noise.** Two independent labelers using the same taxonomy will differ
on more gaps than the taxonomy change alone explains. I expect **20–35%** total
disagreement across all 103, consistent with the 33% measured on the sampled audit. Most
of it will not involve the new category.

## What would count as a refutation, and what I will do about it

- If control takes **zero or one** gap, the category was not worth adding. I will say so
  and record that the audit finding, though real, was marginal in practice.
- If control's working-now share is **low**, P2 is wrong and the verifier's-law reading
  of this dimension is weaker than claimed.
- If physical build stops being 0% working-now, **the headline finding changes** and the
  artifact reports the new number. This is the outcome that would most damage the thesis,
  and it is the one I am most obliged to report plainly.
- If disagreement exceeds ~40%, the AI-type dimension is too unreliable to carry any
  conclusion, and the artifact should present it with that caveat rather than as a
  finding.

The delta is reported whichever direction it goes. Re-running a taxonomy after seeing a
result invites the charge of fitting the taxonomy to the thesis; the defence is that the
expectation was fixed in advance and the refutation conditions were named before the
data came back.
