'use client';

import { useMemo, useState } from 'react';
import { TIER_ORDER, MATURITY_ORDER } from '../lib/constants';

// Their 103 gaps in THEIR export order, with the four added columns. Nothing here
// sorts by anything that could read as a ranking; the only reorder available is
// alphabetical by field, which is a lookup aid rather than a judgment.
//
// Every added judgment shows its rationale in the open row rather than behind a
// tooltip nobody hovers, and every 'guess' is visible in the closed row.

export default function GapTable({ gaps, newGaps }) {
  const [field, setField] = useState('');
  const [tier, setTier] = useState('');
  const [aiType, setAiType] = useState('');
  const [maturity, setMaturity] = useState('');
  const [onlyGuess, setOnlyGuess] = useState(false);
  const [showProposed, setShowProposed] = useState(true);
  const [q, setQ] = useState('');

  const proposed = useMemo(
    () =>
      newGaps.map((n) => ({
        id: n.id,
        slug: n.slug,
        name: n.name,
        field: n.field,
        description: n.description,
        outcome: n.outcome,
        outcome_rationale: n.rationale,
        outcome_confidence: n.confidence,
        tier: n.tier,
        tier_rationale: n.rationale,
        tier_confidence: n.confidence,
        primary_ai_type: n.ai_type,
        primary_maturity: n.maturity,
        primary_rationale: n.rationale,
        primary_confidence: n.confidence,
        ai_types: [],
        indicators: [],
        capabilities: [],
        is_new: 1,
        tension_test: n.tension_test,
        unlock_test: n.unlock_test,
        dedup_check: n.dedup_check,
        funding_check: n.funding_check,
      })),
    [newGaps]
  );

  const all = useMemo(() => [...gaps, ...(showProposed ? proposed : [])], [gaps, proposed, showProposed]);
  const fields = useMemo(() => [...new Set(gaps.map((g) => g.field))].sort(), [gaps]);
  const aiTypes = useMemo(() => [...new Set(gaps.map((g) => g.primary_ai_type).filter(Boolean))].sort(), [gaps]);

  const rows = all.filter((g) => {
    if (field && g.field !== field) return false;
    if (tier && g.tier !== tier) return false;
    if (aiType && g.primary_ai_type !== aiType) return false;
    if (maturity && g.primary_maturity !== maturity) return false;
    if (onlyGuess && ![g.outcome_confidence, g.tier_confidence, g.primary_confidence].includes('guess')) return false;
    if (q && !(`${g.name} ${g.description ?? ''} ${g.outcome ?? ''}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const nGuess = rows.filter((g) =>
    [g.outcome_confidence, g.tier_confidence, g.primary_confidence].includes('guess')
  ).length;

  return (
    <>
      <div className="filters">
        <label>
          Field
          <select value={field} onChange={(e) => setField(e.target.value)}>
            <option value="">All fields</option>
            {fields.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <label>
          Measurability tier
          <select value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="">All tiers</option>
            {TIER_ORDER.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Primary AI capability type
          <select value={aiType} onChange={(e) => setAiType(e.target.value)}>
            <option value="">All types</option>
            {aiTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Maturity
          <select value={maturity} onChange={(e) => setMaturity(e.target.value)}>
            <option value="">Any maturity</option>
            {MATURITY_ORDER.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          Search
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="name, description, outcome" />
        </label>
        <label style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <input type="checkbox" aria-label="Show only rows with a label flagged as a guess" checked={onlyGuess} onChange={(e) => setOnlyGuess(e.target.checked)} />
          only rows with a guess
        </label>
        <label style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <input type="checkbox" aria-label="Include the four proposed additions in the list" checked={showProposed} onChange={(e) => setShowProposed(e.target.checked)} />
          include proposed additions
        </label>
      </div>

      <p style={{ marginBottom: 12, fontSize: 14.5, color: 'var(--ink-3)' }}>
        Showing {rows.length} of {all.length} rows
        {showProposed ? ` (${gaps.length} of theirs, ${proposed.length} proposed)` : ` (theirs only)`} ·{' '}
        {nGuess} of the {rows.length} carry at least one label flagged{' '}
        <span className="tag flag">guess</span> · order is Convergent&rsquo;s export order, not a ranking
      </p>

      <div>
        {rows.map((g) => (
          <GapRow key={g.id} g={g} />
        ))}
        {rows.length === 0 && <p style={{ color: 'var(--ink-3)' }}>No gaps match those filters.</p>}
      </div>
    </>
  );
}

function Conf({ c }) {
  return c === 'guess' ? <span className="tag flag">guess</span> : <span className="tag">confident</span>;
}

function GapRow({ g }) {
  const flagged = [g.outcome_confidence, g.primary_confidence, g.tier_confidence].includes('guess');
  return (
    <details className="gaprow">
      <summary>
        <div>
          <div className="name">
            {g.is_new ? <span className="tag new" style={{ marginRight: 7 }}>proposed</span> : null}
            {g.name}
          </div>
          {/* The outcome sits in the closed row on purpose: it is the most useful of the
              four attributes and the only one that is invisible from a label alone. */}
          {g.outcome && <div className="outcome">{g.outcome}</div>}
          <div className="meta">
            {g.field} · {g.tier ?? '—'} · {g.primary_ai_type ?? '—'} ({g.primary_maturity ?? '—'})
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {flagged && <span className="tag flag">guess</span>}
          {g.indicators?.length > 0 && (
            <span className="tag">{g.indicators[0].is_null_result ? 'indicator: null' : 'indicator'}</span>
          )}
        </div>
      </summary>
      <div className="body">
        <p style={{ fontSize: 14 }}>{g.description}</p>

        <div className="why">
          <div className="k">Why that outcome <Conf c={g.outcome_confidence} /></div>
          <div className="t">{g.outcome_rationale}</div>
        </div>

        <div className="why">
          <div className="k">
            AI capability type — {g.primary_ai_type} · {g.primary_maturity} <Conf c={g.primary_confidence} />
          </div>
          <div className="t">{g.primary_rationale}</div>
          {g.ai_types?.filter((t) => !t.is_primary).length > 0 && (
            <ul style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
              {g.ai_types
                .filter((t) => !t.is_primary)
                .map((t) => (
                  <li key={t.ai_type}>
                    {t.ai_type} ({t.maturity}) — {t.rationale}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="why">
          <div className="k">Measurability tier — {g.tier} <Conf c={g.tier_confidence} /></div>
          <div className="t">{g.tier_rationale}</div>
        </div>

        {g.indicators?.map((i, n) => (
          <div className="why" key={n}>
            <div className="k">
              Progress indicator — {i.quantity} <Conf c={i.confidence} />
              {i.is_null_result ? <span className="chip" style={{ marginLeft: 6 }}>honest null</span> : null}
            </div>
            {!i.is_null_result && (
              <div className="t">
                <strong>
                  {i.current_value} {i.unit}
                </strong>{' '}
                as of {i.as_of}
                {i.target_value ? ` · target ${i.target_value}` : ' · no defensible target recorded'}
                {' · '}
                <a href={i.source_url} target="_blank" rel="noreferrer">
                  {i.source_title}
                </a>{' '}
                <span className="tag">source {i.source_checked}</span>
              </div>
            )}
            <div className="t" style={{ fontSize: 13, marginTop: 4 }}>{i.rationale}</div>
          </div>
        ))}

        {g.is_new ? (
          <>
            <div className="why">
              <div className="k">Productive tension test</div>
              <div className="t">{g.tension_test}</div>
            </div>
            <div className="why">
              <div className="k">Downstream unlock test</div>
              <div className="t">{g.unlock_test}</div>
            </div>
            <div className="why">
              <div className="k">Near-duplicate check</div>
              <div className="t">{g.dedup_check}</div>
            </div>
            <div className="why">
              <div className="k">Funding check</div>
              <div className="t">{g.funding_check}</div>
            </div>
          </>
        ) : (
          g.capabilities?.length > 0 && (
            <p style={{ marginTop: 12, fontSize: 14.5, color: 'var(--ink-3)' }}>
              Their foundational capabilities for this gap: {g.capabilities.map((c) => c.name).join(' · ')}
            </p>
          )
        )}
      </div>
    </details>
  );
}
