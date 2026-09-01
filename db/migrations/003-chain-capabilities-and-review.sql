-- Two additions to the critical-path tables, both folded into db/schema.sql so a
-- fresh build gets them without this file. This exists for a database that already
-- has rows in it.
--
-- capabilities_json: which of Convergent's own capabilities for the gap act on each
-- step. The empty arrays are the point — a binding step with no capability attached
-- is an investment gap stated entirely in their own data.
--
-- reviewed: which chain a person has actually read. The publishing chain was worked
-- through end to end; the telescope chain is a model's first pass and unchecked.

ALTER TABLE critical_path_links
    ADD COLUMN capabilities_json TEXT NOT NULL DEFAULT '[]';

ALTER TABLE critical_paths
    ADD COLUMN reviewed TEXT NOT NULL DEFAULT 'ai-only'
    CHECK (reviewed IN ('ai-only', 'human'));
