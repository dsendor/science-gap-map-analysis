# Maturity repair: what changed

Branch `maturity-repair`, off `main` at 386e2e8. Executes `docs/maturity-repair-plan.md`.

## Headline

**Coordination and institutional went from 10 working-now gaps to zero.** Of the fifteen
gaps on the map whose blocker is an institution rather than a technique, not one is
labelled as something AI moves today. "AI Could Be Misused", "Risks of Malicious
Bioengineering" and "A Limited Set of Rigid Organizational Structures" no longer claim
otherwise.

Across all 103 gaps, `Working now` went from 39 to 26.

| Maturity | Before | After |
|---|---:|---:|
| Working now | 39 | 26 |
| 2-5 years | 52 | 63 |
| Speculative | 12 | 14 |

| Coordination and institutional | Before | After |
|---|---:|---:|
| Working now | 10 | **0** |
| 2-5 years | 3 | 11 |
| Speculative | 2 | 4 |

The relabel report predicted coordination's working-now share would be 7% under the
efficacy reading against 67% under the availability reading. It landed at 0 of 15, which
is the same claim.

## The review set: 54, not 63

The plan's construction was right and its arithmetic was not. 39 gaps currently
`Working now` plus 40 maturity disagreements, but the overlap is 25 rather than the 16
the plan assumed, so the union is **54**, and the untouched remainder is **49** rather
than 40. No change to what was reviewed.

A useful accident of the two sets: **all 17 changes landed on gaps where the two
independent passes disagreed.** Of the 11 gaps in the review set where both passes
agreed, 10 were confirmed and 1 was escalated. The defect really did live in
adjudication, not in either labelling pass.

## Reviewed: 54. Changed: 21. Confirmed: 33.

Seventeen decided on the branch and four escalated to David, who ruled on all four and
sent all four to `2-5 years` (`escalations.md`). Direction of change: **17 down** (away
from `Working now`), **4 up**. Ten of the 17 downgrades are coordination gaps.

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

And the four David ruled on, all `confident` because he decided them:

| Gap | Type | From | To |
|---|---|---|---|
| Ephemeral Societal Data on Proprietary Platforms | Coordination and institutional | Working now | **2-5 years** |
| Clinical Trials Are Poorly Optimized for Evidence Gathering | Coordination and institutional | Working now | **2-5 years** |
| Inadequate Emergency Climate Interventions and Response | ML surrogates and prediction | Working now | **2-5 years** |
| AI is Still Narrow in its Reasoning and Planning | LLM reasoning and synthesis | Speculative | **2-5 years** |

Per-gap reasoning is in the `note` field of each entry in
`research-log/relabel-adjudication.json`, so it travels with the label rather than
living only in this report.

Two of David's four were labels both passes had agreed on, which `apply-relabel.mjs`
had no way to express — its agreed branch took v1 unconditionally and never consulted the
adjudication file. Agreement is now a default rather than a rule that cannot be
overridden, and the rebuild prints the override count on its own line. That is a 13-line
change to `engine/apply-relabel.mjs`, a file the `review-gates` branch does not touch;
detail and the reasoning in `notes.md`.

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

## Two things worth carrying into the next version

**Sixty-three of 103 gaps now sit in `2-5 years`.** Three fifths in one bucket is barely a
label, and David asked in passing whether the taxonomy wants a `5-10 years` value. It
probably does, and probably wants the time question separated from the has-a-path question
that `Speculative` really asks. Not done here: a fourth value nobody has applied to the
whole set is worse than three honest ones, so it needs its own pass with its own blind
second reader.

**Eleven of the downgrades are adoption, not capability.** Screening exists and nobody
uses it; archiving works and permission is withheld; adaptive trials run and the field
does not adopt them. Maturity absorbs all of that and reports "not ready", which is the
wrong diagnosis for a funder, because the intervention for an unadopted capability is not
more research. A blocked-on-adoption flag would be a real addition to their map rather
than a correction to ours. Both recorded in `notes.md` and the decisions ledger.

## What a reader of the artifact would now see differently

The map no longer says the coordination problems are the ones AI can already solve. It
says the opposite, without hedging: of the fifteen gaps whose blocker is an institution
rather than a technique, **none** is moving today. Where AI is working now is concentrated
in sensing and signal processing, LLM synthesis, and bench-scale autonomous
experimentation — nine of the twenty-six working-now gaps are sensing, and not one of the
ten coordination downgrades was about whether the technology exists. That is a sharper and
more useful thing to tell a funder than a working-now count inflated by capabilities
nobody has adopted, and it is a claim about their map that they cannot currently make.

## One thing in the diff that is not mine

`node engine/audit-report.mjs`, which the plan requires, regenerates `docs/findings.md`.
Besides the maturity numbers it also picks up drift that was already sitting in `main`:
the progress-indicator sample reads 11 gaps rather than 8, because
`research-log/indicators/` had grown and the committed `docs/findings.md` had not been
regenerated since. That change is correct and it is not the work of this branch. Flagging
it because `docs/findings.md` is a likely merge conflict with the review-gate branch, and
because a reader diffing this branch should not attribute the indicator count to the
maturity repair.
