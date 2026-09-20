# What is left

## Decide: publish the turbulence chain, and whether two new gaps are wanted

The third critical path is built and on the branch
`claude/turbulence-modeling-ai-gaps-aca454`: **`path-turbulence-cost`**, on Physics /
*Inability to Model Turbulence*, a cost chain in CPU core-hours per flow condition.
It is `reviewed: "ai-only"` and not on the site. Three things need David.

**1. Does the chain go on the site?** Publishing is a separate change: the pages select
chains by hard-coded id in `app/src/app/chains/page.jsx` and `app/src/app/page.jsx`,
and the Mermaid source in `app/src/components/mermaid.js` needs the steps.

**2. Does `reviewed` become `"human"`?** Only David sets that, and only after reading the
chain against the gap. The adversarial review in mode C has run; its findings are in
`research-log/reviews/`.

**3. Are two new gaps wanted?** The chain surfaced two candidates that sit *between*
Convergent's gaps rather than inside them, and task C1 in `docs/future-work.md` says
whether more proposed gaps are wanted at all is David's call:

| Candidate | Why it is not the turbulence gap |
|---|---|
| Reference data for turbulence models cannot be produced at the Reynolds numbers that matter | It is the input to modelling, not the modelling. DNS cost scales as Re^2.91; the experimental route is limited by test cost and instrumentation. |
| A computed prediction has no accepted basis for use where no validation record exists | Certification-by-analysis calls this *predictive capability*. It blocks every simulation field, not turbulence alone. |

Neither has been written in house format or put through a novelty refutation. That is
`methodology/house-format.md` and `agents/reviewer.md` mode B, and it is only worth
doing if the answer to (3) is yes.

## What the chain did to the method

Both earlier chains found AI missing the step where the time or cost concentrates. This
one was chosen to test whether the method can return the opposite answer, and the answer
it returned is a third thing: **AI does reach the step carrying the measured cost, and
four of the seven steps have no number on this axis at all** — including the two that
practitioners name as the expensive part. That is a result about what has been priced,
not only about where the cost is. Whether that reading survives is what the review and
David's reading are for.

---

## In short

- **The next critical path is built**: `path-turbulence-cost`, on *Inability to Model
  Turbulence*, pushed on `claude/turbulence-modeling-ai-gaps-aca454`, reviewed ai-only.
- **Three decisions wait on David**: publish it to the site, mark it human-reviewed, and
  whether to write up the two candidate gaps it surfaced.
- **It returned a third answer, not the opposite one.** AI reaches the priced step; the
  steps that plausibly cost more carry no published figure.
- The rest of the backlog is unchanged and lives in `docs/future-work.md`.
