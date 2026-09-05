# Critical path method

- **`is_binding` means one thing: on a chain whose axis is cost, this step is where
  the labor concentrates.** The artifact renders it as *"carries the cost"*.
- **It is deliberately unset on every time chain.** On a strictly sequential chain,
  removing any step shortens the total, so a flag that marks some steps and not others
  has no discriminating power there.
- **On a time chain, say the arithmetic instead.** "AI acts on 9.5 of the 32.5 years"
  needs no vocabulary and cannot be circular.
- **The textbook meaning needs parallel paths.** Neither of our two chains has any.
  If a future chain does, `is_binding` recovers its classic sense and this file needs
  a third case.
- Currently set on 3 of 15 steps: publishing steps 3, 4 and 7. Chain 1 has it cleared
  throughout.

---

# Detail

## What the word was supposed to mean, and why it stopped working

The method was borrowed from project management, where **critical path** means the
sequence of steps whose duration sets the duration of the whole project, and where the
argument comes for free: *one link sets the pace, so speeding up any other link changes
nothing.*

That sentence is true of a project **network** — a graph with parallel branches, where
work on one branch runs alongside work on another. The path through the network with
no slack is the critical one. Steps off it can absorb delay without moving the finish
date, which is exactly what makes "binding" informative.

Both chains we actually built are **strictly sequential**. The science case precedes
the ranking, which precedes the funding, which precedes fabrication. Nothing runs
alongside anything. In a serial chain there is no slack anywhere, every step is on the
critical path, and the total is just the sum. Marking four of eight steps "binding"
therefore claimed a distinction the structure does not contain.

Worse, on the telescope chain the marked set turned out to be **exactly the set of
steps no AI capability acts on**. So the finding "22 of the 32.5 years sit in the
binding steps" was restating its own labelling. That is the circularity, and it is why
the flag came off chain 1 entirely.

## The three cases

| Chain shape | Does `is_binding` mean anything? | What to write instead |
|---|---|---|
| **Time, with parallel paths** | Yes, the textbook sense: this step is on the longest path and has no slack. | Use it, and say which paths run in parallel. |
| **Time, strictly sequential** | No. Every step adds to the total. | Arithmetic. "AI acts on 9.5 of the 32.5 years. Zero all of it and a telescope still takes 23." |
| **Cost** | Yes, in a different sense: this is where the labor concentrates. | Use it. Say "carries the cost", never "binding". |

The cost sense and the time sense are different claims wearing one word. Cost is
additive rather than sequential: three steps carrying most of the labor is a statement
about **distribution**, not about slack or ordering. Keeping the same column for both
is a convenience, and the price of that convenience is this file.

## Setting the flag

Set `is_binding = 1` when **the axis is cost and this step accounts for a
disproportionate share of it**, with evidence in `evidence` or `figure` saying so.
Three of the seven publishing steps qualify:

- **Reviewer recruitment and matching** — roughly five invitations per accepted review;
  55% of 139 surveyed editors call recruitment a significant challenge.
- **Review judgment** — 23% committee disagreement, about half the accept list changing
  on a rerun.
- **Credit and legitimacy** — no published quantity, and the blocker is what committees
  agree to count.

Leave it `0` on any time chain unless that chain has genuine parallel structure. If it
does, record which steps run alongside which, because the reader cannot infer
parallelism from an ordered list.

`is_binding` and `ai_acts` are independent and are meant to be. Publishing step 3 is
both: AI can match a reviewer to a paper, and recruitment still carries cost, because
the half AI reaches is matching and the half that binds is willingness. A step being
one is no evidence about the other, and the moment the two sets coincide, suspect the
labelling rather than the world.

## How the artifact renders it

`Chain.jsx` and `ChainMini.jsx` show *"carries the cost"* when
`is_binding && duration_years == null`, and colour a step by `ai_acts` alone.

**Known weakness.** The `duration_years == null` test is a proxy for "this is a cost
chain". A cost chain that happened to carry durations would silently render the wrong
label, and a time chain with a stray `is_binding` would render nothing at all rather
than failing. An explicit axis field on `critical_paths` would be the honest fix. It is
not worth a schema change for two chains; it is worth one before a third.

## Everything else about building a chain

Decompose the gap from question to result as an explicit ordered chain. For each step
record what blocks it, which kind of work is in the way, at what maturity, whether a
current AI capability acts on it, and which of Convergent's own capabilities for that
gap touch it.

Record the **expectation before doing the analysis**, in `critical_paths.expectation`,
and commit it separately. A prediction written down in advance and then confirmed is
evidence; the same prediction written afterwards is a story. If the chain refutes the
expectation, that is a genuine and reportable result, and it gets reported.

Where a gap statement bundles several axes — cost, speed, inclusiveness — **pick one
axis, say which, and note the others are separate chains** in `axes_excluded`. Chains
that silently mix axes produce a cost concentration that is an artifact of the mixing.

Two chains, chosen so the results differ: one measured in elapsed time, one in labor
cost. A single chain shows the method works; a pair shows it discriminates, which is
the stronger claim. Doing this across the whole map is the collaboration being
proposed, not the thing being given away.

Render as step cards plus a table: diagram, then what the chain reveals, then the
per-step detail. The Mermaid source ships alongside for anyone who wants to paste a
chain elsewhere, and is not the render path.

## Tone

Where a capability set does not touch a step, say so **as an observation about the
capability set, not as a deficiency**. The whole artifact is a contribution, not a
critique. "None of the three listed capabilities acts on the approval step" is an
observation. "They missed the real bottleneck" is a critique, and it loses the reader
in one sentence.
