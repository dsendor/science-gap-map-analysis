# What this doesn't do yet

**Status: a list of open work, not a roadmap and not a request.** Nothing here has been
built. Published on the site as *What's missing* (`/missing/`), which renders the same list
with its numbers read live out of the artifact data rather than typed in.

It is written down so the limits of this contribution are legible, and so that if
Convergent want any of it, the case and the cost are already stated.

The augmentation adds four things to the Gap Map: an outcome per gap, an AI capability
type and maturity per gap, a measurability tier per gap, and two worked critical paths.
Every one of those four has a known edge, and four of the items below come from the
augmentation failing its own audit rather than from wishing it were bigger. That is the
useful kind of future work.

Ordered by what would add the most, not by what would be easiest.

---

## 1. Critical paths across the whole map, not two

**What is missing.** Two chains, hand-built, out of 103 gaps. They exist to demonstrate
something a catalogue structurally cannot show — that two gaps in different fields can
share a binding link, so bottlenecks recur across fields and can be counted. Two chains
prove the shape exists. They do not tell you where else it occurs.

**What blocks it, and it is one thing.** Capability-to-gap edges are untyped. Nothing in
the source data marks a capability as *necessary*, *sufficient*, or *partial* for the gap
it hangs under, so there is no way to compute a path — a chain needs to know which links
are load-bearing. Both existing chains had their link semantics reconstructed by hand,
which is why there are two.

**The unlock is mechanical.** Type the 389 capability edges. One pass, one added column,
no schema redesign, and it changes chains from illustrations somebody authored into
something the data yields. This is the single highest-value item on this list, and the
cheapest of the top three.

## 2. A `5-10 years` maturity value, and splitting the two questions it conflates

**What is wrong.** Maturity has three values and the middle one is doing most of the
work — a bucket holding half the map is barely a label. Worse, the three values are not
on one axis. `Speculative` means *no clear path from here*, which is a claim about kind.
`2-5 years` is a claim about time. A gap with a perfectly clear path that simply takes
fifteen years has nowhere to go, and currently lands in the middle bucket next to things
that are nearly here.

**Why it is not fixed here.** Adding a fourth value means re-reviewing every gap already
in the middle bucket, because a value nobody has applied to the whole set is worse than
three honest ones — the existing rows would silently mean "2-5 or 5-10, unexamined". That
is a full labelling pass with a blind second reader, on the scale of the v2 relabel.

**What it should probably be instead of one more bucket.** Two fields: how long, and
whether a path is known. They are different questions and the current three values answer
them at the same time.

## 3. Blocked on adoption, or blocked on capability

**The observation.** Repairing the maturity dimension turned up eleven gaps where the
reason the label is not `Working now` has nothing to do with whether the technique exists.
DNA-synthesis screening works and is not adopted. Web-scale archiving works and permission
is withheld. Adaptive platform trials work, have run since 2010, and the field has not
taken them up.

**Why it matters more than it sounds.** Maturity absorbs all of that and reports it as
*not ready*, and *not ready* sends a funder toward more research. For an unadopted
capability, more research is the wrong intervention — the answer is procurement, a
standard, a mandate, or somebody paying for a thing nobody is billed for. A single flag
distinguishing the two would change what the map recommends for a fifth of its rows.

**Status.** This is the one item on the list that would be a genuine addition to the map
rather than a correction to the augmentation, and it is the strongest candidate if
Convergent ask what to add next. It needs its own definition, its own pass and its own
audit, which is why it is not here.

## 4. Indicators as coverage, and as a series rather than a reading

**What exists.** A sample of eleven gaps across all four measurability tiers, two of them
honest nulls, every non-null value read off a page that was actually fetched. It is
explicitly not coverage and must not be extrapolated to the other ninety-two.

**Two separate pieces of work, and the second is the valuable one.** Coverage means an
indicator for every directly-measurable gap. But a one-time reading only says where a gap
is. What a funder needs is the slope, and a slope needs the same quantity read off the
same source on a schedule. That is a maintained system rather than a research output, and
it is the difference between a map and a dashboard.

## 5. Outcomes as a first-class entity

Outcomes are stored as one sentence on the gap. They are not one-to-one with gaps: there
are almost certainly more outcomes than gaps, and a single capability unlocks outcomes
across several fields. Modelling them properly means a join table and a schema change,
which is not something a stranger should propose by doing it. Named as a limitation from
the start, and still the cleanest example of the augmentation's structure being simpler
than the thing it describes.

## 6. Three measurability tiers, not four

`Proxy only` failed its own blind audit at 78% disagreement, against 0% for
`Directly measurable`, and every auditor independently reported it was the nearest
alternative and almost never the winner. If a measurability attribute is adopted, three
tiers would work better than four. This is a correction, not an expansion, and it is the
cheapest item on the list.

## 7. Decomposing composite gaps

Some gap statements bundle several unrelated research programmes under one heading, and a
single tier and a single AI type cannot represent them. Written up in full, with the two
distinct patterns and a worked proposal, in `docs/decomposition-proposal.md`. Not applied,
because splitting them means authoring gap records Convergent did not write.

## 8. Urgency and impact, if they ever want them

The augmentation has no score column anywhere, by design: Convergent deferred
prioritisation deliberately and a stranger ranking their map would be presumptuous. But
the reason to build a gap map at all is eventually to choose, and urgency and impact
attributes are the honest name for what a reader is doing in their head anyway. This is
listed because it is the obvious next attribute and because refusing to build it was a
decision rather than an oversight. It is theirs to make, not ours.

## 9. Coverage

103 gaps is not the field. Convergent say so plainly and repeatedly. The four proposed
gaps in this contribution demonstrate a method for adding one — near-duplicate checked
against every existing gap and capability, funding-checked, written to their format — they
are not a survey. Extending coverage is the largest item here and the least suited to
being done from outside.

---

## What is deliberately not on this list

**Anything that ranks.** No numeric score column exists in the schema and adding one is
not future work, it is a different project.

**Any redesign of their interface or their schema.** Items 3 and 5 imply new columns and
say so; proposing a redesign by shipping one is how a contribution turns into a rewrite of
somebody else's map.
