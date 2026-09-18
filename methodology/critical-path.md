# Building a critical path

**A critical path decomposes one gap into the ordered steps the work actually runs
through, and shows, step by step, whether AI reaches it and which of Convergent's own
capabilities act on it.** This file is the procedure. The exact data format is
`methodology/chain-schema.md`; how to find and cite evidence is
`methodology/research-method.md`; the brief to hand a sub-agent is
`agents/chain-builder.md`.

## The procedure

### 0. Set up

```bash
node engine/worktree.mjs chain-<short-name>
cd ../wt-chain-<short-name> && node engine/rebuild.mjs && node engine/preflight.mjs
```

Read, in this order: `docs/glossary.md`, this file, `methodology/chain-schema.md`,
`methodology/research-method.md`. Then read both existing chains in
`research-log/critical-paths/chains.json`. They are the only worked examples, and the
publishing one has been checked by a person.

**The examples predate the current format, so do not copy their shape.** They have no
`status`, `confidence` or pre-registration file; the telescope uses the legacy
`duration_jwst_years` and explains `is_binding: 0` on every step, which a new time chain
simply leaves out; and the file has top-level `phase` and `note` keys, which the ingest
ignores. Copy the example in `methodology/chain-schema.md` instead.

Do the work in the worktree `engine/worktree.mjs` made. If you switch branches inside it,
rebuild refuses with "HEAD MOVED"; run `node engine/preflight.mjs` again, as the message
says.

### 1. Choose the gap — ask David

This is a judgment about what the method should test next, and it is his.

Two chains exist, and both returned the same shape of answer: AI does not reach the
steps where the time or cost concentrates. **Telescopes** (primary kind of work: Physical
build, measured in time) and **research publishing** (Coordination, measured in cost).
The method has never been tested somewhere it could return the opposite answer. That is
the useful selection criterion, and it is about the method, not about which gap matters
more.

What makes a gap a good candidate:

- **A primary kind of work that neither chain covers**, especially one AI is good at:
  Prediction and modeling, Design search, Measurement and sensing, Running experiments.
- **At least three Convergent capabilities attached**, so "which steps have none"
  can say something. 62 of 103 gaps qualify.
- **A published record of how the work actually proceeds** — milestone dates,
  program histories, turnaround data. A chain with no numbers is a guess.
- **One dominant axis**, or a clear way to pick one.

List the candidates with this query. Present them **grouped by kind of work and sorted
by name**, never by a score or by your preference:

```bash
sqlite3 db/gapmap.sqlite "
SELECT t.ai_type AS kind_of_work, g.name,
       (SELECT count(*) FROM gm_gap_capabilities WHERE gap_id = g.id) AS capabilities, g.id
FROM gm_gaps g JOIN gap_ai_types t ON t.gap_id = g.id AND t.is_primary = 1
WHERE (SELECT count(*) FROM gm_gap_capabilities WHERE gap_id = g.id) >= 3
  AND g.id NOT IN (SELECT gap_id FROM critical_paths)
ORDER BY t.ai_type, g.name;"
```

### 2. Read everything Convergent already says

Their text is the primary evidence and costs nothing:

```bash
GAP=<gap-id>
sqlite3 db/gapmap.sqlite "SELECT name, description FROM gm_gaps WHERE id = '$GAP';"
sqlite3 db/gapmap.sqlite "
SELECT c.name, c.description, r.title, r.url, r.types_json
FROM gm_gap_capabilities gc
JOIN gm_capabilities c ON c.id = gc.capability_id
LEFT JOIN gm_capability_resources cr ON cr.capability_id = c.id
LEFT JOIN gm_resources r ON r.id = cr.resource_id
WHERE gc.gap_id = '$GAP' ORDER BY c.name, r.title;"
```

Gap descriptions often name the blocker outright. The capabilities are Convergent's view
of what would help, and resources typed `Initiative` are who is already building it.

### 3. Pick one axis

- **`time`** — elapsed time from the start of the work to its result. Use when a
  milestone record exists.
- **`cost`** — labor or money per unit of output. Use when the gap statement is about
  expense and figures exist per step.

**The number displayed on each step must measure the axis.** A time chain shows
`duration_years`. A cost chain shows `cost_value` with a `cost_unit` you choose, because
cost is not one thing: reviewer-hours per paper and dollars per experiment are both costs.

On a cost chain, per step:

- **A cost you can cite** goes in `cost_value` and `cost_unit`.
- **Elapsed time, where it is a fair stand-in for cost**, goes in `duration_days`, and
  `duration_span_note` says it is a stand-in. Never both on one step.
- **Anything unquantified** goes in `figure`, as words.
- If the only figures you can find anywhere are durations, make it a time chain instead.

The publishing chain predates `cost_value` and still shows days throughout, which is why
it reads as a cost chain displaying elapsed time. Fixing it needs per-step labor figures:
task A2 in `docs/future-work.md`.

A gap statement usually bundles several axes; the publishing gap bundles cost, speed and
who can afford to take part. Choose one, and name the rest in `axes_excluded`. A chain
that mixes axes produces a concentration that is an artifact of the mixing.

