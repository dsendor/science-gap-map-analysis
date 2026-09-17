# Sub-agent brief: Reviewer

Checks anything that is not a label: an indicator, a proposed gap, a critical path, or
the finished artifact. Labels have their own blind relabel, in
`methodology/audit-protocol.md`; that design needs a second agent doing the same job so
agreement can be counted, and these outputs do not produce anything to count. Each gets
the check its failure mode deserves.

| Mode | Reviews | Use when |
|---|---|---|
| A | a progress indicator | a number is claimed to track a gap |
| B | a proposed new gap | a gap is proposed in Convergent's format |
| **C** | **a critical path** | **a chain is ready, before David reads it** |
| D | the finished artifact | before anything is published |

Modes A, B and D were written for the original run and still name its phases.

The principle carries over unchanged: **the reviewer must not be the producer, and
must not see the producer's reasoning before forming its own.** A review that starts
from the answer measures nothing.

Report what you find. Do not fix it. Fixing and judging in the same pass produces
agreement by construction — this is the same rule as `methodology/audit-protocol.md`,
and it is the reason the Phase 2 numbers meant anything.

---

## Mode A — Phase 3, indicator verification

The failure mode is a number that is real-looking but wrong, or a null that was
asserted rather than earned.

For each row in `gap_indicators`:

1. **Re-fetch the source yourself** from `source_url`. Do not trust `source_title`.
2. Confirm the exact `current_value` appears on that page, and that it means what
   `quantity` says it means. A number that appears but measures something adjacent is
   a failure, and the most likely one.
3. Check `as_of` against the source's own date. A 2019 figure presented as current is
   a failure.
4. Check `target_value` has a real `target_basis` — a roadmap commitment, a programme
   goal, a physical limit. An invented round number is a failure.
5. Verdict per row: `confirmed` / `wrong-value` / `wrong-quantity` / `stale` /
   `source-unreachable` / `unsupported-target`.

**For every `is_null_result = 1` row, run your own search independently.** Read the
gap description, then search for an indicator without looking at the queries the
producer ran. Only after you have finished and failed, read their `search_log` entries.

- If you also find nothing, the null is corroborated and becomes much stronger — that
  is the single most persuasive row in the artifact.
- **If you find a usable indicator they missed, say so loudly.** A false null is worse
  than a missing number, because the artifact makes a claim about it.

## Mode B — Phase 4, adversarial novelty check

The failure mode is proposing a gap Convergent already has, or one that is already
funded and under construction. Both are fatal to the artifact's credibility, and the
producer has every incentive to conclude its own gap is novel.

**Your job is to refute novelty, not to confirm it.** Default to "this is already
covered" and make the producer's case survive you.

1. Grep the full export yourself, with your own search terms, not theirs. Search
   `capabilities` as well as `gaps` — a gap of ours may be covered by an existing
   capability under a different heading.
2. Search for funded work: FRO listings, active programmes, roadmaps, recent
   announcements. Use WebFetch, not search snippets.
3. Verdict per new gap: `novel` / `covered-by-existing-gap` / `covered-by-existing-capability`
   / `already-funded`, with the specific record or programme named.

Then check both of Marblestone's tests are genuinely met, not merely asserted:

- **Productive tension**: is there real debate about near-term feasibility, or has the
  producer manufactured a controversy? Name who is on each side.
- **Downstream unlock**: does closing this gap actually knock over other dominoes, or
  only the one?

### The house-format test

Run `node engine/make-format-test.mjs`, which writes a shuffled mix of real Convergent
gap descriptions and our proposed ones with all identifying markers stripped.

**Identify which are not Convergent's, and give a confidence for each.** Then compare
against `research-log/format-test-key.json`.

- Score at or near chance → the format matches and they can be dropped straight in.
- Reliably picking ours out → the format does not match. Report *what gave them away*:
  length, hedging, vocabulary, sentence shape, presence of numbers. That is directly
  actionable.

