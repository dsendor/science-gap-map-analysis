# Audit protocol

Adapted from `ai-science-gap-map/methodology/skeptical-review.md`. In that project the
skeptical review was the load-bearing gate — no theory of change reached
`investment-ready` without a passing review row, enforced by a database trigger. Here
the same idea does a different job.

**What this is for.** The brief's constraint is that "the credibility of this artifact
rests on being auditable, not on being confident." A stranger's confident labels on
someone else's dataset are worth nothing. A stranger's labels with a *published
disagreement rate* are worth something, because the reader can price them.

## Method

1. A second agent, which did not produce the original labels and cannot see them,
   relabels a stratified sample. Stratify across field and across measurability tier
   so the sample cannot be dominated by the easy fields.
2. Every relabel is written to `audits` with `agreed` set by exact match on the value.
3. The disagreement rate is computed per dimension and **published in the findings
   summary.** It is not a diagnostic to be fixed until it looks good.
4. Disagreements are re-adjudicated on the merits. Where adjudication resolves them,
   the adjudicated value stands. **Where it does not, the label is downgraded to
   `confidence = 'guess'`** rather than argued into agreement.

## Reviewer stance

Carried over from the predecessor protocol, and the reason it works:

- **Default assumption: the label is wrong.** Make the original justify itself.
- **Do not salvage during the critique.** Record the disagreement first. Fixing and
  judging in the same pass produces agreement by construction.
- **Anti-sycophancy.** "This seems reasonable" is not a review. If the auditor agrees,
  it must be able to state the discriminating test it applied.

## Expected pressure points

Predicted in advance, so a high disagreement rate here is informative rather than
alarming:

- **Tier 3 vs. tier 4** — contested verification vs. counterfactual required. The
  hardest and most consequential call in the taxonomy.
- **Primary AI type** where two types plausibly apply, especially
  `Design and optimization search` vs. `ML surrogates and prediction`.
- **`Autonomous experimentation` vs. `Physical build and manipulation`** — different
  by decades of maturity; collapsing them destroys the headline finding.
- **Outcome sentences that restate the gap** instead of naming what becomes knowable.

A disagreement rate near zero on tier assignment would be evidence the audit is not
independent, not evidence the labels are good. Say so if it happens.
