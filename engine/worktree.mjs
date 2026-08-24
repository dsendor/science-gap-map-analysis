#!/usr/bin/env node
// Take a worktree for one track of work.
//
//   node engine/worktree.mjs <track-name> [base]
//
// Creates ../wt-<track> on a new branch <track>, cut from origin/main by default.
// Copies .env across, because it is gitignored and a fresh worktree has none, and
// tells you the one command left to run.
//
// This exists to make the right thing cheap. The two frictions that otherwise push
// people back into sharing one clone are both gitignored files: .env, which this
// copies, and db/gapmap.sqlite, which rebuild.mjs regenerates. Neither is a reason
// to share a HEAD.

import { execFileSync } from 'node:child_process';
import { existsSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

const track = process.argv[2];
const base = process.argv[3] ?? 'origin/main';
if (!track || track.startsWith('-')) {
  console.error('usage: node engine/worktree.mjs <track-name> [base]');
  console.error('  e.g. node engine/worktree.mjs relabel-v3');
  console.error('       node engine/worktree.mjs gate-d-rerun origin/maturity-repair');
  console.error('\nName it for the work, not for the agent.');
  process.exit(1);
}

const primary = git('rev-parse', '--path-format=absolute', '--git-common-dir').replace(/\/\.git$/, '');
const dest = resolve(dirname(primary), `wt-${track}`);

if (existsSync(dest)) {
  console.error(`${dest} already exists. Use it, or remove it with:\n  git worktree remove ${dest}`);
  process.exit(1);
}

console.log(`fetching, so ${base} means what it says…`);
execFileSync('git', ['fetch', '--quiet'], { cwd: root, stdio: 'inherit' });

// If the branch already exists, check it out rather than failing; a re-take of an
// existing track is a normal thing to want.
const exists = git('branch', '--list', track) !== '';
const args = exists
  ? ['worktree', 'add', dest, track]
  : ['worktree', 'add', dest, '-b', track, base];
execFileSync('git', args, { cwd: root, stdio: 'inherit' });

if (existsSync(`${root}.env`)) {
  copyFileSync(`${root}.env`, `${dest}/.env`);
  console.log('copied .env (gitignored, so it does not travel with the checkout)');
}

console.log(`
worktree ready:  ${dest}
branch:          ${track}${exists ? ' (existing)' : ` (new, from ${base})`}

  cd ${dest}
  node engine/rebuild.mjs && node engine/preflight.mjs

rebuild.mjs builds this worktree's own database — db/*.sqlite is gitignored, so it
does not come with the checkout and is not shared with anyone else. preflight.mjs
stamps the branch, which is what lets rebuild.mjs notice if HEAD moves under you.

When the track is done and merged:  git worktree remove ${dest}
`);
