'use client';

// One axis, one hue for single-series magnitude, ordinal ramps where the categories
// are ordered, and a direct label on every mark. No chart here has two y-scales and
// nothing is sorted by anything that could read as a rank: tiers and maturities are
// in their own order, AI types in descending count, which is a count, not a ranking.

import { TIER_ORDER, MATURITY_ORDER, MATURITY_COLOR } from '../lib/constants';

export function BarChart({ data, total, color = 'var(--series-1)', colorMap }) {
  const max = Math.max(...data.map((d) => d[1]), 1);
  return (
    <div className="bars">
      {data.map(([k, v]) => (
        <Row key={k} k={k} v={v} max={max} total={total} color={colorMap?.[k] ?? color} />
      ))}
    </div>
  );
}

function Row({ k, v, max, total, color }) {
  return (
    <>
      <div className="lbl">{k}</div>
      <div className="track">
        <div className="fill" style={{ width: `${(100 * v) / max}%`, background: color }} />
      </div>
      <div className="val">
        {v}
        {total ? <span style={{ color: 'var(--muted)' }}> · {Math.round((100 * v) / total)}%</span> : null}
      </div>
    </>
  );
}

export function StackedMaturity({ rows }) {
  // Row width is proportional to the row total, so bar length reads as a count.
  // Normalising every row to full width would make 5 gaps look like 21.
  const totals = rows.map(([, c]) => MATURITY_ORDER.reduce((a, m) => a + (c[m] ?? 0), 0));
  const max = Math.max(...totals, 1);
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr max-content', gap: '6px 12px', alignItems: 'center' }}>
        {rows.map(([label, counts], i) => {
          const t = totals[i];
          return (
            <Fragment2 key={label}>
              <div className="lbl" style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'right' }}>
                {label}
              </div>
              <div className="stack" style={{ width: `${(100 * t) / max}%` }} title={`${label}: ${t} gaps`}>
                {MATURITY_ORDER.map((m) =>
                  counts[m] ? (
                    <span
                      key={m}
                      style={{ flex: counts[m], background: MATURITY_COLOR[m], color: m === 'Working now' ? '#0b0b0b' : '#fff' }}
                    >
                      {counts[m]}
                    </span>
                  ) : null
                )}
              </div>
              <div className="val" style={{ fontSize: 13 }}>{t}</div>
            </Fragment2>
          );
        })}
      </div>
      <div className="legend">
        {MATURITY_ORDER.map((m) => (
          <span key={m}>
            <i style={{ background: MATURITY_COLOR[m] }} />
            {m}
          </span>
        ))}
      </div>
    </>
  );
}

function Fragment2({ children }) {
  return <>{children}</>;
}

export function CrossTab({ crosstab, cols = TIER_ORDER, rowLabel = 'Primary AI type' }) {
  const rows = Object.keys(crosstab).sort();
  const max = Math.max(...rows.flatMap((r) => cols.map((c) => crosstab[r][c] ?? 0)), 1);
  const shade = (v) => {
    if (!v) return 'var(--heat-0)';
    const s = Math.ceil((5 * v) / max);
    return `var(--heat-${Math.max(1, Math.min(5, s))})`;
  };
  const ink = (v) => (v && Math.ceil((5 * v) / max) >= 3 ? '#fff' : 'var(--text-primary)');
  return (
    <div className="scroll">
      <table className="heat">
        <thead>
          <tr>
            <th>{rowLabel}</th>
            {cols.map((c) => (
              <th key={c} className="num" style={{ textAlign: 'center' }}>
                {c}
              </th>
            ))}
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const t = cols.reduce((a, c) => a + (crosstab[r][c] ?? 0), 0);
            return (
              <tr key={r}>
                <td>{r}</td>
                {cols.map((c) => {
                  const v = crosstab[r][c] ?? 0;
                  return (
                    <td key={c} className="cell" style={{ background: shade(v), color: ink(v) }}>
                      {v || '·'}
                    </td>
                  );
                })}
                <td className="num">{t}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

