// The chain diagram alone, for embedding in the argument.
//
// Three independent marks, so none is circular. Colour says whether a current AI
// capability acts on the step. On a cost chain the "carries the cost" label says where
// the labor concentrates, which is a separate fact: a step can be both, and reviewer
// recruitment is. The capability count is Convergent's own data rather than any of our
// labels, and the zeroes are the reason it is on the diagram at all.
export default function ChainMini({ path }) {
  return (
    <div className="chain">
      {path.links.map((l) => {
        const marks = [];
        if (l.ai_acts) marks.push('AI acts here');
        if (l.is_binding && l.duration_years == null) marks.push('carries the cost');
        const nCaps = l.capabilities?.length ?? 0;
        return (
          <div key={l.seq} className={l.is_binding ? 'node bind' : 'node'}>
            <span className="seq">
              {l.seq}
              {marks.length ? ` · ${marks.join(' · ')}` : ''}
            </span>
            {l.link}
            <span
              className={nCaps ? 'caps' : 'caps none'}
              title={nCaps ? l.capabilities.join(' · ') : 'No capability in the Gap Map acts on this step'}
            >
              {nCaps === 0 ? 'no capability' : nCaps === 1 ? '1 capability' : `${nCaps} capabilities`}
            </span>
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
