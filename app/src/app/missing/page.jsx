import data from '../../../public/data.json';
import Nav from '../../components/Nav';

export const metadata = { title: "What this doesn't do yet" };

export default function MissingPage() {
  const { summary: s, audit_summary: audit, critical_paths: paths } = data;
  const nPaths = paths?.length ?? 0;
  const pct = (x) => `${Math.round(x * 100)}%`;
  // House style spells small numbers in prose. These come from data.json, so they have to
  // be spelled at render time rather than written into the copy.
  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const spell = (n) => WORDS[n] ?? String(n);
  const Spell = (n) => spell(n).replace(/^./, (c) => c.toUpperCase());

  const matEntries = Object.entries(s.maturity).sort((a, b) => b[1] - a[1]);
  const [topBucket, topN] = matEntries[0];

  const proxy = audit?.dimensions?.measurability?.strata?.find((r) => r.stratum === 'Proxy only');
  const direct = audit?.dimensions?.measurability?.strata?.find(
    (r) => r.stratum === 'Directly measurable'
  );

  const FIRST = [
    {
      n: 1,
      h: 'Critical paths across the whole map, not two',
      tag: 'cheapest of the three',
      body: (
        <>
          <p>
            There are {spell(nPaths)} chains here, built by hand, against {s.n_gaps} gaps. They
            exist to show something a catalogue structurally cannot &mdash; that two gaps in
            different fields can share one binding link, so bottlenecks recur across fields and can
            be counted. {Spell(nPaths)} chains prove the shape exists. They say nothing about where
            else it occurs.
          </p>
          <p>
            <strong>One thing blocks it.</strong> Capability edges are untyped. Nothing in the source
            data marks a capability as necessary, sufficient, or partial for the gap it hangs under,
            and a chain needs to know which links are load-bearing. Both existing chains had their
            link semantics reconstructed by hand, which is exactly why there are {spell(nPaths)}.
          </p>
          <div className="pull">
            <p>
              Type the {s.n_edges} capability edges. One pass, one column, no schema redesign &mdash;
              and chains stop being illustrations somebody authored and start being something the
              data yields.
            </p>
          </div>
        </>
      ),
    },
    {
      n: 2,
      h: 'A 5-10 year value, and splitting the two questions maturity conflates',
      tag: 'needs a full pass',
      body: (
        <>
          <p>
            Maturity has three values and the middle one is doing most of the work: {topN} of{' '}
            {s.n_gaps} gaps sit in <em>{topBucket}</em>. A bucket holding {pct(topN / s.n_gaps)} of
            the map is barely a label.
          </p>
          <p>
            <strong>And the three values are not on one axis.</strong> &ldquo;Speculative&rdquo;
            means no clear path from here, which is a claim about kind. &ldquo;2-5 years&rdquo; is a
            claim about time. A gap with a perfectly clear path that simply takes fifteen years has
            nowhere to go, and lands in the middle bucket next to things that are nearly here.
          </p>
          <p>
            Not fixed here, and the reason is not caution. Adding a fourth value means re-reviewing
            every gap already in the middle bucket, because a value nobody has applied to the whole
            set is worse than three honest ones &mdash; those rows would silently mean &ldquo;2-5 or
            5-10, unexamined&rdquo;. That is a full labelling pass with a blind second reader.
          </p>
          <div className="pull">
            <p>
              Probably two fields rather than one more bucket: <em>how long</em>, and{' '}
              <em>whether a path is known</em>. Different questions, currently answered at once.
            </p>
          </div>
        </>
      ),
    },
    {
      n: 3,
      h: 'Blocked on adoption, or blocked on capability',
      tag: 'the one real addition',
      body: (
        <>
          <p>
            Repairing the maturity dimension turned up eleven gaps where the reason the label is not
            &ldquo;working now&rdquo; has nothing to do with whether the technique exists.
            DNA-synthesis screening works and is not adopted. Web-scale archiving works and
            permission is withheld. Adaptive platform trials work, have run since 2010, and the
            field has not taken them up.
          </p>
          <p>
            <strong>Maturity absorbs all of that and reports it as not ready</strong> &mdash; and
            not ready sends a funder toward more research. For an unadopted capability that is the
            wrong intervention. The answer is procurement, a standard, a mandate, or somebody paying
            for a thing nobody is billed for.
          </p>
          <div className="pull">
            <p>
              One flag distinguishing the two would change what the map recommends for a fifth of
              its rows. It is the only item on this page that would add to the map rather than
              correct this contribution, and it needs its own definition, pass and audit.
            </p>
          </div>
        </>
      ),
    },
  ];

  const REST = [
    {
      h: 'Indicators as coverage, and as a series',
      what: `A sample of ${s.n_indicators} gaps across all four tiers, ${spell(s.n_indicator_nulls)} of them honest nulls, explicitly not to be extrapolated to the other ${s.n_gaps - s.n_indicators}.`,
      why: 'Coverage is the smaller half. A one-time reading says where a gap is; a funder needs the slope, and a slope needs the same quantity read off the same source on a schedule. That is a maintained system rather than a research output.',
    },
    {
      h: 'Three measurability tiers, not four',
      what: proxy
        ? `\u201cProxy only\u201d failed its own blind audit at ${pct(proxy.disagreement)} disagreement, against ${pct(direct?.disagreement ?? 0)} for directly measurable.`
        : '\u201cProxy only\u201d failed its own blind audit, against 0% for directly measurable.',
      why: 'Every auditor independently reported it was the nearest alternative and almost never the winner. A correction rather than an expansion, and the cheapest thing on this page.',
    },
    {
      h: 'Outcome sentences and progress indicators, built and withdrawn',
      what: 'A one-sentence outcome on every gap, and a progress indicator on eight of them. Both were built, both are in the CSV and JSON, neither is proposed.',
      why: 'The critical paths do the same two jobs better. A chain has to state the axis it runs on, which is what the outcome sentence was for, and it carries a sourced quantity on every step, which is what the indicator was for. Two attributes doing a job a third does better is a worse proposal than one, so they came out.',
    },
    {
      h: 'Decomposing composite gaps',
      what: 'Some gap statements bundle several unrelated research programmes under one heading, and one tier and one AI type cannot represent them.',
      why: 'Written up in full, with both patterns and a worked proposal. Not applied, because splitting them means authoring gap records Convergent did not write.',
    },
    {
      h: 'Urgency and impact, if they ever want them',
      what: 'There is no score column anywhere in this augmentation, by design.',
      why: 'Convergent deferred prioritisation deliberately and a stranger ranking their map would be presumptuous. But the reason to build a gap map is eventually to choose. Listed because refusing to build it was a decision, not an oversight, and because the call is theirs.',
    },
    {
      h: 'Coverage',
      what: `${s.n_gaps} gaps is not the field, and Convergent say so plainly.`,
      why: `The ${spell(s.n_new_gaps)} proposed gaps here demonstrate a method for adding one — near-duplicate checked against every existing gap and capability, funding-checked, written to their format. They are not a survey. This is the largest item here and the least suited to being done from outside.`,
    },
  ];

  return (
    <>
      <Nav here="missing/" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>What this doesn&rsquo;t do yet</h1>
            <p className="lead">
              Open work, not a roadmap and not a request. None of it is built. It is here so the
              limits of this contribution are legible, and so that if any of it is worth doing the
              case and the cost are already stated.
            </p>
            <p>
              Four of the nine come from this augmentation failing its own audit rather than from
              wishing it were bigger. That is the useful kind of future work, and it is why the two
              lists below are separated: the first three would add something, the rest mostly fix
              something. Ordered by what would add the most, not by what would be easiest.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The three worth doing first</h2>
          </div>
          {FIRST.map((f) => (
            <div key={f.n} className="card" style={{ marginTop: 18 }}>
              <div className="pad">
                <span className="tag">{f.tag}</span>
                <h3 style={{ marginTop: 10 }}>
                  {f.n}. {f.h}
                </h3>
                <div className="col">{f.body}</div>
              </div>
            </div>
          ))}
        </section>

        <section>
          <div className="col">
            <h2>The rest</h2>
            <p>
              Smaller, or already written up elsewhere, or larger than an attribute and properly
              theirs to decide.
            </p>
          </div>
          <div className="grid2" style={{ marginTop: 20 }}>
            {REST.map((r) => (
              <div key={r.h} className="card">
                <div className="pad">
                  <h3 style={{ margin: '0 0 8px' }}>{r.h}</h3>
                  <p style={{ marginBottom: 10 }}>{r.what}</p>
                  <p style={{ color: 'var(--ink-2)', marginBottom: 0 }}>{r.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What is deliberately not on this list</h2>
            <p>
              <strong>Anything that ranks.</strong> No numeric score column exists in the schema and
              adding one is not future work, it is a different project.
            </p>
            <p>
              <strong>Any redesign of the interface or the schema.</strong> Two of the items above
              imply new columns and say so. Proposing a redesign by shipping one is how a
              contribution turns into a rewrite of somebody else&rsquo;s map.
            </p>
          </div>
        </section>
      </main>
      <div className="footer">
        <div className="wrap col">
          <p style={{ color: 'var(--ink-3)' }}>
            David Sendor, <a href="mailto:david@sendorai.com">david@sendorai.com</a> ·{' '}
            <a href="../">The argument</a> · <a href="../method/">Method &amp; audit</a>
          </p>
        </div>
      </div>
    </>
  );
}
