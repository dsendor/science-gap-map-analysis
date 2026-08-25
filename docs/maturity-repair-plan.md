# Plan: repair the maturity dimension

**For a third agent, on its own branch. Not the review-gate agent, and not the agent that
produced the labels.**

The review gates in `docs/review-gate-plan.md` are report-only by design. This is a repair
pass, so it must be separate work by a separate agent, or the two will contend for the
same files and the gates will end up reviewing changes made halfway through their own run.

---

## Before anything

```bash
git fetch
git checkout main && git pull
git checkout -b maturity-repair
node engine/preflight.mjs
node engine/rebuild.mjs        # must end "additive-only check passed"
```

**Work only on `maturity-repair`.** Do not push to `main`. Two sessions already collided
on one branch in this repo and cost a day; see the branching section of `CLAUDE.md`.

**Files you own:** `research-log/labels/*.json` (the `maturity` field only),
`research-log/maturity-repair/*`, `methodology/taxonomy.md`.
**Files you must not touch:** `research-log/reviews/*` (the review-gate agent owns those),
`research-log/indicators`, `research-log/new-gaps`, `research-log/critical-paths`, and
anything under `app/`.

## What went wrong

`Working now` is defined **per gap**: would applying this capability *move this gap*. The
independent relabelers read it as *does this capability exist*. The two readings coincide
for technical categories and come apart completely for institutional ones.

Adjudication then made it worse. The rule was "on disagreement, take v2, flag guess",
chosen so the author could not launder his own judgement. It is a rule that cannot be
wrong, so it removed every check on validity along with the bias. The availability reading
won 25 times in one direction, unopposed.

The result includes **"AI Could Be Misused" labelled `Coordination and institutional` /
`Working now`**, along with *Risks of Malicious Bioengineering* and *A Limited Set of
Rigid Organizational Structures*. Nobody believes those coordination problems are solved
today. v1 had all three at `2-5 years` or `Speculative` and was right.

## The definition, pinned

> **`Working now`** — a capability of this kind exists today *and applying it to this
> specific gap would move it now*. Both halves are required.
>
> **`2-5 years`** — the capability exists or is close, and applying it to this gap at the
> scale that would matter is not yet possible.
>
> **`Speculative`** — no clear path from what exists today to moving this gap.

The discriminating example, which belongs in `methodology/taxonomy.md` next to the
definition:

> Convening a standards body is available this afternoon. Getting universal DNA-synthesis
> screening adopted is not. Both are "coordination". Only the second is the gap.

Maturity describes **the gap**, not the technology. If your rationale would read the same
for any gap in that category, you have labelled the category and not the gap.

## The review set: 63 of 103, and why

The bug only ever pushes *toward* `Working now`. A gap both passes called `Speculative`
was never at risk. So:

| Set | n | Why |
|---|---:|---|
| Maturity disagreements | 40 | Adjudication took v2 blind on every one |
| Currently `Working now` | 39 | The claim the bug produces; both passes may share the reading |
| Union | **63** | The review set |

The 40 remaining gaps are `2-5 years` or `Speculative` in both passes. Spot-check ten of
them and stop if all ten hold.

Generate the worklist:

```bash
node -e "
const {DatabaseSync}=require('node:sqlite');
const db=new DatabaseSync('db/gapmap.sqlite');
const rows=db.prepare(\`
  SELECT g.id, g.name, g.description, t.ai_type, t.maturity, t.confidence,
         r.v1_maturity, r.v2_maturity, r.maturity_agreed, r.v2_rationale, t.rationale
  FROM gm_gaps g
  JOIN gap_ai_types t ON t.gap_id=g.id AND t.is_primary=1
  LEFT JOIN relabels r ON r.gap_id=g.id
  WHERE t.maturity='Working now' OR r.maturity_agreed=0\`).all();
require('fs').writeFileSync('research-log/maturity-repair/worklist.json', JSON.stringify(rows,null,2));
console.log(rows.length,'gaps to review');
"
```

## How to decide

For each gap, read **the gap description first**, then ask the pinned question: would
applying this kind of capability, today, move *this* gap. Read the existing rationales
last, so you form your own answer before seeing anyone else's.

**Decide it yourself when the answer is obvious.** Most of these are. You do not need a
human to tell you that the coordination problem around AI misuse is unsolved, that
alignment is unsolved, or that no institution has adopted universal synthesis screening.
Being unwilling to make an obvious call is its own failure mode; it buries the person
reviewing under decisions they should never have seen.

Worked examples of obvious:

- *AI Could Be Misused*, coordination. Deployment policy and evaluation regimes exist as
  mechanisms; none of them is in place at a scale that moves this gap. **Not working now.**
- *A Limited Set of Rigid Organizational Structures*, coordination. The map's only
  counterfactual-required gap. **Speculative**, and v1 had it right.
- *Proving Math Theorems*, LLM reasoning. Machine-assisted proof is in live use on
  research mathematics. **Working now**, and both passes agreed.

**Escalate only when the two readings genuinely diverge and a domain expert could go
either way.** The test is not "am I uncertain", it is "would two informed people
disagree, and does the answer change what the artifact claims".

Worked example of a genuine escalation:

- *Ephemeral Societal Data on Proprietary Platforms*, coordination, `Working now` in both
  passes. Archiving at scale is genuinely solved and deployed. The blocker is access
  rights and who funds preservation. Under the pinned definition this looks like `2-5
  years`, but unlike the AI-misuse case there is a real argument that the capability is
  applied and working today wherever permission exists. **Ask.**

## Escalations

Write them to `research-log/maturity-repair/escalations.md`, one block each, and keep it
short enough to read in one sitting. Aim for under ten. If you are escalating more than
fifteen, the threshold is wrong and you should re-read this section.

```markdown
### <gap name>
**Current:** <type> / <maturity>  ·  **v1:** <x>  ·  **v2:** <y>
**The gap says:** <one line, their words>
**Case for Working now:** <one or two sentences>
**Case for 2-5 years or Speculative:** <one or two sentences>
**Question for David:** <a single question with a yes/no or either/or answer>
```

Do not put your own recommendation in the block. Put it in
`research-log/maturity-repair/notes.md` if you want it recorded, so the question is read
before the answer.

## Applying the result

Maturity lives in `research-log/labels/*.json` under each gap's `ai_types` entries. Change
**only** the `maturity` field, and only on the primary unless a secondary is plainly wrong
in the same way.

For every gap you change, update its `rationale` so it states the per-gap test rather than
the category. And set `confidence`:

- `confident` — the pinned definition gives one clear answer.
- `guess` — you decided, and a reasonable person might differ.

Escalated gaps stay untouched until David answers.

Then:

```bash
node engine/rebuild.mjs        # must end "additive-only check passed"
node engine/audit-report.mjs
```

## What to hand back

1. `research-log/maturity-repair/escalations.md` — the questions for David.
2. `research-log/maturity-repair/report.md` — how many reviewed, how many changed, the
   direction of change, and the ten spot-checks.
3. A `decisions` entry in `research-log/decisions.json` recording that mechanical
   adjudication was replaced by adjudication on the merits for this dimension, with the
   reversal condition.
4. The branch pushed, unmerged, with a one-paragraph summary of what a reader of the
   artifact would now see differently.

**Do not regenerate the artifact under `app/`.** That is a separate track and it should
run once, after both this and the review gates have landed.

## What is out of scope

Type, outcome, and measurability tier. Type agreed on 77 of 103 across two independent
passes and is not implicated. If you find a type that is plainly wrong, record it in
`notes.md` and leave it.
