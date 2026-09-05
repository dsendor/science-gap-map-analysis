-- An explicit axis field, and elapsed days for chains too short to measure in years.
--
-- methodology/critical-path.md named the exact failure this prevents: the renderer
-- decided "is this a cost chain" by testing duration_years IS NULL, and said a cost
-- chain that happened to carry durations would silently render the wrong label. The
-- publishing chain now carries durations, so that is no longer hypothetical.
--
-- duration_days is separate from duration_years rather than a unit conversion, because
-- the two chains are measured at genuinely different scales and rendering 0.33 years
-- for a review turnaround would be false precision dressed as consistency.

ALTER TABLE critical_paths
    ADD COLUMN axis_kind TEXT NOT NULL DEFAULT 'time'
    CHECK (axis_kind IN ('time', 'cost'));

ALTER TABLE critical_path_links ADD COLUMN duration_days REAL;
ALTER TABLE critical_path_links ADD COLUMN duration_span_note TEXT;

ALTER TABLE critical_path_links ADD COLUMN duration_covers_json TEXT;
