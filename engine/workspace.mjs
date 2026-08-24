#!/usr/bin/env node
// Where am I, and has the ground moved under me?
//
// A git clone has exactly one HEAD. Two agents working in the same directory share
// it, so `git checkout` by either is a global mutation the other sees instantly and
// silently — and uncommitted changes ride along across the switch, landing on
// somebody else's branch. Branches do not isolate agents. Directories do.
//
// This module is the tripwire. preflight.mjs stamps the branch you started on;
// rebuild.mjs checks the stamp every time it runs and refuses if it moved. On
// 2026-08-23 a session had its working tree switched out from under it twice
// mid-task and found out both times by accident, several minutes later.
//
// The stamp lives in the worktree's own private git dir, so it is per-worktree,
// never committed, and needs no .gitignore entry.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

export function context() {
  const gitDir = git('rev-parse', '--absolute-git-dir');
  const commonDir = git('rev-parse', '--path-format=absolute', '--git-common-dir');
  const worktrees = git('worktree', 'list').split('\n').filter(Boolean);
  return {
    branch: git('rev-parse', '--abbrev-ref', 'HEAD'),
    head: git('rev-parse', '--short', 'HEAD'),
    toplevel: git('rev-parse', '--show-toplevel'),
    // The primary clone is the one whose git dir IS the common dir. Every worktree
    // added later gets a private git dir underneath it.
    isPrimary: gitDir === commonDir,
    worktreeCount: worktrees.length,
    stampPath: git('rev-parse', '--path-format=absolute', '--git-path', 'workspace-stamp.json'),
  };
}

export function stamp(ctx = context()) {
  writeFileSync(ctx.stampPath, `${JSON.stringify({
    branch: ctx.branch, head: ctx.head, toplevel: ctx.toplevel,
    at: new Date().toISOString(),
  }, null, 2)}\n`);
  return ctx;
}

// Returns null when the branch is where it was left, or a description of the drift.
export function drift(ctx = context()) {
  if (!existsSync(ctx.stampPath)) return null;
  let prev;
  try { prev = JSON.parse(readFileSync(ctx.stampPath, 'utf8')); } catch { return null; }
  if (prev.branch === ctx.branch) return null;
  return { from: prev.branch, to: ctx.branch, since: prev.at };
}

// The message is long on purpose. Whoever reads it is confused, and the useful
// content is what to do next rather than what went wrong.
export function driftMessage(d, ctx) {
  return [
    '',
    `  HEAD MOVED. This worktree was on '${d.from}' at the last preflight (${d.since}).`,
    `  It is now on '${d.to}'.`,
    '',
    '  If you switched deliberately, re-stamp and carry on:',
    '      node engine/preflight.mjs',
    '',
    '  If you did not, another session is sharing this working tree. Your uncommitted',
    '  changes have been carried onto a branch that is not yours. Do not commit. Save',
    '  them, restore this tree, and take your own worktree:',
    `      git -C ${ctx.toplevel} status --short`,
    '      node engine/worktree.mjs <your-track-name>',
    '',
  ].join('\n');
}
