import data from '../../../public/data.json';
import Nav from '../../components/Nav';
import PageProvenance from '../../components/PageProvenance';
import { BarChart, CrossTab } from '../../components/Charts';
import RelabelCompare from '../../components/RelabelCompare';
import { TIER_ORDER, TIER_COLOR } from '../../lib/constants';

const byCount = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
const inOrder = (o, order) => order.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]);
const pct = (x) => `${Math.round(100 * x)}%`;

export const metadata = { title: 'Method, audit and what is wrong with this' };

export default function MethodPage() {
  const { summary: s, gaps, audit_summary: audit, runs, decisions } = data;
  const m = audit.dimensions.measurability;
  const mins = Math.round(
    runs
      .filter((r) => r.kind === 'agent' && r.ended_at && !r.phase.startsWith('revision'))
      .reduce(
        (a, r) => a + (new Date(r.ended_at.replace(' ', 'T').replace(/Z?$/, 'Z')) - new Date(r.started_at.replace(' ', 'T').replace(/Z?$/, 'Z'))),
        0
      ) / 60000
  );
  const indicators = gaps.flatMap((g) => g.indicators.map((i) => ({ ...i, gap: g.name, tier: g.tier })));
  const coordFlagged = gaps.filter(
    (g) =>
      g.primary_ai_type === 'Coordination and institutions' &&
      [g.outcome_confidence, g.tier_confidence, g.primary_confidence].includes('guess')
  ).length;
  const coordTotal = gaps.filter((g) => g.primary_ai_type === 'Coordination and institutions').length;

  return (
    <>
      <Nav here="method/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>Method, audit, and what is wrong with this</h1>
            <PageProvenance>
              This page was written by Claude, and so was everything it describes.
            </PageProvenance>
            <p className="lead">
              Everything that would make you trust the labels less is here, and{' '}
              <a href="https://github.com/dsendor/science-gap-map-analysis" target="_blank" rel="noreferrer">
                the whole thing is on GitHub
              </a>{' '}
              &mdash; every label, every rationale, and the scripts that rebuild the database from
              Convergent&rsquo;s own export.
            </p>
            <ul>
              <li>
                <strong>No human reviewed any label.</strong> All {s.n_gaps} gaps were labelled,
                audited and written up in {mins} minutes of agent time.
              </li>
              <li>
                <strong>A second pass relabelled all {s.n_gaps} blind</strong> and disagreed often
                enough to be worth publishing. The rates are below.
              </li>
              <li>
                <strong>Three cold reviews</strong> then read the artifact as one of you would, and
                found real errors. Those are below too.
              </li>
              <li>
                <strong>One finding was withdrawn</strong> after it failed to replicate.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="col">
            <details>
              <summary>The result that did not replicate, in full</summary>
              <div className="body">
<section>
          <div className="col">
            
            <p>
              This was on the front page and is no longer, because it is a fact about this analysis
              rather than about the map. It is here in full because withdrawing a finding quietly is
              worse than never publishing it.
            </p>
            <p>
              The first pass produced a clean gradient: the share of gaps each kind of work blocks
              where the AI for it already works ran from 60% for reading and synthesis down to 0% for
              physical build. A second pass relabelled all {data.relabel.n} gaps blind, against a
              revised taxonomy, by labelers who never saw the first set, with predictions registered
              in a commit beforehand. It did not reproduce that result.
            </p>
          </div>

          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <RelabelCompare relabel={data.relabel} />
              <figcaption style={{ marginTop: 14 }}>
                Share of each kind of work whose gaps have an AI capability that works today, in both
                passes. The two agreed on the kind of work for {data.relabel.type_agreed} of{' '}
                {data.relabel.n} gaps and on maturity for only {data.relabel.maturity_agreed}.
              </figcaption>
            </div>
          </figure>

          <div className="col">
            <p style={{ marginTop: 22 }}>
              The ordering inverts at the top. Coordination and institutions go from last place to
              first. Physical build is no longer zero. The gradient is withdrawn.
            </p>
            <p>
              The cause was a definitional hole I left open. Does &ldquo;working now&rdquo; mean the
              capability exists, or that applying it would move this gap? For technical categories
              those coincide. For institutional ones they come apart completely: convening a standards
              body is available this afternoon, and getting universal DNA-synthesis screening adopted
              is not. I labelled institutional gaps on efficacy and the relabelers read availability.
            </p>
            <p>
              A third pass repaired maturity against the sharper definition &mdash; applying it would
              move this gap &mdash; which is why coordination and institutional now has nothing in the
              working-now column. That is a definition being fixed, not a result being found, and it
              is the reason the argument page makes no claim about a gradient.
            </p>
          </div>
        </section>
              </div>
            </details>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I would not rely on</h2>
            <ul>
              <li>
                <strong>Maturity is the least reliable label here.</strong> The two independent passes
                agreed on the kind of work for {data.relabel.type_agreed} of {data.relabel.n} gaps and
                on maturity for only {data.relabel.maturity_agreed}. A third pass then repaired it
                against a sharper definition. Treat a single gap&rsquo;s maturity as a judgment, and
                the distribution as the thing worth reading.
              </li>
              <li>
                <strong>Every label is an AI judgment</strong>, not expert consensus, and no human has
                reviewed any of them.
              </li>
              <li>
                <strong>The argument leans on the category I was least sure of.</strong> Gaps whose
                primary blocker is coordination and institutional carry a confidence flag on some
                dimension {coordFlagged} times out of {coordTotal}.
              </li>
              <li>
                <strong>The kinds of work fuse two questions.</strong> What kind of work is in
                the way, and how mature the AI for it is, are separate facts sharing one axis. Every
                kind has an AI analogue, robotics included, so the axis is really about maturity and
                should probably be split in two.
              </li>
              <li>
                <strong>The tier confidence flag is close to a synonym for &ldquo;proxy only&rdquo;.</strong>{' '}
                Of the {s.confidence.tier.guess} flagged tiers, {s.tier['Proxy only']} come from one
                blanket rule and {s.confidence.tier.guess - (s.tier['Proxy only'] ?? 0)} are
                independent judgments.
              </li>
              <li>
                <strong>Outcomes are a text field on a gap.</strong> There are more outcomes than
                gaps, and one capability unlocks outcomes across several fields. Modelling them
                properly is a schema change.
              </li>
              <li>
                <strong>The indicators are a sample of eight</strong>, chosen across tiers. Nothing
                about them supports a claim about the other {s.n_gaps - 8}.
              </li>
              <li>
                <strong>Capability edges are untyped upstream</strong>, so the chains reconstruct link
                semantics by hand. That is why there are two of them.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="col">
            <details>
              <summary>The blind audit: how it was run and what it found</summary>
              <div className="body">
<section>
          <div className="col">
            
            <p>
              A second labeller, which never saw the first set, relabelled a stratified sample of{' '}
              {audit.n_sampled} of the {s.n_gaps} gaps. The sample oversamples the rare tiers on
              purpose, because that is where the taxonomy is hardest, so the raw rate is biased upward
              and the population-weighted figure is the one that means anything.
            </p>
            <div className="scroll">
              <table>
                <thead>
                  <tr>
                    <th>Stratum (original tier)</th>
                    <th className="num">In population</th>
                    <th className="num">Sampled</th>
                    <th className="num">Agreed</th>
                    <th className="num">Disagreement</th>
                  </tr>
                </thead>
                <tbody>
                  {m.strata.map((r) => (
                    <tr key={r.stratum}>
                      <td>{r.stratum}</td>
                      <td className="num">{r.population}</td>
                      <td className="num">{r.sampled}</td>
                      <td className="num">{r.agreed}</td>
                      <td className="num">{pct(r.disagreement)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}>
                      <strong>Raw sample disagreement</strong>{' '}
                      <span style={{ color: 'var(--ink-3)' }}>
                        ({m.agreed} of {m.n} agreed)
                      </span>
                    </td>
                    <td className="num">
                      <strong>{pct(m.raw_disagreement)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <strong>Weighted to the population</strong>{' '}
                      <span style={{ color: 'var(--ink-3)' }}>
                        (each stratum&rsquo;s rate by its share of the {s.n_gaps})
                      </span>
                    </td>
                    <td className="num">
                      <strong>{pct(m.weighted_disagreement)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 18 }}>
              <strong>One of my four tiers does not work.</strong> &ldquo;Proxy only&rdquo; ran{' '}
              {pct(m.strata.find((r) => r.stratum === 'Proxy only')?.disagreement ?? 0)} disagreement
              against 0% for directly measurable, and every auditor independently reported it was the
              nearest alternative and almost never the winner. If you adopt a measurability attribute,
              three tiers would work better than four. On the kind of work, raw sample disagreement was{' '}
              {pct(audit.dimensions.ai_type.raw_disagreement)}, and the audit found three gap types the
              seven-value list handles badly: closed-loop control of a physical system, gaps where AI
              is the object rather than the instrument, and composite gaps that would need different
              values for different sub-problems. The first became an eighth category, real-time
              control of physical systems, which four gaps took as primary in the relabel.
            </p>
            <details>
              <summary>Every disagreement, both dimensions</summary>
              <div className="body">
                <div className="scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Gap</th>
                        <th>Dimension</th>
                        <th>First labeller</th>
                        <th>Auditor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(audit.dimensions).flatMap(([dim, d]) =>
                        d.disagreements.map((x, i) => (
                          <tr key={`${dim}-${i}`}>
                            <td>{x.gap}</td>
                            <td>{dim === 'measurability' ? 'tier' : 'kind of work'}</td>
                            <td>{x.original}</td>
                            <td>{x.audit}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          </div>
        </section>
              </div>
            </details>
          </div>
        </section>

        <section>
          <div className="col">
            <details>
              <summary>Progress indicators, built and not proposed</summary>
              <div className="body">
<section>
          <div className="col">
            
            <p>
              Eight gaps across all four tiers. Every value was read off a page that was actually
              fetched. Four verify against Crossref or arXiv; two are reachable but not
              scholarly-verified and are recorded that way.
            </p>
            <div className="scroll">
              <table>
                <thead>
                  <tr>
                    <th>Gap</th>
                    <th>Tier</th>
                    <th>Quantity</th>
                    <th className="num">Current</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map((i, n) => (
                    <tr key={n}>
                      <td style={{ maxWidth: 200 }}>{i.gap}</td>
                      <td style={{ color: 'var(--ink-3)' }}>{i.tier}</td>
                      <td style={{ maxWidth: 240 }}>{i.quantity}</td>
                      <td className="num">
                        {i.is_null_result ? (
                          <span className="tag new">none found</span>
                        ) : (
                          <>
                            <strong>{i.current_value}</strong>{' '}
                            <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>{i.unit}</span>
                          </>
                        )}
                      </td>
                      <td style={{ fontSize: 13.5, maxWidth: 170 }}>
                        {i.source_url ? (
                          <a href={i.source_url} target="_blank" rel="noreferrer">
                            {i.source_title}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {indicators
              .filter((i) => i.is_null_result)
              .map((i, n) => (
                <div className="pull" key={n}>
                  <p style={{ fontSize: 15.5, marginBottom: 0 }}>
                    <strong>{i.gap.trim()}.</strong> {i.rationale}
                  </p>
                </div>
              ))}
          </div>
        </section>
              </div>
            </details>
          </div>
        </section>

        <section>
          <div className="col">
            <details>
              <summary>Distributions across all 103 gaps</summary>
              <div className="body">
<section>
          <div className="col">
            
          </div>
          <div className="grid2" style={{ marginTop: 18 }}>
            <figure className="card">
              <div className="pad">
                <h3 style={{ marginTop: 0, fontSize: 19 }}>Measurability tier</h3>
                <BarChart data={inOrder(s.tier, TIER_ORDER)} total={s.n_gaps} colorMap={TIER_COLOR} />
              </div>
            </figure>
            <figure className="card">
              <div className="pad">
                <h3 style={{ marginTop: 0, fontSize: 19 }}>Kind of work in the way</h3>
                <BarChart data={byCount(s.ai_type)} total={s.n_gaps} />
              </div>
            </figure>
          </div>
          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <h3 style={{ marginTop: 0, fontSize: 19 }}>Tier against kind of work</h3>
              <CrossTab crosstab={s.tier_by_ai_type} rowLabel="Kind of work" />
            </div>
          </figure>
          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <h3 style={{ marginTop: 0, fontSize: 19 }}>Tier against field</h3>
              <CrossTab crosstab={s.tier_by_field} rowLabel="Field" />
              <figcaption>
                Social Science is the outlier: {s.tier_by_field['Social Science']?.['Proxy only']} of
                its{' '}
                {Object.values(s.tier_by_field['Social Science'] ?? {}).reduce((a, b) => a + b, 0)}{' '}
                gaps are proxy-only, the highest share of any field.
              </figcaption>
            </div>
          </figure>
        </section>
              </div>
            </details>
          </div>
        </section>

        <section>
          <div className="col">
            <details>
              <summary>What it cost to build</summary>
              <div className="body">
<section>
          <div className="col">
            
            <div className="scroll">
              <table>
                <thead>
                  <tr>
                    <th>Phase</th>
                    <th>Kind</th>
                    <th className="num">Units</th>
                    <th className="num">Elapsed</th>
                    <th>What happened</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r, n) => {
                    const el = r.ended_at
                      ? Math.round(
                          (new Date(r.ended_at.replace(' ', 'T').replace(/Z?$/, 'Z')) -
                            new Date(r.started_at.replace(' ', 'T').replace(/Z?$/, 'Z'))) /
                            60000
                        )
                      : null;
                    return (
                      <tr key={n}>
                        <td>{r.phase}</td>
                        <td>{r.kind}</td>
                        <td className="num">{r.n_units ?? '—'}</td>
                        <td className="num">{el === null ? 'open' : `${el} min`}</td>
                        <td style={{ color: 'var(--ink-3)', fontSize: 14 }}>{r.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 16 }}>
              Agent time and human time are tracked separately, because a single blended number would
              be the first thing worth objecting to. Phase 0&rsquo;s start was never instrumented, so
              it counts as zero and the {mins} minutes for the build is a lower bound.
            </p>

            <h2 style={{ marginTop: 40 }}>Calls that could have gone the other way</h2>
            <p>
              {decisions.length} of them, each with the runner-up and what would reverse it. The
              runner-up was usually the more flattering option.
            </p>
            {decisions.map((d, n) => (
              <details key={n}>
                <summary>{d.decision}</summary>
                <div className="body">
                  <div className="why">
                    <div className="k">
                      {d.phase}, confidence {d.confidence}
                    </div>
                    <div className="t">{d.rationale}</div>
                  </div>
                  {d.runner_up && (
                    <div className="why">
                      <div className="k">Runner-up</div>
                      <div className="t">{d.runner_up}</div>
                    </div>
                  )}
                  <div className="why">
                    <div className="k">What would reverse it</div>
                    <div className="t">{d.reversal_condition}</div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
              </div>
            </details>
          </div>
        </section>
      </main>
      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a> ·{' '}
            <a href="../">The argument</a> · <a href="../map/">The extended map</a> ·{' '}
            <a href="../gap-map-augmented.csv">CSV</a>
          </p>
        </div>
      </div>
    </>
  );
}
