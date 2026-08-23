'use client';

import { useState } from 'react';

// Rendered as HTML/SVG rather than through a Mermaid runtime: the diagram is eight
// boxes and an arrow, a client-side renderer would be the single largest dependency
// in the build, and the Mermaid source is shipped below each chain for anyone who
// wants to paste it somewhere else. Binding links carry a heavier border AND the
// word "binding" in the table, so the distinction is never colour alone.

export default function Chain({ path, mermaid }) {
  const [openSrc, setOpenSrc] = useState(false);
  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <p className="eyebrow">{path.gap_field} · critical path</p>
      <h3 style={{ margin: '0 0 4px', fontSize: 19 }}>{path.title}</h3>
      <p className="note" style={{ marginBottom: 14 }}>
        Gap: {path.gap_name} · <strong>axis:</strong> {path.axis}
      </p>

      <div className="chain">
        {path.links.map((l) => (
          <div key={l.seq} className={l.is_binding ? 'node bind' : 'node'}>
            <span className="seq">
              {l.seq}
              {l.is_binding ? ' · binding' : ''}
            </span>
            {l.link}
          </div>
        ))}
      </div>
      <p className="note">
        {path.links.filter((l) => l.is_binding).length} of {path.links.length} links bind. A link that does not
        bind can be made instant without changing the total.
      </p>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', fontSize: 14, fontWeight: 550 }}>Axes deliberately excluded</summary>
        <p style={{ fontSize: 14, marginTop: 8 }}>{path.axes_excluded}</p>
      </details>

      <h4 style={{ fontSize: 14, margin: '20px 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
        Expectation, recorded before the analysis
      </h4>
      <p style={{ fontSize: 14 }}>{path.expectation}</p>

      <h4 style={{ fontSize: 14, margin: '20px 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
        What the chain showed
      </h4>
      {path.finding.split('\n\n').map((para, i) => (
        <p key={i} style={{ fontSize: 14 }}>
          {para}
        </p>
      ))}

      <div className="scroll" style={{ marginTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th className="num">#</th>
              <th>Link</th>
              <th>Blocker</th>
              <th>AI capability type</th>
              <th>Maturity</th>
              <th>Binding</th>
            </tr>
          </thead>
          <tbody>
            {path.links.map((l) => (
              <tr key={l.seq}>
                <td className="num">{l.seq}</td>
                <td style={{ fontWeight: l.is_binding ? 600 : 400 }}>{l.link}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{l.blocker}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{l.ai_type}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{l.maturity}</td>
                <td>{l.is_binding ? <span className="chip newgap">binding</span> : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', fontSize: 14 }} onClick={() => setOpenSrc(!openSrc)}>
          Evidence and rationale per link
        </summary>
        <ul style={{ fontSize: 13.5, color: 'var(--text-secondary)', paddingLeft: 18 }}>
          {path.links.map((l) => (
            <li key={l.seq} style={{ marginBottom: 10 }}>
              <strong>
                {l.seq}. {l.link}
              </strong>{' '}
              — {l.rationale}
              {l.evidence ? (
                <div style={{ color: 'var(--muted)', marginTop: 3 }}>Evidence: {l.evidence}</div>
              ) : null}
            </li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: 'pointer', fontSize: 14 }}>Mermaid source for this diagram</summary>
        <pre
          style={{
            fontSize: 12, overflowX: 'auto', background: 'var(--page)', padding: 12,
            borderRadius: 8, border: '1px solid var(--border)',
          }}
        >
          {mermaid}
        </pre>
      </details>
    </div>
  );
}
