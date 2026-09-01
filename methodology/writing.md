# How we write

Two rules, one idea: **lead with the answer, put the detail where someone who wants it
will find it.** This governs the artifact, every doc in `docs/`, and every reply to
David.

This file is about *structure*. For *voice* — how a page reads to a Convergent reader,
and how to keep it from reading as machine-written — use the
`writing-like-convergent` skill in `.claude/skills/`. They compose: the skill changes
the register, not what goes on which page.

## Progressive disclosure, everywhere, including to David

The shape:

1. **A TL;DR or a short bulleted list of the things to know, at the top.** Short
   enough to read in one pass and act on without scrolling.
2. **Detail below**, clearly separated, for whoever wants the reasoning.
3. **Never make someone read the working to find the conclusion.**

In practice:

- **Documents.** `docs/todo.md` is the model: bullets at the top saying what needs
  doing, a `# Detail` section at the bottom holding the why. If a doc has grown to the
  point where the first screen no longer says what matters, that is the signal to
  restructure it, not to add a summary paragraph on top of the sprawl.
- **Replies.** Open with what happened and what it means. Method, caveats, and the
  route taken go after. A reply that opens with what was tried is a reply about the
  agent.
- **Length is a decision, not a default.** More detail is not more rigour. Detail that
  nobody reads is worse than absent, because it hides the parts that matter.

## The argument page carries one claim; every other page carries the nuance

The front page is the only page most readers will finish. It exists so they can
repeat one claim to a colleague. It is not where the working is shown.

**One claim, stated once, about their map.** Not about this analysis, not about what
was tried, not about what failed to replicate. A reader should be able to say what
the finding is after one pass, without having read a caveat to understand it.

The shape to avoid, taken from the version that forced this rule: a section headed
*"What I found, and what did not survive"*, which opened with a striking result, spent
three paragraphs retracting it, diagnosed the definitional error behind it, and closed
with *"what survived is weaker"*. Every sentence in it was true. The page was still
about us, and a reader could not have said what the finding was.

Where each kind of content lives:

| Content | Home |
|---|---|
| The claim, and the few numbers that carry it | the argument page |
| Per-gap labels, confidence flags, detail | the extended map |
| How labels were made, agreement rates, audits | Method & audit |
| What was withdrawn, what is unreliable, what was not attempted | What's missing |

So:

1. **Lead with what their map looks like with the attributes added**, never with how
   the attributes were made.
2. **A caveat earns its place on the argument page only if it changes what the reader
   does with the claim.** Otherwise it belongs on Method or What's missing. One clear
   limitation beats four.
3. **Never narrate this analysis's own history on the front page.** "We found X, then
   it did not replicate" is a Method story. The front page says what is true now.
4. **Link, do not summarise.** One sentence and a link to the page holding the nuance
   beats a paragraph of hedging.
5. **The honest version is not the longest version.** Withdrawn findings stay
   withdrawn and stay documented — on What's missing, where a reader who wants them
   will go looking. Burying them there is not hiding them; putting them on the front
   page is not honesty, it is a failure to decide what the page is for.

## Failure modes, in order of how easily they happen here

1. **Burying the story in method.** A page that leads with how the labelling was
   audited is a page about us. They want to know what their map looks like with the
   attributes added. Lead with that.
2. **Shipping a number nobody sanity-checked.** See the sanity-check section of
   `methodology/audit-protocol.md`.
3. **Confessing at length.** One clear statement of a limitation beats four.
