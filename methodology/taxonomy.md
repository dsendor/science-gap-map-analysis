# Labeling taxonomy

Three dimensions, applied to all 103 gaps. Named values only — every value below is
a CHECK constraint in `db/schema.sql`, so an invented label is a write failure
rather than something a reviewer has to catch.

Every label carries two mandatory companions: a one-line `rationale`, and a
`confidence` of `confident` or `guess`. There is no third confidence value. If the
label is a coin flip, it is a `guess`, and the artifact renders it as one.

---

## 1. Outcome (one per gap)

One sentence answering: **if this gap closes, what becomes knowable or buildable?**

Write the outcome, not the activity. "Researchers could survey the sky faster" is an
activity; "transient events too brief for current cadence become detectable" is an
outcome. Prefer the thing that becomes *possible* over the thing that becomes *easier*.

A single primary outcome per gap, stored as text on the gap. This is deliberately
not a separate entity even though outcomes genuinely are many-to-many with gaps and
capabilities — see the limitation note in `docs/plan.md`. Naming that limitation is
part of the contribution; fixing it is scope creep and, from a stranger, a schema
redesign that lands badly.

## 2. AI capability type + maturity

**Which kind of AI would actually move this gap**, and how mature that kind is. A
single undifferentiated "AI exposure" score is useless — the whole finding is that
different gaps are blocked on AI at wildly different maturities.

| Type | What it covers |
|---|---|
| `LLM reasoning and synthesis` | Literature synthesis, hypothesis generation, drafting, code, mathematical reasoning |
| `ML surrogates and prediction` | Learned emulators replacing expensive simulation; structure and property prediction |
| `Design and optimization search` | Inverse design, generative proposal of candidates, experiment planning over a defined space |
| `Sensing and signal processing` | Extracting signal from instrument data: detection, denoising, anomaly finding, reconstruction |
| `Autonomous experimentation` | Closed-loop self-driving labs that choose and run their own experiments. Bench scale, narrow domains, working now in chemistry and materials formulation |
| `Physical build and manipulation` | Robotics for fabrication, assembly, installation, field deployment. The category that would build a detector, a beamline, an observatory |
| `Coordination and institutional` | Allocation, review, funding decisions, standards, incentives — anything where the blocker is an organisation rather than a technique |

**Autonomous experimentation and physical build are not the same category and must
not be collapsed.** A self-driving lab pipetting into well plates and a robot
assembling a space telescope differ by decades of maturity. Conflating them destroys
the finding.

Maturity, for the type identified: `Working now` | `2-5 years` | `Speculative`.

**Maturity is always relative to this gap, never to the capability class in general.**
Both readings are defensible and they give different answers, so the convention is
fixed here: ask *how mature is this capability class for moving this particular gap*,
not *how mature is this capability class somewhere*. Autonomous experimentation is
`Working now` in chemical formulation and `Speculative` for anything requiring a robot
to assemble an observatory — same class, different gap, different answer. This was
raised independently by two blind auditors as ambiguous in an earlier revision; the
existing labels already follow the for-this-gap reading, so pinning it down changes no
label but makes the disagreement rate on maturity interpretable.

Multiple types per gap are allowed and expected. Exactly one is marked primary — the
one that would move the gap *most*, which is not always the one most obviously
applicable. The primary is what the cross-tabs use.

### Known limits of this dimension

Two cases where the taxonomy is a poor fit rather than a hard call, both surfaced by
blind audit. Label the dominant component, flag `guess`, and say so in the notes —
do not force a clean answer:

- **Gaps where AI is the object rather than the instrument.** "AI Could Be Misused" and
  "AI Could Go Rogue" ask which AI capability would move a gap *about AI*. There is no
  safety-and-robustness-research category among the seven, and the nearest fits
  (`LLM reasoning and synthesis` for automated red-teaming, `Coordination and
  institutional` for governance) are both partial.
- **Composite gaps.** "We Can Learn More from Nature's Biological Designs" spans
  nanostructure imaging, animal communication, Hadean geology and an Europa mission;
  "Underdevelopment of Modern Tools in the Social Sciences" spans qualitative methods,
  question prioritisation and satellite archaeology. Their sub-components would take
  different types *and different tiers*. A single primary is a real loss of information
  and the artifact should say so rather than pretend otherwise.

Revise the taxonomy if the data argues for it. Any revision writes a `decisions` row
with the runner-up and a reversal condition.

## 3. Measurability tier

| Tier | Test |
|---|---|
| `Directly measurable` | An observable quantity exists, with a direction of improvement |
| `Proxy only` | Inputs or adjacent effects are measurable; the gap itself is not |
| `Verification contested` | A candidate observable exists or is being built, but the field does not agree that measuring it would settle the question |
| `Counterfactual required` | The quantity of interest is something that did not happen, and there is no observation set for it |

Calibration examples, from the brief:

- *Clinical trials are poorly optimized for evidence gathering* → **Directly measurable**.
  Cost per trial, time to result, power achieved, share ending inconclusive.
- *A limited set of rigid organizational structures constrains the forms of R&D that
  get done* → **Counterfactual required**. The quantity of interest is research that
  never happened.
- *Quantum gravity* → **Verification contested**, and this distinction is the sharpest
  instance of verifier's law in the dataset. Candidate discriminators exist and are
  actively pursued: gravitationally induced entanglement between mesoscopic masses,
  tabletop interferometry, Lorentz-invariance violation searches in multi-messenger
  astronomy. What is contested is whether observing any of them would settle
  anything — there is live literature arguing gravity-mediated entanglement is
  reproducible by classical gravitational fields, and that reading such an experiment
  as proof of quantum gravity requires extra assumptions about local mediators.

The load-bearing distinction is **contested vs. counterfactual**. Tier 3 means the
instrument could exist and the field still would not agree on the verdict; tier 4
means there is nothing to point an instrument at. Getting this wrong collapses the
most interesting finding available here, so when torn between 3 and 4, ask: *could a
measurement in principle be taken, with people still disagreeing about what it
showed?* If yes, tier 3.

Expect tier 3 to correlate with the origins questions. That correlation is a finding
and should be reported as one — but it is a prediction to be tested, not assumed.
