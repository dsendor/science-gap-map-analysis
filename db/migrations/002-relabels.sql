-- Migration 002 — full-coverage relabel comparison.
--
-- The AI-type relabel against the 8-category taxonomy is a complete independent
-- second pass over all 103 gaps, not a sample. This table holds v1 (mine, 7
-- categories) against v2 (independent labelers, 8 categories) so the disagreement
-- rate is computed over the whole map and the adjudication is auditable.
--
-- Kept separate from `audits`, which holds the Phase 2 sampled blind audit. Folding
-- them together would mix a 36-gap stratified sample with a 103-gap census and make
-- both rates uninterpretable.

CREATE TABLE IF NOT EXISTS relabels (
    gap_id              TEXT PRIMARY KEY REFERENCES gm_gaps(id),
    v1_type             TEXT NOT NULL,
    v1_maturity         TEXT NOT NULL,
    v2_type             TEXT NOT NULL,
    v2_maturity         TEXT NOT NULL,
    type_agreed         INTEGER NOT NULL CHECK (type_agreed IN (0, 1)),
    maturity_agreed     INTEGER NOT NULL CHECK (maturity_agreed IN (0, 1)),
    discriminating_test TEXT,
    nearest_alternative TEXT,
    v2_rationale        TEXT,
    v2_confidence       TEXT CHECK (v2_confidence IN ('confident', 'guess')),
    adjudicated_type    TEXT,
    adjudicated_maturity TEXT,
    adjudication_note   TEXT,
    labeled_by          TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);
