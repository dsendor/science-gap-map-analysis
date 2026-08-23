# Convergent's house format

New gaps must read as though Convergent wrote them, so they can be dropped straight
in. The format below is derived empirically from all 103 gap descriptions in the
2026-07-29 export, not guessed at — regenerate the statistics with
`node engine/integrity-report.mjs` if the export changes.

## Shape

- **Name**: title case, a declarative statement of the problem, not a question and
  not a solution. "Frontier Telescopes Are Expensive and Take Decades to Build."
  Names assert the difficulty; they do not propose the fix.
- **Description**: 12–192 words, median 38, interquartile 26–59. Aim for 30–60. A
  400-word essay is instantly foreign to the corpus.
- **Slug**: lowercase, hyphenated, derived from the name.
- **Structure**, the dominant pattern: state the current limitation, then state what
  is needed. Frequently one or two sentences of each. Their telescope gap does exactly
  this, and closes on the institutional clause — "and there needs to be the
  organizational structure and hunger to adopt such methods."

## Voice

- Flat, declarative, unhedged about the problem; hedged about the solution.
- No citations inline. No numbers unless load-bearing.
- Names the class of approach that would help, never a specific vendor or lab.
- No urgency language, no "critical", no "urgent". They deliberately declined to
  prioritise; matching that restraint is part of matching the voice.

## Both tests must pass, and be recorded

From Marblestone's *A Beginner's Guide to Scientific Roadmapping*:

- **Downstream-unlock test.** Judge the gap by what it unlocks: if you knock over this
  one scientific domino, how many others fall downstream? Not by how intrinsically
  interesting the domino is.
- **Productive tension test.** Worth roadmapping when there is wide agreement the goal
  would be transformative *plus* genuine debate about near-term feasibility. No debate
  means it is either already funded or nobody believes in it.

Their design criterion for a technical roadmap also asks whether success is
unambiguously measurable — which quietly filters out exactly the unmeasurable gaps.
That is itself one of the findings this work expects to surface, so a new gap in tier
3 or 4 should say so plainly rather than dress itself up as tier 1.

## Before drafting anything

Grep the full export for near-duplicates and record the result in `new_gaps.dedup_check`:
what was searched, what came closest, why the new gap is distinct. Then confirm against
current roadmaps that the gap is not already funded and under construction, and record
that in `new_gaps.funding_check`. A "new" gap that turns out to be an FRO already in
flight is the single most embarrassing possible failure mode for this artifact.
