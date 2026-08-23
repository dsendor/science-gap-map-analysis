# Execution plan for phases 3–6 (local agent)

**Read this whole document before starting.** It assumes Phases 0–2 are complete and
committed: the baseline is imported, all 103 gaps carry an outcome, an AI capability
type with maturity, and a measurability tier, and a blind audit has been run and
adjudicated. `docs/findings.md` holds the distributions and the audit disagreement
rate.

Phases 3–6 need open network access, which is why they run locally rather than in the
remote session that produced Phases 0–2.

---

## 0. Before you touch anything

```bash
cd science-gap-map-analysis
cp .env.example .env          # set BRAVE_API_KEY
cp .mcp.json.example .mcp.json
node engine/rebuild.mjs       # import baseline + all label files + verify additive
```

`rebuild.mjs` must end with **"additive-only check passed"**. If it does not, stop and
fix that before doing anything else — every later phase depends on Convergent's data
being untouched.

Confirm the network is actually open, because the remote session's was not:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://arxiv.org/
node engine/search.mjs "test" --count 3 | head -20
```

Both must succeed. If `search.mjs` returns a 403 naming a blocked host, you are behind
an egress proxy and Phase 3 cannot be done properly — say so rather than producing
unsourced numbers.

### Rules that hold across every phase

1. **Never modify `gm_*` tables.** Run `node engine/verify-additive.mjs` before every
   commit. It is the project's load-bearing claim.
2. **Never rank.** No numeric score, no ordering, no "most important". The schema has
   no column for it; do not add one.
3. **Every judgment gets a `rationale` and a `confidence`.** `guess` is not a failure
   state. A phase that produces no guesses will be assumed to be lying.
4. **Log non-obvious calls** as `decisions` rows (phase, decision, rationale,
   runner_up, confidence, reversal_condition).
5. **Log time.** Open a `runs` row when you start a phase and close it when you finish:
   ```sql
   INSERT INTO runs (phase, kind, started_at, model, note)
   VALUES ('phase-3', 'agent', datetime('now'), '<model>', 'progress indicators');
   ```
   Track `agent` and `human-review` separately. The elapsed-time figure is part of the
   argument, and a single blended number invites the obvious objection.
6. **Commit per phase**, with `verify-additive` passing at every commit.
7. **Every phase has a mandatory independent review gate.** Phases 1-2 had one and it
   materially changed the output — it found that a whole measurability tier could not be
   applied reliably, and 23% of tier labels and 19% of AI-type labels ended up flagged
   as guesses that were not flagged before. Do not skip these. The reviewer must never
   be the agent that produced the work, and must form its own view before reading
   yours. Reviewers report; they do not fix. See `agents/reviewer.md`.

---

## Phase 3 — Progress indicators

**Deliverable:** 6–8 rows in `gap_indicators`, at least one of them an honest null.

### What an indicator is

One measurable quantity for the gap, with a current value, a real source, and a
plausible target. Not a proxy for the field. Not a count of papers. The question is:
*if someone wanted to know whether this gap is closing, what number would they watch?*

### The sample, already stratified

Chosen across tiers so the sample cannot be read as "we picked the easy ones". Do
these eight; substitute only with a `decisions` row explaining why.

| Gap | id | Tier | Candidate quantity |
|---|---|---|---|
| Frontier Telescopes Are Expensive and Take Decades to Build | `1c1cb37e-2a00-8008-9ca1-cf81d4b44116` | Directly measurable | Years from concept study to first light; cost per m² of aperture |
| Searching Through the Vast, Underexplored Space of Materials | `1c1cb37e-2a00-80cb-8db6-e28439779875` | Directly measurable | Experimentally validated novel materials per year |
| Most Brain Circuitry is Still Invisible | `1b3cb37e-2a00-80cd-9213-c8eb788cc657` | Directly measurable | mm³ of brain reconstructed at synaptic resolution; cost per mm³ |
| Clinical Trials Are Poorly Optimized for Evidence Gathering | `1c1cb37e-2a00-80df-ae9c-cc561c437a83` | Directly measurable | Median cost per trial; share terminating inconclusive |
| Silicon-Based Electronics Face Fundamental Limits | `1fccb37e-2a00-8071-859f-f25fac2df35c` | Directly measurable | Contacted gate pitch in nm at volume production |
| Fraud in the Scientific Literature | `1c1cb37e-2a00-8007-8b2a-c8c51e4c39d0` | Proxy only | Retractions per 10,000 papers |
| Quantum Gravity is Experimentally Hard to Constrain | `1c1cb37e-2a00-8027-8eda-e6f4a472c3ad` | Verification contested | **Expected null** — see below |
| A Limited Set of Rigid Organizational Structures… | `1c1cb37e-2a00-80b5-8cf4-c8195273fa45` | Counterfactual required | **Expected null** — see below |

### The honest null is the most important row here

The brief is explicit: *"Include at least one gap where a genuine search finds no
usable indicator, and say so plainly. An honest null is more persuasive than eight tidy
numbers."*

The last two rows are where a null is most likely, and that is not a coincidence — it is
the thesis. But **do not assume the null**. Search properly, and if you find a real
indicator, record it: a tier-4 gap with a genuine indicator would be a more interesting
result than the expected null.

A null is only honest if it is provable. So:

- Run the searches through `node engine/search.mjs "<query>" --phase 3 --gap <id>`,
  which caches to `research-cache/` and writes a `search_log` row. **Do not use the
  Brave MCP tool or WebSearch for this phase** — those leave no replayable record, and
  the whole value of the null is that a reader can check what you looked for.
- Issue at least five substantively different queries before concluding a null.
- Then set `is_null_result = 1`, leave `current_value` and `source_url` NULL (the
  schema's CHECK permits this only when `is_null_result = 1`), and write a `rationale`
  that states what you searched for and what the closest near-miss was.

### Sourcing standard

A search snippet is not a source. For every non-null indicator:

1. Find the candidate via `engine/search.mjs`.
2. **`WebFetch` the actual page** and read the number off it.
3. Record `source_title`, `source_url`, and `source_doi` where one exists.
4. Run `node engine/validate-indicators.mjs`, which checks arXiv, then Crossref, then
   plain URL reachability, and writes `source_checked` back to the row. Note that a
   bare URL check records `unchecked`, not `verified`: a reachable page proves the page
   exists, not that it supports the number.
5. Set `as_of` to the date the value refers to, not the date you looked.

If a number is real but you could only get it from a secondary source, set
`confidence = 'guess'` and say so in the rationale.

### Targets

`target_value` needs a `target_basis` — where the target comes from. A roadmap
commitment, a stated programme goal, or a physical limit are all acceptable. An invented
round number is not. If no defensible target exists, leave both NULL and say why.

### Review gate — mandatory

Spawn an independent reviewer in **Mode A** of `agents/reviewer.md`. It must not be the
agent that produced the rows and must not see their reasoning first.

It re-fetches every source and confirms the number is really on the page and really
measures the stated quantity, and — the important part — **it runs its own independent
search for every null before reading yours.** A null two independent searchers reach
separately is the strongest row in the artifact. A null the reviewer breaks by finding
an indicator you missed is a false claim, and must be fixed before anything ships.

Resolve every `blocking` finding. Record unresolved ones in `decisions`.

### Acceptance

- 6–8 `gap_indicators` rows, spanning at least three different tiers.
- At least one `is_null_result = 1` with at least five logged searches behind it.
- Every non-null row has a `source_url` that you actually fetched.
- Reviewer Mode A run, `research-log/reviews/phase-3.json` written, no unresolved `blocking`.
- The artifact must label this a **sample** and must not extrapolate it to coverage.

---

## Phase 4 — New gaps

**Deliverable:** 3–5 rows in `new_gaps`, in Convergent's house voice.

Read `methodology/house-format.md` first. The format statistics there are derived from
all 103 of their descriptions: 12–192 words, median 38, interquartile 26–59. Aim for
30–60 words. A 400-word essay is instantly foreign to the corpus.

### The two pre-selected gaps

**1. Materials-limited noise floors in precision instruments.** Thermal noise in optical
coatings sets the sensitivity ceiling for next-generation gravitational wave detectors.
A lower mechanical loss coating is a concrete mid-scale build, the metric is unambiguous
(coating thermal noise, mechanical loss angle), and the downstream unlock is large.
Field: Materials Science. Safe, and unmistakably in their house style.

**2. No machine-readable record of negative results, nulls, or rejected proposals.**
Field: Metascience. Related to Nielsen and Qiu's failure audit and to public
anti-portfolio proposals. Adjacent to their existing metascience gaps but covered by
none of them — theirs address fraud, synthesis at scale, publishing cost, clinical trial
design, and organisational rigidity. **Verify that claim against the data yourself**
before relying on it.

Then add 1–3 more from astrophysics, physics, computation, metascience, or materials
science / nanoscale fabrication. Candidates named in the brief as future potential,
any of which may be promoted if the dedup check clears:

- Simulation and forward-model fidelity as the limit on survey astronomy in the Rubin
  and CMB-S4 era
- No verifier infrastructure for long-horizon scientific claims: claim registries,
  adversarial replication, scored long-range forecasting
- Decision and construction latency for large scientific facilities as a gap in its own right
- Fabrication access latency: queue times at shared nanofabrication facilities as a rate
  limit on materials research

### Before drafting anything — both checks are mandatory

**Dedup.** Grep the full export, not just the field you think it belongs to:

```bash
node -e "
const d=require('./data/baseline/2026-07-29/gapmap-data.json');
const t=/coating|thermal noise|mechanical loss/i;
for (const g of d.gaps) if (t.test(g.name+' '+g.description)) console.log('GAP', g.field?.name, '|', g.name);
for (const c of d.capabilities) if (t.test(c.name+' '+(c.description||''))) console.log('CAP', c.name);
"
```

Record in `new_gaps.dedup_check`: what you searched, what came closest, why the new gap
is distinct.

**Funding.** Confirm the gap is not already funded and under construction — check
current roadmaps, FRO listings, and active programmes via search and WebFetch. Record in
`new_gaps.funding_check`. A "new" gap that turns out to be an FRO already in flight is
the single most embarrassing failure mode available to this artifact.

### Both tests must pass and be recorded

- `tension_test`: wide agreement the goal would be transformative, **plus** genuine
  debate about near-term feasibility. No debate means it is either already funded or
  nobody believes in it.
- `unlock_test`: which downstream dominoes fall. Judge by unlocks, not by how
  intrinsically interesting the domino is.

Each new gap also gets the same three labels as everything else — outcome, AI type and
maturity, measurability tier. If a new gap lands in tier 3 or 4, **say so plainly**
rather than dressing it up as tier 1. Their own roadmapping criterion asks whether
success is unambiguously measurable, and the honest answer is part of the contribution.

### Review gate — mandatory

Spawn an independent reviewer in **Mode B** of `agents/reviewer.md`. Its instruction is
to **refute novelty, not confirm it** — it greps the export with its own search terms
and hunts for funded work, defaulting to "already covered". You have every incentive to
conclude your own gap is novel, which is exactly why you do not get to be the one who
checks.

It also runs the **house-format blind test**:

```bash
node engine/make-format-test.mjs
```

This writes `research-log/format-test.json` — your proposed gaps shuffled among real
Convergent ones with identifying markers stripped — and a key the reviewer only opens
after answering. If the reviewer reliably picks yours out, the voice does not match and
the finding says what gave them away: length, hedging, vocabulary, sentence shape,
numbers. Revise and re-run until recall on your items is near chance.

A `covered-by-existing-gap`, `covered-by-existing-capability`, or `already-funded`
verdict is blocking. Drop or replace that gap.

### Acceptance

- 3–5 rows, each 30–60 words, title-case declarative name, no urgency language, no
  inline citations, no named vendors.
- `dedup_check` and `funding_check` both populated with what was actually searched.
- IDs prefixed `new-`. **Never** mint a Convergent-style UUID.
- Reviewer Mode B run, format test at near-chance recall, no unresolved `blocking`.

---

## Phase 5 — Critical paths

**Deliverable:** 2 rows in `critical_paths` with their `critical_path_links`, plus a
Mermaid diagram per chain. Read `methodology/critical-path.md` first.

**Write `expectation` into the row BEFORE doing the analysis.** A prediction recorded in
advance and then confirmed is evidence; the same prediction written afterwards is a
story. If the chain refutes the expectation, report the refutation.

### Chain 1 — Astrophysics, telescopes

Gap `1c1cb37e-2a00-8008-9ca1-cf81d4b44116`. Axis: **elapsed time from concept to first
light**.

Their own description already names both the elapsed time and the institutional link —
"there needs to be the organizational structure and hunger to adopt such methods" — so
this chain completes a sentence they started rather than correcting them.

Candidate links, in order: science case definition → decadal survey ranking → funding
authorisation → design maturation → fabrication → integration and test → launch →
commissioning. Refine against real programme histories.

Elapsed-time data is abundant and citable: JWST, Rubin, Roman, ELT, and the decadal
survey record. Source the real durations rather than estimating them.

**Expected finding** (record it, then test it): design and optimisation search helps at
the concept and optics stages, and the binding links fall on physical build and on the
funding decision, neither of which any current AI capability touches. If that holds, the
demonstration is that **closing the cognitive links changes the total duration very
little.**

Their three capabilities — modular assembly plus reduced launch costs, leveraging
commercial component advances, and a space telescope factory — all act on the
fabrication and assembly links. None acts on decision, approval, or funding. State that
**as an observation about their capability set, not as a deficiency.**

One detail worth using: this gap lists **Aaron Tohuvavohu** as an attached Individual,
and the same name appears in the Gap Map acknowledgments. Verify that against the
current site before relying on it. If the artifact leads with this gap, there is a named
person already associated with it.

### Chain 2 — Metascience, publishing

Gap `1c1cb37e-2a00-8063-9b9f-f3c2aa784e50`. Axis: **cost**. Their sentence bundles cost,
speed and inclusiveness — pick cost, say so in `axis`, and record the other two in
`axes_excluded` as separate chains. Chains that silently mix axes produce a binding link
that is an artifact of the mixing.

**Source of record, to be read before drafting and not re-derived:** the Notion page
*"Peer review as a research program: what is saturated, what is open, and where it
lands"* (`0dcfd19f70b04baf855814eedb8427d8`). Use the Notion MCP tool. It already
establishes, with sources:

- Reviewer recruitment is measurably degrading: roughly five invitations per accepted
  review, with some editors reporting more than thirty invitations to secure two reviewers.
- Review judgment is inconsistent and quantified: NeurIPS 2014 and its 2021 replication,
  23–26% disagreement, roughly half the accept list changing on a rerun.
- Review scores predict later impact for rejected papers but not accepted ones (Cortes
  and Lawrence). Review is decent at spotting bad work and close to useless at ranking
  good work.
- The credit and legitimacy link is entirely institutional. A model can review a paper
  today; it cannot make a hiring committee count that review.

Candidate links, in order: production and drafting → submission → reviewer recruitment
and matching → review judgment → editorial decision → dissemination → credit and
legitimacy.

**Expected finding, and it must differ from chain 1 rather than echo it.** Here AI *does*
act on several links: drafting and screening work now, and reviewer matching is
tractable — though there is published evidence that traditional statistical
representations outperform generative AI at identifying expert reviewers. So the finding
is **not** that AI does nothing. It is that **AI acts on the links that were never
rate-limiting**, while recruitment, judgment consistency, and legitimacy remain
untouched.

**Do not flatten this into a claim that publishing is a cognitive bottleneck. It is not,
and asserting it would be wrong.**

### The intersection — do not skip this

This is the most valuable structural finding available in the whole project.

Telescope time is allocated by peer review of proposals. So **chain 1's decision and
approval link is an instance of chain 2's review machinery.** Observatories have already
changed that mechanism under load: **Distributed Peer Review**, run at scale by ESO and
NOIRLab, requires every submitting PI to review a batch of other proposals. That is a
live natural experiment on review capacity with a before and after.

Two gaps in different fields sharing a binding link demonstrates something a catalogue
structurally cannot: **that bottlenecks recur across fields and can be counted.** Give it
its own section in the findings.

### Review gate — mandatory

Spawn an independent reviewer in **Mode C** of `agents/reviewer.md`. Two things it does
that you cannot do for yourself:

1. **Verifies the expectation was really pre-registered**, by checking that the commit
   containing `expectation` precedes the one containing `finding` in git history. This
   is why you commit the expectation on its own before starting the analysis — the git
   log is the evidence, and without it the pre-registration claim is unfalsifiable.
2. **Argues that a different link binds.** It takes the strongest case it can for at
   least two non-binding links using the same evidence. If it can make a serious case,
   your conclusion is not established and the chain needs more work.

It also checks axis discipline, the intersection claim, and the tone rule.

### Acceptance

- Exactly two chains. Not three. Doing this across the map is the collaboration being
  proposed, not the thing being given away.
- Every link has `blocker` and `rationale`; `is_binding` set on the ones that bind.
- `expectation` committed **in an earlier commit** than `finding`, and honest about divergence.
- Tone check: every statement about their capability set reads as observation, not critique.
- Reviewer Mode C run, no unresolved `blocking`.

---

## Phase 6 — Artifact, CSV, findings, cover note

### The artifact

Next.js with `output: 'export'` in `next.config.js` → static files in `app/out/`. That
gives both a deployable URL and a directory Convergent can keep, which is what
"self-contained and easy to send to a stranger" requires. Port the dashboard patterns
from the sibling `ai-impact-gap-map` repo rather than starting fresh.

Requirements:

- Their map with the added columns, browsable and filterable by field, tier, AI type and
  maturity.
- **Every added judgment shows its rationale**, on hover or in a detail panel. This is
  the credibility mechanism; do not hide it behind a click that nobody makes.
- **`guess`-flagged labels are visually distinct** from `confident` ones at a glance.
- Cross-tab views: tier × field, tier × AI type, AI type × maturity.
- The two critical paths rendered as Mermaid diagrams with their link tables.
- New gaps clearly marked as proposed additions, never mixed in with theirs.
- Nothing sorted by anything that could read as a ranking. Default order is theirs.

Before writing any chart code, load the `dataviz` skill.

### The CSV

Flat, one row per gap, keyed on **their** `id` and `slug` so it joins straight back to
their source data. Include: their id, slug, name, field; our outcome, primary AI type,
maturity, tier; the rationale and confidence for each; and a column marking new gaps.
`engine/export-artifact.mjs` should emit both the CSV and the JSON the app consumes.

### The findings summary

Must include, and must not be tuned to look better:

- Tier distribution and AI type distribution across all 103 gaps.
- The cross-tab of tier against AI capability type.
- The clearest contrasting pair of gaps.
- **The audit disagreement rate**, per dimension, with the population-weighted overall
  figure and a note that the sample deliberately oversampled the rare tiers.
- Elapsed time, split into agent time and human review time.
- Whether the expected finding — LLM-shaped work largely saturated, most remaining gaps
  limited by physical build, fabrication or institutions — was **confirmed or refuted.**
  A refutation is a genuine result and gets reported as one.

### Stated limitations, which go in the artifact itself

Naming these is part of the contribution:

- **Outcomes are not modeled as a proper entity.** There are almost certainly more
  outcomes than gaps, and one capability can unlock outcomes across several fields. A
  future version should promote outcomes to a first-class entity with its own links.
  Resolving it here would be a schema redesign, which lands badly from a stranger.
- **The progress indicators are a sample of 6–8**, not coverage, and must not be
  extrapolated.
- **Every label is an AI judgment with a rationale and a confidence flag**, not expert
  consensus. The disagreement rate is the honest measure of how much weight they bear.
- **Capability edges are untyped upstream** — nothing marks a capability as necessary,
  sufficient, or partial for its gap — so link semantics were reconstructed by hand for
  two gaps only.

### The cover note

Short. Contribution, not critique. A stranger sending recommendations reads as
criticism; a stranger sending a working augmented version of their own dataset reads as
a collaborator.

Include:

- What was added and that it is **provably additive** — point at `engine/verify-additive.mjs`.
- How long it took. The time number is part of the argument.
- **The export bug**, which is the cheapest credibility in the whole package:
  `capabilities[].gaps` is empty for all 369 capabilities though their own `schema.json`
  documents it as populated; all 389 edges exist only on the gap side, so any consumer
  starting from `capabilities.json` builds an empty graph. Also: two capability records
  lack the `description` their schema marks required, and 6 resources are referenced by
  no capability. See `docs/integrity-report.md`.
- The harder work worth doing together later: outcomes as a proper many-to-many entity,
  chains across the whole map, progress tracking as a maintained system, and the urgency
  and impact attributes they have already said they want.

**Draft it. Do not send it.** External communication is David's.

### Review gate — mandatory

Spawn an independent reviewer in **Mode D** of `agents/reviewer.md`. It traces every
quantitative claim in `docs/findings.md` and the cover note back to a database row and
lists the ones that do not trace — the check that catches a confident sentence written
from memory. It also hunts for ranking, which re-enters through the side door as a
default sort, a "top" list, or a chart ordered by magnitude, and it opens the built page
to confirm `guess` labels are visually distinct rather than merely present in the data.

### Verify before anything goes outside the repo

- **The 3ie figures must be independently verified or cut**: roughly 42 evidence and gap
  maps, the Development Evidence Portal at roughly 21,800 impact evaluations and 1,700
  systematic reviews, and the absolute-gap versus synthesis-gap distinction. The brief
  flags these as needing verification. Anything you cannot confirm does not go in.
- **Aaron Tohuvavohu**'s association with the telescope gap and the acknowledgments,
  checked against the current site.
- Every indicator source URL resolves.
- `node engine/verify-additive.mjs` passes.
- The app builds: `cd app && npm run build`.

---

## What success looks like

A stranger at Convergent Research opens one file, sees their own map with four new
columns, can filter it, can see why every judgment was made and which ones are guesses,
can read two worked chains that show the method discriminates, and can read a number
saying how long the whole thing took. Then they read a short note that tells them
something true about their own export and proposes the harder work as a collaboration.

Nothing in it rewrites their data, ranks their gaps, or tells them they got something
wrong.
