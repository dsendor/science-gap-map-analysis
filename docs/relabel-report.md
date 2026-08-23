# Relabel report — AI-type dimension, 8-category taxonomy

Independent blind relabel of **all 103 gaps** by labelers that never saw v1. Predictions were fixed in `docs/prereg-relabel.md` in an earlier commit; this report scores them mechanically.

## Agreement between the two independent passes

| Dimension | Agree | Disagree | Disagreement |
|---|---:|---:|---:|
| Primary AI type | 77 | 26 | 25% |
| Maturity | 63 | 40 | 39% |

This is a census, not a sample, so it supersedes the 33% AI-type figure from the Phase 2 stratified audit for this dimension.

**The maturity figure needs a caveat and probably deserves more weight than the type figure.** v1 maturity was assigned before the per-gap-versus-per-class semantics were pinned down, so part of any disagreement is the specification change rather than labeler variance. But only part: both v1 and the Phase 2 auditors were already using the per-gap reading, which is why pinning it changed no label. A large residual disagreement means maturity is the least reliable thing on this dimension, and any claim resting on it — the working-now gradient above all — has to carry that caveat.

## Prediction scoring

### P1 — uptake between 3 and 7 gaps: **CONFIRMED** (4 gaps)

| Gap | v1 type | New maturity |
|---|---|---|
| Higher-Resolution Views of the Universe Are Roadblocked by Formation Flying Technology | Physical build and manipulation | Speculative |
| Particle Accelerators Are Large and Expensive | Physical build and manipulation | Working now |
| Artisanal Nature of Experimental Physics Platforms | Coordination and institutional | 2-5 years |
| Robust and Compact Plasma Confinement for Fusion is Still Not Solved | ML surrogates and prediction | Working now |

### P2 — control lands in the top three by working-now share: **REFUTED** (rank 5 of 8, 50%)

### P3 — gradient shape survives: **REFUTED**

- Physical build working-now: 1/8 (13%) — **no longer zero, headline finding changes**
- LLM reasoning rank: 2 of 8
- Gaps control took from physical build: 2 (predicted at most 1)

### P4 — total disagreement 20-35%: **CONFIRMED** (25%)

Of 26 disagreements, 4 involve the new category and 22 do not. The latter is the test-retest noise floor for this dimension: two independent labelers applying the same eight categories to the same text.

## Working-now gradient, v2

| Primary AI type | Working now | Total | Share |
|---|---:|---:|---:|
| Coordination and institutional | 10 | 15 | 67% |
| LLM reasoning and synthesis | 6 | 10 | 60% |
| Autonomous experimentation | 5 | 9 | 56% |
| Sensing and signal processing | 10 | 19 | 53% |
| Real-time control of physical systems | 2 | 4 | 50% |
| ML surrogates and prediction | 3 | 22 | 14% |
| Physical build and manipulation | 1 | 8 | 13% |
| Design and optimization search | 2 | 16 | 13% |

## Where the two passes disagreed

| Gap | v1 | v2 |
|---|---|---|
| We Don’t Have Easy Programmable Synthesis of Bio Polymers Othe | Physical build and manipulation | Autonomous experimentation |
| Limited Microbial Hosts/Chassis Organisms | Design and optimization search | Autonomous experimentation |
| Searching Through the Vast, Underexplored Space of Materials i | Design and optimization search | Autonomous experimentation |
| Lack of Applied Synthetic Biology Platforms | Physical build and manipulation | Autonomous experimentation |
| Clinical Trials Are Poorly Optimized for Evidence Gathering | Design and optimization search | Coordination and institutional |
| Lack of Infrastructure Technologies and Strategies Optimized f | Design and optimization search | Coordination and institutional |
| Limited Tools for Improving Individual, Social and Societal Ep | LLM reasoning and synthesis | Coordination and institutional |
| Biological Life is Our Only Working Example of Complex Evolved | ML surrogates and prediction | Design and optimization search |
| Limited Ability to Design and Scalably Synthesize Macroscale M | Physical build and manipulation | Design and optimization search |
| Our Platforms for Civic Engagement and Democratic Decision-Mak | Coordination and institutional | LLM reasoning and synthesis |
| Insufficient Monitoring and Modeling of Climate Processes and  | Sensing and signal processing | ML surrogates and prediction |
| Inadequate Models of Human Physiology | Design and optimization search | ML surrogates and prediction |
| Poor Scalability of Bioreactors Limits Biomanufacturing | Physical build and manipulation | ML surrogates and prediction |
| Intervening in Earth Systems at Scale is Largely Untested | Physical build and manipulation | ML surrogates and prediction |
| Silicon-Based Electronics Face Fundamental Limits in Dimension | Design and optimization search | ML surrogates and prediction |
| Outdated and Fragmented Recycling, Cleanup and Bioremediation  | Coordination and institutional | Physical build and manipulation |
| Sim-to-Real Transfer for Robots is Hard | ML surrogates and prediction | Physical build and manipulation |
| Higher-Resolution Views of the Universe Are Roadblocked by For | Physical build and manipulation | Real-time control of physical systems |
| Particle Accelerators Are Large and Expensive | Physical build and manipulation | Real-time control of physical systems |
| Artisanal Nature of Experimental Physics Platforms | Coordination and institutional | Real-time control of physical systems |
| Robust and Compact Plasma Confinement for Fusion is Still Not  | ML surrogates and prediction | Real-time control of physical systems |
| Most of the Human Brain Remains Inaccessible | Physical build and manipulation | Sensing and signal processing |
| Much of the Biosphere Remains Uncharted and Vulnerable to Info | Physical build and manipulation | Sensing and signal processing |
| Limited Detection of Gravitational Waves Across the Frequency  | Physical build and manipulation | Sensing and signal processing |
| Quantum Gravity is Experimentally Hard to Constrain  | Physical build and manipulation | Sensing and signal processing |
| Difficulty Delivering Physical Probes for Imaging into Living  | Design and optimization search | Sensing and signal processing |
