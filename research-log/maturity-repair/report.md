# Maturity repair: what changed

Branch `maturity-repair`, off `main` at 386e2e8. Executes `docs/maturity-repair-plan.md`.

## Headline

**Coordination and institutional went from 10 working-now gaps to 2, and both of those
are open questions rather than settled labels.** "AI Could Be Misused", "Risks of
Malicious Bioengineering" and "A Limited Set of Rigid Organizational Structures" are no
longer labelled as problems AI can move today.

Across all 103 gaps, `Working now` went from 39 to 29.

| Maturity | Before | After |
|---|---:|---:|
| Working now | 39 | 29 |
| 2-5 years | 52 | 59 |
| Speculative | 12 | 15 |

| Coordination and institutional | Before | After |
|---|---:|---:|
| Working now | 10 | 2 |
| 2-5 years | 3 | 9 |
| Speculative | 2 | 4 |

That 2 is `Ephemeral Societal Data on Proprietary Platforms` and `Clinical Trials Are
Poorly Optimized for Evidence Gathering`, both escalated. If David rules against both,
coordination has no working-now gaps at all, which is the 7% figure the relabel report
predicted for the efficacy reading — near enough to 0/15 to be the same claim.

## The review set: 54, not 63

The plan's construction was right and its arithmetic was not. 39 gaps currently
`Working now` plus 40 maturity disagreements, but the overlap is 25 rather than the 16
the plan assumed, so the union is **54**, and the untouched remainder is **49** rather
than 40. No change to what was reviewed.

A useful accident of the two sets: **all 17 changes landed on gaps where the two
independent passes disagreed.** Of the 11 gaps in the review set where both passes
agreed, 10 were confirmed and 1 was escalated. The defect really did live in
adjudication, not in either labelling pass.

## Reviewed: 54. Changed: 17. Escalated: 4. Confirmed: 33.

Direction of change: **13 down** (away from `Working now`), **4 up**. Eight of the 13
downgrades are coordination gaps.

| Gap | Type | From | To | Confidence |
|---|---|---|---|---|
| A Limited Set of Rigid Organizational Structures... | Coordination and institutional | Working now | **Speculative** | confident |
| AI Could Be Misused | Coordination and institutional | Working now | **2-5 years** | confident |
| Doing and publishing research is expensive... | Coordination and institutional | Working now | **2-5 years** | confident |
| Lack of a Dedicated Field for Planetary Terraforming | Coordination and institutional | Working now | **Speculative** | guess |
| Limited Longitudinal Data in Humans | Coordination and institutional | Working now | **2-5 years** | confident |
| Risks of Malicious Bioengineering | Coordination and institutional | Working now | **2-5 years** | confident |
| Translational Gaps in Development Economics | Coordination and institutional | Working now | **2-5 years** | guess |
| Uncertainty and Noise in ... Room-Temperature Superconductivity | Coordination and institutional | Working now | **2-5 years** | guess |
| Our Platforms for Civic Engagement... | LLM reasoning and synthesis | Working now | **2-5 years** | guess |
| Silicon Compute is Massively Energy Intensive... | Design and optimization search | Working now | **2-5 years** | confident |
| Protein Design Has Been Limited to Static, Bio-mimetic Structures | Design and optimization search | 2-5 years | **Working now** | guess |
| Modeling Mechanical Systems is Hard | ML surrogates and prediction | 2-5 years | **Working now** | guess |
| Understanding Life as a Far-From-Equilibrium Physical Phenomenon | ML surrogates and prediction | 2-5 years | **Speculative** | guess |
| Light Scattering in Living Tissue... | Sensing and signal processing | Working now | **2-5 years** | guess |
| Bioengineering is Still Done Manually | Autonomous experimentation | 2-5 years | **Working now** | confident |
| We Don't Have Easy Programmable Synthesis of Bio Polymers... | Autonomous experimentation | Working now | **2-5 years** | guess |
| Particle Accelerators Are Large and Expensive | Real-time control of physical systems | Working now | **2-5 years** | guess |

Per-gap reasoning is in the `note` field of each entry in
`research-log/relabel-adjudication.json`, so it travels with the label rather than
living only in this report.

The four escalations are in `escalations.md`. They are untouched in the data and still
carry the mechanical label, so "leave it" needs no further work.

## The ten spot-checks

Ten of the 49 gaps outside the review set, taken at a fixed stride through the list
sorted by type then name, so the sample is reproducible and spread across all eight
types. All ten hold, so per the plan the spot-check stopped there.

