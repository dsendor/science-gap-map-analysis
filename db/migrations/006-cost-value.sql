-- A record of the schema change, not something that runs: engine/rebuild.mjs recreates
-- the database from db/schema.sql.
--
-- A cost chain had no numeric field for cost, so the only number it could show was
-- duration_days, elapsed time. That is why the publishing chain declares a cost axis and
-- displays days. cost_unit is separate because cost is not one thing: reviewer-hours per
-- paper and dollars per experiment are both costs and cannot share a unit.

ALTER TABLE critical_path_links ADD COLUMN cost_value REAL;
ALTER TABLE critical_path_links ADD COLUMN cost_unit TEXT;
