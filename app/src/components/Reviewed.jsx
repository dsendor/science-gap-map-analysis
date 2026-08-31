// Provenance tags. Almost everything on this site was labelled by a model and never
// read by a person, and the two states have to be distinguishable at a glance or the
// one human-reviewed thing gets no more credit than the 102 that are not.
//
// Deliberately not data-driven: there is no reviewed_by_human column, because there is
// currently one reviewed thing and inventing a schema for it would be more machinery
// than fact. When a second gap is reviewed, this becomes a column.

export const HUMAN_REVIEWED = {
  // Worked end to end with David on 2026-08-31: the outcome sentence is his, and the
  // seven-step chain, its per-step measures and the binding links were read against
  // the gap rather than taken on trust.
  'doing-and-publishing-research-is-expensive-and-subject-to-structural-roadblocks': true,
};

export function AiOnly({ title = 'Labelled by a model. No person has checked it.' }) {
  return (
    <span className="tag" title={title} style={{ marginLeft: 6, verticalAlign: '2px' }}>
      AI only
    </span>
  );
}

export function HumanChecked({ title = 'Worked through and edited by a person.' }) {
  return (
    <span className="tag on" title={title} style={{ marginLeft: 6, verticalAlign: '2px' }}>
      Human-checked
    </span>
  );
}
