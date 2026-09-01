# AI is accelerating science. The Gap Map should show where.

You put 103 R&D gaps on one map and asked what needs building. I labelled all of them
for what kind of work stands in the way and whether AI reaches it, then took one gap
apart step by step. The step-by-step version is the part worth your time. It says which
step the cost actually sits in, where AI stops, and which steps none of your
capabilities touch. A one-line label on a whole gap cannot say any of that.

**Decomposing gaps into their steps is the thing I think your map most needs next.**
Here is one gap done that way, so you can judge whether it is worth doing to the other
102. david@sendorai.com

---

## One gap, all the way down `[Human-checked]`

*Doing and publishing research is expensive and subject to structural roadblocks.*
Everything in this section has been read against the gap by a person. Nothing else on
this site has.

> A chain has to be a path to something. This one runs to:
>
> **Getting a result into the accepted, verified scientific record is cheap and quick.**
>
> Your gap statement bundles cost, speed and inclusiveness. Picking one is what makes
> the steps orderable, and the other two are named and left as separate chains.

My one-line label says the work in the way is coordination and institutional. Seven
steps later the trace agrees, and says where: the cost sits in finding reviewers,
agreeing what a review means, and getting institutions to count the work. Those three
were named in the label's rationale before the decomposition existed. The same author
wrote both, so that is a consistency check rather than an independent test.

`[Chain diagram: the seven-step publishing chain, with a capability count on each step]`

> Cost, in reviewer and editor labor. Orange marks where the labor concentrates. AI acts
> on four of the seven steps, and on steps 3 and 4 it reaches only the tractable half:
> matching a reviewer to a paper, not persuading them to say yes.

Drafting was one of the most expensive steps here, measured in researcher weeks per
paper, and AI has taken a large share of that cost out. Publishing did not get cheaper.
Submissions rose 42% after ChatGPT's release against the prior two-year window, in the
one corpus where a journal has published full figures, and the labor the saving
displaced landed downstream on volunteer editors at desk screening.

> **Four of the seven steps have no capability of yours attached to them, including
> reviewer recruitment, where the labor actually concentrates.** Your four capabilities
> for this gap act on the last two steps and on review judgment. That count comes from
> your data, not from any label of mine.
>
> It is the same shape on the telescope gap. Your three capabilities there act on design
> maturation, fabrication, integration and launch. Nothing acts on the first three steps,
> and the first three steps are where most of the years are.
> [Both chains, step by step, with the evidence →](/chains/)

---

## On all 103 gaps

One gap is a demonstration. The label is on the whole map, so it can be queried: **what
kind of work stands in the way, and whether AI reaches it**. Eight kinds of work, each at
working now, two-to-five years, or speculative. `[AI only]` None of the 103 has been read
by a person. Each is a model's judgment, with a written rationale and a confidence flag.

[Every gap, with its label](/map/) · [The eight kinds of work, and where the label breaks](/attributes/) · [2 proposed gaps](/proposed/)

---

## What I would like

- **Critical paths across the map.** The value is in counting how often the same binding
  step recurs across fields, and in seeing which steps have no capability on them. That
  needs more than two.
- **Typed capability edges.** Nothing marks a capability as necessary, sufficient, or
  partial for its gap, so both chains reconstructed that by hand. Typed edges would make
  the step mapping derivable instead of manual.
- **Tell me which labels are wrong**, the kinds of work most of all.

`capabilities[].gaps` is empty for all 369 capabilities in the v1.0 export, though
`schema.json` documents it as populated. Anyone starting from `capabilities.json` builds
an empty graph and gets no error.

**david@sendorai.com.** The critical version of this feedback is the one I want most.

This is not comprehensive and some of it is wrong. Every label outside the worked gap is
an AI judgment, and a second pass relabelled all 103 blind and disagreed often enough to
be worth publishing. The disagreement rates are on the [method page](/method/); what this
does not do is on [what's missing](/missing/).

---

## Footer

David Sendor. I spent 15+ years applying AI to hard problems in large organizations, most
recently leading Enterprise Data Science at Liberty Mutual. I am moving into AI for
science, working on where the binding constraint goes as AI dissolves the cognitive
bottleneck. [LinkedIn](https://www.linkedin.com/in/dsendor/) · david@sendorai.com

Built on the 2026-07-29 export of gap-map.org. Nothing here reorders or ranks your gaps,
and your data is unmodified. [CSV, keyed on your ids and slugs](/gap-map-augmented.csv) ·
[JSON](/data.json)
