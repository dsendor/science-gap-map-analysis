# Vercel deployment

## Layout

The Next.js app lives in `app/`, but its build script shells out to
`../engine/export-artifact.mjs` to regenerate `data.json`/CSV from the SQLite database
before `next build` runs. That means the Vercel project's root must be the **repo
root**, not `app/` — a project rooted at `app/` never uploads `engine/` and the build
fails with `Cannot find module '/vercel/engine/export-artifact.mjs'`.

Root-level `vercel.json` handles this:

```json
{
  "buildCommand": "cd app && npm install && npm run build",
  "outputDirectory": "app/out"
}
```

`next.config.mjs` sets `output: 'export'`, so the deploy is a static export
(`app/out`), not a Node server.

## Access control

This site is not meant to be public yet. Project → Settings → Deployment Protection →
**Vercel Authentication** is on, set to **Standard Protection**.

**The gotcha:** Standard Protection (the free/Hobby tier) exempts the production
custom domain — the dropdown says so explicitly ("Protect all except production
Custom Domains"). "All Deployments" closes that hole but requires a Pro plan upgrade,
which we have not done.

So on the current plan:
- Every unique deployment URL (`https://<project>-<hash>-<team>.vercel.app`) **is**
  gated behind Vercel SSO login, checked and confirmed (302 to `vercel.com/sso-api`).
- Any alias assigned as a production custom domain (including the plain
  `<project>.vercel.app` name) **bypasses** that gate and serves the page to anyone,
  confirmed with a live curl that returned 200 with full page content.

**Rule: never run `vercel --prod` and never assign a custom domain/alias to this
project** while it's meant to stay private. Deploy with plain `vercel` (no flags) —
that's a preview deploy on a unique, gated URL. If a project's first-ever deploy gets
auto-labeled "Production" (Vercel does this for a brand-new project with no prior
deploy), do not let that assign an alias; if one appears, remove it:

```bash
vercel alias ls                      # find aliases pointing at this project
vercel alias rm <alias-domain> --yes
```

Confirm gating after any deploy or alias change:

```bash
curl -sD - -o /dev/null https://<the-url-you-plan-to-share>
# expect: HTTP/2 302, location: https://vercel.com/sso-api?...
```

If you want the friendly public-looking domain gated too, the only path is upgrading
the Vercel team to Pro and switching Deployment Protection to "All Deployments."

## Commands

```bash
vercel link --yes     # first-time only, from repo root
vercel                # preview deploy, gated URL
vercel ls             # list deployments
vercel alias ls        # list aliases (check nothing points here that shouldn't)
vercel rm <project> --yes   # nuke a project entirely
```

## Deploying from a worktree

`.vercel/` is gitignored, so a fresh worktree is **not linked to the project** and a
plain `vercel` there creates a brand-new one named after the directory. A brand-new
project has no Deployment Protection, and Vercel labels its first deploy Production and
assigns two aliases automatically. That happened on 2026-09-06: `wt-front-page-rewrite.vercel.app`
served the full site to anyone for a few minutes before the aliases were removed and the
project deleted.

Copy the link before deploying from a worktree:

```bash
cp ../science-gap-map-analysis/.vercel/project.json .vercel/project.json
vercel --yes
```

Then check, every time, that the unique URL is gated and no bare name resolves:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<deployment-url>          # expect 302
curl -s -o /dev/null -w "%{http_code}\n" https://<project-name>.vercel.app  # expect 404
```