### 4. Pre-register the prediction — commit 1

Before any step exists, write
`research-log/critical-paths/preregistered/<id>.json`:

```json
{
  "id": "path-particle-accelerator-time",
  "gap_id": "1c1cb37e-2a00-803c-84ea-fa89d39a8929",
  "axis": "Elapsed time from design study to first beam",
  "axis_kind": "time",
  "axes_excluded": "Construction cost per unit of beam energy, which runs over a different set of steps.",
  "expectation": "Which steps you expect AI to reach, where you expect the time to concentrate, and whether Convergent's capabilities act on those steps. Specific enough to be wrong.",
  "registered_by": "<model id or name>",
  "registered_on": "YYYY-MM-DD"
}
```

```bash
node engine/check-preregistration.mjs research-log/critical-paths/preregistered/<id>.json
git add research-log/critical-paths/preregistered/<id>.json
git commit -m "Pre-register <id>: <the prediction in a few words>"
```

The checker also prints the capabilities attached to the gap, with their exact names.

**This file is never edited afterwards.** The ingest refuses the full chain if `gap_id`,
`axis`, `axis_kind`, `axes_excluded` or `expectation` differ from it. It cannot tell if
both files were edited together; git can, and the reviewer checks. A prediction written
before the analysis and then confirmed is evidence; one written after is a story. If the
chain contradicts the prediction, that is a result, and it goes in `finding`.

### 5. Decompose into steps

The steps are the work, in the order it happens, from the start of the axis to its end.

- **Usually five to nine steps.** Fewer hides where the time goes; more splits steps that
  share one blocker and one figure.
- **Each step has one blocker**, stated as what actually holds it up. "Community
  consensus on what to build", not "science case definition is slow".
- **Name a step by what happens**, not by who does it.
- **Split a step when its parts have different blockers.** The publishing chain's
  reviewer step is really matching, which AI reaches, and willingness, which it does not.
  It was kept as one step with the split stated in `blocker`, because no figure
  separates them.
- **Steps are strictly sequential in the schema.** If the real work has parallel tracks,
  say so in `finding` and flag it for David; do not force a false order.

### 6. Map Convergent's capabilities to steps

For each capability attached to the gap, read its description and its resources, and
decide which steps it acts on: none, one or several. Put its name, as printed by
`engine/check-preregistration.mjs`, in each of those steps' `capabilities` arrays. The
ingest rejects any name not attached to the gap. Some of Convergent's names contain line
breaks a terminal hides; the checker shows them on one line, and the ingest accepts that
form.

This is the part of the chain that comes from their data rather than from our labels, and
it is usually the strongest result: on the publishing chain, 4 of 7 steps have nothing
attached, including the one where the labor concentrates.

**Tone.** "None of the three capabilities acts on the approval step" is an observation.
"They missed the real bottleneck" is a critique, and it loses the reader in one sentence.

### 7. Research each step

Follow `methodology/research-method.md`. For every step, find:

- **Evidence for the blocker**, from a source you fetched and can cite.
- **A quantity on the axis** — years for a time chain, days or cost for a cost chain —
  with a citation a reader can resolve: title, year, and a DOI or URL.
- **Or an honest null**: a genuine search that found nothing, logged. A null is a
  finding. On the publishing chain, the step with no measure is the one that matters
  most.

When one published figure covers several steps, carry it on the first of them and list
the steps in `duration_covers`. Never divide it between steps to make each one look
measured.

**If you commit before every step is researched**, set `status: "draft"` and say in
each unresearched step's `duration_span_note` that it has not been researched yet. A draft
validates but is never exported. Do not use the words of an honest null for a step you
have not searched.

Save your searches before you rebuild, or they are lost:

```bash
node engine/export-searches.mjs chain-<short-name> --phase chain-<short-name>
```

### 8. Label AI reach on each step

| Field | Question it answers |
|---|---|
| `ai_acts` | Does a current AI capability act on this step at all? |
| `ai_type` | What kind of work stands in the way *at this step*? Stored name — see `methodology/chain-schema.md`. |
| `maturity` | **Would applying that AI move this step?** `Working now`, `2-5 years`, `Speculative`. |
| `is_binding` | Cost chains only. Does this step carry a disproportionate share of the cost, with evidence? |
| `confidence` | `confident` or `guess`, on every step. Set `guess` whenever the call could reasonably go another way, and say why in `rationale`. A chain with no guesses is not confident, it is dishonest. |

**Maturity is efficacy, not availability.** The telescope's first step is labeled
`Working now` because language models are good at scientific synthesis, but the step's
own blocker is a field reaching consensus, which models cannot do. Ask whether applying
the capability would shorten or cheapen *this step*, and read the blocker before
answering. The discriminating examples are in `methodology/taxonomy.md`.

`ai_acts` and `is_binding` are independent. A step can be both, which is the interesting
case. **If the steps AI reaches and the steps that carry the cost turn out to be exactly
complementary sets, suspect the labeling before the world** — that was the circularity
that removed `is_binding` from the telescope chain.

### 9. Write the finding

