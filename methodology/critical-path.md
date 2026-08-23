# Critical path method

**Critical path**: the ordered sequence of steps whose duration sets the duration of
the whole project. Borrowed deliberately from project management, where it is
immediately legible to anyone who has built a facility, and where it carries the
argument for free: **one link sets the pace, so speeding up any other link changes
nothing.**

(Alternative name if a term David owns is preferred: *constraint chain*.)

## Method

Decompose the gap from question to result as an explicit ordered chain. For each link
record: what blocks it, which AI capability type touches it, at what maturity, and
whether it is binding.

Record the **expectation before doing the analysis**, in `critical_paths.expectation`.
A prediction written down in advance and then confirmed is evidence; the same
prediction written afterwards is a story. If the chain refutes the expectation, that
is a genuine and reportable result, and it gets reported.

Where a gap statement bundles several axes — cost, speed, inclusiveness — **pick one
axis, say which, and note the others are separate chains.** Chains that silently mix
axes produce a binding link that is an artifact of the mixing.

Two chains, chosen so the results differ: one where the binding links turn out to be
physical, one where they turn out to be institutional. A single chain shows the method
works; a pair shows it discriminates, which is the stronger claim. Doing this across
the whole map is the collaboration being proposed, not the thing being given away.

Render as a Mermaid DAG plus a link table, following the structure in
`ai-science-gap-map/methodology/causal-dag-template.md`: diagram, then "what the chain
reveals", then the table.

## Tone

Where a capability set does not touch the binding link, say so **as an observation
about the capability set, not as a deficiency**. The whole artifact is a contribution,
not a critique. "None of the three listed capabilities acts on the approval link" is
an observation. "They missed the real bottleneck" is a critique, and it loses the
reader in one sentence.
