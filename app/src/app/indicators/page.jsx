import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import { fieldColor } from '../../lib/fields';

export const metadata = { title: 'Progress indicators, and the two that came back empty' };

export default function IndicatorsPage() {
  const { gaps, summary: s } = data;
  const rows = gaps.flatMap((g) =>
    g.indicators.map((i) => ({ ...i, gap: g.name.trim(), field: g.field, tier: g.tier }))
  );
  const found = rows.filter((r) => !r.is_null_result);
  const nulls = rows.filter((r) => r.is_null_result);

  return (
    <>
      <Nav here="indicators/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>Progress indicators</h1>
            <p className="lead">
              If you wanted to know whether a gap is closing, what number would you watch? I tried to
              answer that for eight gaps, picked across all four measurability tiers so the set could
              not be read as choosing the easy ones.
            </p>
            <p>
              Six have a number. Two do not, after a genuine search, and those two are the more
              useful rows. Every value here was read off a page that was actually fetched rather than
              off a search snippet. Four verify against Crossref or arXiv; two are reachable but not
              scholarly-verified, and are recorded that way rather than counted as passes.
            </p>
            <p>
              Eight is a feasibility probe, not coverage. Nothing here supports a claim about the
              other {s.n_gaps - 8} gaps.
            </p>
          </div>
        </section>

        <section style={{ paddingTop: 10 }}>
          {found.map((r, n) => (
            <div className="card" key={n} style={{ marginBottom: 14 }}>
              <div className="pad">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span className="field-pill" style={{ borderColor: fieldColor(r.field) }}>
                    {r.field}
                  </span>
                  <span className="tag">{r.tier}</span>
                  <span className="tag">source {r.source_checked}</span>
                  {r.confidence === 'guess' && <span className="tag flag">guess</span>}
                </div>
                <h2 style={{ fontSize: 19, margin: '0 0 4px' }}>{r.gap}</h2>
                <p style={{ fontSize: 15, color: 'var(--ink-3)', margin: '0 0 14px' }}>{r.quantity}</p>
                <p style={{ fontSize: 26, fontFamily: 'var(--font-serif)', color: 'var(--ink)', margin: '0 0 6px' }}>
                  {r.current_value}{' '}
                  <span style={{ fontSize: 16, color: 'var(--ink-2)' }}>{r.unit}</span>
                </p>
                <p style={{ fontSize: 14.5, color: 'var(--ink-3)', marginBottom: 0 }}>
                  as of {r.as_of} ·{' '}
                  <a href={r.source_url} target="_blank" rel="noreferrer">
                    {r.source_title}
                  </a>
                  {r.target_value ? ` · target: ${r.target_value}` : ' · no defensible target recorded'}
                </p>
              </div>
              <div className="pad">
                <p style={{ fontSize: 15, marginBottom: 0 }}>{r.rationale}</p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <div className="col">
            <h2>The two that came back empty</h2>
            <p>
              Each of these had six substantively different searches behind it, all cached and logged,
              before I wrote it off. Both name the closest thing I found and why it does not qualify.
            </p>
          </div>
          {nulls.map((r, n) => (
            <div className="card" key={n} style={{ marginTop: 16, borderColor: 'var(--bind)' }}>
              <div className="pad">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span className="field-pill" style={{ borderColor: fieldColor(r.field) }}>
                    {r.field}
                  </span>
                  <span className="tag">{r.tier}</span>
                  <span className="tag new">no indicator found</span>
                </div>
                <h2 style={{ fontSize: 19, margin: '0 0 12px' }}>{r.gap}</h2>
                <p style={{ fontSize: 15.5, marginBottom: 0 }}>{r.rationale}</p>
              </div>
            </div>
          ))}
          <div className="col">
            <p style={{ marginTop: 22 }}>
              These two are the argument for a measurability attribute. A gap in the bottom two tiers
              is not one that nobody has bothered to measure. It is one where measurement does not
              settle the question, and knowing that in advance is worth as much as a number.
            </p>
          </div>
        </section>
      </main>
      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a> ·{' '}
            <a href="../">The argument</a> · <a href="../map/">The extended map</a> ·{' '}
            <a href="../method/">Method &amp; audit</a>
          </p>
        </div>
      </div>
    </>
  );
}
