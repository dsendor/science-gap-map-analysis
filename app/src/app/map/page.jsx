import data from '../../../public/data.json';
import Masthead from '../../components/Masthead';
import GapTable from '../../components/GapTable';
import { BarChart, CrossTab } from '../../components/Charts';
import { TIER_ORDER, TIER_COLOR } from '../../lib/constants';

const byCount = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
const inOrder = (o, order) => order.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]);
const pct = (x) => `${Math.round(100 * x)}%`;

function agentMinutes(runs) {
  return Math.round(
    runs
      .filter((r) => r.kind === 'agent' && r.ended_at)
      .reduce(
        (a, r) =>
          a + (new Date(`${r.ended_at.replace(' ', 'T')}Z`) - new Date(`${r.started_at.replace(' ', 'T')}Z`)),
        0
      ) / 60000
  );
}

export const metadata = {
  title: 'The extended map — all 103 gaps, cross-tabs and method',
};

export default function MapPage() {
  const { summary: s, gaps, new_gaps: newGaps, audit_summary: audit, runs, decisions } = data;
  const mins = agentMinutes(runs);
  const m = audit.dimensions.measurability;

  return (
    <>
      <Masthead active="map" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>The extended map</h1>
            <p className="tag on" style={{ display: 'inline-block', marginBottom: 14 }}>
              David Sendor&rsquo;s annotations over Convergent Research&rsquo;s data
            </p>
            <p className="lead">
              All {s.n_gaps} of Convergent Research&rsquo;s gaps in their own export order, with the
              four added attributes and the reasoning behind each one. Filter it, or take the CSV —
              it is keyed on their <code>id</code> and <code>slug</code>, so it joins straight back
              to their data.
            </p>
            <p>
              <a href="../gap-map-augmented.csv">Download the CSV</a> ·{' '}
              <a href="../data.json">Download the JSON</a> · <a href="../">Back to the argument</a>
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>Browse</h2>
            <p>
              Each row opens to show the outcome, the AI capability type and maturity, the
              measurability tier, the reasoning for each, and — where the sample covers it — the
              progress indicator. Proposed additions are marked and can be switched off.
            </p>
          </div>
          <div style={{ marginTop: 20 }}>
            <GapTable gaps={gaps} newGaps={newGaps} />
          </div>
        </section>

        <section>
          <div className="col">
            <h2>Distributions</h2>
          </div>
          <div className="grid2" style={{ marginTop: 20 }}>
            <figure className="card">
              <div className="pad">
                <h3 style={{ marginTop: 0, fontSize: 19 }}>Measurability tier</h3>
                <BarChart data={inOrder(s.tier, TIER_ORDER)} total={s.n_gaps} colorMap={TIER_COLOR} />
                <figcaption>Tiers in their own order, not sorted by count.</figcaption>
              </div>
            </figure>
            <figure className="card">
              <div className="pad">
                <h3 style={{ marginTop: 0, fontSize: 19 }}>Primary AI capability type</h3>
                <BarChart data={byCount(s.ai_type)} total={s.n_gaps} />
                <figcaption>One primary per gap; secondaries are in the rows above.</figcaption>
              </div>
            </figure>
          </div>

          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <h3 style={{ marginTop: 0, fontSize: 19 }}>Tier against capability type</h3>
              <CrossTab crosstab={s.tier_by_ai_type} />
              <figcaption>
                Design and optimization search is directly measurable in all{' '}
                {s.tier_by_ai_type['Design and optimization search']?.['Directly measurable']} of its
                cases — where the answer is checkable, both the AI and the measurement work.
                Coordination and institutional is the only type with a counterfactual-required gap.
              </figcaption>
            </div>
          </figure>

          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <h3 style={{ marginTop: 0, fontSize: 19 }}>Tier against field</h3>
              <CrossTab crosstab={s.tier_by_field} rowLabel="Field" />
              <figcaption>
                Social Science is the outlier: {s.tier_by_field['Social Science']?.['Proxy only']} of
                its {Object.values(s.tier_by_field['Social Science'] ?? {}).reduce((a, b) => a + b, 0)}{' '}
                gaps are proxy-only, the highest share of any field.
              </figcaption>
            </div>
          </figure>
        </section>

        <section>
          <div className="col">
            <h2>The blind audit</h2>
            <p>
              A second labeller, which never saw the first set of labels, independently relabelled a
              stratified sample of {audit.n_sampled} of the {s.n_gaps} gaps. The sample deliberately
              oversamples the rare tiers, because that is where the taxonomy is hardest — which
              biases the raw rate upward, so the population-weighted figure is the one that means
              anything.
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
                        (each stratum&rsquo;s rate × its share of the {s.n_gaps})
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
              On primary AI capability type the raw sample disagreement was{' '}
              {pct(audit.dimensions.ai_type.raw_disagreement)}. The audit also surfaced three cases
              where the seven-type taxonomy has no right answer, all found independently by
              different auditors: closed-loop control of a physical system, gaps where AI is the
              object rather than the instrument, and composite gaps that bundle sub-problems needing
              different types and different tiers.
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
                            <td>{dim === 'measurability' ? 'tier' : 'AI type'}</td>
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

        <section>
          <div className="col">
            <h2>Method, and what it cost</h2>
            <p>
              Six phases, {mins} minutes of agent time, and — at the time of writing —{' '}
              <strong>zero minutes of human review</strong>. Those two are tracked separately on
              purpose, because a single blended number would be the first thing worth objecting to.
              Phase 0&rsquo;s start was never instrumented, so it counts as zero and the total is a
              lower bound.
            </p>
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
                          (new Date(`${r.ended_at.replace(' ', 'T')}Z`) -
                            new Date(`${r.started_at.replace(' ', 'T')}Z`)) /
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

            <h3>Limitations, stated by me rather than found by you</h3>
            <ul>
              <li>
                <strong>Every label is an AI judgment</strong>, not expert consensus, and no human
                has reviewed any of them yet. The disagreement rates above are the honest measure of
                how much weight they bear.
              </li>
              <li>
                <strong>Outcomes are not modelled properly.</strong> An outcome is a text field on a
                gap. There are almost certainly more outcomes than gaps, and one capability can
                unlock outcomes across several fields.
              </li>
              <li>
                <strong>The indicators are a sample of eight</strong>, chosen across tiers, and
                nothing about them supports a statement about the other {s.n_gaps - 8}.
              </li>
              <li>
                <strong>The tier confidence flag is close to a synonym for &ldquo;proxy
                only&rdquo;</strong>, because every proxy-only tier was downgraded as a class. Of the{' '}
                {s.confidence.tier.guess} flagged tiers, {s.tier['Proxy only']} are that rule and
                only {s.confidence.tier.guess - (s.tier['Proxy only'] ?? 0)} are independent
                judgments.
              </li>
              <li>
                <strong>Capability edges are untyped upstream</strong> — nothing marks a capability
                as necessary, sufficient or partial for its gap — so the chains reconstruct link
                semantics by hand, which is why there are two of them and not {s.n_gaps}.
              </li>
            </ul>

            <h3>The decision ledger</h3>
            <p>
              {decisions.length} calls that could reasonably have gone the other way, each with the
              runner-up and what would reverse it. They are published because the runner-up was
              usually the more flattering option.
            </p>
            {decisions.map((d, n) => (
              <details key={n}>
                <summary>{d.decision}</summary>
                <div className="body">
                  <div className="why">
                    <div className="k">{d.phase} · confidence {d.confidence}</div>
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
      </main>

      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            <a href="../">Back to the argument</a> ·{' '}
            <a href="../gap-map-augmented.csv">CSV</a> · <a href="../data.json">JSON</a> · David
            Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
