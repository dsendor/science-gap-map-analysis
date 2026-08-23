# Sub-agent brief: Labeler

You label ONE BATCH of gaps — normally one field — from the Convergent Research Gap
Map, and write a JSON file. You do not write to the database; the lead ingests your
file serially. This is the file-per-unit pattern from
`ai-science-gap-map/engine/ingest.mjs`, and it exists so parallel agents never
contend on a SQLite writer.

## Inputs
Field name, and the gap rows for that field (id, name, slug, description, linked
capability names). Read `methodology/taxonomy.md` before you start — every enum value
is a CHECK constraint and an invention is a hard write failure.

## Process

1. **Read the gap description carefully first.** Most of what you need is in their own
   text. Their descriptions often name the blocker explicitly — the telescope gap says
   "there needs to be the organizational structure and hunger to adopt such methods",
   which is an institutional link stated by the authors.
2. **Look at the linked capabilities.** What Convergent thinks would address the gap
   is strong evidence about where the gap actually binds — and where the capabilities
   cluster on one kind of link while the gap binds on another, that is a finding.
3. **Search only where the label turns on a fact you do not have** — typically the
   maturity call ("is autonomous experimentation actually working in this domain
   today?"). Use `node engine/search.mjs "query" --phase 1 --gap <id>`, which caches
   to disk and logs to `search_log` so the auditor sees the same evidence you did.
   Do not search to confirm what the description already tells you.
4. **Assign all three dimensions** with a one-line rationale each.
5. **Set confidence honestly.** `guess` is not a failure state — it is the mechanism
   that makes the artifact credible. A batch that is 100% `confident` will be assumed
   to be lying, and it probably is. Mark a guess a guess.

## Hard rules

- **Never modify their data.** You add labels. You do not fix their typos, retitle
  their gaps, reassign their fields, or reword their descriptions. `engine/verify-additive.mjs`
  will catch it and fail the build.
- **Never rank.** No "most important", no ordering, no priority. They deferred
  prioritisation deliberately and a stranger ranking their map is presumptuous.
- **Exactly one AI type per gap is primary.** A unique index enforces it.
- **Outcome is what becomes knowable or buildable**, not a restatement of the gap.
  If your outcome sentence is the gap description with "if this were solved" bolted
  on the front, it is not an outcome.

## Output

Write `research-log/labels/<field-slug>.json`:

```json
{
  "field": "Astrophysics",
  "labeled_by": "<model id>",
  "gaps": [
    {
      "gap_id": "1c1cb37e-...",
      "outcome": { "outcome": "...", "rationale": "...", "confidence": "confident" },
      "ai_types": [
        { "ai_type": "Physical build and manipulation", "maturity": "Speculative",
          "is_primary": 1, "rationale": "...", "confidence": "confident" },
        { "ai_type": "Design and optimization search", "maturity": "Working now",
          "is_primary": 0, "rationale": "...", "confidence": "confident" }
      ],
      "measurability": { "tier": "Directly measurable", "rationale": "...", "confidence": "confident" }
    }
  ],
  "notes": "anything the lead should know; taxonomy strain; gaps you could not label confidently"
}
```

Report back: counts by tier and by primary AI type, how many you marked `guess` and
why, and any gap where the taxonomy genuinely did not fit. **Taxonomy strain is a
finding, not a failure** — the brief explicitly invites revision if the data argues
for it. Say so rather than forcing a bad fit.
