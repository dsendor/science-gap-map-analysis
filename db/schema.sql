-- Gap Map augmentation — schema v1
--
-- Two zones, and the separation is load-bearing:
--
--   gm_*   BASELINE. A verbatim mirror of Convergent Research's 2026-07-29 export.
--          Never written outside engine/import-gapmap.mjs. engine/verify-additive.mjs
--          re-serialises these tables and diffs them against data/baseline/, so any
--          edit to their data fails CI. "Additive only" is a test, not a promise.
--
--   everything else  AUGMENTATION. Ours. Joins back on their id/slug, which are
--          preserved exactly so Convergent can ingest by key.
--
-- Three constraints from the brief are enforced by the DDL rather than by review:
--   1. "Do not rank gaps by importance"       -> no numeric score column exists anywhere.
--   2. "Every added judgment needs a rationale" -> rationale TEXT NOT NULL, everywhere.
--   3. "Where a label is a guess, mark it a guess" -> confidence NOT NULL, 2-value CHECK.
--
-- Named values only, no numeric scales — carried over from ai-science-gap-map.
-- A CHECK violation on an invented enum value is the point, not an obstacle.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

--------------------------------------------------------------------------------
-- BASELINE — their data. Read-only after import.
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS gm_fields (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS gm_gaps (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    field_id    TEXT REFERENCES gm_fields(id),
    tags_json   TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS gm_capabilities (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL,
    description TEXT,                       -- 2 of 369 are genuinely absent upstream
    tags_json   TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS gm_resources (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    url         TEXT,
    summary     TEXT,
    types_json  TEXT NOT NULL DEFAULT '[]'
);

-- 389 edges, all sourced from the gap side: capabilities[].gaps is empty for all
-- 369 capabilities in the export even though their schema.json documents it.
-- Reported as an export defect; see docs/integrity-report.md.
CREATE TABLE IF NOT EXISTS gm_gap_capabilities (
    gap_id        TEXT NOT NULL REFERENCES gm_gaps(id),
    capability_id TEXT NOT NULL REFERENCES gm_capabilities(id),
    PRIMARY KEY (gap_id, capability_id)
);

CREATE TABLE IF NOT EXISTS gm_capability_resources (
    capability_id TEXT NOT NULL REFERENCES gm_capabilities(id),
    resource_id   TEXT NOT NULL REFERENCES gm_resources(id),
    PRIMARY KEY (capability_id, resource_id)
);

--------------------------------------------------------------------------------
-- AUGMENTATION — ours.
--------------------------------------------------------------------------------

-- Outcome 1: one sentence per gap. If this gap closes, what becomes knowable or
-- buildable. Deliberately a text field on the gap, NOT a separate entity — see
-- docs/plan.md; promoting outcomes to a real many-to-many entity is named as a
-- limitation in the artifact and explicitly left unbuilt.
CREATE TABLE IF NOT EXISTS gap_outcomes (
    gap_id     TEXT PRIMARY KEY REFERENCES gm_gaps(id),
    outcome    TEXT NOT NULL,
    rationale  TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK (confidence IN ('confident', 'guess')),
    labeled_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Outcome 2: which kind of AI would actually move this gap, and how mature that
-- kind is. Multiple rows per gap are allowed and expected; exactly one carries
-- is_primary = 1 (enforced by the unique index below) so the cross-tabs stay clean.
CREATE TABLE IF NOT EXISTS gap_ai_types (
    gap_id     TEXT NOT NULL REFERENCES gm_gaps(id),
    ai_type    TEXT NOT NULL CHECK (ai_type IN (
                   'LLM reasoning and synthesis',
                   'ML surrogates and prediction',
                   'Design and optimization search',
                   'Sensing and signal processing',
                   'Autonomous experimentation',
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
CREATE UNIQUE INDEX IF NOT EXISTS gap_ai_types_one_primary
    ON gap_ai_types (gap_id) WHERE is_primary = 1;

-- Outcome 3: measurability tier. The distribution is itself a finding, and the
-- expected correlation between 'Verification contested' and the origins questions
-- is the sharpest instance of verifier's law available in this dataset.
CREATE TABLE IF NOT EXISTS gap_measurability (
    gap_id     TEXT PRIMARY KEY REFERENCES gm_gaps(id),
    tier       TEXT NOT NULL CHECK (tier IN (
                   'Directly measurable',      -- observable quantity + direction of improvement
                   'Proxy only',               -- inputs or adjacent effects measurable, gap itself not
                   'Verification contested',   -- candidate observable exists, no agreement it settles anything
                   'Counterfactual required'   -- quantity of interest is something that did not happen
               )),
    rationale  TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK (confidence IN ('confident', 'guess')),
    labeled_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Outcome 4: progress indicators. A SAMPLE of 6-8 gaps, never extrapolated to
-- coverage. is_null_result = 1 records an honest failure to find a usable
-- indicator after a genuine search; at least one is required, and the search that
-- failed is logged in search_log so the null is auditable rather than asserted.
CREATE TABLE IF NOT EXISTS gap_indicators (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    gap_id         TEXT NOT NULL REFERENCES gm_gaps(id),
    quantity       TEXT NOT NULL,
    current_value  TEXT,
    unit           TEXT,
    as_of          TEXT,
    target_value   TEXT,
    target_basis   TEXT,
    source_title   TEXT,
    source_url     TEXT,
    source_doi     TEXT,
    source_checked TEXT CHECK (source_checked IN ('verified', 'unreachable', 'metadata-mismatch', 'unchecked')),
    is_null_result INTEGER NOT NULL DEFAULT 0 CHECK (is_null_result IN (0, 1)),
    rationale      TEXT NOT NULL,
    confidence     TEXT NOT NULL CHECK (confidence IN ('confident', 'guess')),
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK (is_null_result = 1 OR (current_value IS NOT NULL AND source_url IS NOT NULL))
);

-- Outcome 5: new gaps, written in Convergent's house format. Kept in a separate
-- table from gm_gaps so the additive-only test stays trivially true. Each must
-- pass both of Marblestone's tests, and each records the near-duplicate check
-- that cleared it.
CREATE TABLE IF NOT EXISTS new_gaps (
    id             TEXT PRIMARY KEY,          -- 'new-<slug>', never a Convergent UUID
    name           TEXT NOT NULL,
    slug           TEXT NOT NULL UNIQUE,
    description    TEXT NOT NULL,
    field_id       TEXT NOT NULL REFERENCES gm_fields(id),
    outcome        TEXT NOT NULL,
    -- The same three labels every one of their gaps carries. They live here rather
    -- than in gap_ai_types / gap_measurability because those tables hold foreign keys
    -- into gm_gaps, and a proposed gap is deliberately not one of theirs.
    ai_type        TEXT NOT NULL CHECK (ai_type IN (
                       'LLM reasoning and synthesis',
                       'ML surrogates and prediction',
                       'Design and optimization search',
                       'Sensing and signal processing',
                       'Autonomous experimentation',
                       'Physical build and manipulation',
                       'Coordination and institutional'
                   )),
    maturity       TEXT NOT NULL CHECK (maturity IN ('Working now', '2-5 years', 'Speculative')),
    tier           TEXT NOT NULL CHECK (tier IN (
                       'Directly measurable', 'Proxy only',
                       'Verification contested', 'Counterfactual required'
                   )),
    tension_test   TEXT NOT NULL,             -- agreed transformative + genuine feasibility debate
    unlock_test    TEXT NOT NULL,             -- which downstream dominoes fall
    dedup_check    TEXT NOT NULL,             -- what was searched, what came closest, why it is distinct
    nearest        TEXT,                      -- the one-line version, named explicitly rather than excerpted
    funding_check  TEXT NOT NULL,             -- confirmation it is not already funded and under construction
    rationale      TEXT NOT NULL,
    confidence     TEXT NOT NULL CHECK (confidence IN ('confident', 'guess')),
    created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Outcome 6: critical paths. Two only. The ordered chain whose slowest link sets
-- the duration of the whole thing, so speeding up any other link changes nothing.
CREATE TABLE IF NOT EXISTS critical_paths (
    id            TEXT PRIMARY KEY,
    gap_id        TEXT REFERENCES gm_gaps(id),
    title         TEXT NOT NULL,
    axis          TEXT NOT NULL,              -- the single axis chosen, where the gap bundles several
    axes_excluded TEXT NOT NULL,              -- the ones deliberately left as separate chains
    expectation   TEXT NOT NULL,              -- predicted binding link, recorded BEFORE the analysis
    finding       TEXT,                       -- what the chain actually showed
    -- A critical path is a claim about durations. A chain that shows which links bind
    -- without showing how long each one takes asks to be believed rather than checked.
    duration_basis  TEXT,
    programmes_json TEXT NOT NULL DEFAULT '[]',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS critical_path_links (
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
                   'Physical build and manipulation',
                   'Coordination and institutional'
               )),
    maturity   TEXT CHECK (maturity IN ('Working now', '2-5 years', 'Speculative')),
    is_binding INTEGER NOT NULL DEFAULT 0 CHECK (is_binding IN (0, 1)),
    evidence   TEXT,
    rationale  TEXT NOT NULL,
    duration_years  REAL,   -- elapsed years for this link, where the milestone record dates it
    duration_span   TEXT,   -- the two milestones the figure is measured between
    duration_note   TEXT,
    figure          TEXT,   -- for a non-time axis, the published quantity for this link
    PRIMARY KEY (path_id, seq)
);

--------------------------------------------------------------------------------
-- AUDIT — what makes the artifact credible rather than confident.
--------------------------------------------------------------------------------

-- A second agent relabels a stratified sample blind. The disagreement rate is
-- computed from these rows and PUBLISHED in the findings summary. Disagreements
-- are re-adjudicated; anything still unresolved is downgraded to confidence
-- 'guess' rather than argued into agreement.
CREATE TABLE IF NOT EXISTS audits (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    gap_id        TEXT NOT NULL REFERENCES gm_gaps(id),
    dimension     TEXT NOT NULL CHECK (dimension IN ('outcome', 'ai_type', 'measurability')),
    original      TEXT NOT NULL,
    audit         TEXT NOT NULL,
    agreed        INTEGER NOT NULL CHECK (agreed IN (0, 1)),
    adjudicated   TEXT,
    auditor_note  TEXT NOT NULL,
    audited_by    TEXT,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ported from ai-science-gap-map. Every non-obvious call gets a row: taxonomy
-- revisions, tier calls that could reasonably have gone the other way, gaps
-- dropped from the indicator sample. Labeled AI-set, pending review.
CREATE TABLE IF NOT EXISTS decisions (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    phase               TEXT NOT NULL,
    decision            TEXT NOT NULL,
    rationale           TEXT NOT NULL,
    runner_up           TEXT,
    confidence          TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
    reversal_condition  TEXT NOT NULL,
    review_status       TEXT NOT NULL DEFAULT 'AI-set, pending review',
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- The time number is part of the argument, so it is instrumented from commit 1
-- rather than reconstructed at the end. Agent time and human review time are
-- tracked separately — a single blended number invites the obvious objection.
CREATE TABLE IF NOT EXISTS runs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    phase       TEXT NOT NULL,
    kind        TEXT NOT NULL CHECK (kind IN ('agent', 'human-review')),
    started_at  TEXT NOT NULL,
    ended_at    TEXT,
    model       TEXT,
    n_units     INTEGER,
    note        TEXT
);

-- Every search issued, cached and replayable, so the auditor sees exactly the
-- evidence the labeler saw and an honest null is provable.
CREATE TABLE IF NOT EXISTS search_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    phase       TEXT NOT NULL,
    gap_id      TEXT REFERENCES gm_gaps(id),
    provider    TEXT NOT NULL,
    query       TEXT NOT NULL,
    cache_key   TEXT NOT NULL,
    n_results   INTEGER,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
