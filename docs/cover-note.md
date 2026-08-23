# Cover note — draft, not sent

**Status: draft.** External communication is David's. Nothing here has been sent to
anyone at Convergent Research.

The page now carries the argument, the caveats and the ask, so this is deliberately
short: its only job is to get the link opened.

---

To: gapmap@convergentresearch.org
Subject: An extended version of the Gap Map, and a hypothesis I'd like you to shoot at

Hi —

I've been trying to work out where AI can most accelerate science, and I kept landing
on questions your Gap Map had already framed better than I had.

One hypothesis I keep coming back to: as AI clears the cognitive bottlenecks in
research, the bottlenecks that are left don't stay the same size — they become *the*
constraint, and more visibly so. The software version is familiar: writing code got
cheap, and now everyone's time goes into code review. Science has the same shape and a
harder version of it, because most of what's left is fabrication, funding, approval and
agreement rather than thinking.

If that's right it has a funding consequence, so rather than send you a suggestion I
spent a few days testing it against your data. I added four attributes to all 103 of
your gaps — a stated outcome, an AI capability type and maturity, a measurability tier,
and a progress indicator for a sample of eight — plus four proposed gaps and two worked
critical paths.

**[link]**

The short version of what came out: not one gap in the map has physical build and
manipulation as a working-now primary capability. All 17 sit at two-to-five years or
speculative, against 60% working-now for LLM reasoning and synthesis. And two gaps in
two different fields — a space telescope and research publishing — turn out to share a
binding link, which is peer review of proposals, evidenced by ESO's own account of why
they moved to Distributed Peer Review.

Two caveats up front. It isn't comprehensive, and parts of it are probably wrong: it
was produced quickly and mostly by AI, and no human has reviewed the labels. The
disagreement rates from a blind second pass are on the page, including the one category
of my own that failed its own audit. Your data is untouched — the additions live in
separate tables and the baseline is diffed against a hash-pinned copy of your
2026-07-29 export on every build.

Also, one thing worth knowing regardless: `capabilities[].gaps` is empty for all 369
capabilities in the v1.0 export, though `schema.json` documents it as populated. All 389
edges are on the gap side only, so anyone starting from `capabilities.json` builds an
empty graph and gets no error. Two capability records are missing the `description` your
schema marks required, and six resources are referenced by no capability.

What I'd like is your feedback — particularly the critical version. The capability
taxonomy is the part I'd most like torn apart. And I'd like to talk about whether a
future version of the map should be built for a world where the cognitive work is cheap:
chains across all 103 gaps so a recurring bottleneck can be counted rather than noticed,
typed capability edges, and outcomes as a real entity rather than a text field.

Your About page says you're open to partners interested in meta analyses and new tools
that make the data more actionable, and that you hope to add attributes for urgency and
impact. That's what this is aiming at.

David Sendor
david@sendorai.com

---

## Notes for David, not for sending

- **Numbers in the email are regenerated from the database**, not typed in: 103 / 17 /
  60% / 369 / 389 / 6 / 2, and the 2026-07-29 snapshot date.
- **Three figures from the original brief were cut, not softened.** The 3ie comparison —
  roughly 42 evidence gap maps, a Development Evidence Portal at roughly 21,800 impact
  evaluations and 1,700 systematic reviews, and the absolute-gap versus synthesis-gap
  distinction — did not survive verification. 3ie's own blog posts disagree with each
  other about the portal totals by a factor of three, their gap maps page states no
  total, and neither that page nor the Snilstveit working paper uses those two terms.
  The substance of the distinction *is* on their page — gaps are where "few or no impact
  evaluations or systematic reviews exist" versus "where there is a concentration of
  impact evaluations but no recent high-quality systematic review" — so if a 3ie
  comparison is wanted later, that quote is the defensible version and the numbers are
  not.
- **Aaron Tohuvavohu** is verified twice: as resource
  `1c3cb37e-2a00-80a1-8ddf-fb19d0b8b0ee` (type Individual) cited by the capability "Space
  Telescope Factory", which is attached to the telescope gap; and by name in the
  acknowledgments on gap-map.org/about. If a first conversation needs a warm entry point,
  there is a named person already associated with the gap the page leads on.
- **Who to send to.** `gapmap@convergentresearch.org` is the address on their About page
  for questions and suggestions. `sarah@convergentresearch.org` is listed separately for
  funders, which is a different conversation and probably the wrong door for this.
