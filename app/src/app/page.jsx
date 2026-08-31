import data from '../../public/data.json';
import Nav from '../components/Nav';
import ChainMini from '../components/ChainMini';
import { AiOnly, HumanChecked } from '../components/Reviewed';

export default function Page() {
  const { summary: s, gaps, critical_paths: paths } = data;
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');

  // Derived here rather than retyped into prose, so a number cannot drift out of step
  // with the database.
  const pubGap = gaps.find((g) => g.id === publishing.gap_id);
  const acts = publishing.links.filter((l) => l.ai_acts).length;
  const binding = publishing.links.filter((l) => l.is_binding).length;

  return (
    <>
      <Nav here="" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>AI is accelerating science. The Gap Map should show where.</h1>
            <p className="lead">
              You put {s.n_gaps} R&amp;D gaps on one map and asked what needs building. I added four
              attributes to every one of them &mdash; an outcome, the kind of work standing in the
              way, how mature the AI for that work is, and how measurable the gap is &mdash; and then
              took one gap apart step by step to see whether the attributes survive contact with it.
              They do, and the decomposition says something the one-line labels cannot.
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
            <h2>
              One gap, all the way down
              <HumanChecked />
            </h2>
            <p>
              <em>{publishing.gap_name}</em>. Four attributes, then seven steps. Everything in this
              section has been read against the gap by a person; nothing else on this site has.
            </p>

            <div className="pull">
              <p style={{ marginBottom: 6, fontSize: 15, color: 'var(--ink-3)' }}>
                The outcome we would add to your gap
              </p>
              <p style={{ marginBottom: 0, fontSize: 19 }}>
                <strong>{pubGap?.outcome}</strong>
              </p>
            </div>

            <p>
              Your gap names what is wrong. The outcome names what is on the other side, which is the
              version that recruits people to work on it. It also decides what to measure:{' '}
              <em>cheap</em> and <em>quick</em> are countable, and <em>accepted, verified</em> is the
              part arXiv has not solved in thirty-five years of driving the cost of dissemination to
              nothing.
            </p>
            <p>
              My one-line label says the work in the way is coordination and institutional. Seven
              steps later the trace agrees, and says where: the cost sits in finding reviewers,
              agreeing what a review means, and getting institutions to count the work. Those three
              were named in the label&rsquo;s rationale before the decomposition existed &mdash; with
              the caveat that the same author wrote both, so it is a consistency check and not an
              independent test.
            </p>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <ChainMini path={publishing} />
              <figcaption style={{ marginTop: 14 }}>
                Cost, in reviewer and editor labor. Orange marks where the labor concentrates. AI
                acts on {acts} of the {publishing.links.length} steps, and on steps 3 and 4 it
                reaches only the tractable half: matching a reviewer to a paper, not persuading them
                to say yes.
              </figcaption>
            </div>
          </div>

          <div className="col">
            <p>
              The surprise is what happened to the saving. Drafting was one of the most expensive
              steps here, measured in researcher weeks per paper, and AI has taken a large share of
              that cost out. Publishing did not get cheaper. Submissions rose 42% after ChatGPT&rsquo;s
              release against the prior two-year window, in the one corpus where a journal has
              published full figures, and the labor the saving displaced landed downstream on
              volunteer editors at desk screening.
            </p>

            <div className="pull">
              <p>
                The speedup is real and currently uncollectable. Relieving a step upstream of where
                the cost concentrates moves the cost along; it does not remove it.
              </p>
              <p style={{ marginBottom: 0 }}>
                That is what makes the remaining steps worth more than they used to be. Clearing
                reviewer recruitment now returns the recruitment saving <em>and</em> lets the drafting
                speedup finally show up. The more of a process AI accelerates, the more of that gain
                is waiting behind whatever it did not touch.
              </p>
            </div>

            <h3>Every step carries a measure, and they thin out as the steps get more binding</h3>
            <p>
              Each step has one published quantity attached, so the constraint can be watched moving
              rather than taken on trust. The first four have hard throughput numbers &mdash;
              submissions, desk-rejection rates, invitations per accepted review, committee
              disagreement. The {binding} binding steps are where the measurement thins, and the last
              of them, getting the work counted, has no direct quantity at all: only what
              institutions declare and how researchers behave. That asymmetry is worth as much as the
              decomposition.{' '}
              <a href="./chains/">The chain, its measures, and the evidence &rarr;</a>
            </p>
            <p>
              A second gap, <em>Frontier telescopes are expensive and take decades to build</em>, is
              traced the same way and lands somewhere different: there, none of your capabilities
              touches a decision step, and here half of them do.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The same four attributes, on the other {s.n_gaps - 1} gaps</h2>
            <p>
              One gap is a demonstration. The attributes are on all {s.n_gaps}, so the map can be
              queried by them. These have not been read by a person &mdash; each is a model&rsquo;s
              judgment, with a written rationale and a confidence flag on every row.
            </p>
            <ul>
              <li>
                <strong>An outcome, on all {s.n_gaps} gaps.</strong>
                <AiOnly />
                <br />
                What becomes knowable or buildable if the gap closes.{' '}
                <a href="./attributes/#outcome">How I wrote them</a>
              </li>
              <li>
                <strong>The kind of work in the way, and how mature the AI for it is.</strong>
                <AiOnly />
                <br />
                Eight kinds of work, each with an AI analogue, each at working now, two-to-five
                years, or speculative. <a href="./attributes/">What the eight are</a>
              </li>
              <li>
                <strong>A measurability tier.</strong>
                <AiOnly />
                <br />
                Whether the gap has an agreed observable, only a proxy, a contested observable, or a
                quantity that is inherently counterfactual.{' '}
                <a href="./attributes/">What the tiers are</a>
              </li>
              <li>
                <strong>A progress indicator, on {s.n_indicators} gaps.</strong>
                <AiOnly />
                <br />
                The number you would watch to know whether the gap is closing. For{' '}
                {s.n_indicator_nulls} of them a second search found nothing, and the null is recorded
                rather than dropped. <a href="./indicators/">All {s.n_indicators}</a>
              </li>
              <li>
                <strong>{s.n_new_gaps} proposed gaps</strong>, written in your house format.
                <AiOnly />
                <br />
                The two that survived an adversarial check that tried to find the funded programme
                already building them. <a href="./proposed/">Proposed gaps</a>
              </li>
            </ul>
            <p>
              <a href="./map/">Every gap, with its labels</a> &middot;{' '}
              <a href="./attributes/">What the attributes are, and how the map looks under them</a>
            </p>
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
                <strong>Tell me which attributes are wrong</strong>, the kinds of work most of all.
              </li>
              <li>
                <strong>Chains across the whole map.</strong> The value is in counting how often the
                same binding step recurs across fields, and that needs all {s.n_gaps}.
              </li>
              <li>
                <strong>Typed capability edges.</strong> Nothing marks a capability as necessary,
                sufficient, or partial for its gap, so the chain reconstructed that by hand. Typed
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
              This is not comprehensive and some of it is wrong. Every label outside the worked gap is
              an AI judgment, and a second pass relabelled all {s.n_gaps} blind and disagreed often
              enough to be worth publishing. The disagreement rates and the calls that could have gone
              the other way are on the <a href="./method/">method page</a>; what this still does not
              do is on <a href="./missing/">what&rsquo;s missing</a>.
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
            <a href="./gap-map-augmented.csv">CSV, keyed on your ids and slugs</a> &middot;{' '}
            <a href="./data.json">JSON</a> &middot; David Sendor,{' '}
            <a href="mailto:david@sendorai.com">david@sendorai.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
