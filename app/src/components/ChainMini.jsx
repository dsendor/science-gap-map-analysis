// The chain diagram alone, for embedding in the argument.
//
// Two independent marks, so neither is circular. Colour says whether a current AI
// capability acts on the step. On a cost chain the "carries the cost" label says where
// the labor concentrates, which is a separate fact: a step can be both, and reviewer
// recruitment is.
export default function ChainMini({ path }) {
  return (
    <div className="chain">
      {path.links.map((l) => {
        const marks = [];
        if (l.ai_acts) marks.push('AI acts here');
        if (l.is_binding && l.duration_years == null) marks.push('carries the cost');
        return (
          <div key={l.seq} className={l.is_binding ? 'node bind' : 'node'}>
            <span className="seq">
              {l.seq}
              {marks.length ? ` · ${marks.join(' · ')}` : ''}
            </span>
            {l.link}
            {l.figure && (
              <span
                style={{
                  display: 'block', marginTop: 6, fontSize: 11.5, lineHeight: 1.35,
                  color: l.is_binding ? 'var(--ink)' : 'var(--ink-3)',
                }}
              >
                {l.figure}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
