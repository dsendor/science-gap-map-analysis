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
capabilities — see the limitation note in the original plan (removed from the working tree; in git history up to 7f77af9). Naming that limitation is
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
| `Real-time control of physical systems` | Closed-loop sense-decide-actuate on hardware that already exists, at machine timescales. Learned plasma control, adaptive optics, station-keeping, accelerator tuning |
| `Physical build and manipulation` | Robotics for fabrication, assembly, installation, field deployment. The category that would build a detector, a beamline, an observatory |
| `Coordination and institutional` | Allocation, review, funding decisions, standards, incentives — anything where the blocker is an organisation rather than a technique |

**Autonomous experimentation and physical build are not the same category and must
not be collapsed.** A self-driving lab pipetting into well plates and a robot
assembling a space telescope differ by decades of maturity. Conflating them destroys
the finding.

**Real-time control is a third thing again, and was added after blind audit found it
had no home.** The discriminator is a two-part test:

- Does it *choose what to try*? Then autonomous experimentation.
- Does it *construct or move something that did not exist assembled*? Then physical build.
- Does it *hold an existing system on a trajectory*, reading sensors and driving
  actuators in a loop? Then real-time control.

Learned tokamak plasma control chooses no experiments and builds no tokamak; it keeps
an existing one stable. Two independent labelers disagreed on it precisely because the
category was missing. Control is a highly verifiable task class — feedback arrives in
milliseconds — so leaving it folded into ML surrogates and design search understates
where AI already works.

Maturity, for the type identified: `Working now` | `2-5 years` | `Speculative`.

**Maturity has two ambiguities. Both are now fixed below. The second one was left open
in an earlier revision and it broke the project's headline finding — read both before
assigning one.**

**(a) Relative to this gap, never to the capability class in general.**
Both readings are defensible and they give different answers, so the convention is
fixed here: ask *how mature is this capability class for moving this particular gap*,
not *how mature is this capability class somewhere*. Autonomous experimentation is
`Working now` in chemical formulation and `Speculative` for anything requiring a robot
to assemble an observatory — same class, different gap, different answer. This was
raised independently by two blind auditors as ambiguous in an earlier revision; the
existing labels already follow the for-this-gap reading, so pinning it down changes no
label but makes the disagreement rate on maturity interpretable.

**(b) Availability versus efficacy — resolved in favour of efficacy, after the
availability reading produced three absurd labels.** Does `Working now` mean *the
capability exists and can be applied today*, or *applying it today would actually move
this gap*? The convention is fixed here: **efficacy**. Both halves are required.

> **`Working now`** — a capability of this kind exists today *and applying it to this
> specific gap would move it now*. Both halves are required.
>
> **`2-5 years`** — the capability exists or is close, and applying it to this gap at the
> scale that would matter is not yet possible.
>
> **`Speculative`** — no clear path from what exists today to moving this gap.

The discriminating example, which is the whole of the distinction:

> **Convening a standards body is available this afternoon. Getting universal
> DNA-synthesis screening adopted is not. Both are "coordination". Only the second is
> the gap.**

For technical categories the two readings mostly coincide. For `Coordination and
institutional` they diverge completely, and that is where the damage was done.

**The test for whether you have applied it: if your rationale would read the same for
any gap in that category, you have labelled the category and not the gap.** A gap whose
neighbour already carries the same claim needs a rationale that says what is left.

Why this needed fixing rather than documenting. An independent relabel of all 103 gaps
read `Working now` as availability. Coordination's working-now share went from **7% under
the efficacy reading to 67% under the availability reading**; overall maturity agreement
between the two passes was 63/103, and twenty-three of the forty disagreements moved the
same way, `2-5 years` to `Working now`. Adjudication then took v2 on every disagreement by
a rule chosen so the author of v1 could not launder his own judgement — a rule that cannot
be wrong, which removed the bias and every check on validity with it. The output included
**"AI Could Be Misused" as `Coordination and institutional` / `Working now`**, along with
*Risks of Malicious Bioengineering* and *A Limited Set of Rigid Organizational Structures*.
Nobody believes those coordination problems are solved today.

