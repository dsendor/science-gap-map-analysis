# How to write CLAUDE.md

**CLAUDE.md is loaded into every prompt.** Everything in it costs context on every
task, whether or not that task needs it. So the test for including something is not *is
this true* or *is this useful* — it is:

> **Would an agent get this wrong on a task that has nothing to do with it?**

If yes, it belongs. If it only matters once you are already doing X, it belongs in the
document about X, and CLAUDE.md gets one line pointing there.

## What earns a place

- **Rules that apply to every prompt.** Lead with the answer. Never rank. Additive only.
  Never merge to main without asking.
- **Rules whose violation is expensive and silent.** Modifying `gm_*`, ranking their
  gaps, deploying from an unlinked worktree. An agent will not discover these by
  reading the code, and by the time the mistake shows up it is in a commit.
- **The failure modes this project actually hits**, stated in one line each. Not a
  general theory of good work.
- **A pointer table** so anything cut is one hop away.

## What does not

- **Reference material.** Taxonomy values, research tooling, deployment gotchas. Real
  and worth writing down, in their own file.
- **Things the repository already states.** `.gitignore` says what is ignored. Listing
  it again in CLAUDE.md adds nothing an agent could not read in two seconds, and the
  reasoning belongs with the architecture.
- **History.** What a phase did, what a gate found, what was withdrawn. That is
  `research-log/` and git.
- **Anything a competent agent does anyway.** Writing tests, checking work, being
  careful. Instructions that describe the default are noise that dilutes the rules that
  do not.

## Rules of thumb

- **One screen.** If it does not fit, something in it is reference material.
- **Every section should answer: what breaks if this is missing?** If the answer is
  "nothing, the agent would just have to look it up", it is a pointer, not a section.
- **Prefer a rule to an explanation.** "Never rank their gaps" beats a paragraph on why
  ranking is presumptuous. Put the why in the doc the pointer leads to.
- **A pointer is not a loss.** Cutting something to its own file makes it longer and
  better, because it no longer competes for space.

## Changing it

**Do not edit CLAUDE.md without David's approval.** It is the one file that shapes every
future session, an agent editing its own standing instructions is a change nobody
reviews, and drift here is invisible until something goes wrong. Propose the change and
say what it would replace.
