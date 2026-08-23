'use client';

import { useMemo, useState } from 'react';
import GapCard from './GapCard';
import { fieldColor } from '../lib/fields';
import { TIER_ORDER, MATURITY_ORDER } from '../lib/constants';

export default function MapBrowser({ gaps, newGaps }) {
  const [fields, setFields] = useState(() => new Set());
  const [tier, setTier] = useState('');
  const [kind, setKind] = useState('');
  const [maturity, setMaturity] = useState('');
  const [q, setQ] = useState('');
  const [showProposed, setShowProposed] = useState(true);

  const proposed = useMemo(
    () =>
      newGaps.map((n) => ({
        ...n,
        primary_ai_type: n.ai_type,
        primary_maturity: n.maturity,
        outcome_confidence: n.confidence,
        primary_confidence: n.confidence,
        tier_confidence: n.confidence,
        capabilities: [],
        indicators: [],
        ai_types: [],
        is_new: 1,
      })),
    [newGaps]
  );

  const all = useMemo(() => [...gaps, ...(showProposed ? proposed : [])], [gaps, proposed, showProposed]);
  const allFields = useMemo(() => {
    const counts = {};
    for (const g of gaps) counts[g.field] = (counts[g.field] ?? 0) + 1;
    return Object.keys(counts).sort().map((f) => ({ field: f, n: counts[f] }));
  }, [gaps]);
  const kinds = useMemo(
    () => [...new Set(gaps.map((g) => g.primary_ai_type).filter(Boolean))].sort(),
    [gaps]
  );

  const toggle = (f) =>
    setFields((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });

  const rows = all.filter((g) => {
    if (fields.size && !fields.has(g.field)) return false;
    if (tier && g.tier !== tier) return false;
    if (kind && g.primary_ai_type !== kind) return false;
    if (maturity && g.primary_maturity !== maturity) return false;
    if (q && !`${g.name} ${g.description ?? ''} ${g.outcome ?? ''}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="browse">
      <aside className="fieldfilter">
        <div className="fieldfilter__head">
          <span>Filter by Field</span>
          <span>
            <button onClick={() => setFields(new Set())}>All</button>
          </span>
        </div>
        <ul>
          {allFields.map(({ field, n }) => (
            <li key={field}>
              <label>
                <input
                  type="checkbox"
                  checked={fields.has(field)}
                  onChange={() => toggle(field)}
                  style={{ accentColor: fieldColor(field) }}
                />
                <span className="swatch" style={{ background: fieldColor(field) }} />
                {field} <span className="n">({n})</span>
              </label>
            </li>
          ))}
        </ul>
      </aside>

      <div>
        <div className="filters">
          <label>
            Search
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="name, problem, outcome" />
          </label>
          <label>
            Measurability
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
              <option value="">All tiers</option>
              {TIER_ORDER.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Kind of work in the way
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="">All kinds</option>
              {kinds.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            AI maturity
            <select value={maturity} onChange={(e) => setMaturity(e.target.value)}>
              <option value="">Any</option>
              {MATURITY_ORDER.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 15 }}>
            <input
              type="checkbox"
              aria-label="Include the four proposed gaps in the list"
              checked={showProposed}
              onChange={(e) => setShowProposed(e.target.checked)}
            />
            include proposed gaps
          </label>
        </div>
        <p style={{ fontSize: 14.5, color: 'var(--ink-3)', margin: '0 0 16px' }}>
          Showing {rows.length} of {all.length}. Your export order, not a ranking.
        </p>
        {rows.map((g) => (
          <GapCard key={g.id} gap={g} />
        ))}
        {rows.length === 0 && <p style={{ color: 'var(--ink-3)' }}>Nothing matches those filters.</p>}
      </div>
    </div>
  );
}
