# Plan — Gap Map augmentation

Source brief: *Claude Code brief: Gap Map augmentation* (Notion, 2026-08-23).
Deliverable: **an artifact plus a short cover note sent to Convergent Research**,
demonstrating a small set of additions to their existing map. The artifact is the
persuasion; the note is short.

A stranger sending recommendations reads as criticism. A stranger sending a working
augmented version of their own dataset reads as a collaborator. Every decision below
follows from that.

A second purpose: the artifact is itself evidence that AI makes this kind of curation
dramatically cheaper than it used to be. So the elapsed time is tracked from the first
commit, in the `runs` table, and reported as part of the argument.

---

## The structural idea

The brief's Constraints section lists six rules that are normally honoured by
promising to honour them. Here they are **mechanical**:

| Constraint | Mechanism |
|---|---|
| Additive only | `engine/verify-additive.mjs` re-serialises the baseline tables and diffs against the hash-pinned snapshot. Any edit to their data fails CI. Verified to catch both field edits and edge deletions. |
| Do not rank gaps | No numeric score column exists anywhere in the schema. Ranking is not forbidden, it is unrepresentable. |
| Preserve IDs and slugs | Foreign keys to the baseline tables; an orphan is a constraint violation. |
| Every judgment has a rationale | `rationale TEXT NOT NULL` on every augmentation table. |
| Uncertainty visible | `confidence NOT NULL CHECK (confidence IN ('confident','guess'))`, rendered distinctly in the artifact. |
| Contribution, not critique | Tone rules in `methodology/critical-path.md`; observations about capability sets, never deficiencies. |

The cover note can then say the additions are provably additive and point at the test.

---

## Phases

### Phase 0 — Foundation ✅ complete

Schema, importer, additive guardrail, integrity report, Brave search client, baseline
snapshot committed verbatim and hash-pinned. See `docs/integrity-report.md`.

Confirmed all five of the brief's "known holes", and found three more — most usefully
that **`capabilities[].gaps` is empty for all 369 capabilities** despite being
documented in their own `schema.json`. All 389 edges live only on the gap side.

### Phase 1 — Full coverage (outcomes 1–3)

All 103 gaps get an outcome sentence, an AI capability type + maturity, and a
measurability tier, each with a rationale and a confidence flag. Fanned out by field
(20 batches, largest is Social Science at 9) via `agents/labeler.md`; each batch writes
a JSON file, the lead ingests serially.

Full coverage on one cheap dimension is the strongest part of the demo, so this is
where the budget goes. Taxonomy revisions are permitted where the data argues for
them, and each writes a `decisions` row.

### Phase 2 — Audit

`agents/auditor.md` blind-relabels a stratified sample. The disagreement rate is
computed per dimension and **published**, not tuned. Unresolved disagreements downgrade
to `guess`. Then the cross-tabs: tier × field, tier × AI type, AI type × maturity.

This is where the thesis gets tested. The expectation — recorded here, in advance — is
that LLM-shaped work is largely saturated and most remaining gaps are limited by
physical build, fabrication, or institutions. **If the data shows that, it is a
quantitative version of the claim using someone else's dataset. If it does not, that is
a genuine and reportable surprise, and it gets reported as one.**

### Phase 3 — Progress indicators (outcome 4)

Six to eight gaps only, stratified across tiers: one quantity, current value, source,
plausible target. At least one **honest null** — a gap where a genuine search finds no
usable indicator — with the failed search preserved in `search_log` and the cache, so
the null is provable rather than asserted. An honest null is more persuasive than eight
tidy numbers. Labeled as a sample; never extrapolated to coverage.

### Phase 4 — New gaps (outcome 5)

Three to five, in astrophysics, physics, computation, metascience, materials science /
nanoscale fabrication. Written to `methodology/house-format.md`. Two are pre-selected:

1. **Materials-limited noise floors in precision instruments.** Thermal noise in
   optical coatings sets the sensitivity ceiling for next-generation gravitational wave
   detectors. Concrete mid-scale build, unambiguous metric, large downstream unlock.
2. **No machine-readable record of negative results, nulls, or rejected proposals.**
   Adjacent to their five metascience gaps but covered by none of them — theirs address
   fraud, synthesis at scale, publishing cost, clinical trial design, and organisational
   rigidity.

Dedup grep across the full export and a funding check precede any drafting; both are
recorded on the row.

### Phase 5 — Critical paths (outcome 6)

Two, chosen so the results differ, per `methodology/critical-path.md`.