## Mode C — reviewing a critical path

The failure mode is a chain whose conclusion was chosen rather than found: steps
decomposed to suit the argument, a maturity read as "the technique exists", a figure that
measures something next to the step, or a prediction written after the fact. Review one
chain at a time. You did not build it, and you do not read the builder's report before
forming your own view.

1. **Confirm the prediction came first.** The chain's
   `research-log/critical-paths/preregistered/<id>.json` must be in an earlier commit than
   `research-log/critical-paths/<id>.json`. Check with
   `git log --follow --format='%h %ad %s' -- <file>` on both. The ingest already enforces
   that the fields match; you check the order.
2. **Argue that the time or cost sits somewhere else.** Take the strongest case you can
   for at least two other steps, using the same evidence. If you can make a serious case,
   the finding is not established.
3. **Re-fetch every figure** from its cited source. Confirm the number appears, that it
   measures what the step claims rather than something adjacent, its date, and its scope.
   Verdict per step: `confirmed` / `wrong-value` / `measures-something-else` / `stale` /
   `unreachable`.
4. **Check every null independently.** Search for a quantity yourself before reading the
   builder's searches in `research-log/searches/`. If you find one they missed, say so
   loudly: a false null is worse than a missing number.
5. **Check maturity as efficacy.** For each step marked `Working now` or `2-5 years`, read
   the blocker and ask whether applying that AI would actually shorten or cheapen this
   step. Flag every step where the label describes the technique rather than the step.
6. **Check the axis.** One axis; the displayed number measures it; the excluded axes are
   named; no evidence about one axis is used to support a claim about another.
7. **Check the capability mapping.** For each capability, read its description and decide
   yourself which steps it acts on. Compare with the file. Disagreements on a step with
   zero capabilities matter most, because that is usually the chain's main result.
8. **Check the tone.** Every sentence about Convergent's capability set must read as
   observation. Flag any sentence a reader at Convergent would take as being told they
   missed something.
9. **Check for circularity.** If the steps AI reaches and the steps carrying the cost are
   exactly complementary, say so; the labels may be restating each other.

Report per chain: the findings above, each with the step, the evidence, and a severity
(`blocks-publishing` / `should-fix` / `note`). Do not edit the chain.

## Mode D — Phase 6, completeness and constraint check

The failure mode is a findings document that outruns its data.

1. **Every quantitative claim in `docs/findings.md` and the cover note must trace to a
   row in the database.** List any that do not. This is the check that catches a
   confident sentence written from memory.
2. **Hunt for ranking.** The brief forbids it, and it re-enters through the side door:
   a default sort order, a "top" list, a chart ordered by magnitude that reads as
   priority, a colour scale from good to bad. Flag every instance.
3. **Confirm `guess` labels are visually distinct** in the rendered artifact, not merely
   present in the data. Open the built page and look.
4. Confirm the stated limitations are present and not softened: outcomes not modeled as
   an entity, indicators are a sample, labels are AI judgments with a published
   disagreement rate, capability edges untyped upstream.
5. Confirm the 3ie figures were verified or cut, and that no unverified external claim
   survives into the cover note.
6. **Ask what is missing**: which claim went unverified, which source unread, which
   phase's acceptance criteria were quietly skipped.

---

## Output

Write `research-log/reviews/phase-<n>.json`:

```json
{
  "phase": 3,
  "mode": "A",
  "reviewed_by": "<model id>",
  "findings": [
    { "target": "<gap id, new gap id, chain id, or claim>",
      "verdict": "<from the mode's verdict set>",
      "evidence": "what you checked and what you found",
      "severity": "blocking | should-fix | note" }
  ],
  "summary": "what you would tell the producer in three sentences"
}
```

`blocking` means the artifact should not go out with this in it. Use it for a wrong
number, a false null, a non-novel new gap, or an unsupported claim in the cover note.
Be willing to use it. A reviewer that never blocks is not reviewing.
