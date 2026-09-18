# Chain file format

**The exact format of a critical-path file, as enforced by
`engine/ingest-critical-paths.mjs`.** When this file and the ingest disagree, the ingest
is right and this file needs fixing. The procedure that produces the file is
`methodology/critical-path.md`.

## TL;DR

- **One chain per file:** `research-log/critical-paths/<id>.json`, containing
  `{ "paths": [ … ] }`. The pre-registration lives beside it in `preregistered/<id>.json`.
- **Run `node engine/rebuild.mjs` to validate.** It lists every problem at once and
  writes nothing until the file is clean.
- **Use stored names for `ai_type`**, not the names the site displays. A display name is
  rejected with the stored name to use instead.
- **Time chains use `duration_years`; cost chains use `duration_days`.** A number in the
  other field would never be displayed, so it is rejected.
- **Capability names must be attached to the gap, spelled exactly.** Get them from
  `engine/check-preregistration.mjs`.
- **Unknown fields are errors**, so a typo like `durations_years` cannot vanish quietly.
- **New chains need `status` and a `confidence` on every step.** `status: "draft"` keeps a
  partly researched chain out of the public data.
- **A cost chain has no numeric cost field yet.** Money goes in `figure`, as words.

---

## Path fields

| Field | Required | Type | Rules |
|---|---|---|---|
| `id` | yes | string | `path-lowercase-words`, unique. Must match the pre-registration file name. |
| `gap_id` | yes | string | A gap id from the baseline. **Matches the pre-registration.** |
| `title` | yes | string | What the chain answers, as a sentence. |
| `axis` | yes | string | The single quantity measured. **Matches the pre-registration.** |
| `axis_kind` | yes | `"time"` \| `"cost"` | No default. **Matches the pre-registration.** |
| `axes_excluded` | yes | string | The other axes the gap bundles, and why they are separate. **Matches the pre-registration.** |
| `expectation` | yes | string | The prediction. **Matches the pre-registration exactly.** |
| `finding` | no | string | Claim first. Paragraphs separated by a blank line; only the first shows by default. |
| `duration_basis` | no | string | Time chains: whose milestone record the durations come from, and how overlaps were handled. |
| `programmes` | no | array | Time chains comparing several programmes. See the telescope chain for the shape. |
| `reviewed` | no | `"ai-only"` \| `"human"` | Defaults to `"ai-only"`. **Only David sets `"human"`.** |
| `status` | yes | `"draft"` \| `"complete"` | A draft validates but is never exported. The two original chains are `complete` without the field. |
| `links` | yes | array | The steps, in order. At least one. |

## Step fields

| Field | Required | Type | Rules |
|---|---|---|---|
| `seq` | yes | integer | 1, 2, 3… in order, no gaps. |
| `link` | yes | string | The step's name: what happens. |
| `blocker` | yes | string | What holds this step up. The first sentence is shown on the site, so make it stand alone. |
| `rationale` | yes | string | Why the labels on this step are what they are. |
| `ai_acts` | yes | boolean | Does a current AI capability act on this step at all? |
| `confidence` | yes | `"confident"` \| `"guess"` | On every step of a new chain. Not required on the two originals. |
| `ai_type` | no | stored name | The kind of work in the way at this step. See the table below. |
| `maturity` | no | `"Working now"` \| `"2-5 years"` \| `"Speculative"` | Would applying that AI move *this step*? |
| `is_binding` | no | `0` \| `1` | **Cost chains only.** 1 when this step carries a disproportionate share of the cost. Rejected on time chains. |
| `capabilities` | no | array of strings | Names of Convergent capabilities attached to the gap that act on this step, as printed by `engine/check-preregistration.mjs`. Matched ignoring whitespace, because some stored names contain hidden line breaks; the exact stored name is what is saved. `[]` is a real answer. |
| `evidence` | if a number is present | string | The source: title, year, DOI or URL. Required whenever the step carries a duration or a `figure`. |
| `figure` | no | string | A published quantity for the step, in words with its unit, when it is not a duration. **On a cost chain, this is where money and labor figures go**, because there is no numeric cost field yet. |
| `duration_years` | time chains | number | Elapsed years for this step. |
| `duration_span` | no | string | The two milestones the years are measured between, e.g. `"1989 → 1996"`. |
| `duration_note` | no | string | How the interval was chosen. |
| `duration_days` | cost chains | number | Elapsed days, where a published figure exists. |
| `duration_span_note` | no | string | Shown under the number: what the figure measures, or why there is none. |
| `duration_covers` | when the step carries a duration | array of integers | The steps this figure measures, starting with this one, consecutive. `[3]` for a figure on step 3 alone; `[2,3,4,5]` for one figure covering four steps. |

