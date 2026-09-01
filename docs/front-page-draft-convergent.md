# AI is accelerating science. The Gap Map should show where.

*One of your gaps taken apart into the seven steps it actually runs through, and an
AI-reach label on all 103.*

I've spent a while inside the 2026-07-29 export and built two things on top of it that
you can poke at right now. One is a label on every gap saying what kind of work is in
the way and whether AI gets there. The other is a single gap broken all the way down
into the ordered steps that have to happen, with a number on each one. Everything's
keyed on your own ids and slugs, the CSV and the JSON are there to download, and none
of your data has been touched.

The second thing is why I'm writing. A one-line label on a gap the size of "doing and
publishing research is expensive" can't tell you which part of it is expensive. So which
step is the money actually in? You can't answer that without breaking the gap into
steps - and once I did, something fell out of your own data that I hadn't expected.

Treat this the way you ask people to treat the map itself: one gap done properly, 102
done quickly, and a probe rather than a survey!

---

## One gap, all the way down

*Doing and publishing research is expensive and subject to structural roadblocks*,
traced from a finished draft to a credited contribution. Seven steps. This is the one
section a person has read line by line against the gap; everything else on the site is
a model's first pass and is labelled that way.

A chain has to be a path to *something*, and your gap statement bundles three of them -
cost, speed, and who can afford to take part. I picked cost, said so, and left the other
two as separate chains. So the end of this one is: getting a result into the accepted,
verified scientific record is cheap and quick.

My one-line label for the gap said the work in the way was coordination and
institutional. Seven steps later the trace agreed and got specific: the cost sits in
finding reviewers, in agreeing what a review means, and in getting institutions to count
the work. Those three were written into the label's rationale before the decomposition
existed, which is a nice result and not an independent one - I wrote both, so treat it
as a consistency check.

`[Chain diagram: seven steps, with a capability count on each]`

AI reaches four of those seven steps, which is more than I'd expected going in. It
reaches the tractable half of each, though: it'll match a reviewer to a paper, and it
won't make that reviewer say yes.

Drafting used to eat researcher-weeks per paper and AI has taken a large share of that
out, which is a real saving and a big one. Publishing didn't get cheaper. In the one
journal with a published five-year full-submission corpus, submissions rose 42% after
ChatGPT's release against the prior two-year window, and the load that came off the
authors landed a step downstream on volunteer editors doing desk screening.

Then the part that comes out of your data rather than out of any label of mine. Open
this gap on your own site and you'll find four foundational capabilities hanging off it.
Map those four onto the seven steps and they cluster hard: two on credit and legitimacy,
three on dissemination, one on review judgment. Four of the seven steps have nothing
attached at all - and one of those four is reviewer recruitment, where editors are now
sending 4.5 invitations for every accepted review, nearly double the 2018 rate.

It's the same shape on the telescope gap. Your three capabilities there act on design
maturation, fabrication, integration and launch. Nothing acts on the first three steps,
which are the science case, the concept studies and ranking, and funding authorisation -
and on JWST's record those first three steps are where most of the 32.5 years sit.

That's the step-level finding, and I don't think there's another way to get at it.

[Both chains, step by step, with the evidence and the sources →](/chains/)

---

## The label, on all 103

One gap is a demonstration, so the other attribute runs across the whole map and you can
query it. Eight kinds of work - reading and synthesis, prediction and modeling, design
search, measurement and sensing, running experiments, real-time control, physical build,
and coordination and institutions - each carrying whether the AI for it works now, is two
to five years out, or is speculative.

Every one of those 103 is a model's judgment with a written rationale and a confidence
flag, and no person has read them. A second pass relabelled all 103 blind and disagreed
often enough that publishing the disagreement rate seemed more useful than hiding it.

[Every gap, with its label](/map/) · [The eight kinds of work, and where the label breaks](/attributes/) · [2 proposed gaps, in your house format](/proposed/)

---

## What I'd like from you

The step-level view is the thing I'd most like your reaction to, and there are three
specific ways you could tell me I'm wrong.

Critical paths across the whole map, not two. The value isn't in any single chain, it's
in counting how often the same step recurs as the binding one across twenty fields, and
in seeing which steps come up empty of capabilities again and again. Two chains can
suggest that; they can't establish it.

Typed capability edges. Nothing in the export marks a capability as necessary,
sufficient, or partial for its gap, so both chains reconstructed that by hand, one
capability at a time. If you typed the edges, the step mapping stops being manual and
starts being derivable - and it lands right next to the urgency and impact attributes
you've said you want to add.

And tell me which labels are wrong. The kinds of work most of all, since that's the one
running across all 103.

One thing you'll want to know either way: `capabilities[].gaps` is empty for all 369
capabilities in the v1.0 export, even though `schema.json` documents it as populated.
Anyone who starts from `capabilities.json` builds an empty graph and gets no error at
any point.

**david@sendorai.com** - and the critical version of this is the one I want most.

---

## Footer

David Sendor. I spent 15+ years applying AI to hard problems in large organizations,
most recently leading Enterprise Data Science at Liberty Mutual. I'm moving into AI for
science, and what I'm chasing is where the binding constraint goes as AI dissolves the
cognitive bottleneck. [LinkedIn](https://www.linkedin.com/in/dsendor/) ·
david@sendorai.com

Built on the 2026-07-29 export of gap-map.org. Nothing here reorders or ranks your gaps,
and your data is unmodified. [CSV, keyed on your ids and slugs](/gap-map-augmented.csv) ·
[JSON](/data.json)
