import data from '../../public/data.json';
import Masthead from '../components/Masthead';
import MaturityGradient from '../components/MaturityGradient';
import { StackedMaturity } from '../components/Charts';
import Chain from '../components/Chain';
import { MATURITY_ORDER } from '../lib/constants';

const byCount = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);

export default function Page() {
  const { summary: s, gaps, new_gaps: newGaps, critical_paths: paths, audit_summary: audit } = data;

  const workingNow = byCount(s.ai_type).map(([type]) => {
    const m = s.maturity_by_ai_type[type] ?? {};
    const tot = MATURITY_ORDER.reduce((a, k) => a + (m[k] ?? 0), 0);
    return { type, now: m['Working now'] ?? 0, tot };
  });
  const nowTotal = workingNow.reduce((a, r) => a + r.now, 0);
  const llm = workingNow.find((r) => r.type === 'LLM reasoning and synthesis');
  const build = workingNow.find((r) => r.type === 'Physical build and manipulation');
  const coord = workingNow.find((r) => r.type === 'Coordination and institutional');
  const nonCognitive =
    (s.ai_type['Physical build and manipulation'] ?? 0) +
    (s.ai_type['Coordination and institutional'] ?? 0) +
    (s.ai_type['Autonomous experimentation'] ?? 0);

  const telescope = paths.find((p) => p.id === 'path-telescope-elapsed-time');
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');
  const indicators = gaps.flatMap((g) => g.indicators.map((i) => ({ ...i, gap: g.name, tier: g.tier })));
  const nulls = indicators.filter((i) => i.is_null_result);

  // Worked examples, picked because a reader of their map already knows these rows.
  const ex = (slug) => gaps.find((g) => g.slug === slug);
  const telescopeGap = ex('frontier-telescopes-are-expensive-and-take-decades-to-build');
  const fraudGap = ex('fraud-in-the-scientific-literature');

  return (
    <>
      <Masthead active="why" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>
              As AI clears the cognitive bottlenecks in science, the ones that are left get
              bigger
            </h1>
            <p className="lead">
              If that is right, then the gaps worth funding are shifting — and your map is the
              best description I have found of what is actually in the way. So rather than send
              you a suggestion, I spent a few days building a version of it with four attributes
              added, to see whether the idea survives contact with all 103 of your gaps.
            </p>
            <p>
              I&rsquo;m David Sendor. I&rsquo;ve been trying to work out where AI can most
              accelerate science, and I kept arriving at questions your team had already framed
              better than I had. This page is my attempt to answer the invitation on your About
              page, which says you are open to partners interested in meta analyses and new tools
              that make the data more actionable, and that you hope to introduce additional
              attributes in future. Here are four of them, applied to everything.
            </p>
            <p>
              <strong>What I&rsquo;d like:</strong> your feedback on whether the attributes are
              the right ones, and a conversation about whether a future version of the Gap Map
              should be built for a world where the cognitive work is cheap.{' '}
              <a href="mailto:david@sendorai.com">david@sendorai.com</a>.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The hypothesis</h2>
            <p>
              AI is getting very good at a particular slice of scientific work: reading,
              summarising, proposing, searching a design space, predicting a property. That slice
              is real and it is large. My working hypothesis is that clearing it does not make
              science uniformly faster — it makes whatever is left binding, and more visibly so.
            </p>
            <p>
              The clearest version I know is from software. Writing code got dramatically cheaper,
              and the result was not that teams shipped proportionally faster. It was that
              everyone started spending their time in code review, which is now the thing people
              complain about. The work moved to the step that had not been automated, and that
              step became the constraint.
            </p>
            <p>
              Science has the same shape and a harder version of it. Peer review is showing the
              same squeeze. But most of the remaining constraints in science are not cognitive at
              all — they are things that have to be fabricated, assembled, funded, approved, or
              agreed by a committee. Those do not get cheaper because a model got better at
              reading papers.
            </p>
            <p>
              If that holds, it has a funding consequence, which is why it seemed worth testing
              against your data rather than just asserting: <strong>the bottlenecks that AI does
              not touch become higher-leverage places to build, not lower.</strong> They are
              exactly the bridge-scale, coordinated, unglamorous things your FRO model exists to
              do.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I added</h2>
            <p>
              Four attributes, on all {s.n_gaps} of your gaps, kept in separate tables so nothing
              of yours is altered. Each one is a judgment, each one carries the reasoning that
              produced it, and each one can be argued with.
            </p>
            <ul>
              <li>
                <strong>An outcome:</strong> one sentence saying what becomes knowable or
                buildable if the gap closes. Your descriptions say what is in the way; this says
                what is on the other side.
              </li>
              <li>
                <strong>What kind of work is in the way, and how mature the AI for it is:</strong>{' '}
                seven named kinds of work — five with an AI analogue, two without — and whether the
                relevant capability is working now, two-to-five years out, or speculative. This is
                the attribute the hypothesis lives or dies on, and the one I would most like torn
                apart.
              </li>
              <li>
                <strong>A measurability tier:</strong> whether the gap has an agreed observable at
                all. Your own roadmapping criterion asks whether success is unambiguously
                measurable, and it turns out that quietly filters a lot.
              </li>
              <li>
                <strong>A progress indicator</strong>, for a sample of eight: the one number you
                would watch to know whether the gap is closing, with a real source.
              </li>
            </ul>
            <p>
              Then two things that are additions rather than attributes:{' '}
              <a href="#gaps">{s.n_new_gaps} proposed new gaps</a> written in your format, and{' '}
              <a href="#chains">two worked critical paths</a> — a gap decomposed into the ordered
              steps whose durations add up, so you can see which single step is setting the pace.
            </p>
            <div className="pull">
              <p>
                <strong>What I am not claiming.</strong> This is not comprehensive, and parts of
                it are probably wrong. It was produced quickly and mostly by AI, and no human has
                reviewed the labels yet — which is the honest state of it, and also somewhat the
                point: the reason I could offer you four attributes across 103 gaps instead of a
                suggestion that you add them is that this kind of work has become cheap. The
                disagreement rates and the confidence flags are published so you can see how much
                weight each label bears.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What your map says about the hypothesis</h2>
            <p>
              This is the part I would most like you to push back on, because it is the whole
              argument in one chart. For each kind of AI capability, the share of the gaps it is
              the primary lever for that are <em>already working today</em>:
            </p>
          </div>

          <figure className="card" style={{ marginTop: 22 }}>
            <div className="pad">
              <MaturityGradient aiTypes={s.ai_type} maturityByType={s.maturity_by_ai_type} />
              <figcaption>
                Share of the gaps each kind of work is the primary blocker for where the relevant AI
                capability is already working today. All {s.n_gaps} gaps, one primary each.
              </figcaption>
            </div>
          </figure>

          <div className="col">
            <p style={{ marginTop: 26 }}>
              The gradient runs from <strong>{Math.round((100 * llm.now) / llm.tot)}%</strong> for
              LLM reasoning and synthesis to <strong>zero</strong> for physical build and
              manipulation. Not one gap in your map has physical build as a working-now primary —
              all {build.tot} sit at two-to-five years or speculative. Coordination and institutional
              manages {coord.now} of {coord.tot}.
            </p>
            <p>
              That is the hypothesis, visible in your own data. Where the feedback loop is fast and
              the answer is checkable, AI has arrived. Where it is slow, contested, or a matter of
              what an institution agrees to do, it has not — and there is no sign it is about to.
              Across the whole map, {nowTotal} of {s.n_gaps} gaps ({Math.round((100 * nowTotal) / s.n_gaps)}%)
              have a primary capability that works today.
            </p>
            <div className="pull">
              <p>
                <strong>Three reasons to distrust this chart, in descending order.</strong>
              </p>
              <p>
                <strong>Maturity was never audited.</strong> The blind second pass covered the
                capability type, the tier and the outcome. It did not cover maturity — which is the
                axis this entire gradient is made of. That is a hole, and it is not visible from how
                thorough the audit section looks.
              </p>
              <p>
                <strong>The category carrying the most weight is the one I was least sure about.</strong>{' '}
                Gaps whose primary blocker is coordination and institutional carry a confidence flag
                on some dimension {Math.round((100 * 11) / 15)}% of the time ({11} of {coord.tot}),
                against {Math.round((100 * 5) / 17)}% for physical build. Most of that comes from the
                measurability tier rather than the capability label, but the argument leans hardest
                where the labelling is weakest.
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>Two of the seven categories are not AI capabilities at all.</strong>{' '}
                Coordination and institutional, and physical build and manipulation, are kinds of
                non-AI blocker. Calling the axis &ldquo;AI capability type&rdquo; and then listing
                two things AI does not do is a category error I would fix by renaming the axis to
                what it actually measures: what kind of work is in the way.
              </p>
            </div>
            <p style={{ fontSize: 15.5, color: 'var(--ink-3)' }}>
              The audit also found three gap types the seven categories handle badly: closed-loop
              control of a physical system, gaps where AI is the object rather than the instrument,
              and composite gaps that would need different categories for different sub-problems.
            </p>
          </div>
        </section>

        <section id="chains">
          <div className="col">
            <h2>Two worked critical paths</h2>
            <p>
              A catalogue tells you a gap exists. A critical path tells you which step inside it is
              setting the pace — and therefore which improvements would change nothing. I did two,
              picked to be as unalike as possible so the method has a chance to fail: a space
              telescope on elapsed time, and research publishing on reviewer labour cost.
            </p>
            <p>
              For each, I wrote down what I expected to find <em>before</em> doing the analysis and
              committed it separately, because a prediction confirmed afterwards is just a story.
            </p>
          </div>
          <div style={{ marginTop: 24 }}>
            <Chain path={telescope} />
            <Chain path={publishing} />
          </div>

          <div className="col">
            <h3>The part I did not expect</h3>
            <p>
              The two chains share a binding link, and I did not go looking for it.
            </p>
            <p>
              Telescope time and facility approval are both allocated by peer review of proposals —
              a decadal survey is a review panel, and so is a time allocation committee. So the
              telescope chain&rsquo;s ranking and funding steps are an instance of the publishing
              chain&rsquo;s reviewer-recruitment and judgment steps. That is not an analogy I am
              imposing. It is ESO&rsquo;s own account of why they changed the mechanism:
            </p>
            <blockquote>
              &ldquo;the load on the panels and the Observing Programmes Committee (OPC) members
              has become unsustainable&rdquo; … &ldquo;it has become progressively harder to find
              scientists willing to serve in the panels and in the OPC&rdquo;
              <cite>
                ESO, on introducing Distributed Peer Review, in which every PI submitting a
                qualifying proposal reviews ten others. Running since Period 110; at ALMA from
                Cycle 8; after Gemini&rsquo;s Fast Turnaround channel.
              </cite>
            </blockquote>
            <p>
              That is a live natural experiment in review capacity under load, at scale, with a
              before and after — and as far as I can find, nobody funds it as research.
            </p>
            <p>
              Two gaps in two different fields of your map, blocked by the same thing. Your export
              has one row per gap and nowhere to record that, which is not a criticism — it is the
              natural place for the map to extend, and it is the single thing I would most want to
              work on with you. Once gaps decompose into steps, a shared bottleneck stops being an
              anecdote and starts being something you can count across all {s.n_gaps}.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The other two attributes, and where they fail</h2>

            <h3>Outcomes</h3>
            <p>
              The cheapest of the four and possibly the most useful. Your telescope gap says
              building them is cost-prohibitive and slow. The outcome attribute says what that
              buys:
            </p>
            <blockquote>
              {telescopeGap?.outcome}
              <cite>Outcome recorded for &ldquo;{telescopeGap?.name}&rdquo;</cite>
            </blockquote>
            <p>
              One caveat I&rsquo;d flag rather than let you find: {s.confidence.outcome.confident} of{' '}
              {s.n_gaps} outcomes are marked confident and only{' '}
              {s.confidence.outcome.guess ?? 0} is flagged as a guess. For the most interpretive of
              the four attributes that is suspiciously tidy, and I&rsquo;d treat the outcome
              confidence flags as the least trustworthy thing on this page.
            </p>

            <h3>Measurability tiers, one of which does not work</h3>
            <p>
              Four tiers: <strong>directly measurable</strong> (an agreed observable and a
              direction), <strong>proxy only</strong>, <strong>verification contested</strong> (an
              observable exists, but no agreement it settles anything), and{' '}
              <strong>counterfactual required</strong> (the quantity of interest is something that
              did not happen). {s.tier['Directly measurable']} of your gaps land in the first tier;{' '}
              {s.tier['Counterfactual required']} in the last.
            </p>
            <p>
              A second labeller, which never saw the first set, relabelled a stratified{' '}
              {audit.n_sampled}-gap sample blind. Weighted to the population, it disagreed on{' '}
              {Math.round(100 * audit.dimensions.measurability.weighted_disagreement)}% of tiers and{' '}
              {Math.round(100 * audit.dimensions.ai_type.raw_disagreement)}% of AI-type assignments
              in the raw sample. But the useful result is narrower than that:{' '}
              <strong>&ldquo;proxy only&rdquo; cannot be applied reliably.</strong> It ran{' '}
              {Math.round(
                100 *
                  (audit.dimensions.measurability.strata.find((r) => r.stratum === 'Proxy only')
                    ?.disagreement ?? 0)
              )}
              % disagreement against 0% for directly measurable, and every auditor independently
              reported it was the nearest alternative and almost never the winner. If you adopt a
              measurability attribute, three tiers would be better than four.
            </p>
            <p className="note" style={{ fontSize: 15, color: 'var(--ink-3)' }}>
              Related, and worth knowing before you read any confidence flag: because every
              proxy-only tier was downgraded as a class, {s.confidence.tier.guess} of the tier flags
              are that rule and only{' '}
              {s.confidence.tier.guess - (s.tier['Proxy only'] ?? 0)} are independent judgments. No
              directly-measurable tier is flagged at all. The tier confidence flag is close to a
              synonym for &ldquo;proxy only&rdquo;, which is a weakness in how I assigned it rather
              than a property of the map.
            </p>

            <h3>Progress indicators, including two that came back empty</h3>
            <p>
              For eight gaps across all four tiers I went looking for the one number you would
              watch. Six have one. The JWST figure is the one I&rsquo;d put in a deck: STScI states
              that from conception to launch took <strong>32 years</strong>.
            </p>
            <p>
              Two came back with nothing, after six logged searches each, and those are the rows I
              think are most worth your time. For {nulls[0]?.gap.trim()}, there is a real published
              quantity that improves over time — and no agreement about what any particular value
              of it would settle, which is what that tier means. For{' '}
              {nulls[1]?.gap.trim().slice(0, 60)}…, the closest thing is the 42% of researcher time
              that goes to administration, which measures a symptom rather than the research the
              structure prevented.
            </p>
            <p>
              Eight is a sample, not coverage, and it should not be extrapolated to the other{' '}
              {s.n_gaps - 8}. What it does show is that an indicator attribute is buildable for
              tier-one gaps and honestly is not for tier-four ones — which is itself worth knowing
              before committing to build the column.
            </p>
            <p>
              <a href="./map/">
                Browse all {s.n_gaps} gaps with the four attributes, the cross-tabs, and the
                downloads →
              </a>
            </p>
          </div>
        </section>

        <section id="gaps">
          <div className="col">
            <h2>Four gaps I&rsquo;d propose</h2>
            <p>
              Written to your format — title-case declarative name, 30&ndash;60 words, no urgency
              language, no named vendors — and kept in a separate table so they are never mixed
              with yours. Each one was checked against all {s.n_gaps} of your gaps and all{' '}
              {s.n_capabilities} capabilities for near-duplicates, and against current programmes to
              make sure it is not already funded and under construction. Two of those funding checks
              came back &ldquo;not clear&rdquo;, and say so.
            </p>
          </div>
          <div className="grid2" style={{ marginTop: 22 }}>
            {newGaps.map((n) => (
              <div className="card" key={n.id}>
                <div className="pad">
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 11 }}>
                    <span className="tag on">{n.field}</span>
                    <span className="tag">{n.tier}</span>
                    {n.confidence === 'guess' && <span className="tag flag">guess</span>}
                  </div>
                  <h3 style={{ margin: '0 0 10px', fontSize: 19 }}>{n.name}</h3>
                  <p style={{ fontSize: 16, marginBottom: 0 }}>{n.description}</p>
                </div>
                <div className="pad">
                  <div className="why" style={{ margin: 0 }}>
                    <div className="k">Nearest thing already in your map</div>
                    <div className="t">{n.nearest}</div>
                  </div>
                  <details>
                    <summary>Both tests, the full dedup, and the funding check</summary>
                    <div className="body">
                      <div className="why">
                        <div className="k">Outcome</div>
                        <div className="t">{n.outcome}</div>
                      </div>
                      <div className="why">
                        <div className="k">Productive tension</div>
                        <div className="t">{n.tension_test}</div>
                      </div>
                      <div className="why">
                        <div className="k">Downstream unlock</div>
                        <div className="t">{n.unlock_test}</div>
                      </div>
                      <div className="why">
                        <div className="k">Near-duplicate check, in full</div>
                        <div className="t">{n.dedup_check}</div>
                      </div>
                      <div className="why">
                        <div className="k">Funding check</div>
                        <div className="t">{n.funding_check}</div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I&rsquo;d like to do next, with you</h2>
            <p>
              You wrote that you hope to introduce additional attributes to help orient users to
              the urgency or potential impact of solving particular gaps, and that you are open to
              partners interested in meta analyses and new tools that make the data more
              actionable. That is what this is, offered as a starting point rather than a finished
              proposal.
            </p>
            <ul>
              <li>
                <strong>Tell me which attributes are wrong.</strong> The capability taxonomy is the
                one I&rsquo;d most like torn apart — the audit already found three gap types it
                handles badly, and you have talked to far more scientists than I have.
              </li>
              <li>
                <strong>Chains across the whole map.</strong> Two is enough to show the method
                discriminates. The value is in counting how often the same bottleneck recurs across
                fields, and that needs all {s.n_gaps} — it is a week of compute and a lot of
                argument, and it is the thing I would most like to do together.
              </li>
              <li>
                <strong>Typed capability edges.</strong> Nothing in the export marks a capability as
                necessary, sufficient or partial for its gap, which is why the chains had to
                reconstruct link semantics by hand. Typed edges would make chains generatable rather
                than hand-built, and they connect directly to the urgency and impact attributes you
                already said you want.
              </li>
              <li>
                <strong>Outcomes as a real entity.</strong> I modelled an outcome as a text field on
                a gap, which is wrong — there are more outcomes than gaps and one capability unlocks
                outcomes across several fields. Fixing it is a schema change, and that lands badly
                arriving unsolicited from outside.
              </li>
            </ul>
            <p>
              One thing worth knowing regardless of whether any of this is useful:{' '}
              <strong>
                <code>capabilities[].gaps</code> is empty for all {s.n_capabilities} capabilities in
                the v1.0 export
              </strong>
              , though your <code>schema.json</code> documents it as populated. All {s.n_edges} edges
              live on the gap side only, so anyone starting from <code>capabilities.json</code>{' '}
              builds an empty graph and gets no error. Two capability records are also missing the{' '}
              <code>description</code> your schema marks required, and six resources are referenced
              by no capability.
            </p>
            <p className="lead" style={{ marginTop: 26 }}>
              <a href="mailto:david@sendorai.com">david@sendorai.com</a> — I&rsquo;d welcome the
              critical version of this feedback most of all.
            </p>
          </div>
        </section>
      </main>

      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            Built on the {data.source.snapshot} export of{' '}
            <a href={data.source.url} target="_blank" rel="noreferrer">
              gap-map.org
            </a>
            , which describes itself as &ldquo;not by any means a comprehensive survey or prioritized
            roadmap&rdquo;. Neither is this. Nothing here reorders or ranks their gaps, and their
            data is unmodified — the additions live in their own tables and the baseline is checked
            against a hash-pinned copy on every build.
          </p>
          <p style={{ color: 'var(--ink-3)' }}>
            <a href="./map/">The extended map, cross-tabs and method</a> ·{' '}
            <a href="./gap-map-augmented.csv">CSV, keyed on their ids and slugs</a> ·{' '}
            <a href="./data.json">JSON</a> · David Sendor,{' '}
            <a href="mailto:david@sendorai.com">david@sendorai.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
