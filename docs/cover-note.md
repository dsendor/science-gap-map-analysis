# Cover note — draft, not sent

**Status: draft.** External communication is David's. Nothing here has been sent to
anyone at Convergent Research.

Written through `.claude/skills/writing-like-convergent`. The page carries the argument,
the caveats and the ask, so this is deliberately short: its only job is to get the link
opened.

---

To: gapmap@convergentresearch.org
Subject: Your Gap Map, with one gap taken apart into the seven steps it runs through

Hi —

I've built something on top of the v1.0 export that I'd like you to shoot at. It's at
**[link]**. Your data is untouched, the additions live in separate tables, and
everything's keyed on your own ids and slugs so it joins straight back.

Here's what started it. I keep trying to work out where AI actually accelerates science,
and I kept landing on questions your map had already framed better than I had. But a
one-line gap statement can't tell you which part of the gap is the expensive part. So
which step is the money actually in?

To find out I took *Doing and publishing research is expensive and subject to structural
roadblocks* apart into the seven steps it runs through, from a finished draft to a
credited contribution, and did the same for frontier telescopes on elapsed time. Two
things fell out, and the second is from your data rather than from any label of mine.

The first is that AI reaches four of those seven publishing steps, which is more than
I'd expected, and it reaches the tractable half of each. It'll match a reviewer to a
paper and it won't make that reviewer say yes.

The second is the one I'd point you at. Map your own four foundational capabilities for
that gap onto the seven steps and they cluster on the last two. Four of the seven have
nothing attached at all, and one of those four is reviewer recruitment, where editors
are now sending 4.5 invitations for every accepted review, nearly double the 2018 rate.
On the telescope gap it's the same shape: your three capabilities act on fabrication,
integration and launch, and nothing acts on the science case, the strategic ranking, or
funding authorisation - which on JWST's record is where most of the 32.5 years sit.

The two chains also turn out to run through the same step. Telescope time and facility
approval are allocated by peer review of proposals, and a decadal survey is a review
panel in the same way a time allocation committee is. ESO's own account of why they
moved to Distributed Peer Review is that "it has become progressively harder to find
scientists willing to serve in the panels and in the OPC". Two gaps, two fields, one
blocker - and your export has one row per gap with nowhere to record that.

Fair warning on scope, in your own spirit: one gap has been read line by line by a
person and the other 102 are a model's first pass, labelled that way throughout. It's a
probe, not a survey!

One thing worth knowing either way. `capabilities[].gaps` is empty for all 369
capabilities in the v1.0 export, though `schema.json` documents it as populated. All 389
edges are on the gap side only, so anyone starting from `capabilities.json` builds an
empty graph and gets no error at any point. Two capability records are also missing the
`description` your schema marks required, and six resources are referenced by no
capability.

What I'd like is the critical version of your reaction, and one question in particular:
is decomposing gaps into steps worth doing across the map? Typed capability edges would
make that mapping derivable instead of manual, and they sit right next to the urgency
and impact attributes you've said you'd like to add.

David Sendor
david@sendorai.com

---

## Notes for David, not for sending

- **Every number is regenerated from the database**: 103, 7 steps, 4 of 7 with no
  capability, 4.5 invitations, 32.5 years, 369, 389, 2, 6, and the 2026-07-29 snapshot.
- **What was cut from the previous draft, and why.** The old note led on "not one gap has
  physical build as a working-now primary capability, all 17 sit at two-to-five years or
  speculative, against 60% working-now for LLM reasoning and synthesis." Both halves are
  wrong against the settled database: physical build is 8 gaps, one of them working now,
  and reading and synthesis is 5 of 10 rather than 60%. The gradient it rested on was
  withdrawn after the blind relabel failed to reproduce it. It also described four
  attributes and four proposed gaps; there are now two of each.
- **The 3ie comparison stays cut.** Their own blog posts disagree with each other about
  the portal totals by a factor of three, and neither their gap maps page nor the
  Snilstveit working paper uses the absolute-gap versus synthesis-gap terms. If a 3ie
  comparison is ever wanted, quote their page directly and drop the numbers.
- **Aaron Tohuvavohu** is verified twice: as resource
  `1c3cb37e-2a00-80a1-8ddf-fb19d0b8b0ee` (type Individual) cited by the capability "Space
  Telescope Factory", which is attached to the telescope gap; and by name in the
  acknowledgments on gap-map.org/about. A named person already associated with one of the
  two worked gaps, if a warm entry point is wanted.
- **Who to send to.** `gapmap@convergentresearch.org` is the address on their About page
  for questions and suggestions. `sarah@convergentresearch.org` is listed separately for
  funders, which is a different conversation and probably the wrong door for this.
