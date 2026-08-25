'use client';

import { useState } from 'react';
import { fieldColor } from '../lib/fields';

// Their card, with their problem statement kept intact and the added outcome beside
// it. The "N Capabilities" disclosure copies the control on gap-map.org so the card
// behaves the way a reader of their site expects.
// Each tag used to sit in an unlabelled row, so a reader met "Coordination and
// institutional / Working now / Proxy only / guess" with no way to tell which
// question each one answered. The caption is the answer to "what is this?".
function Attr({ cap, cls, title, children }) {
  return (
    <span className="attr" title={title}>
      <span className="attr__cap">{cap}</span>
      <span className={cls ? `tag ${cls}` : 'tag'}>{children}</span>
    </span>
  );
}

export default function GapCard({ gap }) {
  const [open, setOpen] = useState(false);
  const caps = gap.capabilities ?? [];
  const ind = gap.indicators?.[0];
  const flagged = [gap.outcome_confidence, gap.primary_confidence, gap.tier_confidence].includes('guess');

  return (
    <div className="gcard">
      <div className="gcard__head">
        <h2 className="gcard__title">
          {!!gap.is_new && <span className="tag new" style={{ marginRight: 8, verticalAlign: 'middle' }}>proposed</span>}
          {gap.slug && !gap.is_new ? (
            <a
              href={`https://www.gap-map.org/gaps/${gap.slug}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {gap.name}
            </a>
          ) : (
            gap.name
          )}
        </h2>
        <span className="field-pill" style={{ borderColor: fieldColor(gap.field) }}>
          {gap.field}
        </span>
      </div>

      <div className="gcard__body">
        <p className="gcard__theirs">{gap.description}</p>
        {gap.outcome && (
          <p className="gcard__ours">
            <span className="k">If this closes</span>
            {gap.outcome}
          </p>
        )}
      </div>

      <div className="gcard__attrs">
        <Attr cap="Primary blocker" title="The kind of work standing between here and the gap closing. Not a claim that AI does this.">
          {gap.primary_ai_type}
        </Attr>
        <Attr cap="AI acceleration" title="Whether an AI capability that would move this kind of work exists today, is two to five years out, or is speculative.">
          {gap.primary_maturity}
        </Attr>
        <Attr cap="Measurability" title="Whether progress on this gap has an agreed observable.">
          {gap.tier}
        </Attr>
        {flagged && (
          <Attr cap="Confidence" cls="flag" title="At least one label on this gap is a judgment call rather than a confident read.">
            guess
          </Attr>
        )}
        {ind && (
          <Attr cap="Indicator" cls="on" title="The number to watch to know whether this gap is closing.">
            {ind.is_null_result ? 'none found' : `${ind.current_value} ${ind.unit ?? ''}`}
          </Attr>
        )}
      </div>

      {(caps.length > 0 || gap.is_new) && (
        <div className="gcard__foot">
          <button
            className="capbtn"
            aria-expanded={open}
            aria-label={
              gap.is_new ? 'Show the checks behind this proposed gap' : `Show ${caps.length} related capabilities and the reasoning`
            }
            onClick={() => setOpen(!open)}
          >
            <span>
              {gap.is_new ? 'Checks and reasoning' : `${caps.length} Capabilities, and why these labels`}
            </span>
            <span className="icon">{open ? '▲' : '▼'}</span>
          </button>
          {open && (
            <div className="capwrap">
              {caps.length > 0 && (
                <>
                  <div className="why">
                    <div className="k">Their foundational capabilities</div>
                    <ul style={{ marginTop: 6 }}>
                      {caps.map((c) => (
                        <li key={c.id}>
                          <strong>{c.name}</strong>
                          {c.description ? ` — ${c.description}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              {gap.is_new ? (
                <>
                  <Why k="Nearest thing already in your map" t={gap.nearest} />
                  <Why k="Productive tension" t={gap.tension_test} />
                  <Why k="Downstream unlock" t={gap.unlock_test} />
                  <Why k="Near-duplicate check, in full" t={gap.dedup_check} />
                  <Why k="Funding check" t={gap.funding_check} />
                </>
              ) : (
                <>
                  <Why k={`Outcome (${gap.outcome_confidence})`} t={gap.outcome_rationale} />
                  <Why
                    k={`${gap.primary_ai_type}, ${gap.primary_maturity} (${gap.primary_confidence})`}
                    t={gap.primary_rationale}
                  />
                  {gap.ai_types?.filter((t) => !t.is_primary).length > 0 && (
                    <Why
                      k="Also in play"
                      t={gap.ai_types
                        .filter((t) => !t.is_primary)
                        .map((t) => `${t.ai_type} (${t.maturity}): ${t.rationale}`)
                        .join(' ')}
                    />
                  )}
                  <Why k={`${gap.tier} (${gap.tier_confidence})`} t={gap.tier_rationale} />
                  {ind && <Why k={`Indicator: ${ind.quantity}`} t={ind.rationale} />}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Why({ k, t }) {
  if (!t) return null;
  return (
    <div className="why">
      <div className="k">{k}</div>
      <div className="t">{t}</div>
    </div>
  );
}
