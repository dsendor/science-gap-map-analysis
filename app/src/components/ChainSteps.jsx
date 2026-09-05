// The chain as a vertical schedule: one row per step, read top to bottom in the order
// the work happens.
//
// Four independent readings per row, and keeping them independent is the point. Whether
// a current AI capability acts on the step; how mature that capability is; how many of
// Convergent's own capabilities are attached, with links to their pages; and how long
// the step takes. A row can be any combination, and the combination that matters is the
// one where a step carries the cost, has no capability attached, and cannot be timed.
//
// Durations render as a bar against the longest measured step. Where no published figure
// exists the bar is deliberately absent rather than zero, because a zero-length bar reads
// as "instant" and the truth is "nobody has measured this".

const MATURITY_TOKEN = {
  'Working now': 'var(--reach-1)',
  '2-5 years': 'var(--reach-2)',
  Speculative: 'var(--reach-3)',
};
// Short qualifier under a bar whose figure brackets more than the step it sits on.
// The full provenance stays in duration_span_note and reaches the reader as a tooltip.
function spanOf(l) {
  const n = l.duration_span_note ?? '';
  const m = n.match(/steps? (\d+) to (\d+)/i);
  return m ? `covers steps ${m[1]}–${m[2]}` : null;
}

const MATURITY_LABEL = {
  'Working now': 'works now',
  '2-5 years': '2–5 years',
  Speculative: 'speculative',
};

export default function ChainSteps({ path, compact = false }) {
  const isTime = path.axis_kind === 'time';
  const val = (l) => (isTime ? l.duration_years : l.duration_days);
  const unit = isTime ? 'yr' : 'days';
  const max = Math.max(...path.links.map((l) => val(l) ?? 0), 1);

  return (
    <ol className={compact ? 'steps steps--compact' : 'steps'}>
      {path.links.map((l) => {
        const caps = l.capability_links ?? [];
        const d = val(l);
        const carries = l.is_binding === 1 && path.axis_kind === 'cost';
        return (
          <li key={l.seq} className={`step${carries ? ' step--cost' : ''}`}>
            <div className="step__seq">{String(l.seq).padStart(2, '0')}</div>

            <div className="step__main">
              <h4 className="step__name">{l.link}</h4>
              {!compact && <p className="step__blocker">{l.blocker}</p>}

              <div className="step__marks">
                {l.ai_acts ? (
                  <span className="mark mark--reach">
                    <i style={{ background: MATURITY_TOKEN[l.maturity] ?? 'var(--reach-2)' }} />
                    AI acts · {MATURITY_LABEL[l.maturity] ?? l.maturity}
                  </span>
                ) : (
                  <span className="mark mark--none">
                    <i />
                    no AI capability reaches this
                  </span>
                )}
                {carries && <span className="mark mark--cost">carries the cost</span>}
              </div>
            </div>

            <div className="step__caps">
              {caps.length === 0 ? (
                <span className="caps-none">no capability</span>
              ) : (
                <ul className="caps-list">
                  {caps.map((c) => (
                    <li key={c.name}>
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noreferrer">
                          {c.name}
                        </a>
                      ) : (
                        c.name
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="step__time">
              {d != null ? (
                <>
                  <span className="step__num" title={l.duration_span_note ?? undefined}>
                    {d}
                    <small>{unit}</small>
                  </span>
                  <span className="step__bar" style={{ width: `${Math.max((100 * d) / max, 4)}%` }} />
                  {spanOf(l) && <span className="step__spannote">{spanOf(l)}</span>}
                </>
              ) : (
                <span className="step__nomeasure" title={l.duration_span_note ?? undefined}>
                  not measured
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
