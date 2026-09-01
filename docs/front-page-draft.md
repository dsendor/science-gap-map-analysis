# Front page, proposed copy

Run through `docs/check ai language.md`, plus the three cuts David approved on
2026-08-31 (the "surprise" sentence, the About-page opener, and the bio to the footer).
Read this, mark it up, and I will put it into `app/src/app/page.jsx`.

Figures and components are marked in square brackets. Everything else is copy.

---

## Hook

# AI is accelerating science. The Gap Map should show where.

You put 103 R&D gaps on one map and asked what needs building. I added four attributes
to every one of them: an outcome, the kind of work standing in the way, how mature the
AI for that work is, and how measurable the gap is. Then I took one gap apart step by
step to see whether the attributes survive contact with it.

They do. The decomposition also showed something a one-line label cannot: which step
the cost actually sits in, and which of your capabilities act on it.

What I would like is your feedback on whether these are the right attributes, and a
conversation about what a version of the map built for the next few years should
record. david@sendorai.com

---

## One gap, all the way down  `[Human-checked]`

*Doing and publishing research is expensive and subject to structural roadblocks.* Four
attributes, then seven steps. Everything in this section has been read against the gap
by a person. 

> **The outcome we would add to your gap**
>
> **Getting a result into the accepted, verified scientific record is cheap and quick.**

Your gap names what is wrong. The outcome names what is on the other side, which is the
version that recruits people to work on it. It also settles what to measure. Cheap and
quick are countable. Accepted and verified is the part arXiv has not solved in
thirty-five years of driving the cost of dissemination to nothing.

My one-line label says the work in the way is coordination and institutional. Seven
steps later the trace agrees, and says where: the cost sits in finding reviewers,
agreeing what a review means, and getting institutions to count the work. Those three
were named in the label's rationale before the decomposition existed. The same author
wrote both, so that is a consistency check rather than an independent test.

`[ChainMini: the seven-step publishing chain]`

> Cost, in reviewer and editor labor. Orange marks where the labor concentrates. AI acts
> on four of the seven steps, and on steps 3 and 4 it reaches only the tractable half:
> matching a reviewer to a paper, not persuading them to say yes.

Drafting was one of the most expensive steps here, measured in researcher weeks per
paper, and AI has taken a large share of that cost out. Publishing did not get cheaper.
Submissions rose 42% after ChatGPT's release against the prior two-year window, in the
one corpus where a journal has published full figures, and the labor the saving
displaced landed downstream on volunteer editors at desk screening.

> **The speedup is real and currently uncollectable.** Relieving a step upstream of
> where the cost concentrates moves the cost along; it does not remove it.
>
> Clearing reviewer recruitment now would return the recruitment saving and let the
> drafting speedup finally show up. That is what makes the steps AI does not reach worth
> more than they were.

### Every step carries a measure, and they thin out as the steps get more binding

Each step has one published quantity attached, so the constraint can be watched moving.
The first four have hard throughput numbers: submissions, desk-rejection rates,
invitations per accepted review, committee disagreement. The three binding steps are
where the measurement thins, and the last of them, getting the work counted, has no
direct quantity at all. Only what institutions declare, and how researchers behave. The
step that most needs a measure is the one with none.

[The chain, its measures, and the evidence →](/chains/)

A second gap, *Frontier telescopes are expensive and take decades to build*, is traced
the same way and lands somewhere different: there, none of your capabilities touches a
decision step, and here half of them do.

---

## The same four attributes, on the other 102 gaps

One gap is a demonstration. The attributes are on all 103, so the map can be queried by
them. None of these have been read by a person. Each is a model's judgment, with a
written rationale and a confidence flag on every row.

- **An outcome, on all 103 gaps.** `[AI only]`
  What becomes knowable or buildable if the gap closes. [How I wrote them](/attributes/#outcome)
- **The kind of work in the way, and how mature the AI for it is.** `[AI only]`
  Eight kinds of work, each with an AI analogue, each at working now, two-to-five years,
  or speculative. [What the eight are](/attributes/)
- **A measurability tier.** `[AI only]`
  Whether the gap has an agreed observable, only a proxy, a contested observable, or a
  quantity that is inherently counterfactual. [What the tiers are](/attributes/)
- **A progress indicator, on 8 gaps.** `[AI only]`
  The number you would watch to know whether the gap is closing. For one of them a
  second search found nothing, and the null is recorded rather than dropped.
  [All eight](/indicators/)
- **2 proposed gaps**, written in your house format. `[AI only]`
  The two that survived an adversarial check that tried to find the funded programme
  already building them. [Proposed gaps](/proposed/)

[Every gap, with its labels](/map/) · [What the attributes are, and how the map looks under them](/attributes/)

---

## What I would like

- **Tell me which attributes are wrong**, the kinds of work most of all.
- **Chains across the whole map.** The value is in counting how often the same binding
  step recurs across fields, and that needs all 103.
- **Typed capability edges.** Nothing marks a capability as necessary, sufficient, or
  partial for its gap, so the chain reconstructed that by hand. Typed edges would make
  chains generatable, and they lead straight to the urgency and impact attributes you
  already want.

`capabilities[].gaps` is empty for all 369 capabilities in the v1.0 export, though
`schema.json` documents it as populated. Anyone starting from `capabilities.json` builds
an empty graph and gets no error.

**david@sendorai.com.** The critical version of this feedback is the one I want most.

This is not comprehensive and some of it is wrong. Every label outside the worked gap is
an AI judgment, and a second pass relabelled all 103 blind and disagreed often enough to
be worth publishing. The disagreement rates and the calls that could have gone the other
way are on the [method page](/method/); what this still does not do is on
[what's missing](/missing/).

---

## Footer

David Sendor. I spent 15+ years applying AI to hard problems in large organizations,
most recently leading Enterprise Data Science at Liberty Mutual. I am moving into AI for
science, working on where the binding constraint goes as AI dissolves the cognitive
bottleneck. [LinkedIn](https://www.linkedin.com/in/dsendor/) · david@sendorai.com

Built on the 2026-07-29 export of gap-map.org. Nothing here reorders or ranks your gaps,
and your data is unmodified. [CSV, keyed on your ids and slugs](/gap-map-augmented.csv) ·
[JSON](/data.json)