The repair pass re-adjudicated maturity on the merits for the 54 gaps the defect could
reach; coordination's working-now count went from 10 to 0. It reached 2 during the
repair and then 0, after David ruled AI Could Be Misused Speculative on the grounds
that the capability which would actually close it is alignment, whose feasibility the
field itself treats as open. Zero is the number to quote: no gap whose primary blocker
is coordination has an AI capability that would move it today. See `research-log/maturity-repair/report.md`.

**Maturity remains the least reliable field in this taxonomy** — it is a judgement about
the world rather than a reading of the gap text, and half the primaries carry `guess`.
Report it with its confidence attached. See the relabel report (removed from the working tree; in git history up to 7f77af9).

Multiple types per gap are allowed and expected. Exactly one is marked primary — the
one that would move the gap *most*, which is not always the one most obviously
applicable. The primary is what the cross-tabs use.

## 2b. Frame: is AI the instrument or the object?

The AI-type dimension asks *which AI capability would move this gap*. That presupposes
AI is the instrument and the gap is a science problem. A few gaps are **about AI**, and
for those the question is ill-posed.

`frame` is `ai-as-instrument` by default. Set `ai-as-object` when **the gap would still
exist if AI did not** — that is, when AI is the subject matter rather than a possible
remedy.

The criterion matters more than the list. An earlier revision enumerated three gaps
instead of stating a test, and a blind relabeler immediately found a fourth that meets
the same description and was not on it: *Labor-Replacing AI Could Lead to Human
Disempowerment*. An enumeration cannot be applied to a gap nobody thought of, which is
exactly what a labeler needs to do. The test is the definition; the list below is its
current output, not its boundary.

Applying the test: *AI Could Be Misused*, *AI Could Go Rogue*, *AI is Still Narrow in its
Reasoning and Planning*, and *Labor-Replacing AI Could Lead to Human Disempowerment* all
disappear if AI does not exist. *Risks of Malicious Bioengineering* does not — it is a
biosecurity gap that happens to have an AI-mediated capability attached, and DNA synthesis
screening would be needed regardless. It stays `ai-as-instrument`.

**Why this is a frame flag and not a ninth capability type.** The obvious fix is to add
something like "AI safety and assurance research" to the list above. That would be a
category error. The eight types are *capabilities applied to science*; safety research
is a research field. A ninth entry of a different kind would silently change what the
dimension means and would make the cross-tabs incomparable.

These gaps still get a type and a tier — they are still real gaps — but they are
reported separately and **excluded from the headline maturity gradient**, because a
capability's maturity "for this gap" means something different when the gap is the
capability. Their tiers are also not comparable to the rest: *AI Could Go Rogue* is
`Verification contested` because we are arguing about a technology we are building,
where quantum gravity is contested because physicists disagree about what would settle
a question about nature. Both are tier 3; they are not the same phenomenon.

### Known limits of this dimension

Two cases where the taxonomy is a poor fit rather than a hard call, both surfaced by
blind audit. Label the dominant component, flag `guess`, and say so in the notes —
do not force a clean answer:

- **Composite gaps.** "We Can Learn More from Nature's Biological Designs" spans
  nanostructure imaging, animal communication, Hadean geology and an Europa mission;
  "Underdevelopment of Modern Tools in the Social Sciences" spans qualitative methods,
  question prioritisation and satellite archaeology. Their sub-components would take
  different types *and different tiers*. A single primary is a real loss of information
  and the artifact should say so rather than pretend otherwise. Splitting them is not
  available to us — that would mean authoring gap records Convergent did not write —
  so the decomposition is offered as a proposal (removed from the working tree; in git history up to 7f77af9).

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
