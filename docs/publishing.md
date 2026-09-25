# Publishing

**Nothing reaches a public site without David saying so, in that conversation, about
that change.** This page is how the two sites publish, what triggers each one, and the
order to do it in. Read it before any merge to `main` in this repo and before any
deploy of either site.

## Two sites, two repos, two ways of publishing

| | The gap map | David's site |
|---|---|---|
| Public address | https://gapmap.sendorai.com | https://www.sendorai.com |
| Repo | `dsendor/science-gap-map-analysis` (this one) | `dsendor/sendorai` |
| Local clone | `~/Coding/science-gap-map-analysis` | `~/Coding/sendorai` |
| Vercel project | `science-gap-map-analysis` | `sendorai` |
| **What publishes it** | **A push to `main`.** Git-connected, production branch `main`. | **`vercel deploy --prod`, run by David.** Git never deploys (`git.deploymentEnabled: false`). |
| Released from | `main` | the `design-versions` branch — **not** `main` |
| What a branch push does | Builds a gated preview | Nothing |
| Its own rules | `CLAUDE.md`, `docs/vercel-deploy.md` | that repo's `CLAUDE.md`, `docs/going-live.md` |

The two work differently, and that is the source of every mistake below. **On the gap
map, merging is publishing:** there is no separate step, and a merge is public about
twenty seconds later. On David's site nothing happens until someone runs the CLI, and
the CLI uploads whatever folder it is run in.

## The approval rule

1. **Ask before merging to `main` in this repo**, and say in the question that the merge
   publishes. "Merge to main" and "publish" are the same request here; a yes to one is
   not permission for the other unless David has been told that.
2. **Show a preview first.** Every branch push here builds one; hand David its URL.
3. **Claude never deploys David's site to production.** A hook in that repo blocks it.
   Hand David the exact commands instead.
4. **Approval covers one change.** A yes last week, or for the other site, is not a yes
   now.

## Publishing the gap map

1. Rebuild and check, on the branch:
   ```bash
   node engine/rebuild.mjs            # ends with the additive guardrail
   node engine/export-artifact.mjs
   cd app && npm run build
   ```
2. Push the branch. Vercel builds a **preview** from it. Get the URL and confirm it is
   gated before sharing it:
   ```bash
   vercel ls science-gap-map-analysis | head -6
   curl -s -o /dev/null -w "%{http_code}\n" <preview-url>    # expect 302, not 200
   ```
3. **`git fetch` and check `main` has not moved.** If it has commits you did not make,
   stop and report before merging (`CLAUDE.md`).
4. Hand David the preview URL and ask. The question says the merge publishes.
5. On his yes, fast-forward `main` to the branch and push. This is the publish:
   ```bash
   git push origin <branch>:main
   ```
6. Verify production within a minute:
   ```bash
   vercel inspect gapmap.sendorai.com | grep -E "target|created"   # the new deployment
   curl -s https://gapmap.sendorai.com | grep -o "<title>[^<]*</title>"
   ```
   and click through `/`, `/map/`, `/critical-paths/` and one chain page.

**If it is wrong**, the fastest fix is David promoting the previous production
deployment in the Vercel dashboard (Deployments → the last good one → Promote). Then fix
forward on a branch.

## Publishing David's site

Claude's part ends at a gated preview. The release is David's.

1. Work on a branch off `design-versions`, in a worktree, never in `~/Coding/sendorai`
   directly.
2. Build, then preview **with the target spelled out**, from the worktree, after linking
   it to the existing project so it cannot create a new one:
   ```bash
   cp ~/Coding/sendorai/.vercel/project.json .vercel/project.json
   vercel deploy --target=preview --yes
   curl -s -o /dev/null -w "%{http_code}\n" <preview-url>    # expect 302
   ```
3. Hand David the preview URL and the release commands below, with the branch named.
4. **David releases**, from a checkout of `design-versions` with the change merged in:
   ```bash
   cd ~/Coding/sendorai
   git switch design-versions && git pull
   git merge --ff-only origin/<the-branch>
   git branch --show-current          # must print: design-versions
   vercel deploy --prod
   ```

**The trap here:** `~/Coding/sendorai` is usually on `main`, and `main` holds only the
first commit, with no pages. `vercel deploy --prod` run there publishes that empty
stub over the live site. Check the branch before every release.

## When both sites change

**Gap map first, then David's site.** David's site links into the gap map by URL — the
Webb page links to `/critical-paths/<telescope slug>/` — and those URLs do not exist
until the gap map publishes. Released the other way round, David's site links to a
404 for as long as the gap is.

## Things that have gone wrong, and are why this page exists

| Date | What happened | The rule it produced |
|---|---|---|
| 2026-09-06 | A `vercel` from an unlinked worktree created a new project; its first deploy was labelled Production and served the site publicly | Copy `.vercel/project.json` into a worktree before deploying from it |
| 2026-09-06 | Every push to `main` failed to build, because the database is gitignored, while CLI deploys beside them succeeded | `vercel.json` runs `engine/rebuild.mjs` first; a green CLI deploy says nothing about the git build |
| 2026-09-11 | A plain `vercel deploy` on the new `sendorai` project went to production and was public for nine minutes | Always `--target=preview`; check for a 302 |
| 2026-09-25 | The documented release command for David's site would have published the empty `main` stub | Release from `design-versions`; check the branch |
| 2026-09-25 | "Merge to main" was asked for as if publishing were a later step | On the gap map they are one action; say so when asking |

---

## In short

- **Nothing publishes without David's yes, for that change.** Previews are fine; production
  is his call.
- **Gap map: a push to `main` is the publish.** Automatic and public in about twenty
  seconds. Preview from the branch, ask, then fast-forward `main`.
- **David's site: only `vercel deploy --prod`, run by David, from `design-versions`.**
  Git never deploys it. Its `main` is an empty stub, and deploying from it would replace the
  live site.
- **Both changing? Gap map first**, because David's site links into it.
- Every preview must answer an anonymous request with **302, not 200**.
