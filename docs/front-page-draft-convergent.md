# Front page, proposed copy — Convergent voice

Same content and same claims as `front-page-draft.md`, rewritten against
`.claude/skills/writing-like-convergent`. Read this, mark it up, and I'll put it into
`app/src/app/page.jsx`.

Figures and components are marked in square brackets. Everything else is copy.

---

## Hook

# AI is accelerating science. The Gap Map should show where.

*Four attributes added to all 103 of your R&D gaps — plus one gap taken apart, step by
step, to see whether the attributes survive contact with a real one.*

You put 103 R&D gaps on one map and asked what needs building. Starting from your
2026-07-29 export, I added four attributes to every one of them: an outcome, the kind of
work standing in the way, how mature the AI for that work is, and how measurable the gap
is. Then I picked one gap and took it apart into seven steps, because four labels on 103
gaps is a taxonomy nobody has leaned on yet, and I wanted to watch one of them carry
weight.

The attributes held up. The decomposition also answered a question I couldn't put to the
labels on their own: where on this gap does the cost actually sit, and which of your 369
foundational capabilities reach it?

What I'd like from you is an argument about whether these are the right four attributes,
and a conversation about what a version of the map built for the next few years should
record. david@sendorai.com

---

## One gap, all the way down  `[Human-checked]`

*Doing and publishing research is expensive and subject to structural roadblocks.*

Four attributes, then seven steps. Everything in this section has been read against the
gap by a person — me.

> **The outcome I'd add to your gap**
>
> **Getting a result into the accepted, verified scientific record is cheap and quick.**

Your gap says what's wrong. An outcome says what's on the other side of it, which is the
version that recruits people to come and work on it, and it also settles what you'd
measure. Cheap and quick are countable. Accepted and verified is the part arXiv hasn't
solved in thirty-five years of driving the cost of dissemination to roughly zero.

My one-line label says the work in the way here is coordination and institutional.
Seven steps later the trace agrees, and it says where: the cost sits in finding
reviewers, agreeing what a review means, and getting institutions to count the
work. All three were named in the label's rationale before the decomposition existed —
though the same author wrote both, so treat that as a consistency check and not as an
independent test.

`[ChainMini: the seven-step publishing chain]`

> Cost, in reviewer and editor labor. Orange marks where the labor concentrates. AI acts
> on four of the seven steps, and on steps 3 and 4 it only reaches the tractable half:
> matching a reviewer to a paper, not persuading them to say yes.

Now here's the part that surprised me. Drafting used to be one of the most expensive
steps on this chain, measured in researcher-weeks per paper, and AI has taken a large
share of that cost straight out. Publishing didn't get any faster. Submissions rose 42%
after ChatGPT's release against the prior two-year window — in the one corpus where a
journal has published full figures — and the labor that the saving displaced landed
downstream, on volunteer editors doing desk screening.

> **So the speedup is real, and right now it's uncollectable.** Relieving a step upstream
> of where the cost concentrates just moves the cost along the chain; it doesn't remove
> it.
>
> Clear reviewer recruitment and you'd collect the recruitment saving *and* let those
> researcher-weeks of drafting finally show up in time-to-record. Which is exactly what
> makes the three steps AI doesn't reach worth more than they looked a year ago.

### Every step carries a measure, and they thin out exactly where you need them

Each step has one published quantity attached to it, so you can watch the constraint
move rather than argue about where it is. The first four steps have hard throughput
numbers — submissions, desk-rejection rates, invitations per accepted review, committee
disagreement. The three binding steps are where the measurement thins out, and the last
of them, getting the work counted, has no direct quantity at all — you're left with what
institutions declare and how researchers behave, which is the weakest evidence on the
chain sitting under the step that binds hardest.

[The chain, its measures, and the evidence →](/chains/)

There's a second gap traced the same way, *Frontier telescopes are expensive and take
decades to build*, and it lands somewhere completely different — none of your
capabilities touch a decision step there, where here half of them do. Two chains isn't a
pattern, but it's already two shapes!

---

## The same four attributes, on the other 102 gaps

One gap is a demonstration. The attributes are on all 103, so you can query the map by
them — and none of the other 102 have been read by a person. Each one is a model's
judgment, carrying a written rationale and a confident-or-guess flag on every row.
Treat this half like a first pass by something that has read your descriptions very
carefully and nothing else.

- **An outcome, on all 103 gaps.** `[AI only]`
  What becomes knowable or buildable if the gap closes. [How I wrote them](/attributes/#outcome)
- **The kind of work in the way, and how mature the AI for it is.** `[AI only]`
  Eight kinds of work, each with an AI analogue, each at working now, two-to-five years,
  or speculative. [What the eight are](/attributes/)
- **A measurability tier.** `[AI only]`
  Whether the gap has an agreed observable, only a proxy, a contested observable, or a
  quantity that's inherently counterfactual. [What the tiers are](/attributes/)
- **A progress indicator, on 8 gaps.** `[AI only]`
  The number you'd watch to know whether the gap is closing. On one of them a second
  search turned up nothing at all, and the null is recorded rather than quietly dropped.
  [All eight](/indicators/)
- **2 proposed gaps**, written in your house format. `[AI only]`
  The two that survived an adversarial check that went looking for the funded programme
  already building them. [Proposed gaps](/proposed/)

[Every gap, with its labels](/map/) · [What the attributes are, and how the map looks under them](/attributes/)

---

## What I'd like from you

- **Tell me which attributes are wrong** — the kinds of work most of all. That's the
  taxonomy I'm least sure about and the one everything else hangs off.
- **Chains across the whole map.** One chain is an anecdote, two is a coincidence. How
  often does the same binding step recur across fields? That's the question worth
  answering, and it needs all 103 of them.
- **Typed capability edges.** Nothing in the export marks a capability as necessary,
  sufficient, or partial for its gap, so the chain reconstructed that by hand. Typing
  those edges would make chains generatable — and it leads straight into the urgency and
  impact attributes you've said you already want.

One small thing while you're in there: `capabilities[].gaps` is empty for all 369
capabilities in the v1.0 export, though `schema.json` documents it as populated. Anyone
who starts from `capabilities.json` builds an empty graph and gets no error.

**david@sendorai.com.** The critical version of this feedback is the one I want most.

None of this is comprehensive and some of it is wrong. Every label outside the worked gap
is an AI judgment, and a second pass relabelled all 103 blind and disagreed often enough
to be worth publishing — the disagreement rates and the calls that could have gone the
other way are on the [method page](/method/), and what this still doesn't do is on
[what's missing](/missing/).

---

## Footer

David Sendor. I've spent 15+ years applying AI to hard problems in large organizations,
most recently leading Enterprise Data Science at Liberty Mutual. I'm moving into AI for
science, working on where the binding constraint goes when AI takes a chunk
out of the cognitive one — which, as the chain above shows, isn't the same as it going
away. [LinkedIn](https://www.linkedin.com/in/dsendor/) · david@sendorai.com

Built on the 2026-07-29 export of gap-map.org. Nothing here reorders or ranks your gaps,
and your data is unmodified. [CSV, keyed on your ids and slugs](/gap-map-augmented.csv) ·
[JSON](/data.json)