Lead with the claim, in one paragraph. Then:

- Say explicitly whether the pre-registered expectation held, and where it did not.
- What Convergent's capability set touches and does not, as an observation.
- Where the evidence is thin, in one sentence, not a paragraph of caveats.

The first paragraph is shown on the site; the rest is behind a click.

### 10. Validate and commit — commit 2

Write the full chain to `research-log/critical-paths/<id>.json`, one chain per file, with
`status: "complete"` once every step is researched, or `"draft"` if not.
`is_binding` compares steps with each other, so set it only once the other steps have
figures; on a draft, leave it out or mark the step `guess`.

```bash
node engine/rebuild.mjs          # runs the ingest; every problem is listed at once
node engine/export-artifact.mjs  # confirms the artifact builds with it
git add research-log/critical-paths/<id>.json research-log/searches/
git commit -m "<id>: <the finding in a few words>"
git push -u origin <branch>
```

If rebuild fails, the message names the field and step. Fix the file; never the ingest.

### 11. Review

A different agent reviews the chain, using `agents/reviewer.md`, mode C. It must not see
your reasoning before it forms its own. It argues that a different step dominates,
re-fetches your figures, and checks tone. Record what it finds, fix what is right, and
commit the fixes separately so the review stays visible.

### 12. Hand to David

Push the branch and ask. Do not merge it. `reviewed` stays `"ai-only"`: only David sets it
to `"human"`, and only after reading the chain against the gap himself.

### 13. Publishing is a separate change

The site renders chains by hard-coded id in `app/src/app/chains/page.jsx` and
`app/src/app/page.jsx`. Adding a chain to the site, and to the Mermaid source in
`app/src/components/mermaid.js`, is a site change David approves on its own.

---

## Rules that change the answer

1. **One axis, and the number you show measures it.**
2. **Maturity is efficacy on this step**, never whether the technique exists.
3. **A published figure covering several steps is a span.** Use `duration_covers`; do not
   split it.
4. **An honest null is a result**, and usually the most important row in the chain.
5. **The prediction is fixed once committed.** Contradictions go in `finding`.
6. **Capability coverage is reported as observation**, never as omission.
7. **Never rank their gaps**, and never call a step "the most important". Say where the
   time or cost is, with the number.

## Known issues in the existing chains

- **The publishing chain shows days on a cost axis.** It predates `cost_value`. New cost
  chains do not have this problem; fixing this one needs per-step labor figures, which is
  task A2 in `docs/future-work.md`.
- **5 of 15 steps carry the availability reading of maturity.** The worst is the
  telescope's science-case step. Correcting it moves the telescope headline from "AI
  acts on 9.5 of 32.5 years" to roughly 2.5, a stronger claim, but a second reader has
  not confirmed it.
- **The schema is strictly sequential.** Neither chain has parallel tracks. A gap that
  does will need `is_binding` in its textbook sense and a schema change.

---

## Reference: what "binding" and "carries the cost" mean

The method borrows "critical path" from project management, where it means the sequence
with no slack in a network of parallel tasks, so speeding up anything off it changes
nothing. **That only works when there are parallel paths.** Both chains built so far are
strictly sequential, and in a strictly sequential chain every step adds to the total, so
marking some steps "binding" claims a distinction the structure does not contain.

| Chain shape | Is `is_binding` meaningful? | Instead |
|---|---|---|
| Time, strictly sequential | **No.** The ingest rejects it. | State the arithmetic: "AI acts on 9.5 of the 32.5 years." |
| Time, with parallel tracks | Yes, in the textbook sense. Not yet supported by the schema. | Flag for a schema change. |
| Cost | **Yes, differently:** this step carries a disproportionate share of the cost. | Set it, with evidence. The site shows "carries the cost". |

The cost sense is about distribution, not slack. On the publishing chain it is set on
three steps: reviewer recruitment (4.5 invitations per accepted review), review
judgment (23% committee disagreement), and credit and legitimacy (no published quantity;
the blocker is what committees agree to count).

---

## In short

- **Thirteen steps, three commits.** The prediction is committed before any step exists,
  the chain second, review fixes third. The ingest refuses a chain that does not match
  its registration or breaks the format; the reviewer checks in git that the registration
  came first and never changed.
- **Choosing the gap is David's call.** Never present an ordered list of their gaps.
  Offer candidates grouped by what they would test.
- **One axis per chain: `time` or `cost`.** The number shown measures it: `duration_years`
  on a time chain, `cost_value` plus a `cost_unit` on a cost chain.
- **Maturity on a step means "would applying AI move this step", not "does the technique
  exist".** This is the most common wrong call, and it has already been made on 5 of the
  15 existing steps.
- **Zero capabilities on a step is the finding.** Report it as an observation about the
  capability set, never as something Convergent missed.
- **Commit a partly researched chain as `status: "draft"`.** Drafts validate but never
  reach the public data. Every step carries a `confidence`.
- **Every chain ships `reviewed: "ai-only"`.** Only David changes that.
- A new chain does **not** appear on the site until someone adds it deliberately. The
  pages select chains by id.
