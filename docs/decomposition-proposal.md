# Proposal: decomposing composite gaps

**Status: proposal only. Nothing here has been applied.** Splitting Convergent's gaps
would mean authoring gap records they did not write, which breaks the additive-only
constraint and is exactly the schema change the brief warns lands badly from a stranger.
This document exists so the observation is concrete rather than vague, and so the work
is ready if they want it.

## The observation

Some gap statements bundle several unrelated research programmes under one heading. A
single measurability tier and a single primary AI capability type cannot represent them,
because their components genuinely differ on both.

This is not a criticism of the map. Convergent say plainly that it is a crude map of an
emerging space and not comprehensive, and a heading that gathers loosely related work is
a reasonable way to hold ground you have not yet surveyed. But it does limit what any
analysis layered on top can say, including ours.

Capability count alone is not the signal. *In-Silico Molecular Simulation Is Slow and
Kludgy* carries eight capabilities and they all point at one thing — making quantum
chemistry cheaper. It is not composite. What matters is whether the components share a
blocker.

## Two distinct patterns

**Multi-programme.** One heading over several unrelated problems, with different physics,
different actors, and different measurability.

**Multi-axis.** One coherent problem bundling several distinct axes of improvement, where
progress on one does not imply progress on another.

---

## Multi-programme gaps

### 1. Inadequate Emergency Climate Interventions and Response
*Geophysics and Climate · 13 capabilities · the clearest case on the map*

Spans earthquake prediction, solar flare forecasting, hurricane diversion, cloud seeding,
backup power transformer protection, and subduction zone observation. These share the
word "hazard" and nothing else: different physics, different timescales, different
agencies, and different measurability. Earthquake prediction is famously contested;
transformer hardening is directly measurable engineering.

Proposed split:

| Proposed gap | Tier | Likely primary |
|---|---|---|
| Geophysical hazards cannot be forecast far enough ahead to act (earthquakes, solar flares) | Verification contested | Sensing and signal processing |
| Weather-scale hazards cannot be steered (hurricane diversion, cloud seeding) | Verification contested | Real-time control of physical systems |
| Critical infrastructure lacks hardening against foreseeable shocks (transformers, grid) | Directly measurable | Coordination and institutional |
| Local climate impacts cannot be modelled at the resolution response requires | Directly measurable | ML surrogates and prediction |

Note what the split reveals: infrastructure hardening is tier 1 with a *known* blocker,
and it is currently averaged together with earthquake prediction. That is a fundable,
unambiguous project hidden inside a gap whose headline reads as speculative.

### 2. When We Put a Molecule in the Human Body, We Can't Predict What It Will Do
*Physiology and Medicine · 10 capabilities*

Bundles drug ADME/Tox prediction with nutrition science: foodome mapping and functional
food component analysis sit alongside immunogenicity prediction and toxin mapping. Drug
safety and nutrition are different fields with different regulators, different data, and
different evidentiary standards.

Proposed split: **(a)** molecular fate and toxicity in the body is not predictable before
dosing, and **(b)** the composition and biological effect of food is largely uncharacterised.
Both are tier 1, but they are different problems with different funders.

### 3. Our Measurements and Tests Aren't Revealing What Is Actually Causing Many Diseases
*Physiology and Medicine · 10 capabilities*

Spans ageing biology, brain-body interaction, engineered endosymbionts, and long-term
multimorbidity endpoints. The unifying claim — that multifactorial disease resists
single-cause methods — is real, but it is a thesis rather than a gap, and the
sub-problems bind on different things.

Proposed split along the blocker: **(a)** combinatorial interventions cannot be screened
at the scale multifactorial disease requires (autonomous experimentation, tier 1), and
**(b)** long-horizon endpoints make causal attribution in chronic disease impractical
(coordination and institutional, tier 2 or 4).

### 4. We Can Learn More from Nature's Biological Designs
*Ecology · 6 capabilities*

The most heterogeneous relative to its size. Imaging natural nanostructures, decoding
animal communication with machine learning, mass screening of Hadean zircons, raking
lunar regolith for terrestrial rock, and a mission to search for life on Europa. Four
unrelated programmes across three fields, and they differ on both dimensions:

| Component | Tier | Likely primary |
|---|---|---|
| Natural nanostructures are below current imaging resolution | Directly measurable | Sensing and signal processing |
| Animal communication is not decoded | Verification contested | LLM reasoning and synthesis |
| Pre-4.1 Ga terrestrial rock is absent from the record | Directly measurable | Sensing and signal processing |
| No in-situ search for life beyond Earth has been flown | Verification contested | Physical build and manipulation |

