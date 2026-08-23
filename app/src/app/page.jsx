import data from '../../public/data.json';
import GapTable from '../components/GapTable';
import Chain from '../components/Chain';
import { MERMAID } from '../components/mermaid';
import { BarChart, StackedMaturity, CrossTab } from '../components/Charts';
import { TIER_ORDER, MATURITY_ORDER, TIER_COLOR } from '../lib/constants';

const pct = (x) => `${Math.round(100 * x)}%`;
const byCount = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
const inOrder = (o, order) => order.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]);

function agentMinutes(runs) {
  return Math.round(
    runs
      .filter((r) => r.kind === 'agent' && r.ended_at)
      .reduce((a, r) => a + (new Date(`${r.ended_at.replace(' ', 'T')}Z`) - new Date(`${r.started_at.replace(' ', 'T')}Z`)), 0) / 60000
  );
}

export default function Page() {
  const { summary: s, gaps, new_gaps: newGaps, critical_paths: paths, audit_summary: audit, runs, decisions } = data;
  const mins = agentMinutes(runs);
  const workingNowShare = byCount(s.ai_type).map(([t]) => {
    const m = s.maturity_by_ai_type[t] ?? {};
    const tot = MATURITY_ORDER.reduce((a, k) => a + (m[k] ?? 0), 0);
    return { type: t, now: m['Working now'] ?? 0, tot };
  });
  const indicators = gaps.flatMap((g) => g.indicators.map((i) => ({ ...i, gap: g.name, field: g.field, tier: g.tier })));

  return (
    <main>
      <header className="masthead">
        <div className="wrap">
          <p className="eyebrow">A contribution to the Fundamental Development Gap Map</p>
          <h1>Their map, with four columns added and every judgment showing its reasoning</h1>
          <p className="lead">
            Convergent Research&rsquo;s{' '}
            <a href={s ? data.source.url : '#'} target="_blank" rel="noreferrer">
              Fundamental Development Gap Map v1.0
            </a>{' '}
            catalogues {s.n_gaps} R&amp;D gaps and {s.n_capabilities} foundational capabilities across {s.n_fields}{' '}
            fields. This page adds four things it does not have, for every one of those gaps: a stated{' '}
            <strong>outcome</strong>, an <strong>AI capability type and maturity</strong>, a{' '}
            <strong>measurability tier</strong>, and — for a stratified sample of eight — a{' '}
            <strong>progress indicator</strong>. Plus {s.n_new_gaps} proposed additions and two worked critical paths.
          </p>
          <p>
            Nothing here rewrites their data, ranks their gaps, or tells them they got something wrong. The additions
            live in separate tables; <code>engine/verify-additive.mjs</code> re-serialises their five baseline tables
            and diffs them against the hash-pinned {data.source.snapshot} snapshot on every commit, so &ldquo;additive
            only&rdquo; is a test rather than a promise. Their ids and slugs are preserved exactly, so the CSV joins
            straight back to their export.
          </p>
          <div className="statrow">
            <div className="stat">
              <div className="v">{s.n_gaps}</div>
              <div className="k">gaps labelled</div>
            </div>
            <div className="stat">
              <div className="v">{pct(audit.dimensions.measurability.weighted_disagreement)}</div>
              <div className="k">audit disagreement, tier</div>
            </div>
            <div className="stat">
              <div className="v">{s.n_indicators}</div>
              <div className="k">indicators, {s.n_indicator_nulls} honest nulls</div>
            </div>
            <div className="stat">
              <div className="v">{s.n_new_gaps}</div>
              <div className="k">proposed additions</div>
            </div>
            <div className="stat">
              <div className="v">2</div>
              <div className="k">worked critical paths</div>
            </div>
            <div className="stat">
              <div className="v">{mins} min</div>
              <div className="k">agent time, 0 human review</div>
            </div>
          </div>
          <p className="note" style={{ marginTop: 18 }}>
            Downloads: <a href="./gap-map-augmented.csv">gap-map-augmented.csv</a> (one row per gap, keyed on their id
            and slug) · <a href="./data.json">data.json</a> (everything this page renders)
          </p>
        </div>
      </header>

      <section>
        <div className="wrap">
          <p className="eyebrow">How to read it</p>
          <h2>Every added judgment carries a rationale and a confidence flag</h2>
          <p className="narrow">
            These are labels produced by a language model, not expert consensus. Two things make them worth reading
            anyway. Every one shows the reasoning that produced it, in the row rather than behind a tooltip. And every
            one that was uncertain is marked <span className="chip guess">guess</span> rather than smoothed over —{' '}
            {s.confidence.tier.guess ?? 0} of {s.n_gaps} tiers and {s.confidence.primary_ai_type.guess ?? 0} of{' '}
            {s.n_gaps} AI-type assignments are flagged. A run that produced no guesses would not be a confident run.
            It would be a dishonest one.
          </p>
          <div className="grid2" style={{ marginTop: 24 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Measurability tier</h3>
              <p style={{ fontSize: 14 }}>
                <strong>Directly measurable</strong> — an observable quantity exists and its direction of improvement
                is agreed. <strong>Proxy only</strong> — inputs or adjacent effects are measurable, the gap itself is
                not. <strong>Verification contested</strong> — a candidate observable exists but there is no agreement
                that it settles anything. <strong>Counterfactual required</strong> — the quantity of interest is
                something that did not happen.
              </p>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>AI capability type</h3>
              <p style={{ fontSize: 14 }}>
                Seven named values, no numeric scale: LLM reasoning and synthesis, ML surrogates and prediction, design
                and optimization search, sensing and signal processing, autonomous experimentation, physical build and
                manipulation, coordination and institutional. Each gap gets exactly one primary and any number of
                secondaries. Maturity is <em>Working now</em>, <em>2-5 years</em> or <em>Speculative</em>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">Findings</p>
          <h2>AI maturity tracks verifiability, not importance</h2>
          <p className="narrow">
            The share of each capability type&rsquo;s primary assignments that are already working now runs from{' '}
            {pct(workingNowShare[0] ? workingNowShare.find((r) => r.type === 'LLM reasoning and synthesis').now / workingNowShare.find((r) => r.type === 'LLM reasoning and synthesis').tot : 0)}{' '}
            for LLM reasoning and synthesis down to zero for physical build and manipulation. Not one gap in the entire
            map has physical build as a working-now primary: all{' '}
            {workingNowShare.find((r) => r.type === 'Physical build and manipulation')?.tot} sit at 2-5 years or
            speculative. Coordination and institutional manages{' '}
            {workingNowShare.find((r) => r.type === 'Coordination and institutional')?.now} of{' '}
            {workingNowShare.find((r) => r.type === 'Coordination and institutional')?.tot}. Where feedback is fast and
            objective, AI has arrived; where it is slow, contested or absent, it has not.
          </p>

          <div className="grid2" style={{ marginTop: 26 }}>
            <figure className="card">
              <h3 style={{ marginTop: 0 }}>Measurability tier</h3>
              <BarChart data={inOrder(s.tier, TIER_ORDER)} total={s.n_gaps} colorMap={TIER_COLOR} />
              <figcaption>All {s.n_gaps} gaps. Tiers in their own order, not sorted by count.</figcaption>
            </figure>
            <figure className="card">
              <h3 style={{ marginTop: 0 }}>Primary AI capability type</h3>
              <BarChart data={byCount(s.ai_type)} total={s.n_gaps} />
              <figcaption>
                One primary per gap. A single hue: the row label carries identity, so colour has no work to do.
              </figcaption>
            </figure>
          </div>

          <figure className="card" style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Maturity of the primary type, by type</h3>
            <StackedMaturity
              rows={byCount(s.ai_type).map(([t]) => [t, s.maturity_by_ai_type[t] ?? {}])}
            />
            <figcaption>
              Ordered ramp, light to dark, because maturity is ordered. Every segment carries its count, so the
              encoding never rests on colour alone.
            </figcaption>
          </figure>

          <figure className="card" style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Measurability tier against primary AI capability type</h3>
            <CrossTab crosstab={s.tier_by_ai_type} />
            <figcaption>
              Counts, one sequential hue. Design and optimization search is directly measurable in all{' '}
              {s.tier_by_ai_type['Design and optimization search']?.['Directly measurable']} of its cases; coordination
              and institutional is the only type with a counterfactual-required gap.
            </figcaption>
          </figure>

          <figure className="card" style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Measurability tier against field</h3>
            <CrossTab crosstab={s.tier_by_field} rowLabel="Field" />
          </figure>

          <h3>The expected finding, tested</h3>
          <p className="narrow">
            The prediction recorded before labelling was that LLM-shaped work would prove largely saturated and that
            most remaining gaps would be limited by physical build, fabrication or institutions.{' '}
            <strong>Confirmed, and by a sharper mechanism than expected.</strong> Physical build, institutional
            coordination and autonomous experimentation together take{' '}
            {(s.ai_type['Physical build and manipulation'] ?? 0) + (s.ai_type['Coordination and institutional'] ?? 0) + (s.ai_type['Autonomous experimentation'] ?? 0)}{' '}
            of {s.n_gaps} primaries, against {s.ai_type['LLM reasoning and synthesis']} for LLM reasoning. But the
            stronger result is not the count. It is the maturity gradient above: the constraint is not that few gaps
            are cognitive, it is that the non-cognitive categories never reach working-now at all.
          </p>

          <h3>A category that does not work, reported because it does not</h3>
          <p className="narrow">
            A second labeller, which never saw the original labels, independently relabelled a stratified sample of{' '}
            {audit.n_sampled} of {s.n_gaps} gaps. The sample deliberately oversamples the rare tiers, which biases the
            raw rate upward, so the population-weighted figure is the one that means anything.
          </p>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Stratum (original tier)</th>
                  <th className="num">Population</th>
                  <th className="num">Sampled</th>
                  <th className="num">Agreed</th>
                  <th className="num">Disagreement</th>
                </tr>
              </thead>
              <tbody>
                {audit.dimensions.measurability.strata.map((r) => (
                  <tr key={r.stratum}>
                    <td>{r.stratum}</td>
                    <td className="num">{r.population}</td>
                    <td className="num">{r.sampled}</td>
                    <td className="num">{r.agreed}</td>
                    <td className="num">{pct(r.disagreement)}</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Population-weighted</strong>
                  </td>
                  <td className="num">{s.n_gaps}</td>
                  <td className="num">{audit.dimensions.measurability.n}</td>
                  <td className="num">{audit.dimensions.measurability.agreed}</td>
                  <td className="num">
                    <strong>{pct(audit.dimensions.measurability.weighted_disagreement)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="narrow" style={{ marginTop: 14 }}>
            <strong>Proxy only cannot be applied reliably.</strong> It ran {pct(audit.dimensions.measurability.strata.find((r) => r.stratum === 'Proxy only').disagreement)}{' '}
            disagreement against 0% for directly measurable and{' '}
            {pct(audit.dimensions.measurability.strata.find((r) => r.stratum === 'Verification contested').disagreement)}{' '}
            for verification contested, and all three auditors independently reported it was repeatedly the nearest
            alternative and almost never won. Every Proxy only assignment has been downgraded to a guess, including the
            ones the auditor did not sample. The tiers that carry the argument are the two that held up. On primary AI
            capability type the raw sample disagreement was{' '}
            {pct(audit.dimensions.ai_type.raw_disagreement)}, and the audit surfaced three cases where the seven-type
            taxonomy has no right answer: closed-loop control of a physical system, gaps where AI is the object rather
            than the instrument, and composite gaps that bundle sub-problems needing different types and different
            tiers.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">The map</p>
          <h2>All {s.n_gaps} gaps, filterable, with the reasoning in the row</h2>
          <p className="narrow">
            Their gaps in their export order. Open any row to see the outcome, the AI capability type and maturity, the
            measurability tier, each one&rsquo;s rationale and confidence flag, and — where the sample covers it — the
            progress indicator. Proposed additions are marked and can be filtered out.
          </p>
          <div style={{ marginTop: 20 }}>
            <GapTable gaps={gaps} newGaps={newGaps} />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">Progress indicators</p>
          <h2>A sample of eight, and two of them are nulls</h2>
          <p className="narrow">
            <strong>This is a sample, not coverage, and it must not be extrapolated.</strong> Eight gaps were chosen
            across all four tiers so the set cannot be read as picking the easy ones. Every value was read off a page
            that was actually fetched, never off a search snippet; four verify against Crossref or arXiv, and the two
            that are only reachable are recorded as <em>unchecked</em> rather than as passes. The two nulls each have
            six logged, cached searches behind them and each names its closest near-miss.
          </p>
          <div className="scroll" style={{ marginTop: 18 }}>
            <table>
              <thead>
                <tr>
                  <th>Gap</th>
                  <th>Tier</th>
                  <th>Quantity</th>
                  <th className="num">Current</th>
                  <th>Target</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((i, n) => (
                  <tr key={n}>
                    <td style={{ maxWidth: 220 }}>{i.gap}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{i.tier}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 260 }}>
                      {i.quantity} {i.confidence === 'guess' && <span className="chip guess">guess</span>}
                    </td>
                    <td className="num">
                      {i.is_null_result ? (
                        <span className="chip newgap">honest null</span>
                      ) : (
                        <>
                          <strong>{i.current_value}</strong>{' '}
                          <span style={{ color: 'var(--muted)', fontSize: 12 }}>{i.unit}</span>
                        </>
                      )}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 180 }}>
                      {i.target_value ?? '—'}
                    </td>
                    <td style={{ fontSize: 13, maxWidth: 200 }}>
                      {i.source_url ? (
                        <>
                          <a href={i.source_url} target="_blank" rel="noreferrer">
                            {i.source_title}
                          </a>
                          <div>
                            <span className="chip">{i.source_checked}</span>
                          </div>
                        </>
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
              <div className="card" key={n} style={{ marginTop: 18 }}>
                <p className="eyebrow">Honest null · {i.gap}</p>
                <p style={{ fontSize: 14, marginBottom: 0 }}>{i.rationale}</p>
              </div>
            ))}
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">Proposed additions</p>
          <h2>{s.n_new_gaps} gaps, written in their house format, kept separate from theirs</h2>
          <p className="narrow">
            Each is 49–60 words, matching the corpus statistics of their own {s.n_gaps} descriptions (12–192 words,
            median 38). Each cleared a near-duplicate check over all {s.n_gaps} gaps and all {s.n_capabilities}{' '}
            capabilities, and a funding check against current programmes — two of which came back{' '}
            <em>not clear of funding</em>, and say so. Ids are prefixed <code>new-</code>; none is a Convergent-style
            UUID.
          </p>
          <div className="grid2" style={{ marginTop: 22 }}>
            {newGaps.map((n) => (
              <div className="card" key={n.id}>
                <p className="eyebrow">
                  {n.field} · proposed{' '}
                  {n.confidence === 'guess' && <span className="chip guess">guess</span>}
                </p>
                <h3 style={{ marginTop: 0, fontSize: 17 }}>{n.name}</h3>
                <p style={{ fontSize: 14 }}>{n.description}</p>
                <p className="note">
                  {n.tier} · {n.ai_type} · {n.maturity}
                </p>
                <details>
                  <summary style={{ cursor: 'pointer', fontSize: 13.5, color: 'var(--series-1)' }}>
                    Tests, dedup and funding checks
                  </summary>
                  <div className="why">
                    <div className="k">Outcome</div>
                    <div className="t">{n.outcome}</div>
                  </div>
                  <div className="why">
                    <div className="k">Productive tension test</div>
                    <div className="t">{n.tension_test}</div>
                  </div>
                  <div className="why">
                    <div className="k">Downstream unlock test</div>
                    <div className="t">{n.unlock_test}</div>
                  </div>
                  <div className="why">
                    <div className="k">Near-duplicate check</div>
                    <div className="t">{n.dedup_check}</div>
                  </div>
                  <div className="why">
                    <div className="k">Funding check</div>
                    <div className="t">{n.funding_check}</div>
                  </div>
                  <div className="why">
                    <div className="k">Why this label</div>
                    <div className="t">{n.rationale}</div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">Critical paths</p>
          <h2>Two worked chains, chosen so the results differ</h2>
          <p className="narrow">
            A critical path is the ordered sequence of steps whose duration sets the duration of the whole thing: one
            link sets the pace, so speeding up any other link changes nothing. Both expectations below were committed
            to git <em>before</em> the link analysis existed, in a separate commit, so the ordering is checkable rather
            than asserted. A single chain would show the method works; a pair shows it discriminates. Doing this across
            the whole map is the collaboration being proposed, not the thing being given away.
          </p>
          <div style={{ marginTop: 22 }}>
            {paths.map((p) => (
              <Chain key={p.id} path={p} mermaid={MERMAID[p.id]} />
            ))}
          </div>

          <div className="card" style={{ borderColor: 'var(--series-2)' }}>
            <p className="eyebrow">The intersection</p>
            <h3 style={{ marginTop: 0, fontSize: 19 }}>
              Two gaps in two different fields turn out to share a binding link
            </h3>
            <p style={{ fontSize: 15 }}>
              Chain 1&rsquo;s strategic ranking and funding authorisation links are an instance of chain 2&rsquo;s
              reviewer recruitment and judgment links. Facility approval and telescope time are both allocated by peer
              review of proposals: a decadal survey is a review panel, and so is a time allocation committee.
            </p>
            <p style={{ fontSize: 15 }}>
              The evidence is not an analogy. It is ESO&rsquo;s own stated reason for changing the mechanism.
              Introducing <strong>Distributed Peer Review</strong> — every PI submitting a qualifying proposal reviews
              ten others — ESO writes that panel load &ldquo;has become unsustainable&rdquo;, that classical triage
              &ldquo;has significantly degraded the quality of feedback for the triaged proposals&rdquo;, and that
              &ldquo;it has become progressively harder to find scientists willing to serve in the panels and in the
              OPC&rdquo;. Those are chain 2&rsquo;s links, written by an observatory about telescope time. DPR has run
              at ESO since Period 110, and at ALMA from Cycle 8, after Gemini&rsquo;s Fast Turnaround channel. That is
              a live natural experiment in review capacity under load, with a before and after, and as far as this
              search found nobody funds it as research.
            </p>
            <p style={{ fontSize: 15, marginBottom: 0 }}>
              A catalogue cannot show this. It has one row per gap and no place to record that two rows are blocked by
              the same thing. Chains can, and once you have chains the recurrence is countable rather than anecdotal.
              That is the argument for doing this across the whole map, and it is why there are exactly two chains
              here.
            </p>
            <details style={{ marginTop: 14 }}>
              <summary style={{ cursor: 'pointer', fontSize: 14 }}>Mermaid source for this diagram</summary>
              <pre
                style={{
                  fontSize: 12, overflowX: 'auto', background: 'var(--page)', padding: 12,
                  borderRadius: 8, border: '1px solid var(--border)',
                }}
              >
                {MERMAID.intersection}
              </pre>
            </details>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="eyebrow">Limitations</p>
          <h2>What is wrong with this, stated by us</h2>
          <div className="grid2" style={{ marginTop: 20 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Outcomes are not modelled as a proper entity</h3>
              <p style={{ fontSize: 14, marginBottom: 0 }}>
                An outcome is a text field on a gap. There are almost certainly more outcomes than gaps, and one
                capability can unlock outcomes across several fields. A future version should promote outcomes to a
                first-class entity with its own links. Resolving it here would have been a schema redesign, which lands
                badly from a stranger.
              </p>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>The indicators are a sample of eight</h3>
              <p style={{ fontSize: 14, marginBottom: 0 }}>
                Not coverage. Eight of {s.n_gaps}, deliberately spread across tiers. Nothing about the sample supports
                a statement about the other {s.n_gaps - 8}, and two of the eight are nulls.
              </p>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Every label is an AI judgment</h3>
              <p style={{ fontSize: 14, marginBottom: 0 }}>
                Not expert consensus. {mins} minutes of agent time and, at the time of writing,{' '}
                <strong>zero minutes of human review</strong>. The audit disagreement rate — {pct(audit.dimensions.measurability.weighted_disagreement)}{' '}
                population-weighted on tier, {pct(audit.dimensions.ai_type.raw_disagreement)} raw on AI type — is the
                honest measure of how much weight these labels bear.
              </p>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Capability edges are untyped upstream</h3>
              <p style={{ fontSize: 14, marginBottom: 0 }}>
                Nothing in the export marks a capability as necessary, sufficient or partial for its gap, so link
                semantics had to be reconstructed by hand — which is why there are two chains and not {s.n_gaps}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: 'none' }}>
        <div className="wrap">
          <p className="eyebrow">Method</p>
          <h2>How long it took, and what is checkable</h2>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Kind</th>
                  <th className="num">Units</th>
                  <th className="num">Elapsed</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r, n) => {
                  const el = r.ended_at
                    ? Math.round((new Date(`${r.ended_at.replace(' ', 'T')}Z`) - new Date(`${r.started_at.replace(' ', 'T')}Z`)) / 60000)
                    : null;
                  return (
                    <tr key={n}>
                      <td>{r.phase}</td>
                      <td>{r.kind}</td>
                      <td className="num">{r.n_units ?? '—'}</td>
                      <td className="num">{el === null ? 'open' : `${el} min`}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 13 }}>{r.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="narrow" style={{ marginTop: 16 }}>
            Agent time and human review time are tracked separately on purpose; a single blended number invites the
            obvious objection. Phase 0&rsquo;s start was never instrumented, so it counts as zero and every total is a
            lower bound.
          </p>
          <h3>The decision ledger</h3>
          <p className="narrow">
            {decisions.length} non-obvious calls, each with what was decided, why, what the runner-up was, and what
            would reverse it. They are here because the runner-up is usually the more flattering option.
          </p>
          <div>
            {decisions.map((d, n) => (
              <details className="gap" key={n}>
                <summary>
                  <div>
                    <div className="gapname">{d.decision}</div>
                    <div className="gapmeta">{d.phase}</div>
                  </div>
                  <span className="chip">{d.confidence}</span>
                </summary>
                <div className="gapbody">
                  <div className="why">
                    <div className="k">Why</div>
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
          <p className="note" style={{ marginTop: 28 }}>
            Built {data.generated_at} from the {data.source.snapshot} export of{' '}
            <a href={data.source.url} target="_blank" rel="noreferrer">
              gap-map.org
            </a>
            , which states of itself: &ldquo;This is not by any means a comprehensive survey or prioritized
            roadmap!&rdquo; Nothing on this page ranks anything.
          </p>
        </div>
      </section>
    </main>
  );
}
