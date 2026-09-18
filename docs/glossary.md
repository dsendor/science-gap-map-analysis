# Glossary

Every term that carries an argument here, in one place. Written because two of them
caused real problems: `binding` went undefined for two weeks while the artifact rendered
it off a proxy, and `slug` appeared in commit messages as though it were Convergent's
word when it is web jargon.

**Theirs or ours** says whose vocabulary a term is. Using one of ours as though it were
theirs is the specific mistake this file exists to prevent.

---

## Their vocabulary

| Term | Theirs or ours | Means |
|---|---|---|
| **Gap** | Theirs | One of the 103 R&D gaps on gap-map.org. A statement of something science cannot currently do. Their unit, their words, never edited. |
| **Foundational capability** | Theirs | One of 369 things they list as able to close a gap. In practice these are **proposed projects** rather than capabilities in the AI sense: *Open Synthesis Database*, *Muon Catalyzed Fusion*. 347 of the 369 attach to exactly one gap. |
| **Initiative** | Theirs | A named organisation or project already building a capability, from their resource table. PREreview, ResearchHub, Nanopublications. A resource typed `Initiative`, as distinct from a paper *about* the capability. |
| **Field** | Theirs | One of 20 subject areas. Astrophysics, Metascience, Chemistry. |
| **Fundamental development** | Theirs | Their framing for bridge-scale work: bigger than a grant, smaller than a moonshot. |

## Our vocabulary

| Term | Means |
|---|---|
| **Kind of work** | The attribute added to all 103 gaps: what sort of work stands between here and the gap closing. Eight named values in `methodology/taxonomy.md`. Named for the *work*, not for the model that would do it. |
| **Maturity** | Whether the AI for that kind of work would move *this* gap: `Working now`, `2-5 years`, `Speculative`. **Not** whether the technique exists. Launching an open publishing platform is available this afternoon; shifting the prestige economy is not. |
| **Critical path / chain** | A gap decomposed into the ordered steps the work actually runs through. Used interchangeably; *chain* is the shorter one and appears in the code. |
| **Link / step** | One row of a chain. Used interchangeably. `step` in the UI, `link` in the database table `critical_path_links`. |
| **Axis** | The single quantity a chain measures. A gap statement usually bundles several — the publishing gap bundles cost, speed and inclusiveness — and a chain that mixes them produces a bottleneck that is an artifact of the mixing. Pick one, name it, and record the excluded ones in `axes_excluded`. |
| **`axis_kind`** | Which *sort* of quantity: `time` or `cost`. An explicit field because the renderer used to infer it from whether durations were present, which would mislabel a cost chain that carried durations. |
| **Binding / carries the cost** | On a **cost** chain, this step is where the labor concentrates. Deliberately unset on time chains: on a strictly sequential chain every step adds to the total, so marking some and not others claims a distinction the structure does not contain. Full treatment at the end of `methodology/critical-path.md`. |
| **Pre-registration** | A chain's gap, axis and prediction, committed in `research-log/critical-paths/preregistered/<id>.json` before any step is written. The ingest refuses the finished chain if those fields changed. The prediction is what turns a confirming result into evidence rather than a story. |
| **Cost value and unit** | What a cost chain shows on a step: a number plus a unit chosen for that chain, such as reviewer-hours per paper or USD per experiment. Cost is not one thing, so the unit travels with the number. |
| **Draft chain** | A chain committed with `status: "draft"` because some steps are not researched yet. It is validated like any chain and never exported, so it cannot reach the public data looking finished. |
| **Step maturity** | Maturity asked of one step rather than a whole gap: would applying AI shorten or cheapen *this step*? Read the step's blocker first. A step whose blocker is a field reaching consensus is not `Working now` just because language models are good at synthesis. |
| **Capabilities on a step** | Which of Convergent's capabilities for the gap act on that step, by exact name. Derived from their data, not our labels, which is why a step with none is usually the strongest result in a chain. |
| **Span** | A published figure that brackets several steps and measures none of them individually. 119 days covers publishing steps 2-5. Recorded in `duration_covers` so the artifact draws one bracket instead of a number on one row and "not measured" on three others, which was false. |
| **Outcome** | One sentence per gap: what becomes knowable or buildable if it closes. Built for all 103, in the export, **not proposed** — a chain's `axis` does the same job better and states it as a choice. |
| **Measurability tier** | Whether a gap has an agreed observable, a proxy only, a contested observable, or an inherently counterfactual quantity. Built for all 103, in the export, **not proposed**. |
| **Progress indicator** | The number you would watch to know a gap is closing. Built for 8 gaps, in the export, **not proposed**. |
| **Frame** | Whether AI is the instrument or the object. A few gaps are *about* AI, where "which AI capability would move this" is ill-posed; those are flagged rather than labelled. |
| **Confident / guess** | The required confidence on every judgment. A run producing no guesses is not confident, it is dishonest. |
| **Additive** | The rule that `gm_*` tables mirror their export byte-for-byte and are never edited. Enforced by `engine/verify-additive.mjs`, which must pass before every commit. Not a promise, a test. |
| **Human-checked / AI only** | Provenance tags on the site. One gap and one chain have been read against the source by a person; everything else is a model's first pass and says so. |

## Not domain vocabulary at all

| Term | Means |
|---|---|
| **Slug** | The URL form of a name: *Post-Publication Peer Review Layer* → `post-publication-peer-review-layer`. Web jargon. It matters only because their export preserves them, which is what lets a chain step deep-link to `gap-map.org/capabilities/<slug>/`. Do not use it in anything Convergent reads. |
| **Worktree** | A second working directory on its own branch. `docs/worktrees.md`. |
| **Gate** | One of four adversarial review passes, A to D, run over phases 3-6. All complete. Do not use the letters in anything a reader outside this repo sees. |
| **Phase** | One of six stages of the original plan. Complete. Same warning as Gate. |
