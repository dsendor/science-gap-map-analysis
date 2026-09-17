# Research method

**How to find, check, cite and save the evidence behind a label or a chain step.** Every
rule below exists because this project broke it once.

## TL;DR

- **Search, then fetch, then cite.** A search snippet is never a source; read the number
  off the page you fetched.
- **A citation must resolve:** title, year, and a DOI or URL. "An editorial reports X" is
  not a citation.
- **Check the number measures what the step claims**, not something next to it. That is
  the most likely error, and it has happened here.
- **An honest null needs six genuine searches and a named near-miss.** A null is a
  finding, not a gap in the work.
- **Save your searches before you rebuild**: `node engine/export-searches.mjs <name>`.
  Otherwise they are deleted.
- **Search only where the answer turns on a fact you do not have.** Convergent's own text
  answers most questions for free.

---

## The three tools

| Tool | For | Why it is the one |
|---|---|---|
| `node engine/search.mjs "query" --phase <name> --gap <id>` | Every search that supports a label or a step | Cached to `research-cache/` and logged to `search_log`, so a reviewer can see exactly what you saw, and a null can be proved rather than asserted. |
| `WebFetch` | Reading the actual page | The number, the date and the definition are on the page, not in the snippet. |
| `WebSearch` / Brave MCP | Orientation you will not rely on | Not logged, so never the basis for a claim. |

Use one `--phase` name for the whole piece of work, such as `chain-accelerators`, so the
export in step 6 collects it cleanly.

## The loop, for each question

1. **Write the question first.** "How many years from design study to construction
   approval, for a comparable accelerator?", not "accelerator timeline".
2. **Check Convergent's text.** The gap description, the capability descriptions, and the
   resources behind them. It often answers the question.
3. **Search with `engine/search.mjs`.** Several phrasings. Prefer primary records:
   milestone pages, program reviews, published datasets, peer-reviewed studies.
4. **Fetch the source and read the number off it.** Check three things:
   - **It measures what the step claims.** The publishing chain once attributed a 42% rise
     in submissions to reviewer recruitment; the source put the extra load on desk
     screening. The number was right and the attribution was wrong, which is harder to
     catch than a wrong number.
   - **Its date.** A 2019 figure is not current.
   - **Its scope.** One journal, one field, one country. Say so where the figure is used.
5. **Cite it** in the step's `evidence`: title, year, DOI or URL, and the sample where it
   matters, e.g. "~7,000 manuscripts".
6. **Save the searches** before any rebuild:

   ```bash
   node engine/export-searches.mjs chain-accelerators --phase chain-accelerators
   ```

   This writes `research-log/searches/<name>.json` with every query and its result
   titles and URLs. Commit it with the work. Rebuild restores it into `search_log`.
   Without this step, the evidence behind the work disappears on the next rebuild.

## Where sources rank

1. **Primary records.** Mission milestone pages, program reviews, agency reports,
   official datasets.
2. **Peer-reviewed studies**, especially systematic reviews with a stated sample.
3. **Editorials and surveys by the institution being measured**, which are often the only
   source for internal figures. Name the institution and the sample.
4. **Reputable secondary reporting**, only to find a primary source.
5. **Never:** an unsourced blog figure, a snippet, or a number from memory.

## Figures that cover several steps

Published data rarely lines up with the steps. A median time from submission to
acceptance covers screening, reviewer recruitment, review and the decision together.
**Record it once, on the first step it covers, with `duration_covers` listing the steps.**
Never divide it among them to make each step look measured. The site draws it as one
figure across those rows, which is the truthful picture.

## Honest nulls

A null says "a genuine search found no usable quantity", and it is often the most
important row: on the publishing chain, the step that most needs a measure is the one
with none. To count as genuine:

- **At least six distinct searches**, logged, from different angles: the direct quantity,
  proxies for it, the institutions that would publish it, and the terms a practitioner
  would use.
- **Name the closest near-miss** and say why it does not measure the step. The Phase 3
  nulls did this — a real, improving bound that nobody agrees settles anything; a burden
  figure that measures a symptom rather than the step itself.
- **Record the null in the file**, in `duration_span_note` or `evidence`, so a reader
  sees it rather than a blank.

## Research for gap labels

When labeling a gap's kind of work and maturity, most of the answer is already in the
gap description. Search only for the maturity call, and ask the efficacy question:
**would applying this AI move this gap now?** Whether the technique exists is a different
question, and confusing the two has already produced labels that were consistent,
adjudicated and absurd. See `methodology/taxonomy.md` and `methodology/audit-protocol.md`.

## Traps in the tooling

- **Rate limiting.** Brave's free tier allows about one query per second. `search.mjs`
  waits between calls; do not work around it. A rate-limited response can look like an
  empty result, and an empty result would corrupt a null.
- **`--fresh` bypasses the cache.** Use it only when a source may have changed, because it
  breaks the guarantee that a reviewer sees what you saw.
- **Rebuild deletes `search_log`** and restores it only from `research-log/searches/`.
  Export first.

## Keys

`BRAVE_API_KEY` lives in `.env`, which is gitignored; `.mcp.json` is gitignored too.
`engine/worktree.mjs` copies `.env` into new worktrees. The predecessor repo committed a
live key into `.mcp.json` in public git history, and this layout exists to make that
impossible here.
