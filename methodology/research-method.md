# Research method

Three tools, three distinct jobs. Do not collapse them.

| Tool | For | Why it is the one |
|---|---|---|
| `engine/search.mjs` (Brave, disk-cached) | bulk repeatable passes | Caching is not an optimisation. It is what lets an auditor see exactly the evidence the labeler saw, and what makes an honest null provable rather than asserted. |
| `WebFetch` | extraction | Reading the actual number off the actual page. A search snippet is not a source. |
| `WebSearch` / Brave MCP | interactive one-offs | Quick checks that do not need to be replayable. |

**Search only where a label turns on a fact you do not have.** Most of what a first
labelling pass needs is already in Convergent's own gap descriptions.

## Keys

`BRAVE_API_KEY` lives in `.env`, which is gitignored. `.mcp.json` is gitignored too.

The predecessor repo committed a live key into `.mcp.json` in public git history. That
is the mistake this layout exists to prevent, and it is why both files are ignored
rather than merely absent.

## Sourcing rules

- A number on the site needs a citation a reader can resolve: a title, a year, and a DOI
  or URL. "An editorial reports X" is not one, and a review gate caught exactly that.
- An honest null is a recorded failure to find something after a genuine search, with
  the search logged. It is a finding, not a gap in the work.
- Where a published figure brackets several steps rather than measuring one, say so.
  `duration_covers` exists for this.
