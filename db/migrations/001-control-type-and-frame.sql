-- Migration 001 — two taxonomy changes found by blind audit.
--
-- 1. Add 'Real-time control of physical systems' as an eighth AI capability type.
--    Blind audit found that closed-loop control has no home: fusion plasma control
--    chooses no experiments (so it is not autonomous experimentation) and builds
--    nothing (so it is not physical build). Two independent labelers disagreed on it
--    for exactly that reason. Control is a highly verifiable task class, so omitting
--    it distorts the maturity gradient that is the project's headline finding.
--
-- 2. Add a `frame` dimension rather than a ninth capability type, for gaps where AI
--    is the object of the gap rather than the instrument that would move it. Adding
--    'AI safety research' as a capability type would be a category error: the other
--    seven are capabilities applied TO science, while safety research is a research
--    field. The question "which AI capability moves this gap" is ill-posed for these
--    gaps, and the honest fix is to mark them and report them separately, not to
--    invent a category that does not parallel the others.
--
-- SQLite cannot ALTER a CHECK constraint, so the two AI-type tables are rebuilt.
-- Baseline gm_* tables are untouched; engine/verify-additive.mjs still passes.

PRAGMA foreign_keys = OFF;

BEGIN;

CREATE TABLE gap_ai_types_new (
    gap_id     TEXT NOT NULL REFERENCES gm_gaps(id),
    ai_type    TEXT NOT NULL CHECK (ai_type IN (
                   'LLM reasoning and synthesis',
                   'ML surrogates and prediction',
                   'Design and optimization search',
                   'Sensing and signal processing',
                   'Autonomous experimentation',
                   'Real-time control of physical systems',
                   'Physical build and manipulation',
                   'Coordination and institutional'
               )),
    maturity   TEXT NOT NULL CHECK (maturity IN ('Working now', '2-5 years', 'Speculative')),
    is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
    rationale  TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK (confidence IN ('confident', 'guess')),
    labeled_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (gap_id, ai_type)
);
INSERT INTO gap_ai_types_new SELECT * FROM gap_ai_types;
DROP TABLE gap_ai_types;
ALTER TABLE gap_ai_types_new RENAME TO gap_ai_types;
CREATE UNIQUE INDEX IF NOT EXISTS gap_ai_types_one_primary
    ON gap_ai_types (gap_id) WHERE is_primary = 1;

CREATE TABLE critical_path_links_new (
    path_id    TEXT NOT NULL REFERENCES critical_paths(id),
    seq        INTEGER NOT NULL,
    link       TEXT NOT NULL,
    blocker    TEXT NOT NULL,
    ai_type    TEXT CHECK (ai_type IN (
                   'LLM reasoning and synthesis',
                   'ML surrogates and prediction',
                   'Design and optimization search',
                   'Sensing and signal processing',
                   'Autonomous experimentation',
                   'Real-time control of physical systems',
                   'Physical build and manipulation',
                   'Coordination and institutional'
               )),
    maturity   TEXT CHECK (maturity IN ('Working now', '2-5 years', 'Speculative')),
    is_binding INTEGER NOT NULL DEFAULT 0 CHECK (is_binding IN (0, 1)),
    evidence   TEXT,
    rationale  TEXT NOT NULL,
    PRIMARY KEY (path_id, seq)
);
INSERT INTO critical_path_links_new SELECT * FROM critical_path_links;
DROP TABLE critical_path_links;
ALTER TABLE critical_path_links_new RENAME TO critical_path_links;

-- Frame. Default is ai-as-instrument; only the exceptions get a row.
CREATE TABLE IF NOT EXISTS gap_frame (
    gap_id     TEXT PRIMARY KEY REFERENCES gm_gaps(id),
    frame      TEXT NOT NULL CHECK (frame IN ('ai-as-instrument', 'ai-as-object')),
    rationale  TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

COMMIT;

PRAGMA foreign_keys = ON;
