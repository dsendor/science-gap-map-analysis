# The plan: what to build next

**The work that extends this analysis, as tasks an agent can pick up.** Three
workstreams: building critical paths, improving the labels on gaps, and the research
that supports both. Each task says what it produces, how to know it is done, and whether
David must decide something first.

The public version of the open items is the site's *What's missing* page
(`app/src/app/missing/page.jsx`), written for Convergent. This file is the working plan;
the two should agree on what is open.

## How to pick up a task

1. Take a worktree: `node engine/worktree.mjs <task-name>`.
2. If the task says **Needs David**, ask the question it names before doing anything else.
3. Follow the procedure it points to. Work on the branch; push it; ask before merging.
4. Update `docs/todo.md` when you start and when you finish.

## A. Critical paths

### A1. Build the next chain

- **Goal.** A third chain, chosen to test whether the method can find AI reaching the step
  where the time or cost concentrates.
- **Why.** Telescopes (Physical build, time) and publishing (Coordination, cost) both
  found AI missing the steps that matter. A method that has only ever returned one answer
  has not shown it can return another.
- **Needs David.** Which gap. Offer candidates grouped by kind of work, using the query in
  `methodology/critical-path.md`, step 1. Never an ordered list.
- **Procedure.** `methodology/critical-path.md`. Brief for a sub-agent:
  `agents/chain-builder.md`.
- **Output.** `research-log/critical-paths/preregistered/<id>.json` (commit 1),
  `research-log/critical-paths/<id>.json` and `research-log/searches/<name>.json`
  (commit 2), and a review (commit 3).
- **Done when.** Rebuild passes; a reviewer in mode C of `agents/reviewer.md` has checked
  it and its findings are fixed or recorded; the branch is pushed and David has been
  asked.
- **Size.** Medium: a day of agent work, most of it research.

### A2. Make the publishing chain show a cost

- **Goal.** The publishing chain displays costs, not elapsed days.
- **Status.** Half done. `cost_value` and `cost_unit` exist, and any new cost chain uses
  them. The publishing chain predates them and still shows days throughout.
- **What is left.** Per-step labor figures for the seven steps — reviewer-hours or
  editor-hours per paper — each cited. Where no figure exists, keep `duration_days` and
  say in `duration_span_note` that time is standing in for cost.
- **Needs David.** Whether it is worth re-researching, or whether the chain is left as it
  is with the limitation stated.
- **Done when.** Every displayed number on every chain measures its declared axis.
- **Size.** Medium, and it is research rather than code.

### A3. Re-read maturity on the existing chain steps

- **Goal.** Every step's maturity answers "would applying AI move this step".
- **Why.** 5 of 15 steps carry the availability reading. The telescope's science-case step
  is labeled `Working now` although its blocker is a field reaching consensus. Correcting
  it moves the telescope headline from 9.5 of 32.5 years to roughly 2.5.
- **Procedure.** A second reader relabels maturity on all 15 steps blind, following
  `methodology/audit-protocol.md`, then disagreements are adjudicated on the merits.
- **Needs David.** Approval before the published telescope number changes.
- **Done when.** All 15 steps are agreed or flagged `guess`, and the site's figures match.
- **Size.** Small.

### A4. Type the capability edges

- **Goal.** For each of Convergent's 389 capability-to-gap edges, whether the capability
  is **necessary**, **sufficient** or **partial** for its gap.
- **Why.** It is the one missing piece that stops chains being hand-built. With it, which
  steps a capability acts on becomes derivable across the map rather than argued gap by
  gap. It is also the most useful single thing to ask Convergent for.
- **Needs David.** Whether to build this ourselves or propose it to Convergent. It is their
  data model.
- **Output.** A new augmentation table and file under `research-log/`, joined on their ids,
  with a rationale and a confidence on every edge. Never a change to `gm_*`.
- **Done when.** Every edge is typed, and a blind relabel of a sample has published its
  disagreement rate.
- **Size.** Large.

### A5. Count recurring blockers across chains

- **Goal.** Which kinds of blocking step recur across fields.
- **Why.** The two chains share one step: allocation by peer review of proposals. A map
  with one row per gap has nowhere to record that. With more chains it can be counted
  rather than noticed.
- **Needs.** At least four chains in different fields, so a pattern is not two
  coincidences.
- **Output.** A section in `docs/findings.md`, derived from the database.
- **Size.** Small, once the chains exist.

### A6. Publish a new chain on the site

