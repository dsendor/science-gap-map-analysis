'use client';

// A critical path is a claim about durations, so the durations are on the diagram.
// Binding links carry a heavier border, a warmer wash, the word "binding" in the
// step label, and a bold row in the table — never colour alone.

export default function Chain({ path }) {
  const isTime = path.links.some((l) => l.duration_years != null);
  const total = path.links.reduce((a, l) => a + (l.duration_years ?? 0), 0);
  const bind = path.links.filter((l) => l.is_binding);
  const bindYears = bind.reduce((a, l) => a + (l.duration_years ?? 0), 0);
  const maxYears = Math.max(...path.links.map((l) => l.duration_years ?? 0), 1);

  return (
    <div className="card" style={{ marginBottom: 22 }}>
      <div className="pad">
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 11 }}>
          <span className="tag on">{path.gap_field}</span>
          <span className="tag">axis: {path.axis}</span>
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 21 }}>{path.title}</h3>
        <p style={{ fontSize: 15.5, marginBottom: 0 }}>
          Their gap: <strong>{path.gap_name}</strong>
        </p>
      </div>

      <div className="pad">
        <div className="chain">
          {path.links.map((l) => (
            <div key={l.seq} className={l.is_binding ? 'node bind' : 'node'}>
              <span className="seq">
                {l.seq}
                {l.is_binding ? ' · binding' : ''}
              </span>
              {l.link.includes(' (') ? (
                <>
                  {l.link.slice(0, l.link.indexOf(' ('))}
                  <span className="qual">{l.link.slice(l.link.indexOf('(') + 1, -1)}</span>
                </>
              ) : (
                l.link
              )}
              {l.duration_years != null && (
                <span className="yrs">
                  {l.duration_years} yr
                  <span style={{ display: 'block', fontWeight: 400, fontSize: 11, color: 'var(--ink-3)' }}>
                    {l.duration_span}
                  </span>
                  <span
                    className="bar"
                    style={{ width: `${Math.max((100 * l.duration_years) / maxYears, 3)}%` }}
                  />
                </span>
              )}
              {l.duration_years == null && l.figure && (
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
          ))}
        </div>
        {isTime ? (
          <p style={{ fontSize: 15, marginTop: 16, marginBottom: 0 }}>
            <strong>
              {bindYears} of {total} years sit in the {bind.length} binding steps.
            </strong>{' '}
            The four non-binding steps come to {(total - bindYears).toFixed(1)} years, and those are
            the only ones any current AI capability touches. Making every one of them instant leaves
            a frontier telescope taking {bindYears} years.
          </p>
        ) : (
          <p style={{ fontSize: 15, marginTop: 16, marginBottom: 0 }}>
            <strong>
              {bind.length} of {path.links.length} steps bind.
            </strong>{' '}
            A step that does not bind can be made free without changing the total — which is what
            makes the first two steps here, the ones AI has already taken over, the wrong place to
            have won.
          </p>
        )}
      </div>

      {path.programmes?.length > 0 && (
        <div className="pad">
          <h4 style={{ marginTop: 0 }}>The same chain, three programmes</h4>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Programme</th>
                  <th>Concept</th>
                  <th className="num">To construction start</th>
                  <th className="num">Construction to first light</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {path.programmes.map((p) => (
                  <tr key={p.programme}>
                    <td>
                      <strong>{p.programme}</strong>
                      <div style={{ color: 'var(--ink-3)', fontSize: 13.5, marginTop: 3 }}>{p.note}</div>
                    </td>
                    <td>{p.concept}</td>
                    <td className="num">{p.years_to_build} yr</td>
                    <td className="num">{p.years_build} yr</td>
                    <td className="num">
                      <strong>{p.total} yr</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 14.5, color: 'var(--ink-3)', marginTop: 12, marginBottom: 0 }}>
            {path.duration_basis}
          </p>
        </div>
      )}

      <div className="pad">
        {/* The first paragraph of the finding is the claim; the rest is the working.
            On the argument page the working goes behind a click, because a reader who
            disagrees with the claim will open it and a reader who does not will not. */}
        <h4 style={{ marginTop: 0 }}>What the chain showed</h4>
        {path.finding
          .split('\n\n')
          .slice(0, 2)
          .map((para, i) => (
            <p key={i} style={{ fontSize: 16 }}>
              {para}
            </p>
          ))}
        <details>
          <summary>The rest of what it showed, and what I predicted before running it</summary>
          <div className="body">
            {path.finding
              .split('\n\n')
              .slice(2)
              .map((para, i) => (
                <p key={i} style={{ fontSize: 15.5 }}>
                  {para}
                </p>
              ))}
            <h4>What I expected, written down first</h4>
            <p style={{ fontSize: 15.5 }}>{path.expectation}</p>
          </div>
        </details>
      </div>

      <div className="pad">
        <details open={false}>
          <summary>Every step: what blocks it, which AI capability touches it, and the evidence</summary>
          <div className="body">
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th className="num">#</th>
                <th>Step</th>
                <th>What blocks it</th>
                <th>{isTime ? 'Elapsed' : 'Published figure'}</th>
                <th>AI capability</th>
                <th>Binding</th>
              </tr>
            </thead>
            <tbody>
              {path.links.map((l) => (
                <tr key={l.seq}>
                  <td className="num">{l.seq}</td>
                  <td>{l.is_binding ? <strong>{l.link}</strong> : l.link}</td>
                  <td>{l.blocker}</td>
                  <td className={isTime ? 'num' : ''}>
                    {isTime ? `${l.duration_years} yr` : l.figure}
                  </td>
                  <td>
                    {l.ai_type}
                    <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>{l.maturity}</div>
                  </td>
                  <td>{l.is_binding ? <span className="tag new">binding</span> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            <ul style={{ fontSize: 15, marginTop: 16 }}>
              {path.links.map((l) => (
                <li key={l.seq}>
                  <strong>
                    {l.seq}. {l.link}
                  </strong>{' '}
                  — {l.rationale}
                  {l.evidence && (
                    <div style={{ color: 'var(--ink-3)', marginTop: 4 }}>Evidence: {l.evidence}</div>
                  )}
                </li>
              ))}
            </ul>
            <h4>Axes I deliberately left out of this chain</h4>
            <p style={{ fontSize: 15 }}>{path.axes_excluded}</p>
          </div>
        </details>
      </div>
    </div>
  );
}