| Gap | Type | Label | Holds |
|---|---|---|---|
| Lack of Applied Synthetic Biology Platforms | Autonomous experimentation | 2-5 years | yes |
| Labor-Replacing AI Could Lead to Human Disempowerment | Coordination and institutional | Speculative | yes |
| Designing Manufacturing Systems is Hard | Design and optimization search | 2-5 years | yes |
| Under-Provisioning of Antibiotics, Vaccines... | Design and optimization search | 2-5 years | yes |
| Policy Creation and Evaluation is Manual... | LLM reasoning and synthesis | 2-5 years | yes |
| Inadequate Models of Human Physiology | ML surrogates and prediction | 2-5 years | yes |
| Poor Scalability of Bioreactors Limits Biomanufacturing | ML surrogates and prediction | 2-5 years | yes |
| Frontier Telescopes Are Expensive and Take Decades to Build | Physical build and manipulation | Speculative | yes |
| Artisanal Nature of Experimental Physics Platforms | Real-time control of physical systems | 2-5 years | yes |
| Inadequate Interventions for Greenhouse Gas Removal | Sensing and signal processing | 2-5 years | yes |

The one worth naming is *Policy Creation and Evaluation is Manual*, which is the same
shape as the coordination failures — an LLM capability that exists against an
institution that has not adopted it — and was already labelled `2-5 years`. The defect
was in adjudication, and the out-of-set gaps never went through it.

## Where the repair had to be applied, and why not where the plan said

The plan said maturity lives in `research-log/labels/*.json` and to change only that
field. For primary labels it does not. `engine/apply-relabel.mjs` deletes every
`is_primary=1` row and rewrites it from the `relabels` table plus
`research-log/relabel-adjudication.json`; `relabels` covers all 103 gaps. Editing the v1
label files would have changed nothing a reader sees, and would have silently moved gaps
between the agreed and disagreed buckets, corrupting the 63/103 agreement figure that
`docs/relabel-report.md` and `methodology/taxonomy.md` both cite.

So `research-log/labels/*.json` is untouched, and the 17 changes are in
`research-log/relabel-adjudication.json`. This is the better structure on its own terms:
v1 and v2 are the record of two independent passes and should read as they were written;
adjudication is where judgement belongs, and it is the layer that was broken. The file's
header comment now says that type is still adjudicated mechanically and maturity is not,
so the two rules are not confused again.

Side effect visible in the rebuild log: `relabel applied: 46 agreed, 7 adjudicated
confident, 50 adjudicated guess`, against `46 / 0 / 57` before. The seven confident
adjudications are the first time any disagreement in this project has been resolved
rather than deferred.

## Also changed

`methodology/taxonomy.md` §2(b), which said the availability-versus-efficacy question
was unresolved. It now pins efficacy, states the three definitions in full, carries the
DNA-synthesis-screening example, and adds the test that catches the failure mode — if
your rationale would read the same for any gap in that category, you have labelled the
category and not the gap. The paragraph saying no aggregate claim should rest on maturity
is softened but not removed: maturity is still a judgement about the world and half the
primaries are still flagged `guess`.

## What a reader of the artifact would now see differently

The map no longer says the coordination problems are the ones AI can already solve. It
says close to the opposite: of the fifteen gaps whose blocker is an institution rather
than a technique, at most two are moving today, and the rest are waiting on adoption
rather than on capability. Where AI is working now is concentrated in sensing and signal
processing, LLM synthesis, and bench-scale autonomous experimentation — nine of the
twenty-nine working-now gaps are sensing, and none of the eight coordination downgrades
was about whether the technology exists. The distribution has also shifted its centre of
mass: fifty-nine gaps sit at `2-5 years`, which is a more useful thing to tell a funder
than a working-now count inflated by counting capabilities that nobody has adopted.

## One thing in the diff that is not mine

`node engine/audit-report.mjs`, which the plan requires, regenerates `docs/findings.md`.
Besides the maturity numbers it also picks up drift that was already sitting in `main`:
the progress-indicator sample reads 11 gaps rather than 8, because
`research-log/indicators/` had grown and the committed `docs/findings.md` had not been
regenerated since. That change is correct and it is not the work of this branch. Flagging
it because `docs/findings.md` is a likely merge conflict with the review-gate branch, and
because a reader diffing this branch should not attribute the indicator count to the
maturity repair.
