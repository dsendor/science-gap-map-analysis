-- A record of the schema change, not something that runs: engine/rebuild.mjs recreates
-- the database from db/schema.sql.
--
-- status: a chain may be committed before every step is researched. Drafts validate but
-- are never exported, so a half-built chain cannot reach the public JSON looking finished.
--
-- confidence: every judgment carries one (CLAUDE.md, rule 6), and chain steps had no
-- field for it, so an agent following the rule hit "unknown field".

ALTER TABLE critical_paths ADD COLUMN status TEXT NOT NULL DEFAULT 'complete';
ALTER TABLE critical_path_links ADD COLUMN confidence TEXT;