**Chain 1 — Astrophysics, "Frontier Telescopes Are Expensive and Take Decades to Build"**
(`1c1cb37e-2a00-8008-9ca1-cf81d4b44116`). Their own description already names both the
elapsed time and the institutional link, so the chain completes a sentence they started
rather than correcting them. Its three capabilities — modular assembly plus reduced
launch costs, leveraging commercial component advances, a space telescope factory — all
act on fabrication and assembly. None acts on decision, approval, or funding, which is
where the chain is expected to bind. Stated as an observation, not a deficiency.

**Chain 2 — Metascience, "Doing and publishing research is expensive and subject to
structural roadblocks"** (`1c1cb37e-2a00-8063-9b9f-f3c2aa784e50`). Axis: **cost** — the
axis David's existing research has sourced evidence for. Speed and inclusiveness are
named as separate chains and left unbuilt. That research is the source of record and is
not re-derived; it already establishes that reviewer recruitment is measurably
degrading (~5 invitations per accepted review, some editors reporting 30+ for two
reviewers), that review judgment inconsistency is quantified (NeurIPS 2014 and its 2021
replication, 23–26% disagreement, roughly half the accept list changing on a rerun),
and that review scores predict later impact for rejected papers but not accepted ones.

Expected result, and it must differ from chain 1 rather than echo it: AI *does* act on
several links here — drafting and screening work now, reviewer matching is tractable
(though traditional statistical representations outperform generative AI at identifying
expert reviewers). The finding is that **AI acts on the links that were never
rate-limiting**, while recruitment, judgment consistency, and legitimacy remain
untouched. Do not flatten this into "publishing is a cognitive bottleneck". It is not,
and asserting it would be wrong.

**The intersection is the most valuable structural finding available.** Telescope time
is allocated by peer review of proposals, so chain 1's decision link is an instance of
chain 2's review machinery. Observatories have already changed that mechanism under
load: Distributed Peer Review, run at scale by ESO and NOIRLab, requires every
submitting PI to review a batch of others — a live natural experiment with a before and
after. Two gaps in different fields sharing a binding link demonstrates something a
catalogue structurally cannot: that bottlenecks recur across fields and can be counted.

### Phase 6 — Artifact and cover note (outcome 7)

Next.js with `output: 'export'` → static files. That yields both a deployable URL and a
directory Convergent can keep, which satisfies "self-contained and easy to send to a
stranger" without giving up the dashboard patterns already built in
`ai-impact-gap-map`. Their map with the added columns, browsable and filterable, every
added judgment showing its rationale on hover, `guess` labels visually distinct.

Plus a flat CSV of the full augmented dataset keyed on their IDs and slugs, for direct
ingestion.

Findings summary: tier distribution, AI type distribution, the cross-tab, the clearest
contrasting pair of gaps, the audit disagreement rate, and how long the whole thing
took.

Cover note: short, contribution-framed. Names the future work as the harder problem
worth doing together — outcomes as a proper many-to-many entity, chains across the whole
map, progress tracking as a maintained system, urgency and impact attributes. Mentions
the export bug. **Drafted here, sent by David.**

---

## Stated limitations, which go in the artifact

Naming these is part of the contribution:

- **Outcomes are not modeled as a proper entity.** There are almost certainly more
  outcomes than gaps, and one capability can unlock outcomes across several fields. A
  future version should promote outcomes to a first-class entity with its own links.
  Resolving it here would be a schema redesign, which is scope creep and lands badly
  from a stranger.
- **The progress indicators are a sample of 6–8**, not coverage, and must not be
  extrapolated.
- **Every label is an AI judgment with a stated rationale and a confidence flag**, not
  an expert consensus. The audit disagreement rate is the honest measure of how much
  weight they bear.
- **Capability edges are untyped upstream** — nothing marks a capability as necessary,
  sufficient, or partial for its gap — so critical-path link semantics are reconstructed
  by hand for two gaps only.

## Non-goals

Comprehensive gap coverage. Full causal chains across the map. Progress tracking as a
maintained system. Outcomes as an entity layer. Any redesign of their schema or
interface. All real and valuable; all belong in the cover note as later work, not here.

## Verification before external send

- The 3ie figures (≈42 evidence and gap maps, ~21,800 impact evaluations, ~1,700
  systematic reviews, and the absolute-gap vs. synthesis-gap distinction) are cited from
  the brief and **must be independently verified or cut** before anything goes out.
- Any named individual mentioned in the artifact gets checked against the current site.
