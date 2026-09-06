# Plan: run the review gates on phases 3–6

**Status: not run.** Written for a separate agent to execute. The producer of phases 3–6
must not be the reviewer, which is why this is a plan rather than a set of results.

## Why this exists

`docs/local-agent-plan.md` requires a mandatory independent review gate on every phase
from 3 onward, with the reviewer spec in `agents/reviewer.md`. Those gates were added to
the plan on 2026-08-23 at 08:47. The session that executed phases 3–6 had cloned the
repository at Phase 2 and never fetched, so it ran a superseded copy of the plan and
**none of the four gates were run.** Everything in phases 3–6 is therefore unreviewed by
anything except its own author.

That is the gap this plan closes. It is not a re-run of the phases; it is the check that
should have happened alongside them.

## The rule that makes it worth doing

From `agents/reviewer.md`, and it is the whole design:

> the reviewer must not be the producer, and must not see the producer's reasoning
> before forming its own. A review that starts from the answer measures nothing.

> Report what you find. Do not fix it.

So: four separate agents, one per mode. Each forms its own view first, reads the
producer's reasoning second, reports, and changes nothing. A fifth agent, or a human,
acts on the reports.

## Branch, and the other agent

```bash
git fetch
git checkout main && git pull
git checkout -b review-gates
```

**Work only on `review-gates`.** A separate agent is repairing the maturity dimension on
`maturity-repair` at the same time (`docs/maturity-repair-plan.md`). It owns
`research-log/labels/*.json`, `research-log/maturity-repair/*` and
`methodology/taxonomy.md`. You own `research-log/reviews/*`. Do not write to its files and
do not merge to `main`.

Gate D will find maturity numbers that are wrong. They are already known wrong and are
being fixed on that branch; note them and move on rather than re-deriving them.

## Preconditions

```bash
git fetch && git status          # confirm no unmerged remote work
node engine/preflight.mjs        # node, database, additive guardrail, Brave key, real network
node engine/rebuild.mjs          # must end "additive-only check passed"
```

`preflight.mjs` matters here specifically: it treats HTTP 401/403/407 as *blocked* rather
than reachable. A naive check reports arXiv as reachable behind an egress proxy, which is
exactly the false green that lets an indicator review pass without ever fetching a source.

## The four gates

### Gate A — Phase 3, indicators. Highest value; run first.

Eight rows in `gap_indicators`, six with a number and two nulls.

The reviewer re-fetches every `source_url` itself, confirms the exact `current_value`
appears on that page and measures what `quantity` claims, checks `as_of` against the
source's own date, and checks every `target_value` has a real `target_basis`.

**The part that has never been done at all:** for each of the two `is_null_result = 1`
rows, the reviewer runs its own independent search *before* reading the producer's
`search_log`. Both nulls are load-bearing in the artifact. If a second searcher also finds
nothing, they become the strongest rows on the site. If a usable indicator was missed, the
artifact currently makes a false claim and must be corrected before anything ships.

Two rows are known-weak going in and should not be graded generously: the silicon gate
pitch, whose value comes from conference reporting rather than a primary disclosure, and
the retraction rate, whose source is a preprint.

### Gate B — Phase 4, proposed gaps. Adversarial novelty.

Four rows in `new_gaps`. The reviewer tries to *defeat* each one: find the Convergent gap
or capability it duplicates, or the funded programme already building it. It also applies
the house-format test independently.

Two of the four declare their funding check as "not clear" already. The reviewer's job is
to find the third and fourth.

### Gate C — Phase 5, chains. Adversarial.

Two chains. The failure mode named in the spec is a chain whose binding link was chosen
because it suits the thesis.

One instance of exactly that has already been found and fixed without a gate: chain 1
originally marked four of eight steps "binding", and the set turned out to be precisely
the steps AI does not touch — circular, and in a strictly sequential chain every step
adds to the total anyway. The flags were cleared and the claim restated as arithmetic. The
reviewer should assume more of this remains, and should check chain 2's cost concentration
with the same suspicion.

It should also re-derive the per-step JWST durations from the published milestone record
independently, since those eight figures carry the chain's only quantitative claim.

### Gate D — Phase 6, findings and artifact. Completeness and constraint.

The failure mode is a findings document that outruns its data. The site currently makes
claims across seven pages against a database that has just changed underneath it.

Specific things for the reviewer to check, beyond the spec:

- Every number rendered in the app resolves to the current database, not to a figure that
  was true before the relabel.
- Nothing anywhere still asserts the withdrawn working-now gradient.
- The 8-category taxonomy is used consistently; no page still says seven.
- No page cites a log by filename that a reader cannot reach. Several pages reference
  `search_log`, `research-log/searches/phase-3.json` and the decisions table, and there
  is no repository link on the site.

## Reporting

One report per gate, written to `research-log/reviews/gate-{a,b,c,d}.json`, each row
carrying a verdict from the mode's own enumeration plus the evidence that produced it. No
fixes in the same pass.

Then, and only then, a separate pass acts on the reports and records what it changed.

## What is already known to be wrong

Listed so the reviewers do not spend time rediscovering it, and so nobody counts these as
gate findings:

- The working-now gradient failed replication and is withdrawn. `docs/relabel-report.md`
  has the scoring.
- Maturity is the least reliable dimension measured: 63 of 103 agreement across the two
  passes, against 77 of 103 on type.
- AI-type confidence stands at 46 confident / 57 guess after mechanical adjudication.
- The measurability tier "Proxy only" ran 78% disagreement in the Phase 2 audit and should
  probably be dropped, leaving three tiers.
- Outcomes and measurability tiers were frozen at their Phase 1–2 values through the
  relabel and have had no full second pass.
- **The maturity labels are wrong and are being repaired on a separate branch.** The
  relabel read `Working now` as "the capability exists" rather than "applying it would
  move this gap", which produced *AI Could Be Misused* at `Coordination and institutional`
  / `Working now`. 63 gaps are under review. Do not spend gate time on this.
