import data from '../../public/data.json';
import Nav from '../components/Nav';
import { StackedMaturity } from '../components/Charts';
import ChainMini from '../components/ChainMini';

export default function Page() {
  const { summary: s, gaps, critical_paths: paths } = data;
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');
  const telescope = paths.find((p) => p.id === 'path-telescope-elapsed-time');

  // Every figure on this page is derived here from data.json, so a number cannot drift
  // out of step with the database by being retyped into prose.
  const llm = s.ai_type['Reading and synthesis'];
  const coord = s.ai_type['Coordination and institutions'];
  const workingNow = s.maturity['Working now'];
  const typeRows = Object.entries(s.maturity_by_ai_type).sort(
    (a, b) =>
      Object.values(b[1]).reduce((x, y) => x + y, 0) -
      Object.values(a[1]).reduce((x, y) => x + y, 0)
  );
  const tYears = telescope.links.reduce((a, l) => a + (l.duration_years ?? 0), 0);
  const tActs = telescope.links.filter((l) => l.ai_acts);
  const tActsYears = tActs.reduce((a, l) => a + (l.duration_years ?? 0), 0);

  return (
    <>
      <Nav here="" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>AI is accelerating science. The Gap Map should show where.</h1>
            <p className="lead">
              You put {s.n_gaps} R&amp;D gaps on one map and asked what needs building. I added four
              attributes to every one of them to see what kind of work is actually in the way, then
              decomposed two gaps into their steps to check whether a one-line label can be trusted.
              It can. What the labels show is that only {llm} of the {s.n_gaps} gaps are primarily
              waiting on the kind of work AI is best at today.
            </p>
            <p>
              What I would like is your feedback on whether these are the right attributes, and a
              conversation about what a version of the map built for the next few years should
              record. <a href="mailto:david@sendorai.com">david@sendorai.com</a>.
            </p>
            <p style={{ fontSize: 15.5, color: 'var(--ink-3)' }}>
              I spent 15+ years applying AI to hard problems in large organizations, most recently
              leading Enterprise Data Science at Liberty Mutual. I am moving into AI for science,
              working on where the binding constraint goes as AI dissolves the cognitive bottleneck.{' '}
              <a href="https://www.linkedin.com/in/dsendor/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What the map says once every gap is labelled</h2>
            <p>
              Reading and synthesis &mdash; the thing usually meant by AI for science &mdash; is the
              primary kind of work in the way for {llm} of your {s.n_gaps} gaps. The other{' '}
              {s.n_gaps - llm} are waiting on prediction and modeling, measurement and sensing, design
              search, coordination, running experiments, physical build and real-time control.
            </p>
            <p>
              {workingNow} of {s.n_gaps} gaps sit at a kind of work whose AI analogue works today.
              For the other {s.n_gaps - workingNow}, the capability that would move the gap is two to
              five years out, or speculative.
            </p>
          </div>

          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <StackedMaturity rows={typeRows} />
              <figcaption style={{ marginTop: 14 }}>
                Every gap&rsquo;s primary kind of work, and how mature the AI for it is. Bar length
                is a count of gaps, not an order of importance &mdash; nothing here ranks your map.
              </figcaption>
            </div>
          </figure>

          <div className="col">
            <div className="pull">
              <p>
                <strong>
                  Coordination and institutional work is the primary blocker for {coord} of your
                  gaps, and not one of them has an AI capability that works today.
                </strong>{' '}
                It is the only one of the eight kinds of work with nothing at all in the working-now
                column.
              </p>
              <p style={{ marginBottom: 0 }}>
                That is the shape worth arguing with: this map is not mostly waiting on the thing AI
                is currently best at.{' '}
                <a href="./map/">Every gap, with its labels</a> &middot;{' '}
                <a href="./method/">How the labels were made, and how far to trust them</a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What a one-line label compresses</h2>
            <p>
              An attribute is one line. A critical path breaks the gap into the steps that have to
              happen and puts a duration or a cost on each of them. Two gaps are traced that way.
            </p>
            <p>
              On <em>{telescope.gap_name}</em>, traced through JWST&rsquo;s published milestones, AI
              acts on {tActs.length} of the {telescope.links.length} steps. How many of the {tYears}{' '}
              years those three are is the part the chain cannot put one number on. As labelled they
              are {tActsYears}, leaving {tYears - tActsYears}. Two independent reviews then found
              corrections running in opposite directions &mdash; one moving years into the AI column,
              one moving seven years out of it &mdash; which puts the residual somewhere between
              about fifteen and about thirty.
            </p>
            <p>
              That is a weaker claim than a single number and a more defensible one. What neither
              reading disturbs is the shape: on every version of the arithmetic, most of the elapsed
              time of a frontier telescope sits in steps no current AI capability reaches.{' '}
              <a href="./chains/">The full chain, and both corrections</a>
            </p>
            <p>
              Take <em>Doing and publishing research is expensive and subject to structural
              roadblocks</em>, tracing the publishing half. The cost of doing the research is the
              other half, and it is most of what the rest of your map is about. My label for this gap
              says the work in the way is coordination and institutional.
              Seven steps later the trace agrees, and says where: the cost sits in finding reviewers,
              agreeing what a review means, and getting institutions to count the work. A one-line
              label predicted where a seven-step decomposition would land, which is the result I would
              want before adopting the attribute.
            </p>
            <p>
              The surprise is what happened to the saving. Drafting was one of the most expensive
              steps here, measured in researcher weeks per paper, and AI has taken a large share of
              that cost out. Publishing did not get cheaper. Submissions rose 42% after ChatGPT&rsquo;s
              release against the prior two-year window, in the one corpus where a journal has
              published full figures, and the labor the saving displaced landed downstream on
              volunteer editors at desk screening. Where AI reaches a step that carries cost, it
              reaches the tractable half: it can match a reviewer to a paper, and it cannot make that
              reviewer say yes.
            </p>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <ChainMini path={publishing} />
              <figcaption style={{ marginTop: 14 }}>
                Cost, in reviewer and editor labor. Orange marks where the labor concentrates. AI
                acts on the first four steps, but on steps 3 and 4 it reaches only the tractable
                half: matching a reviewer to a paper, not persuading them to say yes.
              </figcaption>
            </div>
          </div>

          <div className="col">
            <div className="pull">
              <p>
                The speedup is real and currently uncollectable. Relieving a step upstream of where
                the cost concentrates moves the cost along; it does not remove it.
              </p>
              <p style={{ marginBottom: 0 }}>
                That is what makes the remaining steps worth more than they used to be. Clearing
                reviewer recruitment now returns the recruitment saving <em>and</em> lets the drafting
                speedup finally show up. The more of a process AI accelerates, the more of that gain
                is waiting behind whatever it did not touch.{' '}
                <a href="./chains/">Both chains, with the evidence →</a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I added</h2>
            <p>
              Four attributes on all {s.n_gaps} gaps.{' '}
              <a href="./attributes/">What each one is, and where each one breaks</a>.
            </p>
            <ul>
              <li>
                <strong>An outcome.</strong> What becomes knowable or buildable if this gap closes.
                Your names say what is in the way; this says what is on the other side, which is the
                version that recruits people. <a href="./attributes/#outcome">How I wrote them</a>
              </li>
              <li>
                <strong>The kind of work in the way, and how mature the AI for it is.</strong> Eight
                kinds of work, each with an AI analogue and each at working now, two-to-five years,
                or speculative. Robotics is the analogue for physical build.{' '}
                <a href="./attributes/">What the eight are</a>
              </li>
              <li>
                <strong>A measurability tier.</strong> Whether the gap has an agreed observable, only
                a proxy, a contested observable, or a quantity that is inherently counterfactual. One
                of the four tiers failed its own audit. <a href="./attributes/">What the tiers are</a>
              </li>
              <li>
                <strong>A progress indicator</strong>, for eight gaps. The number you would watch to
                know whether the gap is closing. {s.n_indicators - s.n_indicator_nulls} have one,
                and for {s.n_indicator_nulls} a second searcher looked independently and also found
                nothing.{' '}
                <a href="./indicators/">All eight</a> · <a href="./attributes/">What it is for</a>
              </li>
              <li>
                <strong>Two worked critical paths</strong> and{' '}
                <strong>{s.n_new_gaps} proposed gaps</strong>, the two that survived an adversarial
                check that tried to find the funded programme already building them.{' '}
                <a href="./chains/">Chains</a> ·{' '}
                <a href="./proposed/">Proposed gaps</a>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I would like</h2>
            <p>
              Your About page says you are open to partners interested in meta analyses and new tools
              that make the data more actionable, and that you hope to add attributes for urgency and
              impact. That is what this is aiming at.
            </p>
            <ul>
              <li>
                <strong>Tell me which attributes are wrong.</strong> The kinds of work most of
                all. The audit already found three gap types it handles badly.
              </li>
              <li>
                <strong>Chains across the whole map.</strong> The value is in counting how often the
                same binding step recurs across fields, and that needs all {s.n_gaps}.
              </li>
              <li>
                <strong>Typed capability edges.</strong> Nothing marks a capability as necessary,
                sufficient, or partial for its gap, so the chains reconstructed that by hand. Typed
                edges would make chains generatable, and they lead straight to the urgency and impact
                attributes you already want.
              </li>
            </ul>
            <p>
              One thing worth knowing either way. <code>capabilities[].gaps</code> is empty for all{' '}
              {s.n_capabilities} capabilities in the v1.0 export, though <code>schema.json</code>{' '}
              documents it as populated. Anyone starting from <code>capabilities.json</code> builds an
              empty graph and gets no error.
            </p>
            <p className="lead">
              <a href="mailto:david@sendorai.com">david@sendorai.com</a>. The critical version of this
              feedback is the one I want most.
            </p>
            <p style={{ fontSize: 15.5, color: 'var(--ink-3)' }}>
              This is not comprehensive and some of it is wrong. Every label is an AI judgment, a
              second pass relabelled all {s.n_gaps} gaps blind and disagreed often enough to be worth
              publishing, and four independent reviews then went looking for errors in the numbers,
              the proposed gaps and the chains &mdash; and found them. The disagreement rates, the
              corrections, and the calls that could have gone the other way are on the{' '}
              <a href="./method/">method page</a>. What this still does not do is on{' '}
              <a href="./missing/">what&rsquo;s missing</a>.
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
            . Nothing here reorders or ranks your gaps, and your data is unmodified.{' '}
            <a href="./gap-map-augmented.csv">CSV, keyed on your ids and slugs</a> ·{' '}
            <a href="./data.json">JSON</a> · David Sendor,{' '}
            <a href="mailto:david@sendorai.com">david@sendorai.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
