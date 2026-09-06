# Findings

**Updated 2026-09-06.** Rewritten against what the artifact actually proposes. The
previous version described four proposed attributes and pointed readers at an empty
table; both were true when it was written in August and neither is true now.

## TL;DR

- **Two things are proposed**: critical paths, and a kind-of-work label on every gap.
  Outcomes, the measurability tier and progress indicators were built, are in the export,
  and are deliberately not proposed.
- **The strongest result comes from Convergent's own data, not from our labels.** On the
  publishing chain, 4 of 7 steps have no capability attached — including reviewer
  recruitment, where the labour concentrates. On the telescope chain, 4 of 8 have none,
  and they are the first three steps plus commissioning, which is where most of the years
  sit.
- **Coordination and institutions is the primary blocker for 15 of 103 gaps, and not one
  of them has an AI capability that works today.** It is the only one of the eight kinds
  of work with nothing in the working-now column.
- **A one-line label predicted a seven-step decomposition.** Same author wrote both, so
  it is a consistency check and not an independent test, and it is reported that way.
- **47% of the primary labels are flagged `guess`** (48 of 103). That is the honest
  number, published rather than smoothed.

---

## What was added

| | Count | Proposed? |
|---|---|---|
| Kind of work + AI maturity | all 103 gaps | **Yes** |
| Critical paths | 2 gaps, 15 steps | **Yes** |
| Outcome sentence | all 103 gaps | No — in the export |
| Measurability tier | all 103 gaps | No — in the export |
| Progress indicator | 8 gaps | No — in the export |
| Proposed gaps in their house format | 2 | Offered, not central |

Everything joins back on Convergent's own ids and slugs. `engine/verify-additive.mjs`
re-serialises the baseline and diffs it against the pinned snapshot on every build, so
"we did not touch your data" is a test rather than a promise.

## The distribution

Primary kind of work across 103 gaps:

| Kind of work | Gaps | Working now |
|---|---|---|
| Prediction and modeling | 22 | 3 |
| Measurement and sensing | 19 | 9 |
| Design search | 16 | 2 |
| **Coordination and institutions** | **15** | **0** |
| Reading and synthesis | 10 | 5 |
| Running experiments | 9 | 5 |
| Physical build | 8 | 1 |
| Real-time control | 4 | 1 |

Maturity overall: 26 working now, 62 at two-to-five years, 15 speculative.

**Read the small rows with care.** Real-time control is four gaps, so one gap moves its
share by 25 points. The distribution is a count, not a ranking, and nothing in the
schema can rank a gap: there is no numeric score column, by design.

## What the chains found

**Publishing** (cost, in reviewer and editor labour; human-checked). AI reaches 4 of 7
steps, which is more than it touches on the telescope. It reaches the tractable half of
each: it can match a reviewer to a paper and cannot make that reviewer say yes. The
drafting saving is real and did not arrive as cheaper publishing — submissions rose 42%
after ChatGPT's release against a 20% bump during COVID, and the displaced load landed on
volunteer editors at desk screening (Organization Science, doi
`10.1287/orsc.2026.ed.v37.n3`, ~7,000 manuscripts).

**Telescope** (elapsed time; AI only, unchecked). Kept deliberately as a model's first
pass so Convergent can judge whether an unchecked AI decomposition is worth having.

**Both chains run through the same step.** Telescope time and facility approval are
allocated by peer review of proposals — a decadal survey is a review panel, and so is a
time allocation committee. ESO's own account of moving to Distributed Peer Review is that
"it has become progressively harder to find scientists willing to serve." Two gaps, two
fields, one blocker, and their export has one row per gap and nowhere to record it.

## What nobody has checked

- One gap and one chain have been read against the source by a person. The other 102
  gaps and the telescope chain have not, and every page says so on its face.
- The outcome dimension has never had a second pass.
- `Proxy only` ran 78% disagreement between the two labelling passes and probably should
  be dropped. 19 gaps hold it.
- The publishing chain declares a cost axis and displays elapsed days. That tension is
  real and unresolved.

## Where the numbers come from

Everything above derives from `db/gapmap.sqlite`, which rebuilds from
`data/baseline/2026-07-29/` plus the JSON in `research-log/` via `engine/rebuild.mjs`.
Nothing here is typed from memory. The decision ledger behind the judgment calls is
`research-log/decisions.json`.

*Search transcripts live in `research-log/searches/`. The `search_log` table is empty and
the previous version of this document pointed readers at it.*