- **Goal.** A reviewed chain appears on `/chains`.
- **Needs David.** Always. The site selects chains by id in
  `app/src/app/page.jsx` for the front page only. Since 2026-09-21 the critical-path
  pages generate themselves from the export, so a complete chain reaches the site on the
  next build; deploying it is still an outward-facing change and still David's.
- **Size.** Small.

---

## B. Improve the labels on gaps

### B1. Drop the "Proxy only" measurability tier

- **Goal.** Three measurability tiers instead of four.
- **Why.** "Proxy only" ran 78% disagreement in the blind audit, against 0% for "Directly
  measurable", and every auditor named it as the nearest alternative and almost never the
  winner. 19 gaps hold it.
- **Procedure.** Relabel those 19 into the remaining tiers with a rationale each; update the
  CHECK constraint in `db/schema.sql` and `methodology/taxonomy.md`.
- **Size.** Small. The cheapest item on this list.

### B2. Split maturity into two questions

- **Goal.** Two fields: **how long**, and **whether a path is known**.
- **Why.** `2-5 years` holds 62 of 103 gaps, so it barely discriminates, and the three
  values are not one axis: `Speculative` says there is no clear path, while `2-5 years`
  says how long. A gap with a clear path that takes fifteen years has nowhere to go.
- **Procedure.** A full labeling pass with a blind second reader, like the original
  relabel. `agents/labeler.md`, `agents/auditor.md`, `methodology/audit-protocol.md`.
- **Needs David.** The definitions, before any labeling.
- **Size.** Large.

### B3. Blocked on adoption, or blocked on capability

- **Goal.** A flag separating "the technique works and is not adopted" from "the technique
  does not work yet".
- **Why.** Eleven gaps found during the maturity repair are held back by adoption, not
  capability: DNA-synthesis screening works and is not adopted; adaptive platform trials
  have run since 2010 and the field has not taken them up. Maturity reports both as "not
  ready", which points a funder at more research when the answer is procurement, a
  standard or a mandate.
- **Why it matters most.** It is the one item that would add to their map rather than
  correct ours, and the strongest answer if Convergent ask what to add next.
- **Needs David.** The definition.
- **Size.** Medium: a definition, a pass, and an audit.

### B4. A second pass on outcome sentences

- **Goal.** A blind second reading of the outcome on every gap.
- **Why.** Outcomes have had one labeler and no audit, except the publishing gap. They are
  in the export but not proposed, which is why this is not higher.
- **Size.** Medium.

### B5. Decompose composite gaps

- **Goal.** Gaps that bundle unrelated research programmes are split, or flagged.
- **Why.** One label cannot represent two programmes.
- **Needs David.** Splitting means writing gap records Convergent did not write, so the
  likely answer is to flag and propose, not to split. The earlier proposal is in git
  history.
- **Size.** Medium.

---

## C. Research beyond the current map

### C1. Proposed new gaps

- **Goal.** Gaps Convergent do not have, written in their format.
- **Why.** Two survived an adversarial check that tried to find them already covered or
  already funded; the plan's own floor was three to five.
- **Procedure.** `methodology/house-format.md`; reviewer mode B, which defaults to "this is
  already covered" and makes the proposal survive.
- **Needs David.** Whether more are wanted at all.
- **Size.** Medium per gap.

### C2. Indicators as a series

- **Goal.** The same quantity, from the same source, read on a schedule.
- **Why.** A single reading says where a gap is; a funder needs the slope. That is a
  maintained system rather than a research output.
- **Status.** Parked. Indicators are built for eight gaps, in the export, and not proposed.
- **Size.** Large, and ongoing.

---

## Not on this list, deliberately

- **Anything that ranks their gaps.** No score column exists, by design, and adding one is
  a different project. We may rank what we create.
- **Redesigning their interface or schema by shipping one.** Tasks A4, B2 and B3 imply new
  fields and say so; they are proposed as additions joined on their ids, never as edits to
  their data.

---

## In short

- **The highest-value task is the next critical path**, on a gap where AI might reach the
  binding step. Both existing chains returned the same answer, so the method has never
  shown it can return the opposite one. **David chooses the gap.**
- **The unlock for doing chains at scale is typing Convergent's 389 capability edges** —
  necessary, sufficient or partial. Today every chain reconstructs that by hand.
- **Two corrections wait on the existing chains**: the publishing chain still shows days
  on a cost axis, because it predates the cost field, and 5 of 15 steps read maturity as
  availability.
- **The cheapest label fix is dropping the "Proxy only" tier**, which failed its own audit
  at 78% disagreement.
- **Never on this list:** ranking their gaps, or redesigning their schema by shipping one.