**Legacy names.** `duration_jwst_years` and `duration_jwst_span` are accepted because the
telescope chain uses them. New chains use `duration_years` and `duration_span`.

**Top-level keys.** Only `paths` is read. The original `chains.json` also has `phase` and
`note`, which are ignored.

**Spans only work for durations.** `duration_covers` needs a `duration_years` or
`duration_days` on the same step, so a money figure that covers several steps cannot be
drawn as a span yet. Say which steps it covers in the `figure` text.

## `ai_type`: stored names

| Stored — use this in the file | Displayed on the site |
|---|---|
| `LLM reasoning and synthesis` | Reading and synthesis |
| `ML surrogates and prediction` | Prediction and modeling |
| `Design and optimization search` | Design search |
| `Sensing and signal processing` | Measurement and sensing |
| `Autonomous experimentation` | Running experiments |
| `Real-time control of physical systems` | Real-time control |
| `Physical build and manipulation` | Physical build |
| `Coordination and institutional` | Coordination and institutions |

Definitions and discriminating examples: `methodology/taxonomy.md`.

## Rules the ingest checks

- No unknown fields, on paths or steps.
- New chains have `status`, and `confidence` on every step.
- A pre-registration exists for every chain except the two originals, and the five
  registered fields match it exactly.
- `seq` runs 1..n in order.
- `ai_type` and `maturity` are allowed values.
- Every capability name is attached to the gap.
- `is_binding` is never 1 on a time chain.
- A time chain carries no `duration_days`; a cost chain carries no `duration_years`.
- A step with a duration or a `figure` has `evidence`.
- `duration_covers` starts at its own step, is consecutive, stays within the chain, sits
  on a step that has a number, and never covers a step twice.

What it cannot check, and review must: whether the evidence says what the step claims,
whether maturity was read as efficacy, and whether the prediction was specific enough to
be wrong.

---

## A minimal time chain

```json
{
  "paths": [
    {
      "id": "path-example-time",
      "gap_id": "<gap id>",
      "title": "From design study to first result: what sets the elapsed time",
      "axis": "Elapsed time from design study to first result",
      "axis_kind": "time",
      "axes_excluded": "Construction cost, which runs over a different set of steps.",
      "expectation": "<copied exactly from preregistered/path-example-time.json>",
      "finding": "The claim, in one paragraph.\n\nThe working, in the paragraphs after it.",
      "duration_basis": "Whose milestone record, and how overlapping phases were handled.",
      "reviewed": "ai-only",
      "status": "complete",
      "links": [
        {
          "seq": 1,
          "link": "Design study",
          "blocker": "What actually holds this step up, as one sentence.",
          "ai_acts": true,
          "ai_type": "Design and optimization search",
          "maturity": "Working now",
          "confidence": "confident",
          "capabilities": ["<exact capability name>"],
          "duration_years": 4,
          "duration_span": "2000 → 2004",
          "duration_covers": [1],
          "evidence": "Title, year, and DOI or URL of the milestone record.",
          "rationale": "Why these labels, including why maturity is efficacy on this step."
        }
      ]
    }
  ]
}
```

## A cost chain step with a span, and a step with no figure

```json
{
  "seq": 2,
  "link": "Submission and desk screening",
  "blocker": "Editor triage time.",
  "ai_acts": true,
  "ai_type": "LLM reasoning and synthesis",
  "maturity": "Working now",
  "confidence": "confident",
  "is_binding": 0,
  "capabilities": [],
  "duration_days": 119,
  "duration_covers": [2, 3, 4, 5],
  "duration_span_note": "Submission to acceptance, covering steps 2 to 5 together. Not a measurement of screening alone.",
  "evidence": "Title, year, and DOI or URL.",
  "rationale": "…"
},
{
  "seq": 7,
  "link": "Credit and legitimacy",
  "blocker": "Hiring, tenure and funding committees decide what counts.",
  "ai_acts": false,
  "ai_type": "Coordination and institutional",
  "maturity": "Speculative",
  "confidence": "guess",
  "is_binding": 1,
  "capabilities": ["<exact capability name>"],
  "duration_span_note": "No published figure, and probably not measurable.",
  "evidence": "What the searches found, and that no quantity exists.",
  "rationale": "…"
}
```

Steps 3 to 5 in that chain carry no duration and no `duration_covers`; the site draws the
119-day figure once, across all four rows.
