'use client';

// Both labeling passes, side by side. The working-now share was the headline of the
// first pass; a full independent relabel of all 103 gaps did not reproduce it. Showing
// the two columns is more honest than showing either alone, and it is the clearest
// evidence on the site that the method catches its own errors.
const ORDER = [
  'LLM reasoning and synthesis',
  'Coordination and institutional',
  'Sensing and signal processing',
  'ML surrogates and prediction',
  'Design and optimization search',
  'Autonomous experimentation',
  'Physical build and manipulation',
  'Real-time control of physical systems',
];

export default function RelabelCompare({ relabel }) {
  const pct = (x) => (x ? Math.round((100 * x.now) / x.n) : null);
  return (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            <th>Kind of work</th>
            <th className="num">First pass</th>
            <th className="num">Independent relabel</th>
            <th>Moved</th>
          </tr>
        </thead>
        <tbody>
          {ORDER.map((t) => {
            const a = relabel.v1[t];
            const b = relabel.v2[t];
            const pa = pct(a);
            const pb = pct(b);
            const delta = pa !== null && pb !== null ? pb - pa : null;
            return (
              <tr key={t}>
                <td>{t}</td>
                <td className="num">
                  {pa === null ? '—' : `${pa}%`}
                  {a && <span style={{ color: 'var(--ink-3)', fontSize: 13 }}> {a.now}/{a.n}</span>}
                </td>
                <td className="num">
                  {pb === null ? '—' : `${pb}%`}
                  {b && <span style={{ color: 'var(--ink-3)', fontSize: 13 }}> {b.now}/{b.n}</span>}
                </td>
                <td style={{ color: delta && Math.abs(delta) >= 20 ? 'var(--bind)' : 'var(--ink-3)' }}>
                  {delta === null ? 'new category' : delta === 0 ? 'held' : `${delta > 0 ? '+' : ''}${delta} points`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
