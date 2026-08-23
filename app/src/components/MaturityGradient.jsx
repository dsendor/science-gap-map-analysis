'use client';

import { MATURITY_ORDER } from '../lib/constants';

// The claim is a gradient in the SHARE of each kind of work that AI can already do.
// The previous version of this chart plotted total gap counts and left the gradient to
// the caption, which meant the picture and the argument were different shapes. Bar
// length is now the share, rows are sorted by it, and the count rides along as text.
export default function MaturityGradient({ aiTypes, maturityByType }) {
  const rows = Object.keys(aiTypes)
    .map((type) => {
      const m = maturityByType[type] ?? {};
      const total = MATURITY_ORDER.reduce((a, k) => a + (m[k] ?? 0), 0);
      const now = m['Working now'] ?? 0;
      return { type, now, total, share: total ? now / total : 0 };
    })
    .sort((a, b) => b.share - a.share);

  return (
    <div className="gradient">
      {rows.map((r) => (
        <div className="grow" key={r.type}>
          <div className="glbl">{r.type}</div>
          <div className="gtrack">
            <div className="gfill" style={{ width: `${Math.max(r.share * 100, 0.6)}%` }} />
            {r.share === 0 && <span className="gzero">none</span>}
          </div>
          <div className="gval">
            {Math.round(r.share * 100)}%
            <span className="gn">
              {r.now} of {r.total}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
