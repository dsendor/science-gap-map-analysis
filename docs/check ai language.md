## When to use

David says "check for AI language" or "AI language check" and provides a page URL (or is looking at a page).

## What to do

Scan the page content for the patterns listed below. For each instance found, add a **page discussion comment** (using `addCommentToDiscussion` with the page URL) that:

- Quotes the offending text
- Names the pattern
- Suggests a rewrite or says "consider removing"

After scanning, report back in chat with a count of how many instances were flagged and which patterns appeared.

## Severity

Patterns are ranked by how much they bother David. **High severity** patterns should almost always be flagged. **Medium severity** patterns should be flagged when they stack up or feel forced. **Low severity** patterns are contextual and should only be flagged when overused.

### High severity

1. **Contrast** — Three forms, all high severity:
    1. *Contrastive reframe*: "It's not X, it's Y" / "It's not just X, it's Y." Flag every instance unless the contrast is genuinely surprising or corrects a real misconception.
    2. *Contrast against an earlier version*: "no longer," "previously," "this supersedes," "this replaces," "X is explicitly not proposed," "the earlier framing." The document narrates its own edit history.
    3. *Contrast against a conversation*: a rejected option negated in the document even though it was only ever raised in chat — "NOT the raw CD index," "not an attack on any funder," "rather than X."
    
    Test for forms 2 and 3: would a first-time reader with no history know what is being contrasted against? If no, flag it and rewrite the section stating only the current answer.
    
2. **Em dashes** — Flag em dashes used where commas or parentheses would be more natural. (Already in Agent Bill's style rules.)

### Medium severity

1. **Templated intros** — "In today's fast-paced world..." / "As the landscape continues to evolve..." / "Now more than ever..." / "In a world where..." Flag and suggest deleting or rewriting with a specific opening.
2. **Rhetorical question + immediate answer** — "What does this mean? It means..." / "The goal?" / "The result?" Flag when the question adds no suspense or value.
3. **Inflated symbolism** — "stands as a testament" / "plays a vital role" / "leaves a lasting impact" / "watershed moment" / "deeply rooted." Flag and suggest stating the actual impact plainly.
4. **Superficial -ing analysis** — Trailing gerund phrases that simulate insight: "...improving convenience" / "...highlighting the importance of" / "...ensuring a seamless experience" / "...reflecting a broader trend." Flag and suggest cutting or rewriting with a concrete claim.
5. **Red flag words (stacking)** — Individual uses of unlock, transform, revolutionize, leverage, robust, seamless, comprehensive, cutting-edge, delve, foster, utilize, unprecedented, etc. Flag only when 3+ appear in the same paragraph or section.
6. **Faux-conversational phrases** — "Let's dive in" / "Let's break it down" / "Let's face it" / "Here's the thing" / "Here's the uncomfortable truth." Flag when they feel forced rather than genuinely conversational.
7. **Promotional tone** — Language that reads like marketing copy when neutral description is appropriate: "rich cultural heritage" / "stunning" / "enduring legacy" / "must-visit." Flag and suggest neutral alternatives.
8. **Repetitive structural templates** — "[Problem]? Meet [solution]." / "X is more than just Y. It's Z." / "Do X, so you can Y." Flag when the template is doing the work instead of the content.

### Low severity

1. **Triplet series** — Three parallel items stacked for rhythm. Only flag when they appear frequently in the same piece or feel artificially constructed. These are often fine.
2. **Vague attribution (weasel wording)** — "Industry reports suggest..." / "Some critics argue..." / "Research shows..." without a link or source. Flag and ask for a specific citation or suggest removing the claim.
3. **Bullet points with bold title + restatement** — Where the bold label just restates what follows. Flag when the pattern repeats across multiple bullets.
4. **Excessive boldface** — Too much bolding in a predictable pattern (e.g., every key term bolded). Flag when it creates a visual pattern readers associate with AI.

## How to flag

For each finding, post one comment on the page with this format:

**[Pattern name]** — "[quoted text]" → [suggestion]

Group nearby instances into a single comment when they're in the same paragraph. Don't create dozens of separate comments.

## After flagging

Summarize in chat:

- Total instances found
- Breakdown by pattern
- Which high-severity patterns appeared
- A one-line assessment: e.g., "Clean" / "A few flags, mostly low severity" / "Heavy AI fingerprint, recommend a rewrite pass"