Our label for this gap (`Sensing` / `Proxy only`) is flagged `guess` on both dimensions,
and the blind auditor disagreed on the tier. That disagreement is the composite structure
showing up in the data.

### 5. Underdevelopment of Modern Tools in the Social Sciences
*Social Science · 3 capabilities*

Small but genuinely composite: AI-enabled qualitative methods, infrastructure for
choosing which questions to work on, and satellite-plus-ML archaeology. The last has no
relationship to the first two beyond both being under-tooled.

### 6. We Lack Basic Capabilities that Are Necessary for Travel Far Beyond Earth
*Space Engineering · 4 capabilities · surfaced by a blind relabeler, not by the original pass*

Air-breathing fusion propulsion, cryosleep, interstellar probes and pressurised habitation
domes. Cryosleep is a biology problem — suspended metabolism in mammals — sitting beside
three propulsion and structures problems. It takes a different primary type and a
different maturity, and it would be funded by different people.

Proposed split: **(a)** propulsion and structures for missions beyond the solar system,
and **(b)** long-duration human biological stasis. Both speculative, but they are not the
same speculation.

Worth noting how this one was found: the original labeling pass did not flag it, and an
independent relabeler did. Composite structure is easier to see when you have not already
committed to a single answer, which is an argument for the blind second pass as a
standing part of the method rather than a one-off check.

### 7. Lack of Infrastructure Technologies and Strategies Optimized for Low-Resource Settings
*Global Health · 8 capabilities*

Mixes discovery (improved antibiotics, broad-spectrum antivirals) with deployment (PPE,
sanitation, vaccine distribution). Discovery is blocked on science; deployment is blocked
on cost and logistics. Splitting these separates a research agenda from a delivery agenda.

---

## Multi-axis gaps

### 8. Doing and publishing research is expensive and subject to structural roadblocks
*Metascience · 4 capabilities*

One coherent object, three axes: **cost**, **speed**, and **inclusiveness**. Progress on
cost does not imply progress on inclusiveness, and the binding constraint differs by
axis. The brief already identified this, which is why the Phase 5 chain commits to the
cost axis and names the other two as separate chains.

The general form: where a gap bundles axes rather than programmes, the fix is not to
split the gap but to state which axis any analysis addresses. That is cheaper than
decomposition and preserves their structure.

---

## What we would actually propose to Convergent

Not a reorganisation. Three additive suggestions, in increasing order of cost:

1. **A `composite: true` flag** on the eight gaps above. Costs nothing, changes no
   structure, and warns any downstream consumer that a single attribute cannot describe
   the record. This is the one worth doing.
2. **Sub-gap records** under the existing gap id for the six multi-programme cases,
   leaving the parent intact as a heading. Preserves every existing link.
3. **An axis field** for the multi-axis cases, so an analysis can declare which axis it
   addresses rather than silently mixing them.

Ranking these gaps, or reordering them, is not proposed and would not be appropriate.

## A related proposal from the relabel pass

A blind relabeler observed that several gaps — gravitational wave detection across the
spectrum, travel beyond Earth, quantum gravity — are instrument-and-hardware problems
where AI is a real but distinctly second-order lever. Forcing a primary AI type onto
them makes the cross-tabs read as though AI were the binding constraint, which it is not.

The suggested fix is a per-gap **"is AI actually the binding constraint"** flag, separate
from which capability type applies. That is information the current three dimensions
genuinely cannot express: the type field says *which* AI would help, and nothing says
*whether AI is where the gap binds at all*.

This is recorded as a proposal, not implemented. It would be a fourth dimension, and
adding one after the labeling and audit are complete would invalidate both. It belongs in
a future version, and it is arguably the single most useful addition suggested by any part
of this work — for a map whose purpose is locating bottlenecks, "AI is not the bottleneck
here" is a first-class finding rather than a missing value.

## Related upstream limitation

The same information loss shows up in a second place, noted in `docs/integrity-report.md`:
capability-to-gap edges are untyped. Nothing marks a capability as necessary, sufficient,
or merely partial for its gap. Composite gaps and untyped edges compound — a gap with
four unrelated components and four untyped edges cannot be reasoned about at all without
reading the prose. Typed edges would help even without decomposition, because a
capability that is *sufficient* for one component of a composite gap is identifiable as
addressing that component.
