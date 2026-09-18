# Sub-agent brief: Chain builder

You build **one critical path** for **one gap** that David has chosen. You produce two
commits on a branch, and a report. You do not merge, deploy, or change the site.

The full procedure is `methodology/critical-path.md`. Read it, then
`methodology/chain-schema.md` and `methodology/research-method.md`, before you start.

## Inputs

- **The gap id**, chosen by David. If you were not given one, stop and ask; do not pick.
- **A worktree on its own branch**, from `node engine/worktree.mjs chain-<short-name>`.
- Optionally, **the axis kind** David wants: `time` or `cost`.

## What you do

1. Rebuild and preflight in the worktree. Read both existing chains in
   `research-log/critical-paths/chains.json`.
2. Read everything Convergent say about the gap, its capabilities, and their resources.
3. Choose one axis. The number you show on each step must measure it.
4. **Commit 1: the pre-registration.** Write
   `research-log/critical-paths/preregistered/<id>.json`, run
   `node engine/check-preregistration.mjs` on it, and commit it on its own, before
   writing any step. Make the expectation specific enough to be wrong.
5. Decompose into five to nine steps, each with one blocker.
6. Map each Convergent capability to the steps it acts on, by exact name.
7. Research every step: evidence for the blocker, and a cited quantity on the axis, or an
   honest null from at least six logged searches with a named near-miss.
8. Label `ai_acts`, `ai_type`, `maturity` (efficacy on this step), `confidence` on every
   step, and, on a cost chain only, `is_binding`.
9. Write the finding: claim first; whether the expectation held; what the capability set
   touches, as observation.
10. **Commit 2: the chain.** Write `research-log/critical-paths/<id>.json` with
    `status: "complete"`, or `"draft"` if any step is not yet researched. Export your
    searches, run `node engine/rebuild.mjs` until it passes, commit both, push the branch.

## Hard rules

- **Never edit the pre-registration** after committing it. If the chain contradicts it,
  that is a result: say so in `finding`.
- **Never modify Convergent's data** (`gm_*`, `data/baseline/`). `verify-additive.mjs`
  runs on every rebuild and fails the build.
- **Never rank their gaps**, and never describe a step as "the most important". State
  where the time or cost is, with the number.
- **Never fix the ingest to make your file pass.** Fix the file.
- **`reviewed` stays `"ai-only"`.** Only David sets `"human"`.
- **Every number has a citation that resolves**: title, year, DOI or URL.
- **A cost chain shows a cost.** Put the number in `cost_value` with a `cost_unit` you
  choose. `duration_days` is only for a step where elapsed time is a fair stand-in, and
  never on the same step as `cost_value`.
- **Capability coverage is an observation**, never an omission on their part.
- **Maturity asks whether applying AI would move this step**, not whether the technique
  exists. Read the step's blocker before choosing it.

## Report back

Keep it short, and lead with the answer:

- **The finding**, in two sentences, and whether the pre-registered expectation held.
- **The steps**, as a table: step, AI acts (and maturity), capabilities attached, the
  number and its coverage, or "null".
- **How many steps have no capability attached.**
- **Where the evidence is weakest**, one line per step that concerns you.
- **Any taxonomy or schema strain**: parallel tracks, a step that fits no kind of work,
  an axis you could not keep clean. Strain is a finding; say so rather than forcing a fit.
- **The branch name and both commit SHAs.**
