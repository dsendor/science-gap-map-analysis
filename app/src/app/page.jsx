import data from '../../public/data.json';
import Nav from '../components/Nav';
import MaturityGradient from '../components/MaturityGradient';
import ChainMini from '../components/ChainMini';
import { MATURITY_ORDER } from '../lib/constants';

export default function Page() {
  const { summary: s, gaps, critical_paths: paths } = data;
  const workingNow = gaps.filter((g) => g.primary_maturity === 'Working now').length;
  const publishing = paths.find((p) => p.id === 'path-publishing-cost');
  const llm = s.maturity_by_ai_type['LLM reasoning and synthesis'] ?? {};
  const llmTot = MATURITY_ORDER.reduce((a, k) => a + (llm[k] ?? 0), 0);
  const buildTot = MATURITY_ORDER.reduce(
    (a, k) => a + ((s.maturity_by_ai_type['Physical build and manipulation'] ?? {})[k] ?? 0),
    0
  );

  return (
    <>
      <Nav here="" />
      <main className="wrap">
        <section>
          <div className="col">
            <h1>AI is accelerating science. The Gap Map should show where.</h1>
            <p className="lead">
              You put {s.n_gaps} R&amp;D gaps on one map and asked what needs building. I added four
              attributes to every one of them to see where AI has already arrived, then traced two
              gaps step by step to check that answer. The two methods disagree, and the disagreement
              is the useful part.
            </p>
            <p>
              What I would like is your feedback on whether these are the right attributes, and a
              conversation about what a version of the map built for the next few years should
              record. <a href="mailto:david@sendorai.com">david@sendorai.com</a>.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>The hypothesis</h2>
            <p>
              AI is very good at one slice of scientific work: reading, predicting, and searching a
              design space. As that slice gets cheap, whatever is left over starts to set the pace.
              Software went through this. Writing code got cheap and code review turned into the
              thing everybody complains about.
            </p>
            <p>
              Science looks similar with a harder remainder, because much of what is left is
              fabrication, funding, approval, and agreement. If that is right it changes what is
              worth building.
            </p>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I added</h2>
            <ul>
              <li>
                <strong>An outcome.</strong> What becomes knowable or buildable if this gap closes.
                Your names say what is in the way; this says what is on the other side, which is the
                version that recruits people. <a href="./map/">On the map</a>
              </li>
              <li>
                <strong>The kind of work in the way, and how mature the AI for it is.</strong> Seven
                kinds, five with an AI analogue and two without, each at working now, two-to-five
                years, or speculative. <a href="./map/">On the map</a>
              </li>
              <li>
                <strong>A measurability tier.</strong> Whether the gap has an agreed observable, only
                a proxy, a contested observable, or a quantity that is inherently counterfactual.{' '}
                <a href="./method/">How it was audited</a>
              </li>
              <li>
                <strong>A progress indicator</strong>, for eight gaps. The number you would watch to
                know whether the gap is closing. Six have one, two do not.{' '}
                <a href="./indicators/">All eight</a>
              </li>
              <li>
                <strong>Two worked critical paths</strong> and{' '}
                <strong>four proposed gaps</strong>. <a href="./chains/">Chains</a> ·{' '}
                <a href="./proposed/">Proposed gaps</a>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="col">
            <h2>What I found</h2>
            <p>
              {workingNow} of the {s.n_gaps} gaps have a primary blocker that current AI can already
              work on, and the arrival tracks how fast you can check an answer.
            </p>
          </div>

          <figure className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <MaturityGradient aiTypes={s.ai_type} maturityByType={s.maturity_by_ai_type} />
              <figcaption>
                For each kind of work, the share of the gaps it primarily blocks where the relevant AI
                capability already works. All {s.n_gaps} gaps, one primary kind each. This is a
                snapshot, not a trend: I did not label these gaps at any earlier date.
              </figcaption>
            </div>
          </figure>

          <div className="col">
            <p style={{ marginTop: 22 }}>
              {llm['Working now']} of the {llmTot} gaps blocked by reading and synthesis are served
              today. All {buildTot} blocked by physical build sit at two-to-five years or speculative.
            </p>

            <h3 style={{ marginTop: 34 }}>Then the chains disagree with the attributes</h3>
            <p>
              An attribute describes a gap from outside. A critical path describes it from the inside,
              by breaking the gap into the steps that have to happen and putting a duration or a cost
              on each. <strong>The step that sets the total is the binding one.</strong> Shorten a
              binding step and the total moves. Make any other step free and nothing happens.
            </p>
            <p>
              Take a gap where AI has visibly arrived:{' '}
              <em>Doing and publishing research is expensive and subject to structural roadblocks</em>.
              Reading and synthesis on it already works. Drafting and screening are done.
            </p>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="pad">
              <ChainMini path={publishing} />
              <figcaption style={{ marginTop: 14 }}>
                Cost, measured in reviewer and editor labour. Three of the seven steps set the total,
                and the two AI has taken over are not among them.
              </figcaption>
            </div>
          </div>

          <div className="col">
            <p style={{ marginTop: 22 }}>
              Three steps set the cost: finding reviewers, agreeing what a review means, and getting
              institutions to count the work. None is cognitive. And the step AI took over made one of
              them worse. Submissions rose 42% over five years in the one corpus where a journal has
              published full figures, and that load landed on reviewer recruitment, which was already
              binding.
            </p>
            <div className="pull">
              <p style={{ marginBottom: 0 }}>
                A gap can look partly solved from its attributes and stay blocked in practice. That is
                the argument for tracing gaps individually rather than scoring them, and it is what I
                would most like to work on with you.{' '}
                <a href="./chains/">Both chains, with the evidence →</a>
              </p>
            </div>
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
                <strong>Tell me which attributes are wrong.</strong> The seven kinds of work most of
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
              This is not comprehensive and some of it is wrong. It was built in a few days, mostly by
              AI, and no human has reviewed the labels. The disagreement rates from a blind second
              pass, the limitations, and the calls that could have gone the other way are on the{' '}
              <a href="./method/">method page</a>.
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
